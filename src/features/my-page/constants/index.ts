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

export const WORKTIME_HISTORY_SUMMARY = {
  year: 2026,
  month: 4,
  totalCount: 4,
  statuses: [
    {
      label: "처리중",
      count: 1,
      status: "pending",
    },
    {
      label: "승인완료",
      count: 2,
      status: "approved",
    },
    {
      label: "반려",
      count: 1,
      status: "rejected",
    },
  ],
} as const;

export const WORKTIME_HISTORY_PERIOD = "2026. 04.01 ~ 2026.04.30";

export const WORKTIME_HISTORY_ITEMS = [
  {
    id: 1,
    status: "rejected",
    statusLabel: "반려",
    processedAt: "처리 4월 7일 17:31",
    requestedAt: "신청 2026.03.20 16:21",
    changes: [
      {
        id: 1,
        type: "add",
        text: "4월 6일 13:00-14:30",
        hours: "1.5h",
      },
    ],
  },
  {
    id: 2,
    status: "pending",
    statusLabel: "처리중",
    requestedAt: "신청 2026.03.20 16:21",
    changes: [
      {
        id: 1,
        type: "delete",
        text: "4월 6일 13:00-14:30",
        hours: "1.5h",
      },
      {
        id: 2,
        type: "delete",
        text: "4월 6일 13:00-14:30",
        hours: "1.5h",
      },
      {
        id: 3,
        type: "add",
        text: "4월 6일 13:00-14:30",
        hours: "1.5h",
      },
      {
        id: 4,
        type: "add",
        text: "4월 6일 13:00-14:30",
        hours: "1.5h",
      },
    ],
  },
  {
    id: 3,
    status: "approved",
    statusLabel: "승인",
    processedAt: "처리 4월 7일 17:31",
    requestedAt: "신청 2026.03.20 16:21",
    changes: [
      {
        id: 1,
        type: "add",
        text: "4월 6일 13:00-14:30",
        hours: "1.5h",
      },
      {
        id: 2,
        type: "add",
        text: "4월 6일 13:00-14:30",
        hours: "1.5h",
      },
    ],
  },
] as const;
