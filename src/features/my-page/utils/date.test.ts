import assert from "node:assert/strict";
import { describe, it } from "node:test";

const { getCurrentWorktimeHistoryYearMonth, getNextWorktimeHistoryYearMonth } =
  (await import(
    new URL("./date.ts", import.meta.url).href
  )) as typeof import("./date");

describe("getCurrentWorktimeHistoryYearMonth", () => {
  it("uses Asia/Seoul as the worktime history month boundary", () => {
    assert.deepEqual(
      getCurrentWorktimeHistoryYearMonth(
        new Date("2026-07-31T15:30:00.000Z"),
      ),
      { year: 2026, month: 8 },
    );
  });

  it("keeps the previous month before the Asia/Seoul month boundary", () => {
    assert.deepEqual(
      getCurrentWorktimeHistoryYearMonth(
        new Date("2026-07-31T14:30:00.000Z"),
      ),
      { year: 2026, month: 7 },
    );
  });
});

describe("getNextWorktimeHistoryYearMonth", () => {
  it("returns the month after the current Asia/Seoul month", () => {
    assert.deepEqual(
      getNextWorktimeHistoryYearMonth(new Date("2026-08-21T00:00:00.000Z")),
      { year: 2026, month: 9 },
    );
  });

  it("moves to January of the next year after December", () => {
    assert.deepEqual(
      getNextWorktimeHistoryYearMonth(new Date("2026-12-15T00:00:00.000Z")),
      { year: 2027, month: 1 },
    );
  });
});
