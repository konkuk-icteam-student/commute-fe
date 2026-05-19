import { useEffect, useState } from "react";

import { getWeekdaysOfMonthWeek } from "@/lib/date-formatter";

import { ScheduleTableHeader } from "../../components";

interface ScheduleTableProps {
  year: number;
  month: number;
  week: number;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

export default function ScheduleTable({
  year,
  month,
  week,
  handlePrevWeek,
  handleNextWeek,
}: ScheduleTableProps) {
  const [isChecked, setIsChecked] = useState(false);

  const result = getWeekdaysOfMonthWeek(year, month, week);

  useEffect(() => {
    console.log(year, month, week);
  }, [year, month, week]);

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
        <div className="flex flex-row items-start justify-between gap-1 pl-3">
          {result.map((date, index) => (
            <div
              key={`${date.label}-${date.date}`}
              className="flex flex-1 flex-col items-center"
            >
              <span className="text-[11px] font-bold text-[#1A2236]">
                {date.label}
              </span>
              <span className="text-[10px] text-[#2563EB]">{date.date}</span>
              <div className="flex w-full flex-col items-center gap-1 pt-1">
                {Array.from(
                  { length: 18 },
                  (_, timeIndex) => 9 + timeIndex * 0.5,
                ).map((time) => (
                  <div className="relative w-full" key={time}>
                    {index === 0 && Number.isInteger(time) && (
                      <span className="absolute -top-1 right-16 text-right text-[10px] text-[#6D88A5]">
                        {time}
                      </span>
                    )}
                    <button
                      className="border-0.5 flex h-7 w-full items-center justify-center rounded-[3px] border border-[#DDD9D9]"
                      type="button"
                    >
                      {isChecked && (
                        <span className="text-xs text-[rgb(9,18,28,0.25)]">
                          1/4
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
