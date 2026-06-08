"use client";

import { useState } from "react";

import {
  ScheduleHeader,
  ScheduleTable,
  DUMMY_GET_SCHEDULE,
  ScheduleStatusLegend,
  ScheduleChangeHistoryPreview,
  DUMMY_SCHEDULE_CHANGE_HISTORY,
  WorkingHoursCard,
} from "@/features/schedule";
import { getMonthWeekOfDate, shiftDateByWeeks } from "@/lib/date-formatter";

// TODO: 추후 서버에서 받아올 값
const MIN_SESSION_HOURS = 1;
const MAX_WEEK_HOURS = 13;
const MAX_MONTH_HOURS = 27;

const WEEK_HOURS = 4;
const WEEK_TOTAL_HOURS = 7;
const MONTH_HOURS = 13;
const MONTH_TOTAL_HOURS = 27;

export default function ScheduleViewScreen() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const { year, month, week } = getMonthWeekOfDate(selectedDate);

  const handlePrevWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, -1));
  };

  const handleNextWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, 1));
  };

  return (
    <div className="flex w-full flex-col gap-4 px-3 py-4">
      <ScheduleHeader year={year} month={month} />
      <div className="flex flex-col gap-2">
        <ScheduleTable
          year={year}
          month={month}
          week={week}
          scheduleData={DUMMY_GET_SCHEDULE}
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
