export type WorkChangeRequestStatusCode = "CS01" | "CS02" | "CS03";

export type WorkChangeRequestHistoryStatusFilterCode =
  | "ALL"
  | WorkChangeRequestStatusCode;

export type WorkChangeRequestChangeTypeCode = "CR01" | "CR02";

export interface WorkChangeRequestHistoryParams {
  year?: number;
  month?: number;
  statusCode?: WorkChangeRequestHistoryStatusFilterCode;
  page?: number;
  size?: number;
}

export interface WorkChangeRequestHistorySummary {
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export interface WorkChangeRequestHistorySlot {
  start: string;
  end: string;
  changeTypeCode?: WorkChangeRequestChangeTypeCode;
}

export interface WorkChangeRequestHistoryItem {
  requestId: string;
  statusCode: WorkChangeRequestStatusCode;
  statusName: string;
  requestedAt: string;
  processedAt: string | null;
  reason: string;
  rejectReason: string | null;
  deleteSlots: WorkChangeRequestHistorySlot[];
  addSlots: WorkChangeRequestHistorySlot[];
}

export interface WorkChangeRequestHistoryResponse {
  year: number;
  month: number;
  statusCode: WorkChangeRequestHistoryStatusFilterCode;
  summary: WorkChangeRequestHistorySummary;
  histories: WorkChangeRequestHistoryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
