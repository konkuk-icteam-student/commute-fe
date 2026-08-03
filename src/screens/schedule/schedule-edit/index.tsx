"use client";

import { useState } from "react";

import {
  chunkScheduleSlots,
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
  hasAppliedScheduleBelowMinSessionHours,
  SLOTS_PER_DAY,
} from "@/features/schedule";
import { SLOT_REQUEST_EDIT_CLASS_NAME } from "@/features/schedule/constants";
import {
  getMonthWeekOfDate,
  getWeekdaysOfMonthWeek,
} from "@/lib/date-formatter";
import { Button, Modal, Alert } from "@/components/ui";

// TODO: 추후 서버에서 받아올 값
const MIN_SESSION_HOURS = 1;
const MAX_WEEK_HOURS = 13;

const WEEK_HOURS = 2;
const MONTH_TOTAL_HOURS = 26;
const MAX_MONTH_HOURS = 27;

const getAbleToAddHours = (deleteRequestHours: number) =>
  MAX_MONTH_HOURS - MONTH_TOTAL_HOURS + deleteRequestHours;

export default function ScheduleEditScreen() {
  const [today] = useState(() => new Date());
  const [editPayload, setEditPayload] = useState<ScheduleApplyPayload>({
    deleteSlots: [],
    addSlots: [],
  });
  const [reason, setReason] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isApplyAlertOpen, setIsApplyAlertOpen] = useState(false);

  // 수정 요청은 이번 달 전체에 대해 가능하다.
  // 지난 주차도 열어 둔다 — 제때 수정하지 못하고 넘어간 근무를 정정할 수 있어야 한다.
  const { year, month, week: currentWeek, maxWeek } = getMonthWeekOfDate(today);
  const [week, setWeek] = useState(currentWeek);
  const isPrevWeekDisabled = week <= 1;
  const isNextWeekDisabled = week >= maxWeek;

  const deleteRequestHours = getSlotTimesTotalHours(editPayload.deleteSlots);
  const addRequestHours = getSlotTimesTotalHours(editPayload.addSlots);
  const ableToAddHours = getAbleToAddHours(deleteRequestHours);
  const currentWeekdays = getWeekdaysOfMonthWeek(year, month, week);
  const currentWeekScheduleSlots = chunkScheduleSlots(
    DUMMY_GET_SCHEDULE.slots,
    SLOTS_PER_DAY,
  ).flatMap((slots, index) => {
    const currentWeekday = currentWeekdays[index];

    if (currentWeekday === undefined || !currentWeekday.isCurrentMonth) {
      return [];
    }

    const { date } = currentWeekday;

    return slots.map((slot) => ({ ...slot, date }));
  });
  const isBelowMinSessionHours = hasAppliedScheduleBelowMinSessionHours(
    currentWeekScheduleSlots,
    editPayload,
    MIN_SESSION_HOURS,
  );

  const buttonDisabled =
    (deleteRequestHours === 0 && addRequestHours === 0) ||
    deleteRequestHours > MONTH_TOTAL_HOURS ||
    addRequestHours > ableToAddHours ||
    reason === "";

  const handlePrevWeek = () => {
    setWeek((currentWeekNumber) => Math.max(1, currentWeekNumber - 1));
  };

  const handleNextWeek = () => {
    setWeek((currentWeekNumber) => Math.min(maxWeek, currentWeekNumber + 1));
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

  const handleClickButton = () => {
    if (isBelowMinSessionHours) {
      setIsWarningOpen(true);
      return;
    }

    setIsApplyAlertOpen(true);
  };

  const handleApply = () => {
    console.log("제출 변경 시간 : ", getMergedApplyPayload(editPayload));
    console.log("제출 변경 사유 : ", reason);
    setIsApplyAlertOpen(false);
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

      <Button size="lg" onClick={handleClickButton} disabled={buttonDisabled}>
        신청하기
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
        title="수정 요청을 저장하시겠습니까?"
        message={
          addRequestHours !== deleteRequestHours
            ? "현재 월 근무시간과 상이합니다.\n해당 내용은 관리자에게 전달되며, 반려될 수 있습니다."
            : "승인 절차 완료 후 시간표에 반영됩니다."
        }
        confirmText="제출하기"
        onCancel={() => setIsApplyAlertOpen(false)}
        onConfirm={handleApply}
      />
    </div>
  );
}
