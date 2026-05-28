import { getRequest, postRequest } from "../api/apiClient";

export const verifyCompanyNameAndPassword = ({ companyName, password }) => {
  return postRequest("/verify-by-company-name-and-password", {
    company_name: companyName,
    password,
  });
};

export const saveUserDetailsAndSendOtp = ({
  companyId,
  email,
  firstName,
  lastName,
}) => {
  return postRequest("/save-user-details-and-send-otp", {
    company_id: companyId,
    mail: email,
    fname: firstName,
    lname: lastName,
  });
};

export const sendOtpOnEmail = ({ email, firstName, lastName, companyId }) => {
  return postRequest("/send-otp", {
    email,
    firstName,
    lastName,
    company_id: companyId,
  });
};

export const verifyOtpForUserRegistration = ({ otp, token }) => {
  return postRequest("/verify-otp-for-user-registration", {
    otp,
    token,
  });
};

export const viewWellnessInterest = () => {
  return getRequest("/viewWellnessInterest");
};

export const getWellbeingPillars = (languageId = 1) => {
  return getRequest(`/get-wellbeing-pillars/${languageId}`);
};

export const completeUserRegistration = (registrationData) => {
  return postRequest("/user-registration", registrationData);
};
