import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DUMMY_NEXT_MONTH_SCHEDULE } from "./dummy.ts";

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
