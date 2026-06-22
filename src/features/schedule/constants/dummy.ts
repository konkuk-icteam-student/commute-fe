import type { ScheduleChangeHistoryType, WeekScheduleData } from "../types";

const WEEKDAYS = [
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
];
const MAX_CONCURRENT_WORKERS = 5;
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

const isMyScheduleTime = (date: string, start: string, end: string) =>
  date === "2026-05-20" && start >= "14:00" && end <= "16:00";

const getRandomWorkerCount = (date: string, start: string) => {
  const seed = `${date}-${start}`.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return seed % (MAX_CONCURRENT_WORKERS + 1);
};

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
      const currentCount = isUnavailable
        ? 0
        : getRandomWorkerCount(date, start);

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

export const DUMMY_SCHEDULE_CHANGE_HISTORY: ScheduleChangeHistoryType[] = [
  {
    requestId: "5fd54f21-9b83-49f2-bdf7-8f1a6f946601",
    statusCode: "CS01",
    statusName: "대기",
    requestedAt: "2026-04-01T10:00:00",
    processedAt: null,
    reason: "수업 일정 변경으로 근무 시간을 조정합니다.",
    rejectReason: null,
    deleteSlots: [
      {
        start: "2026-04-06T13:00:00",
        end: "2026-04-06T14:30:00",
        changeTypeCode: "CR02",
      },
      {
        start: "2026-04-08T14:00:00",
        end: "2026-04-08T15:00:00",
        changeTypeCode: "CR02",
      },
    ],
    addSlots: [
      {
        start: "2026-04-09T13:00:00",
        end: "2026-04-09T15:30:00",
        changeTypeCode: "CR01",
      },
    ],
  },
  {
    requestId: "9dc21a62-7d24-4411-9369-427d8e54cc2f",
    statusCode: "CS02",
    statusName: "승인",
    requestedAt: "2026-04-03T09:20:00",
    processedAt: "2026-04-03T14:10:00",
    reason: "개인 일정으로 오후 근무를 오전으로 변경합니다.",
    rejectReason: null,
    deleteSlots: [
      {
        start: "2026-04-10T15:00:00",
        end: "2026-04-10T16:30:00",
        changeTypeCode: "CR02",
      },
    ],
    addSlots: [
      {
        start: "2026-04-10T10:00:00",
        end: "2026-04-10T11:30:00",
        changeTypeCode: "CR01",
      },
    ],
  },
  {
    requestId: "c76e05b4-cd1c-4c69-b51e-1c62e684b7aa",
    statusCode: "CS03",
    statusName: "거절",
    requestedAt: "2026-04-05T18:45:00",
    processedAt: "2026-04-06T11:00:00",
    reason: "동아리 행사 참석으로 근무 시간을 변경합니다.",
    rejectReason: "추가 요청한 시간대의 근무 인원이 이미 충족되었습니다.",
    deleteSlots: [
      {
        start: "2026-04-13T09:00:00",
        end: "2026-04-13T10:30:00",
        changeTypeCode: "CR02",
      },
    ],
    addSlots: [
      {
        start: "2026-04-13T16:00:00",
        end: "2026-04-13T17:30:00",
        changeTypeCode: "CR01",
      },
    ],
  },
];

export const DUMMY_SCHEDULE_APPLY_RESPONSE = {
  details: {
    success: [
      { start: "2026-04-06T13:00:00", end: "2026-04-06T14:30:00" },
      { start: "2026-04-07T09:00:00", end: "2026-04-07T10:00:00" },
    ],
    failure: [{ start: "2026-04-07T09:00:00", end: "2026-04-07T10:00:00" }],
  },
};
