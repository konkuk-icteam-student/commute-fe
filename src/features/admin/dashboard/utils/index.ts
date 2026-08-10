import type {
  DashboardAttendanceDetails,
  DashboardMemberAttendance,
  DashboardMemberAttendanceIssueCode,
  DashboardMemberWorkStatusCode,
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

const memberAttendanceOrder: Record<DashboardMemberWorkStatusCode, number> = {
  WORKING: 0,
  NOT_CHECKED_IN: 1,
  SCHEDULED: 2,
  COMPLETED: 5,
  OFF: 6,
};

const memberAttendanceIssueOrder: Partial<
  Record<DashboardMemberAttendanceIssueCode, number>
> = {
  ABSENT: 4,
};

const toMemberWorkStatusCode = (
  workStatusCode: DashboardAttendanceDetails["users"][number]["workStatusCode"],
): DashboardMemberWorkStatusCode => {
  switch (workStatusCode) {
    case "WK01":
      return "SCHEDULED";
    case "WK02":
      return "WORKING";
    case "WK03":
      return "COMPLETED";
    case "WK04":
      return "NOT_CHECKED_IN";
    case null:
      return "OFF";
  }
};

const toMemberAttendanceIssueCode = (
  attendanceStatusCode: DashboardAttendanceDetails["users"][number]["attendanceStatusCode"],
): DashboardMemberAttendanceIssueCode | undefined => {
  switch (attendanceStatusCode) {
    case "AT02":
      return "LATE";
    case "AT03":
      return "ABSENT";
    case "AT01":
    case null:
      return undefined;
  }
};

const getMemberAttendanceOrder = ({
  attendanceIssueCode,
  workStatusCode,
}: {
  attendanceIssueCode?: DashboardMemberAttendanceIssueCode;
  workStatusCode: DashboardMemberWorkStatusCode;
}) => {
  if (
    attendanceIssueCode &&
    attendanceIssueCode in memberAttendanceIssueOrder
  ) {
    return memberAttendanceIssueOrder[attendanceIssueCode] ?? 0;
  }

  return memberAttendanceOrder[workStatusCode];
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
  [...details.users]
    .map((user) => ({
      ...user,
      attendanceIssueCode: toMemberAttendanceIssueCode(
        user.attendanceStatusCode,
      ),
      workStatusCode: toMemberWorkStatusCode(user.workStatusCode),
    }))
    .sort((firstUser, secondUser) => {
      const firstOrder = getMemberAttendanceOrder({
        attendanceIssueCode: firstUser.attendanceIssueCode,
        workStatusCode: firstUser.workStatusCode,
      });
      const secondOrder = getMemberAttendanceOrder({
        attendanceIssueCode: secondUser.attendanceIssueCode,
        workStatusCode: secondUser.workStatusCode,
      });

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder;
      }

      return 0;
    })
    .map((user) => ({
      attendanceIssueCode: user.attendanceIssueCode,
      id: user.userId,
      name: user.userName,
      workStatusCode: user.workStatusCode,
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
