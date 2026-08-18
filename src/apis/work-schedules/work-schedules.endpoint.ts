const BASE_URL = "/api/v1/work-schedules" as const;
const ADMIN_BASE_URL = "/api/v1/admin/work-schedules" as const;

export const WORK_SCHEDULES_URL = {
  DEFAULT: BASE_URL,
  ADMIN_DEFAULT: ADMIN_BASE_URL,
  SUMMARY: `${BASE_URL}/summary`,
  MONTHLY: (year: number, month: number) =>
    `${BASE_URL}/${encodeURIComponent(year)}/${encodeURIComponent(month)}`,
  MONTHLY_LIMIT: (year: number, month: number) =>
    `${BASE_URL}/monthly-limit/${encodeURIComponent(year)}/${encodeURIComponent(month)}`,
  APPLY: `${BASE_URL}/apply`,
  EDIT: `${BASE_URL}/edit`,
} as const;
