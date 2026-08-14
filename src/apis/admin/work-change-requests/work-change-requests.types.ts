export type AdminWorkChangeRequestStatusCode = "CS01" | "CS02" | "CS03";

export type AdminWorkChangeRequestStatusFilterCode =
  | "ALL"
  | AdminWorkChangeRequestStatusCode;

export type AdminWorkChangeRequestProcessStatusCode = Exclude<
  AdminWorkChangeRequestStatusCode,
  "CS01"
>;

export type AdminWorkChangeRequestChangeTypeCode = "CR01" | "CR02";

export type AdminWorkChangeRequestBulkResultCode =
  | "SUCCESS"
  | "ALREADY_PROCESSED"
  | "CAPACITY_EXCEEDED"
  | "NOT_FOUND";

export interface GetAdminWorkChangeRequestsRequest {
  year: number;
  month: number;
  statusCode?: AdminWorkChangeRequestStatusFilterCode;
  page?: number;
  size?: number;
}

export interface AdminWorkChangeRequestSummary {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface AdminWorkChangeRequestSchedule {
  date: string;
  start: string;
  end: string;
  changeTypeCode: AdminWorkChangeRequestChangeTypeCode;
}

export interface AdminWorkChangeRequestItem {
  requestId: number;
  userId: number;
  userName: string;
  statusCode: AdminWorkChangeRequestStatusCode;
  requestedAt: string;
  processedAt: string | null;
  reason: string;
  rejectReason: string | null;
  deleteSchedules: AdminWorkChangeRequestSchedule[];
  addSchedules: AdminWorkChangeRequestSchedule[];
}

export interface GetAdminWorkChangeRequestsResponse {
  year: number;
  month: number;
  statusCode: AdminWorkChangeRequestStatusFilterCode;
  summary: AdminWorkChangeRequestSummary;
  requests: AdminWorkChangeRequestItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UpdateAdminWorkChangeRequestRequest {
  requestId: number;
  statusCode: AdminWorkChangeRequestProcessStatusCode;
  rejectReason?: string | null;
}

export interface AdminWorkChangeRequestProcessedSchedule {
  scheduleId: string;
  date: string;
  start: string;
  end: string;
  statusCode: string;
}

export interface UpdateAdminWorkChangeRequestResponse {
  requestId: number;
  statusCode: AdminWorkChangeRequestProcessStatusCode;
  processedAt: string;
  rejectReason?: string | null;
  deleteSchedules?: AdminWorkChangeRequestProcessedSchedule[];
  addSchedules?: AdminWorkChangeRequestProcessedSchedule[];
}

export interface BulkApproveAdminWorkChangeRequestsRequest {
  requestIds: number[];
}

export interface BulkApproveAdminWorkChangeRequestsSummary {
  totalCount: number;
  successCount: number;
  failCount: number;
}

export interface BulkApproveAdminWorkChangeRequestsResult {
  requestId: number;
  resultCode: AdminWorkChangeRequestBulkResultCode;
  processedAt: string | null;
}

export interface BulkApproveAdminWorkChangeRequestsResponse {
  summary: BulkApproveAdminWorkChangeRequestsSummary;
  results: BulkApproveAdminWorkChangeRequestsResult[];
}
