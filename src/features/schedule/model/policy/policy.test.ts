import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ScheduleSlotStatus, ScheduleSlotTime } from "../../types";
import type { WeekSlot } from "../week-schedule";
import type { PolicyContext } from "./types";

const { applyPolicy } = (await import(
  new URL("./apply.ts", import.meta.url).href
)) as typeof import("./apply");
const { editPolicy } = (await import(
  new URL("./edit.ts", import.meta.url).href
)) as typeof import("./edit");
const { viewPolicy } = (await import(
  new URL("./view.ts", import.meta.url).href
)) as typeof import("./view");
const { EMPTY_DRAFT, getDraftKind, toggleDraft } = (await import(
  new URL("../draft.ts", import.meta.url).href
)) as typeof import("../draft");
const { toSlotKey } = (await import(
  new URL("../slot-key.ts", import.meta.url).href
)) as typeof import("../slot-key");

const MAX_CONCURRENT_WORKERS = 3;

// 30분짜리 슬롯 하나. 시작 시각이 다르면 다른 슬롯이 된다.
const slotOf = (
  status: ScheduleSlotStatus,
  currentCount = 0,
  start = "09:00",
  end = "09:30",
): WeekSlot => ({
  key: toSlotKey({ date: "2026-07-01", start, end }),
  date: "2026-07-01",
  start,
  end,
  status,
  currentCount,
  isHourStart: start.endsWith(":00"),
});

const MY_SLOT = slotOf("MY_SCHEDULE", 1);
const EMPTY_SLOT = slotOf("EMPTY", 0, "10:00", "10:30");
const FULL_SLOT = slotOf("EMPTY", MAX_CONCURRENT_WORKERS, "11:00", "11:30");
const PENDING_ADD_SLOT = slotOf("PENDING_ADD", 1, "13:00", "13:30");
const PENDING_DELETE_SLOT = slotOf("PENDING_DELETE", 1, "14:00", "14:30");
const UNAVAILABLE_SLOT = slotOf("UNAVAILABLE", 0, "15:00", "15:30");

const APPLY_CONTEXT: PolicyContext = {
  maxConcurrentWorkers: MAX_CONCURRENT_WORKERS,
};

// 이미 addHours만큼 고른 상태에서 maxAddHours까지만 더 고를 수 있는 상황.
const editContext = (addHours: number, maxAddHours: number): PolicyContext => ({
  maxConcurrentWorkers: MAX_CONCURRENT_WORKERS,
  editLimit: { addHours, maxAddHours },
});

const draftWith = (...entries: [ScheduleSlotTime, "ADD" | "DELETE"][]) =>
  entries.reduce(
    (draft, [slot, kind]) => toggleDraft(draft, slot, kind),
    EMPTY_DRAFT,
  );

describe("viewPolicy", () => {
  it("모든 칸이 잠겨 있다", () => {
    assert.equal(
      viewPolicy.isDisabled(EMPTY_SLOT, EMPTY_DRAFT, APPLY_CONTEXT),
      true,
    );
  });

  it("상태와 인원수를 서버가 준 그대로 보여 준다", () => {
    assert.equal(viewPolicy.resolveStatus(MY_SLOT, EMPTY_DRAFT), "MY_SCHEDULE");
    assert.equal(viewPolicy.resolveCount(MY_SLOT, EMPTY_DRAFT), 1);
    assert.equal(
      viewPolicy.resolveRequestStatus(MY_SLOT, EMPTY_DRAFT),
      undefined,
    );
  });

  it("눌러도 고른 내역이 달라지지 않는다", () => {
    assert.equal(
      viewPolicy.toggle(EMPTY_DRAFT, MY_SLOT, APPLY_CONTEXT),
      EMPTY_DRAFT,
    );
  });

  it("'자세히'를 켰을 때만 인원수를 보여 준다", () => {
    assert.equal(viewPolicy.countVisibility, "toggle");
  });
});

