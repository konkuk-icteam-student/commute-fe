"use client";

import { useState } from "react";

import {
  DUMMY_SCHEDULE_CHANGE_HISTORY,
  EMPTY_SCHEDULE,
  getConfirmedSlotTimes,
  getCurrentMonthSlots,
  getSlotTimesTotalHours,
  ScheduleChangeHistoryPreview,
  ScheduleGrid,
  ScheduleHeader,
  ScheduleStatusLegend,
  ScheduleWeekNav,
  useScheduleGrid,
  useScheduleWeek,
  viewPolicy,
  WorkingHoursCard,
} from "@/features/schedule";
import { useGetPeriodSchedulesQuery } from "@/apis/work-schedules";
import { getMonthWeekDateRange } from "@/lib/date-formatter";
import { Toggle } from "@/components/ui";

// TODO: 응답에 대응하는 값이 없어 아직 화면에 둔다
const MIN_SESSION_HOURS = 1;
const MAX_WEEK_HOURS = 13;

export default function ScheduleViewScreen() {
  // 조회는 이번 달 안에서만 이동할 수 있다.
  const [today] = useState(() => new Date());
  const {
    year,
    month,
    week,
    isPrevWeekDisabled,
    isNextWeekDisabled,
    goPrevWeek,
    goNextWeek,
  } = useScheduleWeek(today);
  // '자세히'를 켜야 칸마다 인원수를 보여 준다.
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const { startDate, endDate } = getMonthWeekDateRange(year, month, week);
  const { periodSchedulesData, isPendingPeriodSchedules } =
    useGetPeriodSchedulesQuery({
      startDate,
      endDate,
    });

  // 응답 전에는 빈 시간표로 그린다. 표 모양이 유지되고 모든 칸이 잠긴 상태로 보인다.
  const schedule = periodSchedulesData ?? EMPTY_SCHEDULE;
  const monthLimitHours = periodSchedulesData?.totalLimitHours ?? 0;
  const monthUsedHours = periodSchedulesData?.usedHours ?? 0;

  const { days, cells } = useScheduleGrid({
    data: schedule,
    year,
    month,
    week,
    policy: viewPolicy,
    context: {
      maxConcurrentWorkers: schedule.maxConcurrentWorkers,
    },
    isDetailVisible,
  });

  // 주 단위 근무시간은 응답에 없어서 이 주차의 확정 슬롯으로 직접 계산한다.
  const weekHours = getSlotTimesTotalHours(
    getConfirmedSlotTimes(getCurrentMonthSlots(days)),
  );

  return (
    <div className="flex w-full flex-col gap-4 px-3 py-4">
      <ScheduleHeader year={year} month={month} />
      <div className="flex flex-col gap-2">
        <ScheduleWeekNav
          week={week}
          isPrevWeekDisabled={isPrevWeekDisabled}
          isNextWeekDisabled={isNextWeekDisabled}
          onPrevWeek={goPrevWeek}
          onNextWeek={goNextWeek}
          action={
            <Toggle
              checked={isDetailVisible}
              onCheckedChange={setIsDetailVisible}
              label="자세히"
            />
          }
        />
        <ScheduleGrid
          days={days}
          cells={cells}
          isLoading={isPendingPeriodSchedules}
        />
        <ScheduleStatusLegend
          minSessionHours={MIN_SESSION_HOURS}
          weeklyMaxHours={MAX_WEEK_HOURS}
          monthlyTargetHours={monthLimitHours}
        />
      </div>
      <div className="flex flex-col gap-2">
        <WorkingHoursCard
          label={`${week}주차 총 시간`}
          hours={weekHours}
          maxHours={MAX_WEEK_HOURS}
        />
        <WorkingHoursCard
          label={`${month}월 전체`}
          hours={monthUsedHours}
          maxHours={monthLimitHours}
          withProgressBar
        />
        <ScheduleChangeHistoryPreview
          histories={DUMMY_SCHEDULE_CHANGE_HISTORY}
        />
      </div>
    </div>
  );
}
