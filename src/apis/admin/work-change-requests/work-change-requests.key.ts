import type { GetAdminWorkChangeRequestsRequest } from "./work-change-requests.types";

export const ADMIN_WORK_CHANGE_REQUESTS_QUERY_KEY = {
  ALL: ["admin-work-change-requests"],
  LIST: (params: GetAdminWorkChangeRequestsRequest) => [
    "admin-work-change-requests",
    "list",
    params,
  ],
} as const;
