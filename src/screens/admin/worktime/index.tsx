"use client";

import { ChangeEvent, useState } from "react";

import type { AdminSearchedUser } from "@/apis/admin/users";
import { useGetAdminUserSearchQuery } from "@/apis/admin/users";
import {
  useGetAdminUserWorkSchedulesQuery,
  useGetAdminWorkSchedulesQuery,
} from "@/apis/admin/work-schedules";
import { useDebouncedValue } from "@/hooks";
import {
  buildWeekSchedule,
  ScheduleErrorModal,
  useScheduleErrorModal,
} from "@/features/schedule";
import {
  toAdminUserWeekScheduleSource,
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

// 시간표를 조회할 대상. 검색 결과와 수정요청 카드 양쪽에서 정해진다.
interface SelectedWorktimeUser {
  userId: number;
  userName: string;
}

export default function WorktimeScreen() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<SelectedWorktimeUser | null>(
    null,
  );

  // 검색 결과 아래와 수정요청 카드 강조에 쓰는 표시용 이름.
  const userResult = selectedUser?.userName ?? "";

  const { year, month, week } = getMonthWeekOfDate(selectedDate);
  const { startDate, endDate } = getMonthWeekDateRange(year, month, week);

  // 조회할 사용자가 정해진 동안에는 사용자별 조회를, 그 외에는 전체 조회를 쓴다.
  const isUserSelected = selectedUser !== null;

  const {
    adminWorkSchedulesData,
    isFetchingAdminWorkSchedules,
    adminWorkSchedulesError,
    refetchAdminWorkSchedules,
  } = useGetAdminWorkSchedulesQuery({
    startDate,
    endDate,
    enabled: !isUserSelected,
  });

  const {
    adminUserWorkSchedulesData,
    isFetchingAdminUserWorkSchedules,
    adminUserWorkSchedulesError,
    refetchAdminUserWorkSchedules,
  } = useGetAdminUserWorkSchedulesQuery({
    userId: selectedUser?.userId ?? 0,
    startDate,
    endDate,
    enabled: isUserSelected,
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
  // 지금 돌지 않는 조회의 실패는 남은 값이므로 화면에 쓰는 쪽만 본다.
  const { errorMessage, closeErrorModal } = useScheduleErrorModal([
    isUserSelected ? adminUserWorkSchedulesError : adminWorkSchedulesError,
  ]);

  const scheduleSource = isUserSelected
    ? toAdminUserWeekScheduleSource(adminUserWorkSchedulesData)
    : toAdminWeekScheduleSource(adminWorkSchedulesData);

  const days = buildWeekSchedule(
    scheduleSource,
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

  const handleGetMemberSchedule = (user: AdminSearchedUser) => {
    setSearchText("");
    setSelectedUser({ userId: user.userId, userName: user.userName });
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedUser(null);
    void refetchAdminWorkSchedules();
  };

  // 조회에 실패했거나 다른 관리자가 배치를 바꿨을 때 지금 보고 있는 주차를 다시 받아 온다.
  const handleRefresh = () => {
    if (isUserSelected) {
      void refetchAdminUserWorkSchedules();

      return;
    }

    void refetchAdminWorkSchedules();
  };

  // 카드도 userId를 실어 보내므로 검색으로 고른 것과 같은 조회를 쓴다.
  const handleClickRequestCard = (userId: number, name: string) => {
    setSelectedUser({ userId, userName: name });
  };

  return (
    <div className="flex justify-center gap-6">
      <WorktimeScheduleSection
        year={year}
        month={month}
        week={week}
        days={days}
        maxConcurrentWorkers={scheduleSource.maxConcurrentWorkers}
        isLoading={
          isUserSelected
            ? isFetchingAdminUserWorkSchedules
            : isFetchingAdminWorkSchedules
        }
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
        handleRefresh={handleRefresh}
      />
      <WorktimeEditRequestSection
        userResult={userResult}
        handleClickRequestCard={handleClickRequestCard}
      />

      <ScheduleErrorModal message={errorMessage} onClose={closeErrorModal} />
    </div>
  );
}
