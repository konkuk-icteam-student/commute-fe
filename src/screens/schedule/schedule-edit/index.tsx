"use client";

import { useState } from "react";

import {
  DUMMY_GET_SCHEDULE,
  getRequestEditSlotStatus,
  type ScheduleApplyPayload,
  type ScheduleSlot,
  ScheduleHeader,
  ScheduleTable,
  toggleRequestEditSlotChange,
} from "@/features/schedule";
import { SLOT_REQUEST_EDIT_CLASS_NAME } from "@/features/schedule/constants";
import { getMonthWeekOfDate, shiftDateByWeeks } from "@/lib/date-formatter";

export default function ScheduleEditScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [editPayload, setEditPayload] = useState<ScheduleApplyPayload>({
    deleteSlots: [],
    addSlots: [],
  });

  const { year, month, week } = getMonthWeekOfDate(selectedDate);
  const currentMonthWeek = getMonthWeekOfDate(today);
  const prevWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, -1));
  const nextWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, 1));
  const isPrevWeekDisabled =
    currentMonthWeek.year !== prevWeekMonth.year ||
    currentMonthWeek.month !== prevWeekMonth.month ||
    prevWeekMonth.week < currentMonthWeek.week;
  const isNextWeekDisabled =
    currentMonthWeek.year !== nextWeekMonth.year ||
    currentMonthWeek.month !== nextWeekMonth.month;

  const handlePrevWeek = () => {
    setSelectedDate((currentDate) => {
      const prevDate = shiftDateByWeeks(currentDate, -1);
      const prevMonthWeek = getMonthWeekOfDate(prevDate);

      if (
        currentMonthWeek.year !== prevMonthWeek.year ||
        currentMonthWeek.month !== prevMonthWeek.month ||
        prevMonthWeek.week < currentMonthWeek.week
      ) {
        return currentDate;
      }

      return prevDate;
    });
  };

  const handleNextWeek = () => {
    setSelectedDate((currentDate) => {
      const nextDate = shiftDateByWeeks(currentDate, 1);
      const nextMonthWeek = getMonthWeekOfDate(nextDate);

      if (
        currentMonthWeek.year !== nextMonthWeek.year ||
        currentMonthWeek.month !== nextMonthWeek.month
      ) {
        return currentDate;
      }

      return nextDate;
    });
  };

  const handleSlotClick = (slot: ScheduleSlot) => {
    setEditPayload((currentPayload) =>
      toggleRequestEditSlotChange(
        currentPayload,
        slot,
        DUMMY_GET_SCHEDULE.maxConcurrentWorkers,
      ),
    );
  };

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4">
      <ScheduleHeader type="edit" year={year} month={month} />
      <ScheduleTable
        type="edit"
        year={year}
        month={month}
        week={week}
        scheduleData={DUMMY_GET_SCHEDULE}
        isPrevWeekDisabled={isPrevWeekDisabled}
        isNextWeekDisabled={isNextWeekDisabled}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        getSlotClassName={(slot) => {
          const requestStatus = getRequestEditSlotStatus(slot, editPayload);

          return requestStatus
            ? SLOT_REQUEST_EDIT_CLASS_NAME[requestStatus]
            : undefined;
        }}
        getSlotDisabled={(slot) =>
          slot.status === "PENDING_DELETE" ||
          slot.status === "PENDING_ADD" ||
          (slot.status === "EMPTY" &&
            slot.currentCount >= DUMMY_GET_SCHEDULE.maxConcurrentWorkers)
        }
        getSlotTextClassName={(slot) =>
          getRequestEditSlotStatus(slot, editPayload) === "REQUEST_DELETE"
            ? "text-[#C2C4C6]"
            : undefined
        }
        onSlotClick={handleSlotClick}
        unavailableBeforeDate={today}
      />
    </div>
  );
}
