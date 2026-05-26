import Image from "next/image";

import { Toggle } from "@/components/ui";
import icRightButton from "@/assets/icons/common/ic_right_button.svg";
import { cn } from "@/lib/utils";
import icScheduleRefresh from "@/assets/icons/common/ic_schedule_refresh.svg";

interface ScheduleTableHeaderProps {
  isView: boolean;
  week: number;
  isChecked: boolean;
  isPrevWeekDisabled?: boolean;
  isNextWeekDisabled?: boolean;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  onCheckedChange: (checked: boolean) => void;
}

export default function ScheduleTableHeader({
  isView,
  week,
  isChecked,
  isPrevWeekDisabled = false,
  isNextWeekDisabled = false,
  handlePrevWeek,
  handleNextWeek,
  onCheckedChange,
}: ScheduleTableHeaderProps) {
  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex-1" />
      <div className="flex flex-row items-center gap-2">
        <button
          className={cn(
            "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full",
            isPrevWeekDisabled && "cursor-not-allowed opacity-35",
          )}
          type="button"
          disabled={isPrevWeekDisabled}
          onClick={handlePrevWeek}
        >
          <Image className="rotate-180" src={icRightButton} alt="이전주차" />
        </button>
        <span className="text-sm font-bold text-[#1A2236]">{week}주차</span>
        <button
          className={cn(
            "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full",
            isNextWeekDisabled && "cursor-not-allowed opacity-35",
          )}
          type="button"
          disabled={isNextWeekDisabled}
          onClick={handleNextWeek}
        >
          <Image src={icRightButton} alt="다음주차" />
        </button>
      </div>
      {isView ? (
        <div className="flex flex-1 justify-end">
          <Toggle
            checked={isChecked}
            onCheckedChange={onCheckedChange}
            label="자세히"
          />
        </div>
      ) : (
        <div className="flex flex-1 justify-end">
          <button
            className="mr-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#DDE3EF]"
            type="button"
          >
            <Image src={icScheduleRefresh} alt="새로고침" />
          </button>
        </div>
      )}
    </header>
  );
}
