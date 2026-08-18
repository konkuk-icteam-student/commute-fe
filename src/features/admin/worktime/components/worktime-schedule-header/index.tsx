import Image from "next/image";

import icRightButton from "@/assets/icons/common/ic_right_button.svg";

interface WorktimeScheduleHeaderProps {
  year: number;
  month: number;
  week: number;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

export default function WorktimeScheduleHeader({
  year,
  month,
  week,
  handlePrevWeek,
  handleNextWeek,
}: WorktimeScheduleHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex w-full flex-row items-center justify-center gap-6">
        <button
          className="flex cursor-pointer items-center justify-center rounded-full"
          type="button"
          onClick={handlePrevWeek}
        >
          <Image
            className="h-9 w-9 rotate-180"
            src={icRightButton}
            alt="이전주차"
          />
        </button>
        <h2 className="text-2xl font-bold">
          {year}년 {month}월 {week}주차
        </h2>
        <button
          className="flex cursor-pointer items-center justify-center rounded-full"
          type="button"
          onClick={handleNextWeek}
        >
          <Image className="h-9 w-9" src={icRightButton} alt="다음주차" />
        </button>
      </div>
    </header>
  );
}
