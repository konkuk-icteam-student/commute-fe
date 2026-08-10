"use client";

import { useState } from "react";

import {
  editPolicy,
  EMPTY_SCHEDULE,
  getAppliedSlotTimes,
  getCurrentMonthSlots,
  getDraftSlotTimes,
  getSlotTimesTotalHours,
  hasSlotTimesBelowMinSessionHours,
  ScheduleChangeList,
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
  WorkingHoursCard,
  type ScheduleDraft,
} from "@/features/schedule";
import {
  useEditWorkSchedulesMutation,
  useGetPeriodSchedulesQuery,
  useGetWorkSchedulesSummaryQuery,
} from "@/apis/work-schedules";
import { getMonthWeekDateRange } from "@/lib/date-formatter";
import { Alert, Button, Modal } from "@/components/ui";

// TODO: 응답에 대응하는 값이 없어 아직 화면에 둔다!
const MIN_SESSION_HOURS = 1;

// 이번 달에 추가로 신청할 수 있는 시간. 삭제를 신청한 만큼 다시 채워 넣을 수 있다.
const getAbleToAddHours = (
  monthLimitHours: number,
  monthUsedHours: number,
  deleteRequestHours: number,
) => monthLimitHours - monthUsedHours + deleteRequestHours;

// 칸을 누르는 시점의 내역으로 한도를 다시 계산한다.
const createResolveEditContext =
  (
    maxConcurrentWorkers: number,
    monthLimitHours: number,
    monthUsedHours: number,
  ) =>
  (draft: ScheduleDraft) => ({
    maxConcurrentWorkers,
    editLimit: {
      addHours: getSlotTimesTotalHours(getDraftSlotTimes(draft, "ADD")),
      maxAddHours: getAbleToAddHours(
        monthLimitHours,
        monthUsedHours,
        getSlotTimesTotalHours(getDraftSlotTimes(draft, "DELETE")),
      ),
    },
  });

export default function ScheduleEditScreen() {
  // 수정 요청은 이번 달 전체에 대해 가능하다.
  // 지난 주차도 열어 둔다 — 제때 수정하지 못하고 넘어간 근무를 정정할 수 있어야 한다.
  const [today] = useState(() => new Date());
  const {
    year,
    month,
    week,
    isPrevWeekDisabled,
    isNextWeekDisabled,
    goPrevWeek,
    goNextWeek,
  } = useScheduleWeek(today);

  const [reason, setReason] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isApplyAlertOpen, setIsApplyAlertOpen] = useState(false);

  const { startDate, endDate } = getMonthWeekDateRange(year, month, week);
  const {
    periodSchedulesData,
    isPendingPeriodSchedules,
    periodSchedulesError,
  } = useGetPeriodSchedulesQuery({
    startDate,
    endDate,
  });

  // 범례에 쓸 주·월 한도. 시간표와 따로 조회하며 서버가 계산해 준다.
  const { workSchedulesSummaryData, workSchedulesSummaryError } =
    useGetWorkSchedulesSummaryQuery({
      startDate,
      endDate,
    });

  const { editWorkSchedules, isPendingEditWorkSchedules } =
    useEditWorkSchedulesMutation();

  // 조회 실패는 자동으로, 수정 요청 실패는 showError로 알린다.
  const { errorMessage, showError, closeErrorModal } = useScheduleErrorModal([
    periodSchedulesError,
    workSchedulesSummaryError,
  ]);

  // 응답 전에는 빈 시간표로 그린다. 표 모양이 유지되고 모든 칸이 잠긴 상태로 보인다.
  const schedule = periodSchedulesData ?? EMPTY_SCHEDULE;
  const weekLimitHours = workSchedulesSummaryData?.week.limitHours ?? 0;
  const weekUsedHours = workSchedulesSummaryData?.week.usedHours ?? 0;
  const monthLimitHours = workSchedulesSummaryData?.month.limitHours ?? 0;
  const monthUsedHours = workSchedulesSummaryData?.month.usedHours ?? 0;

  const {
    draft,
    toggleSlot,
    resetDraft,
    context,
    payload,
    addHours: addRequestHours,
    deleteHours: deleteRequestHours,
  } = useScheduleDraft({
    policy: editPolicy,
    resolveContext: createResolveEditContext(
      schedule.maxConcurrentWorkers,
      monthLimitHours,
      monthUsedHours,
    ),
  });

  const { days, cells } = useScheduleGrid({
    data: schedule,
    year,
    month,
    week,
    policy: editPolicy,
    context,
    draft,
    onSlotClick: toggleSlot,
  });

  const ableToAddHours = getAbleToAddHours(
    monthLimitHours,
    monthUsedHours,
    deleteRequestHours,
  );
  const isBelowMinSessionHours = hasSlotTimesBelowMinSessionHours(
    getAppliedSlotTimes(getCurrentMonthSlots(days), draft),
    MIN_SESSION_HOURS,
  );

  const buttonDisabled =
    (deleteRequestHours === 0 && addRequestHours === 0) ||
    deleteRequestHours > monthUsedHours ||
    addRequestHours > ableToAddHours ||
    reason === "" ||
    isPendingEditWorkSchedules;

  const handleClickButton = () => {
    if (isBelowMinSessionHours) {
      setIsWarningOpen(true);
      return;
    }

    setIsApplyAlertOpen(true);
  };

  const handleApply = () => {
    setIsApplyAlertOpen(false);

    editWorkSchedules(
      { ...payload, reason },
      {
        onSuccess: () => {
          resetDraft();
          setReason("");
        },
        // 실패하면 입력한 내역과 사유는 그대로 두고 서버 문구만 보여 준다.
        onError: showError,
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4">
      <ScheduleHeader mode="edit" year={year} month={month} />
      <div className="flex flex-col gap-2">
        <ScheduleWeekNav
          week={week}
          isPrevWeekDisabled={isPrevWeekDisabled}
          isNextWeekDisabled={isNextWeekDisabled}
          onPrevWeek={goPrevWeek}
          onNextWeek={goNextWeek}
          action={<ScheduleRefreshButton />}
        />
        <ScheduleGrid
          days={days}
          cells={cells}
          isLoading={isPendingPeriodSchedules}
        />
        <ScheduleStatusLegend
          minSessionHours={MIN_SESSION_HOURS}
          weeklyMaxHours={weekLimitHours}
          monthlyTargetHours={monthLimitHours}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <WorkingHoursCard
            label={`${week}주차 근무시간`}
            hours={weekUsedHours}
          />
          <WorkingHoursCard
            label={`${month}월 근무시간`}
            hours={monthUsedHours}
          />
        </div>
        <WorkingHoursCard
          label="근무 삭제 신청"
          hours={deleteRequestHours}
          maxHours={monthUsedHours}
          isRed
          isOverflow={deleteRequestHours > monthUsedHours}
        />
        <ScheduleChangeList isAdd={false} changeItems={payload.deleteSlots} />

        <WorkingHoursCard
          label="추가 근무 신청"
          hours={addRequestHours}
          maxHours={ableToAddHours}
          isOverflow={addRequestHours > ableToAddHours}
        />
        <ScheduleChangeList changeItems={payload.addSlots} />

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
      <ScheduleErrorModal message={errorMessage} onClose={closeErrorModal} />
    </div>
  );
}
