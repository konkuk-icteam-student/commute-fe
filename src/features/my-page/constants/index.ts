import type { WorktimeHistoryResponse } from "../types";

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

export const WORKTIME_HISTORY_RESPONSES: WorktimeHistoryResponse[] = [
  {
    isSuccess: true,
    message: "근무시간 신청기록을 조회했습니다.",
    details: {
      year: 2026,
      month: 3,
      statusCode: "ALL",
      summary: {
        totalCount: 2,
        approvedCount: 2,
        pendingCount: 0,
        rejectedCount: 0,
      },
      histories: [
        {
          requestId: "2026-03-history-1",
          statusCode: "CS02",
          statusName: "승인",
          requestedAt: "2026-02-20T16:21:00",
          processedAt: "2026-03-08T10:12:00",
          reason: "3월 근무 시간을 추가로 신청합니다.",
          rejectReason: null,
          deleteSlots: [],
          addSlots: [
            {
              start: "2026-03-09T09:30:00",
              end: "2026-03-09T11:30:00",
              changeTypeCode: "CR01",
            },
            {
              start: "2026-03-11T13:00:00",
              end: "2026-03-11T14:30:00",
              changeTypeCode: "CR01",
            },
          ],
        },
        {
          requestId: "2026-03-history-2",
          statusCode: "CS02",
          statusName: "승인",
          requestedAt: "2026-03-10T09:11:00",
          processedAt: "2026-03-18T15:40:00",
          reason: "수업 일정으로 근무 삭제를 요청합니다.",
          rejectReason: null,
          deleteSlots: [
            {
              start: "2026-03-20T13:00:00",
              end: "2026-03-20T14:30:00",
              changeTypeCode: "CR02",
            },
          ],
          addSlots: [],
        },
      ],
      page: 0,
      size: 10,
      totalElements: 2,
      totalPages: 1,
    },
  },
  {
    isSuccess: true,
    message: "근무시간 신청기록을 조회했습니다.",
    details: {
      year: 2026,
      month: 4,
      statusCode: "ALL",
      summary: {
        totalCount: 4,
        approvedCount: 2,
        pendingCount: 1,
        rejectedCount: 1,
      },
      histories: [
        {
          requestId: "2026-04-history-1",
          statusCode: "CS03",
          statusName: "반려",
          requestedAt: "2026-03-20T16:21:00",
          processedAt: "2026-04-07T17:31:00",
          reason: "개인 일정으로 근무 시간을 추가 신청합니다.",
          rejectReason: "해당 시간대의 근무 인원이 이미 충족되었습니다.",
          deleteSlots: [],
          addSlots: [
            {
              start: "2026-04-06T13:00:00",
              end: "2026-04-06T14:30:00",
              changeTypeCode: "CR01",
            },
          ],
        },
        {
          requestId: "2026-04-history-2",
          statusCode: "CS01",
          statusName: "처리중",
          requestedAt: "2026-03-20T16:21:00",
          processedAt: null,
          reason: "수업 변경으로 근무 시간을 조정합니다.",
          rejectReason: null,
          deleteSlots: [
            {
              start: "2026-04-06T13:00:00",
              end: "2026-04-06T14:30:00",
              changeTypeCode: "CR02",
            },
            {
              start: "2026-04-06T13:00:00",
              end: "2026-04-06T14:30:00",
              changeTypeCode: "CR02",
            },
          ],
          addSlots: [
            {
              start: "2026-04-06T13:00:00",
              end: "2026-04-06T14:30:00",
              changeTypeCode: "CR01",
            },
            {
              start: "2026-04-06T13:00:00",
              end: "2026-04-06T14:30:00",
              changeTypeCode: "CR01",
            },
          ],
        },
        {
          requestId: "2026-04-history-3",
          statusCode: "CS02",
          statusName: "승인",
          requestedAt: "2026-03-20T16:21:00",
          processedAt: "2026-04-07T17:31:00",
          reason: "근무 가능 시간이 생겨 추가 신청합니다.",
          rejectReason: null,
          deleteSlots: [],
          addSlots: [
            {
              start: "2026-04-06T13:00:00",
              end: "2026-04-06T14:30:00",
              changeTypeCode: "CR01",
            },
            {
              start: "2026-04-06T13:00:00",
              end: "2026-04-06T14:30:00",
              changeTypeCode: "CR01",
            },
          ],
        },
        {
          requestId: "2026-04-history-4",
          statusCode: "CS02",
          statusName: "승인",
          requestedAt: "2026-04-05T14:12:00",
          processedAt: "2026-04-12T10:08:00",
          reason: "오전 근무 시간을 추가 신청합니다.",
          rejectReason: null,
          deleteSlots: [],
          addSlots: [
            {
              start: "2026-04-15T09:30:00",
              end: "2026-04-15T11:30:00",
              changeTypeCode: "CR01",
            },
          ],
        },
      ],
      page: 0,
      size: 10,
      totalElements: 4,
      totalPages: 1,
    },
  },
  {
    isSuccess: true,
    message: "근무시간 신청기록을 조회했습니다.",
    details: {
      year: 2026,
      month: 5,
      statusCode: "ALL",
      summary: {
        totalCount: 3,
        approvedCount: 1,
        pendingCount: 1,
        rejectedCount: 1,
      },
      histories: [
        {
          requestId: "2026-05-history-1",
          statusCode: "CS01",
          statusName: "처리중",
          requestedAt: "2026-04-20T11:04:00",
          processedAt: null,
          reason: "5월 근무 가능 시간을 조정합니다.",
          rejectReason: null,
          deleteSlots: [
            {
              start: "2026-05-08T13:00:00",
              end: "2026-05-08T14:30:00",
              changeTypeCode: "CR02",
            },
          ],
          addSlots: [
            {
              start: "2026-05-07T09:30:00",
              end: "2026-05-07T11:30:00",
              changeTypeCode: "CR01",
            },
          ],
        },
        {
          requestId: "2026-05-history-2",
          statusCode: "CS02",
          statusName: "승인",
          requestedAt: "2026-04-25T16:21:00",
          processedAt: "2026-05-03T14:20:00",
          reason: "오후 근무 시간을 추가 신청합니다.",
          rejectReason: null,
          deleteSlots: [],
          addSlots: [
            {
              start: "2026-05-12T13:00:00",
              end: "2026-05-12T14:30:00",
              changeTypeCode: "CR01",
            },
          ],
        },
        {
          requestId: "2026-05-history-3",
          statusCode: "CS03",
          statusName: "반려",
          requestedAt: "2026-05-01T09:30:00",
          processedAt: "2026-05-09T17:31:00",
          reason: "수업 일정으로 근무 삭제를 요청합니다.",
          rejectReason: "삭제 요청한 시간은 이미 처리 중인 변경 요청이 있습니다.",
          deleteSlots: [
            {
              start: "2026-05-15T09:30:00",
              end: "2026-05-15T11:30:00",
              changeTypeCode: "CR02",
            },
          ],
          addSlots: [],
        },
      ],
      page: 0,
      size: 10,
      totalElements: 3,
      totalPages: 1,
    },
  },
  {
    isSuccess: true,
    message: "근무시간 신청기록을 조회했습니다.",
    details: {
      year: 2026,
      month: 6,
      statusCode: "ALL",
      summary: {
        totalCount: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
      },
      histories: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
  },
];
