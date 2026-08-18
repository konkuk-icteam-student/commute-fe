const WEEKDAY_LABELS = ["월", "화", "수", "목", "금"] as const;
const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;

// 해당 날짜가 속한 주의 월요일 반환
const getMondayOfWeek = (date: Date) => {
  const day = date.getDay(); // 일=0, 월=1...
  const diffToMonday = day === 0 ? -6 : 1 - day;

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + diffToMonday,
  );
};

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

// 해당 월의 첫 평일(월~금) 반환
const getFirstWeekdayOfMonth = (year: number, monthIndex: number) => {
  const date = new Date(year, monthIndex, 1);

  while (isWeekend(date)) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

// 해당 월의 마지막 평일(월~금) 반환
const getLastWeekdayOfMonth = (year: number, monthIndex: number) => {
  const date = new Date(year, monthIndex + 1, 0);

  while (isWeekend(date)) {
    date.setDate(date.getDate() - 1);
  }

  return date;
};

const getWeekDiff = (fromMonday: Date, toMonday: Date) =>
  Math.round((toMonday.getTime() - fromMonday.getTime()) / MS_PER_WEEK);

// 시간표는 월~금만 보여주므로 평일이 하나도 없는 주는 그 달의 주차로 세지 않는다.
// 첫 평일이 속한 주가 1주차, 마지막 평일이 속한 주가 maxWeek.
const getFirstWeekMonday = (year: number, monthIndex: number) =>
  getMondayOfWeek(getFirstWeekdayOfMonth(year, monthIndex));

// Date 객체의 년,월,몇주차인지 반환
export const getMonthWeekOfDate = (date: Date) => {
  const year = date.getFullYear();
  const monthIndex = date.getMonth(); // 0~11

  const firstWeekMonday = getFirstWeekMonday(year, monthIndex);
  const lastWeekMonday = getMondayOfWeek(
    getLastWeekdayOfMonth(year, monthIndex),
  );

  const maxWeek = getWeekDiff(firstWeekMonday, lastWeekMonday) + 1;
  const week = getWeekDiff(firstWeekMonday, getMondayOfWeek(date)) + 1;

  return {
    year,
    month: monthIndex + 1,
    // 1일이 토/일인 달에서는 그 주말이 1주차 이전에 놓이므로 범위 안으로 보정
    week: Math.min(Math.max(week, 1), maxWeek),
    maxWeek,
  };
};

// 주 단위 이동 반환
export const shiftDateByWeeks = (date: Date, weekOffset: number) => {
  const shiftedDate = new Date(date);
  shiftedDate.setDate(date.getDate() + weekOffset * 7);

  return shiftedDate;
};

// 해당 주차의 월요일 Date 반환 (month: 1~12)
export const getMondayOfMonthWeek = (
  year: number,
  month: number,
  week: number,
) => {
  const firstWeekMonday = getFirstWeekMonday(year, month - 1);

  return new Date(
    firstWeekMonday.getFullYear(),
    firstWeekMonday.getMonth(),
    firstWeekMonday.getDate() + (week - 1) * 7,
  );
};

// 해당 주차가 가지는 요일,월,일 반환
export const getWeekdaysOfMonthWeek = (
  year: number,
  month: number,
  week: number,
) => {
  // month: 1~12
  const targetMonday = getMondayOfMonthWeek(year, month, week);

  return WEEKDAY_LABELS.map((label, index) => {
    const date = new Date(
      targetMonday.getFullYear(),
      targetMonday.getMonth(),
      targetMonday.getDate() + index,
    );

    return {
      label,
      dateLabel: formatDateLabel(date),
      date: formatDateString(date),
      isCurrentMonth:
        date.getFullYear() === year && date.getMonth() === month - 1,
    };
  });
};

// 해당 주차에서 이번 달에 속한 날짜의 시작·끝을 반환 (month: 1~12)
// 주차는 달을 넘나들 수 있지만 시간표 조회 api는 같은 달 안의 범위만 받으므로 잘라 낸다.
// 예: 2026년 7월 1주차(6/29~7/03) -> { startDate: "2026-07-01", endDate: "2026-07-03" }
export const getMonthWeekDateRange = (
  year: number,
  month: number,
  week: number,
) => {
  const currentMonthDates = getWeekdaysOfMonthWeek(year, month, week)
    .filter(({ isCurrentMonth }) => isCurrentMonth)
    .map(({ date }) => date);

  return {
    startDate: currentMonthDates[0],
    endDate: currentMonthDates[currentMonthDates.length - 1],
  };
};

// 화면 표시용 "M.DD"
function formatDateLabel(date: Date) {
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}.${day}`;
}

// 데이터 식별용 "YYYY-MM-DD"
export function formatDateString(date: Date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
