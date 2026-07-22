import type {
  WorkRequestFormValues,
  WorkRequestSettingsPayload,
} from "../types";

const pad2 = (value: number) => String(value).padStart(2, "0");
const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

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

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const monthDayMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})$/);

  if (!monthDayMatch) {
    return trimmed;
  }

  const [, month, day] = monthDayMatch;

  return `${target.year}-${pad2(Number(month))}-${pad2(Number(day))}`;
}

export function formatWorkRequestDateLabel(date: string) {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

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

  const hourMatch = value.match(/(\d+)시간/);
  const minuteMatch = value.match(/(\d+)분/);
  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;

  return hours * 60 + minutes;
}

export function parseWorkRequestWorkerCount(value: string) {
  return Number(value.replace(/[^0-9]/g, ""));
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

  if (!trimmedStart || !trimmedEnd) {
    return null;
  }

  return { end: trimmedEnd, start: trimmedStart };
}

export function isWorkRequestStartReady(formValues: WorkRequestFormValues) {
  return [
    formValues.applyStartDate,
    formValues.applyEndDate,
    formValues.maxConcurrentWorkers,
    formValues.minWorkUnitMinutes,
    formValues.weeklyMinMinutes,
    formValues.weeklyMaxMinutes,
    formValues.monthlyMinMinutes,
    formValues.monthlyMaxMinutes,
  ].every((value) => value.trim().length > 0);
}

export function createWorkRequestSettingsPayload({
  formValues,
  target,
}: {
  formValues: WorkRequestFormValues;
  target: { month: number; year: number };
}): WorkRequestSettingsPayload {
  return {
    applyEndDate: formatWorkRequestDate(formValues.applyEndDate, target),
    applyStartDate: formatWorkRequestDate(formValues.applyStartDate, target),
    maxConcurrentWorkers: parseWorkRequestWorkerCount(
      formValues.maxConcurrentWorkers,
    ),
    minWorkUnitMinutes: parseWorkRequestMinutes(formValues.minWorkUnitMinutes),
    monthlyMaxMinutes: parseWorkRequestMinutes(formValues.monthlyMaxMinutes),
    monthlyMinMinutes: parseWorkRequestMinutes(formValues.monthlyMinMinutes),
    unavailableDates: formValues.unavailableDates,
    unavailableTimeRanges: formValues.unavailableTimeRanges,
    weeklyMaxMinutes: parseWorkRequestMinutes(formValues.weeklyMaxMinutes),
    weeklyMinMinutes: parseWorkRequestMinutes(formValues.weeklyMinMinutes),
  };
}
