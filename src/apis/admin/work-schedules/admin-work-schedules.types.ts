import type { ScheduleStatusType } from "@/apis/work-schedules";

// 사용자용 시간표의 상태 값에 관리자 화면에만 있는 AVAILABLE을 더한 집합이다.
// TODO: 서버가 실제로 내려주는 값을 확인한 뒤 범위를 좁힌다.
export type AdminWorkScheduleSlotStatus = ScheduleStatusType | "AVAILABLE";

// 조회 범위 (YYYY-MM-DD). 서버는 같은 달 안의 범위만 받는다.
// userName은 근무자 이름 검색어이며, 비우면 전체를 조회한다.
export interface GetAdminWorkSchedulesRequest {
  startDate: string;
  endDate: string;
  userName?: string;
}

// scheduleId는 그 사용자의 배치 건을 가리킨다. 삭제할 때 이 값을 보낸다.
export interface AdminWorkScheduleUser {
  userId: string;
  userName: string;
  scheduleId: number;
}

// 30분 단위 슬롯 하나. currentCount는 그 시간대에 배정된 인원 수다.
export interface AdminWorkScheduleSlot {
  start: string;
  end: string;
  status: AdminWorkScheduleSlotStatus;
  currentCount: number;
  isOverLimit: boolean;
  users: AdminWorkScheduleUser[];
}

export interface AdminWorkScheduleDay {
  date: string;
  slots: AdminWorkScheduleSlot[];
}

// hasPrev·hasNext는 조회 범위 앞뒤로 더 볼 기간이 있는지를 알려 준다.
export interface GetAdminWorkSchedulesResponse {
  startDate: string;
  endDate: string;
  maxConcurrentWorkers: number;
  hasPrev: boolean;
  hasNext: boolean;
  days: AdminWorkScheduleDay[];
}

// 30분 슬롯에 사용자를 직접 배치한다.
// 승인 절차 없이 바로 승인 상태가 되고, 최대 동시 근무 인원을 넘겨도 배치된다.
export interface CreateAdminWorkScheduleRequest {
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
}

// currentCount·maxConcurrentWorkers는 배치 후 그 슬롯의 인원 현황이다.
export interface CreateAdminWorkScheduleResponse {
  scheduleId: number;
  userId: number;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  currentCount: number;
  maxConcurrentWorkers: number;
}

// 행을 지우지 않고 상태만 취소로 바꾼다. 출퇴근 기록이 있으면 삭제할 수 없다.
export interface DeleteAdminWorkScheduleRequest {
  scheduleId: number;
}

export interface DeleteAdminWorkScheduleResponse {
  scheduleId: number;
  date: string;
  startTime: string;
  endTime: string;
  currentCount: number;
  maxConcurrentWorkers: number;
}

// 같은 조직에 속한 사용자 한 명의 시간표를 기간으로 조회한다.
export interface GetAdminUserWorkSchedulesRequest {
  userId: number;
  startDate: string;
  endDate: string;
}

// 전체 조회 슬롯과 달리 배치 인원 목록(users)과 isOverLimit이 없다.
// status는 사용자 시간표와 같은 값 집합이라 AdminWorkScheduleSlotStatus를 쓰지 않는다.
export interface AdminUserWorkScheduleSlot {
  start: string;
  end: string;
  status: ScheduleStatusType;
  currentCount: number;
}

export interface AdminUserWorkScheduleDay {
  date: string;
  slots: AdminUserWorkScheduleSlot[];
}

export interface GetAdminUserWorkSchedulesResponse {
  startDate: string;
  endDate: string;
  maxConcurrentWorkers: number;
  hasPrev: boolean;
  hasNext: boolean;
  days: AdminUserWorkScheduleDay[];
}

// 한 사용자의 승인된 근로 시간표를 기간 내에서 조회한다.
export interface GetAdminWorkScheduleQuickSearchRequest {
  userId: number;
  startDate: string;
  endDate: string;
}

// 연속되거나 겹치는 슬롯은 서버가 하나로 병합해 준다.
// 30분 단위인 시간표 표와 달리 길이가 제각각이다.
export interface AdminWorkScheduleQuickSearchSlot {
  start: string;
  end: string;
}

// dayOfWeek는 "목"처럼 서버가 만든 표시용 요일이다.
export interface AdminWorkScheduleQuickSearchDay {
  date: string;
  dayOfWeek: string;
  slots: AdminWorkScheduleQuickSearchSlot[];
}

// 배치가 없는 날짜는 days에서 빠진다. 조회 기간의 모든 날짜가 오지 않는다.
export interface GetAdminWorkScheduleQuickSearchResponse {
  userId: number;
  userName: string;
  days: AdminWorkScheduleQuickSearchDay[];
}
