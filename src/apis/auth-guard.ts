import { deleteAuthToken } from "./token-storage";

type AuthErrorCandidate = {
  status?: number;
};

export class AuthRequiredError extends Error {
  constructor() {
    super("Authentication token is required.");
    this.name = "AuthRequiredError";
  }
}

// TODO: 특정 토큰 만료 에러 코드가 있다면 해당 부분도 추가
export const AUTH_ERROR_HTTP_STATUS = 401;

export const isAuthError = ({ status }: AuthErrorCandidate) =>
  status === AUTH_ERROR_HTTP_STATUS;

export const clearAuthAndRedirectToLogin = () => {
  try {
    deleteAuthToken();
  } catch (error) {
    console.error("[auth] token delete failed", error);
  }

  // TODO: 추후 적용
  // window.location.replace("/");
};
