"use client";

import { useQuery } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import { getAdminWorkSchedulesApi } from "./admin-work-schedules.api";
import { ADMIN_WORK_SCHEDULES_QUERY_KEY } from "./admin-work-schedules.key";
import type {
  GetAdminWorkSchedulesRequest,
  GetAdminWorkSchedulesResponse,
} from "./admin-work-schedules.types";

const ADMIN_WORK_SCHEDULES_CACHE_TIME = {
  SCHEDULES: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetAdminWorkSchedulesQuery = (
  params: GetAdminWorkSchedulesRequest,
) => {
  const {
    data: adminWorkSchedulesData,
    isPending: isPendingAdminWorkSchedules,
    isFetching: isFetchingAdminWorkSchedules,
    isError: isErrorAdminWorkSchedules,
    error: adminWorkSchedulesError,
    refetch: refetchAdminWorkSchedules,
  } = useQuery<GetAdminWorkSchedulesResponse, ApiError>({
    queryKey: ADMIN_WORK_SCHEDULES_QUERY_KEY.SCHEDULES(params),
    queryFn: () => getAdminWorkSchedulesApi(params),
    retry: 1,
    staleTime: ADMIN_WORK_SCHEDULES_CACHE_TIME.SCHEDULES.STALE,
    gcTime: ADMIN_WORK_SCHEDULES_CACHE_TIME.SCHEDULES.GC,
  });

  return {
    adminWorkSchedulesData,
    isPendingAdminWorkSchedules,
    isFetchingAdminWorkSchedules,
    isErrorAdminWorkSchedules,
    adminWorkSchedulesError,
    refetchAdminWorkSchedules,
  };
};
