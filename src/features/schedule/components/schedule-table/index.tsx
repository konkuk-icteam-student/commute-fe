import { useState } from "react";

import { cn } from "@/lib/utils";
import { getWeekdaysOfMonthWeek } from "@/lib/date-formatter";

import { ScheduleTableHeader } from "../../components";
import type {
  ScheduleSlot,
  ScheduleSlotStatus,
  WeekScheduleData,
} from "../../types";
import {
  chunkScheduleSlots,
  getDateStringFromDateLabel,
  getMonthFromDateLabel,
  isBeforeDate,
} from "../../utils";
import { SLOT_STATUS_CLASS_NAME, SLOTS_PER_DAY } from "../../constants";

interface ScheduleTableProps {
  type?: "view" | "edit" | "apply";
  year: number;
  month: number;
  week: number;
  scheduleData: WeekScheduleData;
  isPrevWeekDisabled?: boolean;
  isNextWeekDisabled?: boolean;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  getSlotCurrentCount?: (slot: ScheduleSlot) => number;
  getSlotClassName?: (slot: ScheduleSlot) => string | undefined;
  getSlotDisabled?: (slot: ScheduleSlot) => boolean;
  getSlotStatus?: (slot: ScheduleSlot) => ScheduleSlotStatus;
  getSlotTextClassName?: (slot: ScheduleSlot) => string | undefined;
  onSlotClick?: (slot: ScheduleSlot) => void;
  unavailableBeforeDate?: Date;
}

export default function ScheduleTable({
  type = "view",
  year,
  month,
  week,
  scheduleData,
  isPrevWeekDisabled = false,
  isNextWeekDisabled = false,
  handlePrevWeek,
  handleNextWeek,
  getSlotCurrentCount,
  getSlotClassName,
  getSlotDisabled,
  getSlotStatus,
  getSlotTextClassName,
  onSlotClick,
  unavailableBeforeDate,
}: ScheduleTableProps) {
  const [isChecked, setIsChecked] = useState(false);
  const isView = type === "view";
  const isApply = type === "apply";

  const result = getWeekdaysOfMonthWeek(year, month, week);
  const scheduleSlotsByDay = chunkScheduleSlots(
    scheduleData.slots,
    SLOTS_PER_DAY,
  );

  return (
    <div className="flex flex-col gap-2">
      <ScheduleTableHeader
        isView={isView}
        week={week}
        isChecked={isChecked}
        isPrevWeekDisabled={isPrevWeekDisabled}
        isNextWeekDisabled={isNextWeekDisabled}
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
                {scheduleSlotsByDay[index]?.map((slot) => {
                  const displayDate = getDateStringFromDateLabel(
                    year,
                    date.date,
                  );
                  const displaySlot = { ...slot, date: displayDate };
                  const isOutsideApplyMonth =
                    isApply && getMonthFromDateLabel(date.date) !== month;
                  const isPastDate =
                    unavailableBeforeDate !== undefined &&
                    isBeforeDate(displayDate, unavailableBeforeDate);
                  const slotStatus: ScheduleSlotStatus =
                    isOutsideApplyMonth || isPastDate
                      ? "UNAVAILABLE"
                      : (getSlotStatus?.(displaySlot) ?? slot.status);
                  const slotCurrentCount =
                    getSlotCurrentCount?.(displaySlot) ?? slot.currentCount;
                  const slotClassName =
                    getSlotClassName?.(displaySlot) ??
                    SLOT_STATUS_CLASS_NAME[slotStatus];
                  const isSlotDisabled =
                    slotStatus === "UNAVAILABLE" ||
                    type === "view" ||
                    (getSlotDisabled?.(displaySlot) ?? false);
                  const slotTextClassName =
                    getSlotTextClassName?.(displaySlot) ??
                    (slotStatus === "MY_SCHEDULE"
                      ? "text-white"
                      : "text-[#C2C4C6]");

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
                      <button
                        className={cn(
                          "flex h-7 w-full items-center justify-center rounded-sm",
                          slotClassName,
                        )}
                        disabled={isSlotDisabled}
                        onClick={() => onSlotClick?.(displaySlot)}
                        type="button"
                      >
                        {((isChecked && slotStatus !== "UNAVAILABLE") ||
                          (!isView && slotStatus !== "UNAVAILABLE")) && (
                          <span
                            className={cn(
                              "text-xs",
                              slotTextClassName,
                            )}
                          >
                            {slotCurrentCount}/
                            {scheduleData.maxConcurrentWorkers}
                          </span>
                        )}
                      </button>
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
