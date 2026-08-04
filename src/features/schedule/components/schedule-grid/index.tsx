import type { WeekDay } from "../../model/week-schedule";
import DayColumn from "./day-column";
import type { ScheduleCell } from "./types";

interface ScheduleGridProps {
  days: WeekDay[];
  // days와 같은 순서로 짝지어진 요일별 칸 목록.
  cells: ScheduleCell[][];
}

// 주간 시간표 표. 조건 판단은 모두 끝난 상태로 받아 그리기만 한다.
export default function ScheduleGrid({ days, cells }: ScheduleGridProps) {
  return (
    <div className="rounded-2xl border border-[#DDE3EF] bg-white p-3.5">
      <div className="flex flex-row items-start justify-between gap-1 pl-3">
        {days.map((day, dayIndex) => (
          <DayColumn key={day.date} day={day} cells={cells[dayIndex] ?? []} />
        ))}
      </div>
    </div>
  );
}
