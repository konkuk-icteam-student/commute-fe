"use client";

import { useState } from "react";

import {
  DUMMY_GET_SCHEDULE,
  getRequestEditSlotStatus,
  getRequestEditSlotDisabled,
  type ScheduleApplyPayload,
  type ScheduleSlot,
  ScheduleHeader,
  ScheduleTable,
  toggleRequestEditSlotChange,
  getMergedApplyPayload,
  getSlotTimesTotalHours,
  ScheduleStatusLegend,
  WorkingHoursCard,
  ScheduleChangeList,
} from "@/features/schedule";
import { SLOT_REQUEST_EDIT_CLASS_NAME } from "@/features/schedule/constants";
import { getMonthWeekOfDate, shiftDateByWeeks } from "@/lib/date-formatter";
import { Button } from "@/components/ui";

// TODO: 추후 서버에서 받아올 값
const MIN_SESSION_HOURS = 1;
const MAX_WEEK_HOURS = 13;

const WEEK_HOURS = 2;
const MONTH_TOTAL_HOURS = 26;
const MAX_MONTH_HOURS = 27;

const getAbleToAddHours = (deleteRequestHours: number) =>
  MAX_MONTH_HOURS - MONTH_TOTAL_HOURS + deleteRequestHours;

export default function ScheduleEditScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [editPayload, setEditPayload] = useState<ScheduleApplyPayload>({
    deleteSlots: [],
    addSlots: [],
  });
  const [reason, setReason] = useState("");

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

  const deleteRequestHours = getSlotTimesTotalHours(editPayload.deleteSlots);
  const addRequestHours = getSlotTimesTotalHours(editPayload.addSlots);
  const ableToAddHours = getAbleToAddHours(deleteRequestHours);

  const buttonDisabled =
    (deleteRequestHours === 0 && addRequestHours === 0) ||
    deleteRequestHours > MONTH_TOTAL_HOURS ||
    addRequestHours > ableToAddHours ||
    reason === "";

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
        getAbleToAddHours(getSlotTimesTotalHours(currentPayload.deleteSlots)),
      ),
    );
  };

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4">
      <ScheduleHeader mode="edit" year={year} month={month} />
      <div className="flex flex-col gap-2">
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
            getRequestEditSlotDisabled(
              slot,
              editPayload,
              DUMMY_GET_SCHEDULE.maxConcurrentWorkers,
              ableToAddHours,
            )
          }
          getSlotTextClassName={(slot) =>
            getRequestEditSlotStatus(slot, editPayload) === "REQUEST_DELETE"
              ? "text-[#C2C4C6]"
              : undefined
          }
          onSlotClick={handleSlotClick}
          unavailableBeforeDate={today}
        />
        <ScheduleStatusLegend
          minSessionHours={MIN_SESSION_HOURS}
          weeklyMaxHours={MAX_WEEK_HOURS}
          monthlyTargetHours={MAX_MONTH_HOURS}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <WorkingHoursCard label={`${week}주차 근무시간`} hours={WEEK_HOURS} />
          <WorkingHoursCard
            label={`${month}월 근무시간`}
            hours={MONTH_TOTAL_HOURS}
          />
        </div>
        <WorkingHoursCard
          label="근무 삭제 신청"
          hours={deleteRequestHours}
          maxHours={MONTH_TOTAL_HOURS}
          isRed
          isOverflow={deleteRequestHours > MONTH_TOTAL_HOURS}
        />
        <ScheduleChangeList
          isAdd={false}
          changeItems={getMergedApplyPayload(editPayload).deleteSlots}
        />

        <WorkingHoursCard
          label="추가 근무 신청"
          hours={addRequestHours}
          maxHours={ableToAddHours}
          isOverflow={addRequestHours > ableToAddHours}
        />
        <ScheduleChangeList
          changeItems={getMergedApplyPayload(editPayload).addSlots}
        />

        <section className="flex w-full flex-col gap-2 rounded-[10px] border border-[#DDE3EF] px-3 py-2">
          <span className="text-xs leading-4.5 font-medium text-[#1A2236]">
            사유 입력
          </span>
          <div className="flex flex-col gap-1">
            <input
              className="text-[11px] text-[#1A2236] placeholder:text-[#C2C4C6]"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="변경 사유를 입력하세요."
            />
            <div className="h-px w-full bg-[#C2C4C6]" />
          </div>
        </section>
      </div>

      {/* TODO: 서버 연동 시 요청 바디 고려 */}
      <Button
        size="lg"
        onClick={() => {
          console.log("변경 시간 : ", getMergedApplyPayload(editPayload));
          console.log("변경 사유 : ", reason);
        }}
        disabled={buttonDisabled}
      >
        신청하기
      </Button>
    </div>
  );
}
