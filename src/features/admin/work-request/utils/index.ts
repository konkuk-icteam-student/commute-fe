import type {
  ConfiguredWorkApplicationSettings,
  GetWorkApplicationSettingsResponse,
  WorkApplicationSettings,
} from "@/apis/admin/work-application-settings";

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

// 아래 format* 함수들은 parseWorkRequest* 의 역방향이다. 서버가 준 분 단위 숫자를
// 그대로 입력창에 넣으면 다시 저장할 때 값이 달라지므로, 파서가 읽을 수 있는 표기로 되돌린다.
export function formatWorkRequestWorkerCount(count: number) {
  return `${count}명`;
}

// 최소 근무시간 단위는 minimumUnitOptions 의 라벨과 정확히 같아야 선택 상태로 보인다.
export function formatWorkRequestUnitLabel(minutes: number) {
  if (minutes <= 60) {
    return `${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  return restMinutes ? `${hours}시간 ${restMinutes}분` : `${hours}시간`;
}

// 주별·월별 근무 시간 입력창은 "시간" 단위 숫자를 받는다.
export function formatWorkRequestHours(minutes: number) {
  if (minutes % 60 === 0) {
    return String(minutes / 60);
  }

  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  return hours ? `${hours}시간 ${restMinutes}분` : `${restMinutes}분`;
}

// 서버는 시간을 "HH:mm:ss"로 준다. 입력창과 파서는 "HH:mm"만 다루므로 초를 떼어 낸다.
export function formatWorkRequestTime(value: string) {
  const match = value.match(/^(\d{2}:\d{2})(?::\d{2})?$/);

  return match ? match[1] : value;
}

export function formatWorkRequestSummaryRequestedAt(value: string) {
  const match = value.match(
    /^(\d{4})[-.](\d{2})[-.](\d{2})[ T](\d{2}):(\d{2})/,
  );

  if (!match) {
    return value;
  }

  const [, year, month, day, hours, minutes] = match;

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// useQuery가 돌려준 값을 그 자리에서 isConfigured로 판별하면 타입이 좁혀지지 않는다.
// 인자 타입을 명시한 함수 안에서 한 번 걸러 낸다.
export function pickConfiguredWorkApplicationSettings(
  response: GetWorkApplicationSettingsResponse | undefined,
): ConfiguredWorkApplicationSettings | null {
  return response && response.isConfigured ? response : null;
}

export function toWorkRequestFormValues(
  settings: WorkApplicationSettings,
): WorkRequestFormValues {
  return {
    applyEndDate: settings.applyEndDate,
    applyStartDate: settings.applyStartDate,
    maxConcurrentWorkers: formatWorkRequestWorkerCount(
      settings.maxConcurrentWorkers,
    ),
    minWorkUnitMinutes: formatWorkRequestUnitLabel(settings.minWorkUnitMinutes),
    monthlyMaxMinutes: formatWorkRequestHours(settings.monthlyMaxMinutes),
    monthlyMinMinutes: formatWorkRequestHours(settings.monthlyMinMinutes),
    unavailableDateInput: "",
    unavailableDates: settings.unavailableDates,
    unavailableTimeRangeEndInput: "",
    unavailableTimeRangeStartInput: "",
    unavailableTimeRanges: settings.unavailableTimeRanges.map(
      ({ end, start }) => ({
        end: formatWorkRequestTime(end),
        start: formatWorkRequestTime(start),
      }),
    ),
    weeklyMaxMinutes: formatWorkRequestHours(settings.weeklyMaxMinutes),
    weeklyMinMinutes: formatWorkRequestHours(settings.weeklyMinMinutes),
  };
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
  // 어느 경로로 들어온 값이든 초가 붙어 있으면 걸러지지 않도록 여기서도 떼어 낸다.
  const trimmedStart = formatWorkRequestTime(start.trim());
  const trimmedEnd = formatWorkRequestTime(end.trim());

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
  // 검증과 전송이 같은 값을 쓰도록 정규화 결과를 그대로 담아 보낸다.
  const unavailableTimeRanges = formValues.unavailableTimeRanges.map(
    parseTimeRangeInput,
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
    !unavailableTimeRanges.every((timeRange) => timeRange !== null)
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
    unavailableTimeRanges,
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
