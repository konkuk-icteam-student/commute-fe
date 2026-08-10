"use client";

import { useQuery } from "@tanstack/react-query";

import { type ApiError } from "../api-client";
import { getMyPageApi } from "./my-page.api";
import { MY_PAGE_QUERY_KEY } from "./my-page.key";
import type { GetMyPageResponse } from "./my-page.types";

const MY_PAGE_CACHE_TIME = {
  DEFAULT: {
    STALE: 1000 * 60,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetMyPageQuery = () => {
  const {
    data: myPageData,
    isPending: isPendingMyPage,
    isError: isErrorMyPage,
    error: myPageError,
    refetch: refetchMyPage,
  } = useQuery<GetMyPageResponse, ApiError>({
    queryKey: MY_PAGE_QUERY_KEY.DEFAULT,
    queryFn: getMyPageApi,
    retry: 1,
    staleTime: MY_PAGE_CACHE_TIME.DEFAULT.STALE,
    gcTime: MY_PAGE_CACHE_TIME.DEFAULT.GC,
  });

  return {
    myPageData,
    isPendingMyPage,
    isErrorMyPage,
    myPageError,
    refetchMyPage,
  };
};
