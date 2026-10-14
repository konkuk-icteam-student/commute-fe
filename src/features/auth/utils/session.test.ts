import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { hasUsableStoredSession } from "./session";

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "window",
);
const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "localStorage",
);

const restoreGlobal = (
  key: "window" | "localStorage",
  descriptor: PropertyDescriptor | undefined,
) => {
  if (descriptor) {
    Object.defineProperty(globalThis, key, descriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, key);
};

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

const installBrowserStorage = (storage: Storage) => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      dispatchEvent: () => true,
      localStorage: storage,
    },
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storage,
  });
};

describe("auth session", () => {
  afterEach(() => {
    restoreGlobal("window", originalWindowDescriptor);
    restoreGlobal("localStorage", originalLocalStorageDescriptor);
  });

  it("keeps a token-only session when the expiration is omitted", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("accessToken", "access-token");

    assert.equal(hasUsableStoredSession(), true);
  });

  it("keeps the refresh session when the access token expiration cannot be parsed", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("accessToken", "access-token");
    storage.setItem("refreshToken", "refresh-token");
    storage.setItem("roleCode", "RL01");
    storage.setItem("tokenExpiresAt", "not-a-date");

    assert.equal(hasUsableStoredSession(), true);
    assert.equal(storage.getItem("accessToken"), null);
    assert.equal(storage.getItem("tokenExpiresAt"), null);
    assert.equal(storage.getItem("refreshToken"), "refresh-token");
    assert.equal(storage.getItem("roleCode"), "RL01");
  });

  it("keeps the refresh session when the access token is expired", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("accessToken", "access-token");
    storage.setItem("refreshToken", "refresh-token");
    storage.setItem("roleCode", "RL01");
    storage.setItem("tokenExpiresAt", String(Date.now() - 1000));

    assert.equal(hasUsableStoredSession(), true);
    assert.equal(storage.getItem("accessToken"), null);
    assert.equal(storage.getItem("tokenExpiresAt"), null);
    assert.equal(storage.getItem("refreshToken"), "refresh-token");
    assert.equal(storage.getItem("roleCode"), "RL01");
  });

  it("clears an expired access-only session when refresh is unavailable", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("accessToken", "access-token");
    storage.setItem("tokenExpiresAt", String(Date.now() - 1000));

    assert.equal(hasUsableStoredSession(), false);
    assert.equal(storage.length, 0);
  });
});
