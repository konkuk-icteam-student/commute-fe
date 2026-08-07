const BASE_URL = "/api/v1/work-schedules" as const;

export const WORK_SCHEDULES_URL = {
  DEFAULT: BASE_URL,
  SUMMARY: `${BASE_URL}/summary`,
  MONTHLY: (year: number, month: number) => `${BASE_URL}/${year}/${month}`,
  MONTHLY_LIMIT: (year: number, month: number) =>
    `${BASE_URL}/monthly-limit/${year}/${month}`,
  APPLY: `${BASE_URL}/apply`,
  EDIT: `${BASE_URL}/edit`,
} as const;
