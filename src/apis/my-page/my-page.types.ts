export interface MyPageWorkSummary {
  workedHours: number;
  limitHours: number;
}

export interface GetMyPageResponse {
  userName: string;
  roleName: string;
  organizationName: string;
  department: string;
  studentId: string;
  week: MyPageWorkSummary;
  month: MyPageWorkSummary;
}
