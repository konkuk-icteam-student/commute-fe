import type {
  DashboardMemberAttendance,
  DashboardSummaryItem,
  DashboardTimeRow,
  DashboardWorker,
  DashboardWorkRequest,
} from "../types";

export const dashboardDateLabels = [
  "2026년 4월 13일 (월)",
  "2026년 4월 14일 (화)",
  "2026년 4월 15일 (수)",
  "2026년 4월 16일 (목)",
  "2026년 4월 17일 (금)",
];

export const dashboardSummary: DashboardSummaryItem[] = [
  { label: "현재 근무 중", value: "3명" },
  { label: "미출근자", value: "3명" },
  { label: "지각자", value: "3명" },
  { label: "오늘의 업무", value: "1/6" },
];

const dashboardWorkers = {
  studentA: { id: 1, name: "학생A" },
  studentB: { id: 2, name: "학생B" },
  studentC: { id: 3, name: "학생C" },
  studentD: { id: 4, name: "학생D" },
  studentE: { id: 5, name: "학생E" },
  studentF: { id: 6, name: "학생F" },
  studentG: { id: 7, name: "학생G" },
} satisfies Record<string, DashboardWorker>;

const { studentA, studentB, studentC, studentD, studentE, studentF, studentG } =
  dashboardWorkers;

export const dashboardTimeRows: DashboardTimeRow[] = [
  { time: "09:00 ~ 09:30", workers: [studentA, studentB] },
  { time: "09:30 ~ 10:00", workers: [studentA, studentB, studentC] },
  { time: "10:00 ~ 10:30", workers: [studentA, studentB, studentC] },
  {
    time: "10:30 ~ 11:00",
    workers: [studentA, studentB, studentC, studentD],
  },
  {
    time: "11:00 ~ 11:30",
    workers: [studentD, studentE, studentF, studentG],
  },
  { time: "09:00 ~ 09:30", workers: [studentA, studentB] },
  { time: "09:30 ~ 10:00", workers: [studentA, studentB, studentC] },
  { time: "10:00 ~ 10:30", workers: [studentA, studentB, studentC] },
  {
    time: "10:30 ~ 11:00",
    workers: [studentA, studentB, studentC, studentD],
  },
  {
    time: "11:00 ~ 11:30",
    workers: [studentD, studentE, studentF, studentG],
  },
];

export const dashboardWorkRequests: DashboardWorkRequest[] = [
  {
    name: "박길동",
    changes: [
      { type: "remove", text: "4월 9일 14:30-15:30 (1h)" },
      { type: "remove", text: "4월 9일 14:30-15:30 (1h)" },
      { type: "add", text: "4월 9일 14:30-15:30 (1h)" },
    ],
  },
  {
    name: "박길동",
    changes: [
      { type: "remove", text: "4월 9일 14:30-15:30 (1h)" },
      { type: "remove", text: "4월 9일 14:30-15:30 (1h)" },
      { type: "add", text: "4월 9일 14:30-15:30 (1h)" },
    ],
  },
];

export const dashboardMemberRows: DashboardMemberAttendance[] = [
  {
    id: 1,
    name: "김길동",
    status: "근무중",
    meta: "컴퓨터공학부 · 202311303",
    late: "1회 (8분)",
    week: "0시간 0분 / 9시간",
    weekProgress: 0,
    total: "5시간 0분 / 27시간",
    totalProgress: 18.52,
  },
  {
    id: 2,
    name: "이영희",
    status: "출근예정",
    meta: "경영학부 · 202311304",
    late: "0회 (0분)",
    week: "0시간 0분 / 9시간",
    weekProgress: 0,
    total: "5시간 0분 / 27시간",
    totalProgress: 18.52,
  },
  {
    id: 3,
    name: "박철수",
    status: "근무중",
    meta: "전자공학부 · 202311305",
    late: "2회 (15분)",
    week: "6시간 0분 / 9시간",
    weekProgress: 66.67,
    total: "20시간 0분 / 27시간",
    totalProgress: 74.07,
  },
  {
    id: 4,
    name: "최지훈",
    status: "출근예정",
    meta: "정보보호학부 · 202311306",
    late: "1회 (5분)",
    week: "3시간 15분 / 9시간",
    weekProgress: 36.11,
    total: "10시간 30분 / 27시간",
    totalProgress: 38.89,
  },
  {
    id: 5,
    name: "최지훈",
    status: "지각",
    meta: "정보보호학부 · 202311306",
    late: "1회 (5분)",
    week: "3시간 15분 / 9시간",
    weekProgress: 36.11,
    total: "10시간 30분 / 27시간",
    totalProgress: 38.89,
  },
  {
    id: 6,
    name: "정수민",
    status: "근무중",
    meta: "시각디자인학과 · 202311307",
    late: "0회 (0분)",
    week: "5시간 0분 / 9시간",
    weekProgress: 55.56,
    total: "15시간 0분 / 27시간",
    totalProgress: 55.56,
  },
  {
    id: 7,
    name: "한지우",
    status: "출근예정",
    meta: "산업디자인학과 · 202311308",
    late: "1회 (3분)",
    week: "2시간 30분 / 9시간",
    weekProgress: 27.78,
    total: "8시간 0분 / 27시간",
    totalProgress: 29.63,
  },
  {
    id: 8,
    name: "윤서준",
    status: "근무중",
    meta: "기계공학부 · 202311309",
    late: "0회 (0분)",
    week: "7시간 0분 / 9시간",
    weekProgress: 77.78,
    total: "22시간 0분 / 27시간",
    totalProgress: 81.48,
  },
  {
    id: 9,
    name: "임하은",
    status: "지각",
    meta: "화학공학부 · 202311310",
    late: "3회 (22분)",
    week: "4시간 0분 / 9시간",
    weekProgress: 44.44,
    total: "12시간 30분 / 27시간",
    totalProgress: 46.3,
  },
  {
    id: 10,
    name: "송민재",
    status: "근무중",
    meta: "건축학부 · 202311311",
    late: "1회 (7분)",
    week: "6시간 30분 / 9시간",
    weekProgress: 72.22,
    total: "19시간 0분 / 27시간",
    totalProgress: 70.37,
  },
  {
    id: 11,
    name: "오예린",
    status: "출근예정",
    meta: "경제학과 · 202311312",
    late: "0회 (0분)",
    week: "1시간 30분 / 9시간",
    weekProgress: 16.67,
    total: "4시간 30분 / 27시간",
    totalProgress: 16.67,
  },
  {
    id: 12,
    name: "김태윤",
    status: "근무중",
    meta: "전기전자공학부 · 202311313",
    late: "2회 (11분)",
    week: "8시간 0분 / 9시간",
    weekProgress: 88.89,
    total: "24시간 0분 / 27시간",
    totalProgress: 88.89,
  },
];
