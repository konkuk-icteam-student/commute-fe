"use client";

import { useState } from "react";

import {
  applyPolicy,
  ApplyResultModal,
  EMPTY_SCHEDULE,
  getAppliedSlotTimes,
  getCurrentMonthDates,
  getCurrentMonthSlots,
  getFirstDateOfNextMonth,
  getSlotTimesTotalHoursOnWeek,
  hasSlotTimesBelowMinSessionHours,
  ScheduleApplySummary,
  ScheduleErrorModal,
  ScheduleGrid,
  ScheduleHeader,
  ScheduleRefreshButton,
  ScheduleStatusLegend,
  ScheduleWeekNav,
  useScheduleDraft,
  useScheduleErrorModal,
  useScheduleGrid,
  useScheduleWeek,
} from "@/features/schedule";
import {
  useApplyWorkSchedulesMutation,
  useGetPeriodSchedulesQuery,
  useGetWorkSchedulesSummaryQuery,
  type ApplyWorkSchedulesResponse,
} from "@/apis/work-schedules";
import { ApiError } from "@/apis/api-client";
import { getMonthWeekDateRange } from "@/lib/date-formatter";
import { Alert, Button, Modal } from "@/components/ui";

// 결과 모달에 보여 줄 내용.
// 전부 실패하면 서버가 구간 목록을 내려주지 않으므로 message만 채워진다.
type ApplyResult = ApplyWorkSchedulesResponse & { message?: string };

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
  // 신청 결과가 담기면 결과 모달이 열린다. 닫을 때 다시 비운다.
  const [applyResult, setApplyResult] = useState<ApplyResult | null>(null);

  const { startDate, endDate } = getMonthWeekDateRange(year, month, week);
  const {
    periodSchedulesData,
    isFetchingPeriodSchedules,
    periodSchedulesError,
    refetchPeriodSchedules,
  } = useGetPeriodSchedulesQuery({
    startDate,
    endDate,
  });

  // 범례에 쓸 주·월 한도. 시간표와 따로 조회하며 서버가 계산해 준다.
  const {
    workSchedulesSummaryData,
    workSchedulesSummaryError,
    refetchWorkSchedulesSummary,
  } = useGetWorkSchedulesSummaryQuery({
    startDate,
    endDate,
  });

  // 조회에 실패하면 표가 잠긴 채로 남는다. 새로고침이 다시 시도할 유일한 통로다.
  const handleRefresh = () => {
    void refetchPeriodSchedules();
    void refetchWorkSchedulesSummary();
  };

  // 조회 실패는 자동으로, 신청 실패는 showError로 알린다.
  const { errorMessage, showError, closeErrorModal } = useScheduleErrorModal([
    periodSchedulesError,
    workSchedulesSummaryError,
  ]);

  // 응답 전에는 빈 시간표로 그린다. 표 모양이 유지되고 모든 칸이 잠긴 상태로 보인다.
  const schedule = periodSchedulesData ?? EMPTY_SCHEDULE;
  const monthMaxHours = workSchedulesSummaryData?.month.maxHours ?? 0;
  const monthUsedHours = workSchedulesSummaryData?.month.usedHours ?? 0;
  const weekMaxHours = workSchedulesSummaryData?.week.maxHours ?? 0;
  const weekUsedHours = workSchedulesSummaryData?.week.usedHours ?? 0;
  const minWorkUnitHours =
    (workSchedulesSummaryData?.minWorkUnitMinutes ?? 0) / 60;

  const { applyWorkSchedules, isPendingApplyWorkSchedules } =
    useApplyWorkSchedulesMutation();

  const {
    draft,
    toggleSlot,
    resetDraft,
    context,
    rawPayload,
    payload,
    addHours: addRequestHours,
    deleteHours: deleteRequestHours,
  } = useScheduleDraft({
    policy: applyPolicy,
    resolveContext: () => ({
      maxConcurrentWorkers: schedule.maxConcurrentWorkers,
    }),
  });

  const { days, cells } = useScheduleGrid({
    data: schedule,
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
    weekUsedHours + weeklyAddRequestHours - weeklyDeleteRequestHours;
  const monthTotalTimeAfterApply =
    monthUsedHours + addRequestHours - deleteRequestHours;

  const isBelowMinSessionHours = hasSlotTimesBelowMinSessionHours(
    getAppliedSlotTimes(getCurrentMonthSlots(days), draft),
    minWorkUnitHours,
  );

  const buttonDisabled =
    (deleteRequestHours === 0 && addRequestHours === 0) ||
    weekTotalTimeAfterApply > weekMaxHours ||
    monthTotalTimeAfterApply > monthMaxHours ||
    isPendingApplyWorkSchedules;

  const handleClickButton = () => {
    if (isBelowMinSessionHours) {
      setIsWarningOpen(true);
      return;
    }
    setIsApplyAlertOpen(true);
  };

  const handleApply = () => {
    setIsApplyAlertOpen(false);

    applyWorkSchedules(payload, {
      onSuccess: (result) => {
        setApplyResult(result);
        resetDraft();
      },
      // 전부 실패하면 details 없이 메시지만 오므로 api 계층이 ApiError로 바꿔 던진다.
      // 이때는 서버 문구를 그대로 보여 주고, 고쳐서 다시 신청할 수 있도록 내역은 남긴다.
      // 통신 자체가 실패한 경우는 ApiError가 아니라 결과 목록이 없으므로 오류 모달로 알린다.
      onError: (error) => {
        if (error instanceof ApiError) {
          setApplyResult({ message: error.message, success: [], failure: [] });
          return;
        }

        showError(error);
      },
    });
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
          action={<ScheduleRefreshButton onClick={handleRefresh} />}
        />
        <ScheduleGrid
          days={days}
          cells={cells}
          isLoading={isFetchingPeriodSchedules}
        />
        <ScheduleStatusLegend
          isApply
          minSessionHours={minWorkUnitHours}
          weeklyMaxHours={weekMaxHours}
          monthlyTargetHours={monthMaxHours}
        />
      </div>
      <ScheduleApplySummary
        month={month}
        week={week}
        maxMonthHours={monthMaxHours}
        maxWeekHours={weekMaxHours}
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
        open={applyResult !== null}
        handleClose={() => setApplyResult(null)}
        message={applyResult?.message}
        successList={applyResult?.success ?? []}
        failureList={applyResult?.failure ?? []}
      />
      <ScheduleErrorModal message={errorMessage} onClose={closeErrorModal} />
    </div>
  );
}
