export { ADMIN_WORK_SCHEDULES_URL } from "./admin-work-schedules.endpoint";
export { ADMIN_WORK_SCHEDULES_QUERY_KEY } from "./admin-work-schedules.key";

export {
  createAdminWorkScheduleApi,
  deleteAdminWorkScheduleApi,
  getAdminWorkScheduleQuickSearchApi,
} from "./admin-work-schedules.api";

export {
  useCreateAdminWorkScheduleMutation,
  useDeleteAdminWorkScheduleMutation,
  useGetAdminWorkScheduleQuickSearchQuery,
} from "./admin-work-schedules.queries";

export type {
  AdminWorkScheduleQuickSearchDay,
  AdminWorkScheduleQuickSearchSlot,
  CreateAdminWorkScheduleRequest,
  CreateAdminWorkScheduleResponse,
  DeleteAdminWorkScheduleRequest,
  DeleteAdminWorkScheduleResponse,
  GetAdminWorkScheduleQuickSearchRequest,
  GetAdminWorkScheduleQuickSearchResponse,
} from "./admin-work-schedules.types";
