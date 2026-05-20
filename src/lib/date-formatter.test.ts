import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getMonthWeekOfDate,
  shiftDateByWeeks,
} from "./date-formatter";

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

describe("shiftDateByWeeks", () => {
  it("moves from the last week of a month to the first week of the next month", () => {
    const result = getMonthWeekOfDate(
      shiftDateByWeeks(new Date(2026, 4, 25), 1),
    );

    assert.deepEqual(result, {
      year: 2026,
      month: 6,
      week: 1,
      maxWeek: 5,
    });
  });

  it("moves from the first week of a month to the last week of the previous month", () => {
    const result = getMonthWeekOfDate(
      shiftDateByWeeks(new Date(2026, 5, 1), -1),
    );

    assert.deepEqual(result, {
      year: 2026,
      month: 5,
      week: 5,
      maxWeek: 5,
    });
  });
});

