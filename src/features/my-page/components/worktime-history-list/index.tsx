import Image from "next/image";

import minusFilledIcon from "@/assets/icons/common/ic_minus_filled.svg";
import plusFilledIcon from "@/assets/icons/common/ic_plus_filled.svg";
import { formatScheduleChangeHistorySlot } from "@/features/schedule/utils";
import type { WorktimeHistoryItem } from "@/features/my-page/types";
import {
  formatWorktimeHistoryProcessedAt,
  formatWorktimeHistoryRequestedAt,
} from "@/features/my-page/utils";

interface WorktimeHistoryListProps {
  period: string;
  histories: WorktimeHistoryItem[];
}

const statusClassNames = {
  CS01: "bg-[#FFF4D7] text-[#B88A42]",
  CS02: "bg-[#DBEAFE] text-[#2563EB]",
  CS03: "bg-[#FFE4E4] text-[#C44B5F]",
} as const;

const changeTypeIcons = {
  CR01: plusFilledIcon,
  CR02: minusFilledIcon,
} as const;

const getHistorySlots = (history: WorktimeHistoryItem) => [
  ...history.deleteSlots,
  ...history.addSlots,
];

export default function WorktimeHistoryList({
  period,
  histories,
}: WorktimeHistoryListProps) {
  const hasHistories = histories.length > 0;

  return (
    <section className="flex flex-1 flex-col">
      <p className="pr-2 text-right text-[10px] leading-4.5 font-bold text-[#8892A6]">
        {period}
      </p>

      {hasHistories ? (
        <div className="mt-2 flex flex-col gap-4">
          {histories.map((history) => (
            <article
              className="rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white px-3.75 py-2.75 shadow-[0_2px_8px_0_#F3F2F2]"
              key={history.requestId}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`flex h-4.75 min-w-10.25 items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-bold ${statusClassNames[history.statusCode]}`}
                >
                  {history.statusName}
                </span>
                {history.processedAt ? (
                  <span className="text-[9px] leading-4.5 font-bold text-[#8892A6]">
                    {formatWorktimeHistoryProcessedAt(history.processedAt)}
                  </span>
                ) : null}
              </div>

              <ul className="mt-3 flex flex-col gap-1">
                {getHistorySlots(history).map((change, changeIndex) => (
                  <li
                    className="flex items-center gap-1.5 text-[10px] leading-4.5 font-medium text-[#1A2236]"
                    key={`${change.changeTypeCode}-${change.start}-${change.end}-${changeIndex}`}
                  >
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="shrink-0"
                      height={5}
                      src={changeTypeIcons[change.changeTypeCode]}
                      unoptimized
                      width={5}
                    />
                    <span>{formatScheduleChangeHistorySlot(change)}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-2 text-[8px] leading-2.5 font-medium text-[#8892A6]">
                {formatWorktimeHistoryRequestedAt(history.requestedAt)}
              </p>
            </article>
          ))}
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
