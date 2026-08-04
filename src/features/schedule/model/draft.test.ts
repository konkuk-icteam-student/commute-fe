import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ScheduleSlotTime } from "../types";

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

const slotOf = (start: string, end: string): ScheduleSlotTime => ({
  date: "2026-07-01",
  start,
  end,
});

const MY_SLOT = slotOf("09:00", "09:30");
const EMPTY_SLOT = slotOf("10:00", "10:30");
const NEXT_EMPTY_SLOT = slotOf("10:30", "11:00");

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

    assert.deepEqual(getDraftSlotTimes(draft, "DELETE"), [MY_SLOT]);
    assert.deepEqual(getDraftSlotTimes(draft, "ADD"), [EMPTY_SLOT]);
  });

  it("날짜와 시작 시각이 같으면 같은 슬롯으로 본다", () => {
    const draft = toggleDraft(EMPTY_DRAFT, EMPTY_SLOT, "ADD");

    assert.equal(hasDraft(draft, { ...EMPTY_SLOT }, "ADD"), true);
  });
});

describe("toPayload / toRawPayload", () => {
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
      toggleDraft(EMPTY_DRAFT, NEXT_EMPTY_SLOT, "ADD"),
      EMPTY_SLOT,
      "ADD",
    );

    assert.deepEqual(toRawPayload(draft), {
      deleteSlots: [],
      addSlots: [NEXT_EMPTY_SLOT, EMPTY_SLOT],
    });
  });

  it("담은 것이 없으면 빈 목록을 돌려준다", () => {
    assert.deepEqual(toPayload(EMPTY_DRAFT), {
      deleteSlots: [],
      addSlots: [],
    });
  });
});

describe("클릭 순서를 재생했을 때", () => {
  // 골랐다가 취소하고 다시 고르는 흐름이 최종 결과에 남지 않아야 한다.
  it("취소한 칸은 남지 않고 마지막에 다시 고른 칸만 남는다", () => {
    const clicks: [ScheduleSlotTime, "ADD" | "DELETE"][] = [
      [EMPTY_SLOT, "ADD"],
      [MY_SLOT, "DELETE"],
      [NEXT_EMPTY_SLOT, "ADD"],
      [EMPTY_SLOT, "ADD"], // 취소
      [MY_SLOT, "DELETE"], // 취소
      [EMPTY_SLOT, "ADD"], // 다시 선택
    ];

    const draft = clicks.reduce(
      (currentDraft, [slot, kind]) => toggleDraft(currentDraft, slot, kind),
      EMPTY_DRAFT,
    );

    assert.deepEqual(toPayload(draft), {
      deleteSlots: [],
      // 10:00~10:30 과 10:30~11:00 이 이어져 하나로 합쳐진다.
      addSlots: [{ date: "2026-07-01", start: "10:00", end: "11:00" }],
    });
  });
});
