import { ChangeEvent } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import icRightButton from "@/assets/icons/common/ic_right_button.svg";
import icSearch from "@/assets/icons/common/ic_search.svg";

import { DUMMY_WORKTIME_SEARCH_RESULT } from "../../constants/dummy";

interface WorktimeScheduleHeaderProps {
  year: number;
  month: number;
  week: number;
  searchText: string;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
  handleGetMemberSchedule: (name: string) => void;
  handleReset: () => void;
}

export default function WorktimeScheduleHeader({
  year,
  month,
  week,
  searchText,
  handlePrevWeek,
  handleNextWeek,
  handleChangeText,
  handleGetMemberSchedule,
  handleReset,
}: WorktimeScheduleHeaderProps) {
  const cleanedSearchText = searchText.trim();

  return (
    <header className="flex flex-col gap-3">
      <div className="flex w-full flex-row items-center justify-center gap-6">
        <button
          className="flex cursor-pointer items-center justify-center rounded-full"
          type="button"
          onClick={handlePrevWeek}
        >
          <Image
            className="h-9 w-9 rotate-180"
            src={icRightButton}
            alt="이전주차"
          />
        </button>
        <h2 className="text-2xl font-bold">
          {year}년 {month}월 {week}주차
        </h2>
        <button
          className="flex cursor-pointer items-center justify-center rounded-full"
          type="button"
          onClick={handleNextWeek}
        >
          <Image className="h-9 w-9" src={icRightButton} alt="다음주차" />
        </button>
      </div>
      <div className="flex flex-row items-center gap-6">
        <div className="relative flex w-fit flex-row gap-2 rounded-lg border border-[#DDD9D9] bg-white px-4 py-2.5 focus-within:border-[#2874F0]">
          <input
            className="w-100 border-none bg-transparent outline-none focus:border-none focus:ring-0 focus:outline-none"
            value={searchText}
            onChange={handleChangeText}
            placeholder="이름을 검색하세요."
          />
          <Image src={icSearch} alt="검색" aria-hidden="true" />
          {cleanedSearchText.length !== 0 && (
            <div className="absolute top-13 left-0 z-10 flex w-full flex-col rounded-lg bg-white shadow-[0_8px_24px_rgba(5,43,87,0.12)]">
              {DUMMY_WORKTIME_SEARCH_RESULT.length === 0 ? (
                <div className="flex h-25 items-center justify-center rounded-lg bg-white">
                  <span className="text-sm text-[#8A949E]">
                    검색결과가 없습니다.
                  </span>
                </div>
              ) : (
                DUMMY_WORKTIME_SEARCH_RESULT.map((member, index) => (
                  <button
                    key={member.userId}
                    type="button"
                    className={cn(
                      "flex flex-col bg-white px-4 py-2 text-start hover:bg-[#E9F2FF] hover:text-[#2D81FF]",
                      index === 0 && "rounded-t-lg",
                      index === DUMMY_WORKTIME_SEARCH_RESULT.length - 1 &&
                        "rounded-b-lg",
                    )}
                    onClick={() => handleGetMemberSchedule(member.name)}
                  >
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm text-[#8A949E]">
                      {member.department} | {member.studentNumber}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <button
          className="cursor-pointer rounded-lg bg-[#256EF4] px-4 py-2 text-base text-white"
          type="button"
          onClick={handleReset}
        >
          초기화
        </button>
      </div>
    </header>
  );
}
