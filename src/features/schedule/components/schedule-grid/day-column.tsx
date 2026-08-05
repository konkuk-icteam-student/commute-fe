import { cn } from "@/lib/utils";

import type { WeekDay } from "../../model/week-schedule";
import SlotCell from "./slot-cell";
import type { ScheduleCell } from "./types";

interface DayColumnProps {
  day: WeekDay;
  cells: ScheduleCell[];
  isLoading?: boolean;
}

// 요일 한 칸: 요일 이름과 날짜, 그 아래로 하루치 슬롯을 세로로 늘어놓는다.
// 불러오는 중에는 슬롯만 감춘다. 요일과 날짜는 달력에서 나오는 값이라 그대로 둔다.
export default function DayColumn({
  day,
  cells,
  isLoading = false,
}: DayColumnProps) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <span className="text-[11px] font-bold text-[#1A2236]">{day.label}</span>
      <span className="text-[10px] text-[#2563EB]">{day.dateLabel}</span>
      <div
        className={cn(
          "flex w-full flex-col items-center gap-1 pt-1",
          // 자리는 그대로 두고 감추기만 해서 표 높이가 흔들리지 않게 한다.
          isLoading && "invisible",
        )}
      >
        {cells.map((cell) => (
          <SlotCell key={cell.key} cell={cell} />
        ))}
      </div>
    </div>
  );
}
