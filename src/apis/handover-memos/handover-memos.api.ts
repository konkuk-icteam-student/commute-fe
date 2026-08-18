import { apiClient } from "@/apis/api-client";

import { HANDOVER_MEMOS_URL } from "./handover-memos.endpoint";
import type {
  CreateHandoverMemoRequest,
  CreateHandoverMemoResponse,
  DeleteHandoverMemoRequest,
  DeleteHandoverMemoResponse,
  GetHandoverMemosRequest,
  GetHandoverMemosResponse,
} from "./handover-memos.types";

export const getHandoverMemosApi = async ({ date }: GetHandoverMemosRequest) => {
  const response = await apiClient.get<GetHandoverMemosResponse>(
    HANDOVER_MEMOS_URL.DEFAULT,
    {
      params: { date },
    },
  );

  return response.details;
};

export const createHandoverMemoApi = async ({
  content,
}: CreateHandoverMemoRequest) => {
  const response = await apiClient.post<
    CreateHandoverMemoResponse,
    CreateHandoverMemoRequest
  >(HANDOVER_MEMOS_URL.DEFAULT, { content });

  return response.details;
};

export const deleteHandoverMemoApi = async ({
  memoId,
}: DeleteHandoverMemoRequest) => {
  const response = await apiClient.delete<DeleteHandoverMemoResponse>(
    HANDOVER_MEMOS_URL.DETAIL(memoId),
  );

  return response.details;
};
