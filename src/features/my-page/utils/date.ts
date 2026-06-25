const parseIsoDateTime = (dateTime: string) => {
  const [date, time] = dateTime.split("T");

  if (!date || !time || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);
  const displayTime = time.slice(0, 5);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !/^\d{2}:\d{2}$/.test(displayTime)
  ) {
    return null;
  }

  return {
    year,
    month,
    day,
    time: displayTime,
  };
};

export const formatWorktimeHistoryRequestedAt = (requestedAt: string) => {
  const dateTime = parseIsoDateTime(requestedAt);

  if (!dateTime) {
    return "신청 -";
  }

  const { year, month, day, time } = dateTime;

  return `신청 ${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${time}`;
};

export const formatWorktimeHistoryProcessedAt = (processedAt: string) => {
  const dateTime = parseIsoDateTime(processedAt);

  if (!dateTime) {
    return "처리 -";
  }

  const { month, day, time } = dateTime;

  return `처리 ${month}월 ${day}일 ${time}`;
};

export const formatWorktimeHistoryPeriod = (year: number, month: number) => {
  const lastDate = new Date(year, month, 0).getDate();
  const paddedMonth = String(month).padStart(2, "0");
  const paddedLastDate = String(lastDate).padStart(2, "0");

  return `${year}.${paddedMonth}.01 ~ ${year}.${paddedMonth}.${paddedLastDate}`;
};
