import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { ApiError, apiClient, type ApiErrorResponse } from "../api-client";
import { AuthRequiredError } from "../auth-guard";

const createMemoryStorage = (): Storage => {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
};

const successAdapter = async (config: InternalAxiosRequestConfig) => ({
  config,
  data: {
    isSuccess: true as const,
    message: "ok",
    details: { value: "response" },
  },
  headers: {},
  status: 200,
  statusText: "OK",
});

const dataSuccessAdapter = async (config: InternalAxiosRequestConfig) => ({
  config,
  data: {
    isSuccess: true as const,
    message: "ok",
    data: { value: "response" },
  },
  headers: {},
  status: 200,
  statusText: "OK",
});

const noContentAdapter = async (config: InternalAxiosRequestConfig) => ({
  config,
  data: "",
  headers: {},
  status: 204,
  statusText: "No Content",
});

const createHttpErrorAdapter =
  (status: number, message = "해당 연월의 스케줄 설정을 찾을 수 없습니다.") =>
  async (config: InternalAxiosRequestConfig) => {
    const response: AxiosResponse<ApiErrorResponse> = {
      config,
      data: {
        isSuccess: false,
        message,
        details: null,
      },
      headers: {},
      status,
      statusText:
        status === 401
          ? "Unauthorized"
          : status === 403
            ? "Forbidden"
            : "Request Failed",
    };

    throw new AxiosError(
      response.statusText,
      AxiosError.ERR_BAD_REQUEST,
      config,
      undefined,
      response,
    );
  };

const malformedHttpErrorAdapter = async (
  config: InternalAxiosRequestConfig,
) => {
  const response: AxiosResponse<{ message: string }> = {
    config,
    data: { message: "unexpected response" },
    headers: {},
    status: 500,
    statusText: "Internal Server Error",
  };

  throw new AxiosError(
    response.statusText,
    AxiosError.ERR_BAD_RESPONSE,
    config,
    undefined,
    response,
  );
};

const isNormalizedApiError = (
  error: unknown,
  status: number,
  message: string,
) => {
  if (!(error instanceof ApiError)) {
    return false;
  }

  const candidate = error as ApiError & {
    isSuccess?: unknown;
    status?: number;
    details?: unknown;
  };

  return (
    candidate.name === "ApiError" &&
    candidate.isSuccess === false &&
    candidate.message === message &&
    candidate.status === status &&
    candidate.details === null
  );
};

describe("apiClient authentication guard", () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createMemoryStorage();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: storage,
    });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: storage },
    });
  });

  it("rejects a protected request and clears auth when the access token is missing", async () => {
    storage.setItem("refreshToken", "refresh-token");

    await assert.rejects(
      apiClient.get<{ value: string }>("/private", {
        adapter: successAdapter,
      }),
      AuthRequiredError,
    );

    assert.equal(storage.getItem("accessToken"), null);
    assert.equal(storage.getItem("refreshToken"), null);
  });

  it("normalizes the server error response and clears auth for HTTP 401", async () => {
    const message = "인증이 만료되었습니다.";
    storage.setItem("accessToken", "access-token");
    storage.setItem("refreshToken", "refresh-token");

    await assert.rejects(
      apiClient.get("/private", {
        adapter: createHttpErrorAdapter(401, message),
      }),
      (error: unknown) => isNormalizedApiError(error, 401, message),
    );

    assert.equal(storage.getItem("accessToken"), null);
    assert.equal(storage.getItem("refreshToken"), null);
  });

  it("normalizes HTTP 403 without clearing valid auth", async () => {
    const message = "해당 작업을 수행할 권한이 없습니다.";
    storage.setItem("accessToken", "access-token");
    storage.setItem("refreshToken", "refresh-token");

    await assert.rejects(
      apiClient.get("/private", {
        adapter: createHttpErrorAdapter(403, message),
      }),
      (error: unknown) => isNormalizedApiError(error, 403, message),
    );

    assert.equal(storage.getItem("accessToken"), "access-token");
    assert.equal(storage.getItem("refreshToken"), "refresh-token");
  });

  it("allows a skipAuth request without clearing stored auth", async () => {
    storage.setItem("refreshToken", "refresh-token");

    const response = await apiClient.get<{ value: string }>("/public", {
      adapter: successAdapter,
      skipAuth: true,
    });

    assert.deepEqual(response.details, { value: "response" });
    assert.equal(storage.getItem("refreshToken"), "refresh-token");
  });

  it("normalizes a data success response into details", async () => {
    const response = await apiClient.get<{ value: string }>("/public", {
      adapter: dataSuccessAdapter,
      skipAuth: true,
    });

    assert.deepEqual(response.details, { value: "response" });
  });

  it("allows a DELETE request with HTTP 204", async () => {
    const response = await apiClient.delete<void>("/public", {
      adapter: noContentAdapter,
      skipAuth: true,
    });

    assert.equal(response.details, undefined);
  });

  it("rejects a non-DELETE request with HTTP 204", async () => {
    await assert.rejects(
      apiClient.get<{ value: string }>("/public", {
        adapter: noContentAdapter,
        skipAuth: true,
      }),
      /Invalid API response/,
    );
  });

  it("normalizes a skipAuth HTTP 401 without clearing stored auth", async () => {
    const message = "로그인 정보가 올바르지 않습니다.";
    storage.setItem("accessToken", "access-token");
    storage.setItem("refreshToken", "refresh-token");

    await assert.rejects(
      apiClient.get("/public", {
        adapter: createHttpErrorAdapter(401, message),
        skipAuth: true,
      }),
      (error: unknown) => isNormalizedApiError(error, 401, message),
    );

    assert.equal(storage.getItem("accessToken"), "access-token");
    assert.equal(storage.getItem("refreshToken"), "refresh-token");
  });

  it("normalizes a non-authentication server error without clearing auth", async () => {
    const message = "해당 연월의 스케줄 설정을 찾을 수 없습니다.";
    storage.setItem("accessToken", "access-token");
    storage.setItem("refreshToken", "refresh-token");

    await assert.rejects(
      apiClient.get("/private", {
        adapter: createHttpErrorAdapter(500, message),
      }),
      (error: unknown) => isNormalizedApiError(error, 500, message),
    );

    assert.equal(storage.getItem("accessToken"), "access-token");
    assert.equal(storage.getItem("refreshToken"), "refresh-token");
  });

  it("preserves AxiosError when the response does not match the server contract", async () => {
    storage.setItem("accessToken", "access-token");
    storage.setItem("refreshToken", "refresh-token");

    await assert.rejects(
      apiClient.get("/private", {
        adapter: malformedHttpErrorAdapter,
      }),
      (error: unknown) =>
        error instanceof AxiosError && error.response?.status === 500,
    );

    assert.equal(storage.getItem("accessToken"), "access-token");
    assert.equal(storage.getItem("refreshToken"), "refresh-token");
  });
});
