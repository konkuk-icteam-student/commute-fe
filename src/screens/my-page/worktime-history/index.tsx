"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import leftIcon from "@/assets/icons/common/ic_left.svg";
import {
  WORKTIME_HISTORY_ITEMS,
  WORKTIME_HISTORY_PERIOD,
  WORKTIME_HISTORY_SUMMARY,
  WorktimeHistoryList,
  WorktimeHistorySummaryCard,
} from "@/features/my-page";

export default function WorktimeHistoryScreen() {
  const router = useRouter();

  return (
    <section className="min-h-screen w-full bg-white px-3 pt-5.25 pb-28">
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
          year={WORKTIME_HISTORY_SUMMARY.year}
          month={WORKTIME_HISTORY_SUMMARY.month}
          totalCount={WORKTIME_HISTORY_SUMMARY.totalCount}
          statuses={WORKTIME_HISTORY_SUMMARY.statuses}
        />
      </div>

      <div className="mt-20">
        <WorktimeHistoryList
          period={WORKTIME_HISTORY_PERIOD}
          items={WORKTIME_HISTORY_ITEMS}
        />
      </div>
    </section>
  );
}
