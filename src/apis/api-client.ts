import { create, isAxiosError, type AxiosRequestConfig } from "axios";

import {
  AuthRequiredError,
  clearAuthAndRedirectToLogin,
  isAuthError,
} from "./auth-guard";
import { getAccessToken } from "./token-storage";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export type ApiSuccessResponse<T> = {
  isSuccess: true;
  message: string;
  details: T;
};

export type ApiErrorResponse = {
  isSuccess: false;
  message: string;
  details: null;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ApiClientResponse<T> = ApiSuccessResponse<T>;

export class ApiError extends Error {
  readonly isSuccess = false;
  readonly details = null;

  constructor(
    response: ApiErrorResponse,
    readonly status?: number,
  ) {
    super(response.message);
    this.name = "ApiError";
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isApiErrorResponse = (
  value: unknown,
): value is ApiErrorResponse =>
  isRecord(value) &&
  value.isSuccess === false &&
  typeof value.message === "string" &&
  value.details === null;

const isApiSuccessResponse = <T>(
  value: ApiResponse<T>,
): value is ApiSuccessResponse<T> =>
  value.isSuccess === true && "details" in value;

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
}

const axiosInstance = create({
  baseURL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  if (config.skipAuth) {
    return config;
  }

  const token = getAccessToken();

  if (!token) {
    throw new AuthRequiredError();
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

const request = async <T>(
  config: AxiosRequestConfig,
): Promise<ApiClientResponse<T>> => {
  const shouldHandleAuthError = !config.skipAuth;

  try {
    const response = await axiosInstance.request<ApiResponse<T>>(config);
    const responseData = response.data;

    if (isApiErrorResponse(responseData)) {
      throw new ApiError(responseData, response.status);
    }

    if (!isApiSuccessResponse(responseData)) {
      throw new Error("Invalid API response.");
    }

    return responseData;
  } catch (error) {
    const normalizedError =
      isAxiosError(error) && isApiErrorResponse(error.response?.data)
        ? new ApiError(error.response.data, error.response?.status)
        : error;

    const shouldClearAuth =
      error instanceof AuthRequiredError ||
      (isAxiosError(error) && isAuthError({ status: error.response?.status }));

    if (shouldHandleAuthError && shouldClearAuth) {
      clearAuthAndRedirectToLogin();
    }

    throw normalizedError;
  }
};

export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "GET", url }),

  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "POST", url, data }),

  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "PUT", url, data }),

  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "PATCH", url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "DELETE", url }),
};
