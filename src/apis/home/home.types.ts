export type HomeTodayWorkStatusCode = "WK01" | "WK02" | "WK03" | "WK04";

export interface HomeTodaySchedule {
  scheduleIds: number[];
  label: string;
  start: string;
  end: string;
  workStatusCode: HomeTodayWorkStatusCode;
  checkedIn: boolean;
  checkInTime: string | null;
}

export interface GetHomeTodayResponse {
  date: string;
  schedules: HomeTodaySchedule[];
}

export interface CheckInHomeRequest {
  scheduleIds: number[];
}

export interface CheckInHomeResponse {
  attendanceId: string;
  checkInTime: string;
}
