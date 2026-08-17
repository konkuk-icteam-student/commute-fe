const BASE_URL = "/api/v1/admin/work-schedules" as const;

export const ADMIN_WORK_SCHEDULES_URL = {
  DEFAULT: BASE_URL,
  DELETE: (scheduleId: number) =>
    `${BASE_URL}/${encodeURIComponent(scheduleId)}`,
} as const;
