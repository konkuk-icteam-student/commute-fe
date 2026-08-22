import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  deleteAuthToken,
  getAccessToken,
  getRefreshToken,
  getRoleCode,
  getTokenExpiresAt,
  getUserName,
} from "../token-storage";

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

const removeBrowserStorage = () => {
  Reflect.deleteProperty(globalThis, "window");
  Reflect.deleteProperty(globalThis, "localStorage");
};

const installBrowserStorage = (storage: Storage) => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage },
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storage,
  });
};

describe("token storage environment boundary", () => {
  afterEach(() => {
    restoreGlobal("window", originalWindowDescriptor);
    restoreGlobal("localStorage", originalLocalStorageDescriptor);
  });

  it("returns null when browser storage is unavailable", () => {
    removeBrowserStorage();

    assert.equal(getAccessToken(), null);
    assert.equal(getRefreshToken(), null);
  });

  it("does not throw while clearing auth outside the browser", () => {
    removeBrowserStorage();

    assert.doesNotThrow(deleteAuthToken);
  });

  it("reads and clears auth tokens from browser storage", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("accessToken", "access-token");
    storage.setItem("refreshToken", "refresh-token");

    assert.equal(getAccessToken(), "access-token");
    assert.equal(getRefreshToken(), "refresh-token");

    deleteAuthToken();

    assert.equal(storage.getItem("accessToken"), null);
    assert.equal(storage.getItem("refreshToken"), null);
  });

  it("reads the rest of the stored session", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("roleCode", "RL02");
    storage.setItem("tokenExpiresAt", "1787362890");
    storage.setItem("userName", "유찬영");

    assert.equal(getRoleCode(), "RL02");
    assert.equal(getTokenExpiresAt(), "1787362890");
    assert.equal(getUserName(), "유찬영");
  });

  it("treats an unknown role code as missing", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("roleCode", "RL99");

    assert.equal(getRoleCode(), null);
  });

  it("clears the role code and user name together with the tokens", () => {
    const storage = createMemoryStorage();
    installBrowserStorage(storage);
    storage.setItem("accessToken", "access-token");
    storage.setItem("refreshToken", "refresh-token");
    storage.setItem("roleCode", "RL01");
    storage.setItem("tokenExpiresAt", "1787362890");
    storage.setItem("userName", "유찬영");

    deleteAuthToken();

    assert.equal(storage.length, 0);
  });
});
