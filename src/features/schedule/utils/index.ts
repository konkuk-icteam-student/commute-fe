import type {
  ScheduleApplyPayload,
  ScheduleChangeHistorySlot,
  ScheduleRequestEditStatus,
  ScheduleSlot,
  ScheduleSlotStatus,
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

// "M.DD" 형식의 날짜 라벨에서 월 숫자를 추출합니다.
export const getMonthFromDateLabel = (dateLabel: string) =>
  Number(dateLabel.split(".")[0]);

// "M.DD" 형식의 날짜 라벨을 YYYY-MM-DD 날짜 문자열로 변환합니다.
export const getDateStringFromDateLabel = (year: number, dateLabel: string) => {
  const [month, day] = dateLabel.split(".");

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// 오늘 기준 다음 달 1일 Date 객체를 반환합니다.
export const getFirstDateOfNextMonth = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth() + 1, 1);
};

// YYYY-MM-DD 날짜 문자열이 기준 날짜보다 이전 날짜인지 확인합니다.
export const isBeforeDate = (date: string, baseDate: Date) => {
  const [year, month, day] = date.split("-").map(Number);
  const scheduleDate = new Date(year, month - 1, day);
  const normalizedBaseDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
  );

  return scheduleDate.getTime() < normalizedBaseDate.getTime();
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

// 스케줄 슬롯에서 API 요청에 필요한 시간 정보만 추출합니다.
const toSlotTime = ({ date, start, end }: ScheduleSlot): ScheduleSlotTime => ({
  date,
  start,
  end,
});

// 두 슬롯 시간 정보가 같은 날짜와 시작/종료 시간을 가리키는지 비교합니다.
const isSameSlotTime = (slot: ScheduleSlotTime, targetSlot: ScheduleSlotTime) =>
  slot.date === targetSlot.date &&
  slot.start === targetSlot.start &&
  slot.end === targetSlot.end;

// 슬롯 시간 목록에 대상 슬롯 시간이 포함되어 있는지 확인합니다.
const hasSlotTime = (slots: ScheduleSlotTime[], targetSlot: ScheduleSlotTime) =>
  slots.some((slot) => isSameSlotTime(slot, targetSlot));

// 슬롯 시간 목록에서 대상 슬롯 시간을 제거합니다.
const removeSlotTime = (
  slots: ScheduleSlotTime[],
  targetSlot: ScheduleSlotTime,
) => slots.filter((slot) => !isSameSlotTime(slot, targetSlot));

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

