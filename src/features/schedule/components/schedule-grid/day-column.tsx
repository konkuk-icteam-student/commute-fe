import type { WeekDay } from "../../model/week-schedule";
import SlotCell from "./slot-cell";
import type { ScheduleCell } from "./types";

interface DayColumnProps {
  day: WeekDay;
  cells: ScheduleCell[];
}

// 요일 한 칸: 요일 이름과 날짜, 그 아래로 하루치 슬롯을 세로로 늘어놓는다.
export default function DayColumn({ day, cells }: DayColumnProps) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <span className="text-[11px] font-bold text-[#1A2236]">{day.label}</span>
      <span className="text-[10px] text-[#2563EB]">{day.dateLabel}</span>
      <div className="flex w-full flex-col items-center gap-1 pt-1">
        {cells.map((cell) => (
          <SlotCell key={cell.key} cell={cell} />
        ))}
      </div>
    </div>
  );
}
