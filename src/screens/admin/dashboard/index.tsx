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
    <div className="flex-1 p-4 min-[1728px]:p-8.5">
      <div className="mx-auto w-full max-w-286.5 min-[1728px]:max-w-327.25">
        <DateNavigator dateLabels={dashboardDateLabels} initialIndex={2} />
        <SummaryPanel items={dashboardSummary} />

        <div className="mt-7 grid grid-cols-[minmax(0,485px)_minmax(0,629px)] items-start gap-8 min-[1728px]:mt-13.25 min-[1728px]:grid-cols-[minmax(0,613px)_minmax(0,659px)] min-[1728px]:gap-9.25 @max-[700px]/dashboard:grid-cols-1 @max-[700px]/dashboard:gap-6">
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
