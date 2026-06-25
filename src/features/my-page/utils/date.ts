const parseIsoDateTime = (dateTime: string) => {
  const [date, time] = dateTime.split("T");
  const [year, month, day] = date.split("-").map(Number);

  return {
    year,
    month,
    day,
    time: time.slice(0, 5),
  };
};

export const formatWorktimeHistoryRequestedAt = (requestedAt: string) => {
  const { year, month, day, time } = parseIsoDateTime(requestedAt);

  return `신청 ${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${time}`;
};

export const formatWorktimeHistoryProcessedAt = (processedAt: string) => {
  const { month, day, time } = parseIsoDateTime(processedAt);

  return `처리 ${month}월 ${day}일 ${time}`;
};

export const formatWorktimeHistoryPeriod = (year: number, month: number) => {
  const lastDate = new Date(year, month, 0).getDate();
  const paddedMonth = String(month).padStart(2, "0");

  return `${year}. ${paddedMonth}.01 ~ ${year}.${paddedMonth}.${lastDate}`;
};
