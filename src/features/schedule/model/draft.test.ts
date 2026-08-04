import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ScheduleApplyPayload, ScheduleSlot } from "../types";

const {
  EMPTY_DRAFT,
  getDraftKind,
  getDraftSlotTimes,
  hasDraft,
  toggleDraft,
  toPayload,
  toRawPayload,
} = (await import(
  new URL("./draft.ts", import.meta.url).href
)) as typeof import("./draft");
const { getMergedApplyPayload, toggleApplySlotChange } = (await import(
  new URL("../utils/index.ts", import.meta.url).href
)) as typeof import("../utils");

const slotOf = (
  start: string,
  end: string,
  status: ScheduleSlot["status"],
): ScheduleSlot => ({
  date: "2026-07-01",
  start,
  end,
  status,
  currentCount: 0,
});

const MY_SLOT = slotOf("09:00", "09:30", "MY_SCHEDULE");
const EMPTY_SLOT = slotOf("10:00", "10:30", "EMPTY");
const NEXT_EMPTY_SLOT = slotOf("10:30", "11:00", "EMPTY");

// toggleApplySlotChange가 슬롯 상태로 정하는 것과 같은 규칙.
const kindOf = (slot: ScheduleSlot) =>
  slot.status === "MY_SCHEDULE" ? "DELETE" : "ADD";

describe("toggleDraft", () => {
  it("담겨 있지 않으면 넣는다", () => {
    const draft = toggleDraft(EMPTY_DRAFT, EMPTY_SLOT, "ADD");

    assert.equal(getDraftKind(draft, EMPTY_SLOT), "ADD");
    assert.equal(hasDraft(draft, EMPTY_SLOT, "ADD"), true);
  });

  it("이미 담겨 있으면 뺀다", () => {
    const draft = toggleDraft(
      toggleDraft(EMPTY_DRAFT, EMPTY_SLOT, "ADD"),
      EMPTY_SLOT,
      "ADD",
    );

    assert.equal(getDraftKind(draft, EMPTY_SLOT), undefined);
  });

  it("원본 드래프트를 바꾸지 않는다", () => {
    const draft = toggleDraft(EMPTY_DRAFT, EMPTY_SLOT, "ADD");

    assert.equal(EMPTY_DRAFT.size, 0);
    assert.equal(draft.size, 1);
  });

  it("종류가 다른 슬롯을 함께 담는다", () => {
    const draft = toggleDraft(
      toggleDraft(EMPTY_DRAFT, MY_SLOT, "DELETE"),
      EMPTY_SLOT,
      "ADD",
    );

    assert.deepEqual(getDraftSlotTimes(draft, "DELETE"), [
      { date: MY_SLOT.date, start: MY_SLOT.start, end: MY_SLOT.end },
    ]);
    assert.deepEqual(getDraftSlotTimes(draft, "ADD"), [
      { date: EMPTY_SLOT.date, start: EMPTY_SLOT.start, end: EMPTY_SLOT.end },
    ]);
  });
});

describe("toPayload", () => {
  it("이어진 슬롯을 하나의 구간으로 합친다", () => {
    const draft = toggleDraft(
      toggleDraft(EMPTY_DRAFT, EMPTY_SLOT, "ADD"),
      NEXT_EMPTY_SLOT,
      "ADD",
    );

    assert.deepEqual(toPayload(draft).addSlots, [
      { date: "2026-07-01", start: "10:00", end: "11:00" },
    ]);
  });

  it("toRawPayload는 합치지 않고 담은 순서를 유지한다", () => {
    const draft = toggleDraft(
      toggleDraft(EMPTY_DRAFT, EMPTY_SLOT, "ADD"),
      NEXT_EMPTY_SLOT,
      "ADD",
    );

    assert.equal(toRawPayload(draft).addSlots.length, 2);
    assert.equal(toRawPayload(draft).addSlots[0].start, "10:00");
  });
});

// 대조 테스트 ② — 같은 클릭 순서를 넣으면 기존 배열 payload와 같은 결과가 나와야 한다.
// 여기서 어긋나면 Map 전환을 포기하고 기존 배열 구조를 유지한다.
describe("기존 payload 구조와의 동등성", () => {
  const CLICK_SEQUENCE: ScheduleSlot[] = [
    EMPTY_SLOT,
    MY_SLOT,
    NEXT_EMPTY_SLOT,
    EMPTY_SLOT, // 같은 슬롯 재클릭 → 취소
    slotOf("11:00", "11:30", "EMPTY"),
    MY_SLOT, // 같은 슬롯 재클릭 → 취소
    slotOf("14:00", "14:30", "MY_SCHEDULE"),
    EMPTY_SLOT, // 취소했던 슬롯 재선택
  ];

  it("클릭 순서를 그대로 재생하면 병합 결과가 같다", () => {
    let legacyPayload: ScheduleApplyPayload = { deleteSlots: [], addSlots: [] };
    let draft = EMPTY_DRAFT;

    CLICK_SEQUENCE.forEach((slot) => {
      legacyPayload = toggleApplySlotChange(legacyPayload, slot);
      draft = toggleDraft(draft, slot, kindOf(slot));
    });

    assert.deepEqual(toPayload(draft), getMergedApplyPayload(legacyPayload));
  });

  it("클릭 순서를 그대로 재생하면 병합 전 슬롯 집합도 같다", () => {
    let legacyPayload: ScheduleApplyPayload = { deleteSlots: [], addSlots: [] };
    let draft = EMPTY_DRAFT;

    CLICK_SEQUENCE.forEach((slot) => {
      legacyPayload = toggleApplySlotChange(legacyPayload, slot);
      draft = toggleDraft(draft, slot, kindOf(slot));
    });

    assert.deepEqual(toRawPayload(draft), legacyPayload);
  });
});
