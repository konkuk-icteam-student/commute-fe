export type ScheduleStatusType =
  | "MY_SCHEDULE"
  | "PENDING_DELETE"
  | "PENDING_ADD"
  | "UNAVAILABLE"
  | "EMPTY";

export interface GetMonthlyWorkSchedulesRequest {
  year: number;
  month: number;
}

export interface ScheduleSlotType {
  start: string;
  end: string;
  status: ScheduleStatusType;
  currentCount: number;
}

export interface GetMonthlyWorkSchedulesResponse {
  year: number;
  month: number;
  maxConcurrentWorkers: number;
  totalLimitHours: number;
  usedHours: number;
  days: {
    date: string;
    slots: ScheduleSlotType[];
  }[];
}
