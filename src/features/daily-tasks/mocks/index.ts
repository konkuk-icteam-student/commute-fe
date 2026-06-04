import type {
  DailyTaskItem,
  DailyTasksByPeriod,
  HandoverMemo,
  WorkTimeSlot,
  WorkTimeWorker,
} from "../types";

const mockWorkers = {
  studentA: { id: 1, name: "학생A", tone: "student-blue" },
  studentB: { id: 2, name: "학생B", tone: "student-green" },
  studentC: { id: 3, name: "학생C", tone: "student-red" },
  studentD: { id: 4, name: "학생D", tone: "student-orange" },
  studentE: { id: 5, name: "학생E", tone: "student-purple" },
  studentF: { id: 6, name: "학생F", tone: "student-cyan" },
  studentG: { id: 7, name: "학생G", tone: "student-pink" },
} satisfies Record<string, WorkTimeWorker>;

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
    workers: [mockWorkers.studentA, mockWorkers.studentB],
  },
  {
    time: "09:30",
    workers: [mockWorkers.studentA, mockWorkers.studentB, mockWorkers.studentC],
  },
  {
    time: "10:00",
    workers: [mockWorkers.studentB, mockWorkers.studentC, mockWorkers.studentD],
  },
  {
    time: "10:30",
    workers: [
      mockWorkers.studentB,
      mockWorkers.studentE,
      mockWorkers.studentD,
      mockWorkers.studentF,
      mockWorkers.studentG,
    ],
  },
  {
    time: "11:00",
    workers: [
      mockWorkers.studentD,
      mockWorkers.studentF,
      mockWorkers.studentG,
      mockWorkers.studentE,
    ],
  },
];

const mockAfternoonWorkTimeSlots: WorkTimeSlot[] = [
  {
    time: "13:00",
    workers: [mockWorkers.studentG, mockWorkers.studentF],
  },
  {
    time: "13:30",
    workers: [mockWorkers.studentF, mockWorkers.studentD, mockWorkers.studentE],
  },
  {
    time: "14:00",
    workers: [mockWorkers.studentD, mockWorkers.studentC, mockWorkers.studentF],
  },
  {
    time: "14:30",
    workers: [
      mockWorkers.studentB,
      mockWorkers.studentG,
      mockWorkers.studentF,
      mockWorkers.studentA,
    ],
  },
  {
    time: "15:00",
    workers: [mockWorkers.studentE, mockWorkers.studentD, mockWorkers.studentC],
  },
];

const mockMorningHandoverMemos: HandoverMemo[] = [
  {
    id: 1,
    author: "홍길동A",
    createdAt: "05.26 (수) 10:36",
    content: "다음 근무자가 쓰레기봉투 꼭 갈아주세요.",
    isMine: true,
  },
];

const mockAfternoonHandoverMemos: HandoverMemo[] = [
  {
    id: 1,
    author: "김철수B",
    createdAt: "05.26 (수) 14:20",
    content: "오후에 프린터 토너 부족하면 사무실에 말씀해주세요.",
    isMine: false,
  },
  {
    id: 2,
    author: "이영희C",
    createdAt: "05.26 (수) 15:05",
    content: "창가 좌석 분실물은 데스크 서랍에 보관했습니다.",
    isMine: false,
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
