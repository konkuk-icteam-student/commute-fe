"use client";

import { ChangeEvent, useState } from "react";

import {
  useGetAdminUserSearchQuery,
  type AdminSearchedUser,
} from "@/apis/admin/users";
import { useGetAdminWorkScheduleQuickSearchQuery } from "@/apis/admin/work-schedules";
import { useDebouncedValue } from "@/hooks";

import {
  formatAdminUserDetail,
  formatWorktimeQuickSearchSlot,
} from "../../utils";

interface WorktimeDetailQuickSearchProps {
  startDate: string;
  endDate: string;
}

export default function WorktimeDetailQuickSearch({
  startDate,
  endDate,
}: WorktimeDetailQuickSearchProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminSearchedUser | null>(
    null,
  );

  const debouncedSearchText = useDebouncedValue(searchText);
  const {
    adminUserSearchData,
    isFetchingAdminUserSearch,
    isErrorAdminUserSearch,
  } = useGetAdminUserSearchQuery({ keyword: debouncedSearchText });

  // 사용자를 고르기 전에는 보낼 userId가 없어 조회가 돌지 않는다.
  const {
    adminWorkScheduleQuickSearchData,
    isFetchingAdminWorkScheduleQuickSearch,
    isErrorAdminWorkScheduleQuickSearch,
  } = useGetAdminWorkScheduleQuickSearchQuery({
    userId: selectedUser?.userId ?? 0,
    startDate,
    endDate,
  });

  const searchedUsers = adminUserSearchData?.users ?? [];
  // 입력이 멎기 전에는 아직 조회 전이라 결과가 비어 있다. 없음이 아니라 로딩으로 본다.
  const isSearching =
    isFetchingAdminUserSearch || debouncedSearchText !== searchText;

  // 배치가 없는 날짜는 응답에서 빠지므로, 온 날짜의 구간만 한 줄로 편다.
  const workSlots = (adminWorkScheduleQuickSearchData?.days ?? []).flatMap(
    ({ date, dayOfWeek, slots }) =>
      slots.map((slot) => ({ date, dayOfWeek, ...slot })),
  );

  const handleChangeSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSelectUser = (user: AdminSearchedUser) => {
    setSelectedUser(user);
    // 결과 목록을 닫고 고른 사람의 근무를 보여 준다.
    setSearchText("");
  };

  // 고른 사람을 비워 결과를 닫는다. 입력이 남아 있었다면 함께 지운다.
  const handleReset = () => {
    setSearchText("");
    setSelectedUser(null);
  };

  const isSearchResultOpen = searchText.trim() !== "";

  return (
    <div className="relative min-w-73 bg-[#F4F5F6]">
      <div className="sticky top-50 right-3 mx-1.5 flex h-fit w-70 flex-col gap-3 rounded-2xl border border-[#E5E5EA] bg-white p-7 shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]">
        <h3 className="mb-3 text-lg font-bold">🔍 빠른 찾기</h3>
        <input
          type="search"
          aria-label="빠른 찾기 이름 검색"
          className="rounded-xl border border-[#E5E5EA] bg-[#F2F2F7] px-4 py-3.5"
          value={searchText}
          onChange={handleChangeSearchText}
          placeholder="이름을 입력하여 시간 확인"
        />

        {isSearchResultOpen ? (
          <div className="flex flex-col gap-0.5">
            {isSearching ||
            isErrorAdminUserSearch ||
            searchedUsers.length === 0 ? (
              <span className="py-5 text-center text-sm text-[#8A949E]">
                {isSearching
                  ? "검색 중입니다."
                  : isErrorAdminUserSearch
                    ? "검색에 실패했습니다."
                    : "검색결과가 없습니다."}
              </span>
            ) : (
              searchedUsers.map((user) => (
                <button
                  key={user.userId}
                  type="button"
                  className="flex cursor-pointer flex-col rounded-md px-2.5 py-1.5 text-start hover:bg-[#E9F2FF] hover:text-[#2D81FF]"
                  onClick={() => handleSelectUser(user)}
                >
                  <span className="text-[13px] font-semibold">
                    {user.userName}
                  </span>
                  <span className="text-[13px] text-[#8A949E]">
                    {formatAdminUserDetail(user)}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : (
          selectedUser && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center gap-1">
                <span className="font-bold">
                  {selectedUser.userName}님의 시간표
                </span>
                <button
                  type="button"
                  aria-label="빠른 찾기 초기화"
                  className="cursor-pointer px-0.5 font-bold text-[#8A949E] hover:text-[#1A2236]"
                  onClick={handleReset}
                >
                  x
                </button>
              </div>
              {isFetchingAdminWorkScheduleQuickSearch ||
              isErrorAdminWorkScheduleQuickSearch ||
              workSlots.length === 0 ? (
                <span className="text-sm text-[#8A949E]">
                  {isFetchingAdminWorkScheduleQuickSearch
                    ? "불러오는 중입니다."
                    : isErrorAdminWorkScheduleQuickSearch
                      ? "시간표를 불러오지 못했습니다."
                      : "이번 주에 배치된 시간이 없습니다."}
                </span>
              ) : (
                workSlots.map((slot) => (
                  <span
                    key={`${slot.date}-${slot.start}`}
                    className="font-bold text-[#2D81FF]"
                  >
                    {formatWorktimeQuickSearchSlot(slot)}
                  </span>
                ))
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
