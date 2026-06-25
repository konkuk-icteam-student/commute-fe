import type {
  ScheduleChangeHistorySlot,
  ScheduleChangeHistoryStatusCode,
} from "@/features/schedule/types";

export type WorktimeHistoryStatusFilterCode =
  | "ALL"
  | ScheduleChangeHistoryStatusCode;

export interface WorktimeHistorySummary {
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export interface WorktimeHistoryItem {
  requestId: string;
  statusCode: ScheduleChangeHistoryStatusCode;
  statusName: string;
  requestedAt: string;
  processedAt: string | null;
  reason: string;
  rejectReason: string | null;
  deleteSlots: ScheduleChangeHistorySlot[];
  addSlots: ScheduleChangeHistorySlot[];
}

export interface WorktimeHistoryDetails {
  year: number;
  month: number;
  statusCode: WorktimeHistoryStatusFilterCode;
  summary: WorktimeHistorySummary;
  histories: WorktimeHistoryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface WorktimeHistoryResponse {
  isSuccess: boolean;
  message: string;
  details: WorktimeHistoryDetails;
}
