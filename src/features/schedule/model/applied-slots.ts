import type { ScheduleSlotTime } from "../types";
import type { ScheduleDraft } from "./draft";
import { applyPolicy } from "./policy/apply";
import type { WeekSlot } from "./week-schedule";

// 고른 내역을 반영한 뒤에도 내 근무로 남는 슬롯들.
// 최소 근무시간 검사는 신청 화면과 수정 요청 화면이 모두 '신청 화면 기준'으로 판단한다.
// (기존 hasAppliedScheduleBelowMinSessionHours가 두 화면 모두 getApplySlotStatus를 쓰던 것을 그대로 옮긴 것)
export const getAppliedSlotTimes = (
  slots: WeekSlot[],
  draft: ScheduleDraft,
): ScheduleSlotTime[] =>
  slots
    .filter((slot) => applyPolicy.resolveStatus(slot, draft) === "MY_SCHEDULE")
    .map(({ date, start, end }) => ({ date, start, end }));
