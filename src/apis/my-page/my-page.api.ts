import { apiClient } from "../api-client";
import { MY_PAGE_URL } from "./my-page.endpoint";
import type { GetMyPageResponse } from "./my-page.types";

export const getMyPageApi = async () => {
  const response = await apiClient.get<GetMyPageResponse>(MY_PAGE_URL.DEFAULT);

  return response.details;
};
