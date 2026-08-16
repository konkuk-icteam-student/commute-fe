"use client";

import { ChangeEvent, useState } from "react";

import { useGetAdminUserSearchQuery } from "@/apis/admin/users";
import { useGetAdminWorkSchedulesQuery } from "@/apis/admin/work-schedules";
import { useDebouncedValue } from "@/hooks";
import {
  buildWeekSchedule,
  ScheduleErrorModal,
  useScheduleErrorModal,
} from "@/features/schedule";
import {
  toAdminWeekScheduleSource,
  WorktimeEditRequestSection,
  WorktimeScheduleSection,
} from "@/features/admin/worktime";
import {
  getMonthWeekDateRange,
  getMonthWeekOfDate,
  getWeekdaysOfMonthWeek,
  shiftDateByWeeks,
} from "@/lib/date-formatter";

export default function WorktimeScreen() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [searchText, setSearchText] = useState("");
  const [userResult, setUserResult] = useState("");

  const { year, month, week } = getMonthWeekOfDate(selectedDate);
  const { startDate, endDate } = getMonthWeekDateRange(year, month, week);

  const {
    adminWorkSchedulesData,
    adminWorkSchedulesError,
    refetchAdminWorkSchedules,
  } = useGetAdminWorkSchedulesQuery({
    startDate,
    endDate,
    // 이름을 고르지 않았으면 전체 시간표를 본다.
    ...(userResult ? { userName: userResult } : {}),
  });

  const debouncedSearchText = useDebouncedValue(searchText);
  const {
    adminUserSearchData,
    isFetchingAdminUserSearch,
    isErrorAdminUserSearch,
  } = useGetAdminUserSearchQuery({ keyword: debouncedSearchText });

  // 입력이 멎기 전에는 아직 조회 전이라 결과가 비어 있다. 없음이 아니라 로딩으로 본다.
  const isSearching =
    isFetchingAdminUserSearch || debouncedSearchText !== searchText;

  // 조회에 실패하면 표가 잠긴 채로 남아 장애인지 알 수 없으므로 모달로 알린다.
  const { errorMessage, closeErrorModal } = useScheduleErrorModal([
    adminWorkSchedulesError,
  ]);

  const days = buildWeekSchedule(
    toAdminWeekScheduleSource(adminWorkSchedulesData),
    getWeekdaysOfMonthWeek(year, month, week),
  );

  const handlePrevWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, -1));
  };

  const handleNextWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, 1));
  };

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleGetMemberSchedule = (name: string) => {
    setSearchText("");
    setUserResult(name);
  };

  const handleReset = () => {
    setSearchText("");
    setUserResult("");
    void refetchAdminWorkSchedules();
  };

  const handleClickRequestCard = (name: string) => {
    setUserResult(name);
  };

  return (
    <div className="flex justify-center gap-6">
      <WorktimeScheduleSection
        year={year}
        month={month}
        week={week}
        days={days}
        maxConcurrentWorkers={adminWorkSchedulesData?.maxConcurrentWorkers ?? 0}
        searchText={searchText}
        searchedUsers={adminUserSearchData?.users ?? []}
        isSearching={isSearching}
        isSearchError={isErrorAdminUserSearch}
        userResult={userResult}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        handleChangeText={handleChangeText}
        handleGetMemberSchedule={handleGetMemberSchedule}
        handleReset={handleReset}
      />
      <WorktimeEditRequestSection
        userResult={userResult}
        handleClickRequestCard={handleClickRequestCard}
      />

      <ScheduleErrorModal message={errorMessage} onClose={closeErrorModal} />
    </div>
  );
}
