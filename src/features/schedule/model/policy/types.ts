import type {
  ScheduleRequestEditStatus,
  ScheduleSlotStatus,
} from "../../types";
import type { ScheduleDraft } from "../draft";
import type { WeekSlot } from "../week-schedule";

export interface PolicyContext {
  maxConcurrentWorkers: number;
  // 수정 요청 화면 전용 한도. 다른 화면은 넘기지 않는다.
  editLimit?: {
    // 이미 고른 추가 근무 시간 합계. 칸마다 다시 더하지 않으려고 미리 계산해 넘긴다.
    addHours: number;
    // 이번 달에 추가로 신청할 수 있는 잔여 시간.
    maxAddHours: number;
  };
}

// 화면(모드)마다 다른 규칙을 한곳에 모아 담는 그릇.
// 표와 화면은 조건을 직접 판단하지 않고 이 정책에만 물어본다.
export interface SchedulePolicy {
  // 칸에 그릴 상태. 신청 화면만 고른 내역을 반영해 상태를 바꿔 보여 준다.
  resolveStatus(slot: WeekSlot, draft: ScheduleDraft): ScheduleSlotStatus;
  // 원래 색 위에 덧칠할 요청 상태. 수정 요청 화면만 쓴다.
  resolveRequestStatus(
    slot: WeekSlot,
    draft: ScheduleDraft,
  ): ScheduleRequestEditStatus | undefined;
  // 칸에 표시할 인원수. 신청 화면만 고른 내역을 반영해 ±1 한다.
  resolveCount(slot: WeekSlot, draft: ScheduleDraft): number;
  // 글자색 예외. 지정하지 않으면 표의 기본 규칙을 따른다.
  resolveTextClassName(
    slot: WeekSlot,
    draft: ScheduleDraft,
  ): string | undefined;
  // 클릭할 수 없는 칸인지.
  isDisabled(
    slot: WeekSlot,
    draft: ScheduleDraft,
    context: PolicyContext,
  ): boolean;
  // 칸을 눌렀을 때 달라진 변경 내역. 누를 수 없는 칸이면 받은 값을 그대로 돌려준다.
  toggle(
    draft: ScheduleDraft,
    slot: WeekSlot,
    context: PolicyContext,
  ): ScheduleDraft;
  // 인원수를 언제 보여 줄지. 조회 화면은 '자세히'를 켰을 때만 보여 준다.
  countVisibility: "toggle" | "always";
}
