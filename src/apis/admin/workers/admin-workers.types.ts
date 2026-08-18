// date는 조회 기준일(yyyy-MM-dd)이며, 이 날짜가 속한 주·월의 통계를 받는다.
// keyword는 이름 부분 일치 검색어이고, 비우면 전체를 조회한다.
export interface GetAdminWorkersRequest {
  date: string;
  keyword?: string;
  page?: number;
  size?: number;
}

// 근무·한도 시간은 모두 분 단위다. 화면에 시간으로 보여 주려면 60으로 나눈다.
// 학번·학과·학년·연락처는 아직 채우지 않은 사용자가 있어 null로 온다.
export interface AdminWorker {
  userId: number;
  name: string;
  studentId: string | null;
  department: string | null;
  grade: number | null;
  phoneNumber: string | null;
  weeklyWorkedMinutes: number;
  weeklyLimitMinutes: number;
  monthlyWorkedMinutes: number;
  monthlyLimitMinutes: number;
  totalChangeRequestCount: number;
  approvedChangeRequestCount: number;
  totalAttendanceIssueCount: number;
  lateCount: number;
}

// page는 0부터 시작한다. first·last는 각각 첫 페이지·마지막 페이지인지를 알려 준다.
export interface GetAdminWorkersResponse {
  date: string;
  workers: AdminWorker[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface GetAdminWorkerDetailRequest {
  userId: number;
  date: string;
}

// 목록과 달리 email·workStartDate가 오고, 근태 이상·지각 횟수는 오지 않는다.
export interface GetAdminWorkerDetailResponse {
  date: string;
  userId: number;
  name: string;
  studentId: string | null;
  department: string | null;
  grade: number | null;
  phoneNumber: string | null;
  email: string | null;
  workStartDate: string | null;
  weeklyWorkedMinutes: number;
  weeklyLimitMinutes: number;
  monthlyWorkedMinutes: number;
  monthlyLimitMinutes: number;
  totalChangeRequestCount: number;
  approvedChangeRequestCount: number;
}

// 수정할 필드만 보낸다. 이메일·비밀번호·근로 시작일은 이 api로 바꿀 수 없다.
export interface UpdateAdminWorkerRequest {
  userId: number;
  name?: string;
  studentId?: string;
  department?: string;
  grade?: number;
  phoneNumber?: string;
}

export interface UpdateAdminWorkerResponse {
  userId: number;
  name: string;
  studentId: string | null;
  department: string | null;
  grade: number | null;
  phoneNumber: string | null;
  email: string | null;
  workStartDate: string | null;
}
