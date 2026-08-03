import assert from "node:assert/strict";
import { describe, it } from "node:test";

const {
  getMondayOfMonthWeek,
  getMonthWeekOfDate,
  getWeekdaysOfMonthWeek,
  shiftDateByWeeks,
} = (await import(
  new URL("./date-formatter.ts", import.meta.url).href
)) as typeof import("./date-formatter");

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

  it("counts the week of the first weekday as week 1 when the month starts on Saturday", () => {
    const result = getMonthWeekOfDate(new Date(2026, 7, 3));

    assert.deepEqual(result, {
      year: 2026,
      month: 8,
      week: 1,
      maxWeek: 5,
    });
  });

  it("clamps to week 1 for the weekend that precedes the first weekday of the month", () => {
    assert.equal(getMonthWeekOfDate(new Date(2026, 7, 1)).week, 1);
    assert.equal(getMonthWeekOfDate(new Date(2026, 7, 2)).week, 1);
  });

  it("counts the week that only partially belongs to the month as week 1", () => {
    // 2026-07-01은 수요일이라 6.29~7.03 주가 1주차가 된다.
    assert.deepEqual(getMonthWeekOfDate(new Date(2026, 6, 1)), {
      year: 2026,
      month: 7,
      week: 1,
      maxWeek: 5,
    });
  });

  it("returns the last week that contains a weekday of the month as maxWeek", () => {
    const result = getMonthWeekOfDate(new Date(2026, 7, 31));

    assert.deepEqual(result, {
      year: 2026,
      month: 8,
      week: 5,
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

describe("getMondayOfMonthWeek", () => {
  it("returns the first Monday of the month when the month starts on Saturday", () => {
    assert.deepEqual(getMondayOfMonthWeek(2026, 8, 1), new Date(2026, 7, 3));
  });

  it("returns a Monday of the previous month when the month starts midweek", () => {
    assert.deepEqual(getMondayOfMonthWeek(2026, 9, 1), new Date(2026, 7, 31));
  });
});

describe("getWeekdaysOfMonthWeek", () => {
  it("starts August 2026 at the first Monday of the month", () => {
    const result = getWeekdaysOfMonthWeek(2026, 8, 1);

    assert.deepEqual(
      result.map(({ label, dateLabel }) => `${label} ${dateLabel}`),
      ["월 8.03", "화 8.04", "수 8.05", "목 8.06", "금 8.07"],
    );
    assert.ok(result.every(({ isCurrentMonth }) => isCurrentMonth));
  });

  it("marks the next month days of the last week as outside the month", () => {
    const result = getWeekdaysOfMonthWeek(2026, 8, 5);

    assert.deepEqual(
      result.map(({ dateLabel, isCurrentMonth }) => [
        dateLabel,
        isCurrentMonth,
      ]),
      [
        ["8.31", true],
        ["9.01", false],
        ["9.02", false],
        ["9.03", false],
        ["9.04", false],
      ],
    );
  });

  it("marks the previous month days of the first week as outside the month", () => {
    const result = getWeekdaysOfMonthWeek(2026, 7, 1);

    assert.deepEqual(
      result.map(({ dateLabel, isCurrentMonth }) => [
        dateLabel,
        isCurrentMonth,
      ]),
      [
        ["6.29", false],
        ["6.30", false],
        ["7.01", true],
        ["7.02", true],
        ["7.03", true],
      ],
    );
  });

  it("keeps the previous year on days that cross the year boundary", () => {
    const result = getWeekdaysOfMonthWeek(2027, 1, 1);

    assert.deepEqual(
      result.map(({ date }) => date),
      ["2026-12-28", "2026-12-29", "2026-12-30", "2026-12-31", "2027-01-01"],
    );
  });
});