export const getRequestEditSlotDisabled = (
  slot: ScheduleSlot,
  payload: ScheduleApplyPayload,
  maxConcurrentWorkers?: number,
  maxAddHours = getSlotTimesTotalHours(payload.deleteSlots),
) => {
  const slotTime = toSlotTime(slot);

  if (
    slot.status === "PENDING_ADD" ||
    slot.status === "PENDING_DELETE" ||
    slot.status === "UNAVAILABLE"
  ) {
    return true;
  }

  if (slot.status !== "EMPTY") {
    return false;
  }

  if (hasSlotTime(payload.addSlots, slotTime)) {
    return false;
  }

  if (
    maxConcurrentWorkers !== undefined &&
    slot.currentCount >= maxConcurrentWorkers
  ) {
    return true;
  }

  return getSlotTimesTotalHours([...payload.addSlots, slotTime]) > maxAddHours;
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

// 신청 payload의 addSlots와 deleteSlots를 각각 이어진 시간 단위로 병합합니다.
export const hasSlotTimesBelowMinSessionHours = (
  slots: ScheduleSlotTime[],
  minSessionHours: number,
) =>
  mergeContinuousSlotTimes(slots).some(
    (slot) => getSlotTimesTotalHours([slot]) < minSessionHours,
  );

export const getMergedApplyPayload = (
  payload: ScheduleApplyPayload,
): ScheduleApplyPayload => ({
  deleteSlots: mergeContinuousSlotTimes(payload.deleteSlots),
  addSlots: mergeContinuousSlotTimes(payload.addSlots),
});

// 신청 화면에서 슬롯 클릭에 따라 addSlots/deleteSlots를 토글합니다.
export const toggleApplySlotChange = (
  payload: ScheduleApplyPayload,
  slot: ScheduleSlot,
  maxConcurrentWorkers?: number,
): ScheduleApplyPayload => {
  const slotTime = toSlotTime(slot);

  if (slot.status === "MY_SCHEDULE") {
    return {
      ...payload,
      deleteSlots: hasSlotTime(payload.deleteSlots, slotTime)
        ? removeSlotTime(payload.deleteSlots, slotTime)
        : [...payload.deleteSlots, slotTime],
    };
  }

  if (slot.status === "EMPTY") {
    if (
      maxConcurrentWorkers !== undefined &&
      slot.currentCount >= maxConcurrentWorkers &&
      !hasSlotTime(payload.addSlots, slotTime)
    ) {
      return payload;
    }

    return {
      ...payload,
      addSlots: hasSlotTime(payload.addSlots, slotTime)
        ? removeSlotTime(payload.addSlots, slotTime)
        : [...payload.addSlots, slotTime],
    };
  }

  return payload;
};

// 수정 요청 화면에서 슬롯 클릭에 따라 addSlots/deleteSlots를 토글합니다.
export const toggleRequestEditSlotChange = (
  payload: ScheduleApplyPayload,
  slot: ScheduleSlot,
  maxConcurrentWorkers?: number,
  maxAddHours?: number,
): ScheduleApplyPayload => {
  const slotTime = toSlotTime(slot);

  if (
    slot.status === "PENDING_ADD" ||
    slot.status === "PENDING_DELETE" ||
    slot.status === "UNAVAILABLE"
  ) {
    return payload;
  }

  if (slot.status === "EMPTY") {
    if (
      getRequestEditSlotDisabled(
        slot,
        payload,
        maxConcurrentWorkers,
        maxAddHours,
      )
    ) {
      return payload;
    }

    return {
      ...payload,
      addSlots: hasSlotTime(payload.addSlots, slotTime)
        ? removeSlotTime(payload.addSlots, slotTime)
        : [...payload.addSlots, slotTime],
    };
  }

  return {
    ...payload,
    deleteSlots: hasSlotTime(payload.deleteSlots, slotTime)
      ? removeSlotTime(payload.deleteSlots, slotTime)
      : [...payload.deleteSlots, slotTime],
  };
};

// 수정 요청 내역을 반영해 화면에 표시할 요청 상태를 계산합니다.
export const getRequestEditSlotStatus = (
  slot: ScheduleSlot,
  payload: ScheduleApplyPayload,
): ScheduleRequestEditStatus | undefined => {
  const slotTime = toSlotTime(slot);

  if (hasSlotTime(payload.deleteSlots, slotTime)) {
    return "REQUEST_DELETE";
  }

  if (hasSlotTime(payload.addSlots, slotTime)) {
    return "REQUEST_ADD";
  }

  return undefined;
};

// 신청 변경 내역을 반영해 화면에 표시할 슬롯 상태를 계산합니다.
export const getApplySlotStatus = (
  slot: ScheduleSlot,
  payload: ScheduleApplyPayload,
): ScheduleSlotStatus => {
  const slotTime = toSlotTime(slot);

  if (hasSlotTime(payload.deleteSlots, slotTime)) {
    return "EMPTY";
  }

  if (hasSlotTime(payload.addSlots, slotTime)) {
    return "MY_SCHEDULE";
  }

  return slot.status;
};

// 신청 변경 내역을 반영해 화면에 표시할 슬롯 인원을 계산합니다.
export const getAppliedScheduleSlotTimes = (
  slots: ScheduleSlot[],
  payload: ScheduleApplyPayload,
) =>
  slots
    .filter((slot) => getApplySlotStatus(slot, payload) === "MY_SCHEDULE")
    .map(toSlotTime);

export const getApplySlotCurrentCount = (
  slot: ScheduleSlot,
  payload: ScheduleApplyPayload,
) => {
  const slotTime = toSlotTime(slot);

  if (hasSlotTime(payload.deleteSlots, slotTime)) {
    return Math.max(0, slot.currentCount - 1);
  }

  if (hasSlotTime(payload.addSlots, slotTime)) {
    return slot.currentCount + 1;
  }

  return slot.currentCount;
};
