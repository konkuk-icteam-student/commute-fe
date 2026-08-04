import type { ScheduleSlotTime } from "../types";

// 슬롯을 Map 키로 다루기 위한 문자열 식별자. 예: "2026-05-18T09:00"
export type SlotKey = string;

// 같은 날짜의 같은 시작 시각에는 슬롯이 하나뿐이므로 date + start 만으로 식별할 수 있다.
export const toSlotKey = ({ date, start }: ScheduleSlotTime): SlotKey =>
  `${date}T${start}`;
