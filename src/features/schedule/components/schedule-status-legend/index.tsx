import Image from "next/image";

import { cn } from "@/lib/utils";
import informIcon from "@/assets/icons/common/ic_inform_blue.svg";

import { SLOT_STATUS_CLASS_NAME } from "../../constants";

interface ScheduleStatusLegendProps {
  isApply?: boolean;
  minSessionHours: number;
  weeklyMaxHours: number;
  monthlyTargetHours: number;
}

export default function ScheduleStatusLegend({
  isApply = false,
  minSessionHours,
  weeklyMaxHours,
  monthlyTargetHours,
}: ScheduleStatusLegendProps) {
  return (
    <section className="flex w-full flex-col items-start gap-2 rounded-[10px] bg-[#DBEAFE] px-4 py-2.5">
      <div className="flex flex-row items-center gap-1.75">
        <Image
          className="pt-px pr-px"
          src={informIcon}
          alt="inform"
          aria-hidden="true"
        />
        <span className="text-[11px] leading-3 text-[#1A2236]">{`1회 최소 ${minSessionHours}시간 · 주 최대 ${weeklyMaxHours}시간 · 월 목표 ${monthlyTargetHours}시간`}</span>
      </div>

      <div className="flex flex-row flex-wrap items-center gap-2.5 pl-5">
        <div className="flex flex-row items-center gap-0.75">
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              SLOT_STATUS_CLASS_NAME.EMPTY,
            )}
          />
          <span className="text-[10px] text-[#1A2236]">신청 가능</span>
        </div>
        <div className="flex flex-row items-center gap-0.75">
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              SLOT_STATUS_CLASS_NAME.UNAVAILABLE,
            )}
          />
          <span className="text-[10px] text-[#1A2236]">신청 불가</span>
        </div>
        {!isApply && (
          <>
            <div className="flex flex-row items-center gap-0.75">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  SLOT_STATUS_CLASS_NAME.PENDING_ADD,
                )}
              />
              <span className="text-[10px] text-[#1A2236]">추가 예정</span>
            </div>
            <div className="flex flex-row items-center gap-0.75">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  SLOT_STATUS_CLASS_NAME.PENDING_DELETE,
                )}
              />
              <span className="text-[10px] text-[#1A2236]">삭제 예정</span>
            </div>
          </>
        )}

        <div className="flex flex-row items-center gap-0.75">
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              SLOT_STATUS_CLASS_NAME.MY_SCHEDULE,
            )}
          />
          <span className="text-[10px] text-[#1A2236]">신청 완료</span>
        </div>
      </div>
    </section>
  );
}
