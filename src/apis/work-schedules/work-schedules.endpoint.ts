const BASE_URL = "/api/v1/work-schedules" as const;

export const WORK_SCHEDULES_URL = {
  DEFAULT: BASE_URL,
  SUMMARY: `${BASE_URL}/summary`,
  MONTHLY: (year: number, month: number) => `${BASE_URL}/${year}/${month}`,
} as const;
