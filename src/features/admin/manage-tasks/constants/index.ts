import type { ManageTaskItem } from "../types";

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

export const manageTaskItemsByDate: Record<string, ManageTaskItem[]> = {
  "2026-07-26": july26Tasks,
  "2026-07-27": july27Tasks,
  "2026-07-28": july28Tasks,
};
