import type { ScheduleApplyPayload, ScheduleSlotTime } from "../types";
import { mergeContinuousSlotTimes } from "../utils";
import { toSlotKey, type SlotKey } from "./slot-key";

// 화면에서 고른 변경의 종류. 서버로 보낼 때 addSlots / deleteSlots로 나뉜다.
export type DraftKind = "ADD" | "DELETE";

interface DraftEntry {
  kind: DraftKind;
  slot: ScheduleSlotTime;
}

// 아직 제출하지 않은 변경 내역. 슬롯 하나당 최대 한 종류만 담긴다.
export type ScheduleDraft = ReadonlyMap<SlotKey, DraftEntry>;

// 아무것도 고르지 않은 초기 상태.
export const EMPTY_DRAFT: ScheduleDraft = new Map();

// 이 슬롯이 어떤 변경으로 담겨 있는지. 담겨 있지 않으면 undefined.
export const getDraftKind = (
  draft: ScheduleDraft,
  slot: ScheduleSlotTime,
): DraftKind | undefined => draft.get(toSlotKey(slot))?.kind;

// 이 슬롯이 해당 종류로 담겨 있는지.
export const hasDraft = (
  draft: ScheduleDraft,
  slot: ScheduleSlotTime,
  kind: DraftKind,
): boolean => getDraftKind(draft, slot) === kind;

// 담겨 있으면 빼고, 없으면 넣는다. 원본을 바꾸지 않고 새 Map을 돌려준다.
export const toggleDraft = (
  draft: ScheduleDraft,
  slot: ScheduleSlotTime,
  kind: DraftKind,
): ScheduleDraft => {
  const key = toSlotKey(slot);
  const nextDraft = new Map(draft);

  if (nextDraft.has(key)) {
    nextDraft.delete(key);

    return nextDraft;
  }

  nextDraft.set(key, {
    kind,
    slot: { date: slot.date, start: slot.start, end: slot.end },
  });

  return nextDraft;
};

// 해당 종류로 담긴 슬롯 시간 목록. 담은 순서를 그대로 유지한다.
export const getDraftSlotTimes = (
  draft: ScheduleDraft,
  kind: DraftKind,
): ScheduleSlotTime[] =>
  [...draft.values()]
    .filter((entry) => entry.kind === kind)
    .map(({ slot }) => slot);

// 병합 전 형태. 근무시간 합계처럼 슬롯 단위 계산에 쓴다.
export const toRawPayload = (draft: ScheduleDraft): ScheduleApplyPayload => ({
  deleteSlots: getDraftSlotTimes(draft, "DELETE"),
  addSlots: getDraftSlotTimes(draft, "ADD"),
});

// 이어진 슬롯을 하나의 시간 구간으로 합친 제출용 형태.
export const toPayload = (draft: ScheduleDraft): ScheduleApplyPayload => ({
  deleteSlots: mergeContinuousSlotTimes(getDraftSlotTimes(draft, "DELETE")),
  addSlots: mergeContinuousSlotTimes(getDraftSlotTimes(draft, "ADD")),
});
