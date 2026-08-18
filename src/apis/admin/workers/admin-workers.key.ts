import type {
  GetAdminWorkerDetailRequest,
  GetAdminWorkersRequest,
} from "./admin-workers.types";

export const ADMIN_WORKERS_QUERY_KEY = {
  ALL: ["admin-workers"],
  LIST: (params: GetAdminWorkersRequest) => ["admin-workers", "list", params],
  DETAIL: (params: GetAdminWorkerDetailRequest) => [
    "admin-workers",
    "detail",
    params,
  ],
} as const;
