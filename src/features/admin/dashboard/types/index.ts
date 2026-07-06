export type DashboardSummaryItem = {
  label: string;
  value: string;
};

export type DashboardWorker = {
  id: number;
  name: string;
};

export type DashboardTimeRow = {
  time: string;
  workers: DashboardWorker[];
};

export type DashboardWorkRequestChange = {
  type: "add" | "remove";
  text: string;
};

export type DashboardWorkRequest = {
  name: string;
  changes: DashboardWorkRequestChange[];
};

export type DashboardMemberStatus = "근무중" | "출근예정" | "지각";

export type DashboardMemberAttendance = {
  id: number;
  name: string;
  status: DashboardMemberStatus;
  meta: string;
  late: string;
  week: string;
  weekProgress: number;
  total: string;
  totalProgress: number;
};
