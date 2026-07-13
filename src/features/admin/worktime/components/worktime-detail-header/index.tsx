import Image from "next/image";

import icRightButton from "@/assets/icons/common/ic_right_button.svg";
import informIcon from "@/assets/icons/common/ic_inform_blue.svg";

interface WorktimeDetailHeaderProps {
  year: number;
  month: number;
  week: number;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

export default function WorktimeDetailHeader({
  year,
  month,
  week,
  handlePrevWeek,
  handleNextWeek,
}: WorktimeDetailHeaderProps) {
  return (
    <header className="flex flex-row items-center">
      <div className="flex-1" />
      <div className="flex w-full flex-1 flex-row items-center justify-center gap-6">
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
      <div className="flex flex-1 justify-end">
        <div className="flex flex-row items-center gap-2 rounded-xl bg-[#DBEAFE] p-4 text-[#1A2236]">
          <Image src={informIcon} alt="설명" />
          <span className="text-xs">
            최대인원 등 설정기준과 관계없이 편집할 수 있습니다.
          </span>
        </div>
      </div>
    </header>
  );
}
