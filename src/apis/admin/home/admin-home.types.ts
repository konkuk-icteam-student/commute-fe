export type AdminHomeWorkStatusCode = "WK01" | "WK02" | "WK03" | "WK04";

export type AdminHomeAttendanceStatusCode = "AT01" | "AT02" | "AT03";

export interface GetAdminHomeAttendanceSummaryRequest {
  date: string;
}

export interface AdminHomeTodayTask {
  completedCount: number;
  totalCount: number;
}

export interface GetAdminHomeAttendanceSummaryResponse {
  date: string;
  currentWorkingCount: number;
  notCheckedInCount: number;
  lateCount: number;
  todayTask: AdminHomeTodayTask;
}

export interface GetAdminHomeAttendanceStatusRequest {
  date: string;
  userName?: string;
  page?: number;
  size?: number;
}

export interface AdminHomeAttendanceStatusUser {
  userId: string;
  userName: string;
  department: string | null;
  studentId: string | null;
  workStatusCode: AdminHomeWorkStatusCode | null;
  attendanceStatusCode: AdminHomeAttendanceStatusCode | null;
  lateCount: number;
  lateMinutes: number;
  weeklyWorkedMinutes: number;
  weeklyLimitMinutes: number;
  monthlyWorkedMinutes: number;
  monthlyLimitMinutes: number;
}

export interface GetAdminHomeAttendanceStatusResponse {
  date: string;
  users: AdminHomeAttendanceStatusUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
