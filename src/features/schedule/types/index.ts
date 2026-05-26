export type ScheduleSlotStatus =
  | "MY_SCHEDULE"
  | "PENDING_DELETE"
  | "PENDING_ADD"
  | "UNAVAILABLE"
  | "EMPTY";

export interface ScheduleSlotTime {
  date: string; // YYYY-MM-dd
  start: string; // HH:MM
  end: string; // HH:MM
}

export interface ScheduleApplyPayload {
  deleteSlots: ScheduleSlotTime[];
  addSlots: ScheduleSlotTime[];
}

// TODO: 추후 서버 api 관련 타입으로 변경 및 위치 이동
export interface WeekScheduleData {
  maxConcurrentWorkers: number;
  // 총 90개의 slot 응답
  slots: (ScheduleSlotTime & {
    status: ScheduleSlotStatus;
    currentCount: number;
  })[];
}

export type ScheduleSlot = WeekScheduleData["slots"][number];
