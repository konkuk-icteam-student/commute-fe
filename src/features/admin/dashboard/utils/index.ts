import type {
  DashboardAttendanceDetails,
  DashboardMemberAttendance,
  DashboardScheduleDetails,
  DashboardSummaryDetails,
  DashboardSummaryItem,
  DashboardTimePeriodCode,
  DashboardTimeRow,
} from "../types";

const getTimePeriodCode = (start: string): DashboardTimePeriodCode => {
  const hour = Number(start.split(":")[0]);

  return hour < 12 ? "MORNING" : "AFTERNOON";
};

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}시간 ${remainingMinutes}분`;
};

const getProgress = (workedMinutes: number, limitMinutes: number) => {
  if (limitMinutes <= 0) {
    return 0;
  }

  return Math.min(Math.max((workedMinutes / limitMinutes) * 100, 0), 100);
};

export const toDashboardSummaryItems = (
  details: DashboardSummaryDetails,
): DashboardSummaryItem[] => [
  { label: "현재 근무 중", value: `${details.currentWorkingCount}명` },
  { label: "미출근자", value: `${details.notCheckedInCount}명` },
  { label: "지각자", value: `${details.lateCount}명`, variant: "warning" },
  {
    label: "오늘의 업무",
    value: `${details.todayTask.completedCount}/${details.todayTask.totalCount}`,
  },
];

export const toDashboardTimeRows = (
  details: DashboardScheduleDetails,
): DashboardTimeRow[] =>
  details.slots.map((slot) => ({
    currentCount: slot.currentCount,
    periodCode: getTimePeriodCode(slot.start),
    id: `${slot.date}-${slot.start}-${slot.end}`,
    isOverLimit: slot.isOverLimit,
    start: slot.start,
    end: slot.end,
    workers: slot.users.map((user) => ({
      id: user.userId,
      name: user.userName,
    })),
  }));

export const toDashboardMemberAttendanceRows = (
  details: DashboardAttendanceDetails,
): DashboardMemberAttendance[] =>
  details.users.map((user) => ({
    id: user.userId,
    name: user.userName,
    statusCode: user.statusCode,
    meta: `${user.department} · ${user.studentId}`,
    late: `${user.lateCount}회 (${user.lateMinutes}분)`,
    week: `${formatMinutes(user.weeklyWorkedMinutes)} / ${formatMinutes(
      user.weeklyLimitMinutes,
    )}`,
    weekProgress: getProgress(
      user.weeklyWorkedMinutes,
      user.weeklyLimitMinutes,
    ),
    total: `${formatMinutes(user.monthlyWorkedMinutes)} / ${formatMinutes(
      user.monthlyLimitMinutes,
    )}`,
    totalProgress: getProgress(
      user.monthlyWorkedMinutes,
      user.monthlyLimitMinutes,
    ),
  }));
