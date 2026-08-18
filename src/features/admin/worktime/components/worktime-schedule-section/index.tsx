"use client";

import Link from "next/link";
import { ChangeEvent } from "react";

import type { AdminSearchedUser } from "@/apis/admin/users";
import type { WeekDay } from "@/features/schedule";

import WorktimeScheduleTable from "../worktime-schedule-table";
import WorktimeScheduleHeader from "../worktime-schedule-header";
import WorktimeSearchUser from "../worktime-search-user";

interface WorktimeScheduleSectionProps {
  year: number;
  month: number;
  week: number;
  days: WeekDay[];
  maxConcurrentWorkers: number;
  isLoading: boolean;
  searchText: string;
  searchedUsers: AdminSearchedUser[];
  isSearching: boolean;
  isSearchError: boolean;
  userResult: string;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
  handleGetMemberSchedule: (user: AdminSearchedUser) => void;
  handleReset: () => void;
  handleRefresh: () => void;
}

export default function WorktimeScheduleSection({
  year,
  month,
  week,
  days,
  maxConcurrentWorkers,
  isLoading,
  searchText,
  searchedUsers,
  isSearching,
  isSearchError,
  userResult,
  handlePrevWeek,
  handleNextWeek,
  handleChangeText,
  handleGetMemberSchedule,
  handleReset,
  handleRefresh,
}: WorktimeScheduleSectionProps) {
  return (
    <div className="flex w-full max-w-160 flex-col gap-8 rounded-xl bg-[#F4F5F6] p-6">
      <WorktimeSearchUser
        searchText={searchText}
        searchedUsers={searchedUsers}
        isSearching={isSearching}
        isSearchError={isSearchError}
        userResult={userResult}
        handleChangeText={handleChangeText}
        handleGetMemberSchedule={handleGetMemberSchedule}
        handleReset={handleReset}
      />
      <div className="flex flex-col gap-3">
        <WorktimeScheduleHeader
          year={year}
          month={month}
          week={week}
          handlePrevWeek={handlePrevWeek}
          handleNextWeek={handleNextWeek}
          handleRefresh={handleRefresh}
        />
        <WorktimeScheduleTable
          days={days}
          maxConcurrentWorkers={maxConcurrentWorkers}
          isLoading={isLoading}
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
