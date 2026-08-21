"use client";

import { useState } from "react";

import {
  EMPTY_SCHEDULE,
  ScheduleChangeHistoryPreview,
  ScheduleErrorModal,
  ScheduleGrid,
  ScheduleHeader,
  ScheduleRefreshButton,
  ScheduleStatusLegend,
  ScheduleWeekNav,
  getNextYearMonth,
  isWithinApplyPeriod,
  useScheduleErrorModal,
  useScheduleGrid,
  useScheduleWeek,
  viewPolicy,
  WorkingHoursCard,
} from "@/features/schedule";
import {
  useGetApplyPeriodQuery,
  useGetPeriodSchedulesQuery,
  useGetWorkSchedulesSummaryQuery,
} from "@/apis/work-schedules";
import { formatDateString, getMonthWeekDateRange } from "@/lib/date-formatter";
import { Toggle } from "@/components/ui";
import { useGetMyPageQuery } from "@/apis/my-page";
import { useGetWorkChangeRequestHistoryQuery } from "@/apis/work-change-requests";

// 미리보기라 최근 것만 보여 준다. 전체는 '처리내역 자세히보기'로 넘어간다.
const CHANGE_HISTORY_PREVIEW_SIZE = 4;

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
    isFetchingPeriodSchedules,
    periodSchedulesError,
    refetchPeriodSchedules,
  } = useGetPeriodSchedulesQuery({
    startDate,
    endDate,
  });

  // 근로시간은 시간표와 따로 조회한다. 주간·월간 합계와 한도를 서버가 계산해 준다.
  const {
    workSchedulesSummaryData,
    isFetchingWorkSchedulesSummary,
    workSchedulesSummaryError,
    refetchWorkSchedulesSummary,
  } = useGetWorkSchedulesSummaryQuery({
    startDate,
    endDate,
  });

  const { myPageData, isFetchingMyPage, myPageError, refetchMyPage } =
    useGetMyPageQuery();

  // 상단 두 버튼의 활성 여부는 두 달치 신청 기간으로 정한다.
  // 이 달 기간에는 시간표가 확정되는 중이라 수정 요청을 막고,
  // 다음 달 기간에는 그 달 근로를 신청할 수 있다.
  const nextYearMonth = getNextYearMonth(year, month);
  const {
    applyPeriodData: currentMonthApplyPeriodData,
    applyPeriodError: currentMonthApplyPeriodError,
    refetchApplyPeriod: refetchCurrentMonthApplyPeriod,
  } = useGetApplyPeriodQuery({ year, month });
  const {
    applyPeriodData: nextMonthApplyPeriodData,
    applyPeriodError: nextMonthApplyPeriodError,
    refetchApplyPeriod: refetchNextMonthApplyPeriod,
  } = useGetApplyPeriodQuery(nextYearMonth);

  const todayDate = formatDateString(today);
  const isEditAvailable = !isWithinApplyPeriod(
    todayDate,
    currentMonthApplyPeriodData,
  );
  const isApplyAvailable = isWithinApplyPeriod(
    todayDate,
    nextMonthApplyPeriodData,
  );

  // 아직 처리되지 않은 요청만 미리 보여 준다. 이 칸의 빈 상태 문구도 '처리 중인 내역'을 가리킨다.
  const {
    workChangeRequestHistoryData,
    workChangeRequestHistoryError,
    refetchWorkChangeRequestHistory,
  } = useGetWorkChangeRequestHistoryQuery({
    year,
    month,
    statusCode: "CS01",
    page: 0,
    size: CHANGE_HISTORY_PREVIEW_SIZE,
  });

  // 근로시간 카드는 요약과 마이페이지를 함께 쓰므로 둘 중 하나라도 받는 중이면 로딩이다.
  const isFetchingWorkingHours =
    isFetchingWorkSchedulesSummary || isFetchingMyPage;

  // 조회에 실패하면 표가 잠긴 채로 남는다. 새로고침이 다시 시도할 유일한 통로다.
  // 근로시간 카드가 세 조회를 함께 쓰므로 셋 다 다시 요청한다. 처리 내역도 같이 받아 온다.
  const handleRefresh = () => {
    void refetchPeriodSchedules();
    void refetchWorkSchedulesSummary();
    void refetchMyPage();
    void refetchWorkChangeRequestHistory();
    void refetchCurrentMonthApplyPeriod();
    void refetchNextMonthApplyPeriod();
  };

  // 조회에 실패하면 표가 회색으로만 남아 장애인지 알 수 없으므로 모달로 알린다.
  const { errorMessage, closeErrorModal } = useScheduleErrorModal([
    periodSchedulesError,
    workSchedulesSummaryError,
    myPageError,
    workChangeRequestHistoryError,
    currentMonthApplyPeriodError,
    nextMonthApplyPeriodError,
  ]);

  // 응답 전에는 빈 시간표로 그린다. 표 모양이 유지되고 모든 칸이 잠긴 상태로 보인다.
  const schedule = periodSchedulesData ?? EMPTY_SCHEDULE;
  const weekMaxHours = workSchedulesSummaryData?.week.maxHours ?? 0;
  const weekUsedHours = workSchedulesSummaryData?.week.usedHours ?? 0;
  const weekWorkedHours = myPageData?.week.workedHours ?? 0;
  const monthMaxHours = workSchedulesSummaryData?.month.maxHours ?? 0;
  const monthUsedHours = workSchedulesSummaryData?.month.usedHours ?? 0;
  const monthWorkedHours = myPageData?.month.workedHours ?? 0;
  const minWorkUnitHours =
    (workSchedulesSummaryData?.minWorkUnitMinutes ?? 0) / 60;

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
      <ScheduleHeader
        year={year}
        month={month}
        isApplyAvailable={isApplyAvailable}
        isEditAvailable={isEditAvailable}
      />
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
              className="ml-5"
            />
          }
          action={<ScheduleRefreshButton onClick={handleRefresh} />}
        />
        <ScheduleGrid
          days={days}
          cells={cells}
          isLoading={isFetchingPeriodSchedules}
        />
        <ScheduleStatusLegend
          minSessionHours={minWorkUnitHours}
          weeklyMaxHours={weekMaxHours}
          monthlyTargetHours={monthMaxHours}
        />
      </div>
      <div className="flex flex-col gap-2">
        {/* hours는 실 근무 시간, maxHours는 신청한 시간 */}
        <WorkingHoursCard
          label={`${week}주차 총 시간`}
          hours={weekWorkedHours}
          maxHours={weekUsedHours}
          isLoading={isFetchingWorkingHours}
        />
        {/* hours는 실 근무 시간, maxHours는 신청한 시간 */}
        <WorkingHoursCard
          label={`${month}월 전체`}
          hours={monthWorkedHours}
          maxHours={monthUsedHours}
          withProgressBar
          isLoading={isFetchingWorkingHours}
        />
        <ScheduleChangeHistoryPreview
          histories={workChangeRequestHistoryData?.histories ?? []}
        />
      </div>

      <ScheduleErrorModal message={errorMessage} onClose={closeErrorModal} />
    </div>
  );
}
