"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import {
  bulkApproveAdminWorkChangeRequestsApi,
  getAdminWorkChangeRequestsApi,
  updateAdminWorkChangeRequestApi,
} from "./work-change-requests.api";
import { ADMIN_WORK_CHANGE_REQUESTS_QUERY_KEY } from "./work-change-requests.key";
import type {
  BulkApproveAdminWorkChangeRequestsRequest,
  BulkApproveAdminWorkChangeRequestsResponse,
  GetAdminWorkChangeRequestsRequest,
  GetAdminWorkChangeRequestsResponse,
  UpdateAdminWorkChangeRequestRequest,
  UpdateAdminWorkChangeRequestResponse,
} from "./work-change-requests.types";

const ADMIN_WORK_CHANGE_REQUESTS_CACHE_TIME = {
  LIST: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetAdminWorkChangeRequestsQuery = (
  params: GetAdminWorkChangeRequestsRequest,
) => {
  const {
    data: adminWorkChangeRequestsData,
    isPending: isPendingAdminWorkChangeRequests,
    isError: isErrorAdminWorkChangeRequests,
    error: adminWorkChangeRequestsError,
  } = useQuery<GetAdminWorkChangeRequestsResponse, ApiError>({
    queryKey: ADMIN_WORK_CHANGE_REQUESTS_QUERY_KEY.LIST(params),
    queryFn: () => getAdminWorkChangeRequestsApi(params),
    retry: 1,
    staleTime: ADMIN_WORK_CHANGE_REQUESTS_CACHE_TIME.LIST.STALE,
    gcTime: ADMIN_WORK_CHANGE_REQUESTS_CACHE_TIME.LIST.GC,
  });

  return {
    adminWorkChangeRequestsData,
    isPendingAdminWorkChangeRequests,
    isErrorAdminWorkChangeRequests,
    adminWorkChangeRequestsError,
  };
};

const useInvalidateAdminWorkChangeRequests = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ADMIN_WORK_CHANGE_REQUESTS_QUERY_KEY.ALL,
    });
  };
};

export const useUpdateAdminWorkChangeRequestMutation = () => {
  const invalidateAdminWorkChangeRequests =
    useInvalidateAdminWorkChangeRequests();

  const {
    mutate: updateAdminWorkChangeRequest,
    isPending: isPendingUpdateAdminWorkChangeRequest,
  } = useMutation<
    UpdateAdminWorkChangeRequestResponse,
    ApiError,
    UpdateAdminWorkChangeRequestRequest
  >({
    mutationFn: updateAdminWorkChangeRequestApi,
    onSuccess: invalidateAdminWorkChangeRequests,
    onError: () => {
      // TODO: 사용하는 화면에서 토스트 메시지 사용
    },
  });

  return {
    updateAdminWorkChangeRequest,
    isPendingUpdateAdminWorkChangeRequest,
  };
};

export const useBulkApproveAdminWorkChangeRequestsMutation = () => {
  const invalidateAdminWorkChangeRequests =
    useInvalidateAdminWorkChangeRequests();

  const {
    mutate: bulkApproveAdminWorkChangeRequests,
    isPending: isPendingBulkApproveAdminWorkChangeRequests,
  } = useMutation<
    BulkApproveAdminWorkChangeRequestsResponse,
    ApiError,
    BulkApproveAdminWorkChangeRequestsRequest
  >({
    mutationFn: bulkApproveAdminWorkChangeRequestsApi,
    onSuccess: invalidateAdminWorkChangeRequests,
    onError: () => {
      // TODO: 사용하는 화면에서 토스트 메시지 사용
    },
  });

  return {
    bulkApproveAdminWorkChangeRequests,
    isPendingBulkApproveAdminWorkChangeRequests,
  };
};
