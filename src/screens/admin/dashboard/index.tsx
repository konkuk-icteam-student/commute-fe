import {
  dashboardDateLabels,
  dashboardMemberRows,
  dashboardSummary,
  dashboardTimeRows,
  dashboardWorkRequests,
  DateNavigator,
  MemberAttendancePanel,
  SummaryPanel,
  TimeTablePanel,
  WorkRequestPanel,
} from "@/features/admin/dashboard";

export default function AdminDashboardScreen() {
  return (
    <div className="flex-1 p-8.5">
      <div className="mx-auto w-full max-w-325.75">
        <DateNavigator dateLabels={dashboardDateLabels} initialIndex={2} />
        <SummaryPanel items={dashboardSummary} />

        <div className="mt-13.25 grid grid-cols-[minmax(0,613px)_minmax(0,653px)] items-start gap-9.25">
          <TimeTablePanel rows={dashboardTimeRows} />
          <div className="space-y-6">
            <WorkRequestPanel requests={dashboardWorkRequests} />
            <MemberAttendancePanel members={dashboardMemberRows} />
          </div>
        </div>
      </div>
    </div>
  );
}
