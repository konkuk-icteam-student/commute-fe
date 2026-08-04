import { getDraftKind, hasDraft, toggleDraft } from "../draft";
import type { SchedulePolicy } from "./types";

// 근로 신청 화면: 고른 내역을 칸에 곧바로 반영해 보여 준다.
// 추가로 고른 칸은 내 근무처럼, 지우기로 고른 칸은 빈 칸처럼 보인다.
// 기존 getApplySlotStatus / getApplySlotCurrentCount / toggleApplySlotChange를 옮긴 것이다.
export const applyPolicy: SchedulePolicy = {
  // 지우기로 고르면 빈 칸, 추가로 고르면 내 근무로 바꿔 보여 준다.
  resolveStatus: (slot, draft) => {
    const kind = getDraftKind(draft, slot);

    if (kind === "DELETE") {
      return "EMPTY";
    }

    if (kind === "ADD") {
      return "MY_SCHEDULE";
    }

    return slot.status;
  },

  // 신청 화면은 요청 상태를 덧칠하지 않고 상태 자체를 바꾼다.
  resolveRequestStatus: () => undefined,

  // 고른 내역만큼 인원수를 늘리거나 줄여 보여 준다.
  resolveCount: (slot, draft) => {
    const kind = getDraftKind(draft, slot);

    if (kind === "DELETE") {
      return Math.max(0, slot.currentCount - 1);
    }

    if (kind === "ADD") {
      return slot.currentCount + 1;
    }

    return slot.currentCount;
  },

  resolveTextClassName: () => undefined,

  // 신청 화면은 칸을 따로 잠그지 않는다. 정원이 찬 칸은 눌러도 변화가 없게 toggle에서 막는다.
  isDisabled: () => false,

  toggle: (draft, slot, { maxConcurrentWorkers }) => {
    if (slot.status === "MY_SCHEDULE") {
      return toggleDraft(draft, slot, "DELETE");
    }

    if (slot.status !== "EMPTY") {
      // 승인 대기중이거나 미운영 시간인 칸은 건드리지 않는다.
      return draft;
    }

    // 정원이 찬 칸은 새로 고를 수 없다. 이미 골라 둔 칸은 취소할 수 있어야 하므로 통과시킨다.
    if (
      slot.currentCount >= maxConcurrentWorkers &&
      !hasDraft(draft, slot, "ADD")
    ) {
      return draft;
    }

    return toggleDraft(draft, slot, "ADD");
  },

  countVisibility: "always",
};
