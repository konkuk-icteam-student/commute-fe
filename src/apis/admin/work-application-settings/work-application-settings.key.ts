export const WORK_APPLICATION_SETTINGS_QUERY_KEY = {
  ALL: ["work-application-settings"],
  SETTINGS: (year: number, month: number) => [
    "work-application-settings",
    year,
    month,
  ],
} as const;
