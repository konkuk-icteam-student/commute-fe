import type { WeekScheduleData } from "../types";

const WEEKDAYS = [
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
];
const GET_SCHEDULE_MAX_CONCURRENT_WORKERS = 4;

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

const GET_SCHEDULE_CURRENT_COUNTS_BY_TIME = [
  2, 3, 3, 3, 3, 0, 0, 0, 4, 3, 3, 3, 3, 3, 3, 3, 4, 0,
];

const GET_SCHEDULE_SLOT_OVERRIDES: Record<
  string,
  {
    status: WeekScheduleData["slots"][number]["status"];
    currentCount: number;
  }
> = {
  "2-2": { status: "PENDING_ADD", currentCount: 2 },
  "2-3": { status: "PENDING_ADD", currentCount: 2 },
  "2-4": { status: "PENDING_ADD", currentCount: 2 },
  "0-8": { status: "PENDING_DELETE", currentCount: 2 },
  "0-9": { status: "PENDING_DELETE", currentCount: 2 },
  "0-10": { status: "PENDING_DELETE", currentCount: 2 },
  "1-9": { status: "PENDING_ADD", currentCount: 3 },
  "1-10": { status: "PENDING_ADD", currentCount: 4 },
  "3-11": { status: "PENDING_DELETE", currentCount: 4 },
  "3-12": { status: "PENDING_DELETE", currentCount: 2 },
  "3-13": { status: "MY_SCHEDULE", currentCount: 2 },
  "3-14": { status: "MY_SCHEDULE", currentCount: 2 },
};

const isSelectedSlotStatus = (status: string) =>
  status === "MY_SCHEDULE" ||
  status === "PENDING_ADD" ||
  status === "PENDING_DELETE";

const getSelectedSlotCurrentCount = (status: string, currentCount: number) =>
  isSelectedSlotStatus(status) ? Math.max(1, currentCount) : currentCount;

export const DUMMY_GET_SCHEDULE: WeekScheduleData = {
  maxConcurrentWorkers: GET_SCHEDULE_MAX_CONCURRENT_WORKERS,
  slots: WEEKDAYS.flatMap((date, dateIndex) =>
    TIME_SLOTS.map(({ start, end }, timeIndex) => {
      const isUnavailable = isFixedUnavailableTime(start, end);
      const override = GET_SCHEDULE_SLOT_OVERRIDES[`${dateIndex}-${timeIndex}`];
      const status = isUnavailable
        ? "UNAVAILABLE"
        : (override?.status ?? "EMPTY");
      const currentCount = isUnavailable
        ? 0
        : (override?.currentCount ??
          GET_SCHEDULE_CURRENT_COUNTS_BY_TIME[timeIndex] ??
          GET_SCHEDULE_MAX_CONCURRENT_WORKERS);

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
