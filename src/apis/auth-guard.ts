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
// 학생이 관리자 화면을, 관리자가 학생 화면을 열었을 때 서버가 내려준다.
export const FORBIDDEN_HTTP_STATUS = 403;

// 로그인 화면은 이 앱(basePath /commute) 밖의 사이트 루트에 있다.
// 그래서 next/navigation이 아니라 window.location으로 보낸다.
export const LOGIN_PATH = "/";

export const isAuthError = ({ status }: AuthErrorCandidate) =>
  status === AUTH_ERROR_HTTP_STATUS;

export const isForbiddenError = ({ status }: AuthErrorCandidate) =>
  status === FORBIDDEN_HTTP_STATUS;

// 인증이 끊긴 시점에 바로 지운다. 아직 날아가지 않은 요청이 낡은 토큰을 쓰지 않게 한다.
export const clearAuth = () => {
  try {
    deleteAuthToken();
  } catch (error) {
    console.error("[auth] token delete failed", error);
  }
};

export const redirectToLogin = () => {
  // 서버 렌더링 중이거나 location이 없는 환경(테스트 등)에서는 이동시키지 않는다.
  if (typeof window === "undefined" || !window.location) {
    return;
  }

  // 만료된 화면으로 뒤로가기 하지 못하도록 히스토리를 남기지 않는다.
  window.location.replace(LOGIN_PATH);
};
