import type {
  WorkRequestFormValues,
  WorkRequestSettingsPayload,
} from "../types";

const pad2 = (value: number) => String(value).padStart(2, "0");
const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];
const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const initialWorkRequestFormValues: WorkRequestFormValues = {
  applyEndDate: "",
  applyStartDate: "",
  maxConcurrentWorkers: "",
  minWorkUnitMinutes: "",
  monthlyMaxMinutes: "",
  monthlyMinMinutes: "",
  unavailableDateInput: "",
  unavailableDates: [],
  unavailableTimeRangeEndInput: "",
  unavailableTimeRangeStartInput: "",
  unavailableTimeRanges: [],
  weeklyMaxMinutes: "",
  weeklyMinMinutes: "",
};

export function getNextWorkRequestMonth(date = new Date()) {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const year = nextMonth.getFullYear();
  const month = nextMonth.getMonth() + 1;

  return {
    label: `${year}년 ${month}월`,
    month,
    year,
  };
}

export function formatWorkRequestDate(
  value: string,
  target: { month: number; year: number },
) {
  const trimmed = value.trim();

  if (isValidDateString(trimmed)) {
    return trimmed;
  }

  const monthDayMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})$/);

  if (!monthDayMatch) {
    return "";
  }

  const [, month, day] = monthDayMatch;
  const formatted = `${target.year}-${pad2(Number(month))}-${pad2(Number(day))}`;

  return isValidDateString(formatted) ? formatted : "";
}

export function formatWorkRequestDateLabel(date: string) {
  const match = date.match(datePattern);

  if (!match) {
    return date;
  }

  const [, year, month, day] = match;
  const weekday =
    weekdayLabels[
      new Date(Number(year), Number(month) - 1, Number(day)).getDay()
    ];

  return `${year}.${month}.${day} (${weekday})`;
}

export function parseWorkRequestMinutes(value: string) {
  const trimmed = value.trim();

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed) * 60;
  }

  const minuteOnlyMatch = trimmed.match(/^(\d+)분$/);

  if (minuteOnlyMatch) {
    return Number(minuteOnlyMatch[1]);
  }

  const hourMatch = trimmed.match(/^(\d+)시간(?:\s+(\d+)분)?$/);

  if (!hourMatch) {
    return null;
  }

  const hours = Number(hourMatch[1]);
  const minutes = hourMatch[2] ? Number(hourMatch[2]) : 0;

  const totalMinutes = hours * 60 + minutes;

  return totalMinutes || null;
}

export function parseWorkRequestWorkerCount(value: string) {
  const count = Number(value.replace(/[^0-9]/g, ""));

  return count > 0 ? count : null;
}

export function parseTimeRangeInput({
  end,
  start,
}: {
  end: string;
  start: string;
}) {
  const trimmedStart = start.trim();
  const trimmedEnd = end.trim();

  if (
    !timePattern.test(trimmedStart) ||
    !timePattern.test(trimmedEnd) ||
    timeToMinutes(trimmedStart) >= timeToMinutes(trimmedEnd)
  ) {
    return null;
  }

  return { end: trimmedEnd, start: trimmedStart };
}

export function isWorkRequestStartReady({
  formValues,
  target,
}: {
  formValues: WorkRequestFormValues;
  target: { month: number; year: number };
}) {
  const payload = createWorkRequestSettingsPayload({
    formValues,
    target,
  });

  return payload !== null;
}

export function createWorkRequestSettingsPayload({
  formValues,
  target,
}: {
  formValues: WorkRequestFormValues;
  target: { month: number; year: number };
}): WorkRequestSettingsPayload | null {
  const applyStartDate = formatWorkRequestDate(
    formValues.applyStartDate,
    target,
  );
  const applyEndDate = formatWorkRequestDate(formValues.applyEndDate, target);
  const maxConcurrentWorkers = parseWorkRequestWorkerCount(
    formValues.maxConcurrentWorkers,
  );
  const minWorkUnitMinutes = parseWorkRequestMinutes(
    formValues.minWorkUnitMinutes,
  );
  const weeklyMinMinutes = parseWorkRequestMinutes(formValues.weeklyMinMinutes);
  const weeklyMaxMinutes = parseWorkRequestMinutes(formValues.weeklyMaxMinutes);
  const monthlyMinMinutes = parseWorkRequestMinutes(
    formValues.monthlyMinMinutes,
  );
  const monthlyMaxMinutes = parseWorkRequestMinutes(
    formValues.monthlyMaxMinutes,
  );

  if (
    !applyStartDate ||
    !applyEndDate ||
    !maxConcurrentWorkers ||
    !minWorkUnitMinutes ||
    weeklyMinMinutes === null ||
    weeklyMaxMinutes === null ||
    monthlyMinMinutes === null ||
    monthlyMaxMinutes === null ||
    applyStartDate > applyEndDate ||
    weeklyMinMinutes > weeklyMaxMinutes ||
    monthlyMinMinutes > monthlyMaxMinutes ||
    !formValues.unavailableDates.every(isValidDateString) ||
    !formValues.unavailableTimeRanges.every((timeRange) =>
      parseTimeRangeInput(timeRange),
    )
  ) {
    return null;
  }

  return {
    applyEndDate,
    applyStartDate,
    maxConcurrentWorkers,
    minWorkUnitMinutes,
    monthlyMaxMinutes,
    monthlyMinMinutes,
    unavailableDates: formValues.unavailableDates,
    unavailableTimeRanges: formValues.unavailableTimeRanges,
    weeklyMaxMinutes,
    weeklyMinMinutes,
  };
}

function isValidDateString(value: string) {
  const match = value.match(datePattern);

  if (!match) {
    return false;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return (
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
  );
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}
