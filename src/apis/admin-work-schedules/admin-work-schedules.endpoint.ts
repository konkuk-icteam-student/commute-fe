const ADMIN_BASE_URL = "/api/v1/admin" as const;
// const ADMIN_SCHEDULE_BASE_URL = "/api/v1/admin/work-schedules" as const;

export const ADMIN_WORK_SCHEDULES_URL = {
  SETTINGS: (year: number, month: number) =>
    `${ADMIN_BASE_URL}/work-application-settings/${year}/${month}`,
} as const;
