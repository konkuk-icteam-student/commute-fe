"use client";

import { useState } from "react";

import {
  chunkScheduleSlots,
  DUMMY_NEXT_MONTH_SCHEDULE,
  getAppliedScheduleSlotTimes,
  type ScheduleApplyPayload,
  ScheduleHeader,
  type ScheduleSlot,
  ScheduleTable,
  getFirstDateOfNextMonth,
  getApplySlotCurrentCount,
  getApplySlotStatus,
  toggleApplySlotChange,
  ScheduleStatusLegend,
  getSlotTimesTotalHours,
  getSlotTimesTotalHoursOnWeek,
  getDateStringFromDateLabel,
  getMonthFromDateLabel,
  hasSlotTimesBelowMinSessionHours,
  ScheduleApplySummary,
  SLOTS_PER_DAY,
  getMergedApplyPayload,
  DUMMY_SCHEDULE_APPLY_RESPONSE,
  ApplyResultModal,
} from "@/features/schedule";
import {
  getMonthWeekOfDate,
  getWeekdaysOfMonthWeek,
  shiftDateByWeeks,
} from "@/lib/date-formatter";
import { Alert, Button, Modal } from "@/components/ui";

// TODO: 추후 서버에서 받아올 값
const MIN_SESSION_HOURS = 1;
const MAX_WEEK_HOURS = 13;
const MAX_MONTH_HOURS = 27;

const WEEK_TOTAL_HOURS = 12;
const MONTH_TOTAL_HOURS = 25;

// TODO: 서버 응답 pending 시 Toast 컴포넌트 말고 다른 식으로 보여주기
export default function ScheduleApplyScreen() {
  const [selectedDate, setSelectedDate] = useState(getFirstDateOfNextMonth);
  const [applyPayload, setApplyPayload] = useState<ScheduleApplyPayload>({
    deleteSlots: [],
    addSlots: [],
  });
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isApplyAlertOpen, setIsApplyAlertOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const { year, month, week } = getMonthWeekOfDate(selectedDate);
  const prevWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, -1));
  const nextWeekMonth = getMonthWeekOfDate(shiftDateByWeeks(selectedDate, 1));
  const isPrevWeekDisabled =
    year !== prevWeekMonth.year || month !== prevWeekMonth.month;
  const isNextWeekDisabled =
    year !== nextWeekMonth.year || month !== nextWeekMonth.month;

  const addRequestHours = getSlotTimesTotalHours(applyPayload.addSlots);
  const deleteRequestHours = getSlotTimesTotalHours(applyPayload.deleteSlots);
  const currentWeekdays = getWeekdaysOfMonthWeek(year, month, week);
  const currentWeekDates = currentWeekdays.map(({ date }) =>
    getDateStringFromDateLabel(year, date),
  );
  const currentWeekScheduleSlots = chunkScheduleSlots(
    DUMMY_NEXT_MONTH_SCHEDULE.slots,
    SLOTS_PER_DAY,
  ).flatMap((slots, index) => {
    const currentWeekday = currentWeekdays[index];

    if (
      currentWeekday === undefined ||
      getMonthFromDateLabel(currentWeekday.date) !== month
    ) {
      return [];
    }

    const date = getDateStringFromDateLabel(year, currentWeekday.date);

    return slots.map((slot) => ({ ...slot, date }));
  });
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

  const isBelowMinSessionHours = hasSlotTimesBelowMinSessionHours(
    getAppliedScheduleSlotTimes(currentWeekScheduleSlots, applyPayload),
    MIN_SESSION_HOURS,
  );

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

  const handleClickButton = () => {
    if (isBelowMinSessionHours) {
      setIsWarningOpen(true);
      return;
    }
    setIsApplyAlertOpen(true);
  };

  const handleApply = () => {
    console.log("slot 병합 이후 : ", getMergedApplyPayload(applyPayload));
    setIsApplyAlertOpen(false);

    // TODO: 추후 이부분은 삭제 예정
    setTimeout(() => {
      setIsResultModalOpen(true);
    }, 1000);
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
      <ScheduleApplySummary
        month={month}
        week={week}
        maxMonthHours={MAX_MONTH_HOURS}
        maxWeekHours={MAX_WEEK_HOURS}
        applyPayload={applyPayload}
        addRequestHours={addRequestHours}
        deleteRequestHours={deleteRequestHours}
        weekTotalTimeAfterApply={weekTotalTimeAfterApply}
        monthTotalTimeAfterApply={monthTotalTimeAfterApply}
      />
      <Button size="lg" onClick={handleClickButton} disabled={buttonDisabled}>
        저장하기
      </Button>

      <Modal
        open={isWarningOpen}
        title="알림"
        onButtonClick={() => setIsWarningOpen(false)}
      >
        <span className="text-center text-sm font-medium">
          조건을 충족하지 않는 신청이 존재합니다.
          <br />
          (최소근무시간 미충족)
          <br />
          시간표 수정 후 다시 시도해주세요.
        </span>
      </Modal>
      <Alert
        open={isApplyAlertOpen}
        title="근로 신청을 저장하시겠습니까?"
        message="승인 절차 완료 후 시간표에 반영됩니다."
        onCancel={() => setIsApplyAlertOpen(false)}
        onConfirm={handleApply}
      />
      <ApplyResultModal
        open={isResultModalOpen}
        handleClose={() => setIsResultModalOpen(false)}
        successList={DUMMY_SCHEDULE_APPLY_RESPONSE.details.success}
        failureList={DUMMY_SCHEDULE_APPLY_RESPONSE.details.failure}
      />
    </div>
  );
}
