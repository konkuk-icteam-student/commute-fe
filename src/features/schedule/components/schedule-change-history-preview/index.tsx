import Image from "next/image";

import chevronRightIcon from "@/assets/icons/common/ic_chevron-right.svg";
import plusIcon from "@/assets/icons/common/ic_plus_filled.svg";
import minusIcon from "@/assets/icons/common/ic_minus_filled.svg";

import type {
  ScheduleChangeHistorySlot,
  ScheduleChangeHistoryType,
} from "../../types";
import { formatScheduleChangeHistorySlot } from "../../utils";

interface ScheduleChangeHistoryPreviewProps {
  histories: ScheduleChangeHistoryType[];
}

interface ScheduleChangeHistorySlotRowProps {
  alt: string;
  icon: typeof minusIcon;
  slot: ScheduleChangeHistorySlot;
}

function ScheduleChangeHistorySlotRow({
  alt,
  icon,
  slot,
}: ScheduleChangeHistorySlotRowProps) {
  return (
    <div className="flex items-center gap-1">
      <Image alt={alt} src={icon} />
      <span className="text-[11px] leading-3 text-[#09121C]">
        {formatScheduleChangeHistorySlot(slot)}
      </span>
    </div>
  );
}

export default function ScheduleChangeHistoryPreview({
  histories,
}: ScheduleChangeHistoryPreviewProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-[#DDE3EF] p-3">
      <div className="flex flex-row items-center justify-between">
        <span className="text-xs leading-4.5 font-medium text-[#1A2236]">
          처리 내역
        </span>
        <button
          type="button"
          onClick={() => console.log("처리내역 자세히 보기")}
        >
          <Image alt="처리내역 자세히보기" src={chevronRightIcon} />
        </button>
      </div>
      {histories.map((history, index) => (
        <div key={history.requestId} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {history.deleteSlots.map((slot) => (
              <ScheduleChangeHistorySlotRow
                key={`delete-${slot.start}-${slot.end}`}
                alt="삭제"
                icon={minusIcon}
                slot={slot}
              />
            ))}
            {history.addSlots.map((slot) => (
              <ScheduleChangeHistorySlotRow
                key={`add-${slot.start}-${slot.end}`}
                alt="추가"
                icon={plusIcon}
                slot={slot}
              />
            ))}
          </div>
          {index !== histories.length - 1 && (
            <div className="h-px w-full bg-[#EFEFEF]" />
          )}
        </div>
      ))}
    </section>
  );
}
