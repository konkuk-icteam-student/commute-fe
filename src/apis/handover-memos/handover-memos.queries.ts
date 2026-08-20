"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import {
  createHandoverMemoApi,
  deleteHandoverMemoApi,
  getHandoverMemosApi,
} from "./handover-memos.api";
import { HANDOVER_MEMOS_QUERY_KEY } from "./handover-memos.key";
import type {
  CreateHandoverMemoRequest,
  CreateHandoverMemoResponse,
  DeleteHandoverMemoRequest,
  DeleteHandoverMemoResponse,
  GetHandoverMemosRequest,
  GetHandoverMemosResponse,
} from "./handover-memos.types";

const HANDOVER_MEMOS_CACHE_TIME = {
  LIST: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetHandoverMemosQuery = ({
  date,
  enabled = true,
}: GetHandoverMemosRequest & { enabled?: boolean }) => {
  const {
    data: handoverMemosData,
    isPending: isPendingHandoverMemos,
    isFetching: isFetchingHandoverMemos,
    isError: isErrorHandoverMemos,
    error: handoverMemosError,
    refetch: refetchHandoverMemos,
  } = useQuery<GetHandoverMemosResponse, ApiError>({
    queryKey: HANDOVER_MEMOS_QUERY_KEY.LIST(date),
    queryFn: () => getHandoverMemosApi({ date }),
    enabled: enabled && date.length > 0,
    retry: 1,
    staleTime: HANDOVER_MEMOS_CACHE_TIME.LIST.STALE,
    gcTime: HANDOVER_MEMOS_CACHE_TIME.LIST.GC,
  });

  return {
    handoverMemosData,
    isPendingHandoverMemos,
    isFetchingHandoverMemos,
    isErrorHandoverMemos,
    handoverMemosError,
    refetchHandoverMemos,
  };
};

const isMemoValidOnDate = (
  memo: CreateHandoverMemoResponse,
  date: string,
) => {
  const createdDate = memo.createdAt.slice(0, 10);
  const expiresDate = memo.expiresAt.slice(0, 10);

  return createdDate <= date && date < expiresDate;
};

export const useCreateHandoverMemoMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createHandoverMemo,
    isPending: isPendingCreateHandoverMemo,
  } = useMutation<
    CreateHandoverMemoResponse,
    ApiError,
    CreateHandoverMemoRequest
  >({
    mutationFn: createHandoverMemoApi,
    onSuccess: (createdMemo) => {
      const myCreatedMemo = { ...createdMemo, isMine: true };

      queryClient.setQueriesData<GetHandoverMemosResponse>(
        { queryKey: HANDOVER_MEMOS_QUERY_KEY.ALL },
        (currentMemosData) => {
          if (!currentMemosData) {
            return currentMemosData;
          }

          if (!isMemoValidOnDate(myCreatedMemo, currentMemosData.date)) {
            return currentMemosData;
          }

          if (
            currentMemosData.memos.some(
              (handoverMemo) => handoverMemo.memoId === myCreatedMemo.memoId,
            )
          ) {
            return currentMemosData;
          }

          const memos = [...currentMemosData.memos, myCreatedMemo];

          return {
            ...currentMemosData,
            memoCount: memos.length,
            memos,
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: HANDOVER_MEMOS_QUERY_KEY.ALL,
      });
    },
  });

  return {
    createHandoverMemo,
    isPendingCreateHandoverMemo,
  };
};

export const useDeleteHandoverMemoMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteHandoverMemo,
    isPending: isPendingDeleteHandoverMemo,
    variables,
  } = useMutation<
    DeleteHandoverMemoResponse,
    ApiError,
    DeleteHandoverMemoRequest
  >({
    mutationFn: deleteHandoverMemoApi,
    onSuccess: (_deletedMemo, { memoId }) => {
      queryClient.setQueriesData<GetHandoverMemosResponse>(
        { queryKey: HANDOVER_MEMOS_QUERY_KEY.ALL },
        (currentMemosData) => {
          if (!currentMemosData) {
            return currentMemosData;
          }

          const memos = currentMemosData.memos.filter(
            (handoverMemo) => handoverMemo.memoId !== memoId,
          );

          return {
            ...currentMemosData,
            memoCount: memos.length,
            memos,
          };
        },
      );
    },
  });

  return {
    deleteHandoverMemo,
    isPendingDeleteHandoverMemo,
    pendingDeleteHandoverMemoId: isPendingDeleteHandoverMemo
      ? variables?.memoId
      : undefined,
  };
};
