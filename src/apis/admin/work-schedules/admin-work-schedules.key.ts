import type {
  GetAdminUserWorkSchedulesRequest,
  GetAdminWorkScheduleQuickSearchRequest,
  GetAdminWorkSchedulesRequest,
} from "./admin-work-schedules.types";

export const ADMIN_WORK_SCHEDULES_QUERY_KEY = {
  ALL: ["admin-work-schedules"],
  SCHEDULES: (params: GetAdminWorkSchedulesRequest) => [
    "admin-work-schedules",
    params,
  ],
  USER: (params: GetAdminUserWorkSchedulesRequest) => [
    "admin-work-schedules",
    "user",
    params,
  ],
  QUICK_SEARCH: (params: GetAdminWorkScheduleQuickSearchRequest) => [
    "admin-work-schedules",
    "quick-search",
    params,
  ],
} as const;
