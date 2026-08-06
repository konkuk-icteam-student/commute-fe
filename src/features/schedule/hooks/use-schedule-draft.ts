import { useState } from "react";

import {
  EMPTY_DRAFT,
  toPayload,
  toRawPayload,
  type ScheduleDraft,
} from "../model/draft";
import type { PolicyContext, SchedulePolicy } from "../model/policy";
import type { WeekSlot } from "../model/week-schedule";
import { getSlotTimesTotalHours } from "../utils";

interface UseScheduleDraftOptions {
  policy: SchedulePolicy;
  // 한도가 지금까지 고른 내역에 따라 달라지므로, 값이 아니라 계산하는 함수를 받는다.
  // 칸을 누르는 시점의 최신 내역으로 판단해야 하기 때문이다.
  resolveContext: (draft: ScheduleDraft) => PolicyContext;
}

// 아직 제출하지 않은 변경 내역과, 거기서 파생되는 시간 합계를 관리한다.
export const useScheduleDraft = ({
  policy,
  resolveContext,
}: UseScheduleDraftOptions) => {
  const [draft, setDraft] = useState<ScheduleDraft>(EMPTY_DRAFT);

  const toggleSlot = (slot: WeekSlot) => {
    setDraft((currentDraft) =>
      policy.toggle(currentDraft, slot, resolveContext(currentDraft)),
    );
  };

  // 제출이 끝나면 담아 둔 내역을 비운다.
  // 서버에 반영된 표 위에 같은 슬롯이 남아 있으면 신청 시간이 두 번 계산된다.
  const resetDraft = () => setDraft(EMPTY_DRAFT);

  const rawPayload = toRawPayload(draft);

  return {
    draft,
    toggleSlot,
    resetDraft,
    context: resolveContext(draft),
    // 슬롯 단위 그대로. 시간 합계와 주 단위 계산에 쓴다.
    rawPayload,
    // 이어진 슬롯을 합친 제출용.
    payload: toPayload(draft),
    addHours: getSlotTimesTotalHours(rawPayload.addSlots),
    deleteHours: getSlotTimesTotalHours(rawPayload.deleteSlots),
  };
};
