"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";
import { WORK_SCHEDULES_QUERY_KEY } from "@/apis/work-schedules";

import {
  createAdminWorkScheduleApi,
  deleteAdminWorkScheduleApi,
  getAdminWorkScheduleQuickSearchApi,
  getAdminWorkSchedulesApi,
} from "./admin-work-schedules.api";
import { ADMIN_WORK_SCHEDULES_QUERY_KEY } from "./admin-work-schedules.key";
import type {
  CreateAdminWorkScheduleRequest,
  CreateAdminWorkScheduleResponse,
  DeleteAdminWorkScheduleRequest,
  DeleteAdminWorkScheduleResponse,
  GetAdminWorkScheduleQuickSearchRequest,
  GetAdminWorkScheduleQuickSearchResponse,
  GetAdminWorkSchedulesRequest,
  GetAdminWorkSchedulesResponse,
} from "./admin-work-schedules.types";

const ADMIN_WORK_SCHEDULES_CACHE_TIME = {
  SCHEDULES: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
  QUICK_SEARCH: {
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

// 배치·삭제는 그 슬롯뿐 아니라 같은 화면의 인원 수까지 바꾼다.
// 어느 조회 범위가 떠 있는지 알 수 없으므로 시간표 조회를 한꺼번에 무효화한다.
const useInvalidateAdminWorkSchedules = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ADMIN_WORK_SCHEDULES_QUERY_KEY.ALL,
    });
    queryClient.invalidateQueries({
      queryKey: WORK_SCHEDULES_QUERY_KEY.ALL,
    });
  };
};

export const useCreateAdminWorkScheduleMutation = () => {
  const invalidateAdminWorkSchedules = useInvalidateAdminWorkSchedules();

  const {
    mutate: createAdminWorkSchedule,
    isPending: isPendingCreateAdminWorkSchedule,
  } = useMutation<
    CreateAdminWorkScheduleResponse,
    ApiError,
    CreateAdminWorkScheduleRequest
  >({
    mutationFn: createAdminWorkScheduleApi,
    onSuccess: invalidateAdminWorkSchedules,
  });

  return {
    createAdminWorkSchedule,
    isPendingCreateAdminWorkSchedule,
  };
};

export const useDeleteAdminWorkScheduleMutation = () => {
  const invalidateAdminWorkSchedules = useInvalidateAdminWorkSchedules();

  const {
    mutate: deleteAdminWorkSchedule,
    isPending: isPendingDeleteAdminWorkSchedule,
  } = useMutation<
    DeleteAdminWorkScheduleResponse,
    ApiError,
    DeleteAdminWorkScheduleRequest
  >({
    mutationFn: deleteAdminWorkScheduleApi,
    onSuccess: invalidateAdminWorkSchedules,
  });

  return {
    deleteAdminWorkSchedule,
    isPendingDeleteAdminWorkSchedule,
  };
};

// 조회할 사용자를 고르기 전에는 보낼 userId가 없으므로 요청하지 않는다.
export const useGetAdminWorkScheduleQuickSearchQuery = ({
  userId,
  startDate,
  endDate,
  enabled = true,
}: GetAdminWorkScheduleQuickSearchRequest & { enabled?: boolean }) => {
  const params = { userId, startDate, endDate };

  const {
    data: adminWorkScheduleQuickSearchData,
    isPending: isPendingAdminWorkScheduleQuickSearch,
    // 최초 조회와 다시 받아 오는 경우를 모두 덮는다. 로딩 UI는 이 값을 쓴다.
    isFetching: isFetchingAdminWorkScheduleQuickSearch,
    isError: isErrorAdminWorkScheduleQuickSearch,
    error: adminWorkScheduleQuickSearchError,
  } = useQuery<GetAdminWorkScheduleQuickSearchResponse, ApiError>({
    queryKey: ADMIN_WORK_SCHEDULES_QUERY_KEY.QUICK_SEARCH(params),
    queryFn: () => getAdminWorkScheduleQuickSearchApi(params),
    enabled: enabled && userId !== "",
    retry: 1,
    staleTime: ADMIN_WORK_SCHEDULES_CACHE_TIME.QUICK_SEARCH.STALE,
    gcTime: ADMIN_WORK_SCHEDULES_CACHE_TIME.QUICK_SEARCH.GC,
  });

  return {
    adminWorkScheduleQuickSearchData,
    isPendingAdminWorkScheduleQuickSearch,
    isFetchingAdminWorkScheduleQuickSearch,
    isErrorAdminWorkScheduleQuickSearch,
    adminWorkScheduleQuickSearchError,
  };
};
