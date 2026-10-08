import Image from "next/image";

import icRightButton from "@/assets/icons/common/ic_right_button.svg";
import informIcon from "@/assets/icons/common/ic_inform_blue.svg";

interface WorktimeDetailHeaderProps {
  year: number;
  month: number;
  week: number;
  isEditMode: boolean;
  isEditAvailable: boolean;
  isPrevWeekDisabled: boolean;
  isNextWeekDisabled: boolean;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleChangeEditMode: () => void;
}

export default function WorktimeDetailHeader({
  year,
  month,
  week,
  isEditMode,
  isEditAvailable,
  isPrevWeekDisabled,
  isNextWeekDisabled,
  handlePrevWeek,
  handleNextWeek,
  handleChangeEditMode,
}: WorktimeDetailHeaderProps) {
  return (
    <header className="flex flex-row items-center gap-2">
      <div className="flex flex-1">
        {isEditMode && (
          <div className="ml-6 flex flex-row items-center gap-1.5 rounded-lg bg-[#DBEAFE] p-3 text-[#1A2236]">
            <Image className="h-4 w-4" src={informIcon} alt="설명" />
            <span className="text-[11px]">
              최대인원 등 설정기준과 관계없이 편집할 수 있습니다.
            </span>
          </div>
        )}
      </div>

      <div className="flex w-full flex-1 flex-row items-center justify-center gap-4">
        <button
          className="flex cursor-pointer items-center justify-center rounded-full disabled:cursor-default disabled:opacity-40"
          type="button"
          disabled={isPrevWeekDisabled}
          onClick={handlePrevWeek}
        >
          <Image
            className="h-8 w-8 rotate-180"
            src={icRightButton}
            alt="이전주차"
          />
        </button>
        <h2 className="text-xl font-bold">
          {year}년 {month}월 {week}주차
        </h2>
        <button
          className="flex cursor-pointer items-center justify-center rounded-full disabled:cursor-default disabled:opacity-40"
          type="button"
          disabled={isNextWeekDisabled}
          onClick={handleNextWeek}
        >
          <Image className="h-8 w-8" src={icRightButton} alt="다음주차" />
        </button>
      </div>
      <div className="flex flex-1 justify-end">
        {isEditMode ? (
          <button
            type="button"
            className="w-32 cursor-pointer rounded-md border border-[#8E8E93] py-1.5 font-semibold"
            onClick={handleChangeEditMode}
          >
            조회하기
          </button>
        ) : (
          <button
            type="button"
            className="w-32 cursor-pointer rounded-md bg-[#2D81FF] py-1.5 font-semibold text-white disabled:cursor-default disabled:bg-[#BFC7D4]"
            disabled={!isEditAvailable}
            onClick={handleChangeEditMode}
          >
            편집하기
          </button>
        )}
      </div>
    </header>
  );
}
