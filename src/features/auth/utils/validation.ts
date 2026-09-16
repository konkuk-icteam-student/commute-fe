export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const VERIFICATION_CODE_PATTERN = /^\d{6}$/;

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email);

export const isValidVerificationCode = (code: string) =>
  VERIFICATION_CODE_PATTERN.test(code);

export const hasText = (value: string) => value.trim().length > 0;
