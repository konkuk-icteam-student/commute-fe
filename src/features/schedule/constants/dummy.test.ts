import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { WeekScheduleData } from "../types";

const { DUMMY_GET_SCHEDULE, DUMMY_NEXT_MONTH_SCHEDULE } = (await import(
  new URL("./dummy.ts", import.meta.url).href
)) as {
  DUMMY_GET_SCHEDULE: WeekScheduleData;
  DUMMY_NEXT_MONTH_SCHEDULE: WeekScheduleData;
};

const SELECTED_STATUSES = new Set([
  "MY_SCHEDULE",
  "PENDING_ADD",
  "PENDING_DELETE",
]);

describe("DUMMY_NEXT_MONTH_SCHEDULE", () => {
  it("keeps every current count within max concurrent workers", () => {
    const { maxConcurrentWorkers, slots } = DUMMY_NEXT_MONTH_SCHEDULE;

    assert.ok(
      slots.every((slot) => slot.currentCount <= maxConcurrentWorkers),
    );
  });

  it("fills empty available slots with preview worker counts", () => {
    const availableSlots = DUMMY_NEXT_MONTH_SCHEDULE.slots.filter(
      (slot) => slot.status === "EMPTY",
    );

    assert.ok(availableSlots.some((slot) => slot.currentCount > 0));
  });
});

describe("schedule dummy data", () => {
  it("keeps selected slots with at least one current worker", () => {
    const selectedSlots = [
      ...DUMMY_GET_SCHEDULE.slots,
      ...DUMMY_NEXT_MONTH_SCHEDULE.slots,
    ].filter((slot) => SELECTED_STATUSES.has(slot.status));

    assert.ok(selectedSlots.length > 0);
    assert.ok(selectedSlots.every((slot) => slot.currentCount >= 1));
  });
});
