import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

import type { WorkTimeSlot } from "../../types";

type WorkTimeListProps = {
  workTimeSlots: WorkTimeSlot[];
};

export default function WorkTimeList({ workTimeSlots }: WorkTimeListProps) {
  return (
    <ul className="px-4 pb-4">
      {workTimeSlots.map((slot, index) => {
        const isFirstSlot = index === 0;

        return (
          <li
            className={cn(
              "grid grid-cols-[37px_1fr_28px] gap-3 border-b border-[#EEF1F6] last:border-b-0",
              isFirstSlot ? "h-9 items-start" : "min-h-11 items-center py-2",
            )}
            key={slot.time}
          >
            <time className="flex h-5.25 w-9.25 items-center justify-center text-[14px] font-medium text-black">
              {slot.time}
            </time>
            <div
              className={cn(
                "flex flex-wrap gap-1.5",
                isFirstSlot && "h-5.25 items-center",
              )}
            >
              {slot.workers.map((worker) => (
                <Badge
                  key={worker.id}
                  text={worker.name}
                  variant={worker.tone}
                />
              ))}
            </div>
            <span className="flex h-5.25 items-center justify-end text-[11px] leading-3.75 text-[#C2C4C6]">
              {slot.workers.length}명
            </span>
          </li>
        );
      })}
    </ul>
  );
}
