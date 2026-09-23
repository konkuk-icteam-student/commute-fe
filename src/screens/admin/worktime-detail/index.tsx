"use client";

import { useState } from "react";

import {
  type GetAdminWorkSchedulesResponse,
  useGetAdminWorkSchedulesQuery,
} from "@/apis/work-schedules";
import { useGetWorkApplicationSettingsQuery } from "@/apis/admin/work-application-settings";
import {
  isWithinApplyPeriod,
  ScheduleErrorModal,
  useScheduleErrorModal,
} from "@/features/schedule";
import {
  toWorktimeDetailSlotsByDay,
  WorktimeDetailQuickSearch,
  WorktimeDetailSection,
} from "@/features/admin/worktime";
import {
  getMonthWeekDateRange,
  getMonthWeekOfDate,
  getWeekdaysOfMonthWeek,
  formatDateString,
  shiftDateByWeeks,
  shiftYearMonth,
} from "@/lib/date-formatter";

const EDITABLE_MONTH_COUNT = 3;

const getMonthIndex = (year: number, month: number) => year * 12 + month;

const getFirstWeekdayOfMonth = (year: number, month: number) => {
  const date = new Date(year, month - 1, 1);

  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

export default function WorktimeDetailScreen() {
  const [today] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [isEditMode, setIsEditMode] = useState(false);
  const [candidateMonths] = useState(() => {
    return Array.from({ length: EDITABLE_MONTH_COUNT }, (_, monthOffset) =>
      shiftYearMonth(today.getFullYear(), today.getMonth() + 1, monthOffset),
    );
  });

  const {
    workApplicationSettingsData: currentMonthSettings,
    isPendingWorkApplicationSettings: isPendingCurrentMonthSettings,
    workApplicationSettingsError: currentMonthSettingsError,
  } = useGetWorkApplicationSettingsQuery(candidateMonths[0]);
  const {
    workApplicationSettingsData: nextMonthSettings,
    isPendingWorkApplicationSettings: isPendingNextMonthSettings,
    workApplicationSettingsError: nextMonthSettingsError,
  } = useGetWorkApplicationSettingsQuery(candidateMonths[1]);
  const {
    workApplicationSettingsData: followingMonthSettings,
    isPendingWorkApplicationSettings: isPendingFollowingMonthSettings,
    workApplicationSettingsError: followingMonthSettingsError,
  } = useGetWorkApplicationSettingsQuery(candidateMonths[2]);

  const todayDate = formatDateString(today);
  const settingsEntries = [
    { target: candidateMonths[0], data: currentMonthSettings },
    { target: candidateMonths[1], data: nextMonthSettings },
    { target: candidateMonths[2], data: followingMonthSettings },
  ];
  const editableMonths = settingsEntries
    .filter(
      ({ data }, index) =>
        index === 0 ||
        (data?.isConfigured && isWithinApplyPeriod(todayDate, data)),
    )
    .map(({ target }) => target);
  const currentMonthIndex = getMonthIndex(
    today.getFullYear(),
    today.getMonth() + 1,
  );
  const latestViewableMonthIndex = editableMonths.reduce(
    (latestMonthIndex, target) =>
      Math.max(latestMonthIndex, getMonthIndex(target.year, target.month)),
    currentMonthIndex,
  );
  const isEditAvailable =
    !isPendingCurrentMonthSettings &&
    !isPendingNextMonthSettings &&
    !isPendingFollowingMonthSettings &&
    editableMonths.length > 0;

  const { year, month, week, maxWeek } = getMonthWeekOfDate(selectedDate);
  const selectedMonthIndex = getMonthIndex(year, month);
  const isEditableMonth = (targetYear: number, targetMonth: number) =>
    editableMonths.some(
      (target) => target.year === targetYear && target.month === targetMonth,
    );
  const isMonthScheduleEnabled = (targetYear: number, targetMonth: number) =>
    isEditableMonth(targetYear, targetMonth) ||
    (!isEditMode &&
      getMonthIndex(targetYear, targetMonth) <= currentMonthIndex);
  const isFutureUnavailableMonth =
    selectedMonthIndex > currentMonthIndex &&
    !isMonthScheduleEnabled(year, month);
  const isCurrentMonthScheduleEnabled = !isFutureUnavailableMonth;
  const isLastViewableWeek =
    selectedMonthIndex >= latestViewableMonthIndex && week >= maxWeek;
  const { startDate, endDate } = getMonthWeekDateRange(year, month, week);
  const weekdays = getWeekdaysOfMonthWeek(year, month, week);
  const adjacentMonthDates = weekdays.filter(
    ({ isCurrentMonth }) => !isCurrentMonth,
  );
  const adjacentStartDate = adjacentMonthDates[0]?.date ?? startDate;
  const adjacentEndDate =
    adjacentMonthDates[adjacentMonthDates.length - 1]?.date ?? endDate;
  const [adjacentYear = 0, adjacentMonth = 0] = adjacentStartDate
    .split("-")
    .map(Number);
  const isAdjacentMonthScheduleEnabled =
    adjacentMonthDates.length > 0 &&
    isMonthScheduleEnabled(adjacentYear, adjacentMonth);

  const {
    adminWorkSchedulesData: currentMonthWorkSchedulesData,
    isFetchingAdminWorkSchedules: isFetchingCurrentMonthWorkSchedules,
    adminWorkSchedulesError: currentMonthWorkSchedulesError,
  } = useGetAdminWorkSchedulesQuery({
    startDate,
    endDate,
    enabled: isCurrentMonthScheduleEnabled,
  });
  const {
    adminWorkSchedulesData: adjacentMonthWorkSchedulesData,
    isFetchingAdminWorkSchedules: isFetchingAdjacentMonthWorkSchedules,
    adminWorkSchedulesError: adjacentMonthWorkSchedulesError,
  } = useGetAdminWorkSchedulesQuery({
    startDate: adjacentStartDate,
    endDate: adjacentEndDate,
    enabled: isAdjacentMonthScheduleEnabled,
  });

  const enabledCurrentMonthWorkSchedulesData = isCurrentMonthScheduleEnabled
    ? currentMonthWorkSchedulesData
    : undefined;
  const enabledAdjacentMonthWorkSchedulesData = isAdjacentMonthScheduleEnabled
    ? adjacentMonthWorkSchedulesData
    : undefined;
  const baseWorkSchedulesData =
    enabledCurrentMonthWorkSchedulesData ??
    enabledAdjacentMonthWorkSchedulesData;
  const workSchedulesData: GetAdminWorkSchedulesResponse | undefined =
    baseWorkSchedulesData
      ? {
          ...baseWorkSchedulesData,
          startDate: weekdays[0]?.date ?? startDate,
          endDate: weekdays[weekdays.length - 1]?.date ?? endDate,
          days: [
            ...(enabledCurrentMonthWorkSchedulesData?.days ?? []),
            ...(enabledAdjacentMonthWorkSchedulesData?.days ?? []),
          ],
        }
      : undefined;

  // 조회에 실패하면 표가 잠긴 채로 남아 장애인지 알 수 없으므로 모달로 알린다.
  const { errorMessage, closeErrorModal } = useScheduleErrorModal([
    currentMonthWorkSchedulesError,
    adjacentMonthWorkSchedulesError,
    currentMonthSettingsError,
    nextMonthSettingsError,
    followingMonthSettingsError,
  ]);

  const slotsByDay = toWorktimeDetailSlotsByDay(weekdays, workSchedulesData);

  const handlePrevWeek = () => {
    if (isEditMode && selectedMonthIndex <= currentMonthIndex && week <= 1) {
      return;
    }

    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, -1));
  };

  const handleNextWeek = () => {
    if (isLastViewableWeek) {
      return;
    }

    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, 1));
  };

  const handleChangeEditMode = () => {
    const nextMode = !isEditMode;

    if (nextMode && !isEditAvailable) {
      return;
    }

    const canEditSelectedMonth = isEditableMonth(year, month);

    if (nextMode && !canEditSelectedMonth) {
      const [firstEditableMonth] = editableMonths;
      setSelectedDate(
        getFirstWeekdayOfMonth(
          firstEditableMonth.year,
          firstEditableMonth.month,
        ),
      );
    }

    setIsEditMode(nextMode);
  };

  return (
    <div className="flex flex-row">
      <WorktimeDetailSection
        year={year}
        month={month}
        week={week}
        slotsByDay={slotsByDay}
        maxConcurrentWorkers={workSchedulesData?.maxConcurrentWorkers ?? 0}
        isLoading={
          (isCurrentMonthScheduleEnabled &&
            isFetchingCurrentMonthWorkSchedules) ||
          (isAdjacentMonthScheduleEnabled &&
            isFetchingAdjacentMonthWorkSchedules)
        }
        isEditMode={isEditMode}
        isEditAvailable={isEditAvailable}
        isPrevWeekDisabled={
          isEditMode && selectedMonthIndex <= currentMonthIndex && week <= 1
        }
        isNextWeekDisabled={isLastViewableWeek}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        handleChangeEditMode={handleChangeEditMode}
      />
      <WorktimeDetailQuickSearch
        startDate={startDate}
        endDate={endDate}
        isScheduleEnabled={!isFutureUnavailableMonth}
      />

      <ScheduleErrorModal message={errorMessage} onClose={closeErrorModal} />
    </div>
  );
}
