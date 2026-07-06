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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const isFirstDate = currentIndex === 0;
  const isLastDate = currentIndex === dateLabels.length - 1;

  return (
    <div className="flex h-14 items-center justify-center gap-3 min-[1728px]:gap-7.5">
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-default"
        aria-label="이전 날짜"
        disabled={isFirstDate}
        onClick={() => setCurrentIndex((index) => index - 1)}
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
        {dateLabels[currentIndex]}
      </p>
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-default"
        aria-label="다음 날짜"
        disabled={isLastDate}
        onClick={() => setCurrentIndex((index) => index + 1)}
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
