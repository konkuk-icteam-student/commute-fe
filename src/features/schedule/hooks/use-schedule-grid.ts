import { getWeekdaysOfMonthWeek } from "@/lib/date-formatter";

import type { ScheduleCell } from "../components/schedule-grid/types";
import { EMPTY_DRAFT, type ScheduleDraft } from "../model/draft";
import type { PolicyContext, SchedulePolicy } from "../model/policy";
import {
  buildWeekSchedule,
  type WeekDay,
  type WeekSlot,
} from "../model/week-schedule";
import type { WeekScheduleData } from "../types";

interface UseScheduleGridOptions {
  data: WeekScheduleData;
  year: number;
  month: number;
  week: number;
  policy: SchedulePolicy;
  context: PolicyContext;
  draft?: ScheduleDraft;
  // '자세히'를 켰는지. countVisibility가 "toggle"인 화면에서만 쓰인다.
  isDetailVisible?: boolean;
  onSlotClick?: (slot: WeekSlot) => void;
}

// 표에 그릴 칸 하나를 계산한다. 화면·표에 흩어져 있던 판단이 모두 여기로 모인다.
const toCell = (
  slot: WeekSlot,
  day: WeekDay,
  dayIndex: number,
  options: UseScheduleGridOptions,
): ScheduleCell => {
  const {
    data,
    policy,
    context,
    draft = EMPTY_DRAFT,
    isDetailVisible = false,
    onSlotClick,
  } = options;

  // 이번 달이 아닌 날짜는 정책보다 먼저 잠근다.
  const status = day.isCurrentMonth
    ? policy.resolveStatus(slot, draft)
    : "UNAVAILABLE";
  const isUnavailable = status === "UNAVAILABLE";

  return {
    key: slot.key,
    status,
    requestStatus: policy.resolveRequestStatus(slot, draft),
    textClassName: policy.resolveTextClassName(slot, draft),
    count: policy.resolveCount(slot, draft),
    maxCount: data.maxConcurrentWorkers,
    disabled: isUnavailable || policy.isDisabled(slot, draft, context),
    showCount:
      !isUnavailable &&
      (policy.countVisibility === "always" || isDetailVisible),
    // 시간 라벨은 첫 번째 요일의 정시 칸에만 붙인다.
    hourMark:
      dayIndex === 0 && slot.isHourStart
        ? Number(slot.start.slice(0, 2))
        : undefined,
    onClick: () => onSlotClick?.(slot),
  };
};

// 주차 데이터를 그릴 수 있는 형태로 만든다. 화면은 결과를 표에 그대로 넘기기만 하면 된다.
export const useScheduleGrid = (options: UseScheduleGridOptions) => {
  const { data, year, month, week } = options;
  const days = buildWeekSchedule(
    data,
    getWeekdaysOfMonthWeek(year, month, week),
  );

  return {
    days,
    cells: days.map((day, dayIndex) =>
      day.slots.map((slot) => toCell(slot, day, dayIndex, options)),
    ),
  };
};
