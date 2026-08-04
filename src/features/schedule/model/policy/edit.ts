import { getSlotTimesTotalHours } from "../../utils";
import {
  getDraftKind,
  getDraftSlotTimes,
  hasDraft,
  toggleDraft,
} from "../draft";
import type { ScheduleDraft } from "../draft";
import type { WeekSlot } from "../week-schedule";
import type { PolicyContext, SchedulePolicy } from "./types";

// 승인 대기중이거나 미운영 시간이라 손댈 수 없는 칸.
const isLockedStatus = (status: WeekSlot["status"]) =>
  status === "PENDING_ADD" ||
  status === "PENDING_DELETE" ||
  status === "UNAVAILABLE";

// 한도가 넘어오지 않으면 기존 getRequestEditSlotDisabled의 기본값과 같게 직접 계산한다.
// (추가 신청 한도 = 지금까지 고른 삭제 시간)
const resolveEditLimit = (draft: ScheduleDraft, context: PolicyContext) =>
  context.editLimit ?? {
    addHours: getSlotTimesTotalHours(getDraftSlotTimes(draft, "ADD")),
    maxAddHours: getSlotTimesTotalHours(getDraftSlotTimes(draft, "DELETE")),
  };

// 이 빈 칸을 하나 더 고르면 이번 달 추가 신청 한도를 넘는지.
const isOverAddLimit = (
  slot: WeekSlot,
  draft: ScheduleDraft,
  context: PolicyContext,
) => {
  const { addHours, maxAddHours } = resolveEditLimit(draft, context);

  return addHours + getSlotTimesTotalHours([slot]) > maxAddHours;
};

// 수정 요청 화면: 확정된 시간표는 그대로 두고 요청한 변경만 테두리로 덧칠한다.
// 기존 getRequestEditSlotStatus / getRequestEditSlotDisabled / toggleRequestEditSlotChange를 옮긴 것이다.
export const editPolicy: SchedulePolicy = {
  // 원래 시간표를 그대로 보여 준다. 변경 요청은 requestStatus로만 표시한다.
  resolveStatus: (slot) => slot.status,

  resolveRequestStatus: (slot, draft) => {
    const kind = getDraftKind(draft, slot);

    if (kind === "DELETE") {
      return "REQUEST_DELETE";
    }

    return kind === "ADD" ? "REQUEST_ADD" : undefined;
  },

  // 수정 요청은 인원수를 바꿔 보여 주지 않는다.
  resolveCount: (slot) => slot.currentCount,

  // 삭제 요청한 칸의 숫자는 흐리게 보여 준다.
  resolveTextClassName: (slot, draft) =>
    hasDraft(draft, slot, "DELETE") ? "text-[#C2C4C6]" : undefined,

  isDisabled: (slot, draft, context) => {
    if (isLockedStatus(slot.status)) {
      return true;
    }

    // 내 근무는 언제든 삭제 요청할 수 있다.
    if (slot.status !== "EMPTY") {
      return false;
    }

    // 이미 고른 칸은 취소할 수 있어야 하므로 한도와 정원을 따지지 않는다.
    if (hasDraft(draft, slot, "ADD")) {
      return false;
    }

    if (slot.currentCount >= context.maxConcurrentWorkers) {
      return true;
    }

    return isOverAddLimit(slot, draft, context);
  },

  toggle: (draft, slot, context) => {
    if (isLockedStatus(slot.status)) {
      return draft;
    }

    if (slot.status !== "EMPTY") {
      return toggleDraft(draft, slot, "DELETE");
    }

    if (editPolicy.isDisabled(slot, draft, context)) {
      return draft;
    }

    return toggleDraft(draft, slot, "ADD");
  },

  countVisibility: "always",
};
