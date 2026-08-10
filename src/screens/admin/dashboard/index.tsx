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
  getDashboardDates,
  toDashboardMemberAttendanceRows,
  toDashboardSummaryItems,
} from "@/features/admin/dashboard";

const MEMBER_ATTENDANCE_PAGE_SIZE = 6;

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
  const selectedDate = dashboardDates[selectedDateIndex]?.value ?? "";
  const trimmedMemberQuery = memberQuery.trim();

  const {
    adminHomeAttendanceSummaryData,
    isPendingAdminHomeAttendanceSummary,
    isErrorAdminHomeAttendanceSummary,
  } = useGetAdminHomeAttendanceSummaryQuery({
    date: selectedDate,
  });
  const {
    adminHomeAttendanceStatusData,
    isPendingAdminHomeAttendanceStatus,
    isErrorAdminHomeAttendanceStatus,
  } = useGetAdminHomeAttendanceStatusQuery({
    date: selectedDate,
    page: memberPage,
    size: MEMBER_ATTENDANCE_PAGE_SIZE,
    ...(trimmedMemberQuery ? { userName: trimmedMemberQuery } : {}),
  });

  const dashboardSummary = adminHomeAttendanceSummaryData
    ? toDashboardSummaryItems(adminHomeAttendanceSummaryData)
    : [];
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
        <SummaryPanel
          items={dashboardSummary}
          isLoading={isPendingAdminHomeAttendanceSummary}
          isError={isErrorAdminHomeAttendanceSummary}
        />

        <div className="mt-13.25 grid grid-cols-[minmax(0,613px)_minmax(0,653px)] items-start gap-9.25">
          <TimeTablePanel rows={dashboardTimeRows} />
          <div className="space-y-6">
            <WorkRequestPanel requests={dashboardWorkRequests} />
            <MemberAttendancePanel
              members={dashboardMemberRows}
              isLoading={isPendingAdminHomeAttendanceStatus}
              isError={isErrorAdminHomeAttendanceStatus}
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
