export const validateCompanyPassword = (password) => {
  return {
    hasMinimumLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
};

export const isCompanyPasswordValid = (password) => {
  const rules = validateCompanyPassword(password);
  return rules.hasMinimumLength && rules.hasUppercase && rules.hasNumber;
};

export const isValidEmail = (email) => {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(
    email.trim()
  );
};

export const isValidPersonName = (name) => {
  return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name.trim());
};

export const sanitizeEmail = (email) => {
  return email.replace(/\s/g, "");
};

export const sanitizePersonName = (name) => {
  return name.replace(/[^A-Za-z ]/g, "").replace(/\s{2,}/g, " ");
};

export const sanitizeContactNumber = (contactNumber) => {
  return contactNumber.replace(/\D/g, "").slice(0, 15);
};

export const isValidOtp = (otp) => {
  return /^[0-9]{6}$/.test(otp);
};

export const isValidContactNumber = (contactNumber) => {
  return /^[0-9]{10,15}$/.test(contactNumber.trim());
};

export const isValidBirthdate = (birthdate) => {
  if (!birthdate) {
    return false;
  }

  const selectedDate = new Date(birthdate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate < today;
};
