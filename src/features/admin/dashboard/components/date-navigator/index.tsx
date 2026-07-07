"use client";

import Image from "next/image";
import { useState } from "react";

import chevronRightCircleIcon from "@/assets/icons/admin-common/ic_chevron_right_circle.svg";
import chevronRightCircleDisabledIcon from "@/assets/icons/admin-common/ic_chevron_right_circle_disabled.svg";

export default function DateNavigator({
  dateLabels,
  initialIndex = 0,
}: {
  dateLabels: string[];
  initialIndex?: number;
}) {
  return (
    <DateNavigatorContent
      key={`${initialIndex}-${dateLabels.join("|")}`}
      dateLabels={dateLabels}
      initialIndex={initialIndex}
    />
  );
}

function DateNavigatorContent({
  dateLabels,
  initialIndex,
}: {
  dateLabels: string[];
  initialIndex: number;
}) {
  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(dateLabels.length - 1, 0)),
  );
  const hasDates = dateLabels.length > 0;
  const currentIndex = Math.min(
    Math.max(selectedIndex, 0),
    Math.max(dateLabels.length - 1, 0),
  );
  const isFirstDate = !hasDates || currentIndex === 0;
  const isLastDate = !hasDates || currentIndex === dateLabels.length - 1;

  return (
    <div className="flex h-14 items-center justify-center gap-3 min-[1728px]:gap-7.5">
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-default"
        aria-label="이전 날짜"
        disabled={isFirstDate}
        onClick={() => setSelectedIndex(currentIndex - 1)}
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
      <p className="mt-1 flex h-14 items-center text-[32px] font-bold text-[#17191A] min-[1728px]:text-[40px]">
        {hasDates ? dateLabels[currentIndex] : "표시할 날짜가 없습니다"}
      </p>
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-default"
        aria-label="다음 날짜"
        disabled={isLastDate}
        onClick={() => setSelectedIndex(currentIndex + 1)}
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
