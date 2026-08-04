import assert from "node:assert/strict";
import { describe, it } from "node:test";

const { buildWeekSchedule, getCurrentMonthSlots, getCurrentMonthDates } =
  (await import(
    new URL("./week-schedule.ts", import.meta.url).href
  )) as typeof import("./week-schedule");
const { toSlotKey } = (await import(
  new URL("./slot-key.ts", import.meta.url).href
)) as typeof import("./slot-key");
const { chunkScheduleSlots } = (await import(
  new URL("../utils/index.ts", import.meta.url).href
)) as typeof import("../utils");
const { SLOTS_PER_DAY } = (await import(
  new URL("../constants/slot.ts", import.meta.url).href
)) as typeof import("../constants/slot");
const { DUMMY_GET_SCHEDULE } = (await import(
  new URL("../constants/dummy.ts", import.meta.url).href
)) as typeof import("../constants/dummy");
const { getWeekdaysOfMonthWeek } = (await import(
  new URL("../../../lib/date-formatter.ts", import.meta.url).href
)) as typeof import("../../../lib/date-formatter");

// 2026년 7월 1주차는 6/29~7/03이라 이번 달이 아닌 날짜가 섞인다.
const MIXED_MONTH_WEEKDAYS = getWeekdaysOfMonthWeek(2026, 7, 1);
// 2026년 8월 1주차는 8/03~8/07로 모두 이번 달 안에 있다.
const SAME_MONTH_WEEKDAYS = getWeekdaysOfMonthWeek(2026, 8, 1);

describe("buildWeekSchedule", () => {
  it("요일 5칸을 그대로 유지하고 하루치 슬롯 개수를 지킨다", () => {
    const days = buildWeekSchedule(DUMMY_GET_SCHEDULE, SAME_MONTH_WEEKDAYS);

    assert.equal(days.length, SAME_MONTH_WEEKDAYS.length);
    days.forEach((day) => assert.equal(day.slots.length, SLOTS_PER_DAY));
  });

  // 기존 ScheduleTable이 하던 chunk + date 덮어쓰기와 같은 결과여야 한다.
  it("기존 chunkScheduleSlots + date 덮어쓰기와 동일한 결과를 만든다", () => {
    const days = buildWeekSchedule(DUMMY_GET_SCHEDULE, MIXED_MONTH_WEEKDAYS);
    const legacySlotsByDay = chunkScheduleSlots(
      DUMMY_GET_SCHEDULE.slots,
      SLOTS_PER_DAY,
    );

    days.forEach((day, dayIndex) => {
      const weekday = MIXED_MONTH_WEEKDAYS[dayIndex];
      const legacySlots = legacySlotsByDay[dayIndex].map((slot) => ({
        ...slot,
        date: weekday.date,
      }));

      assert.equal(day.date, weekday.date);
      assert.equal(day.isCurrentMonth, weekday.isCurrentMonth);
      day.slots.forEach((slot, slotIndex) => {
        const legacySlot = legacySlots[slotIndex];

        assert.equal(slot.date, legacySlot.date);
        assert.equal(slot.start, legacySlot.start);
        assert.equal(slot.end, legacySlot.end);
        assert.equal(slot.status, legacySlot.status);
        assert.equal(slot.currentCount, legacySlot.currentCount);
      });
    });
  });

  it("슬롯 키가 표시 날짜 기준으로 만들어져 주차마다 달라진다", () => {
    const firstWeek = buildWeekSchedule(
      DUMMY_GET_SCHEDULE,
      MIXED_MONTH_WEEKDAYS,
    );
    const secondWeek = buildWeekSchedule(
      DUMMY_GET_SCHEDULE,
      SAME_MONTH_WEEKDAYS,
    );

    assert.equal(firstWeek[0].slots[0].key, toSlotKey(firstWeek[0].slots[0]));
    assert.notEqual(firstWeek[0].slots[0].key, secondWeek[0].slots[0].key);
  });

  // 기존 ScheduleTable은 index === 0 && start.endsWith(":00") 위치에만 시간 라벨을 그렸다.
  it("정시 슬롯에만 isHourStart를 켠다", () => {
    const [monday] = buildWeekSchedule(DUMMY_GET_SCHEDULE, SAME_MONTH_WEEKDAYS);

    monday.slots.forEach((slot) => {
      assert.equal(slot.isHourStart, slot.start.endsWith(":00"));
    });
  });
});

describe("getCurrentMonthSlots / getCurrentMonthDates", () => {
  // 기존 schedule-edit / schedule-apply 화면의 chunk + flatMap 조립과 같은 결과여야 한다.
  it("기존 화면의 이번 달 슬롯 조립과 동일한 결과를 만든다", () => {
    const legacySlots = chunkScheduleSlots(
      DUMMY_GET_SCHEDULE.slots,
      SLOTS_PER_DAY,
    ).flatMap((slots, index) => {
      const currentWeekday = MIXED_MONTH_WEEKDAYS[index];

      if (currentWeekday === undefined || !currentWeekday.isCurrentMonth) {
        return [];
      }

      const { date } = currentWeekday;

      return slots.map((slot) => ({ ...slot, date }));
    });

    const slots = getCurrentMonthSlots(
      buildWeekSchedule(DUMMY_GET_SCHEDULE, MIXED_MONTH_WEEKDAYS),
    );

    assert.equal(slots.length, legacySlots.length);
    slots.forEach((slot, index) => {
      assert.equal(slot.date, legacySlots[index].date);
      assert.equal(slot.start, legacySlots[index].start);
      assert.equal(slot.end, legacySlots[index].end);
      assert.equal(slot.status, legacySlots[index].status);
      assert.equal(slot.currentCount, legacySlots[index].currentCount);
    });
  });

  it("이번 달이 아닌 날짜는 걸러 낸다", () => {
    const days = buildWeekSchedule(DUMMY_GET_SCHEDULE, MIXED_MONTH_WEEKDAYS);
    const legacyDates = MIXED_MONTH_WEEKDAYS.filter(
      ({ isCurrentMonth }) => isCurrentMonth,
    ).map(({ date }) => date);

    assert.deepEqual(getCurrentMonthDates(days), legacyDates);
  });
});
