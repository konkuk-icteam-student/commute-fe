import type {
  DashboardMemberAttendance,
  DashboardMemberAttendanceIssueCode,
  DashboardMemberWorkStatusCode,
} from "../../../types";

const statusStyles: Record<
  DashboardMemberWorkStatusCode,
  { badge: string; dot: string }
> = {
  WORKING: {
    badge: "bg-[#DBEAFE] text-[#1D4ED8]",
    dot: "text-[#2563EB]",
  },
  SCHEDULED: {
    badge: "bg-[#F0F2F8] text-[#8892A6]",
    dot: "text-[#98989D]",
  },
  NOT_CHECKED_IN: {
    badge: "bg-[#FFE4E4] text-[#ED5757]",
    dot: "text-[#FD7C7C]",
  },
  COMPLETED: {
    badge: "bg-[#DCFCE7] text-[#008236]",
    dot: "text-[#00C950]",
  },
  OFF: {
    badge: "",
    dot: "",
  },
};

const statusLabels: Record<DashboardMemberWorkStatusCode, string> = {
  WORKING: "근무중",
  SCHEDULED: "근무 예정",
  NOT_CHECKED_IN: "미출근",
  COMPLETED: "근무 완료",
  OFF: "",
};

const issueStyles: Record<DashboardMemberAttendanceIssueCode, string> = {
  LATE: "bg-[#FFECB8] text-[#D79430]",
  ABSENT: "bg-[#FEE2E2] text-[#ED5757]",
};

const issueLabels: Record<DashboardMemberAttendanceIssueCode, string> = {
  LATE: "지각",
  ABSENT: "결근",
};

export default function MemberStatusBadges({
  member,
}: {
  member: DashboardMemberAttendance;
}) {
  const statusStyle = statusStyles[member.workStatusCode];
  const statusLabel = statusLabels[member.workStatusCode];
  const shouldShowWorkStatus =
    member.workStatusCode !== "OFF" && member.attendanceIssueCode !== "ABSENT";

  return (
    <div className="flex items-center gap-1">
      {shouldShowWorkStatus ? (
        <span
          className={`rounded-full px-2 py-px text-[10px] font-bold ${statusStyle.badge}`}
        >
          <span className={statusStyle.dot}>●</span>
          <span className="ml-1">{statusLabel}</span>
        </span>
      ) : null}
      {member.attendanceIssueCode ? (
        <span
          className={`rounded-full px-2 py-px text-[10px] font-bold ${issueStyles[member.attendanceIssueCode]}`}
        >
          {issueLabels[member.attendanceIssueCode]}
        </span>
      ) : null}
    </div>
  );
}
