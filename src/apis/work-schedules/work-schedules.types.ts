export type ScheduleStatusType =
  | "MY_SCHEDULE"
  | "PENDING_DELETE"
  | "PENDING_ADD"
  | "UNAVAILABLE"
  | "EMPTY";

// 공용 근무자 포함 시간표 조회는 /api/v1/admin/work-schedules 응답을 사용한다.
// 관리자·사용자 업무 화면에서 함께 근무하는 사람 목록을 표시할 때 필요하다.
export type WorkSchedulesWithUsersSlotStatus = ScheduleStatusType | "AVAILABLE";

export interface GetWorkSchedulesWithUsersRequest {
  startDate: string;
  endDate: string;
  userName?: string;
}

export interface WorkScheduleUser {
  userId: string;
  userName: string;
  scheduleId: number;
}

export interface WorkScheduleWithUsersSlot {
  start: string;
  end: string;
  status: WorkSchedulesWithUsersSlotStatus;
  currentCount: number;
  isOverLimit: boolean;
  users: WorkScheduleUser[];
}

export interface WorkScheduleWithUsersDay {
  date: string;
  slots: WorkScheduleWithUsersSlot[];
}

export interface GetWorkSchedulesWithUsersResponse {
  startDate: string;
  endDate: string;
  maxConcurrentWorkers: number;
  hasPrev: boolean;
  hasNext: boolean;
  days: WorkScheduleWithUsersDay[];
}

export type AdminWorkScheduleSlotStatus = WorkSchedulesWithUsersSlotStatus;
export type GetAdminWorkSchedulesRequest = GetWorkSchedulesWithUsersRequest;
export type AdminWorkScheduleUser = WorkScheduleUser;
export type AdminWorkScheduleSlot = WorkScheduleWithUsersSlot;
export type AdminWorkScheduleDay = WorkScheduleWithUsersDay;
export type GetAdminWorkSchedulesResponse = GetWorkSchedulesWithUsersResponse;

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
  users?: WorkScheduleSlotUserType[];
}

export interface WorkScheduleSlotUserType {
  userId: string;
  userName: string;
  scheduleId: number;
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

// 요약 조회 범위 (YYYY-MM-DD). 기간 조회와 달리 같은 달, 같은 주 안이어야 한다.
export interface GetWorkSchedulesSummaryRequest {
  startDate: string;
  endDate: string;
}

// 근로시간 한 칸. label은 서버가 만든 표시용 문구다. 예: "1주차", "4월 전체"
// 한도가 최소~최대 범위로 바뀌었다. 기존 limitHours에 해당하는 값은 maxHours다.
export interface WorkSchedulesSummaryEntryType {
  label: string;
  usedHours: number;
  minHours: number;
  maxHours: number;
}

// 주간과 월간 근로시간을 나눠서 내려준다.
export interface GetWorkSchedulesSummaryResponse {
  startDate: string;
  endDate: string;
  minWorkUnitMinutes: number;
  week: WorkSchedulesSummaryEntryType;
  month: WorkSchedulesSummaryEntryType;
}

export interface GetMonthlyLimitRequest {
  year: number;
  month: number;
}

export interface GetMonthlyLimitResponse {
  scheduleYear: number;
  scheduleMonth: number;
  maxConcurrentWorkers: number;
}

// 제출하는 슬롯. 날짜 YYYY-MM-DD, 시간 HH:MM, 30분 단위.
export interface WorkScheduleSlotTimeType {
  date: string;
  start: string;
  end: string;
}

// 처리 결과로 돌려받는 시간 구간. 날짜와 시각이 붙은 ISO 형식이다.
// 예: { start: "2026-04-06T13:00:00", end: "2026-04-06T14:30:00" }
export interface WorkScheduleSlotRangeType {
  start: string;
  end: string;
}

// addSlots / deleteSlots는 둘 중 하나만 보내도 된다.
export interface ApplyWorkSchedulesRequest {
  addSlots?: WorkScheduleSlotTimeType[];
  deleteSlots?: WorkScheduleSlotTimeType[];
}

// 구간별로 등록에 성공했는지 실패했는지 나뉘어 온다. 일부만 실패할 수 있다.
export interface ApplyWorkSchedulesResponse {
  success: WorkScheduleSlotRangeType[];
  failure: WorkScheduleSlotRangeType[];
}

export interface EditWorkSchedulesRequest {
  addSlots?: WorkScheduleSlotTimeType[];
  deleteSlots?: WorkScheduleSlotTimeType[];
  reason: string;
}

export interface EditWorkSchedulesResponse {
  requestId: number;
  // 스웨거에 PENDING만 정의돼 있고 EDIT 타입은 기획 확인 중이라 리터럴로 좁히지 않는다.
  status: string;
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
