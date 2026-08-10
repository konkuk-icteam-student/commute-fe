const BASE_URL = "/api/v1/admin/home" as const;

export const ADMIN_HOME_URL = {
  ATTENDANCE_SUMMARY: `${BASE_URL}/attendance-summary`,
  ATTENDANCE_STATUS: `${BASE_URL}/attendance-status`,
} as const;
