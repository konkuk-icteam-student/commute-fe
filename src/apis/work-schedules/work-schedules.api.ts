import { apiClient } from "../api-client";
import { WORK_SCHEDULES_URL } from "./work-schedules.endpoint";
import type {
  ApplyWorkSchedulesRequest,
  ApplyWorkSchedulesResponse,
  EditWorkSchedulesRequest,
  EditWorkSchedulesResponse,
  GetApplyPeriodRequest,
  GetApplyPeriodResponse,
  GetMonthlyLimitRequest,
  GetMonthlyLimitResponse,
  GetMonthlyWorkSchedulesResponse,
  GetMonthlyWorkSchedulesRequest,
  GetWorkSchedulesWithUsersRequest,
  GetWorkSchedulesWithUsersResponse,
  GetPeriodWorkSchedulesRequest,
  GetPeriodWorkSchedulesResponse,
  GetWorkSchedulesSummaryRequest,
  GetWorkSchedulesSummaryResponse,
} from "./work-schedules.types";

export const getWorkSchedulesWithUsersApi = async ({
  userName,
  ...params
}: GetWorkSchedulesWithUsersRequest) => {
  const response = await apiClient.get<GetWorkSchedulesWithUsersResponse>(
    WORK_SCHEDULES_URL.ADMIN_DEFAULT,
    { params: { ...params, ...(userName ? { userName } : {}) } },
  );

  return response.details;
};

// 근무 시간표 월별 조회
export const getMonthlySchedulesApi = async ({
  year,
  month,
}: GetMonthlyWorkSchedulesRequest) => {
  const response = await apiClient.get<GetMonthlyWorkSchedulesResponse>(
    WORK_SCHEDULES_URL.MONTHLY(year, month),
  );

  return response.details;
};

// 근무 시간표 기간별 조회
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

// 근로시간 요약 조회
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

// 월별 스케줄 동시 근무 제한 조회
export const getMonthlyLimitApi = async ({
  year,
  month,
}: GetMonthlyLimitRequest) => {
  const response = await apiClient.get<GetMonthlyLimitResponse>(
    WORK_SCHEDULES_URL.MONTHLY_LIMIT(year, month),
  );

  return response.details;
};

// 근로 신청 기간과 신청·수정 가능 여부 조회
export const getApplyPeriodApi = async ({
  year,
  month,
}: GetApplyPeriodRequest) => {
  const response = await apiClient.get<GetApplyPeriodResponse>(
    WORK_SCHEDULES_URL.APPLY_PERIOD,
    { params: { year, month } },
  );

  return response.details;
};

// 근무 일정 신청
export const applyWorkSchedulesApi = async (
  body: ApplyWorkSchedulesRequest,
) => {
  const response = await apiClient.post<ApplyWorkSchedulesResponse>(
    WORK_SCHEDULES_URL.APPLY,
    body,
  );

  return response.details;
};

// 근무 시간표 수정 요청
export const editWorkSchedulesApi = async (body: EditWorkSchedulesRequest) => {
  const response = await apiClient.post<EditWorkSchedulesResponse>(
    WORK_SCHEDULES_URL.EDIT,
    body,
  );

  return response.details;
};
