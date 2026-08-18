import { ChangeEvent } from "react";
import Image from "next/image";

import type { AdminSearchedUser } from "@/apis/admin/users";
import { cn } from "@/lib/utils";
import icSearch from "@/assets/icons/common/ic_search.svg";

import { formatAdminUserDetail } from "../../utils";

interface WorktimeSearchUserProps {
  searchText: string;
  searchedUsers: AdminSearchedUser[];
  isSearching: boolean;
  isSearchError: boolean;
  userResult: string;
  handleChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
  handleGetMemberSchedule: (name: string) => void;
  handleReset: () => void;
}

export default function WorktimeSearchUser({
  searchText,
  searchedUsers,
  isSearching,
  isSearchError,
  userResult,
  handleChangeText,
  handleGetMemberSchedule,
  handleReset,
}: WorktimeSearchUserProps) {
  const cleanedSearchText = searchText.trim();

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-row items-center gap-6">
        <div className="relative flex h-12 flex-1 flex-row gap-2 rounded-lg border border-[#DDD9D9] bg-white px-4 focus-within:border-[#2874F0]">
          <input
            aria-label="근로자 이름 검색"
            className="w-full border-none bg-transparent outline-none focus:border-none focus:ring-0 focus:outline-none"
            value={searchText}
            onChange={handleChangeText}
            placeholder="이름을 검색하세요."
          />
          <Image src={icSearch} alt="검색" aria-hidden="true" />
          {cleanedSearchText.length !== 0 && (
            <div className="absolute top-13 left-0 z-10 flex w-full flex-col rounded-lg bg-white shadow-[0_8px_24px_rgba(5,43,87,0.12)]">
              {isSearching || isSearchError || searchedUsers.length === 0 ? (
                <div className="flex h-25 items-center justify-center rounded-lg bg-white">
                  <span className="text-sm text-[#8A949E]">
                    {isSearching
                      ? "검색 중입니다."
                      : isSearchError
                        ? "검색에 실패했습니다."
                        : "검색결과가 없습니다."}
                  </span>
                </div>
              ) : (
                searchedUsers.map((user, index) => {
                  const detail = formatAdminUserDetail(user);

                  return (
                    <button
                      key={user.userId}
                      type="button"
                      className={cn(
                        "flex flex-col bg-white px-4 py-2 text-start hover:bg-[#E9F2FF] hover:text-[#2D81FF]",
                        index === 0 && "rounded-t-lg",
                        index === searchedUsers.length - 1 && "rounded-b-lg",
                      )}
                      onClick={() => handleGetMemberSchedule(user.userName)}
                    >
                      <span className="font-medium">{user.userName}</span>
                      {detail && (
                        <span className="text-sm text-[#8A949E]">{detail}</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
        <button
          className="h-12 cursor-pointer rounded-lg bg-[#256EF4] px-4 text-base text-white"
          type="button"
          onClick={handleReset}
        >
          초기화
        </button>
      </div>
      <div className="flex h-12 w-full items-center rounded-lg border border-[#DDE3EF] bg-white px-4">
        <div className="flex flex-row items-center gap-2 text-sm text-[#8892A6]">
          {userResult !== "" ? (
            <>
              <span className="font-semibold">지금 보고 있는 시간표</span>
              <span>・</span>
              <span className="font-semibold text-[#1A2236]">{userResult}</span>
            </>
          ) : (
            <span>
              근로자를 검색하거나 오른쪽 수정요청 카드를 선택하면 해당 시간표가
              표시됩니다.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
