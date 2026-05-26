import type { WeekScheduleData } from "../types";

const WEEKDAYS = [
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
];
const MAX_CONCURRENT_WORKERS = 5;

const TIME_SLOTS = Array.from({ length: 18 }, (_, index) => {
  const startMinutes = 9 * 60 + index * 30;
  const endMinutes = startMinutes + 30;

  const formatTime = (minutes: number) => {
    const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
    const minute = String(minutes % 60).padStart(2, "0");

    return `${hour}:${minute}`;
  };

  return {
    start: formatTime(startMinutes),
    end: formatTime(endMinutes),
  };
});

const isFixedUnavailableTime = (start: string, end: string) =>
  (start >= "11:30" && end <= "13:00") ||
  (start === "17:30" && end === "18:00");

const getPreviewSlotStatus = (dateIndex: number, timeIndex: number) => {
  if ((dateIndex + timeIndex) % 11 === 0) {
    return "PENDING_DELETE";
  }

  if ((dateIndex + timeIndex) % 9 === 0) {
    return "PENDING_ADD";
  }

  if ((dateIndex + timeIndex) % 7 === 0) {
    return "MY_SCHEDULE";
  }

  if ((dateIndex + timeIndex) % 5 === 0) {
    return "UNAVAILABLE";
  }

  return "EMPTY";
};

const isSelectedSlotStatus = (status: string) =>
  status === "MY_SCHEDULE" ||
  status === "PENDING_ADD" ||
  status === "PENDING_DELETE";

const getSelectedSlotCurrentCount = (status: string, currentCount: number) =>
  isSelectedSlotStatus(status) ? Math.max(1, currentCount) : currentCount;

const isMyScheduleTime = (date: string, start: string, end: string) =>
  date === "2026-05-20" && start >= "14:00" && end <= "16:00";

const getRandomWorkerCount = (date: string, start: string) => {
  const seed = `${date}-${start}`.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return seed % (MAX_CONCURRENT_WORKERS + 1);
};

export const DUMMY_GET_SCHEDULE: WeekScheduleData = {
  maxConcurrentWorkers: MAX_CONCURRENT_WORKERS,
  slots: WEEKDAYS.flatMap((date, dateIndex) =>
    TIME_SLOTS.map(({ start, end }, timeIndex) => {
      const isUnavailable = isFixedUnavailableTime(start, end);
      const status = isUnavailable
        ? "UNAVAILABLE"
        : getPreviewSlotStatus(dateIndex, timeIndex);
      const currentCount = isUnavailable ? 0 : (dateIndex + timeIndex) % 4;

      return {
        date,
        start,
        end,
        status,
        currentCount: getSelectedSlotCurrentCount(status, currentCount),
      };
    }),
  ),
};

export const DUMMY_NEXT_MONTH_SCHEDULE: WeekScheduleData = {
  maxConcurrentWorkers: MAX_CONCURRENT_WORKERS,
  slots: WEEKDAYS.flatMap((date) =>
    TIME_SLOTS.map(({ start, end }) => {
      const isUnavailable = isFixedUnavailableTime(start, end);
      const isMySchedule = isMyScheduleTime(date, start, end);
      const status = isUnavailable
        ? "UNAVAILABLE"
        : isMySchedule
          ? "MY_SCHEDULE"
          : "EMPTY";
      const currentCount = isUnavailable ? 0 : getRandomWorkerCount(date, start);

      return {
        date,
        start,
        end,
        status,
        currentCount: getSelectedSlotCurrentCount(status, currentCount),
      };
    }),
  ),
};
