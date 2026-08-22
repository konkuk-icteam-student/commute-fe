import { create, isAxiosError, type AxiosRequestConfig } from "axios";

import { AUTH_URL } from "./auth/auth.endpoint";
import type { RefreshTokenResponse } from "./auth/auth.types";
import {
  AuthRequiredError,
  clearAuth,
  isAuthError,
  isForbiddenError,
} from "./auth-guard";
import { showAuthNotice } from "./auth-notice";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setRoleCode,
  setTokenExpiresAt,
} from "./token-storage";

declare module "axios" {
  export interface AxiosRequestConfig {
    allowNoContent?: boolean;
    skipAuth?: boolean;
    // 재발급 후 딱 한 번만 다시 보낸다. 이 표시가 있으면 또 재발급하지 않는다.
    isRetryAfterRefresh?: boolean;
  }
}

export type ApiSuccessResponse<T> = {
  isSuccess: true;
  message: string;
  details: T;
};

type ApiDataSuccessResponse<T> = {
  isSuccess: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  isSuccess?: false;
  status?: number;
  code?: string;
  message: string;
  details?: null;
};

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiDataSuccessResponse<T>
  | ApiErrorResponse;

export type ApiClientResponse<T> = ApiSuccessResponse<T>;

export class ApiError extends Error {
  readonly isSuccess = false;
  readonly details = null;
  readonly status?: number;

  constructor(response: ApiErrorResponse, status?: number) {
    super(response.message);
    this.name = "ApiError";
    this.status = status;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isApiErrorResponse = (value: unknown): value is ApiErrorResponse =>
  isRecord(value) &&
  (value.isSuccess === false ||
    typeof value.status === "number" ||
    typeof value.code === "string") &&
  typeof value.message === "string" &&
  (!("details" in value) || value.details === null);

const isApiSuccessResponse = <T>(
  value: ApiResponse<T>,
): value is ApiSuccessResponse<T> =>
  value.isSuccess === true && "details" in value;

const isApiDataSuccessResponse = <T>(
  value: ApiResponse<T>,
): value is ApiDataSuccessResponse<T> =>
  value.isSuccess === true && "data" in value;

// 인증이 끊겼을 때는 서버 문구 대신 다음에 할 일을 알려 준다.
const AUTH_REQUIRED_MESSAGE = "인증이 필요합니다.\n로그인 화면으로 이동합니다.";
// 서버가 문구를 주지 않았을 때 권한 안내에 쓸 기본값.
const FORBIDDEN_DEFAULT_MESSAGE = "접근 권한이 없습니다.";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
}

const axiosInstance = create({
  baseURL,
  timeout: 10000,
});

// 재발급은 이 안에서 스스로 호출하므로 호출부가 config를 넘길 수 없다.
// 그 경로까지 검증하려면 인스턴스째로 어댑터를 갈아 끼워야 해서 테스트용으로 내보낸다.
export const apiAxiosInstance = axiosInstance;

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

// 저장된 refreshToken으로 accessToken을 다시 받아 온다.
// 재발급 요청 자체는 accessToken을 쓰지 않으므로 skipAuth로 보낸다.
const requestNewAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const { details } = await request<RefreshTokenResponse>({
      method: "POST",
      url: AUTH_URL.REFRESH,
      data: { refreshToken },
      skipAuth: true,
    });

    if (!details?.accessToken) {
      return false;
    }

    setAccessToken(details.accessToken);

    // 서버가 함께 내려준 값만 갱신한다. 오지 않은 값은 기존 것을 그대로 둔다.
    if (details.refreshToken) {
      setRefreshToken(details.refreshToken);
    }

    if (details.roleCode) {
      setRoleCode(details.roleCode);
    }

    if (details.tokenExpiresAt !== undefined) {
      setTokenExpiresAt(details.tokenExpiresAt);
    }

    return true;
  } catch {
    return false;
  }
};

// 한 화면에서 여러 조회가 동시에 401을 맞을 수 있다.
// 재발급은 한 번만 돌리고 나머지 요청은 그 결과를 기다렸다가 다시 보낸다.
let refreshTokenPromise: Promise<boolean> | null = null;

const refreshAccessToken = () => {
  refreshTokenPromise ??= requestNewAccessToken().finally(() => {
    refreshTokenPromise = null;
  });

  return refreshTokenPromise;
};

const request = async <T>(
  config: AxiosRequestConfig,
): Promise<ApiClientResponse<T>> => {
  const shouldHandleAuthError = !config.skipAuth;

  try {
    const response = await axiosInstance.request<ApiResponse<T>>(config);
    const responseData = response.data;

    if (response.status === 204 && config.allowNoContent) {
      return {
        isSuccess: true,
        message: "",
        details: undefined as T,
      };
    }

    if (isApiErrorResponse(responseData)) {
      throw new ApiError(responseData, response.status);
    }

    if (!isApiSuccessResponse(responseData)) {
      if (isApiDataSuccessResponse(responseData)) {
        return {
          isSuccess: true,
          message: responseData.message,
          details: responseData.data,
        };
      }

      throw new Error("Invalid API response.");
    }

    return responseData;
  } catch (error) {
    const normalizedError =
      isAxiosError(error) && isApiErrorResponse(error.response?.data)
        ? new ApiError(error.response.data, error.response?.status)
        : error;

    // accessToken이 아예 없는 경우도 같게 다룬다. refreshToken이 있으면 거기서 다시 받아 온다.
    const isUnauthorized =
      error instanceof AuthRequiredError ||
      (isAxiosError(error) && isAuthError({ status: error.response?.status }));

    if (shouldHandleAuthError && isUnauthorized) {
      if (!config.isRetryAfterRefresh && (await refreshAccessToken())) {
        return request<T>({ ...config, isRetryAfterRefresh: true });
      }

      // 재발급할 refreshToken이 없거나 재발급에 실패했다. 더 할 수 있는 게 없다.
      // 저장된 값은 지금 지우고, 로그인 화면으로 보내는 것은 사용자가 안내를 확인한 뒤에 한다.
      clearAuth();
      showAuthNotice({
        message: AUTH_REQUIRED_MESSAGE,
        shouldRedirectToLogin: true,
      });
    }

    // 권한이 없는 화면이라 화면별로 알릴 일이 아니다. 루트의 모달 하나가 안내한다.
    if (
      shouldHandleAuthError &&
      isAxiosError(error) &&
      isForbiddenError({ status: error.response?.status })
    ) {
      showAuthNotice({
        message:
          normalizedError instanceof ApiError && normalizedError.message
            ? normalizedError.message
            : FORBIDDEN_DEFAULT_MESSAGE,
        shouldRedirectToLogin: false,
      });
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
    request<T>({ ...config, allowNoContent: true, method: "DELETE", url }),
};
