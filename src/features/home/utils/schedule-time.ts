export const parseTimeToMinutes = (time: string) => {
  const match = time
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/);

  if (!match) {
    throw new Error(`Invalid schedule time: "${time}"`);
  }

  const [, hoursText, minutesText] = match;
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid schedule time: "${time}"`);
  }

  return hours * 60 + minutes;
};

export const getScheduleTimeRange = (time: string) => {
  const match = time.trim().match(/^(.+?)\s*-\s*(.+)$/);

  if (!match) {
    throw new Error(`Invalid schedule time range: "${time}"`);
  }

  const [, startTime, endTime] = match;
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes > endMinutes) {
    throw new Error(`Invalid schedule time range: "${time}"`);
  }

  return {
    startMinutes,
    endMinutes,
  };
};

export const formatTimeLabel = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes % 60).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  return `${period} ${displayHours}:${displayMinutes}`;
};

export const parseCheckInTimeToMinutes = (time: string) => {
  const timeText = time.includes("T") ? time.split("T")[1] : time;

  try {
    return parseTimeToMinutes(timeText);
  } catch {
    return undefined;
  }
};

export const formatScheduleTime = (time: string) => time.slice(0, 5);
