"use client";

import { useState } from "react";

import {
  DUMMY_NEXT_MONTH_SCHEDULE,
  type ScheduleApplyPayload,
  ScheduleHeader,
  type ScheduleSlot,
  ScheduleTable,
  getFirstDateOfNextMonth,
  getApplySlotCurrentCount,
  getApplySlotStatus,
  toggleApplySlotChange,
} from "@/features/schedule";
import { getMonthWeekOfDate, shiftDateByWeeks } from "@/lib/date-formatter";
import { Button } from "@/components/ui";

export default function ScheduleApplyScreen() {
  const [selectedDate, setSelectedDate] = useState(getFirstDateOfNextMonth);
  const [applyPayload, setApplyPayload] = useState<ScheduleApplyPayload>({
    deleteSlots: [],
    addSlots: [],
  });
  const { year, month, week } = getMonthWeekOfDate(selectedDate);
  const prevWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, -1));
  const nextWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, 1));
  const isPrevWeekDisabled =
    year !== prevWeekMonth.year || month !== prevWeekMonth.month;
  const isNextWeekDisabled =
    year !== nextWeekMonth.year || month !== nextWeekMonth.month;

  const handlePrevWeek = () => {
    setSelectedDate((currentDate) => {
      const prevDate = shiftDateByWeeks(currentDate, -1);
      const currentMonth = getMonthWeekOfDate(currentDate);
      const prevMonth = getMonthWeekOfDate(prevDate);

      if (
        currentMonth.year !== prevMonth.year ||
        currentMonth.month !== prevMonth.month
      ) {
        return currentDate;
      }

      return prevDate;
    });
  };

  const handleNextWeek = () => {
    setSelectedDate((currentDate) => {
      const nextDate = shiftDateByWeeks(currentDate, 1);
      const currentMonth = getMonthWeekOfDate(currentDate);
      const nextMonth = getMonthWeekOfDate(nextDate);

      if (
        currentMonth.year !== nextMonth.year ||
        currentMonth.month !== nextMonth.month
      ) {
        return currentDate;
      }

      return nextDate;
    });
  };

  const handleSlotClick = (slot: ScheduleSlot) => {
    setApplyPayload((currentPayload) =>
      toggleApplySlotChange(
        currentPayload,
        slot,
        DUMMY_NEXT_MONTH_SCHEDULE.maxConcurrentWorkers,
      ),
    );
  };

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4">
      <ScheduleHeader type="apply" year={year} month={month} />
      <ScheduleTable
        type="apply"
        year={year}
        month={month}
        week={week}
        scheduleData={DUMMY_NEXT_MONTH_SCHEDULE}
        isPrevWeekDisabled={isPrevWeekDisabled}
        isNextWeekDisabled={isNextWeekDisabled}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        getSlotCurrentCount={(slot) =>
          getApplySlotCurrentCount(slot, applyPayload)
        }
        getSlotStatus={(slot) => getApplySlotStatus(slot, applyPayload)}
        onSlotClick={handleSlotClick}
      />
      {/* TODO: 아래 버튼은 추후에 제대로 구현 예정. 현재는 테스트 버튼 */}
      <Button
        size="lg"
        onClick={() =>
          console.log({
            deleteSlots: applyPayload.deleteSlots,
            addSlots: applyPayload.addSlots,
          })
        }
      >
        저장하기
      </Button>
    </div>
  );
}
