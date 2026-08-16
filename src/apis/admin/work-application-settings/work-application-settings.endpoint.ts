const BASE_URL = "/api/v1/admin/work-application-settings" as const;

export const WORK_APPLICATION_SETTINGS_URL = {
  SETTINGS: (year: number, month: number) =>
    `${BASE_URL}/${encodeURIComponent(year)}/${encodeURIComponent(month)}`,
} as const;
