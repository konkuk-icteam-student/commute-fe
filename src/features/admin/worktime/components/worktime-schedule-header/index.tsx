import { ChangeEvent, KeyboardEvent } from "react";
import Image from "next/image";

import icRightButton from "@/assets/icons/common/ic_right_button.svg";
import icSearch from "@/assets/icons/common/ic_search.svg";

interface WorktimeScheduleHeaderProps {
  year: number;
  month: number;
  week: number;
  searchText: string;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
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
  handleSearch,
  handleReset,
}: WorktimeScheduleHeaderProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;

    e.preventDefault();
    handleSearch();
  };

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
        <div className="flex w-fit flex-row gap-2 rounded-lg border border-[#DDD9D9] bg-white px-4 py-2.5 focus-within:border-[#2874F0]">
          <input
            className="border-none bg-transparent outline-none focus:border-none focus:ring-0 focus:outline-none"
            value={searchText}
            onChange={handleChangeText}
            placeholder="이름을 검색하세요."
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="cursor-pointer"
            onClick={handleSearch}
            aria-label="검색"
          >
            <Image src={icSearch} alt="" aria-hidden="true" />
          </button>
        </div>
        <button
          className="cursor-pointer rounded-md bg-[#256EF4] px-4 py-2 text-base text-white"
          type="button"
          onClick={handleReset}
        >
          초기화
        </button>
      </div>
    </header>
  );
}
