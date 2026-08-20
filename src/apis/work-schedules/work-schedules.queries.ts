"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { WORK_CHANGE_REQUESTS_QUERY_KEY } from "../work-change-requests";
import type {
  ApplyWorkSchedulesRequest,
  ApplyWorkSchedulesResponse,
  EditWorkSchedulesRequest,
  EditWorkSchedulesResponse,
  GetApplyPeriodRequest,
  GetApplyPeriodResponse,
  GetMonthlyLimitRequest,
  GetMonthlyLimitResponse,
  GetMonthlyWorkSchedulesRequest,
  GetMonthlyWorkSchedulesResponse,
  GetWorkSchedulesWithUsersRequest,
  GetWorkSchedulesWithUsersResponse,
  GetPeriodWorkSchedulesRequest,
  GetPeriodWorkSchedulesResponse,
  GetWorkSchedulesSummaryRequest,
  GetWorkSchedulesSummaryResponse,
} from "./work-schedules.types";
import { WORK_SCHEDULES_QUERY_KEY } from "./work-schedules.key";
import {
  applyWorkSchedulesApi,
  editWorkSchedulesApi,
  getApplyPeriodApi,
  getMonthlyLimitApi,
  getMonthlySchedulesApi,
  getWorkSchedulesWithUsersApi,
  getPeriodSchedulesApi,
  getWorkSchedulesSummaryApi,
} from "./work-schedules.api";
import { type ApiError } from "../api-client";

