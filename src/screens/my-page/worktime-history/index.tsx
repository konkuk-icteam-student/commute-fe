"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import leftIcon from "@/assets/icons/common/ic_left.svg";
import {
  WORKTIME_HISTORY_RESPONSES,
  formatWorktimeHistoryPeriod,
  WorktimeHistoryList,
  WorktimeHistorySummaryCard,
} from "@/features/my-page";

export default function WorktimeHistoryScreen() {
  const router = useRouter();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1);
  const selectedHistory = WORKTIME_HISTORY_RESPONSES[selectedMonthIndex].details;
  const isPrevDisabled = selectedMonthIndex === 0;
  const isNextDisabled =
    selectedMonthIndex === WORKTIME_HISTORY_RESPONSES.length - 1;

  const handlePrevMonth = () => {
    setSelectedMonthIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  };

  const handleNextMonth = () => {
    setSelectedMonthIndex((currentIndex) =>
      Math.min(currentIndex + 1, WORKTIME_HISTORY_RESPONSES.length - 1),
    );
  };

  return (
    <section className="flex min-h-screen w-full flex-col bg-white px-3 pt-5.25 pb-28">
      <header className="flex items-center gap-1.5">
        <button
          className="flex h-7 w-7 cursor-pointer items-center justify-center"
          type="button"
          aria-label="이전 페이지"
          onClick={() => router.back()}
        >
          <Image
            alt=""
            aria-hidden="true"
            height={20}
            src={leftIcon}
            unoptimized
            width={20}
          />
        </button>
        <h1 className="text-[20px] leading-[19.5px] font-bold text-[#1A2236]">
          근무시간 신청기록
        </h1>
      </header>

      <div className="mx-1 mt-8.75">
        <WorktimeHistorySummaryCard
          year={selectedHistory.year}
          month={selectedHistory.month}
          summary={selectedHistory.summary}
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      <div className="mt-14 flex flex-1 flex-col">
        <WorktimeHistoryList
          period={formatWorktimeHistoryPeriod(
            selectedHistory.year,
            selectedHistory.month,
          )}
          histories={selectedHistory.histories}
        />
      </div>
    </section>
  );
}
