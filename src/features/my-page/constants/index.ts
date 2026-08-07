export const MY_PAGE_USER = {
  name: "홍길동",
  role: "근로 장학생",
  department: "건국대학교 정보운영팀",
  studentId: "202412345",
  major: "컴퓨터공학과",
} as const;

export const MY_PAGE_WORK_SUMMARIES = [
  {
    title: "이번주 근무 시간",
    currentHours: 3,
    totalHours: 13,
  },
  {
    title: "이번달 근무 시간",
    currentHours: 13,
    totalHours: 27,
  },
] as const;
