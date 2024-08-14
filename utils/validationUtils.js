export const validateEmail = (email, formErrors) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const newErrors = { ...formErrors };
  if (!email.trim()) {
    newErrors.email = "Please enter your email address";
    return { newErrors, valid: false };
  }

  if (!emailRegex.test(email)) {
    newErrors.email = "Please enter a valid email address";
    return { newErrors, valid: false };
  }
  newErrors.email = "";
  return { newErrors, valid: true };
};

export const validatePassword = (password, formErrors) => {
  const newErrors = { ...formErrors };
  if (!password.trim()) {
    newErrors.password = "Please enter your password";
    return { newErrors, valid: false };
  }
  if (password.trim().length < 6) {
    newErrors.password = "Password should be at least 6 characters long";
    return { newErrors, valid: false };
  }
  newErrors.password = "";
  return { newErrors, valid: true };
};

export const validateConfirmPassword = (
  password,
  confirmPassword,
  formErrors,
  isSignIn,
) => {
  const newErrors = { ...formErrors };
  if (!isSignIn && password !== confirmPassword) {
    newErrors.confirmPassword = "Password doesn't match";
    newErrors.password = "Password doesn't match";
    return { newErrors, valid: false };
  }
  newErrors.confirmPassword = "";
  return { newErrors, valid: true };
};
