"use client";

import { useState } from "react";

import {
  DUMMY_NEXT_MONTH_SCHEDULE,
  ScheduleHeader,
  ScheduleTable,
} from "@/features/schedule";
import { getMonthWeekOfDate, shiftDateByWeeks } from "@/lib/date-formatter";

const getFirstDateOfNextMonth = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth() + 1, 1);
};

export default function ScheduleApplyScreen() {
  const [selectedDate, setSelectedDate] = useState(getFirstDateOfNextMonth);
  const { year, month, week } = getMonthWeekOfDate(selectedDate);
  const prevWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, -1));
  const nextWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, 1));
  const isPrevWeekDisabled =
    year !== prevWeekMonth.year || month !== prevWeekMonth.month;
  const isNextWeekDisabled =
    year !== nextWeekMonth.year || month !== nextWeekMonth.month;

  const handlePrevWeek = () => {
    setSelectedDate((currentDate) => {
      const prevDate = shiftDateByWeeks(currentDate, -1);
      const currentMonth = getMonthWeekOfDate(currentDate);
      const prevMonth = getMonthWeekOfDate(prevDate);

      if (
        currentMonth.year !== prevMonth.year ||
        currentMonth.month !== prevMonth.month
      ) {
        return currentDate;
      }

      return prevDate;
    });
  };

  const handleNextWeek = () => {
    setSelectedDate((currentDate) => {
      const nextDate = shiftDateByWeeks(currentDate, 1);
      const currentMonth = getMonthWeekOfDate(currentDate);
      const nextMonth = getMonthWeekOfDate(nextDate);

      if (
        currentMonth.year !== nextMonth.year ||
        currentMonth.month !== nextMonth.month
      ) {
        return currentDate;
      }

      return nextDate;
    });
  };

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4">
      <ScheduleHeader type="apply" year={year} month={month} />
      <ScheduleTable
        type="apply"
        year={year}
        month={month}
        week={week}
        scheduleData={DUMMY_NEXT_MONTH_SCHEDULE}
        isPrevWeekDisabled={isPrevWeekDisabled}
        isNextWeekDisabled={isNextWeekDisabled}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
      />
    </div>
  );
}
