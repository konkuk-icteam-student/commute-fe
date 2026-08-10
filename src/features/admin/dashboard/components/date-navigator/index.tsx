"use client";

import Image from "next/image";
import { useState } from "react";

import chevronRightCircleIcon from "@/assets/icons/admin-common/ic_chevron_right_circle.svg";
import chevronRightCircleDisabledIcon from "@/assets/icons/admin-common/ic_chevron_right_circle_disabled.svg";

export default function DateNavigator({
  dateLabels,
  initialIndex = 0,
  selectedIndex,
  onChange,
}: {
  dateLabels: string[];
  initialIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
}) {
  return (
    <DateNavigatorContent
      key={`${initialIndex}-${dateLabels.length}`}
      dateLabels={dateLabels}
      initialIndex={initialIndex}
      selectedIndex={selectedIndex}
      onChange={onChange}
    />
  );
}

function DateNavigatorContent({
  dateLabels,
  initialIndex,
  selectedIndex,
  onChange,
}: {
  dateLabels: string[];
  initialIndex: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
}) {
  const [selectedIndexState, setSelectedIndexState] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(dateLabels.length - 1, 0)),
  );
  const hasDates = dateLabels.length > 0;
  const activeIndex = selectedIndex ?? selectedIndexState;
  const currentIndex = Math.min(
    Math.max(activeIndex, 0),
    Math.max(dateLabels.length - 1, 0),
  );
  const isFirstDate = !hasDates || currentIndex === 0;
  const isLastDate = !hasDates || currentIndex === dateLabels.length - 1;

  return (
    <div className="flex h-14 items-center justify-center gap-7.5">
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-default"
        aria-label="이전 날짜"
        disabled={isFirstDate}
        onClick={() => {
          const nextIndex = currentIndex - 1;
          setSelectedIndexState(nextIndex);
          onChange?.(nextIndex);
        }}
      >
        <Image
          src={
            isFirstDate
              ? chevronRightCircleDisabledIcon
              : chevronRightCircleIcon
          }
          alt=""
          width={37}
          height={37}
          className="rotate-180"
        />
      </button>
      <p className="mt-1 flex h-14 items-center text-[40px] font-bold text-[#17191A]">
        {hasDates ? dateLabels[currentIndex] : "표시할 날짜가 없습니다"}
      </p>
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-default"
        aria-label="다음 날짜"
        disabled={isLastDate}
        onClick={() => {
          const nextIndex = currentIndex + 1;
          setSelectedIndexState(nextIndex);
          onChange?.(nextIndex);
        }}
      >
        <Image
          src={
            isLastDate ? chevronRightCircleDisabledIcon : chevronRightCircleIcon
          }
          alt=""
          width={37}
          height={37}
        />
      </button>
    </div>
  );
}
