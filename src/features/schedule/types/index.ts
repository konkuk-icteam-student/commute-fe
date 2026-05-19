export type ScheduleSlotStatus =
  | "MY_SCHEDULE"
  | "PENDING_DELETE"
  | "PENDING_ADD"
  | "UNAVAILABLE"
  | "EMPTY";

// TODO: 추후 서버 api 관련 타입으로 변경 및 위치 이동
export interface GetSheduleResponse {
  year: number;
  month: number;
  maxConcurrentWorkers: number;
  totalLimitHours: number;
  usedHours: number;
  slots: [
    {
      date: string; // YYYY-MM-dd
      start: string; // HH:MM
      end: string; // HH:MM
      status: ScheduleSlotStatus;
      currentCount: number;
    },
  ];
}
