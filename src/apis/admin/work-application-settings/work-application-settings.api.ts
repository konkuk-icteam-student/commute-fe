import { apiClient } from "@/apis/api-client";

import type {
  GetWorkApplicationSettingsRequest,
  GetWorkApplicationSettingsResponse,
  SaveWorkApplicationSettingsRequest,
  SaveWorkApplicationSettingsResponse,
} from "./work-application-settings.types";
import { WORK_APPLICATION_SETTINGS_URL } from "./work-application-settings.endpoint";

export const getWorkApplicationSettingsApi = async ({
  year,
  month,
}: GetWorkApplicationSettingsRequest) => {
  const response = await apiClient.get<GetWorkApplicationSettingsResponse>(
    WORK_APPLICATION_SETTINGS_URL.SETTINGS(year, month),
  );

  return response.details;
};

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
