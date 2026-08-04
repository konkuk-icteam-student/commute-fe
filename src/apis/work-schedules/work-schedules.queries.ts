"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  GetMonthlyWorkSchedulesRequest,
  GetMonthlyWorkSchedulesResponse,
  GetPeriodWorkSchedulesRequest,
  GetPeriodWorkSchedulesResponse,
} from "./work-schedules.types";
import { WORK_SCHEDULES_QUERY_KEY } from "./work-schedules.key";
import {
  getMonthlySchedulesApi,
  getPeriodSchedulesApi,
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
