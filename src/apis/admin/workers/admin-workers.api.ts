import { apiClient } from "@/apis/api-client";

import { ADMIN_WORKERS_URL } from "./admin-workers.endpoint";
import type {
  GetAdminWorkerDetailRequest,
  GetAdminWorkerDetailResponse,
  GetAdminWorkersRequest,
  GetAdminWorkersResponse,
  UpdateAdminWorkerRequest,
  UpdateAdminWorkerResponse,
} from "./admin-workers.types";

export const getAdminWorkersApi = async ({
  keyword,
  page = 0,
  size = 10,
  ...params
}: GetAdminWorkersRequest) => {
  const response = await apiClient.get<GetAdminWorkersResponse>(
    ADMIN_WORKERS_URL.LIST,
    {
      params: {
        ...params,
        ...(keyword ? { keyword } : {}),
        page,
        size,
      },
    },
  );

  return response.details;
};

export const getAdminWorkerDetailApi = async ({
  userId,
  date,
}: GetAdminWorkerDetailRequest) => {
  const response = await apiClient.get<GetAdminWorkerDetailResponse>(
    ADMIN_WORKERS_URL.DETAIL(userId),
    { params: { date } },
  );

  return response.details;
};

export const updateAdminWorkerApi = async ({
  userId,
  ...body
}: UpdateAdminWorkerRequest) => {
  const response = await apiClient.patch<
    UpdateAdminWorkerResponse,
    Omit<UpdateAdminWorkerRequest, "userId">
  >(ADMIN_WORKERS_URL.DETAIL(userId), body);

  return response.details;
};
