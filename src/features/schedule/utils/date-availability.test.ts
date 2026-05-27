import assert from "node:assert/strict";
import { describe, it } from "node:test";

const { getDateStringFromDateLabel, isBeforeDate } = (await import(
  new URL("./index.ts", import.meta.url).href
)) as typeof import("./index");

describe("getDateStringFromDateLabel", () => {
  it("converts an M.DD date label to a YYYY-MM-DD date string", () => {
    assert.equal(getDateStringFromDateLabel(2026, "5.27"), "2026-05-27");
  });
});

describe("isBeforeDate", () => {
  it("returns true when the schedule date is before the base date", () => {
    assert.equal(isBeforeDate("2026-05-26", new Date(2026, 4, 27)), true);
  });

  it("returns false when the schedule date is the same date as the base date", () => {
    assert.equal(isBeforeDate("2026-05-27", new Date(2026, 4, 27)), false);
  });

  it("returns false when the schedule date is after the base date", () => {
    assert.equal(isBeforeDate("2026-05-28", new Date(2026, 4, 27)), false);
  });
});
