import Image from "next/image";

import { Toggle } from "@/components/ui";
import icRight from "@/assets/icons/common/ic_right.svg";

interface ScheduleTableHeaderProps {
  week: number;
  isChecked: boolean;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  onCheckedChange: (checked: boolean) => void;
}

export default function ScheduleTableHeader({
  week,
  isChecked,
  handlePrevWeek,
  handleNextWeek,
  onCheckedChange,
}: ScheduleTableHeaderProps) {
  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex-1" />
      <div className="flex flex-row items-center gap-2">
        <button
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-[#DDE3EF]"
          type="button"
          onClick={handlePrevWeek}
        >
          <Image className="rotate-180" src={icRight} alt="이전주차" />
        </button>
        <span className="text-sm font-bold text-[#1A2236]">{week}주차</span>
        <button
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-[#DDE3EF]"
          type="button"
          onClick={handleNextWeek}
        >
          <Image src={icRight} alt="다음주차" />
        </button>
      </div>
      <div className="flex flex-1 justify-end">
        <Toggle
          checked={isChecked}
          onCheckedChange={onCheckedChange}
          label="자세히"
        />
      </div>
    </header>
  );
}
