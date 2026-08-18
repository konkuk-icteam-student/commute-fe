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
  // userId를 조회 기간보다 앞에 두어, 기간을 모르는 쪽에서도 USER_ALL로 한 사람만 무효화할 수 있다.
  USER: ({ userId, ...params }: GetAdminUserWorkSchedulesRequest) => [
    "admin-work-schedules",
    "user",
    userId,
    params,
  ],
  USER_ALL: (userId: number) => ["admin-work-schedules", "user", userId],
  QUICK_SEARCH: (params: GetAdminWorkScheduleQuickSearchRequest) => [
    "admin-work-schedules",
    "quick-search",
    params,
  ],
} as const;
