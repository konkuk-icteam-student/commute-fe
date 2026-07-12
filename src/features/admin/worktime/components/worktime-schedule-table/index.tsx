"use client";

import { getWeekdaysOfMonthWeek } from "@/lib/date-formatter";
import {
  SLOTS_PER_DAY,
  SLOT_STATUS_CLASS_NAME,
  WeekScheduleData,
  chunkScheduleSlots,
} from "@/features/schedule";

interface WorktimeScheduleTableProps {
  year: number;
  month: number;
  week: number;
  scheduleData: WeekScheduleData;
}

export default function WorktimeScheduleTable({
  year,
  month,
  week,
  scheduleData,
}: WorktimeScheduleTableProps) {
  const result = getWeekdaysOfMonthWeek(year, month, week);
  const scheduleSlotsByDay = chunkScheduleSlots(
    scheduleData.slots,
    SLOTS_PER_DAY,
  );

  return (
    <div className="flex flex-col gap-2">
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
                {scheduleSlotsByDay[index]?.map((slot) => {
                  const slotClassName = SLOT_STATUS_CLASS_NAME[slot.status];
                  return (
                    <div
                      className="relative w-full"
                      key={`${slot.date}-${slot.start}`}
                    >
                      {index === 0 && slot.start.endsWith(":00") && (
                        <span className="absolute -top-1 -left-4 w-3 text-right text-[10px] text-[#6D88A5]">
                          {Number(slot.start.slice(0, 2))}
                        </span>
                      )}
                      <div
                        className={`flex h-8 w-full items-center justify-center rounded-sm ${slotClassName}`}
                      >
                        {slot.status !== "UNAVAILABLE" && (
                          <span className="text-base">
                            {slot.currentCount}/
                            {scheduleData.maxConcurrentWorkers}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
