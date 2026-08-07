import { apiClient } from "../api-client";
import { NOTIFICATIONS_URL } from "./notifications.endpoint";
import type {
  CheckNotificationsResponse,
  GetNewNotificationsResponse,
  GetNotificationsResponse,
} from "./notifications.types";

export const getNotificationsApi = async () => {
  const response = await apiClient.get<GetNotificationsResponse>(
    NOTIFICATIONS_URL.DEFAULT,
  );

  return response.details;
};

export const getNewNotificationsApi = async () => {
  const response = await apiClient.get<GetNewNotificationsResponse>(
    NOTIFICATIONS_URL.NEW,
  );

  return response.details;
};

export const checkNotificationsApi = async () => {
  const response = await apiClient.patch<CheckNotificationsResponse>(
    NOTIFICATIONS_URL.CHECK,
  );

  return response.details;
};
