import type { WeekScheduleData } from "../types";

const WEEKDAYS = [
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
];

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

export const DUMMY_GET_SCHEDULE: WeekScheduleData = {
  maxConcurrentWorkers: 5,
  slots: WEEKDAYS.flatMap((date, dateIndex) =>
    TIME_SLOTS.map(({ start, end }, timeIndex) => {
      const isUnavailable = isFixedUnavailableTime(start, end);

      return {
        date,
        start,
        end,
        status: isUnavailable
          ? "UNAVAILABLE"
          : getPreviewSlotStatus(dateIndex, timeIndex),
        currentCount: isUnavailable ? 0 : (dateIndex + timeIndex) % 4,
      };
    }),
  ),
};
