import { apiClient } from "@/apis/api-client";

import { ADMIN_WORK_SCHEDULES_URL } from "./admin-work-schedules.endpoint";
import type {
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
