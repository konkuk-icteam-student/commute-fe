import Image from "next/image";

import rightButtonIcon from "@/assets/icons/common/ic_right_button.svg";
import rightButtonDisabledIcon from "@/assets/icons/common/ic_right_button_disabled.svg";
import { StatusHistoryCard, type StatusHistoryCardTone } from "@/components/ui";
import { formatScheduleChangeHistorySlot } from "@/features/schedule/utils";
import type { WorktimeHistoryItem } from "@/features/my-page/types";
import {
  formatWorktimeHistoryProcessedAt,
  formatWorktimeHistoryRequestedAt,
} from "@/features/my-page/utils";

interface WorktimeHistoryListProps {
  period: string;
  histories: WorktimeHistoryItem[];
  page?: number;
  totalPages?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
}

const statusTone: Record<
  WorktimeHistoryItem["statusCode"],
  StatusHistoryCardTone
> = {
  CS01: "pending",
  CS02: "approved",
  CS03: "rejected",
};

const getHistorySlots = (history: WorktimeHistoryItem) => [
  ...history.deleteSlots,
  ...history.addSlots,
];

export default function WorktimeHistoryList({
  period,
  histories,
  page = 0,
  totalPages = 0,
  onPrevPage,
  onNextPage,
}: WorktimeHistoryListProps) {
  const hasHistories = histories.length > 0;
  const pageCount = Math.max(totalPages, hasHistories ? 1 : 0);
  const isPrevDisabled = page <= 0;
  const isNextDisabled = pageCount === 0 || page >= pageCount - 1;

  return (
    <section className="flex flex-1 flex-col">
      <p className="pr-2 text-right text-[10px] leading-4.5 font-bold text-[#8892A6]">
        {period}
      </p>

      {hasHistories ? (
        <div className="mt-2 flex flex-col gap-4">
          {histories.map((history) => (
            <StatusHistoryCard
              key={history.requestId}
              statusLabel={history.statusName}
              tone={statusTone[history.statusCode]}
              processedAt={
                history.processedAt
                  ? formatWorktimeHistoryProcessedAt(history.processedAt)
                  : undefined
              }
              items={getHistorySlots(history).map((change, changeIndex) => ({
                key: `${change.changeTypeCode}-${change.start}-${change.end}-${changeIndex}`,
                text: formatScheduleChangeHistorySlot(change),
                type:
                  change.changeTypeCode === "CR01"
                    ? ("add" as const)
                    : ("delete" as const),
              }))}
              reason={
                history.statusCode === "CS03" ? history.rejectReason : null
              }
              footer={formatWorktimeHistoryRequestedAt(history.requestedAt)}
              footerDateTime={history.requestedAt}
            />
          ))}
          {pageCount > 1 ? (
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center disabled:cursor-default"
                aria-label="이전 신청기록 페이지"
                disabled={isPrevDisabled}
                onClick={onPrevPage}
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  className="rotate-180"
                  height={21}
                  src={
                    isPrevDisabled ? rightButtonDisabledIcon : rightButtonIcon
                  }
                  unoptimized
                  width={21}
                />
              </button>
              <span className="text-[11px] leading-4.5 font-bold text-[#1A2236]">
                {page + 1}/{pageCount}
              </span>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center disabled:cursor-default"
                aria-label="다음 신청기록 페이지"
                disabled={isNextDisabled}
                onClick={onNextPage}
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  height={21}
                  src={
                    isNextDisabled ? rightButtonDisabledIcon : rightButtonIcon
                  }
                  unoptimized
                  width={21}
                />
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[12px] leading-4.5 font-medium text-[#8892A6]">
            조회된 근무시간 신청 내역이 없습니다.
          </p>
        </div>
      )}
    </section>
  );
}