const WORK_SCHEDULES_CACHE_TIME = {
  WITH_USERS: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
  MONTHLY: {
    STALE: 1000 * 60 * 10,
    GC: 1000 * 60 * 15,
  },
  PERIOD: {
    STALE: 1000 * 60 * 10,
    GC: 1000 * 60 * 15,
  },
  SUMMARY: {
    STALE: 1000 * 60 * 10,
    GC: 1000 * 60 * 15,
  },
  MONTHLY_LIMIT: {
    STALE: 1000 * 60 * 10,
    GC: 1000 * 60 * 15,
  },
  // 신청 기간은 관리자가 바꾸면 화면 잠금 여부가 달라지므로 짧게 잡는다.
  APPLY_PERIOD: {
    STALE: 1000 * 60,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetWorkSchedulesWithUsersQuery = (
  params: GetWorkSchedulesWithUsersRequest,
) => {
  const {
    data: workSchedulesWithUsersData,
    isPending: isPendingWorkSchedulesWithUsers,
    isFetching: isFetchingWorkSchedulesWithUsers,
    isError: isErrorWorkSchedulesWithUsers,
    error: workSchedulesWithUsersError,
    refetch: refetchWorkSchedulesWithUsers,
  } = useQuery<GetWorkSchedulesWithUsersResponse, ApiError>({
    queryKey: WORK_SCHEDULES_QUERY_KEY.WITH_USERS(params),
    queryFn: () => getWorkSchedulesWithUsersApi(params),
    retry: 1,
    staleTime: WORK_SCHEDULES_CACHE_TIME.WITH_USERS.STALE,
    gcTime: WORK_SCHEDULES_CACHE_TIME.WITH_USERS.GC,
  });

  return {
    workSchedulesWithUsersData,
    isPendingWorkSchedulesWithUsers,
    isFetchingWorkSchedulesWithUsers,
    isErrorWorkSchedulesWithUsers,
    workSchedulesWithUsersError,
    refetchWorkSchedulesWithUsers,
  };
};

export const useGetAdminWorkSchedulesQuery = (
  params: GetWorkSchedulesWithUsersRequest,
) => {
  const {
    workSchedulesWithUsersData,
    isPendingWorkSchedulesWithUsers,
    isFetchingWorkSchedulesWithUsers,
    isErrorWorkSchedulesWithUsers,
    workSchedulesWithUsersError,
    refetchWorkSchedulesWithUsers,
  } = useGetWorkSchedulesWithUsersQuery(params);

  return {
    adminWorkSchedulesData: workSchedulesWithUsersData,
    isPendingAdminWorkSchedules: isPendingWorkSchedulesWithUsers,
    isFetchingAdminWorkSchedules: isFetchingWorkSchedulesWithUsers,
    isErrorAdminWorkSchedules: isErrorWorkSchedulesWithUsers,
    adminWorkSchedulesError: workSchedulesWithUsersError,
    refetchAdminWorkSchedules: refetchWorkSchedulesWithUsers,
  };
};

export const useGetMonthlySchedulesQuery = ({
  year,
  month,
}: GetMonthlyWorkSchedulesRequest) => {
  const {
    data: monthlySchedulesData,
    isPending: isPendingMonthlySchedules,
    isError: isErrorMonthlySchedules,
    error: monthlySchedulesError,
  } = useQuery<GetMonthlyWorkSchedulesResponse, ApiError>({
    queryKey: WORK_SCHEDULES_QUERY_KEY.MONTHLY(year, month),
    queryFn: () => getMonthlySchedulesApi({ year, month }),
    retry: 1,
    staleTime: WORK_SCHEDULES_CACHE_TIME.MONTHLY.STALE,
    gcTime: WORK_SCHEDULES_CACHE_TIME.MONTHLY.GC,
  });

  return {
    monthlySchedulesData,
    isPendingMonthlySchedules,
    isErrorMonthlySchedules,
    monthlySchedulesError,
  };
};

// 조회·신청·수정 요청 화면이 보고 있는 기간의 시간표를 가져온다.
// 날짜가 아직 정해지지 않았으면 enabled를 false로 넘겨 요청을 미룰 수 있다.
export const useGetPeriodSchedulesQuery = ({
  startDate,
  endDate,
  enabled = true,
}: GetPeriodWorkSchedulesRequest & { enabled?: boolean }) => {
  const {
    data: periodSchedulesData,
    isPending: isPendingPeriodSchedules,
    // 최초 조회와 새로고침을 모두 덮는다. 로딩 UI는 이 값을 쓴다.
    isFetching: isFetchingPeriodSchedules,
    isError: isErrorPeriodSchedules,
    error: periodSchedulesError,
    refetch: refetchPeriodSchedules,
  } = useQuery<GetPeriodWorkSchedulesResponse, ApiError>({
    queryKey: WORK_SCHEDULES_QUERY_KEY.PERIOD(startDate, endDate),
    queryFn: () => getPeriodSchedulesApi({ startDate, endDate }),
    enabled,
    retry: 1,
    staleTime: WORK_SCHEDULES_CACHE_TIME.PERIOD.STALE,
    gcTime: WORK_SCHEDULES_CACHE_TIME.PERIOD.GC,
  });

  return {
    periodSchedulesData,
    isPendingPeriodSchedules,
    isFetchingPeriodSchedules,
    isErrorPeriodSchedules,
    periodSchedulesError,
    refetchPeriodSchedules,
  };
};

// 화면이 보고 있는 주차의 주간·월간 근로시간 요약.
// 기간 조회와 같은 범위를 쓰므로 날짜가 정해지기 전에는 enabled로 미룰 수 있다.
export const useGetWorkSchedulesSummaryQuery = ({
  startDate,
  endDate,
  enabled = true,
}: GetWorkSchedulesSummaryRequest & { enabled?: boolean }) => {
  const {
    data: workSchedulesSummaryData,
    isPending: isPendingWorkSchedulesSummary,
    // 최초 조회와 새로고침을 모두 덮는다. 로딩 UI는 이 값을 쓴다.
    isFetching: isFetchingWorkSchedulesSummary,
    isError: isErrorWorkSchedulesSummary,
    error: workSchedulesSummaryError,
    refetch: refetchWorkSchedulesSummary,
  } = useQuery<GetWorkSchedulesSummaryResponse, ApiError>({
    queryKey: WORK_SCHEDULES_QUERY_KEY.SUMMARY(startDate, endDate),
    queryFn: () => getWorkSchedulesSummaryApi({ startDate, endDate }),
    enabled,
    retry: 1,
    staleTime: WORK_SCHEDULES_CACHE_TIME.SUMMARY.STALE,
    gcTime: WORK_SCHEDULES_CACHE_TIME.SUMMARY.GC,
  });

  return {
    workSchedulesSummaryData,
    isPendingWorkSchedulesSummary,
    isFetchingWorkSchedulesSummary,
    isErrorWorkSchedulesSummary,
    workSchedulesSummaryError,
    refetchWorkSchedulesSummary,
  };
};

// 해당 연월의 최대 동시 근무 인원.
// 지금은 기간 조회 응답의 maxConcurrentWorkers를 쓰고 있어 화면에서 호출하지 않는다.
// 별도로 필요해질 때를 대비해 준비만 해 둔다.
export const useGetMonthlyLimitQuery = ({
  year,
  month,
  enabled = true,
}: GetMonthlyLimitRequest & { enabled?: boolean }) => {
  const {
    data: monthlyLimitData,
    isPending: isPendingMonthlyLimit,
    isError: isErrorMonthlyLimit,
    error: monthlyLimitError,
  } = useQuery<GetMonthlyLimitResponse, ApiError>({
    queryKey: WORK_SCHEDULES_QUERY_KEY.MONTHLY_LIMIT(year, month),
    queryFn: () => getMonthlyLimitApi({ year, month }),
    enabled,
    retry: 1,
    staleTime: WORK_SCHEDULES_CACHE_TIME.MONTHLY_LIMIT.STALE,
    gcTime: WORK_SCHEDULES_CACHE_TIME.MONTHLY_LIMIT.GC,
  });

  return {
    monthlyLimitData,
    isPendingMonthlyLimit,
    isErrorMonthlyLimit,
    monthlyLimitError,
  };
};

// 해당 연월에 근로 신청·수정 요청을 할 수 있는지와 그 신청 기간.
// 설정이 없는 달이면 신청은 막히고 수정 요청만 열린 상태로 온다.
export const useGetApplyPeriodQuery = ({
  year,
  month,
  enabled = true,
}: GetApplyPeriodRequest & { enabled?: boolean }) => {
  const {
    data: applyPeriodData,
    isPending: isPendingApplyPeriod,
    isFetching: isFetchingApplyPeriod,
    isError: isErrorApplyPeriod,
    error: applyPeriodError,
    refetch: refetchApplyPeriod,
  } = useQuery<GetApplyPeriodResponse, ApiError>({
    queryKey: WORK_SCHEDULES_QUERY_KEY.APPLY_PERIOD(year, month),
    queryFn: () => getApplyPeriodApi({ year, month }),
    enabled,
    retry: 1,
    staleTime: WORK_SCHEDULES_CACHE_TIME.APPLY_PERIOD.STALE,
    gcTime: WORK_SCHEDULES_CACHE_TIME.APPLY_PERIOD.GC,
  });

  return {
    applyPeriodData,
    isPendingApplyPeriod,
    isFetchingApplyPeriod,
    isErrorApplyPeriod,
    applyPeriodError,
    refetchApplyPeriod,
  };
};

// 제출이 반영되면 화면에 떠 있는 시간표가 낡으므로 다시 받아 오게 한다.
const useInvalidateWorkSchedules = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: WORK_SCHEDULES_QUERY_KEY.ALL });
    queryClient.invalidateQueries({
      queryKey: WORK_CHANGE_REQUESTS_QUERY_KEY.ALL,
    });
  };
};

