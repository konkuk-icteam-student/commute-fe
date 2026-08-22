import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { InternalAxiosRequestConfig } from "axios";

import { apiAxiosInstance, apiClient } from "../api-client";
import { AUTH_URL } from "../auth/auth.endpoint";
import { getAuthNotice, clearAuthNotice } from "../auth-notice";

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

const createResponse = (
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
) => ({
  config,
  data,
  headers: {},
  status,
  statusText: String(status),
});

const successBody = (details: unknown) => ({
  isSuccess: true as const,
  message: "ok",
  details,
});

const unauthorizedBody = {
  isSuccess: false as const,
  status: 401,
  message: "인증이 만료되었습니다.",
  details: null,
};

interface RouteOptions {
  // 재발급 응답의 details. null이면 재발급 자체가 실패한 것으로 본다.
  refreshDetails: Record<string, unknown> | null;
}

// 원 요청은 낡은 토큰이면 401, 새 토큰이면 성공을 준다.
// 재발급 호출까지 같은 어댑터가 받으므로 호출 횟수를 셀 수 있다.
const createRouterAdapter = ({ refreshDetails }: RouteOptions) => {
  const calls = { refresh: 0, resource: 0 };

  const adapter = async (config: InternalAxiosRequestConfig) => {
    if (config.url === AUTH_URL.REFRESH) {
      calls.refresh += 1;

      if (refreshDetails === null) {
        throw Object.assign(new Error("refresh failed"), {
          isAxiosError: true,
          config,
          response: createResponse(config, 401, unauthorizedBody),
        });
      }

      return createResponse(config, 200, successBody(refreshDetails));
    }

    calls.resource += 1;

    if (config.headers.Authorization !== "Bearer new-access-token") {
      throw Object.assign(new Error("unauthorized"), {
        isAxiosError: true,
        config,
        response: createResponse(config, 401, unauthorizedBody),
      });
    }

    return createResponse(config, 200, successBody({ value: "response" }));
  };

  return { adapter, calls };
};

describe("apiClient token refresh", () => {
  let storage: Storage;
  const originalAdapter = apiAxiosInstance.defaults.adapter;

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
    clearAuthNotice();
    storage.setItem("accessToken", "old-access-token");
    storage.setItem("refreshToken", "refresh-token");
    storage.setItem("roleCode", "RL01");
  });

  afterEach(() => {
    apiAxiosInstance.defaults.adapter = originalAdapter;
    clearAuthNotice();
  });

  it("retries the original request once with the reissued access token", async () => {
    const { adapter, calls } = createRouterAdapter({
      refreshDetails: {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        roleCode: "RL02",
        tokenExpiresAt: "1787362890",
      },
    });
    apiAxiosInstance.defaults.adapter = adapter;

    const response = await apiClient.get<{ value: string }>("/private");

    assert.deepEqual(response.details, { value: "response" });
    assert.equal(calls.refresh, 1);
    // 낡은 토큰으로 한 번, 새 토큰으로 한 번.
    assert.equal(calls.resource, 2);
    assert.equal(storage.getItem("accessToken"), "new-access-token");
    assert.equal(storage.getItem("refreshToken"), "new-refresh-token");
    assert.equal(storage.getItem("roleCode"), "RL02");
    assert.equal(storage.getItem("tokenExpiresAt"), "1787362890");
    assert.equal(getAuthNotice(), null);
  });

  it("reissues only once while several requests fail with 401 together", async () => {
    const { adapter, calls } = createRouterAdapter({
      refreshDetails: { accessToken: "new-access-token" },
    });
    apiAxiosInstance.defaults.adapter = adapter;

    const responses = await Promise.all([
      apiClient.get<{ value: string }>("/private/first"),
      apiClient.get<{ value: string }>("/private/second"),
      apiClient.get<{ value: string }>("/private/third"),
    ]);

    responses.forEach((response) => {
      assert.deepEqual(response.details, { value: "response" });
    });
    assert.equal(calls.refresh, 1);
    assert.equal(calls.resource, 6);
  });

  it("clears the session and asks to sign in again when the reissue fails", async () => {
    const { adapter, calls } = createRouterAdapter({ refreshDetails: null });
    apiAxiosInstance.defaults.adapter = adapter;

    await assert.rejects(apiClient.get("/private"));

    assert.equal(calls.refresh, 1);
    assert.equal(storage.length, 0);
    assert.deepEqual(getAuthNotice(), {
      message: "인증이 필요합니다.\n로그인 화면으로 이동합니다.",
      shouldRedirectToLogin: true,
    });
  });

  it("keeps the session and shows the server message on 403", async () => {
    const message = "해당 작업을 수행할 권한이 없습니다.";
    apiAxiosInstance.defaults.adapter = async (
      config: InternalAxiosRequestConfig,
    ) => {
      throw Object.assign(new Error(message), {
        isAxiosError: true,
        config,
        response: createResponse(config, 403, {
          isSuccess: false,
          status: 403,
          message,
          details: null,
        }),
      });
    };

    await assert.rejects(apiClient.get("/private"));

    assert.equal(storage.getItem("accessToken"), "old-access-token");
    assert.deepEqual(getAuthNotice(), {
      message,
      shouldRedirectToLogin: false,
    });
  });

  it("replaces a permission notice with the sign-in notice", async () => {
    const message = "해당 작업을 수행할 권한이 없습니다.";
    apiAxiosInstance.defaults.adapter = async (
      config: InternalAxiosRequestConfig,
    ) => {
      const isForbidden = config.url === "/private/forbidden";

      throw Object.assign(new Error("failed"), {
        isAxiosError: true,
        config,
        response: createResponse(
          config,
          isForbidden ? 403 : 401,
          isForbidden
            ? { isSuccess: false, status: 403, message, details: null }
            : unauthorizedBody,
        ),
      });
    };

    await assert.rejects(apiClient.get("/private/forbidden"));
    assert.equal(getAuthNotice()?.shouldRedirectToLogin, false);

    await assert.rejects(apiClient.get("/private/expired"));

    assert.equal(getAuthNotice()?.shouldRedirectToLogin, true);
  });
});
