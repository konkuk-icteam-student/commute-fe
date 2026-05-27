import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ScheduleApplyPayload, ScheduleSlot } from "../types";

const {
  getApplySlotCurrentCount,
  getApplySlotStatus,
  getMergedApplyPayload,
  mergeContinuousSlotTimes,
  toggleApplySlotChange,
} = (await import(new URL("./index.ts", import.meta.url).href)) as typeof import("./index");

const basePayload: ScheduleApplyPayload = {
  deleteSlots: [],
  addSlots: [],
};

const myScheduleSlot: ScheduleSlot = {
  date: "2026-04-06",
  start: "13:00",
  end: "14:30",
  status: "MY_SCHEDULE",
  currentCount: 1,
};

const emptySlot: ScheduleSlot = {
  date: "2026-04-09",
  start: "13:00",
  end: "14:30",
  status: "EMPTY",
  currentCount: 0,
};

const fullEmptySlot: ScheduleSlot = {
  ...emptySlot,
  currentCount: 5,
};

describe("toggleApplySlotChange", () => {
  it("adds existing selected slots to deleteSlots and removes them on second click", () => {
    const addedToDelete = toggleApplySlotChange(basePayload, myScheduleSlot);

    assert.deepEqual(addedToDelete.deleteSlots, [
      { date: "2026-04-06", start: "13:00", end: "14:30" },
    ]);
    assert.deepEqual(addedToDelete.addSlots, []);

    const reverted = toggleApplySlotChange(addedToDelete, myScheduleSlot);

    assert.deepEqual(reverted.deleteSlots, []);
    assert.deepEqual(reverted.addSlots, []);
  });

  it("adds empty slots to addSlots and removes them on second click", () => {
    const addedToAdd = toggleApplySlotChange(basePayload, emptySlot);

    assert.deepEqual(addedToAdd.deleteSlots, []);
    assert.deepEqual(addedToAdd.addSlots, [
      { date: "2026-04-09", start: "13:00", end: "14:30" },
    ]);

    const reverted = toggleApplySlotChange(addedToAdd, emptySlot);

    assert.deepEqual(reverted.deleteSlots, []);
    assert.deepEqual(reverted.addSlots, []);
  });

  it("does not add empty slots when the current count is already full", () => {
    const payload = toggleApplySlotChange(basePayload, fullEmptySlot, 5);

    assert.deepEqual(payload.deleteSlots, []);
    assert.deepEqual(payload.addSlots, []);
  });
});

describe("getApplySlotStatus", () => {
  it("renders add changes as MY_SCHEDULE and delete changes as EMPTY", () => {
    const payload = toggleApplySlotChange(
      toggleApplySlotChange(basePayload, myScheduleSlot),
      emptySlot,
    );

    assert.equal(getApplySlotStatus(myScheduleSlot, payload), "EMPTY");
    assert.equal(getApplySlotStatus(emptySlot, payload), "MY_SCHEDULE");
  });
});

describe("getApplySlotCurrentCount", () => {
  it("increments add changes and decrements delete changes", () => {
    const payload = toggleApplySlotChange(
      toggleApplySlotChange(basePayload, myScheduleSlot),
      emptySlot,
    );

    assert.equal(getApplySlotCurrentCount(myScheduleSlot, payload), 0);
    assert.equal(getApplySlotCurrentCount(emptySlot, payload), 1);
  });

  it("keeps original counts after a clicked slot is reverted", () => {
    const payload = toggleApplySlotChange(
      toggleApplySlotChange(
        toggleApplySlotChange(
          toggleApplySlotChange(basePayload, myScheduleSlot),
          myScheduleSlot,
        ),
        emptySlot,
      ),
      emptySlot,
    );

    assert.equal(getApplySlotCurrentCount(myScheduleSlot, payload), 1);
    assert.equal(getApplySlotCurrentCount(emptySlot, payload), 0);
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
        deleteSlots: [
          { date: "2026-04-06", start: "13:00", end: "14:00" },
        ],
        addSlots: [
          { date: "2026-04-09", start: "13:30", end: "14:30" },
        ],
      },
    );
  });
});
