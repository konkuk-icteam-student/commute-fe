import { apiClient } from "../api-client";
import { WORK_CHANGE_REQUESTS_URL } from "./work-change-requests.endpoint";
import type {
  WorkChangeRequestHistoryParams,
  WorkChangeRequestHistoryResponse,
} from "./work-change-requests.types";

export const getWorkChangeRequestHistoryApi = async ({
  year,
  month,
  statusCode = "ALL",
  page = 0,
  size = 10,
}: WorkChangeRequestHistoryParams = {}) => {
  const response = await apiClient.get<WorkChangeRequestHistoryResponse>(
    WORK_CHANGE_REQUESTS_URL.HISTORY,
    {
      params: {
        year,
        month,
        statusCode,
        page,
        size,
      },
    },
  );

  return response.details;
};
