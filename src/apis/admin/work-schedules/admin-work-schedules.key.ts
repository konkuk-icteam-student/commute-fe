import type { GetAdminWorkSchedulesRequest } from "./admin-work-schedules.types";

export const ADMIN_WORK_SCHEDULES_QUERY_KEY = {
  ALL: ["admin-work-schedules"],
  SCHEDULES: (params: GetAdminWorkSchedulesRequest) => [
    "admin-work-schedules",
    params,
  ],
} as const;
