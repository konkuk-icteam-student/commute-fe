"use client";

import { useEffect, useState } from "react";

import {
  DUMMY_GET_SCHEDULE,
  DUMMY_SCHEDULE_CHANGE_HISTORY,
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
import { useGetMonthlySchedulesQuery } from "@/apis/work-schedules";
import { Toggle } from "@/components/ui";

// TODO: 추후 서버에서 받아올 값
const MIN_SESSION_HOURS = 1;
const MAX_WEEK_HOURS = 13;
const MAX_MONTH_HOURS = 27;

const WEEK_HOURS = 4;
const WEEK_TOTAL_HOURS = 7;
const MONTH_HOURS = 13;
const MONTH_TOTAL_HOURS = 27;

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

  const { days, cells } = useScheduleGrid({
    data: DUMMY_GET_SCHEDULE,
    year,
    month,
    week,
    policy: viewPolicy,
    context: {
      maxConcurrentWorkers: DUMMY_GET_SCHEDULE.maxConcurrentWorkers,
    },
    isDetailVisible,
  });

  // TODO: 이건 api 연동 및 TanStack Query 적용 예시임
  const { monthlySchedulesData } = useGetMonthlySchedulesQuery({
    year: year,
    month: month,
  });

  useEffect(() => {
    console.log(monthlySchedulesData);
  }, [monthlySchedulesData]);

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
        <ScheduleGrid days={days} cells={cells} />
        <ScheduleStatusLegend
          minSessionHours={MIN_SESSION_HOURS}
          weeklyMaxHours={MAX_WEEK_HOURS}
          monthlyTargetHours={MAX_MONTH_HOURS}
        />
      </div>
      <div className="flex flex-col gap-2">
        <WorkingHoursCard
          label={`${week}주차 총 시간`}
          hours={WEEK_HOURS}
          maxHours={WEEK_TOTAL_HOURS}
        />
        <WorkingHoursCard
          label={`${month}월 전체`}
          hours={MONTH_HOURS}
          maxHours={MONTH_TOTAL_HOURS}
          withProgressBar
        />
        <ScheduleChangeHistoryPreview
          histories={DUMMY_SCHEDULE_CHANGE_HISTORY}
        />
      </div>
    </div>
  );
}
