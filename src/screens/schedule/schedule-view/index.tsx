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
          minSessionHours={1}
          weeklyMaxHours={13}
          monthlyTargetHours={27}
        />
      </div>
      <div className="flex flex-col gap-2">
        <WorkingHoursCard
          label={`${week}주차 총 시간`}
          hours={3}
          maxHours={7}
        />
        <WorkingHoursCard
          label={`${month}월 전체`}
          hours={3}
          maxHours={27}
          withProgressBar
        />
        <ScheduleChangeHistoryPreview
          histories={DUMMY_SCHEDULE_CHANGE_HISTORY}
        />
      </div>
    </div>
  );
}
