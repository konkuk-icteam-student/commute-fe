import type { ReactNode } from "react";
import Image from "next/image";

import icRightButton from "@/assets/icons/common/ic_right_button.svg";
import { cn } from "@/lib/utils";

interface ScheduleWeekNavProps {
  week: number;
  isPrevWeekDisabled?: boolean;
  isNextWeekDisabled?: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  // 왼쪽 끝에 놓을 것. 조회 화면의 '자세히' 토글이 여기 붙는다.
  leadingAction?: ReactNode;
  // 오른쪽 끝에 놓을 것. 세 화면 모두 새로고침 버튼이다.
  action?: ReactNode;
}

const ARROW_BUTTON_CLASS_NAME =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full";
const ARROW_DISABLED_CLASS_NAME = "cursor-not-allowed opacity-35";

// 주차 이동 헤더. 어떤 화면인지는 알지 못하고, 양쪽에 놓을 것만 받아 그린다.
export default function ScheduleWeekNav({
  week,
  isPrevWeekDisabled = false,
  isNextWeekDisabled = false,
  onPrevWeek,
  onNextWeek,
  leadingAction,
  action,
}: ScheduleWeekNavProps) {
  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex flex-1 justify-start">{leadingAction}</div>
      <div className="flex flex-row items-center gap-2">
        <button
          className={cn(
            ARROW_BUTTON_CLASS_NAME,
            isPrevWeekDisabled && ARROW_DISABLED_CLASS_NAME,
          )}
          type="button"
          disabled={isPrevWeekDisabled}
          onClick={onPrevWeek}
        >
          <Image className="rotate-180" src={icRightButton} alt="이전주차" />
        </button>
        <span className="text-sm font-bold text-[#1A2236]">{week}주차</span>
        <button
          className={cn(
            ARROW_BUTTON_CLASS_NAME,
            isNextWeekDisabled && ARROW_DISABLED_CLASS_NAME,
          )}
          type="button"
          disabled={isNextWeekDisabled}
          onClick={onNextWeek}
        >
          <Image src={icRightButton} alt="다음주차" />
        </button>
      </div>
      <div className="flex flex-1 justify-end">{action}</div>
    </header>
  );
}
