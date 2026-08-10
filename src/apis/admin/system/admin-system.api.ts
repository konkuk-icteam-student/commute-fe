import { apiClient } from "@/apis/api-client";

import { ADMIN_SYSTEM_URL } from "./admin-system.endpoint";
import type { GetAdminSystemCreatedYearResponse } from "./admin-system.types";

export const getAdminSystemCreatedYearApi = async () => {
  const response = await apiClient.get<GetAdminSystemCreatedYearResponse>(
    ADMIN_SYSTEM_URL.CREATED_YEAR,
  );

  return response.details;
};
