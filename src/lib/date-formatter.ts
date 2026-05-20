// Date 객체의 년,월,몇주차인지 반환
export const getMonthWeekOfDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0~11

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // 월요일 기준 주 시작일 구하기
  const firstDay = firstDayOfMonth.getDay(); // 일=0, 월=1...
  const diffToMonday = firstDay === 0 ? -6 : 1 - firstDay;

  const firstWeekMonday = new Date(firstDayOfMonth);
  firstWeekMonday.setDate(firstDayOfMonth.getDate() + diffToMonday);

  // 현재 날짜가 포함된 주의 월요일
  const currentDay = date.getDay();
  const diffCurrentToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  const currentWeekMonday = new Date(date);
  currentWeekMonday.setDate(date.getDate() + diffCurrentToMonday);

  const diffTime = currentWeekMonday.getTime() - firstWeekMonday.getTime();
  const week = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;

  const lastDay = lastDayOfMonth.getDay();
  const diffLastToMonday = lastDay === 0 ? -6 : 1 - lastDay;

  const lastWeekMonday = new Date(lastDayOfMonth);
  lastWeekMonday.setDate(lastDayOfMonth.getDate() + diffLastToMonday);

  const maxWeek =
    Math.floor(
      (lastWeekMonday.getTime() - firstWeekMonday.getTime()) /
        (1000 * 60 * 60 * 24 * 7),
    ) + 1;

  return {
    year,
    month: month + 1,
    week,
    maxWeek,
  };
};

// 주 단위 이동 반환
export const shiftDateByWeeks = (date: Date, weekOffset: number) => {
  const shiftedDate = new Date(date);
  shiftedDate.setDate(date.getDate() + weekOffset * 7);

  return shiftedDate;
};

// 해당 주차가 가지는 요일,월,일 반환
export const getWeekdaysOfMonthWeek = (
  year: number,
  month: number,
  week: number,
) => {
  // month: 1~12
  const firstDayOfMonth = new Date(year, month - 1, 1);

  // JS getDay(): 일=0, 월=1, ..., 토=6
  const day = firstDayOfMonth.getDay();

  // 월요일 기준으로 보정
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const firstMonday = new Date(firstDayOfMonth);
  firstMonday.setDate(firstDayOfMonth.getDate() + diffToMonday);

  const targetMonday = new Date(firstMonday);
  targetMonday.setDate(firstMonday.getDate() + (week - 1) * 7);

  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(targetMonday);
    date.setDate(targetMonday.getDate() + index);

    return {
      label: ["월", "화", "수", "목", "금"][index],
      date: formatDate(date),
    };
  });
};

function formatDate(date: Date) {
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}.${day}`;
}
