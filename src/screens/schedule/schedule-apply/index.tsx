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
  getMergedApplyPayload,
  toggleApplySlotChange,
  ScheduleStatusLegend,
  WorkingHoursCard,
  getSlotTimesTotalHours,
  getSlotTimesTotalHoursOnWeek,
  getDateStringFromDateLabel,
  ScheduleChangeList,
} from "@/features/schedule";
import {
  getMonthWeekOfDate,
  getWeekdaysOfMonthWeek,
  shiftDateByWeeks,
} from "@/lib/date-formatter";
import { Button } from "@/components/ui";

// TODO: 추후 서버에서 받아올 값
const MIN_SESSION_HOURS = 1;
const MAX_WEEK_HOURS = 13;
const MAX_MONTH_HOURS = 27;

const WEEK_TOTAL_HOURS = 12;
const MONTH_TOTAL_HOURS = 25;

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

  const addRequestHours = getSlotTimesTotalHours(applyPayload.addSlots);
  const deleteRequestHours = getSlotTimesTotalHours(applyPayload.deleteSlots);
  const currentWeekDates = getWeekdaysOfMonthWeek(year, month, week).map(
    ({ date }) => getDateStringFromDateLabel(year, date),
  );
  const weeklyAddRequestHours = getSlotTimesTotalHoursOnWeek(
    applyPayload.addSlots,
    currentWeekDates,
  );
  const weeklyDeleteRequestHours = getSlotTimesTotalHoursOnWeek(
    applyPayload.deleteSlots,
    currentWeekDates,
  );

  const weekTotalTimeAfterApply =
    WEEK_TOTAL_HOURS + weeklyAddRequestHours - weeklyDeleteRequestHours;
  const monthTotalTimeAfterApply =
    MONTH_TOTAL_HOURS + addRequestHours - deleteRequestHours;

  const buttonDisabled =
    (deleteRequestHours === 0 && addRequestHours === 0) ||
    weekTotalTimeAfterApply > MAX_WEEK_HOURS ||
    monthTotalTimeAfterApply > MAX_MONTH_HOURS;

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
      <ScheduleHeader mode="apply" year={year} month={month} />
      <div className="flex flex-col gap-2">
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
        <ScheduleStatusLegend
          isApply
          minSessionHours={MIN_SESSION_HOURS}
          weeklyMaxHours={MAX_WEEK_HOURS}
          monthlyTargetHours={MAX_MONTH_HOURS}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <WorkingHoursCard label="근무 신청" hours={addRequestHours} />
          <ScheduleChangeList
            changeItems={getMergedApplyPayload(applyPayload).addSlots}
          />
        </div>
        <div className="flex flex-col gap-2">
          <WorkingHoursCard
            label="근무 삭제"
            hours={deleteRequestHours}
            isRed
          />
          <ScheduleChangeList
            isAdd={false}
            changeItems={getMergedApplyPayload(applyPayload).deleteSlots}
          />
        </div>
        <WorkingHoursCard
          label={`${week}주차 총 시간`}
          hours={weekTotalTimeAfterApply}
          maxHours={MAX_WEEK_HOURS}
          isOverflow={weekTotalTimeAfterApply > MAX_WEEK_HOURS}
        />
        <WorkingHoursCard
          label={`${month}월 전체`}
          hours={monthTotalTimeAfterApply}
          maxHours={MAX_MONTH_HOURS}
          withProgressBar
          isOverflow={monthTotalTimeAfterApply > MAX_MONTH_HOURS}
        />
      </div>

      {/* TODO: 아래 버튼은 추후에 제대로 구현 예정. 현재는 테스트 버튼 */}
      <Button
        size="lg"
        onClick={() => {
          console.log("slot 병합 이후 : ", getMergedApplyPayload(applyPayload));
        }}
        disabled={buttonDisabled}
      >
        저장하기
      </Button>
    </div>
  );
}
