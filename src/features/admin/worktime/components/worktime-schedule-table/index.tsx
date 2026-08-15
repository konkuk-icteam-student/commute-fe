"use client";

import { SLOT_STATUS_CLASS_NAME, type WeekDay } from "@/features/schedule";

interface WorktimeScheduleTableProps {
  days: WeekDay[];
  maxConcurrentWorkers: number;
}

export default function WorktimeScheduleTable({
  days,
  maxConcurrentWorkers,
}: WorktimeScheduleTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl border border-[#DDE3EF] bg-white p-3.5">
        <div className="flex flex-row items-start justify-between gap-1 pl-3">
          {days.map((day, index) => (
            <div key={day.date} className="flex flex-1 flex-col items-center">
              <span className="text-[11px] font-bold text-[#1A2236]">
                {day.label}
              </span>
              <span className="text-[10px] text-[#2563EB]">{day.date}</span>
              <div className="flex w-full flex-col items-center gap-1 pt-1">
                {day.slots.map((slot) => (
                  <div className="relative w-full" key={slot.key}>
                    {index === 0 && slot.isHourStart && (
                      <span className="absolute -top-1 -left-4 w-3 text-right text-[10px] text-[#6D88A5]">
                        {Number(slot.start.slice(0, 2))}
                      </span>
                    )}
                    <div
                      className={`flex h-8 w-full items-center justify-center rounded-sm ${SLOT_STATUS_CLASS_NAME[slot.status]}`}
                    >
                      {slot.status !== "UNAVAILABLE" && (
                        <span className="text-base">
                          {slot.currentCount}/{maxConcurrentWorkers}
                        </span>
                      )}
                    </div>
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
