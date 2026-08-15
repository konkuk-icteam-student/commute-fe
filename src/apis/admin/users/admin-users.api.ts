import { apiClient } from "@/apis/api-client";

import { ADMIN_USERS_URL } from "./admin-users.endpoint";
import type {
  GetAdminUserSearchRequest,
  GetAdminUserSearchResponse,
} from "./admin-users.types";

export const getAdminUserSearchApi = async ({
  keyword,
}: GetAdminUserSearchRequest) => {
  const response = await apiClient.get<GetAdminUserSearchResponse>(
    ADMIN_USERS_URL.SEARCH,
    { params: { keyword } },
  );

  return response.details;
};
