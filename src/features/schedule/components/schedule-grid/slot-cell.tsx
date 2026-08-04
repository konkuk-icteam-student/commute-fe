import { cn } from "@/lib/utils";

import {
  SLOT_REQUEST_EDIT_CLASS_NAME,
  SLOT_STATUS_CLASS_NAME,
} from "../../constants/slot";
import type { ScheduleCell } from "./types";

// 요청 상태가 있으면 그 색이 원래 상태 색을 덮는다.
const getSlotClassName = ({ status, requestStatus }: ScheduleCell) =>
  requestStatus
    ? SLOT_REQUEST_EDIT_CLASS_NAME[requestStatus]
    : SLOT_STATUS_CLASS_NAME[status];

// 내 근무만 흰 글씨, 나머지는 흐린 글씨. 정책이 따로 지정하면 그것을 따른다.
const getTextClassName = ({ status, textClassName }: ScheduleCell) =>
  textClassName ?? (status === "MY_SCHEDULE" ? "text-white" : "text-[#C2C4C6]");

export default function SlotCell({ cell }: { cell: ScheduleCell }) {
  return (
    <div className="relative w-full">
      {cell.hourMark !== undefined && (
        <span className="absolute -top-1 -left-4 w-3 text-right text-[10px] text-[#6D88A5]">
          {cell.hourMark}
        </span>
      )}
      <button
        className={cn(
          "flex h-7 w-full items-center justify-center rounded-sm",
          getSlotClassName(cell),
        )}
        disabled={cell.disabled}
        onClick={cell.onClick}
        type="button"
      >
        {cell.showCount && (
          <span className={cn("text-xs", getTextClassName(cell))}>
            {cell.count}/{cell.maxCount}
          </span>
        )}
      </button>
    </div>
  );
}
