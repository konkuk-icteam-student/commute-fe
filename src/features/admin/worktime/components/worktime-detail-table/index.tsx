import { Fragment } from "react";

import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

import type { WorktimeDetailTableCellType } from "../../types";
import WorktimeDetailTableCell from "../worktime-detail-table-cell";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

interface WorktimeDetailTableProps {
  slotsByDay: WorktimeDetailTableCellType[][];
  maxConcurrentWorkers: number;
  isEditMode: boolean;
  // 시간표를 아직 받지 못한 상태. 칸 대신 스피너를 보여 준다.
  isLoading?: boolean;
}

export default function WorktimeDetailTable({
  slotsByDay,
  maxConcurrentWorkers,
  isEditMode,
  isLoading = false,
}: WorktimeDetailTableProps) {
  const slotsByTime =
    slotsByDay[0]?.map((_, slotIndex) =>
      slotsByDay.map((dailySlots) => dailySlots[slotIndex]),
    ) ?? [];

  return (
    <div className="relative">
      <div
        className={cn(
          "grid grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-2.5",
          // 자리는 그대로 두고 감추기만 해서 표 높이가 흔들리지 않게 한다.
          isLoading && "invisible",
        )}
      >
        <span aria-hidden="true" />
        {slotsByDay.map((dailySlots) => {
          const date = dailySlots[0].date;

          const [, month, day] = date.split("-");
          const weekday =
            WEEKDAY_LABELS[new Date(`${date}T00:00:00Z`).getUTCDay()];

          return (
            <div className="flex flex-col items-center gap-1" key={date}>
              <span className="text-xl font-bold">{weekday}</span>
              <span className="font-bold text-[#2D81FF]">
                {Number(month)}.{Number(day)}
              </span>
            </div>
          );
        })}

        {slotsByTime.map((timeSlots) => (
          <Fragment key={timeSlots[0]?.start}>
            <span className="mt-3 text-xs font-bold text-[#8E8E93]">
              {timeSlots[0]?.start}
            </span>
            {timeSlots.map((slot) => (
              <WorktimeDetailTableCell
                key={`${slot.date}-${slot.start}`}
                slot={slot}
                maxConcurrentWorkers={maxConcurrentWorkers}
                isEditMode={isEditMode}
              />
            ))}
          </Fragment>
        ))}
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
