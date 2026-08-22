// 로그인 후 로컬 스토리지에 남는 값들. 토큰 외에 권한·표시 이름·만료 시각도 함께 관리한다.
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ROLE_CODE_KEY = "roleCode";
const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";
const USER_NAME_KEY = "userName";

const AUTH_STORAGE_KEYS = [
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ROLE_CODE_KEY,
  TOKEN_EXPIRES_AT_KEY,
  USER_NAME_KEY,
] as const;

// RL01은 학생, RL02는 관리자다. 접근 가능한 화면이 서로 갈린다.
export const ROLE_CODE = {
  STUDENT: "RL01",
  ADMIN: "RL02",
} as const;

export type RoleCode = (typeof ROLE_CODE)[keyof typeof ROLE_CODE];

const isRoleCode = (value: string | null): value is RoleCode =>
  value === ROLE_CODE.STUDENT || value === ROLE_CODE.ADMIN;

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  roleCode: RoleCode;
  // 스토리지에는 문자열로 들어간다. 숫자로 받아도 그대로 문자열로 바꿔 넣는다.
  tokenExpiresAt: string | number;
  userName: string;
}

const getStorage = (): Storage | null =>
  typeof window === "undefined" ? null : window.localStorage;

export const getAccessToken = () =>
  getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;

export const getRefreshToken = () =>
  getStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;

// 저장된 값이 아는 권한 코드가 아니면 없는 것으로 본다. 모르는 값으로 화면을 열어 주지 않는다.
export const getRoleCode = (): RoleCode | null => {
  const roleCode = getStorage()?.getItem(ROLE_CODE_KEY) ?? null;

  return isRoleCode(roleCode) ? roleCode : null;
};

// 서버가 숫자로 주는지 문자열로 주는지 아직 확정되지 않았다.
// 형식을 정하지 않고 저장된 그대로 돌려준다. 해석은 쓰는 쪽에서 한다.
export const getTokenExpiresAt = () =>
  getStorage()?.getItem(TOKEN_EXPIRES_AT_KEY) ?? null;

export const getUserName = () => getStorage()?.getItem(USER_NAME_KEY) ?? null;

export const setAccessToken = (accessToken: string) => {
  getStorage()?.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const setRefreshToken = (refreshToken: string) => {
  getStorage()?.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// 서버가 준 값을 그대로 넣는다. 아는 코드인지는 getRoleCode가 읽을 때 가린다.
export const setRoleCode = (roleCode: string) => {
  getStorage()?.setItem(ROLE_CODE_KEY, roleCode);
};

export const setTokenExpiresAt = (tokenExpiresAt: string | number) => {
  getStorage()?.setItem(TOKEN_EXPIRES_AT_KEY, String(tokenExpiresAt));
};

// 로그인 직후처럼 한 번에 채워 넣을 때 쓴다.
export const setAuthSession = ({
  accessToken,
  refreshToken,
  roleCode,
  tokenExpiresAt,
  userName,
}: AuthSession) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  storage.setItem(ROLE_CODE_KEY, roleCode);
  storage.setItem(TOKEN_EXPIRES_AT_KEY, String(tokenExpiresAt));
  storage.setItem(USER_NAME_KEY, userName);
};

// 로그아웃과 재발급 실패에서 쓴다. 권한 코드가 남으면 다음 사용자에게 그대로 보이므로 함께 지운다.
export const deleteAuthToken = () => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  AUTH_STORAGE_KEYS.forEach((key) => {
    storage.removeItem(key);
  });
};
