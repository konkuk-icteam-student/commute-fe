import { useState } from "react";

import type { WorktimeDetailTableCellType } from "../../types";
import WorktimeDetailHeader from "../worktime-detail-header";
import WorktimeDetailTable from "../worktime-detail-table";

interface WorktimeDetailSectionProps {
  year: number;
  month: number;
  week: number;
  slotsByDay: WorktimeDetailTableCellType[][];
  maxConcurrentWorkers: number;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

export default function WorktimeDetailSection({
  year,
  month,
  week,
  slotsByDay,
  maxConcurrentWorkers,
  handlePrevWeek,
  handleNextWeek,
}: WorktimeDetailSectionProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleChangeEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
    <div className="flex w-full min-w-240 flex-col gap-8 bg-white p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]">
      <WorktimeDetailHeader
        year={year}
        month={month}
        week={week}
        isEditMode={isEditMode}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        handleChangeEditMode={handleChangeEditMode}
      />
      <WorktimeDetailTable
        slotsByDay={slotsByDay}
        maxConcurrentWorkers={maxConcurrentWorkers}
        isEditMode={isEditMode}
      />
    </div>
  );
}
