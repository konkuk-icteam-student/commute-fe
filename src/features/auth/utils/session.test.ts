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

  it("clears the session when the expiration cannot be parsed", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("accessToken", "access-token");
    storage.setItem("tokenExpiresAt", "not-a-date");

    assert.equal(hasUsableStoredSession(), false);
    assert.equal(storage.length, 0);
  });

  it("clears the session when the token is expired", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("accessToken", "access-token");
    storage.setItem("tokenExpiresAt", String(Date.now() - 1000));

    assert.equal(hasUsableStoredSession(), false);
    assert.equal(storage.length, 0);
  });
});
