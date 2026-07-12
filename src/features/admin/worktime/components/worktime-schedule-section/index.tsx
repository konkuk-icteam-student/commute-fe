"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";

import { DUMMY_GET_SCHEDULE } from "@/features/schedule";
import { getMonthWeekOfDate, shiftDateByWeeks } from "@/lib/date-formatter";

import WorktimeScheduleTable from "../worktime-schedule-table";
import WorktimeScheduleHeader from "../worktime-schedule-header";

interface WorktimeScheduleSectionProps {
  searchText: string;
  userResult: string;
  handleChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  handleReset: () => void;
}

export default function WorktimeScheduleSection({
  searchText,
  userResult,
  handleChangeText,
  handleSearch,
  handleReset,
}: WorktimeScheduleSectionProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const { year, month, week } = getMonthWeekOfDate(selectedDate);

  const handlePrevWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, -1));
  };

  const handleNextWeek = () => {
    setSelectedDate((currentDate) => shiftDateByWeeks(currentDate, 1));
  };

  return (
    <div className="flex w-full max-w-160 flex-col gap-6 rounded-xl bg-[#F4F5F6] p-6">
      <WorktimeScheduleHeader
        year={year}
        month={month}
        week={week}
        searchText={searchText}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
        handleChangeText={handleChangeText}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />
      <div className="flex flex-col gap-3">
        {userResult !== "" && (
          <h2 className="text-lg font-bold">{userResult}님의 시간표</h2>
        )}
        <WorktimeScheduleTable
          year={year}
          month={month}
          week={week}
          scheduleData={DUMMY_GET_SCHEDULE}
        />
        <Link
          href="/admin/worktime/detail"
          className="flex w-full items-center justify-center rounded-md bg-[#2874F0] py-4 text-sm"
        >
          <span className="text-xl font-bold text-white">
            시간표 자세히 보기
          </span>
        </Link>
      </div>
    </div>
  );
}
