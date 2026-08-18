// TODO: 추후 api 연동 시 정리

import type { AdminWorkScheduleUser } from "@/apis/work-schedules";

export interface WorktimeChangeRequestType {
  date: string;
  start: string;
  end: string;
  changeTypeCode: string;
}

export interface WorktimeEditRequestItemType {
  requestId: number;
  userId: number;
  requestedAt: string;
  name: string;
  deleteSlots: WorktimeChangeRequestType[];
  addSlots: WorktimeChangeRequestType[];
  reason: string;
  statusCode?: string;
  rejectReason?: string | null;
}

export interface WorktimeDetailTableCellType {
  date: string;
  start: string;
  end: string;
  currentCount: number;
  isOverLimit: boolean;
  isUnavailable: boolean;
  users: AdminWorkScheduleUser[];
}
