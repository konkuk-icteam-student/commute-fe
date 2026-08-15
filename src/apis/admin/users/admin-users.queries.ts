"use client";

import { useQuery } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import { getAdminUserSearchApi } from "./admin-users.api";
import { ADMIN_USERS_QUERY_KEY } from "./admin-users.key";
import type {
  GetAdminUserSearchRequest,
  GetAdminUserSearchResponse,
} from "./admin-users.types";

const ADMIN_USERS_CACHE_TIME = {
  SEARCH: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

// 검색어가 비어 있으면 서버가 받지 않으므로 요청을 보내지 않는다.
// 입력창을 비운 사이에 400이 뜨는 것을 막는다.
export const useGetAdminUserSearchQuery = ({
  keyword,
  enabled = true,
}: GetAdminUserSearchRequest & { enabled?: boolean }) => {
  const trimmedKeyword = keyword.trim();

  const {
    data: adminUserSearchData,
    isPending: isPendingAdminUserSearch,
    // 최초 조회와 재검색을 모두 덮는다. 로딩 UI는 이 값을 쓴다.
    isFetching: isFetchingAdminUserSearch,
    isError: isErrorAdminUserSearch,
    error: adminUserSearchError,
  } = useQuery<GetAdminUserSearchResponse, ApiError>({
    queryKey: ADMIN_USERS_QUERY_KEY.SEARCH(trimmedKeyword),
    queryFn: () => getAdminUserSearchApi({ keyword: trimmedKeyword }),
    enabled: enabled && trimmedKeyword.length > 0,
    retry: 1,
    staleTime: ADMIN_USERS_CACHE_TIME.SEARCH.STALE,
    gcTime: ADMIN_USERS_CACHE_TIME.SEARCH.GC,
  });

  return {
    adminUserSearchData,
    isPendingAdminUserSearch,
    isFetchingAdminUserSearch,
    isErrorAdminUserSearch,
    adminUserSearchError,
  };
};
