"use client";

import { useQuery } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import { getAdminMeApi } from "./admin-me.api";
import { ADMIN_ME_QUERY_KEY } from "./admin-me.key";
import type { GetAdminMeResponse } from "./admin-me.types";

// 헤더에 계속 떠 있는 정보라 자주 바뀌지 않는다. 다른 조회보다 길게 잡는다.
const ADMIN_ME_CACHE_TIME = {
  DEFAULT: {
    STALE: 1000 * 60 * 5,
    GC: 1000 * 60 * 30,
  },
} as const;

export const useGetAdminMeQuery = () => {
  const {
    data: adminMeData,
    isPending: isPendingAdminMe,
    isFetching: isFetchingAdminMe,
    isError: isErrorAdminMe,
    error: adminMeError,
    refetch: refetchAdminMe,
  } = useQuery<GetAdminMeResponse, ApiError>({
    queryKey: ADMIN_ME_QUERY_KEY.DEFAULT,
    queryFn: getAdminMeApi,
    retry: 1,
    staleTime: ADMIN_ME_CACHE_TIME.DEFAULT.STALE,
    gcTime: ADMIN_ME_CACHE_TIME.DEFAULT.GC,
  });

  return {
    adminMeData,
    isPendingAdminMe,
    isFetchingAdminMe,
    isErrorAdminMe,
    adminMeError,
    refetchAdminMe,
  };
};
