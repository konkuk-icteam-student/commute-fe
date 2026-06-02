import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ScheduleChangeHistoryType, WeekScheduleData } from "../types";

const {
  DUMMY_GET_SCHEDULE,
  DUMMY_NEXT_MONTH_SCHEDULE,
  DUUMY_SCHEDULE_CHANGE_HISTORY,
} = (await import(new URL("./dummy.ts", import.meta.url).href)) as {
  DUMMY_GET_SCHEDULE: WeekScheduleData;
  DUMMY_NEXT_MONTH_SCHEDULE: WeekScheduleData;
  DUUMY_SCHEDULE_CHANGE_HISTORY: ScheduleChangeHistoryType[];
};

const SELECTED_STATUSES = new Set([
  "MY_SCHEDULE",
  "PENDING_ADD",
  "PENDING_DELETE",
]);
const HISTORY_STATUS_CODES = ["CS01", "CS02", "CS03"] as const;

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
    const selectedSlots = [
      ...DUMMY_GET_SCHEDULE.slots,
      ...DUMMY_NEXT_MONTH_SCHEDULE.slots,
    ].filter((slot) => SELECTED_STATUSES.has(slot.status));

    assert.ok(selectedSlots.length > 0);
    assert.ok(selectedSlots.every((slot) => slot.currentCount >= 1));
  });
});

describe("DUUMY_SCHEDULE_CHANGE_HISTORY", () => {
  it("includes all schedule change history status cases", () => {
    assert.ok(DUUMY_SCHEDULE_CHANGE_HISTORY.length >= 3);

    for (const statusCode of HISTORY_STATUS_CODES) {
      assert.ok(
        DUUMY_SCHEDULE_CHANGE_HISTORY.some(
          (history) => history.statusCode === statusCode,
        ),
      );
    }
  });

  it("uses delete and add change type codes by slot group", () => {
    assert.ok(
      DUUMY_SCHEDULE_CHANGE_HISTORY.every((history) =>
        history.deleteSlots.every((slot) => slot.changeTypeCode === "CR02"),
      ),
    );
    assert.ok(
      DUUMY_SCHEDULE_CHANGE_HISTORY.every((history) =>
        history.addSlots.every((slot) => slot.changeTypeCode === "CR01"),
      ),
    );
  });
});
