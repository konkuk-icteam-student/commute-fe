"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ADMIN_USERS_QUERY_KEY } from "@/apis/admin/users/admin-users.key";
import { type ApiError } from "@/apis/api-client";

import {
  getAdminWorkerDetailApi,
  getAdminWorkersApi,
  updateAdminWorkerApi,
} from "./admin-workers.api";
import { ADMIN_WORKERS_QUERY_KEY } from "./admin-workers.key";
import type {
  GetAdminWorkerDetailRequest,
  GetAdminWorkerDetailResponse,
  GetAdminWorkersRequest,
  GetAdminWorkersResponse,
  UpdateAdminWorkerRequest,
  UpdateAdminWorkerResponse,
} from "./admin-workers.types";

const ADMIN_WORKERS_CACHE_TIME = {
  LIST: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
  DETAIL: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetAdminWorkersQuery = (params: GetAdminWorkersRequest) => {
  const {
    data: adminWorkersData,
    isPending: isPendingAdminWorkers,
    // 검색어와 페이지가 바뀔 때마다 다시 받아 오므로 로딩 UI는 이 값을 쓴다.
    isFetching: isFetchingAdminWorkers,
    isError: isErrorAdminWorkers,
    error: adminWorkersError,
    refetch: refetchAdminWorkers,
  } = useQuery<GetAdminWorkersResponse, ApiError>({
    queryKey: ADMIN_WORKERS_QUERY_KEY.LIST(params),
    queryFn: () => getAdminWorkersApi(params),
    retry: 1,
    staleTime: ADMIN_WORKERS_CACHE_TIME.LIST.STALE,
    gcTime: ADMIN_WORKERS_CACHE_TIME.LIST.GC,
  });

  return {
    adminWorkersData,
    isPendingAdminWorkers,
    isFetchingAdminWorkers,
    isErrorAdminWorkers,
    adminWorkersError,
    refetchAdminWorkers,
  };
};

// 목록에서 한 명을 고르기 전에는 보낼 userId가 없으므로 요청하지 않는다.
export const useGetAdminWorkerDetailQuery = ({
  userId,
  date,
  enabled = true,
}: GetAdminWorkerDetailRequest & { enabled?: boolean }) => {
  const params = { userId, date };

  const {
    data: adminWorkerDetailData,
    isPending: isPendingAdminWorkerDetail,
    isFetching: isFetchingAdminWorkerDetail,
    isError: isErrorAdminWorkerDetail,
    error: adminWorkerDetailError,
    refetch: refetchAdminWorkerDetail,
  } = useQuery<GetAdminWorkerDetailResponse, ApiError>({
    queryKey: ADMIN_WORKERS_QUERY_KEY.DETAIL(params),
    queryFn: () => getAdminWorkerDetailApi(params),
    enabled: enabled && userId > 0,
    retry: 1,
    staleTime: ADMIN_WORKERS_CACHE_TIME.DETAIL.STALE,
    gcTime: ADMIN_WORKERS_CACHE_TIME.DETAIL.GC,
  });

  return {
    adminWorkerDetailData,
    isPendingAdminWorkerDetail,
    isFetchingAdminWorkerDetail,
    isErrorAdminWorkerDetail,
    adminWorkerDetailError,
    refetchAdminWorkerDetail,
  };
};

// 수정한 값은 목록과 상세 양쪽에 걸쳐 있고, 어느 검색어·페이지가 떠 있는지 알 수 없다.
// 그래서 근무 인원 조회를 한꺼번에 무효화한다.
// 이름·학과·학번은 사용자 검색 결과에도 그대로 나오므로 그쪽 캐시까지 함께 지운다.
export const useUpdateAdminWorkerMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: updateAdminWorker, isPending: isPendingUpdateAdminWorker } =
    useMutation<UpdateAdminWorkerResponse, ApiError, UpdateAdminWorkerRequest>({
      mutationFn: updateAdminWorkerApi,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ADMIN_WORKERS_QUERY_KEY.ALL,
        });
        queryClient.invalidateQueries({
          queryKey: ADMIN_USERS_QUERY_KEY.ALL,
        });
      },
    });

  return {
    updateAdminWorker,
    isPendingUpdateAdminWorker,
  };
};
