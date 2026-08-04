import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  ScheduleApplyPayload,
  ScheduleSlotStatus,
  ScheduleSlotTime,
} from "../../types";
import type { WeekSlot } from "../week-schedule";
import type { DraftKind, ScheduleDraft } from "../draft";

const { applyPolicy } = (await import(
  new URL("./apply.ts", import.meta.url).href
)) as typeof import("./apply");
const { editPolicy } = (await import(
  new URL("./edit.ts", import.meta.url).href
)) as typeof import("./edit");
const { viewPolicy } = (await import(
  new URL("./view.ts", import.meta.url).href
)) as typeof import("./view");
const { EMPTY_DRAFT, toggleDraft, toRawPayload } = (await import(
  new URL("../draft.ts", import.meta.url).href
)) as typeof import("../draft");
const { toSlotKey } = (await import(
  new URL("../slot-key.ts", import.meta.url).href
)) as typeof import("../slot-key");
const {
  getApplySlotCurrentCount,
  getApplySlotStatus,
  getRequestEditSlotDisabled,
  getRequestEditSlotStatus,
  getSlotTimesTotalHours,
  toggleApplySlotChange,
  toggleRequestEditSlotChange,
} = (await import(
  new URL("../../utils/index.ts", import.meta.url).href
)) as typeof import("../../utils");

const MAX_CONCURRENT_WORKERS = 3;
const DATE = "2026-07-01";

const STATUSES: ScheduleSlotStatus[] = [
  "MY_SCHEDULE",
  "PENDING_ADD",
  "PENDING_DELETE",
  "UNAVAILABLE",
  "EMPTY",
];
// 정원 미만 / 정원 도달 / 정원 초과를 모두 훑는다.
const COUNTS = [0, 2, 3, 4];
const MAX_ADD_HOURS = [0, 0.5, 1, 5];

const weekSlotOf = (
  status: ScheduleSlotStatus,
  currentCount: number,
): WeekSlot => ({
  key: toSlotKey({ date: DATE, start: "09:00", end: "09:30" }),
  date: DATE,
  start: "09:00",
  end: "09:30",
  status,
  currentCount,
  isHourStart: true,
});

// 이미 골라 둔 다른 칸. 추가 신청 시간 합계가 0이 아닌 상황을 만든다.
const OTHER_SLOT: ScheduleSlotTime = {
  date: DATE,
  start: "14:00",
  end: "14:30",
};

// 기존 utils가 payload에 담던 형태와 맞춘다. (toSlotTime)
const toSlotTime = ({
  date,
  start,
  end,
}: ScheduleSlotTime): ScheduleSlotTime => ({
  date,
  start,
  end,
});

// 같은 상태를 드래프트와 기존 payload 두 형태로 나란히 만든다.
const buildStates = (entries: [ScheduleSlotTime, DraftKind][]) => {
  const payload: ScheduleApplyPayload = { deleteSlots: [], addSlots: [] };
  let draft: ScheduleDraft = EMPTY_DRAFT;

  entries.forEach(([slot, kind]) => {
    draft = toggleDraft(draft, slot, kind);
    if (kind === "ADD") {
      payload.addSlots.push(toSlotTime(slot));
    } else {
      payload.deleteSlots.push(toSlotTime(slot));
    }
  });

  return { draft, payload };
};

// 슬롯 하나에 대해 시험할 드래프트 상태들.
// 빈 칸은 추가로만, 이미 잡힌 근무는 삭제로만 담긴다. 화면이 실제로 만들 수 있는 상태만 시험한다.
const draftCasesFor = (slot: WeekSlot) => {
  const selfKind: DraftKind = slot.status === "EMPTY" ? "ADD" : "DELETE";

  return [
    { label: "비어 있음", ...buildStates([]) },
    { label: "다른 칸만 추가", ...buildStates([[OTHER_SLOT, "ADD"]]) },
    {
      label: `이 칸을 ${selfKind}`,
      ...buildStates([
        [OTHER_SLOT, "ADD"],
        [slot, selfKind],
      ]),
    },
  ];
};

const eachCase = (
  run: (
    slot: WeekSlot,
    state: ReturnType<typeof draftCasesFor>[number],
    label: string,
  ) => void,
) => {
  STATUSES.forEach((status) => {
    COUNTS.forEach((currentCount) => {
      const slot = weekSlotOf(status, currentCount);

      draftCasesFor(slot).forEach((state) => {
        run(slot, state, `${status} / 인원 ${currentCount} / ${state.label}`);
      });
    });
  });
};

