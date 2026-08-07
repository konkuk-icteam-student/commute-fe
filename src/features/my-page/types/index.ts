import type {
  ScheduleChangeHistorySlot,
  ScheduleChangeHistoryStatusCode,
} from "@/features/schedule/types";
import type {
  WorkChangeRequestHistoryItem,
  WorkChangeRequestHistoryResponse,
  WorkChangeRequestHistoryStatusFilterCode,
  WorkChangeRequestHistorySummary,
} from "@/apis/work-change-requests";

export type WorktimeHistoryStatusFilterCode =
  WorkChangeRequestHistoryStatusFilterCode;

export type WorktimeHistorySummary = WorkChangeRequestHistorySummary;

export type WorktimeHistoryItem = WorkChangeRequestHistoryItem & {
  statusCode: ScheduleChangeHistoryStatusCode;
  deleteSlots: ScheduleChangeHistorySlot[];
  addSlots: ScheduleChangeHistorySlot[];
};

export type WorktimeHistoryDetails = WorkChangeRequestHistoryResponse;
