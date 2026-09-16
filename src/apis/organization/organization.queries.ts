"use client";

import { useQuery } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import { getOrganizationsApi } from "./organization.api";
import { ORGANIZATION_QUERY_KEY } from "./organization.key";
import type { GetOrganizationsResponse } from "./organization.types";

const ORGANIZATION_CACHE_TIME = {
  LIST: {
    STALE: 1000 * 60 * 10,
    GC: 1000 * 60 * 30,
  },
} as const;

export const useGetOrganizationsQuery = () => {
  const {
    data: organizationsData,
    isPending: isPendingOrganizations,
    isError: isErrorOrganizations,
    error: organizationsError,
  } = useQuery<GetOrganizationsResponse, ApiError>({
    queryKey: ORGANIZATION_QUERY_KEY.LIST,
    queryFn: getOrganizationsApi,
    retry: 1,
    staleTime: ORGANIZATION_CACHE_TIME.LIST.STALE,
    gcTime: ORGANIZATION_CACHE_TIME.LIST.GC,
  });

  return {
    organizationsData,
    isPendingOrganizations,
    isErrorOrganizations,
    organizationsError,
  };
};
