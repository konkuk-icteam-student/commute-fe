import { apiClient } from "@/apis/api-client";

import { ORGANIZATION_URL } from "./organization.endpoint";
import type { GetOrganizationsResponse } from "./organization.types";

export const getOrganizationsApi = async () => {
  const response = await apiClient.get<GetOrganizationsResponse>(
    ORGANIZATION_URL.LIST,
    { skipAuth: true },
  );

  return response.details;
};
