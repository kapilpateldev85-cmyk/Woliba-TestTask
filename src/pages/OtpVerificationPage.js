import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import RegistrationLayout from "../components/RegistrationLayout";
import {
  clearOtpStatus,
  saveUserDetails,
  verifyOtp,
} from "../redux/registrationSlice";
import { isValidOtp } from "../utils/validation";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 180;

const formatTimer = (seconds) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

function OtpVerificationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const { otpToken, userDetails, userStep, otpStep } = useSelector(
    (state) => state.registration
  );
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [touched, setTouched] = useState(false);
  const otp = otpValues.join("");
  const canSubmit = isValidOtp(otp) && !otpStep.loading;
  const canResend = timer === 0 && !userStep.loading;

  useEffect(() => {
    dispatch(clearOtpStatus());
  }, [otp, dispatch]);

  useEffect(() => {
    if (timer === 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      setTimer((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (userStep.success) {
      setTimer(RESEND_SECONDS);
    }
  }, [userStep.success]);

  useEffect(() => {
    if (otpStep.success) {
      const timerId = setTimeout(() => {
        navigate("/registration/login-credentials");
      }, 600);

      return () => clearTimeout(timerId);
    }
  }, [otpStep.success, navigate]);

  if (!otpToken || !userDetails) {
    return <Navigate to="/registration/user-details" replace />;
  }

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextValues = [...otpValues];
    nextValues[index] = digit;
    setOtpValues(nextValues);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedOtp) {
      return;
    }

    const nextValues = Array(OTP_LENGTH).fill("");
    pastedOtp.split("").forEach((digit, index) => {
      nextValues[index] = digit;
    });
    setOtpValues(nextValues);
    inputsRef.current[Math.min(pastedOtp.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);

    if (!canSubmit) {
      return;
    }

    dispatch(verifyOtp({ otp, token: otpToken }));
  };

  const handleResend = () => {
    if (!canResend) {
      return;
    }

    dispatch(saveUserDetails(userDetails));
  };

  return (
    <RegistrationLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[430px] rounded-lg border border-gray-100 bg-white/95 px-5 py-5 shadow-form sm:px-6"
      >
        <h1 className="mb-2 text-center text-2xl font-semibold text-woliba-navy">
          Input verification code
        </h1>
        <p className="mb-5 text-center text-xs text-gray-500">
          We&apos;ve sent a 6-digit OTP to your work email. Please enter it below to continue.
        </p>

        <div className="flex justify-center gap-2">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={value}
              onChange={(event) => handleOtpChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              className={`h-9 w-9 border bg-white text-center text-base font-semibold text-woliba-navy outline-none transition focus:border-woliba-coral ${
                touched && !isValidOtp(otp) ? "border-woliba-coral" : "border-gray-300"
              }`}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {touched && !isValidOtp(otp) && (
          <p className="mt-2 text-center text-[11px] text-woliba-coral">
            Enter a valid 6-digit OTP.
          </p>
        )}

        {otpStep.error && (
          <p className="mt-4 border border-red-100 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {otpStep.error}
          </p>
        )}

        {userStep.error && (
          <p className="mt-4 border border-red-100 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {userStep.error}
          </p>
        )}

        {otpStep.success && (
          <p className="mt-4 border border-green-100 bg-green-50 px-3 py-2 text-center text-xs text-green-700">
            {otpStep.message}
          </p>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className="text-xs font-medium text-woliba-navy disabled:cursor-not-allowed disabled:text-woliba-navy"
          >
            {userStep.loading
              ? "Sending OTP..."
              : timer > 0
              ? `Resend OTP in ${formatTimer(timer)}`
              : "Resend OTP"}
          </button>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/registration/user-details")}
              className="h-9 w-28 border border-woliba-coral bg-white text-xs font-medium text-woliba-coral transition hover:bg-woliba-soft"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="h-9 w-28 bg-woliba-coral text-xs font-medium text-white transition hover:bg-[#cf5e69] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              {otpStep.loading ? "Verifying..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </RegistrationLayout>
  );
}

export default OtpVerificationPage;
