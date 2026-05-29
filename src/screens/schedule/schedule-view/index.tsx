"use client";

import { useState } from "react";

import {
  ScheduleHeader,
  ScheduleTable,
  DUMMY_GET_SCHEDULE,
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
    <div className="flex w-full flex-col gap-5 px-3 py-4">
      <ScheduleHeader year={year} month={month} />
      <ScheduleTable
        year={year}
        month={month}
        week={week}
        scheduleData={DUMMY_GET_SCHEDULE}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
      />
    </div>
  );
}
