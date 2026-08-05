import { apiClient } from "../api-client";
import { WORK_SCHEDULES_URL } from "./work-schedules.endpoint";
import type {
  GetMonthlyWorkSchedulesResponse,
  GetMonthlyWorkSchedulesRequest,
  GetPeriodWorkSchedulesRequest,
  GetPeriodWorkSchedulesResponse,
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

// startDate ~ endDate 범위의 근무 시간표를 30분 단위 슬롯으로 조회한다.
export const getPeriodSchedulesApi = async ({
  startDate,
  endDate,
}: GetPeriodWorkSchedulesRequest) => {
  const response = await apiClient.get<GetPeriodWorkSchedulesResponse>(
    WORK_SCHEDULES_URL.DEFAULT,
    { params: { startDate, endDate } },
  );

  return response.details;
};
