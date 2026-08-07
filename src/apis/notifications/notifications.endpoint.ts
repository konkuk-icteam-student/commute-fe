const BASE_URL = "/api/v1/notifications" as const;

export const NOTIFICATIONS_URL = {
  DEFAULT: BASE_URL,
  NEW: `${BASE_URL}/new`,
  CHECK: `${BASE_URL}/check`,
} as const;
