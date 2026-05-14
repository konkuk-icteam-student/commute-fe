import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getMonthWeekOfDate } from "./date-formatter.ts";

describe("getMonthWeekOfDate", () => {
  it("returns maxWeek as 4 when February starts on Monday and has 28 days", () => {
    const result = getMonthWeekOfDate(new Date(2021, 1, 15));

    assert.deepEqual(result, {
      year: 2021,
      month: 2,
      week: 3,
      maxWeek: 4,
    });
  });

  it("returns maxWeek as 5 when the month spans five Monday-based weeks", () => {
    const result = getMonthWeekOfDate(new Date(2026, 4, 14));

    assert.deepEqual(result, {
      year: 2026,
      month: 5,
      week: 3,
      maxWeek: 5,
    });
  });
});
