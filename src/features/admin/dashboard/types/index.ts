export type DashboardSummaryItem = {
  label: string;
  value: string;
};

export type DashboardWorker = {
  id: number;
  name: string;
};

export type DashboardTimePeriodCode = "MORNING" | "AFTERNOON";

export type DashboardTimeRow = {
  id: number;
  periodCode: DashboardTimePeriodCode;
  start: string;
  end: string;
  workers: DashboardWorker[];
};

export type DashboardWorkRequestChange = {
  type: "add" | "remove";
  text: string;
};

export type DashboardWorkRequest = {
  id: number;
  name: string;
  changes: DashboardWorkRequestChange[];
};

export type DashboardMemberStatusCode = "WORKING" | "SCHEDULED" | "LATE";

export type DashboardMemberAttendance = {
  id: number;
  name: string;
  statusCode: DashboardMemberStatusCode;
  meta: string;
  late: string;
  week: string;
  weekProgress: number;
  total: string;
  totalProgress: number;
};
