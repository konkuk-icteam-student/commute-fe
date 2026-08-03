import { apiClient } from "../api-client";
import { ADMIN_WORK_SCHEDULES_URL } from "./admin-work-schedules.endpoint";
import {
  SaveAdminWorkSchedulesSettingsRequest,
  SaveAdminWorkSchedulesSettingsResponse,
} from "./admin-work-schedules.types";

export const saveAdminWorkSchedulesSettingsApi = async ({
  year,
  month,
  ...body
}: SaveAdminWorkSchedulesSettingsRequest) => {
  const response = await apiClient.put<SaveAdminWorkSchedulesSettingsResponse>(
    ADMIN_WORK_SCHEDULES_URL.SETTINGS(year, month),
    body,
  );

  return response.details;
};
