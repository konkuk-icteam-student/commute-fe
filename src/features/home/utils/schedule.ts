import type {
  WorkSchedule,
  WorkScheduleStatus,
} from "@/features/home/components";

import { getScheduleTimeRange } from "./schedule-time";

export type BaseWorkSchedule = Omit<
  WorkSchedule,
  "checkedIn" | "checkInTime" | "status"
>;

const getCurrentMinutes = (date: Date) =>
  date.getHours() * 60 + date.getMinutes();

const getScheduleStatus = (
  schedule: Pick<WorkSchedule, "time">,
  currentDate: Date,
  isClockedIn: boolean,
): WorkScheduleStatus => {
  const currentMinutes = getCurrentMinutes(currentDate);
  const { startMinutes, endMinutes } = getScheduleTimeRange(schedule.time);

  if (currentMinutes < startMinutes) {
    return "scheduled";
  }

  if (currentMinutes <= endMinutes) {
    return "working";
  }

  return isClockedIn ? "completed" : "absent";
};

export const syncSchedulesWithCurrentTime = (
  schedules: BaseWorkSchedule[],
  currentDate: Date,
  clockedInScheduleId?: number | null,
): WorkSchedule[] =>
  schedules.map((schedule) => ({
    ...schedule,
    checkedIn: false,
    checkInTime: null,
    status: getScheduleStatus(
      schedule,
      currentDate,
      Number(schedule.id) === clockedInScheduleId,
    ),
  }));
