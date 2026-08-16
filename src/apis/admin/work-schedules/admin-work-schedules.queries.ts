"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import {
  createAdminWorkScheduleApi,
  deleteAdminWorkScheduleApi,
  getAdminWorkSchedulesApi,
} from "./admin-work-schedules.api";
import { ADMIN_WORK_SCHEDULES_QUERY_KEY } from "./admin-work-schedules.key";
import type {
  CreateAdminWorkScheduleRequest,
  CreateAdminWorkScheduleResponse,
  DeleteAdminWorkScheduleRequest,
  DeleteAdminWorkScheduleResponse,
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

// 배치·삭제는 그 슬롯뿐 아니라 같은 화면의 인원 수까지 바꾼다.
// 어느 조회 범위가 떠 있는지 알 수 없으므로 시간표 조회를 한꺼번에 무효화한다.
const useInvalidateAdminWorkSchedules = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ADMIN_WORK_SCHEDULES_QUERY_KEY.ALL,
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