// 대조 테스트 ③ — policy가 기존 함수와 같은 판정을 내는지 모든 조합에서 확인한다.
describe("applyPolicy 는 기존 신청 화면 함수와 같은 판정을 낸다", () => {
  it("resolveStatus == getApplySlotStatus", () => {
    eachCase((slot, { draft, payload }, label) => {
      assert.equal(
        applyPolicy.resolveStatus(slot, draft),
        getApplySlotStatus(slot, payload),
        label,
      );
    });
  });

  it("resolveCount == getApplySlotCurrentCount", () => {
    eachCase((slot, { draft, payload }, label) => {
      assert.equal(
        applyPolicy.resolveCount(slot, draft),
        getApplySlotCurrentCount(slot, payload),
        label,
      );
    });
  });

  it("toggle == toggleApplySlotChange", () => {
    eachCase((slot, { draft, payload }, label) => {
      assert.deepEqual(
        toRawPayload(
          applyPolicy.toggle(draft, slot, {
            maxConcurrentWorkers: MAX_CONCURRENT_WORKERS,
          }),
        ),
        toggleApplySlotChange(payload, slot, MAX_CONCURRENT_WORKERS),
        label,
      );
    });
  });
});

describe("editPolicy 는 기존 수정 요청 화면 함수와 같은 판정을 낸다", () => {
  it("resolveRequestStatus == getRequestEditSlotStatus", () => {
    eachCase((slot, { draft, payload }, label) => {
      assert.equal(
        editPolicy.resolveRequestStatus(slot, draft),
        getRequestEditSlotStatus(slot, payload),
        label,
      );
    });
  });

  it("isDisabled == getRequestEditSlotDisabled", () => {
    MAX_ADD_HOURS.forEach((maxAddHours) => {
      eachCase((slot, { draft, payload }, label) => {
        const context = {
          maxConcurrentWorkers: MAX_CONCURRENT_WORKERS,
          editLimit: {
            addHours: getSlotTimesTotalHours(payload.addSlots),
            maxAddHours,
          },
        };

        assert.equal(
          editPolicy.isDisabled(slot, draft, context),
          getRequestEditSlotDisabled(
            slot,
            payload,
            MAX_CONCURRENT_WORKERS,
            maxAddHours,
          ),
          `${label} / 한도 ${maxAddHours}`,
        );
      });
    });
  });

  it("한도를 넘기지 않으면 기존 기본값(삭제 시간 합계)과 같게 계산한다", () => {
    eachCase((slot, { draft, payload }, label) => {
      assert.equal(
        editPolicy.isDisabled(slot, draft, {
          maxConcurrentWorkers: MAX_CONCURRENT_WORKERS,
        }),
        getRequestEditSlotDisabled(slot, payload, MAX_CONCURRENT_WORKERS),
        label,
      );
    });
  });

  it("toggle == toggleRequestEditSlotChange", () => {
    MAX_ADD_HOURS.forEach((maxAddHours) => {
      eachCase((slot, { draft, payload }, label) => {
        const context = {
          maxConcurrentWorkers: MAX_CONCURRENT_WORKERS,
          editLimit: {
            addHours: getSlotTimesTotalHours(payload.addSlots),
            maxAddHours,
          },
        };

        assert.deepEqual(
          toRawPayload(editPolicy.toggle(draft, slot, context)),
          toggleRequestEditSlotChange(
            payload,
            slot,
            MAX_CONCURRENT_WORKERS,
            maxAddHours,
          ),
          `${label} / 한도 ${maxAddHours}`,
        );
      });
    });
  });
});

describe('viewPolicy 는 기존 type="view" 분기와 같다', () => {
  it("항상 잠겨 있고 상태·인원수를 그대로 보여 준다", () => {
    eachCase((slot, { draft }, label) => {
      assert.equal(viewPolicy.isDisabled(), true, label);
      assert.equal(viewPolicy.resolveStatus(slot, draft), slot.status, label);
      assert.equal(
        viewPolicy.resolveCount(slot, draft),
        slot.currentCount,
        label,
      );
      assert.equal(viewPolicy.toggle(draft), draft, label);
    });
  });
});
