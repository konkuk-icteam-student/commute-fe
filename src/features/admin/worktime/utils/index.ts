export interface WorktimeType {
  date: string;
  start: string;
  end: string;
}

function formatMonthDay(date: string) {
  const [, month, day] = date.split("-");

  return `${Number(month)}월 ${Number(day)}일`;
}

function getMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

function formatDurationHour(start: string, end: string) {
  const durationHour = (getMinutes(end) - getMinutes(start)) / 60;

  return String(durationHour);
}

// ISO datetime 문자열을 9월 13일 13:45 형식으로 포맷
export function formatWorktimeRequestDateTime(dateTime: string) {
  const [date, time] = dateTime.split("T");

  return `${formatMonthDay(date)} ${time.slice(0, 5)}`;
}

// WorktimeType 의 객체를 4월 6일 13:00-14:30 (0.5h) 형식으로 포맷
export function formatWorktimeRequestSlot({ date, start, end }: WorktimeType) {
  return `${formatMonthDay(date)} ${start}-${end} (${formatDurationHour(start, end)}h)`;
}
