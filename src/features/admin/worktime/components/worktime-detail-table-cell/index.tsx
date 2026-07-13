import { cn } from "@/lib/utils";

import type { WorktimeDetailTableCellType } from "../../types";

interface WorktimeDetailTableCellProps {
  slot: WorktimeDetailTableCellType;
  maxConcurrentWorkers: number;
}

export default function WorktimeDetailTableCell({
  slot,
  maxConcurrentWorkers,
}: WorktimeDetailTableCellProps) {
  const isFull = slot.currentCount >= maxConcurrentWorkers;
  return slot.isUnavailable ? (
    <div className="min-h-28 rounded-xl bg-[#F2F2F7]" />
  ) : (
    <div
      className={cn(
        "flex min-h-25 flex-col gap-1.5 rounded-xl border p-2.5",
        isFull
          ? "border-[rgba(255,59,48,0.30)] bg-[#FFF2F2]"
          : "border-[#E5E5EA]",
      )}
    >
      <div
        className={cn(
          "flex flex-row items-center justify-between font-bold",
          isFull ? "text-[#FF3B30]" : "text-[#8E8E93]",
        )}
      >
        <span>배치인원</span>
        <span>
          {slot.currentCount}/{maxConcurrentWorkers}
        </span>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-1.5">
        {slot.users.map((user) => (
          <div
            key={user.userId}
            className="rounded-md border border-[rgba(45,129,255,0.08)] bg-[#E9F2FF] px-1.5 py-0.5"
          >
            <span className="font-bold whitespace-nowrap text-[#2D81FF]">
              {user.userName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
