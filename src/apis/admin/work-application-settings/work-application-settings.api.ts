import { apiClient } from "@/apis/api-client";

import type {
  SaveWorkApplicationSettingsRequest,
  SaveWorkApplicationSettingsResponse,
} from "./work-application-settings.types";
import { WORK_APPLICATION_SETTINGS_URL } from "./work-application-settings.endpoint";

export const saveWorkApplicationSettingsApi = async ({
  year,
  month,
  ...body
}: SaveWorkApplicationSettingsRequest) => {
  const response = await apiClient.put<SaveWorkApplicationSettingsResponse>(
    WORK_APPLICATION_SETTINGS_URL.SETTINGS(year, month),
    body,
  );

  return response.details;
};
