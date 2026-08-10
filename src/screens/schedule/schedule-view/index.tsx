"use client";

import { useState } from "react";

import {
  DUMMY_SCHEDULE_CHANGE_HISTORY,
  EMPTY_SCHEDULE,
  ScheduleChangeHistoryPreview,
  ScheduleErrorModal,
  ScheduleGrid,
  ScheduleHeader,
  ScheduleRefreshButton,
  ScheduleStatusLegend,
  ScheduleWeekNav,
  useScheduleErrorModal,
  useScheduleGrid,
  useScheduleWeek,
  viewPolicy,
  WorkingHoursCard,
} from "@/features/schedule";
import {
  useGetPeriodSchedulesQuery,
  useGetWorkSchedulesSummaryQuery,
} from "@/apis/work-schedules";
import { getMonthWeekDateRange } from "@/lib/date-formatter";
import { Toggle } from "@/components/ui";
import { useGetMyPageQuery } from "@/apis/my-page";

// TODO: 응답에 대응하는 값이 없어 아직 화면에 둔다
const MIN_SESSION_HOURS = 1;

export default function ScheduleViewScreen() {
  // 조회는 이번 달 안에서만 이동할 수 있다.
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
  // '자세히'를 켜야 칸마다 인원수를 보여 준다.
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const { startDate, endDate } = getMonthWeekDateRange(year, month, week);
  const {
    periodSchedulesData,
    isPendingPeriodSchedules,
    periodSchedulesError,
    refetchPeriodSchedules,
  } = useGetPeriodSchedulesQuery({
    startDate,
    endDate,
  });

  // 근로시간은 시간표와 따로 조회한다. 주간·월간 합계와 한도를 서버가 계산해 준다.
  const {
    workSchedulesSummaryData,
    isPendingWorkSchedulesSummary,
    workSchedulesSummaryError,
    refetchWorkSchedulesSummary,
  } = useGetWorkSchedulesSummaryQuery({
    startDate,
    endDate,
  });

  const { myPageData, isPendingMyPage, myPageError, refetchMyPage } =
    useGetMyPageQuery();

  // 조회에 실패하면 표가 잠긴 채로 남는다. 새로고침이 다시 시도할 유일한 통로다.
  // 근로시간 카드가 세 조회를 함께 쓰므로 셋 다 다시 요청한다.
  const handleRefresh = () => {
    void refetchPeriodSchedules();
    void refetchWorkSchedulesSummary();
    void refetchMyPage();
  };

  // 조회에 실패하면 표가 회색으로만 남아 장애인지 알 수 없으므로 모달로 알린다.
  const { errorMessage, closeErrorModal } = useScheduleErrorModal([
    periodSchedulesError,
    workSchedulesSummaryError,
    myPageError,
  ]);

  // 응답 전에는 빈 시간표로 그린다. 표 모양이 유지되고 모든 칸이 잠긴 상태로 보인다.
  const schedule = periodSchedulesData ?? EMPTY_SCHEDULE;
  const weekLimitHours = workSchedulesSummaryData?.week.limitHours ?? 0;
  const weekUsedHours = workSchedulesSummaryData?.week.usedHours ?? 0;
  const weekWorkedHours = myPageData?.week.workedHours ?? 0;
  const monthLimitHours = workSchedulesSummaryData?.month.limitHours ?? 0;
  const monthUsedHours = workSchedulesSummaryData?.month.usedHours ?? 0;
  const monthWorkedHours = myPageData?.month.workedHours ?? 0;

  const { days, cells } = useScheduleGrid({
    data: schedule,
    year,
    month,
    week,
    policy: viewPolicy,
    context: {
      maxConcurrentWorkers: schedule.maxConcurrentWorkers,
    },
    isDetailVisible,
  });

  return (
    <div className="flex w-full flex-col gap-4 px-3 py-4">
      <ScheduleHeader year={year} month={month} />
      <div className="flex flex-col gap-2">
        <ScheduleWeekNav
          week={week}
          isPrevWeekDisabled={isPrevWeekDisabled}
          isNextWeekDisabled={isNextWeekDisabled}
          onPrevWeek={goPrevWeek}
          onNextWeek={goNextWeek}
          leadingAction={
            <Toggle
              checked={isDetailVisible}
              onCheckedChange={setIsDetailVisible}
              label="자세히"
            />
          }
          action={<ScheduleRefreshButton onClick={handleRefresh} />}
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
        {/* hours는 실 근무 시간, maxHours는 신청한 시간 */}
        <WorkingHoursCard
          label={`${week}주차 총 시간`}
          hours={weekWorkedHours}
          maxHours={weekUsedHours}
          isLoading={isPendingWorkSchedulesSummary || isPendingMyPage}
        />
        {/* hours는 실 근무 시간, maxHours는 신청한 시간 */}
        <WorkingHoursCard
          label={`${month}월 전체`}
          hours={monthWorkedHours}
          maxHours={monthUsedHours}
          withProgressBar
          isLoading={isPendingWorkSchedulesSummary || isPendingMyPage}
        />
        <ScheduleChangeHistoryPreview
          histories={DUMMY_SCHEDULE_CHANGE_HISTORY}
        />
      </div>

      <ScheduleErrorModal message={errorMessage} onClose={closeErrorModal} />
    </div>
  );
}
