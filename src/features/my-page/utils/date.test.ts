import assert from "node:assert/strict";
import { describe, it } from "node:test";

const { getCurrentWorktimeHistoryYearMonth } = (await import(
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