describe("applyPolicy", () => {
  it("내 근무를 고르면 삭제로 담고 빈 칸처럼 보여 준다", () => {
    const draft = applyPolicy.toggle(EMPTY_DRAFT, MY_SLOT, APPLY_CONTEXT);

    assert.equal(getDraftKind(draft, MY_SLOT), "DELETE");
    assert.equal(applyPolicy.resolveStatus(MY_SLOT, draft), "EMPTY");
    assert.equal(applyPolicy.resolveCount(MY_SLOT, draft), 0);
  });

  it("빈 칸을 고르면 추가로 담고 내 근무처럼 보여 준다", () => {
    const draft = applyPolicy.toggle(EMPTY_DRAFT, EMPTY_SLOT, APPLY_CONTEXT);

    assert.equal(getDraftKind(draft, EMPTY_SLOT), "ADD");
    assert.equal(applyPolicy.resolveStatus(EMPTY_SLOT, draft), "MY_SCHEDULE");
    assert.equal(applyPolicy.resolveCount(EMPTY_SLOT, draft), 1);
  });

  it("같은 칸을 다시 누르면 취소된다", () => {
    const draft = applyPolicy.toggle(
      applyPolicy.toggle(EMPTY_DRAFT, EMPTY_SLOT, APPLY_CONTEXT),
      EMPTY_SLOT,
      APPLY_CONTEXT,
    );

    assert.equal(getDraftKind(draft, EMPTY_SLOT), undefined);
  });

  it("인원수는 0 아래로 내려가지 않는다", () => {
    const zeroCountSlot = slotOf("MY_SCHEDULE", 0);
    const draft = draftWith([zeroCountSlot, "DELETE"]);

    assert.equal(applyPolicy.resolveCount(zeroCountSlot, draft), 0);
  });

  it("정원이 찬 빈 칸은 새로 고를 수 없다", () => {
    const draft = applyPolicy.toggle(EMPTY_DRAFT, FULL_SLOT, APPLY_CONTEXT);

    assert.equal(draft, EMPTY_DRAFT);
  });

  it("정원이 찼어도 이미 고른 칸은 취소할 수 있다", () => {
    const picked = draftWith([FULL_SLOT, "ADD"]);
    const draft = applyPolicy.toggle(picked, FULL_SLOT, APPLY_CONTEXT);

    assert.equal(getDraftKind(draft, FULL_SLOT), undefined);
  });

  it("승인 대기중이거나 미운영 시간인 칸은 눌러도 달라지지 않는다", () => {
    [PENDING_ADD_SLOT, PENDING_DELETE_SLOT, UNAVAILABLE_SLOT].forEach(
      (slot) => {
        assert.equal(
          applyPolicy.toggle(EMPTY_DRAFT, slot, APPLY_CONTEXT),
          EMPTY_DRAFT,
          slot.status,
        );
      },
    );
  });

  // 신청 화면은 정원이 찬 칸도 잠그지 않는다. 누를 수 없는 것은 toggle이 막는다.
  it("칸을 따로 잠그지 않고 인원수는 항상 보여 준다", () => {
    [MY_SLOT, EMPTY_SLOT, FULL_SLOT, PENDING_ADD_SLOT].forEach((slot) => {
      assert.equal(
        applyPolicy.isDisabled(slot, EMPTY_DRAFT, APPLY_CONTEXT),
        false,
        slot.status,
      );
    });
    assert.equal(applyPolicy.countVisibility, "always");
  });
});

