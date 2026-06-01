import type {
  DailyTaskItem,
  DailyTasksByPeriod,
  HandoverMemo,
  WorkTimeSlot,
} from "../types";

const mockMorningDailyTasks: DailyTaskItem[] = [
  {
    id: 1,
    title: "신문지 가져오기",
    completed: true,
  },
  {
    id: 2,
    title: "커피머신 청소",
    completed: false,
  },
  {
    id: 3,
    title: "싱크대 청소",
    completed: false,
  },
  {
    id: 4,
    title: "회의실 청소",
    completed: false,
  },
];

const mockAfternoonDailyTasks: DailyTaskItem[] = [
  {
    id: 1,
    title: "택배 정리",
    completed: true,
  },
  {
    id: 2,
    title: "프린터 용지 채우기",
    completed: true,
  },
  {
    id: 3,
    title: "창가 테이블 정리",
    completed: false,
  },
  {
    id: 4,
    title: "마감 전 바닥 확인",
    completed: false,
  },
];

const mockMorningWorkTimeSlots: WorkTimeSlot[] = [
  {
    time: "09:00",
    workers: [
      { id: 1, name: "학생A", tone: "student-blue" },
      { id: 2, name: "학생B", tone: "student-green" },
    ],
  },
  {
    time: "09:30",
    workers: [
      { id: 3, name: "학생A", tone: "student-blue" },
      { id: 4, name: "학생B", tone: "student-green" },
      { id: 5, name: "학생C", tone: "student-red" },
    ],
  },
  {
    time: "10:00",
    workers: [
      { id: 6, name: "학생B", tone: "student-green" },
      { id: 7, name: "학생C", tone: "student-red" },
      { id: 8, name: "학생A", tone: "student-orange" },
    ],
  },
  {
    time: "10:30",
    workers: [
      { id: 9, name: "학생B", tone: "student-green" },
      { id: 10, name: "학생B", tone: "student-purple" },
      { id: 11, name: "학생A", tone: "student-orange" },
      { id: 12, name: "학생C", tone: "student-cyan" },
      { id: 13, name: "학생C", tone: "student-pink" },
    ],
  },
  {
    time: "11:00",
    workers: [
      { id: 14, name: "학생A", tone: "student-orange" },
      { id: 15, name: "학생C", tone: "student-cyan" },
      { id: 16, name: "학생C", tone: "student-pink" },
      { id: 17, name: "학생B", tone: "student-purple" },
    ],
  },
];

const mockAfternoonWorkTimeSlots: WorkTimeSlot[] = [
  {
    time: "13:00",
    workers: [
      { id: 1, name: "학생C", tone: "student-pink" },
      { id: 2, name: "학생D", tone: "student-cyan" },
    ],
  },
  {
    time: "13:30",
    workers: [
      { id: 3, name: "학생D", tone: "student-cyan" },
      { id: 4, name: "학생A", tone: "student-orange" },
      { id: 5, name: "학생B", tone: "student-purple" },
    ],
  },
  {
    time: "14:00",
    workers: [
      { id: 6, name: "학생A", tone: "student-orange" },
      { id: 7, name: "학생C", tone: "student-red" },
      { id: 8, name: "학생D", tone: "student-cyan" },
    ],
  },
  {
    time: "14:30",
    workers: [
      { id: 9, name: "학생B", tone: "student-green" },
      { id: 10, name: "학생C", tone: "student-pink" },
      { id: 11, name: "학생D", tone: "student-cyan" },
      { id: 12, name: "학생A", tone: "student-blue" },
    ],
  },
  {
    time: "15:00",
    workers: [
      { id: 13, name: "학생B", tone: "student-purple" },
      { id: 14, name: "학생A", tone: "student-orange" },
      { id: 15, name: "학생C", tone: "student-red" },
    ],
  },
];

const mockMorningHandoverMemos: HandoverMemo[] = [
  {
    id: 1,
    author: "홍길동A",
    createdAt: "05.26 (수) 10:36",
    content: "다음 근무자가 쓰레기봉투 꼭 갈아주세요.",
  },
];

const mockAfternoonHandoverMemos: HandoverMemo[] = [
  {
    id: 1,
    author: "김철수B",
    createdAt: "05.26 (수) 14:20",
    content: "오후에 프린터 토너 부족하면 사무실에 말씀해주세요.",
  },
  {
    id: 2,
    author: "이영희C",
    createdAt: "05.26 (수) 15:05",
    content: "창가 좌석 분실물은 데스크 서랍에 보관했습니다.",
  },
];

export const mockDailyTasksByPeriod: DailyTasksByPeriod = {
  morning: {
    tasks: mockMorningDailyTasks,
    workTimeSlots: mockMorningWorkTimeSlots,
    handoverMemos: mockMorningHandoverMemos,
  },
  afternoon: {
    tasks: mockAfternoonDailyTasks,
    workTimeSlots: mockAfternoonWorkTimeSlots,
    handoverMemos: mockAfternoonHandoverMemos,
  },
};
