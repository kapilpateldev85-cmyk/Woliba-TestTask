const http = require("http");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");

const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, "db.json");
const ENV_PATH = path.join(__dirname, ".env");
const OTP_CODE = "123456";

const loadEnvFile = () => {
  if (!fs.existsSync(ENV_PATH)) {
    return;
  }

  const envFile = fs.readFileSync(ENV_PATH, "utf8");

  envFile.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  });
};

loadEnvFile();

const readDb = () => {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
};

const writeDb = (db) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(payload));
};

const readRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON body."));
      }
    });
  });
};

const createToken = () => {
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString("base64");
};

const createAuthToken = (userId) => {
  return Buffer.from(`user-${userId}-${Date.now()}`).toString("base64");
};

const createOtpCode = () => {
  if (process.env.USE_STATIC_OTP === "true") {
    return OTP_CODE;
  }

  return String(Math.floor(100000 + Math.random() * 900000));
};

const createMailTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS.replace(/\s+/g, ""),
    },
  });
};

const getMissingSmtpConfig = () => {
  return ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"].filter(
    (key) => !process.env[key]
  );
};

const sendOtpEmail = async ({ to, firstName, otp }) => {
  const transporter = createMailTransporter();

  if (!transporter) {
    console.log(
      `SMTP is not configured. OTP for ${to}: ${otp}`
    );
    return { sent: false, skipped: true };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const name = firstName || "there";

  await transporter.sendMail({
    from,
    to,
    subject: "Your Woliba verification OTP",
    text: `Hi ${name}, your Woliba OTP is ${otp}. It is valid for this registration session.`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #16465c; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Verify your Woliba registration</h2>
        <p>Hi ${name},</p>
        <p>Your OTP is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px; margin: 16px 0;">${otp}</p>
        <p>Use this code to continue your Woliba registration.</p>
      </div>
    `,
  });

  return { sent: true, skipped: false };
};

const saveOtpAndSendEmail = async ({ db, companyId, email, firstName, lastName }) => {
  const token = createToken();
  const otp = createOtpCode();
  const registration = {
    id: db.registrations.length + 1,
    company_id: companyId || null,
    mail: email,
    fname: firstName || "",
    lname: lastName || "",
    otp,
    token,
    verified: false,
    created_at: new Date().toISOString(),
  };

  db.registrations.push(registration);
  writeDb(db);

  try {
    await sendOtpEmail({
      to: email,
      firstName,
      otp,
    });
  } catch (error) {
    console.error("OTP email send failed:", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      message: error.message,
    });

    db.registrations = db.registrations.filter((item) => item.token !== token);
    writeDb(db);

    throw error;
  }

  return { token };
};

const getApiPath = (url) => {
  const pathname = new URL(url, "http://localhost").pathname;
  return pathname.startsWith("/v1/") ? pathname.slice(3) : pathname;
};

const server = http.createServer(async (req, res) => {
  const apiPath = getApiPath(req.url);

  if (req.method === "OPTIONS") {
    return sendJson(res, 200, {});
  }

  if (req.method === "GET") {
    const db = readDb();

    if (apiPath === "/viewWellnessInterest") {
      return sendJson(res, 200, {
        status: true,
        data: db.wellnessInterests || [],
      });
    }

    if (apiPath.startsWith("/get-wellbeing-pillars")) {
      return sendJson(res, 200, {
        status: true,
        data: db.wellbeingPillars || [],
      });
    }

    return sendJson(res, 404, {
      status: "error",
      message: "Endpoint not found.",
    });
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, {
      status: "error",
      message: "Only GET and POST requests are supported.",
    });
  }

  try {
    const body = await readRequestBody(req);
    const db = readDb();

    if (apiPath === "/verify-by-company-name-and-password") {
      const company = db.companies.find((item) => {
        return (
          item.company_name.toLowerCase() ===
            String(body.company_name || "").toLowerCase() &&
          item.password === body.password
        );
      });

      if (!company) {
        return sendJson(res, 401, {
          status: "error",
          message: "Invalid company name or password.",
        });
      }

      return sendJson(res, 200, {
        status: "success",
        data: [company],
      });
    }

    if (apiPath === "/save-user-details-and-send-otp") {
      const company = db.companies.find((item) => item.id === body.company_id);

      if (!company) {
        return sendJson(res, 404, {
          status: "error",
          message: "Company not found.",
        });
      }

      try {
        const { token } = await saveOtpAndSendEmail({
          db,
          companyId: body.company_id,
          email: body.mail,
          firstName: body.fname,
          lastName: body.lname,
        });

        return sendJson(res, 200, {
          status: "success",
          data: {
            message: "OTP sent successfully! Please check your email for OTP.",
            token,
          },
        });
      } catch (error) {
        console.log(error)
        return sendJson(res, 500, {
          status: "error",
          message: "Unable to send OTP email. Please try again1.",
        });
      }
    }

    if (apiPath === "/send-otp" || apiPath === "/send-otp-mail") {
      const email = String(body.email || body.mail || "").trim();

      if (!email) {
        return sendJson(res, 400, {
          status: "error",
          message: "Email is required.",
        });
      }

      try {
        const { token } = await saveOtpAndSendEmail({
          db,
          companyId: body.company_id,
          email,
          firstName: body.firstName || body.fname,
          lastName: body.lastName || body.lname,
        });

        return sendJson(res, 200, {
          status: "success",
          data: {
            message: "OTP sent successfully! Please check your email for OTP.",
            token,
          },
        });
      } catch (error) {
        console.log(error)
        return sendJson(res, 500, {
          status: "error",
          message: "Unable to send OTP email. Please try again2.",
        });
      }
    }

    if (apiPath === "/verify-otp-for-user-registration") {
      const registration = db.registrations.find((item) => {
        return item.token === body.token;
      });

      if (!registration) {
        return sendJson(res, 404, {
          status: "error",
          message: "Registration token not found.",
        });
      }

      if (registration.otp !== body.otp) {
        return sendJson(res, 400, {
          status: "error",
          message: "Invalid OTP.",
        });
      }

      registration.verified = true;
      registration.verified_at = new Date().toISOString();
      writeDb(db);

      return sendJson(res, 200, {
        status: true,
        data: "OTP verified successfully!",
      });
    }

    if (apiPath === "/user-registration") {
      const registration = db.registrations.find((item) => {
        return item.token === body.token;
      });

      if (!registration) {
        return sendJson(res, 404, {
          status: "error",
          message: "Registration token not found.",
        });
      }

      if (!registration.verified) {
        return sendJson(res, 400, {
          status: "error",
          message: "Please verify OTP before completing registration.",
        });
      }

      if (!Array.isArray(body.areas_of_interest) || body.areas_of_interest.length === 0) {
        return sendJson(res, 400, {
          status: "error",
          message: "Select at least one wellness interest.",
        });
      }

      if (
        !Array.isArray(body.wellbeing_pillars) ||
        body.wellbeing_pillars.length !== 3
      ) {
        return sendJson(res, 400, {
          status: "error",
          message: "Select exactly 3 wellbeing pillars.",
        });
      }

      if (!body.accepted_privacy_policy) {
        return sendJson(res, 400, {
          status: "error",
          message: "Privacy policy acceptance is required.",
        });
      }

      db.users = db.users || [];
      const existingUser = db.users.find((item) => item.mail === registration.mail);

      if (existingUser) {
        return sendJson(res, 200, {
          status: true,
          message: "Registration completed successfully.",
          data: {
            token: createAuthToken(existingUser.id),
            user: existingUser,
          },
        });
      }

      const user = {
        id: db.users.length + 1,
        company_id: registration.company_id,
        mail: registration.mail,
        fname: body.fname,
        lname: body.lname,
        time_zone: body.time_zone,
        areas_of_interest: body.areas_of_interest,
        wellbeing_pillars: body.wellbeing_pillars,
        accepted_privacy_policy: body.accepted_privacy_policy,
        birthday: body.birthday,
        phone_number: body.phone_number,
        user_type: body.user_type,
        gender: body.gender,
        profile_image: body.profile_image,
        language_id: body.language_id,
        smoke: body.smoke,
        exercise_day_per_week: body.exercise_day_per_week,
        average_sleep_per_night: body.average_sleep_per_night,
        average_water_intake: body.average_water_intake,
        pain_experience: body.pain_experience,
        prescription_intake: body.prescription_intake,
        physical_exam_frequency: body.physical_exam_frequency,
        created_at: new Date().toISOString(),
      };
      const authToken = createAuthToken(user.id);

      db.users.push(user);
      registration.completed = true;
      registration.completed_at = new Date().toISOString();
      writeDb(db);

      return sendJson(res, 200, {
        status: true,
        message: "Registration completed successfully.",
        data: {
          token: authToken,
          user,
        },
      });
    }

    return sendJson(res, 404, {
      status: "error",
      message: "Endpoint not found.",
    });
  } catch (error) {
    return sendJson(res, 400, {
      status: "error",
      message: error.message || "Bad request.",
    });
  }
});

server.listen(PORT, () => {
  console.log(`JSON server backend running at http://localhost:${PORT}`);
  console.log("Use company Woliba and password Woliba@123!");
  console.log(`Mock OTP code is ${OTP_CODE}`);

  const missingSmtpConfig = getMissingSmtpConfig();

  if (missingSmtpConfig.length) {
    console.log(
      `SMTP email is disabled. Missing: ${missingSmtpConfig.join(", ")}`
    );
    console.log("Create frontend/backend/.env from frontend/backend/.env.example to send OTP emails.");
  } else {
    console.log(`SMTP email is enabled for ${process.env.SMTP_USER}`);

    const normalizedPasswordLength = process.env.SMTP_PASS.replace(/\s+/g, "").length;

    if (
      process.env.SMTP_HOST.includes("gmail") &&
      normalizedPasswordLength !== 16
    ) {
      console.log(
        `Warning: Gmail app passwords are normally 16 characters. Current SMTP_PASS length is ${normalizedPasswordLength}.`
      );
    }
  }
});
