export { ADMIN_WORK_SCHEDULES_URL } from "./admin-work-schedules.endpoint";
export { ADMIN_WORK_SCHEDULES_QUERY_KEY } from "./admin-work-schedules.key";

export {
  createAdminWorkScheduleApi,
  deleteAdminWorkScheduleApi,
  getAdminUserWorkSchedulesApi,
  getAdminWorkScheduleQuickSearchApi,
} from "./admin-work-schedules.api";

export {
  useCreateAdminWorkScheduleMutation,
  useDeleteAdminWorkScheduleMutation,
  useGetAdminUserWorkSchedulesQuery,
  useGetAdminWorkScheduleQuickSearchQuery,
} from "./admin-work-schedules.queries";

export type {
  AdminUserWorkScheduleDay,
  AdminUserWorkScheduleSlot,
  AdminWorkScheduleDay,
  AdminWorkScheduleQuickSearchDay,
  AdminWorkScheduleQuickSearchSlot,
  CreateAdminWorkScheduleRequest,
  CreateAdminWorkScheduleResponse,
  DeleteAdminWorkScheduleRequest,
  DeleteAdminWorkScheduleResponse,
  GetAdminUserWorkSchedulesRequest,
  GetAdminUserWorkSchedulesResponse,
  GetAdminWorkScheduleQuickSearchRequest,
  GetAdminWorkScheduleQuickSearchResponse,
} from "./admin-work-schedules.types";
