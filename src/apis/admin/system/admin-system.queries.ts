"use client";

import { useQuery } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import { getAdminSystemCreatedYearApi } from "./admin-system.api";
import { ADMIN_SYSTEM_QUERY_KEY } from "./admin-system.key";
import type { GetAdminSystemCreatedYearResponse } from "./admin-system.types";

const ADMIN_SYSTEM_CACHE_TIME = {
  CREATED_YEAR: {
    STALE: 1000 * 60 * 60,
    GC: 1000 * 60 * 60,
  },
} as const;

export const useGetAdminSystemCreatedYearQuery = () => {
  const {
    data: adminSystemCreatedYearData,
    isPending: isPendingAdminSystemCreatedYear,
    isError: isErrorAdminSystemCreatedYear,
    error: adminSystemCreatedYearError,
  } = useQuery<GetAdminSystemCreatedYearResponse, ApiError>({
    queryKey: ADMIN_SYSTEM_QUERY_KEY.CREATED_YEAR,
    queryFn: getAdminSystemCreatedYearApi,
    retry: 1,
    staleTime: ADMIN_SYSTEM_CACHE_TIME.CREATED_YEAR.STALE,
    gcTime: ADMIN_SYSTEM_CACHE_TIME.CREATED_YEAR.GC,
  });

  return {
    adminSystemCreatedYearData,
    isPendingAdminSystemCreatedYear,
    isErrorAdminSystemCreatedYear,
    adminSystemCreatedYearError,
  };
};
