import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { WeekScheduleData } from "../types";

const { DUMMY_GET_SCHEDULE } = (await import(
  new URL("./dummy.ts", import.meta.url).href
)) as {
  DUMMY_GET_SCHEDULE: WeekScheduleData;
};

const SELECTED_STATUSES = new Set([
  "MY_SCHEDULE",
  "PENDING_ADD",
  "PENDING_DELETE",
]);
describe("schedule dummy data", () => {
  it("includes at least one full available slot in get schedule dummy data", () => {
    const { maxConcurrentWorkers, slots } = DUMMY_GET_SCHEDULE;

    assert.ok(
      slots.some(
        (slot) =>
          slot.status === "EMPTY" && slot.currentCount === maxConcurrentWorkers,
      ),
    );
  });

  it("keeps selected slots with at least one current worker", () => {
    const selectedSlots = DUMMY_GET_SCHEDULE.slots.filter((slot) =>
      SELECTED_STATUSES.has(slot.status),
    );

    assert.ok(selectedSlots.length > 0);
    assert.ok(selectedSlots.every((slot) => slot.currentCount >= 1));
  });
});
