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

export interface AdminWorkScheduleUser {
  userId: string;
  userName: string;
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
