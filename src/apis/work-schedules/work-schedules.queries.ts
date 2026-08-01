"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  GetMonthlyWorkSchedulesRequest,
  GetMonthlyWorkSchedulesResponse,
} from "./work-schedules.types";
import { WORK_SCHEDULES_QUERY_KEY } from "./work-schedules.key";
import { getMonthlySchedulesApi } from "./work-schedules.api";
import { type ApiError } from "../api-client";

const WORK_SCHEDULES_CACHE_TIME = {
  MONTHLY: {
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
