import Image from "next/image";

import rightButtonIcon from "@/assets/icons/common/ic_right_button.svg";
import rightButtonDisabledIcon from "@/assets/icons/common/ic_right_button_disabled.svg";
import type { ScheduleChangeHistoryStatusCode } from "@/features/schedule/types";
import type { WorktimeHistorySummary } from "@/features/my-page/types";

interface WorktimeHistorySummaryCardProps {
  year: number;
  month: number;
  summary: WorktimeHistorySummary;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

const summaryStatusClassNames = {
  CS01: "bg-[#FFF8E8] text-[#1A2236]",
  CS02: "bg-[#EBF4FF] text-[#2563EB]",
  CS03: "bg-[#FFE3E3] text-[#D94B62]",
} as const;

const getSummaryStatuses = (summary: WorktimeHistorySummary) =>
  [
    {
      label: "처리중",
      count: summary.pendingCount,
      statusCode: "CS01",
    },
    {
      label: "승인완료",
      count: summary.approvedCount,
      statusCode: "CS02",
    },
    {
      label: "반려",
      count: summary.rejectedCount,
      statusCode: "CS03",
    },
  ] satisfies ReadonlyArray<{
    label: string;
    count: number;
    statusCode: ScheduleChangeHistoryStatusCode;
  }>;

export default function WorktimeHistorySummaryCard({
  year,
  month,
  summary,
  isPrevDisabled = false,
  isNextDisabled = false,
  onPrevMonth,
  onNextMonth,
}: WorktimeHistorySummaryCardProps) {
  const statuses = getSummaryStatuses(summary);

  return (
    <section>
      <div className="flex items-center justify-center gap-4">
        <button
          className="flex h-5.25 w-5.25 cursor-pointer items-center justify-center disabled:cursor-default"
          type="button"
          aria-label="이전 달"
          disabled={isPrevDisabled}
          onClick={onPrevMonth}
        >
          <Image
            alt=""
            aria-hidden="true"
            className="rotate-180"
            height={21}
            src={isPrevDisabled ? rightButtonDisabledIcon : rightButtonIcon}
            unoptimized
            width={21}
          />
        </button>
        <h2 className="text-[14px] font-bold text-[#1A2236]">
          {year}년 {month}월
        </h2>
        <button
          className="flex h-5.25 w-5.25 cursor-pointer items-center justify-center disabled:cursor-default"
          type="button"
          aria-label="다음 달"
          disabled={isNextDisabled}
          onClick={onNextMonth}
        >
          <Image
            alt=""
            aria-hidden="true"
            height={21}
            src={isNextDisabled ? rightButtonDisabledIcon : rightButtonIcon}
            unoptimized
            width={21}
          />
        </button>
      </div>

      <div className="mt-6 rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white px-4.5 py-4 shadow-[0_2px_8px_0_#F3F2F2]">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] leading-4.5 font-medium text-[#1A2236]">
            근무신청현황
          </h3>
          <span className="text-[10px] leading-4.5 font-medium text-[#8892A6]">
            총 신청 {summary.totalCount}건
          </span>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {statuses.map((status) => (
            <article
              className={`flex h-13.75 flex-col items-center justify-center rounded-lg px-3 py-[9.5px] ${summaryStatusClassNames[status.statusCode]}`}
              key={status.label}
            >
              <span className="text-[10px] leading-4.5 font-medium">
                {status.label}
              </span>
              <strong className="flex justify-center gap-px text-[#1A2236]">
                <span className="text-[14px] leading-4.5 font-bold">
                  {status.count}
                </span>
                <span className="text-[10px] leading-4.5 font-medium">건</span>
              </strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
