import type { WorktimeDetailTableCellType } from "../../types";
import WorktimeDetailHeader from "../worktime-detail-header";
import WorktimeDetailTable from "../worktime-detail-table";

interface WorktimeDetailSectionProps {
  year: number;
  month: number;
  week: number;
  slotsByDay: WorktimeDetailTableCellType[][];
  maxConcurrentWorkers: number;
  isLoading: boolean;
  isEditMode: boolean;
  isEditAvailable: boolean;
  isPrevWeekDisabled: boolean;
  isNextWeekDisabled: boolean;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleChangeEditMode: () => void;
}

export default function WorktimeDetailSection({
  year,
  month,
  week,
  slotsByDay,
  maxConcurrentWorkers,
  isLoading,
  isEditMode,
  isEditAvailable,
  isPrevWeekDisabled,
  isNextWeekDisabled,
  handlePrevWeek,
  handleNextWeek,
  handleChangeEditMode,
}: WorktimeDetailSectionProps) {
  return (
    <div className="flex w-full min-w-240 flex-col gap-4 bg-white p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]">
      <WorktimeDetailHeader
        year={year}
        month={month}
        week={week}
        isEditMode={isEditMode}
        isEditAvailable={isEditAvailable}
        isPrevWeekDisabled={isPrevWeekDisabled}
        isNextWeekDisabled={isNextWeekDisabled}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        handleChangeEditMode={handleChangeEditMode}
      />
      <WorktimeDetailTable
        slotsByDay={slotsByDay}
        maxConcurrentWorkers={maxConcurrentWorkers}
        isEditMode={isEditMode}
        isLoading={isLoading}
      />
    </div>
  );
}
