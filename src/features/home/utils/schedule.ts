import type {
  AttendanceSummary,
  WorkSchedule,
  WorkScheduleStatus,
} from "@/features/home/components";

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
    title: "출근 예정",
    description: "출근 시간이 지났습니다",
    buttonText: "출근하기",
  },
  empty: {
    title: "근무 없음",
    description: "오늘 예정된 근무가 없습니다",
    buttonText: "출근하기",
  },
};

const CLOCK_IN_AVAILABLE_BEFORE_MINUTES = 10;

export type BaseWorkSchedule = Omit<WorkSchedule, "status">;

const parseTimeToMinutes = (time: string) => {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})$/);

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

const getScheduleTimeRange = (time: string) => {
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

const formatTimeLabel = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes % 60).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  return `${period} ${displayHours}:${displayMinutes}`;
};

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

const createCompletedAttendanceSummary = (
  startMinutes: number,
): AttendanceSummary => ({
  status: "completed",
  title: attendanceText.completed.title,
  highlightTime: formatTimeLabel(startMinutes),
  description: attendanceText.completed.description,
  buttonText: attendanceText.completed.buttonText,
  canClockIn: false,
});

const createScheduledAttendanceSummary = ({
  startMinutes,
  description = attendanceText.scheduled.description,
  canClockIn = false,
  clockInScheduleId,
}: {
  startMinutes: number;
  description?: string;
  canClockIn?: boolean;
  clockInScheduleId?: number;
}): AttendanceSummary => ({
  status: "scheduled",
  title: attendanceText.scheduled.title,
  highlightTime: formatTimeLabel(startMinutes),
  description,
  buttonText: attendanceText.scheduled.buttonText,
  canClockIn,
  clockInScheduleId,
});

const createEmptyAttendanceSummary = (): AttendanceSummary => ({
  status: "scheduled",
  title: attendanceText.empty.title,
  description: attendanceText.empty.description,
  buttonText: attendanceText.empty.buttonText,
  canClockIn: false,
});

export const syncSchedulesWithCurrentTime = (
  schedules: BaseWorkSchedule[],
  currentDate: Date,
  clockedInScheduleId?: number | null,
): WorkSchedule[] =>
  schedules.map((schedule) => ({
    ...schedule,
    status: getScheduleStatus(
      schedule,
      currentDate,
      schedule.id === clockedInScheduleId,
    ),
  }));

export const getAttendanceSummary = (
  schedules: WorkSchedule[],
  currentDate: Date,
  clockedInScheduleId?: number | null,
): AttendanceSummary => {
  const currentMinutes = getCurrentMinutes(currentDate);
  const orderedSchedules = schedules
    .map((schedule) => ({
      ...schedule,
      ...getScheduleTimeRange(schedule.time),
    }))
    .sort((a, b) => a.startMinutes - b.startMinutes);

  if (orderedSchedules.length === 0) {
    return createEmptyAttendanceSummary();
  }

  const completedSchedule = orderedSchedules.find(
    (schedule) => schedule.status === "completed",
  );

  if (completedSchedule) {
    return createCompletedAttendanceSummary(completedSchedule.startMinutes);
  }

  const clockedInSchedule = orderedSchedules.find(
    (schedule) => schedule.id === clockedInScheduleId,
  );

  if (clockedInSchedule) {
    return createCompletedAttendanceSummary(clockedInSchedule.startMinutes);
  }

  const activeSchedule = orderedSchedules.find(
    (schedule) => schedule.status === "working",
  );

  if (activeSchedule) {
    if (activeSchedule.id === clockedInScheduleId) {
      return createCompletedAttendanceSummary(activeSchedule.startMinutes);
    }

    return createScheduledAttendanceSummary({
      startMinutes: activeSchedule.startMinutes,
      description: attendanceText.expired.description,
      canClockIn: true,
      clockInScheduleId: activeSchedule.id,
    });
  }

  const nextSchedule = orderedSchedules.find(
    (schedule) => currentMinutes < schedule.startMinutes,
  );

  if (nextSchedule) {
    const canClockIn =
      currentMinutes >=
      nextSchedule.startMinutes - CLOCK_IN_AVAILABLE_BEFORE_MINUTES;

    return createScheduledAttendanceSummary({
      startMinutes: nextSchedule.startMinutes,
      canClockIn,
      clockInScheduleId: canClockIn ? nextSchedule.id : undefined,
    });
  }

  return createScheduledAttendanceSummary({
    startMinutes: orderedSchedules.at(-1)?.startMinutes ?? 0,
    description: attendanceText.expired.description,
  });
};
