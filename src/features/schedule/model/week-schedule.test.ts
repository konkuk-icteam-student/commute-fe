import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { WeekScheduleSource } from "./week-schedule";

const {
  buildWeekSchedule,
  EMPTY_SCHEDULE,
  getCurrentMonthSlots,
  getCurrentMonthDates,
} = (await import(
  new URL("./week-schedule.ts", import.meta.url).href
)) as typeof import("./week-schedule");
const { toSlotKey } = (await import(
  new URL("./slot-key.ts", import.meta.url).href
)) as typeof import("./slot-key");
const { SLOT_TIMES, SLOTS_PER_DAY } = (await import(
  new URL("../constants/slot.ts", import.meta.url).href
)) as typeof import("../constants/slot");
const { getWeekdaysOfMonthWeek } = (await import(
  new URL("../../../lib/date-formatter.ts", import.meta.url).href
)) as typeof import("../../../lib/date-formatter");

// 2026년 7월 1주차는 6/29~7/03이라 이번 달이 아닌 날짜가 섞인다.
const MIXED_MONTH_WEEKDAYS = getWeekdaysOfMonthWeek(2026, 7, 1);
// 2026년 8월 1주차는 8/03~8/07로 모두 이번 달 안에 있다.
const SAME_MONTH_WEEKDAYS = getWeekdaysOfMonthWeek(2026, 8, 1);

// 지정한 날짜들에 대해 하루 18칸을 모두 채운 응답을 만든다.
const sourceOf = (dates: string[]): WeekScheduleSource => ({
  maxConcurrentWorkers: 4,
  days: dates.map((date) => ({
    date,
    slots: SLOT_TIMES.map(({ start, end }) => ({
      start,
      end,
      status: "EMPTY" as const,
      currentCount: 1,
    })),
  })),
});

describe("SLOT_TIMES", () => {
  it("09:00부터 30분 단위로 하루치 칸을 만든다", () => {
    assert.equal(SLOT_TIMES.length, SLOTS_PER_DAY);
    assert.deepEqual(SLOT_TIMES[0], { start: "09:00", end: "09:30" });
    assert.deepEqual(SLOT_TIMES[1], { start: "09:30", end: "10:00" });
    assert.deepEqual(SLOT_TIMES.at(-1), { start: "17:30", end: "18:00" });
  });
});

