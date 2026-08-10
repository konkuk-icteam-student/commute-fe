const BASE_URL = "/api/v1/home" as const;

export const HOME_URL = {
  TODAY: `${BASE_URL}/today`,
  CHECK_IN: `${BASE_URL}/check-in`,
} as const;
