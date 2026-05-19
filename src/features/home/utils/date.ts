const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export const formatCurrentDateTime = (date: Date) => {
  const period = date.getHours() >= 12 ? "PM" : "AM";
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekDays[date.getDay()]}) ${period} ${hours}:${minutes}`;
};
