import type { SchedulePolicy } from "./types";

// 조회 화면: 서버가 준 그대로 보여 주기만 하고 아무것도 고를 수 없다.
// 기존 ScheduleTable의 type="view" 분기를 그대로 옮긴 것이다.
export const viewPolicy: SchedulePolicy = {
  resolveStatus: (slot) => slot.status,

  resolveRequestStatus: () => undefined,

  resolveCount: (slot) => slot.currentCount,

  resolveTextClassName: () => undefined,

  // 조회 화면의 칸은 언제나 잠겨 있다.
  isDisabled: () => true,

  // 누를 수 없으므로 변경 내역도 달라지지 않는다.
  toggle: (draft) => draft,

  countVisibility: "toggle",
};
