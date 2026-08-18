import type {
  ManageTaskDailyData,
  ManageTaskItem,
  ManageTaskMemo,
} from "../types";

const july26Tasks: ManageTaskItem[] = [
  {
    id: 101,
    period: "오전",
    title: "신문지 가져오기",
    assignee: "홍길동",
    completedAt: "09:13 완료",
    completed: true,
  },
  {
    id: 102,
    period: "오전",
    title: "커피머신 청소",
    completed: false,
  },
  {
    id: 103,
    period: "오후",
    title: "회의실 청소",
    assignee: "김길동",
    completedAt: "14:05 완료",
    completed: true,
  },
  {
    id: 104,
    period: "오후",
    title: "싱크대 청소",
    completed: false,
  },
];

const july27Tasks: ManageTaskItem[] = [
  {
    id: 201,
    period: "오전",
    title: "신문지 가져오기",
    assignee: "홍길동",
    completedAt: "09:13 완료",
    completed: true,
  },
  {
    id: 202,
    period: "오전",
    title: "신문지 가져오기",
    assignee: "홍길동",
    completedAt: "09:13 완료",
    completed: true,
  },
  {
    id: 203,
    period: "오전",
    title: "커피머신 청소",
    completed: false,
  },
  {
    id: 204,
    period: "오전",
    title: "커피머신 청소",
    completed: false,
  },
  {
    id: 205,
    period: "오후",
    title: "신문지 가져오기",
    assignee: "김길동",
    completedAt: "09:13 완료",
    completed: true,
  },
  {
    id: 206,
    period: "오후",
    title: "신문지 가져오기",
    assignee: "홍길동",
    completedAt: "09:13 완료",
    completed: true,
  },
  {
    id: 207,
    period: "오후",
    title: "회의실 청소",
    completed: false,
  },
  {
    id: 208,
    period: "오후",
    title: "싱크대 청소",
    completed: false,
  },
  {
    id: 209,
    period: "오후",
    title: "커피머신 청소",
    completed: false,
  },
];

const july28Tasks: ManageTaskItem[] = [
  {
    id: 301,
    period: "오전",
    title: "강의실 분리수거",
    assignee: "박길동",
    completedAt: "10:02 완료",
    completed: true,
  },
  {
    id: 302,
    period: "오전",
    title: "복사실 용지 채우기",
    completed: false,
  },
  {
    id: 303,
    period: "오후",
    title: "라운지 테이블 정리",
    completed: false,
  },
];

const july26Memos: ManageTaskMemo[] = [
  {
    id: 101,
    author: "김길동",
    createdAt: "07.26 09:22",
    content: "오전 근무자가 신문지 위치를 창고 안쪽으로 옮겨두었습니다.",
    isMine: false,
  },
];

const july27Memos: ManageTaskMemo[] = [
  {
    id: 201,
    author: "홍길동A",
    createdAt: "07.27 10:36",
    content: "다음 근무자가 쓰레기통도 꼭 갈아주세요.",
    isMine: false,
  },
  {
    id: 202,
    author: "관리자",
    createdAt: "07.27 14:09",
    content: "오후 근무자는 회의실 청소 후 문단속 확인해주세요.",
    isMine: true,
  },
];

const july28Memos: ManageTaskMemo[] = [
  {
    id: 301,
    author: "박길동",
    createdAt: "07.28 11:18",
    content: "복사실 토너가 부족해서 관리자 확인이 필요합니다.",
    isMine: false,
  },
];

export const emptyManageTaskDailyData: ManageTaskDailyData = {
  memos: [],
  tasks: [],
};

export const manageTaskDataByDate: Record<string, ManageTaskDailyData> = {
  "2026-07-26": {
    memos: july26Memos,
    tasks: july26Tasks,
  },
  "2026-07-27": {
    memos: july27Memos,
    tasks: july27Tasks,
  },
  "2026-07-28": {
    memos: july28Memos,
    tasks: july28Tasks,
  },
};

export const getManageTaskDailyData = (date: string) =>
  manageTaskDataByDate[date] ?? emptyManageTaskDailyData;
