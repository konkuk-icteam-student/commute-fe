"use client";

import { useEffect, useState } from "react";

import {
  ScheduleHeader,
  ScheduleTable,
  DUMMY_GET_SCHEDULE,
  ScheduleStatusLegend,
  ScheduleChangeHistoryPreview,
  DUMMY_SCHEDULE_CHANGE_HISTORY,
  WorkingHoursCard,
} from "@/features/schedule";
import { getMonthWeekOfDate } from "@/lib/date-formatter";
import { useGetMonthlySchedulesQuery } from "@/apis/work-schedules";

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
  const { year, month, week: currentWeek, maxWeek } = getMonthWeekOfDate(today);
  const [week, setWeek] = useState(currentWeek);

  // TODO: 이건 api 연동 및 TanStack Query 적용 예시임
  const { monthlySchedulesData } = useGetMonthlySchedulesQuery({
    year: 2026,
    month: 7,
  });

  const handlePrevWeek = () => {
    setWeek((currentWeekNumber) => Math.max(1, currentWeekNumber - 1));
  };

  const handleNextWeek = () => {
    setWeek((currentWeekNumber) => Math.min(maxWeek, currentWeekNumber + 1));
  };

  useEffect(() => {
    console.log(monthlySchedulesData);
  }, [monthlySchedulesData]);

  return (
    <div className="flex w-full flex-col gap-4 px-3 py-4">
      <ScheduleHeader year={year} month={month} />
      <div className="flex flex-col gap-2">
        <ScheduleTable
          year={year}
          month={month}
          week={week}
          scheduleData={DUMMY_GET_SCHEDULE}
          isPrevWeekDisabled={week <= 1}
          isNextWeekDisabled={week >= maxWeek}
          handlePrevWeek={handlePrevWeek}
          handleNextWeek={handleNextWeek}
        />
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
