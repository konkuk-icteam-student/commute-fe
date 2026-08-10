import type { AttendanceSummary, WorkSchedule } from "../components";
import {
  formatTimeLabel,
  getScheduleTimeRange,
  parseCheckInTimeToMinutes,
} from "./schedule-time";

const attendanceText = {
  completed: {
    title: "출근 완료!",
    description: "에 출근했습니다",
    buttonText: "출근 완료",
  },
  scheduled: {
    title: "출근 예정",
    description: "출근 예정입니다",
    buttonText: "출근하기",
  },
  expired: {
    title: "출근 미완료",
    description: "출근 시간이 지났습니다",
    buttonText: "출근하기",
  },
};

const CLOCK_IN_AVAILABLE_BEFORE_MINUTES = 10;

const getCurrentMinutes = (date: Date) =>
  date.getHours() * 60 + date.getMinutes();

const createCompletedAttendanceSummary = ({
  startMinutes,
  clockedInAtMinutes = startMinutes,
}: {
  startMinutes: number;
  clockedInAtMinutes?: number;
}): AttendanceSummary => ({
  status: "completed",
  title: attendanceText.completed.title,
  highlightTime: formatTimeLabel(clockedInAtMinutes),
  description: attendanceText.completed.description,
  buttonText: attendanceText.completed.buttonText,
  canClockIn: false,
});

const createScheduledAttendanceSummary = ({
  startMinutes,
  description = attendanceText.scheduled.description,
  canClockIn = false,
  clockInScheduleIds,
}: {
  startMinutes: number;
  description?: string;
  canClockIn?: boolean;
  clockInScheduleIds?: number[];
}): AttendanceSummary => ({
  status: "scheduled",
  title: attendanceText.scheduled.title,
  highlightTime: formatTimeLabel(startMinutes),
  description,
  buttonText: attendanceText.scheduled.buttonText,
  canClockIn,
  clockInScheduleIds,
});

const createIncompleteAttendanceSummary = ({
  canClockIn = false,
  clockInScheduleIds,
}: {
  canClockIn?: boolean;
  clockInScheduleIds?: number[];
} = {}): AttendanceSummary => ({
  status: "scheduled",
  title: attendanceText.expired.title,
  description: attendanceText.expired.description,
  buttonText: attendanceText.expired.buttonText,
  canClockIn,
  clockInScheduleIds,
});

export const getAttendanceSummary = (
  schedules: WorkSchedule[],
  currentDate: Date,
  options: {
    canClockInAtWorkLocation?: boolean;
  } = {},
): AttendanceSummary | null => {
  const canClockInAtWorkLocation = options.canClockInAtWorkLocation ?? true;
  const currentMinutes = getCurrentMinutes(currentDate);
  const orderedSchedules = schedules
    .map((schedule) => ({
      ...schedule,
      ...getScheduleTimeRange(schedule.time),
    }))
    .sort((a, b) => a.startMinutes - b.startMinutes);

  if (orderedSchedules.length === 0) {
    return null;
  }

  const currentSchedule = orderedSchedules.find(
    (schedule) =>
      currentMinutes >=
        schedule.startMinutes - CLOCK_IN_AVAILABLE_BEFORE_MINUTES &&
      currentMinutes <= schedule.endMinutes,
  );

  if (currentSchedule) {
    if (currentSchedule.checkedIn) {
      const clockedInAtMinutes = currentSchedule.checkInTime
        ? parseCheckInTimeToMinutes(currentSchedule.checkInTime)
        : undefined;

      return createCompletedAttendanceSummary({
        startMinutes: currentSchedule.startMinutes,
        clockedInAtMinutes,
      });
    }

    if (currentMinutes >= currentSchedule.startMinutes) {
      return createIncompleteAttendanceSummary({
        canClockIn: canClockInAtWorkLocation,
        clockInScheduleIds: canClockInAtWorkLocation
          ? currentSchedule.scheduleIds
          : undefined,
      });
    }

    return createScheduledAttendanceSummary({
      startMinutes: currentSchedule.startMinutes,
      description: attendanceText.scheduled.description,
      canClockIn: canClockInAtWorkLocation,
      clockInScheduleIds: canClockInAtWorkLocation
        ? currentSchedule.scheduleIds
        : undefined,
    });
  }

  const nextSchedule = orderedSchedules.find(
    (schedule) => currentMinutes < schedule.startMinutes,
  );

  if (nextSchedule) {
    return createScheduledAttendanceSummary({
      startMinutes: nextSchedule.startMinutes,
    });
  }

  const lastSchedule = orderedSchedules.at(-1);

  if (lastSchedule?.checkedIn) {
    const clockedInAtMinutes = lastSchedule.checkInTime
      ? parseCheckInTimeToMinutes(lastSchedule.checkInTime)
      : undefined;

    return createCompletedAttendanceSummary({
      startMinutes: lastSchedule.startMinutes,
      clockedInAtMinutes,
    });
  }

  return createIncompleteAttendanceSummary();
};
