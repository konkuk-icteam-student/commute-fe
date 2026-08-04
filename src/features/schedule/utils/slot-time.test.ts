import assert from "node:assert/strict";
import { describe, it } from "node:test";

const {
  getMergedApplyPayload,
  getSlotTimesTotalHours,
  getSlotTimesTotalHoursOnWeek,
  hasSlotTimesBelowMinSessionHours,
  mergeContinuousSlotTimes,
} = (await import(
  new URL("./index.ts", import.meta.url).href
)) as typeof import("./index");

describe("getSlotTimesTotalHours", () => {
  it("returns the total duration of slot times in hours", () => {
    assert.equal(
      getSlotTimesTotalHours([
        { date: "2026-04-06", start: "13:00", end: "14:30" },
        { date: "2026-04-09", start: "09:30", end: "10:00" },
      ]),
      2,
    );
  });
});

describe("getSlotTimesTotalHoursOnWeek", () => {
  it("returns total duration only for slots on the provided dates", () => {
    assert.equal(
      getSlotTimesTotalHoursOnWeek(
        [
          { date: "2026-04-06", start: "13:00", end: "14:30" },
          { date: "2026-04-09", start: "09:30", end: "10:00" },
          { date: "2026-04-13", start: "13:00", end: "14:30" },
        ],
        ["2026-04-06", "2026-04-09"],
      ),
      2,
    );
  });
});

describe("hasSlotTimesBelowMinSessionHours", () => {
  it("returns true when any continuous session is shorter than the minimum", () => {
    assert.equal(
      hasSlotTimesBelowMinSessionHours(
        [
          { date: "2026-04-09", start: "13:30", end: "14:00" },
          { date: "2026-04-09", start: "14:30", end: "15:00" },
        ],
        1,
      ),
      true,
    );
  });

  it("returns false when adjacent slots meet the minimum session length", () => {
    assert.equal(
      hasSlotTimesBelowMinSessionHours(
        [
          { date: "2026-04-09", start: "13:30", end: "14:00" },
          { date: "2026-04-09", start: "14:00", end: "14:30" },
        ],
        1,
      ),
      false,
    );
  });
});

describe("mergeContinuousSlotTimes", () => {
  it("merges two adjacent slots on the same date", () => {
    assert.deepEqual(
      mergeContinuousSlotTimes([
        { date: "2026-04-09", start: "13:30", end: "14:00" },
        { date: "2026-04-09", start: "14:00", end: "14:30" },
      ]),
      [{ date: "2026-04-09", start: "13:30", end: "14:30" }],
    );
  });

  it("merges three or more adjacent slots", () => {
    assert.deepEqual(
      mergeContinuousSlotTimes([
        { date: "2026-04-09", start: "14:00", end: "14:30" },
        { date: "2026-04-09", start: "13:30", end: "14:00" },
        { date: "2026-04-09", start: "14:30", end: "15:00" },
      ]),
      [{ date: "2026-04-09", start: "13:30", end: "15:00" }],
    );
  });

  it("does not merge separated slots or slots on different dates", () => {
    assert.deepEqual(
      mergeContinuousSlotTimes([
        { date: "2026-04-09", start: "13:30", end: "14:00" },
        { date: "2026-04-09", start: "14:30", end: "15:00" },
        { date: "2026-04-10", start: "14:00", end: "14:30" },
      ]),
      [
        { date: "2026-04-09", start: "13:30", end: "14:00" },
        { date: "2026-04-09", start: "14:30", end: "15:00" },
        { date: "2026-04-10", start: "14:00", end: "14:30" },
      ],
    );
  });
});

describe("getMergedApplyPayload", () => {
  it("merges addSlots and deleteSlots independently", () => {
    assert.deepEqual(
      getMergedApplyPayload({
        deleteSlots: [
          { date: "2026-04-06", start: "13:00", end: "13:30" },
          { date: "2026-04-06", start: "13:30", end: "14:00" },
        ],
        addSlots: [
          { date: "2026-04-09", start: "13:30", end: "14:00" },
          { date: "2026-04-09", start: "14:00", end: "14:30" },
        ],
      }),
      {
        deleteSlots: [{ date: "2026-04-06", start: "13:00", end: "14:00" }],
        addSlots: [{ date: "2026-04-09", start: "13:30", end: "14:30" }],
      },
    );
  });
});
