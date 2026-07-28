import { create, type AxiosRequestConfig } from "axios";

import { getAccessToken } from "./token-storage";

// TODO: 추후 권한 없는 경우에 대한 대응도 추가해야함 (token 관련)

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
  isSuccess: true;
  message: string;
  details: null;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ApiClientResponse<T> = {
  isSuccess: true;
  message: string;
  details: T;
};

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
}

const axiosInstance = create({
  baseURL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(async (config) => {
  if (config.skipAuth) {
    return config;
  }

  const token = await getAccessToken();

  //   if (!token) {
  //     throw new AuthRequiredError();
  //   }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

const request = async <T>(
  config: AxiosRequestConfig,
): Promise<ApiClientResponse<T>> => {
  //   const shouldHandleAuthError = !config.skipAuth;

  try {
    const response = await axiosInstance.request<ApiResponse<T>>(config);
    const responseData = response.data;

    if (!responseData.details) throw Error();

    return {
      isSuccess: responseData.isSuccess,
      message: responseData.message,
      details: responseData.details,
    };
  } catch (error) {
    // if (error instanceof AuthRequiredError) {
    //   await clearAuthAndRedirectToLogin();
    //   throw error;
    // }

    // if (error instanceof ApiError) {
    //   if (
    //     shouldHandleAuthError &&
    //     isAuthError({ code: error.code, status: error.status })
    //   ) {
    //     await clearAuthAndRedirectToLogin();
    //   }

    //   throw error;
    // }

    // if (
    //   error instanceof AxiosError &&
    //   isApiErrorResponse(error.response?.data)
    // ) {
    //   const apiError = new ApiError(error.response.data, error.response.status);

    //     if (
    //       shouldHandleAuthError &&
    //       isAuthError({ code: apiError.code, status: apiError.status })
    //     ) {
    //       await clearAuthAndRedirectToLogin();
    //     }

    //   throw apiError;
    // }

    // if (
    //   error instanceof AxiosError &&
    //   shouldHandleAuthError &&
    //   isAuthError({ status: error.response?.status })
    // ) {
    //   await clearAuthAndRedirectToLogin();
    // }

    throw error;
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
