export const WORK_SCHEDULES_QUERY_KEY = {
  MONTHLY: (year: number, month: number) => [
    "work-schedules",
    "monthly",
    year,
    month,
  ],
  PERIOD: (startDate: string, endDate: string) => [
    "work-schedules",
    "period",
    startDate,
    endDate,
  ],
};
