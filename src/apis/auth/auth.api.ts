import { apiClient } from "../api-client";
import { AUTH_URL } from "./auth.endpoint";
import type { LogoutResponse } from "./auth.types";

export const logoutApi = async () => {
  const response = await apiClient.post<LogoutResponse>(AUTH_URL.LOGOUT);

  return response.details;
};
