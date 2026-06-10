import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isPathActive } from "./route-match";

describe("isPathActive", () => {
  it("returns true for an exact route match", () => {
    assert.equal(isPathActive("/admin/worktime", "/admin/worktime"), true);
  });

  it("returns true for a nested route match", () => {
    assert.equal(
      isPathActive("/admin/worktime/detail", "/admin/worktime"),
      true,
    );
  });

  it("returns false for a prefix false positive", () => {
    assert.equal(
      isPathActive("/admin/work-requested", "/admin/work-request"),
      false,
    );
  });

  it("returns false for a nested route when exact matching is enabled", () => {
    assert.equal(
      isPathActive("/admin/worktime", "/admin", { exact: true }),
      false,
    );
  });
});
