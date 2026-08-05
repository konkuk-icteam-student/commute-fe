import type { ScheduleSlotStatus } from "../types";
import { SLOT_TIMES } from "../constants/slot";
import { toSlotKey, type SlotKey } from "./slot-key";

// lib/date-formatter의 getWeekdaysOfMonthWeek가 돌려주는 요일 한 칸.
export interface Weekday {
  label: string;
  dateLabel: string;
  date: string;
  isCurrentMonth: boolean;
}

// 서버가 내려주는 슬롯 한 칸.
export interface WeekScheduleSlotSource {
  start: string;
  end: string;
  status: ScheduleSlotStatus;
  currentCount: number;
}

// 표를 만들기 위해 필요한 최소한의 응답 형태.
// 기간별 조회 응답(GetPeriodWorkSchedulesResponse)이 그대로 들어맞는다.
export interface WeekScheduleSource {
  maxConcurrentWorkers: number;
  days: {
    date: string;
    slots: WeekScheduleSlotSource[];
  }[];
}

// 응답을 아직 받지 못했을 때 쓰는 빈 시간표. 표가 잠긴 모양으로 그려진다.
export const EMPTY_SCHEDULE: WeekScheduleSource = {
  maxConcurrentWorkers: 0,
  days: [],
};

// 표시할 날짜가 확정된 슬롯. 화면과 표는 원본 슬롯 대신 이 타입만 다룬다.
export interface WeekSlot {
  key: SlotKey;
  date: string;
  start: string;
  end: string;
  status: ScheduleSlotStatus;
  currentCount: number;
  // 정시(:00) 슬롯인지. 표 왼쪽에 시간 라벨을 붙일 위치를 정하는 데 쓴다.
  isHourStart: boolean;
}

export interface WeekDay extends Weekday {
  slots: WeekSlot[];
}

const toWeekSlot = (slot: WeekScheduleSlotSource, date: string): WeekSlot => ({
  key: toSlotKey({ date, start: slot.start, end: slot.end }),
  date,
  start: slot.start,
  end: slot.end,
  status: slot.status,
  currentCount: slot.currentCount,
  isHourStart: slot.start.endsWith(":00"),
});

// 응답이 채우지 않은 칸은 잠근다.
// 서버는 하루 18칸을 모두 내려주기로 되어 있으므로, 빠진 칸은 조회 범위 밖이거나 이상 응답이다.
// 신청 불가한 시간이 열려 보이는 것보다 잠겨 보이는 쪽이 안전하다.
const toUnavailableSlot = (
  date: string,
  { start, end }: { start: string; end: string },
): WeekSlot => ({
  key: toSlotKey({ date, start, end }),
  date,
  start,
  end,
  status: "UNAVAILABLE",
  currentCount: 0,
  isHourStart: start.endsWith(":00"),
});

// 날짜별 슬롯을 시작 시각으로 찾을 수 있게 바꾼다.
const toSlotsByStart = (slots: WeekScheduleSlotSource[]) =>
  new Map(slots.map((slot) => [slot.start, slot]));

// 응답을 요일 5칸 × 시간 18칸의 표 모양으로 채운다.
// 날짜로 맞추므로 응답이 며칠치만 오더라도 표 모양은 그대로 유지된다.
export const buildWeekSchedule = (
  source: WeekScheduleSource,
  weekdays: Weekday[],
): WeekDay[] =>
  weekdays.map((weekday) => {
    const day = source.days.find(({ date }) => date === weekday.date);
    const slotsByStart = toSlotsByStart(day?.slots ?? []);

    return {
      ...weekday,
      slots: SLOT_TIMES.map((slotTime) => {
        const slot = slotsByStart.get(slotTime.start);

        return slot
          ? toWeekSlot(slot, weekday.date)
          : toUnavailableSlot(weekday.date, slotTime);
      }),
    };
  });

// 이번 달에 속한 날짜의 슬롯만 한 줄로 편다. 근무시간 합계·최소근무시간 검사에 쓴다.
export const getCurrentMonthSlots = (days: WeekDay[]): WeekSlot[] =>
  days.filter((day) => day.isCurrentMonth).flatMap((day) => day.slots);

// 이번 달에 속한 날짜 목록. 주 단위 근무시간을 걸러 낼 때 쓴다.
export const getCurrentMonthDates = (days: WeekDay[]): string[] =>
  days.filter((day) => day.isCurrentMonth).map((day) => day.date);
