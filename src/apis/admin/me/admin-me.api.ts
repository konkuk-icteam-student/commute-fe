import { apiClient } from "@/apis/api-client";

import { ADMIN_ME_URL } from "./admin-me.endpoint";
import type { GetAdminMeResponse } from "./admin-me.types";

export const getAdminMeApi = async () => {
  const response = await apiClient.get<GetAdminMeResponse>(
    ADMIN_ME_URL.DEFAULT,
  );

  return response.details;
};
