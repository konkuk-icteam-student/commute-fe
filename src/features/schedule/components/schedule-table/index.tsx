import { useState } from "react";

import { cn } from "@/lib/utils";
import { getWeekdaysOfMonthWeek } from "@/lib/date-formatter";

import { ScheduleTableHeader } from "../../components";
import type { ScheduleSlotStatus, WeekScheduleData } from "../../types";
import { chunkScheduleSlots } from "../../utils";

const SLOTS_PER_DAY = 18; // 09:00 ~ 18:00 까지. 일주일은 총 90개

const SLOT_STATUS_CLASS_NAME: Record<ScheduleSlotStatus, string> = {
  MY_SCHEDULE: "bg-[#51A8FF]",
  PENDING_DELETE: "border border-0.5 border-[#FFD280] bg-[#FFF9EA]",
  PENDING_ADD: "border border-0.5 border-[#769EF3] bg-[#DBEAFE]",
  UNAVAILABLE: "border border-0.5 border-[#DDD9D9] bg-[rgba(107,114,128,0.11)]",
  EMPTY: "border border-0.5 border-[#DDD9D9] bg-white",
};

interface ScheduleTableProps {
  type?: "view" | "edit" | "apply";
  year: number;
  month: number;
  week: number;
  scheduleData: WeekScheduleData;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

export default function ScheduleTable({
  type = "view",
  year,
  month,
  week,
  scheduleData,
  handlePrevWeek,
  handleNextWeek,
}: ScheduleTableProps) {
  const [isChecked, setIsChecked] = useState(false);

  const result = getWeekdaysOfMonthWeek(year, month, week);
  const scheduleSlotsByDay = chunkScheduleSlots(
    scheduleData.slots,
    SLOTS_PER_DAY,
  );

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
                {scheduleSlotsByDay[index]?.map((slot) => (
                  <div
                    className="relative w-full"
                    key={`${slot.date}-${slot.start}`}
                  >
                    {index === 0 && slot.start.endsWith(":00") && (
                      <span className="absolute -top-1 -left-4 w-3 text-right text-[10px] text-[#6D88A5]">
                        {Number(slot.start.slice(0, 2))}
                      </span>
                    )}
                    <button
                      className={cn(
                        "flex h-7 w-full items-center justify-center rounded-sm",
                        SLOT_STATUS_CLASS_NAME[slot.status],
                      )}
                      disabled={
                        slot.status === "UNAVAILABLE" || type === "view"
                      }
                      type="button"
                    >
                      {isChecked && slot.status !== "UNAVAILABLE" && (
                        <span
                          className={cn(
                            "text-xs",
                            slot.status === "MY_SCHEDULE"
                              ? "text-white"
                              : "text-[#C2C4C6]",
                          )}
                        >
                          {slot.currentCount}/
                          {scheduleData.maxConcurrentWorkers}
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
