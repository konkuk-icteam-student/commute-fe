import type { ScheduleSlot, WeekScheduleData } from "../types";
import { SLOTS_PER_DAY } from "../constants/slot";
import { toSlotKey, type SlotKey } from "./slot-key";

// lib/date-formatter의 getWeekdaysOfMonthWeek가 돌려주는 요일 한 칸.
export interface Weekday {
  label: string;
  dateLabel: string;
  date: string;
  isCurrentMonth: boolean;
}

// 표시할 날짜가 확정된 슬롯. 화면과 표는 원본 슬롯 대신 이 타입만 다룬다.
export interface WeekSlot {
  key: SlotKey;
  date: string;
  start: string;
  end: string;
  status: ScheduleSlot["status"];
  currentCount: number;
  // 정시(:00) 슬롯인지. 표 왼쪽에 시간 라벨을 붙일 위치를 정하는 데 쓴다.
  isHourStart: boolean;
}

export interface WeekDay extends Weekday {
  slots: WeekSlot[];
}

// 원본 슬롯에 표시용 날짜와 파생 정보를 붙인다.
// 서버 응답의 date는 표시 기준이 아니므로 해당 요일의 날짜로 덮어쓴다.
const toWeekSlot = (slot: ScheduleSlot, date: string): WeekSlot => ({
  key: toSlotKey({ date, start: slot.start, end: slot.end }),
  date,
  start: slot.start,
  end: slot.end,
  status: slot.status,
  currentCount: slot.currentCount,
  isHourStart: slot.start.endsWith(":00"),
});

// 한 줄로 이어진 주간 슬롯(월~금 × 하루치)을 요일별로 끊어 날짜를 붙인다.
// 날짜 조립은 여기 한 곳에서만 하고, 화면과 표는 이 결과만 사용한다.
export const buildWeekSchedule = (
  data: WeekScheduleData,
  weekdays: Weekday[],
): WeekDay[] =>
  weekdays.map((weekday, dayIndex) => ({
    ...weekday,
    slots: data.slots
      .slice(dayIndex * SLOTS_PER_DAY, (dayIndex + 1) * SLOTS_PER_DAY)
      .map((slot) => toWeekSlot(slot, weekday.date)),
  }));

// 이번 달에 속한 날짜의 슬롯만 한 줄로 편다. 근무시간 합계·최소근무시간 검사에 쓴다.
export const getCurrentMonthSlots = (days: WeekDay[]): WeekSlot[] =>
  days.filter((day) => day.isCurrentMonth).flatMap((day) => day.slots);

// 이번 달에 속한 날짜 목록. 주 단위 근무시간을 걸러 낼 때 쓴다.
export const getCurrentMonthDates = (days: WeekDay[]): string[] =>
  days.filter((day) => day.isCurrentMonth).map((day) => day.date);
