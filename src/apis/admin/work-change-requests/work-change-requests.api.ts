import { apiClient } from "@/apis/api-client";

import { ADMIN_WORK_CHANGE_REQUESTS_URL } from "./work-change-requests.endpoint";
import type {
  BulkApproveAdminWorkChangeRequestsRequest,
  BulkApproveAdminWorkChangeRequestsResponse,
  GetAdminWorkChangeRequestsRequest,
  GetAdminWorkChangeRequestsResponse,
  UpdateAdminWorkChangeRequestRequest,
  UpdateAdminWorkChangeRequestResponse,
} from "./work-change-requests.types";

export const getAdminWorkChangeRequestsApi = async ({
  statusCode = "ALL",
  page = 0,
  size = 10,
  ...params
}: GetAdminWorkChangeRequestsRequest) => {
  const response = await apiClient.get<GetAdminWorkChangeRequestsResponse>(
    ADMIN_WORK_CHANGE_REQUESTS_URL.LIST,
    {
      params: {
        ...params,
        statusCode,
        page,
        size,
      },
    },
  );

  return response.details;
};

export const updateAdminWorkChangeRequestApi = async ({
  requestId,
  statusCode,
  rejectReason = null,
}: UpdateAdminWorkChangeRequestRequest) => {
  const response = await apiClient.patch<
    UpdateAdminWorkChangeRequestResponse,
    Omit<UpdateAdminWorkChangeRequestRequest, "requestId">
  >(ADMIN_WORK_CHANGE_REQUESTS_URL.DETAIL(requestId), {
    statusCode,
    rejectReason,
  });

  return response.details;
};

export const bulkApproveAdminWorkChangeRequestsApi = async (
  body: BulkApproveAdminWorkChangeRequestsRequest,
) => {
  const response = await apiClient.patch<
    BulkApproveAdminWorkChangeRequestsResponse,
    BulkApproveAdminWorkChangeRequestsRequest
  >(ADMIN_WORK_CHANGE_REQUESTS_URL.BULK, body);

  return response.details;
};
