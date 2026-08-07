import { apiClient } from "../api-client";
import { WORK_SCHEDULES_URL } from "./work-schedules.endpoint";
import type {
  ApplyWorkSchedulesRequest,
  ApplyWorkSchedulesResponse,
  EditWorkSchedulesRequest,
  EditWorkSchedulesResponse,
  GetMonthlyLimitRequest,
  GetMonthlyLimitResponse,
  GetMonthlyWorkSchedulesResponse,
  GetMonthlyWorkSchedulesRequest,
  GetPeriodWorkSchedulesRequest,
  GetPeriodWorkSchedulesResponse,
  GetWorkSchedulesSummaryRequest,
  GetWorkSchedulesSummaryResponse,
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

// 이 주차의 주간·월간 근로시간 요약. 사용 시간과 한도를 서버가 계산해 준다.
export const getWorkSchedulesSummaryApi = async ({
  startDate,
  endDate,
}: GetWorkSchedulesSummaryRequest) => {
  const response = await apiClient.get<GetWorkSchedulesSummaryResponse>(
    WORK_SCHEDULES_URL.SUMMARY,
    { params: { startDate, endDate } },
  );

  return response.details;
};

// 해당 연월의 최대 동시 근무 인원.
export const getMonthlyLimitApi = async ({
  year,
  month,
}: GetMonthlyLimitRequest) => {
  const response = await apiClient.get<GetMonthlyLimitResponse>(
    WORK_SCHEDULES_URL.MONTHLY_LIMIT(year, month),
  );

  return response.details;
};

// 고른 슬롯을 근로 일정으로 신청한다. 구간별 성공·실패가 나뉘어 돌아온다.
export const applyWorkSchedulesApi = async (
  body: ApplyWorkSchedulesRequest,
) => {
  const response = await apiClient.post<ApplyWorkSchedulesResponse>(
    WORK_SCHEDULES_URL.APPLY,
    body,
  );

  return response.details;
};

// 초기 신청 기간이 지난 뒤의 시간표 수정을 요청한다. 관리자 승인 후 반영된다.
export const editWorkSchedulesApi = async (body: EditWorkSchedulesRequest) => {
  const response = await apiClient.post<EditWorkSchedulesResponse>(
    WORK_SCHEDULES_URL.EDIT,
    body,
  );

  return response.details;
};
