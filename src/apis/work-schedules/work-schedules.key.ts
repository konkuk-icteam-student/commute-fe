export const WORK_SCHEDULES_QUERY_KEY = {
  MONTHLY: (year: number, month: number) => [
    "work-schedules",
    "monthly",
    year,
    month,
  ],
};
