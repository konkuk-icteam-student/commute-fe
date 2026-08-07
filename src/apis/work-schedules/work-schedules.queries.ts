"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  ApplyWorkSchedulesRequest,
  ApplyWorkSchedulesResponse,
  EditWorkSchedulesRequest,
  EditWorkSchedulesResponse,
  GetMonthlyLimitRequest,
  GetMonthlyLimitResponse,
  GetMonthlyWorkSchedulesRequest,
  GetMonthlyWorkSchedulesResponse,
  GetPeriodWorkSchedulesRequest,
  GetPeriodWorkSchedulesResponse,
  GetWorkSchedulesSummaryRequest,
  GetWorkSchedulesSummaryResponse,
} from "./work-schedules.types";
import { WORK_SCHEDULES_QUERY_KEY } from "./work-schedules.key";
import {
  applyWorkSchedulesApi,
  editWorkSchedulesApi,
  getMonthlyLimitApi,
  getMonthlySchedulesApi,
  getPeriodSchedulesApi,
  getWorkSchedulesSummaryApi,
} from "./work-schedules.api";
import { type ApiError } from "../api-client";

const WORK_SCHEDULES_CACHE_TIME = {
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
} as const;

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
    isError: isErrorPeriodSchedules,
    error: periodSchedulesError,
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
    isErrorPeriodSchedules,
    periodSchedulesError,
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
    isError: isErrorWorkSchedulesSummary,
    error: workSchedulesSummaryError,
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
    isErrorWorkSchedulesSummary,
    workSchedulesSummaryError,
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

// 제출이 반영되면 화면에 떠 있는 시간표가 낡으므로 다시 받아 오게 한다.
const useInvalidateWorkSchedules = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({ queryKey: WORK_SCHEDULES_QUERY_KEY.ALL });
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
