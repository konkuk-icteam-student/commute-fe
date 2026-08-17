"use client";

import { ChangeEvent, useState } from "react";

import {
  useGetAdminUserSearchQuery,
  type AdminSearchedUser,
} from "@/apis/admin/users";
import { useDebouncedValue } from "@/hooks";
import { cn } from "@/lib/utils";

import { formatAdminUserDetail } from "../../utils";

interface WorktimeDetailMemberSearchProps {
  shouldOpenUpward: boolean;
  // 배치 요청이 도는 중. 같은 칸에 두 번 넣지 않도록 잠근다.
  isAdding: boolean;
  handleAdd: (user: AdminSearchedUser) => void;
}

// 셀마다 검색창을 두면 조회 훅도 셀 수만큼 생긴다.
// 열렸을 때만 이 컴포넌트가 붙으므로 실제로 도는 조회는 하나다.
export default function WorktimeDetailMemberSearch({
  shouldOpenUpward,
  isAdding,
  handleAdd,
}: WorktimeDetailMemberSearchProps) {
  const [searchText, setSearchText] = useState("");

  const debouncedSearchText = useDebouncedValue(searchText);
  const {
    adminUserSearchData,
    isFetchingAdminUserSearch,
    isErrorAdminUserSearch,
  } = useGetAdminUserSearchQuery({ keyword: debouncedSearchText });

  const searchedUsers = adminUserSearchData?.users ?? [];
  // 입력이 멎기 전에는 아직 조회 전이라 결과가 비어 있다. 없음이 아니라 로딩으로 본다.
  const isSearching =
    isFetchingAdminUserSearch || debouncedSearchText !== searchText;

  const handleChangeSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div
      className={cn(
        "absolute left-1/2 z-20 flex -translate-x-1/2 flex-col gap-1.5 rounded-xl border border-[#E5E5EA] bg-white p-2 shadow-[0_10px_25px_0_rgba(0,0,0,0.12),0_3px_10px_0_rgba(0,0,0,0.04)]",
        shouldOpenUpward ? "bottom-0" : "top-0",
      )}
    >
      <input
        type="text"
        className="w-45 rounded-md border border-[#E5E5EA] bg-[#F2F2F7] px-2.5 py-2 text-xs font-medium"
        value={searchText}
        onChange={handleChangeSearchText}
        placeholder="이름을 입력하세요."
      />
      {searchText.trim() !== "" && (
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
            searchedUsers.map((user) => {
              const detail = formatAdminUserDetail(user);

              return (
                <button
                  key={user.userId}
                  type="button"
                  className="flex cursor-pointer flex-col rounded-md px-2.5 py-1.5 text-start text-xs font-medium hover:bg-[#E9F2FF] hover:text-[#2D81FF] disabled:cursor-default"
                  disabled={isAdding}
                  onClick={() => handleAdd(user)}
                >
                  <span className="text-[13px] font-semibold">
                    {user.userName}
                  </span>
                  {detail && (
                    <span className="text-[13px] text-[#8A949E]">{detail}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
