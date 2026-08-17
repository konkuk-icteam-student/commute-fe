import { apiClient } from "@/apis/api-client";

import { ADMIN_WORK_SCHEDULES_URL } from "./admin-work-schedules.endpoint";
import type {
  CreateAdminWorkScheduleRequest,
  CreateAdminWorkScheduleResponse,
  DeleteAdminWorkScheduleRequest,
  DeleteAdminWorkScheduleResponse,
  GetAdminWorkSchedulesRequest,
  GetAdminWorkSchedulesResponse,
} from "./admin-work-schedules.types";

export const getAdminWorkSchedulesApi = async ({
  userName,
  ...params
}: GetAdminWorkSchedulesRequest) => {
  const response = await apiClient.get<GetAdminWorkSchedulesResponse>(
    ADMIN_WORK_SCHEDULES_URL.DEFAULT,
    { params: { ...params, ...(userName ? { userName } : {}) } },
  );

  return response.details;
};

export const createAdminWorkScheduleApi = async (
  body: CreateAdminWorkScheduleRequest,
) => {
  const response = await apiClient.post<CreateAdminWorkScheduleResponse>(
    ADMIN_WORK_SCHEDULES_URL.DEFAULT,
    body,
  );

  return response.details;
};

export const deleteAdminWorkScheduleApi = async ({
  scheduleId,
}: DeleteAdminWorkScheduleRequest) => {
  const response = await apiClient.delete<DeleteAdminWorkScheduleResponse>(
    ADMIN_WORK_SCHEDULES_URL.DELETE(scheduleId),
  );

  return response.details;
};
