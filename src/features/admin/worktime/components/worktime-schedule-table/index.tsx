"use client";

import { Spinner } from "@/components/ui";
import { SLOT_STATUS_CLASS_NAME, type WeekDay } from "@/features/schedule";
import { cn } from "@/lib/utils";

interface WorktimeScheduleTableProps {
  days: WeekDay[];
  maxConcurrentWorkers: number;
  // 시간표를 아직 받지 못한 상태. 칸 대신 스피너를 보여 준다.
  isLoading?: boolean;
}

export default function WorktimeScheduleTable({
  days,
  maxConcurrentWorkers,
  isLoading = false,
}: WorktimeScheduleTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative rounded-2xl border border-[#DDE3EF] bg-white p-3.5">
        <div className="flex flex-row items-start justify-between gap-1 pl-3">
          {days.map((day, index) => (
            <div key={day.date} className="flex flex-1 flex-col items-center">
              <span className="text-[11px] font-bold text-[#1A2236]">
                {day.label}
              </span>
              <span className="text-[10px] text-[#2563EB]">
                {day.dateLabel}
              </span>
              <div
                className={cn(
                  "flex w-full flex-col items-center gap-1 pt-1",
                  // 자리는 그대로 두고 감추기만 해서 표 높이가 흔들리지 않게 한다.
                  isLoading && "invisible",
                )}
              >
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
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
