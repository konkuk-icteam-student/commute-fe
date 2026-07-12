export type DashboardSummaryItem = {
  label: string;
  variant?: "default" | "warning";
  value: string;
};

export type DashboardWorker = {
  id: string;
  name: string;
};

export type DashboardTimePeriodCode = "MORNING" | "AFTERNOON";

export type DashboardTimeRow = {
  currentCount: number;
  periodCode: DashboardTimePeriodCode;
  id: string;
  isOverLimit: boolean;
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

export type DashboardMemberStatusCode = "AT01" | "AT02" | "AT03";

export type DashboardMemberAttendance = {
  id: string;
  name: string;
  statusCode: DashboardMemberStatusCode;
  meta: string;
  late: string;
  week: string;
  weekProgress: number;
  total: string;
  totalProgress: number;
};

export type DashboardApiResponse<TDetails> =
  | {
      isSuccess: true;
      message: string;
      details: TDetails;
    }
  | {
      isSuccess: false;
      message: string;
      details: null;
    };

export type DashboardScheduleRequest = {
  startDate: string;
  endDate: string;
  userName?: string;
};

export type DashboardScheduleSlotUser = {
  userId: string;
  userName: string;
};

export type DashboardScheduleSlot = {
  date: string;
  start: string;
  end: string;
  currentCount: number;
  isOverLimit: boolean;
  users: DashboardScheduleSlotUser[];
};

export type DashboardScheduleDetails = {
  startDate: string;
  endDate: string;
  maxConcurrentWorkers: number;
  slots: DashboardScheduleSlot[];
};

export type DashboardAttendanceUser = {
  userId: string;
  userName: string;
  department: string;
  studentId: string;
  statusCode: DashboardMemberStatusCode;
  lateCount: number;
  lateMinutes: number;
  weeklyWorkedMinutes: number;
  weeklyLimitMinutes: number;
  monthlyWorkedMinutes: number;
  monthlyLimitMinutes: number;
};

export type DashboardAttendanceDetails = {
  date: string;
  users: DashboardAttendanceUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type DashboardAttendanceRequest = {
  date: string;
  userName?: string;
  page?: number;
  size?: number;
};

export type DashboardSummaryDetails = {
  date: string;
  currentWorkingCount: number;
  notCheckedInCount: number;
  lateCount: number;
  todayTask: {
    completedCount: number;
    totalCount: number;
  };
};

export type DashboardSummaryRequest = {
  date: string;
};
