const BASE_URL = "/api/v1/work-change-requests" as const;

export const WORK_CHANGE_REQUESTS_URL = {
  HISTORY: `${BASE_URL}/history`,
} as const;
