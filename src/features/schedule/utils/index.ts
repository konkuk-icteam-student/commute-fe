import type {
  ScheduleApplyPayload,
  ScheduleChangeHistorySlot,
  ScheduleSlot,
  ScheduleSlotTime,
} from "../types";

// 슬롯 목록을 하루 단위 개수로 나눠 날짜별 배열로 묶습니다.
export const chunkScheduleSlots = (
  slots: ScheduleSlot[],
  slotsPerDay: number,
) => {
  if (!Number.isInteger(slotsPerDay) || slotsPerDay <= 0) {
    throw new RangeError("하루 슬롯 개수는 양의 정수여야 합니다.");
  }

  return Array.from(
    { length: Math.ceil(slots.length / slotsPerDay) },
    (_, index) => slots.slice(index * slotsPerDay, (index + 1) * slotsPerDay),
  );
};

// 오늘 기준 다음 달 1일 Date 객체를 반환합니다.
export const getFirstDateOfNextMonth = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth() + 1, 1);
};

// 기준일이 근로 신청 기간 안에 있는지 판단합니다. 날짜는 모두 "YYYY-MM-DD"라 문자열끼리 비교합니다.
// 기간이 설정되지 않은 달은 두 날짜가 비어 오므로 기간 밖으로 봅니다.
export const isWithinApplyPeriod = (
  date: string,
  period?: { applyStartDate: string | null; applyEndDate: string | null },
) => {
  if (!period?.applyStartDate || !period.applyEndDate) {
    return false;
  }

  return period.applyStartDate <= date && date <= period.applyEndDate;
};

const parseIsoDateTime = (dateTime: string) => {
  const [date, time] = dateTime.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.slice(0, 5).split(":").map(Number);

  return {
    year,
    month,
    day,
    hour,
    minute,
    totalMinutes:
      new Date(year, month - 1, day, hour, minute).getTime() / 60000,
  };
};

const formatDurationHours = (durationMinutes: number) => {
  const durationHours = durationMinutes / 60;

  return Number.isInteger(durationHours)
    ? String(durationHours)
    : String(durationHours);
};

export const formatScheduleChangeHistorySlot = ({
  start,
  end,
}: ScheduleChangeHistorySlot) => {
  const startDateTime = parseIsoDateTime(start);
  const endDateTime = parseIsoDateTime(end);
  const durationHours = formatDurationHours(
    endDateTime.totalMinutes - startDateTime.totalMinutes,
  );

  return `${startDateTime.month}월 ${startDateTime.day}일 ${start.slice(11, 16)}-${end.slice(11, 16)} (${durationHours}h)`;
};

const getTimeMinutes = (time: string) => {
  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new Error(`Invalid time format: ${time}`);
  }
  const [hour, minute] = time.split(":").map(Number);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error(`Invalid time value: ${time}`);
  }

  return hour * 60 + minute;
};

export const getSlotTimesTotalHours = (slots: ScheduleSlotTime[]) =>
  slots.reduce(
    (totalMinutes, slot) =>
      totalMinutes + getTimeMinutes(slot.end) - getTimeMinutes(slot.start),
    0,
  ) / 60;

export const getSlotTimesTotalHoursOnWeek = (
  slots: ScheduleSlotTime[],
  dates: string[],
) => {
  const dateSet = new Set(dates);

  return getSlotTimesTotalHours(slots.filter((slot) => dateSet.has(slot.date)));
};

// 같은 날짜의 이어진 슬롯 시간들을 하나의 시간 구간으로 병합합니다.
export const mergeContinuousSlotTimes = (slots: ScheduleSlotTime[]) => {
  const sortedSlots = [...slots].sort((leftSlot, rightSlot) => {
    if (leftSlot.date !== rightSlot.date) {
      return leftSlot.date.localeCompare(rightSlot.date);
    }

    return leftSlot.start.localeCompare(rightSlot.start);
  });

  return sortedSlots.reduce<ScheduleSlotTime[]>((mergedSlots, slot) => {
    const lastSlot = mergedSlots.at(-1);

    if (
      lastSlot &&
      lastSlot.date === slot.date &&
      lastSlot.end === slot.start
    ) {
      lastSlot.end = slot.end;
      return mergedSlots;
    }

    return [...mergedSlots, { ...slot }];
  }, []);
};

// 이어 붙인 근무 구간 중 최소 근무시간에 못 미치는 것이 있는지 확인합니다.
export const hasSlotTimesBelowMinSessionHours = (
  slots: ScheduleSlotTime[],
  minSessionHours: number,
) =>
  mergeContinuousSlotTimes(slots).some(
    (slot) => getSlotTimesTotalHours([slot]) < minSessionHours,
  );

// 신청 payload의 addSlots와 deleteSlots를 각각 이어진 시간 단위로 병합합니다.
export const getMergedApplyPayload = (
  payload: ScheduleApplyPayload,
): ScheduleApplyPayload => ({
  deleteSlots: mergeContinuousSlotTimes(payload.deleteSlots),
  addSlots: mergeContinuousSlotTimes(payload.addSlots),
});
