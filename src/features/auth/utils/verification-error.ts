const VERIFICATION_CODE_MISMATCH_MESSAGE = "인증번호가 일치하지 않습니다.";
const VERIFICATION_CODE_INVALID_MESSAGE = "인증번호가 올바르지 않습니다.";
const ALREADY_REGISTERED_EMAIL_MESSAGE = "이미 가입된 이메일입니다.";
const VERIFICATION_CODE_FALLBACK_MESSAGE =
  "인증번호 확인에 실패했습니다. 다시 시도해 주세요.";
const SEND_VERIFICATION_CODE_FALLBACK_MESSAGE =
  "인증번호 전송에 실패했습니다. 다시 시도해 주세요.";

export const getVerificationErrorMessage = (message?: string) => {
  if (message === VERIFICATION_CODE_MISMATCH_MESSAGE) {
    return VERIFICATION_CODE_INVALID_MESSAGE;
  }

  return VERIFICATION_CODE_FALLBACK_MESSAGE;
};

export const getSendVerificationCodeErrorMessage = (message?: string) => {
  if (message === ALREADY_REGISTERED_EMAIL_MESSAGE) {
    return ALREADY_REGISTERED_EMAIL_MESSAGE;
  }

  return SEND_VERIFICATION_CODE_FALLBACK_MESSAGE;
};
