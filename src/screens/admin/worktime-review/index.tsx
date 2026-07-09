"use client";

import { useState } from "react";
import Image from "next/image";

import { EditRequestList, EditRequestStatus } from "@/features/admin/worktime";
import icRightButton from "@/assets/icons/common/ic_right_button.svg";

export default function WorktimeReviewScreen() {
  const date = new Date();
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedYear((prev) => prev - 1);
      setSelectedMonth(12);
      return;
    }
    setSelectedMonth((prev) => prev - 1);
  };
  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedYear((prev) => prev + 1);
      setSelectedMonth(1);
      return;
    }
    setSelectedMonth((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 px-12">
      <div className="flex w-full flex-row items-center justify-center gap-25">
        <button
          className="flex cursor-pointer items-center justify-center rounded-full"
          type="button"
          onClick={handlePrevMonth}
        >
          <Image
            className="h-9 w-9 rotate-180"
            src={icRightButton}
            alt="이전주차"
          />
        </button>
        <h2 className="text-4xl font-bold">
          {selectedYear}년 {selectedMonth}월
        </h2>
        <button
          className="flex cursor-pointer items-center justify-center rounded-full"
          type="button"
          onClick={handleNextMonth}
        >
          <Image className="h-9 w-9" src={icRightButton} alt="다음주차" />
        </button>
      </div>
      <EditRequestStatus year={selectedYear} month={selectedMonth} />
      <EditRequestList year={selectedYear} month={selectedMonth} />
    </div>
  );
}
