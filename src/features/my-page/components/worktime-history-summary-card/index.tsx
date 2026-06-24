import Image from "next/image";

import rightButtonIcon from "@/assets/icons/common/ic_right_button.svg";

interface WorktimeHistorySummaryCardProps {
  year: number;
  month: number;
  totalCount: number;
  statuses: ReadonlyArray<{
    label: string;
    count: number;
    status: "approved" | "pending" | "rejected";
  }>;
}

const summaryStatusClassNames = {
  approved: "bg-[#EBF4FF] text-[#2563EB]",
  pending: "bg-[#FFF8E8] text-[#1A2236]",
  rejected: "bg-[#FFE3E3] text-[#D94B62]",
} as const;

export default function WorktimeHistorySummaryCard({
  year,
  month,
  totalCount,
  statuses,
}: WorktimeHistorySummaryCardProps) {
  return (
    <section>
      <div className="flex items-center justify-center gap-5">
        <button
          className="flex h-[21px] w-[21px] cursor-pointer items-center justify-center"
          type="button"
          aria-label="이전 달"
        >
          <Image
            alt=""
            aria-hidden="true"
            className="rotate-180"
            height={21}
            src={rightButtonIcon}
            unoptimized
            width={21}
          />
        </button>
        <h2 className="text-[20px] leading-7 font-bold text-[#1A2236]">
          {year}년 {month}월
        </h2>
        <button
          className="flex h-[21px] w-[21px] cursor-pointer items-center justify-center"
          type="button"
          aria-label="다음 달"
        >
          <Image
            alt=""
            aria-hidden="true"
            height={21}
            src={rightButtonIcon}
            unoptimized
            width={21}
          />
        </button>
      </div>

      <div className="mt-9 rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white px-6 py-6 shadow-[0_2px_8px_0_#F3F2F2]">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] leading-4.5 font-medium text-[#1A2236]">
            근무신청현황
          </h3>
          <span className="text-[12px] leading-4.5 font-bold text-[#8892A6]">
            총 신청 {totalCount}건
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {statuses.map((status) => (
            <article
              className={`flex h-[74px] flex-col items-center justify-center rounded-[12px] ${summaryStatusClassNames[status.status]}`}
              key={status.label}
            >
              <span className="text-[14px] leading-5 font-bold">
                {status.label}
              </span>
              <strong className="mt-1 text-[20px] leading-7 font-bold text-[#1A2236]">
                {status.count}건
              </strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
