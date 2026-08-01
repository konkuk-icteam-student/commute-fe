import { apiClient } from "../api-client";
import { WORK_SCHEDULES_URL } from "./work-schedules.endpoint";
import type {
  GetMonthlyWorkSchedulesResponse,
  GetMonthlyWorkSchedulesRequest,
} from "./work-schedules.types";

export const getMonthlySchedulesApi = async ({
  year,
  month,
}: GetMonthlyWorkSchedulesRequest) => {
  const response = await apiClient.get<GetMonthlyWorkSchedulesResponse>(
    WORK_SCHEDULES_URL.MONTHLY(year, month),
  );

  return response.details;
};
