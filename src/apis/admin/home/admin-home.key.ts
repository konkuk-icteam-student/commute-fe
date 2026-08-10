import type {
  GetAdminHomeAttendanceStatusRequest,
  GetAdminHomeAttendanceSummaryRequest,
} from "./admin-home.types";

export const ADMIN_HOME_QUERY_KEY = {
  ALL: ["admin-home"],
  ATTENDANCE_SUMMARY: (params: GetAdminHomeAttendanceSummaryRequest) => [
    "admin-home",
    "attendance-summary",
    params,
  ],
  ATTENDANCE_STATUS: (params: GetAdminHomeAttendanceStatusRequest) => [
    "admin-home",
    "attendance-status",
    params,
  ],
} as const;
