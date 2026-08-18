import type { GetPeriodWorkSchedulesResponse } from "@/apis/work-schedules";
import type { BadgeVariant } from "@/components/ui";

import type { DailyTaskPeriod, WorkTimeSlot, WorkTimeWorker } from "../types";

const workerTones = [
  "student-blue",
  "student-green",
  "student-red",
  "student-orange",
  "student-cyan",
  "student-pink",
  "student-purple",
] as const satisfies BadgeVariant[];

const getWorkerTone = (userId: string): WorkTimeWorker["tone"] => {
  const toneIndex =
    Array.from(userId).reduce(
      (sum, character) => sum + character.charCodeAt(0),
      0,
    ) % workerTones.length;

  return workerTones[toneIndex];
};

const getSlotPeriod = (start: string): DailyTaskPeriod => {
  const hour = Number(start.split(":")[0]);

  return hour < 12 ? "morning" : "afternoon";
};

export const formatDailyTaskDate = (date: Date) => {
  const weekdayLabels = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ] as const;

  return `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일 ${weekdayLabels[date.getDay()]}`;
};

export const toDailyTaskWorkTimeSlots = (
  response: GetPeriodWorkSchedulesResponse | undefined,
  period: DailyTaskPeriod,
): WorkTimeSlot[] => {
  const slots = response?.days[0]?.slots ?? [];

  return slots
    .filter(
      (slot) =>
        slot.status !== "UNAVAILABLE" && getSlotPeriod(slot.start) === period,
    )
    .map((slot) => ({
      time: slot.start,
      workers: (slot.users ?? []).map((user) => ({
        id: user.scheduleId,
        name: user.userName,
        tone: getWorkerTone(user.userId),
      })),
    }));
};
