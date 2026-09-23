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
  editableMonths: { year: number; month: number }[];
  isPrevWeekDisabled: boolean;
  isNextWeekDisabled: boolean;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleChangeEditMode: () => void;
  handleChangeEditMonth: (year: number, month: number) => void;
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
  editableMonths,
  isPrevWeekDisabled,
  isNextWeekDisabled,
  handlePrevWeek,
  handleNextWeek,
  handleChangeEditMode,
  handleChangeEditMonth,
}: WorktimeDetailSectionProps) {
  return (
    <div className="flex w-full min-w-240 flex-col gap-8 bg-white p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]">
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
      {isEditMode ? (
        <div className="flex justify-center gap-2">
          {editableMonths.map((target) => {
            const isSelected = target.year === year && target.month === month;

            return (
              <button
                key={`${target.year}-${target.month}`}
                type="button"
                className={`h-9 cursor-pointer rounded-md px-4 text-sm font-medium ${
                  isSelected
                    ? "bg-[#2076FF] text-white"
                    : "border border-[#DDE3EF] bg-white text-[#1E2124]"
                }`}
                onClick={() => handleChangeEditMonth(target.year, target.month)}
              >
                {target.year}년 {target.month}월
              </button>
            );
          })}
        </div>
      ) : null}
      <WorktimeDetailTable
        slotsByDay={slotsByDay}
        maxConcurrentWorkers={maxConcurrentWorkers}
        isEditMode={isEditMode}
        isLoading={isLoading}
      />
    </div>
  );
}
