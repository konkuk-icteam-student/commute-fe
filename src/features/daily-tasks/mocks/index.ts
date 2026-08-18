import type { DailyTaskPeriod, HandoverMemo } from "../types";

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

export const mockHandoverMemosByPeriod: Record<
  DailyTaskPeriod,
  HandoverMemo[]
> = {
  morning: mockMorningHandoverMemos,
  afternoon: mockAfternoonHandoverMemos,
};
