import Image from "next/image";

import { ScheduleApplyPayload, ScheduleSlotTime } from "../../types";
import { getSlotTimesTotalHours } from "../../utils";

import addTimeIcon from "@/assets/icons/common/ic_add_time.svg";
import deleteTimeIcon from "@/assets/icons/common/ic_delete_time.svg";

interface ScheduleChangeListProps {
  isAdd?: boolean;
  changeItems: ScheduleSlotTime[];
}

const formatRequestSlotLabel = (
  slot: ScheduleApplyPayload["deleteSlots"][number],
) => {
  const [, month, day] = slot.date.split("-").map(Number);

  return `${month}월 ${day}일 ${slot.start}-${slot.end} (${getSlotTimesTotalHours([slot])}h)`;
};

export default function ScheduleChangeList({
  isAdd = true,
  changeItems,
}: ScheduleChangeListProps) {
  return (
    changeItems.length > 0 && (
      <div className="flex max-h-21 flex-col gap-1.5 overflow-scroll px-3">
        {changeItems.map((item) => (
          <div
            key={`${item.date}-${item.start}-${item.end}`}
            className="flex flex-row items-center gap-1.5"
          >
            <Image
              alt={isAdd ? "추가" : "삭제"}
              src={isAdd ? addTimeIcon : deleteTimeIcon}
            />
            <span className="text-xs text-[#09121C]">
              {formatRequestSlotLabel(item)}
            </span>
          </div>
        ))}
      </div>
    )
  );
}
