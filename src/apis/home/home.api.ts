import { apiClient } from "../api-client";
import { HOME_URL } from "./home.endpoint";
import type {
  CheckInHomeRequest,
  CheckInHomeResponse,
  GetHomeTodayResponse,
} from "./home.types";

export const getHomeTodayApi = async () => {
  const response = await apiClient.get<GetHomeTodayResponse>(HOME_URL.TODAY);

  return response.details;
};

export const checkInHomeApi = async (body: CheckInHomeRequest) => {
  const response = await apiClient.post<CheckInHomeResponse>(
    HOME_URL.CHECK_IN,
    body,
  );

  return response.details;
};
