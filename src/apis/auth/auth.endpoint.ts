const BASE_URL = "/api/auth" as const;

export const AUTH_URL = {
  LOGOUT: `${BASE_URL}/logout`,
} as const;