describe("buildWeekSchedule", () => {
  it("요일 5칸과 하루 18칸을 언제나 유지한다", () => {
    const days = buildWeekSchedule(
      sourceOf(SAME_MONTH_WEEKDAYS.map(({ date }) => date)),
      SAME_MONTH_WEEKDAYS,
    );

    assert.equal(days.length, SAME_MONTH_WEEKDAYS.length);
    days.forEach((day) => assert.equal(day.slots.length, SLOTS_PER_DAY));
  });

  it("응답의 날짜와 시작 시각으로 칸을 채운다", () => {
    const [monday] = SAME_MONTH_WEEKDAYS;
    const source: WeekScheduleSource = {
      maxConcurrentWorkers: 4,
      days: [
        {
          date: monday.date,
          slots: [
            {
              start: "10:00",
              end: "10:30",
              status: "MY_SCHEDULE",
              currentCount: 3,
            },
          ],
        },
      ],
    };

    const [firstDay] = buildWeekSchedule(source, SAME_MONTH_WEEKDAYS);
    const filled = firstDay.slots.find((slot) => slot.start === "10:00");

    assert.equal(filled?.status, "MY_SCHEDULE");
    assert.equal(filled?.currentCount, 3);
    assert.equal(filled?.date, monday.date);
  });

  // 서버가 일부 칸만 내려주더라도 표가 무너지면 안 된다.
  it("응답에 없는 칸은 UNAVAILABLE 0명으로 채운다", () => {
    const [monday] = SAME_MONTH_WEEKDAYS;
    const source: WeekScheduleSource = {
      maxConcurrentWorkers: 4,
      days: [
        {
          date: monday.date,
          slots: [
            { start: "10:00", end: "10:30", status: "EMPTY", currentCount: 0 },
          ],
        },
      ],
    };

    const [firstDay] = buildWeekSchedule(source, SAME_MONTH_WEEKDAYS);
    const missing = firstDay.slots.find((slot) => slot.start === "09:00");

    assert.equal(firstDay.slots.length, SLOTS_PER_DAY);
    assert.equal(missing?.status, "UNAVAILABLE");
    assert.equal(missing?.currentCount, 0);
  });

  // 조회 범위를 이번 달로 자르면 6/29, 6/30은 응답에 들어 있지 않다.
  it("응답에 없는 날짜는 하루 전체가 잠긴 상태가 된다", () => {
    const currentMonthDates = MIXED_MONTH_WEEKDAYS.filter(
      ({ isCurrentMonth }) => isCurrentMonth,
    ).map(({ date }) => date);

    const days = buildWeekSchedule(
      sourceOf(currentMonthDates),
      MIXED_MONTH_WEEKDAYS,
    );

    const [previousMonthDay] = days;

    assert.equal(previousMonthDay.isCurrentMonth, false);
    assert.equal(previousMonthDay.slots.length, SLOTS_PER_DAY);
    previousMonthDay.slots.forEach((slot) => {
      assert.equal(slot.status, "UNAVAILABLE");
      assert.equal(slot.currentCount, 0);
    });
  });

  it("빈 시간표를 넘기면 모든 칸이 잠긴다", () => {
    const days = buildWeekSchedule(EMPTY_SCHEDULE, SAME_MONTH_WEEKDAYS);

    assert.equal(days.length, SAME_MONTH_WEEKDAYS.length);
    days.forEach((day) => {
      assert.equal(day.slots.length, SLOTS_PER_DAY);
      day.slots.forEach((slot) => assert.equal(slot.status, "UNAVAILABLE"));
    });
  });

  it("슬롯 키가 표시 날짜 기준으로 만들어져 주차마다 달라진다", () => {
    const firstWeek = buildWeekSchedule(
      sourceOf(MIXED_MONTH_WEEKDAYS.map(({ date }) => date)),
      MIXED_MONTH_WEEKDAYS,
    );
    const secondWeek = buildWeekSchedule(
      sourceOf(SAME_MONTH_WEEKDAYS.map(({ date }) => date)),
      SAME_MONTH_WEEKDAYS,
    );

    assert.equal(firstWeek[0].slots[0].key, toSlotKey(firstWeek[0].slots[0]));
    assert.notEqual(firstWeek[0].slots[0].key, secondWeek[0].slots[0].key);
  });

  it("정시 슬롯에만 isHourStart를 켠다", () => {
    const [monday] = buildWeekSchedule(
      sourceOf(SAME_MONTH_WEEKDAYS.map(({ date }) => date)),
      SAME_MONTH_WEEKDAYS,
    );

    monday.slots.forEach((slot) => {
      assert.equal(slot.isHourStart, slot.start.endsWith(":00"));
    });
  });
});

describe("getCurrentMonthSlots / getCurrentMonthDates", () => {
  it("이번 달이 아닌 날짜는 걸러 낸다", () => {
    const days = buildWeekSchedule(
      sourceOf(MIXED_MONTH_WEEKDAYS.map(({ date }) => date)),
      MIXED_MONTH_WEEKDAYS,
    );
    const legacyDates = MIXED_MONTH_WEEKDAYS.filter(
      ({ isCurrentMonth }) => isCurrentMonth,
    ).map(({ date }) => date);

    assert.deepEqual(getCurrentMonthDates(days), legacyDates);
    assert.equal(
      getCurrentMonthSlots(days).length,
      legacyDates.length * SLOTS_PER_DAY,
    );
  });
});
