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

// 조회 시작·종료 날짜 (YYYY-MM-DD). 서버는 같은 달 안의 범위만 받는다.
export interface GetPeriodWorkSchedulesRequest {
  startDate: string;
  endDate: string;
}

export interface ScheduleSlotType {
  start: string;
  end: string;
  status: ScheduleStatusType;
  currentCount: number;
}

export interface ScheduleDayType {
  date: string;
  slots: ScheduleSlotType[];
}

export interface GetMonthlyWorkSchedulesResponse {
  year: number;
  month: number;
  maxConcurrentWorkers: number;
  totalLimitHours: number;
  usedHours: number;
  days: ScheduleDayType[];
}

export interface GetPeriodWorkSchedulesResponse {
  startDate: string;
  endDate: string;
  // 서버에서 미설정이면 4를 반환한다.
  maxConcurrentWorkers: number;
  totalLimitHours: number;
  usedHours: number;
  days: ScheduleDayType[];
}
