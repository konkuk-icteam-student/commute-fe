import { apiClient } from "@/apis/api-client";

import { ADMIN_HOME_URL } from "./admin-home.endpoint";
import type {
  GetAdminHomeAttendanceStatusRequest,
  GetAdminHomeAttendanceStatusResponse,
  GetAdminHomeAttendanceSummaryRequest,
  GetAdminHomeAttendanceSummaryResponse,
} from "./admin-home.types";

export const getAdminHomeAttendanceSummaryApi = async (
  params: GetAdminHomeAttendanceSummaryRequest,
) => {
  const response = await apiClient.get<GetAdminHomeAttendanceSummaryResponse>(
    ADMIN_HOME_URL.ATTENDANCE_SUMMARY,
    { params },
  );

  return response.details;
};

export const getAdminHomeAttendanceStatusApi = async ({
  userName,
  ...params
}: GetAdminHomeAttendanceStatusRequest) => {
  const response = await apiClient.get<GetAdminHomeAttendanceStatusResponse>(
    ADMIN_HOME_URL.ATTENDANCE_STATUS,
    { params: { ...params, ...(userName ? { userName } : {}) } },
  );

  return response.details;
};
