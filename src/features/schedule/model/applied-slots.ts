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

// 서버가 확정해 준 내 근무 슬롯. 아직 고르기만 한 내역은 빼고 센다.
// 응답에 주 단위 근무시간이 없어서 이 주차의 슬롯으로 직접 계산한다.
export const getConfirmedSlotTimes = (slots: WeekSlot[]): ScheduleSlotTime[] =>
  slots
    .filter((slot) => slot.status === "MY_SCHEDULE")
    .map(({ date, start, end }) => ({ date, start, end }));
