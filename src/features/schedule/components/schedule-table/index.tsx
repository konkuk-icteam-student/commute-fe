import { useState } from "react";

import { getWeekdaysOfMonthWeek } from "@/lib/date-formatter";

import { ScheduleTableHeader } from "../../components";

interface ScheduleTableProps {
  year: number;
  month: number;
  week: number;
}

export default function ScheduleTable({
  year,
  month,
  week,
}: ScheduleTableProps) {
  const [isChecked, setIsChecked] = useState(false);

  const result = getWeekdaysOfMonthWeek(year, month, week);

  const handleNextWeek = () => {};
  const handlePrevWeek = () => {};

  return (
    <div className="flex flex-col gap-2">
      <ScheduleTableHeader
        week={week}
        isChecked={isChecked}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        onCheckedChange={setIsChecked}
      />
      <div className="rounded-2xl border border-[#DDE3EF] bg-white p-3.5">
        <div>
          {result.map((date) => (
            <span key={date.label}>
              {date.label} {date.date}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
