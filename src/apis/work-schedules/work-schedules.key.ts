export const WORK_SCHEDULES_QUERY_KEY = {
  // 신청·수정 후 근무 시간표 조회를 한꺼번에 무효화할 때 쓰는 접두사.
  ALL: ["work-schedules"],
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
