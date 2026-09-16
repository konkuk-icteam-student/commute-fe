import { ApiError } from "@/apis/api-client";

const LOGIN_FAILED_MESSAGE = "이메일 또는 비밀번호를 확인해 주세요.";
const LOGIN_DEFAULT_ERROR_MESSAGE =
  "로그인에 실패했습니다. 다시 시도해 주세요.";

export const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (
      error.status === 400 ||
      error.status === 401 ||
      error.status === 403 ||
      error.code === "MISSING_ACCESS_TOKEN"
    ) {
      return LOGIN_FAILED_MESSAGE;
    }

    return LOGIN_DEFAULT_ERROR_MESSAGE;
  }

  return LOGIN_DEFAULT_ERROR_MESSAGE;
};
