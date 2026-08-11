"use client";

import { useQuery } from "@tanstack/react-query";

import { type ApiError } from "../api-client";
import { getWorkChangeRequestHistoryApi } from "./work-change-requests.api";
import { WORK_CHANGE_REQUESTS_QUERY_KEY } from "./work-change-requests.key";
import type {
  WorkChangeRequestHistoryParams,
  WorkChangeRequestHistoryResponse,
} from "./work-change-requests.types";

const WORK_CHANGE_REQUESTS_CACHE_TIME = {
  HISTORY: {
    STALE: 1000 * 60,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetWorkChangeRequestHistoryQuery = (
  params: WorkChangeRequestHistoryParams = {},
) => {
  const {
    data: workChangeRequestHistoryData,
    isPending: isPendingWorkChangeRequestHistory,
    isError: isErrorWorkChangeRequestHistory,
    error: workChangeRequestHistoryError,
    refetch: refetchWorkChangeRequestHistory,
  } = useQuery<WorkChangeRequestHistoryResponse, ApiError>({
    queryKey: WORK_CHANGE_REQUESTS_QUERY_KEY.HISTORY(params),
    queryFn: () => getWorkChangeRequestHistoryApi(params),
    retry: false,
    staleTime: WORK_CHANGE_REQUESTS_CACHE_TIME.HISTORY.STALE,
    gcTime: WORK_CHANGE_REQUESTS_CACHE_TIME.HISTORY.GC,
  });

  return {
    workChangeRequestHistoryData,
    isPendingWorkChangeRequestHistory,
    isErrorWorkChangeRequestHistory,
    workChangeRequestHistoryError,
    refetchWorkChangeRequestHistory,
  };
};