// 근로 일정 신청. 결과 모달에 쓸 성공·실패 구간이 응답으로 온다.
export const useApplyWorkSchedulesMutation = () => {
  const invalidateWorkSchedules = useInvalidateWorkSchedules();

  const { mutate: applyWorkSchedules, isPending: isPendingApplyWorkSchedules } =
    useMutation<
      ApplyWorkSchedulesResponse,
      ApiError,
      ApplyWorkSchedulesRequest
    >({
      mutationFn: applyWorkSchedulesApi,
      onSuccess: invalidateWorkSchedules,
      onError: () => {
        // TODO(#101): 실패를 Toast로 안내한다
      },
    });

  return { applyWorkSchedules, isPendingApplyWorkSchedules };
};

// 근무 시간표 수정 요청. 승인 대기 상태로 접수되므로 시간표는 바로 바뀌지 않는다.
export const useEditWorkSchedulesMutation = () => {
  const invalidateWorkSchedules = useInvalidateWorkSchedules();

  const { mutate: editWorkSchedules, isPending: isPendingEditWorkSchedules } =
    useMutation<EditWorkSchedulesResponse, ApiError, EditWorkSchedulesRequest>({
      mutationFn: editWorkSchedulesApi,
      onSuccess: invalidateWorkSchedules,
      onError: () => {
        // TODO(#101): 실패를 Toast로 안내한다
      },
    });

  return { editWorkSchedules, isPendingEditWorkSchedules };
};
