import { useState } from "react";

import { getMonthWeekOfDate, shiftDateByWeeks } from "@/lib/date-formatter";

import WorktimeDetailHeader from "../worktime-detail-header";
import WorktimeDetailTable from "../worktime-detail-table";

export default function WorktimeDetailSection() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const { year, month, week } = getMonthWeekOfDate(selectedDate);

  const handlePrevWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, -1));
  };

  const handleNextWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, 1));
  };

  const handleChangeEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
    <div className="flex w-full min-w-300 flex-col gap-8 bg-white p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]">
      <WorktimeDetailHeader
        year={year}
        month={month}
        week={week}
        isEditMode={isEditMode}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        handleChangeEditMode={handleChangeEditMode}
      />
      <WorktimeDetailTable isEditMode={isEditMode} />
    </div>
  );
}
