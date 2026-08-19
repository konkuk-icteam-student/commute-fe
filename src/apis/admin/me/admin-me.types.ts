// 로그인한 관리자 본인의 이름과 소속 조직명. 관리자 화면 헤더 표시에 쓴다.
export interface GetAdminMeResponse {
  userId: number;
  adminName: string;
  teamName: string;
}
