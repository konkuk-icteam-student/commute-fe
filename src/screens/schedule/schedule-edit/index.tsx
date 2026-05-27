"use client";

import { useState } from "react";

import {
  DUMMY_NEXT_MONTH_SCHEDULE,
  ScheduleHeader,
  ScheduleTable,
} from "@/features/schedule";
import { getMonthWeekOfDate, shiftDateByWeeks } from "@/lib/date-formatter";

export default function ScheduleEditScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const { year, month, week } = getMonthWeekOfDate(selectedDate);
  const currentMonthWeek = getMonthWeekOfDate(today);
  const prevWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, -1));
  const nextWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, 1));
  const isPrevWeekDisabled =
    currentMonthWeek.year !== prevWeekMonth.year ||
    currentMonthWeek.month !== prevWeekMonth.month ||
    prevWeekMonth.week < currentMonthWeek.week;
  const isNextWeekDisabled =
    currentMonthWeek.year !== nextWeekMonth.year ||
    currentMonthWeek.month !== nextWeekMonth.month;

  const handlePrevWeek = () => {
    setSelectedDate((currentDate) => {
      const prevDate = shiftDateByWeeks(currentDate, -1);
      const prevMonthWeek = getMonthWeekOfDate(prevDate);

      if (
        currentMonthWeek.year !== prevMonthWeek.year ||
        currentMonthWeek.month !== prevMonthWeek.month ||
        prevMonthWeek.week < currentMonthWeek.week
      ) {
        return currentDate;
      }

      return prevDate;
    });
  };

  const handleNextWeek = () => {
    setSelectedDate((currentDate) => {
      const nextDate = shiftDateByWeeks(currentDate, 1);
      const nextMonthWeek = getMonthWeekOfDate(nextDate);

      if (
        currentMonthWeek.year !== nextMonthWeek.year ||
        currentMonthWeek.month !== nextMonthWeek.month
      ) {
        return currentDate;
      }

      return nextDate;
    });
  };

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4">
      <ScheduleHeader type="edit" year={year} month={month} />
      <ScheduleTable
        type="edit"
        year={year}
        month={month}
        week={week}
        scheduleData={DUMMY_NEXT_MONTH_SCHEDULE}
        isPrevWeekDisabled={isPrevWeekDisabled}
        isNextWeekDisabled={isNextWeekDisabled}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        unavailableBeforeDate={today}
      />
    </div>
  );
}
