import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { InternalAxiosRequestConfig } from "axios";

import { ApiError, apiAxiosInstance } from "../api-client";
import { loginApi } from "../auth";

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

const createLoginResponse = (
  config: InternalAxiosRequestConfig,
  details: Record<string, unknown>,
) => ({
  config,
  data: {
    isSuccess: true as const,
    message: "ok",
    details,
  },
  headers: {},
  status: 200,
  statusText: "OK",
});

describe("auth api", () => {
  const originalAdapter = apiAxiosInstance.defaults.adapter;

  beforeEach(() => {
    const storage = createMemoryStorage();

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: storage,
    });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        dispatchEvent: () => true,
        localStorage: storage,
      },
    });
  });

  afterEach(() => {
    apiAxiosInstance.defaults.adapter = originalAdapter;
  });

  it("rejects a successful login response without an access token", async () => {
    apiAxiosInstance.defaults.adapter = async (
      config: InternalAxiosRequestConfig,
    ) => createLoginResponse(config, { refreshToken: "refresh-token" });

    await assert.rejects(
      loginApi({ email: "user@example.com", password: "password" }),
      (error: unknown) =>
        error instanceof ApiError && error.code === "MISSING_ACCESS_TOKEN",
    );

    assert.equal(localStorage.getItem("refreshToken"), null);
  });
});
