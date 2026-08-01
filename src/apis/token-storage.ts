const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const getStorage = (): Storage | null =>
  typeof window === "undefined" ? null : window.localStorage;

export const getAccessToken = () =>
  getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;

export const getRefreshToken = () =>
  getStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;

export const deleteAuthToken = () => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
};
