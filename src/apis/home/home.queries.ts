"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type ApiError } from "../api-client";
import { checkInHomeApi, getHomeTodayApi } from "./home.api";
import { HOME_QUERY_KEY, invalidateHomeQueries } from "./home.key";
import type {
  CheckInHomeRequest,
  CheckInHomeResponse,
  GetHomeTodayResponse,
} from "./home.types";

const HOME_CACHE_TIME = {
  TODAY: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetHomeTodayQuery = () => {
  const {
    data: homeTodayData,
    isPending: isPendingHomeToday,
    isError: isErrorHomeToday,
    error: homeTodayError,
    refetch: refetchHomeToday,
  } = useQuery<GetHomeTodayResponse, ApiError>({
    queryKey: HOME_QUERY_KEY.TODAY,
    queryFn: getHomeTodayApi,
    retry: 1,
    staleTime: HOME_CACHE_TIME.TODAY.STALE,
    gcTime: HOME_CACHE_TIME.TODAY.GC,
  });

  return {
    homeTodayData,
    isPendingHomeToday,
    isErrorHomeToday,
    homeTodayError,
    refetchHomeToday,
  };
};

const useInvalidateHome = () => {
  const queryClient = useQueryClient();

  return () => invalidateHomeQueries(queryClient);
};

export const useCheckInHomeMutation = () => {
  const invalidateHome = useInvalidateHome();

  const {
    mutate: checkInHome,
    isPending: isPendingCheckInHome,
    error: checkInHomeError,
  } = useMutation<CheckInHomeResponse, ApiError, CheckInHomeRequest>({
    mutationFn: checkInHomeApi,
    onSuccess: invalidateHome,
  });

  return {
    checkInHome,
    isPendingCheckInHome,
    checkInHomeError,
  };
};