describe("editPolicy", () => {
  const LIMIT = editContext(0, 1);

  it("확정된 시간표는 그대로 두고 요청만 덧칠한다", () => {
    const draft = draftWith([MY_SLOT, "DELETE"], [EMPTY_SLOT, "ADD"]);

    assert.equal(editPolicy.resolveStatus(MY_SLOT, draft), "MY_SCHEDULE");
    assert.equal(editPolicy.resolveCount(MY_SLOT, draft), 1);
    assert.equal(
      editPolicy.resolveRequestStatus(MY_SLOT, draft),
      "REQUEST_DELETE",
    );
    assert.equal(
      editPolicy.resolveRequestStatus(EMPTY_SLOT, draft),
      "REQUEST_ADD",
    );
  });

  it("삭제 요청한 칸의 숫자는 흐리게 보여 준다", () => {
    const draft = draftWith([MY_SLOT, "DELETE"]);

    assert.equal(
      editPolicy.resolveTextClassName(MY_SLOT, draft),
      "text-[#C2C4C6]",
    );
    assert.equal(editPolicy.resolveTextClassName(EMPTY_SLOT, draft), undefined);
  });

  it("내 근무는 언제든 삭제 요청할 수 있다", () => {
    assert.equal(editPolicy.isDisabled(MY_SLOT, EMPTY_DRAFT, LIMIT), false);
    assert.equal(
      getDraftKind(editPolicy.toggle(EMPTY_DRAFT, MY_SLOT, LIMIT), MY_SLOT),
      "DELETE",
    );
  });

  it("승인 대기중이거나 미운영 시간인 칸은 잠겨 있다", () => {
    [PENDING_ADD_SLOT, PENDING_DELETE_SLOT, UNAVAILABLE_SLOT].forEach(
      (slot) => {
        assert.equal(
          editPolicy.isDisabled(slot, EMPTY_DRAFT, LIMIT),
          true,
          slot.status,
        );
        assert.equal(
          editPolicy.toggle(EMPTY_DRAFT, slot, LIMIT),
          EMPTY_DRAFT,
          slot.status,
        );
      },
    );
  });

  it("정원이 찬 빈 칸은 잠겨 있다", () => {
    assert.equal(editPolicy.isDisabled(FULL_SLOT, EMPTY_DRAFT, LIMIT), true);
  });

  it("잔여 시간이 없으면 빈 칸이 잠긴다", () => {
    // 30분(0.5h)짜리 칸인데 남은 한도가 0이면 더 고를 수 없다.
    assert.equal(
      editPolicy.isDisabled(EMPTY_SLOT, EMPTY_DRAFT, editContext(0, 0)),
      true,
    );
    assert.equal(
      editPolicy.isDisabled(EMPTY_SLOT, EMPTY_DRAFT, editContext(0, 0.5)),
      false,
    );
    // 이미 0.5h를 골라 한도를 다 쓴 상태.
    assert.equal(
      editPolicy.isDisabled(EMPTY_SLOT, EMPTY_DRAFT, editContext(0.5, 0.5)),
      true,
    );
  });

  it("한도를 넘겨도 이미 고른 칸은 취소할 수 있다", () => {
    const picked = draftWith([EMPTY_SLOT, "ADD"]);
    const context = editContext(0.5, 0.5);

    assert.equal(editPolicy.isDisabled(EMPTY_SLOT, picked, context), false);
    assert.equal(
      getDraftKind(editPolicy.toggle(picked, EMPTY_SLOT, context), EMPTY_SLOT),
      undefined,
    );
  });

  it("한도를 넘기지 않으면 삭제 신청한 시간만큼만 추가할 수 있다", () => {
    // editLimit 없이 부르면 '지금까지 고른 삭제 시간'이 곧 추가 한도가 된다.
    const context = { maxConcurrentWorkers: MAX_CONCURRENT_WORKERS };

    assert.equal(editPolicy.isDisabled(EMPTY_SLOT, EMPTY_DRAFT, context), true);
    assert.equal(
      editPolicy.isDisabled(
        EMPTY_SLOT,
        draftWith([MY_SLOT, "DELETE"]),
        context,
      ),
      false,
    );
  });

  it("잠긴 칸은 눌러도 달라지지 않는다", () => {
    const context = editContext(0, 0);

    assert.equal(
      editPolicy.toggle(EMPTY_DRAFT, EMPTY_SLOT, context),
      EMPTY_DRAFT,
    );
  });

  it("인원수는 항상 보여 준다", () => {
    assert.equal(editPolicy.countVisibility, "always");
  });
});
