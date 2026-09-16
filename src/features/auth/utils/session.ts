import {
  deleteAuthToken,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresAt,
} from "@/apis/token-storage";

export const normalizeExpiresAt = (expiresAt: string) => {
  const numericExpiresAt = Number(expiresAt);

  if (Number.isFinite(numericExpiresAt)) {
    // 서버가 초 단위 epoch를 주는 경우를 밀리초로 맞춘다.
    return numericExpiresAt < 10_000_000_000
      ? numericExpiresAt * 1000
      : numericExpiresAt;
  }

  const dateExpiresAt = Date.parse(expiresAt);

  return Number.isNaN(dateExpiresAt) ? null : dateExpiresAt;
};

export const hasUsableStoredSession = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken && !refreshToken) {
    return false;
  }

  const expiresAt = getTokenExpiresAt();

  if (!expiresAt) {
    return true;
  }

  const expiresAtTime = normalizeExpiresAt(expiresAt);

  if (expiresAtTime === null) {
    deleteAuthToken();
    return false;
  }

  const isExpired = expiresAtTime <= Date.now();

  if (isExpired) {
    deleteAuthToken();
  }

  return !isExpired;
};
