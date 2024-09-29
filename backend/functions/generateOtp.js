export const generateRandomOTP = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
