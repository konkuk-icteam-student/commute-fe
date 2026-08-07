"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useGetWorkChangeRequestHistoryQuery } from "@/apis/work-change-requests";
import leftIcon from "@/assets/icons/common/ic_left.svg";
import { Spinner } from "@/components/ui";
import {
  formatWorktimeHistoryPeriod,
  WorktimeHistoryList,
  WorktimeHistorySummaryCard,
} from "@/features/my-page";

const PAGE_SIZE = 10;

const getCurrentYearMonth = () => {
  const today = new Date();

  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  };
};

const getPrevMonth = (year: number, month: number) =>
  month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };

const getNextMonth = (year: number, month: number) =>
  month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

export default function WorktimeHistoryScreen() {
  const router = useRouter();
  const [currentYearMonth] = useState(getCurrentYearMonth);
  const [selectedYearMonth, setSelectedYearMonth] =
    useState(getCurrentYearMonth);
  const { year, month } = selectedYearMonth;
  const isNextDisabled =
    year === currentYearMonth.year && month === currentYearMonth.month;

  const {
    workChangeRequestHistoryData,
    isPendingWorkChangeRequestHistory,
    isErrorWorkChangeRequestHistory,
    workChangeRequestHistoryError,
  } = useGetWorkChangeRequestHistoryQuery({
    year,
    month,
    statusCode: "ALL",
    page: 0,
    size: PAGE_SIZE,
  });

  const handlePrevMonth = () => {
    setSelectedYearMonth(({ year, month }) => getPrevMonth(year, month));
  };

  const handleNextMonth = () => {
    setSelectedYearMonth(({ year, month }) => getNextMonth(year, month));
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
          year={workChangeRequestHistoryData?.year ?? year}
          month={workChangeRequestHistoryData?.month ?? month}
          summary={
            workChangeRequestHistoryData?.summary ?? {
              totalCount: 0,
              approvedCount: 0,
              pendingCount: 0,
              rejectedCount: 0,
            }
          }
          isNextDisabled={isNextDisabled}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      <div className="mt-14 flex flex-1 flex-col">
        {isPendingWorkChangeRequestHistory ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : isErrorWorkChangeRequestHistory ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <p className="text-[12px] leading-4.5 font-medium whitespace-pre-line text-[#8892A6]">
              {workChangeRequestHistoryError?.message ??
                "근무시간 신청 내역을 불러오지 못했습니다."}
            </p>
          </div>
        ) : (
          <WorktimeHistoryList
            period={formatWorktimeHistoryPeriod(
              workChangeRequestHistoryData?.year ?? year,
              workChangeRequestHistoryData?.month ?? month,
            )}
            histories={workChangeRequestHistoryData?.histories ?? []}
          />
        )}
      </div>
    </section>
  );
}
