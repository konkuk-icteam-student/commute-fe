// 로그인한 관리자와 같은 조직의 학생을 이름 부분 일치로 찾는다. 최소 1자.
export interface GetAdminUserSearchRequest {
  keyword: string;
}

export interface AdminSearchedUser {
  userId: string;
  userName: string;
  department: string | null;
  studentId: string | null;
}

export interface GetAdminUserSearchResponse {
  users: AdminSearchedUser[];
}
