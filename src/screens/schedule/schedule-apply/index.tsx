"use client";

import { useState } from "react";

import {
  applyPolicy,
  ApplyResultModal,
  DUMMY_NEXT_MONTH_SCHEDULE,
  DUMMY_SCHEDULE_APPLY_RESPONSE,
  getAppliedSlotTimes,
  getCurrentMonthDates,
  getCurrentMonthSlots,
  getFirstDateOfNextMonth,
  getSlotTimesTotalHoursOnWeek,
  hasSlotTimesBelowMinSessionHours,
  ScheduleApplySummary,
  ScheduleGrid,
  ScheduleHeader,
  ScheduleRefreshButton,
  ScheduleStatusLegend,
  ScheduleWeekNav,
  useScheduleDraft,
  useScheduleGrid,
  useScheduleWeek,
} from "@/features/schedule";
import { Alert, Button, Modal } from "@/components/ui";

// TODO: 추후 서버에서 받아올 값
const MIN_SESSION_HOURS = 1;
const MAX_WEEK_HOURS = 13;
const MAX_MONTH_HOURS = 27;

const WEEK_TOTAL_HOURS = 12;
const MONTH_TOTAL_HOURS = 25;

// TODO: 서버 응답 pending 시 Toast 컴포넌트 말고 다른 식으로 보여주기
export default function ScheduleApplyScreen() {
  // 근로 신청은 다음 달에 대해서만 가능하다.
  const [nextMonthDate] = useState(getFirstDateOfNextMonth);
  const {
    year,
    month,
    week,
    isPrevWeekDisabled,
    isNextWeekDisabled,
    goPrevWeek,
    goNextWeek,
  } = useScheduleWeek(nextMonthDate);

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isApplyAlertOpen, setIsApplyAlertOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const {
    draft,
    toggleSlot,
    context,
    rawPayload,
    payload,
    addHours: addRequestHours,
    deleteHours: deleteRequestHours,
  } = useScheduleDraft({
    policy: applyPolicy,
    resolveContext: () => ({
      maxConcurrentWorkers: DUMMY_NEXT_MONTH_SCHEDULE.maxConcurrentWorkers,
    }),
  });

  const { days, cells } = useScheduleGrid({
    data: DUMMY_NEXT_MONTH_SCHEDULE,
    year,
    month,
    week,
    policy: applyPolicy,
    context,
    draft,
    onSlotClick: toggleSlot,
  });

  const currentWeekDates = getCurrentMonthDates(days);
  const weeklyAddRequestHours = getSlotTimesTotalHoursOnWeek(
    rawPayload.addSlots,
    currentWeekDates,
  );
  const weeklyDeleteRequestHours = getSlotTimesTotalHoursOnWeek(
    rawPayload.deleteSlots,
    currentWeekDates,
  );

  const weekTotalTimeAfterApply =
    WEEK_TOTAL_HOURS + weeklyAddRequestHours - weeklyDeleteRequestHours;
  const monthTotalTimeAfterApply =
    MONTH_TOTAL_HOURS + addRequestHours - deleteRequestHours;

  const isBelowMinSessionHours = hasSlotTimesBelowMinSessionHours(
    getAppliedSlotTimes(getCurrentMonthSlots(days), draft),
    MIN_SESSION_HOURS,
  );

  const buttonDisabled =
    (deleteRequestHours === 0 && addRequestHours === 0) ||
    weekTotalTimeAfterApply > MAX_WEEK_HOURS ||
    monthTotalTimeAfterApply > MAX_MONTH_HOURS;

  const handleClickButton = () => {
    if (isBelowMinSessionHours) {
      setIsWarningOpen(true);
      return;
    }
    setIsApplyAlertOpen(true);
  };

  const handleApply = () => {
    console.log("slot 병합 이후 : ", payload);
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
        <ScheduleWeekNav
          week={week}
          isPrevWeekDisabled={isPrevWeekDisabled}
          isNextWeekDisabled={isNextWeekDisabled}
          onPrevWeek={goPrevWeek}
          onNextWeek={goNextWeek}
          action={<ScheduleRefreshButton />}
        />
        <ScheduleGrid days={days} cells={cells} />
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
        applyPayload={rawPayload}
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
