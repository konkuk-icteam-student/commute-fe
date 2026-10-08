import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getDailyTaskPeriod } from "./index";

describe("getDailyTaskPeriod", () => {
  it("selects morning before noon", () => {
    assert.equal(getDailyTaskPeriod(new Date(2026, 9, 8, 11, 59)), "morning");
  });

  it("selects afternoon from noon", () => {
    assert.equal(getDailyTaskPeriod(new Date(2026, 9, 8, 12, 0)), "afternoon");
  });
});
