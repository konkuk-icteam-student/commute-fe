"use client";

import { useState } from "react";

import {
  DUMMY_SCHEDULE_CHANGE_HISTORY,
  EMPTY_SCHEDULE,
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
import {
  useGetPeriodSchedulesQuery,
  useGetWorkSchedulesSummaryQuery,
} from "@/apis/work-schedules";
import { getMonthWeekDateRange } from "@/lib/date-formatter";
import { Toggle } from "@/components/ui";

// TODO: 응답에 대응하는 값이 없어 아직 화면에 둔다
const MIN_SESSION_HOURS = 1;

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

  // 근로시간은 시간표와 따로 조회한다. 주간·월간 합계와 한도를 서버가 계산해 준다.
  const { workSchedulesSummaryData, isPendingWorkSchedulesSummary } =
    useGetWorkSchedulesSummaryQuery({
      startDate,
      endDate,
    });

  // 응답 전에는 빈 시간표로 그린다. 표 모양이 유지되고 모든 칸이 잠긴 상태로 보인다.
  const schedule = periodSchedulesData ?? EMPTY_SCHEDULE;
  const weekSummary = workSchedulesSummaryData?.week;
  const monthSummary = workSchedulesSummaryData?.month;

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
          weeklyMaxHours={weekSummary?.limitHours ?? 0}
          monthlyTargetHours={monthSummary?.limitHours ?? 0}
        />
      </div>
      <div className="flex flex-col gap-2">
        <WorkingHoursCard
          label={`${week}주차 총 시간`}
          hours={weekSummary?.usedHours ?? 0}
          maxHours={weekSummary?.limitHours ?? 0}
          isLoading={isPendingWorkSchedulesSummary}
        />
        <WorkingHoursCard
          label={`${month}월 전체`}
          hours={monthSummary?.usedHours ?? 0}
          maxHours={monthSummary?.limitHours ?? 0}
          withProgressBar
          isLoading={isPendingWorkSchedulesSummary}
        />
        <ScheduleChangeHistoryPreview
          histories={DUMMY_SCHEDULE_CHANGE_HISTORY}
        />
      </div>
    </div>
  );
}
