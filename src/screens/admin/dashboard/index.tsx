"use client";

import { useMemo, useState } from "react";

import {
  useGetAdminHomeAttendanceStatusQuery,
  useGetAdminHomeAttendanceSummaryQuery,
} from "@/apis/admin/home";
import { useGetAdminSystemCreatedYearQuery } from "@/apis/admin/system";
import {
  dashboardTimeRows,
  dashboardWorkRequests,
  DateNavigator,
  MemberAttendancePanel,
  SummaryPanel,
  TimeTablePanel,
  WorkRequestPanel,
  toDashboardMemberAttendanceRows,
  toDashboardSummaryItems,
} from "@/features/admin/dashboard";

const MEMBER_ATTENDANCE_PAGE_SIZE = 6;

const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"] as const;

const toDateLabel = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${
    weekdayLabels[date.getDay()]
  })`;

const getDashboardDates = (startYear: number) => {
  const today = new Date();
  const startDate = new Date(startYear, 0, 1);
  const dateCount =
    Math.floor((today.getTime() - startDate.getTime()) / 86400000) + 1;

  return Array.from({ length: Math.max(dateCount, 1) }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      label: toDateLabel(date),
      value: toDateValue(date),
    };
  });
};

const emptySummaryDetails = {
  date: "",
  currentWorkingCount: 0,
  notCheckedInCount: 0,
  lateCount: 0,
  todayTask: {
    completedCount: 0,
    totalCount: 0,
  },
};

export default function AdminDashboardScreen() {
  const { adminSystemCreatedYearData } = useGetAdminSystemCreatedYearQuery();
  const todayYear = new Date().getFullYear();
  const startYear = Math.min(
    adminSystemCreatedYearData?.createdYear ?? todayYear,
    todayYear,
  );
  const dashboardDates = useMemo(
    () => getDashboardDates(startYear),
    [startYear],
  );
  const todayDateIndex = Math.max(dashboardDates.length - 1, 0);
  const [selectedDateOffset, setSelectedDateOffset] = useState(0);
  const [memberQuery, setMemberQuery] = useState("");
  const [memberPage, setMemberPage] = useState(0);
  const selectedDateIndex = Math.min(
    Math.max(todayDateIndex + selectedDateOffset, 0),
    todayDateIndex,
  );
  const selectedDate =
    dashboardDates[selectedDateIndex]?.value ?? toDateValue(new Date());
  const trimmedMemberQuery = memberQuery.trim();

  const { adminHomeAttendanceSummaryData } =
    useGetAdminHomeAttendanceSummaryQuery({
      date: selectedDate,
    });
  const { adminHomeAttendanceStatusData } =
    useGetAdminHomeAttendanceStatusQuery({
      date: selectedDate,
      page: memberPage,
      size: MEMBER_ATTENDANCE_PAGE_SIZE,
      ...(trimmedMemberQuery ? { userName: trimmedMemberQuery } : {}),
    });

  const dashboardSummary = toDashboardSummaryItems(
    adminHomeAttendanceSummaryData ?? emptySummaryDetails,
  );
  const dashboardMemberRows = adminHomeAttendanceStatusData
    ? toDashboardMemberAttendanceRows(adminHomeAttendanceStatusData)
    : [];

  return (
    <div className="flex-1 p-8.5">
      <div className="mx-auto w-full max-w-325.75">
        <DateNavigator
          dateLabels={dashboardDates.map((date) => date.label)}
          initialIndex={todayDateIndex}
          selectedIndex={selectedDateIndex}
          onChange={(index) => {
            setSelectedDateOffset(index - todayDateIndex);
            setMemberPage(0);
          }}
        />
        <SummaryPanel items={dashboardSummary} />

        <div className="mt-13.25 grid grid-cols-[minmax(0,613px)_minmax(0,653px)] items-start gap-9.25">
          <TimeTablePanel rows={dashboardTimeRows} />
          <div className="space-y-6">
            <WorkRequestPanel requests={dashboardWorkRequests} />
            <MemberAttendancePanel
              members={dashboardMemberRows}
              page={adminHomeAttendanceStatusData?.page ?? memberPage}
              query={memberQuery}
              totalPages={adminHomeAttendanceStatusData?.totalPages ?? 1}
              onPageChange={setMemberPage}
              onQueryChange={(query) => {
                setMemberQuery(query);
                setMemberPage(0);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
