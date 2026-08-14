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

const getAllAdminWorkChangeRequests = async (
  params: GetAdminWorkChangeRequestsRequest,
) => {
  const size = params.size ?? 100;
  const firstPage = await getAdminWorkChangeRequestsApi({
    ...params,
    page: 0,
    size,
  });
  const requests = [...firstPage.requests];

  for (let page = 1; page < firstPage.totalPages; page += 1) {
    const nextPage = await getAdminWorkChangeRequestsApi({
      ...params,
      page,
      size,
    });

    requests.push(...nextPage.requests);
  }

  return {
    ...firstPage,
    requests,
    page: 0,
    size,
  };
};

export const useGetAllAdminWorkChangeRequestsQuery = (
  params: GetAdminWorkChangeRequestsRequest,
) => {
  const {
    data: allAdminWorkChangeRequestsData,
    isPending: isPendingAllAdminWorkChangeRequests,
    isError: isErrorAllAdminWorkChangeRequests,
    error: allAdminWorkChangeRequestsError,
  } = useQuery<GetAdminWorkChangeRequestsResponse, ApiError>({
    queryKey: ADMIN_WORK_CHANGE_REQUESTS_QUERY_KEY.ALL_LIST(params),
    queryFn: () => getAllAdminWorkChangeRequests(params),
    retry: 1,
    staleTime: ADMIN_WORK_CHANGE_REQUESTS_CACHE_TIME.LIST.STALE,
    gcTime: ADMIN_WORK_CHANGE_REQUESTS_CACHE_TIME.LIST.GC,
  });

  return {
    allAdminWorkChangeRequestsData,
    isPendingAllAdminWorkChangeRequests,
    isErrorAllAdminWorkChangeRequests,
    allAdminWorkChangeRequestsError,
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
