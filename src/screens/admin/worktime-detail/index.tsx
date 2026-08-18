"use client";

import { useState } from "react";

import { useGetAdminWorkSchedulesQuery } from "@/apis/work-schedules";
import { ScheduleErrorModal, useScheduleErrorModal } from "@/features/schedule";
import {
  toWorktimeDetailSlotsByDay,
  WorktimeDetailQuickSearch,
  WorktimeDetailSection,
} from "@/features/admin/worktime";
import {
  getMonthWeekDateRange,
  getMonthWeekOfDate,
  getWeekdaysOfMonthWeek,
  shiftDateByWeeks,
} from "@/lib/date-formatter";

export default function WorktimeDetailScreen() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const { year, month, week } = getMonthWeekOfDate(selectedDate);
  const { startDate, endDate } = getMonthWeekDateRange(year, month, week);

  const {
    adminWorkSchedulesData,
    isFetchingAdminWorkSchedules,
    adminWorkSchedulesError,
  } = useGetAdminWorkSchedulesQuery({ startDate, endDate });

  // 조회에 실패하면 표가 잠긴 채로 남아 장애인지 알 수 없으므로 모달로 알린다.
  const { errorMessage, closeErrorModal } = useScheduleErrorModal([
    adminWorkSchedulesError,
  ]);

  const slotsByDay = toWorktimeDetailSlotsByDay(
    getWeekdaysOfMonthWeek(year, month, week),
    adminWorkSchedulesData,
  );

  const handlePrevWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, -1));
  };

  const handleNextWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, 1));
  };

  return (
    <div className="flex flex-row">
      <WorktimeDetailSection
        year={year}
        month={month}
        week={week}
        slotsByDay={slotsByDay}
        maxConcurrentWorkers={adminWorkSchedulesData?.maxConcurrentWorkers ?? 0}
        isLoading={isFetchingAdminWorkSchedules}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
      />
      <WorktimeDetailQuickSearch startDate={startDate} endDate={endDate} />

      <ScheduleErrorModal message={errorMessage} onClose={closeErrorModal} />
    </div>
  );
}
