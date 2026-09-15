const BASE_URL = "/api/auth" as const;

export const AUTH_URL = {
  LOGIN: `${BASE_URL}/login`,
  LOGOUT: `${BASE_URL}/logout`,
  REFRESH: `${BASE_URL}/refresh`,
  REGISTER: `${BASE_URL}/register`,
  SEND_VERIFICATION_CODE: `${BASE_URL}/send-verification-code`,
  VERIFY_CODE: `${BASE_URL}/verify-code`,
} as const;
