import type { DashboardMemberAttendance } from "../../../types";
import MemberStatusBadges from "../member-status-badges";

const MEMBER_ROW_GRID_CLASS = "grid-cols-[169px_404px]";
const METRIC_GRID_CLASS = "grid-cols-[80px_132px_139px]";

export default function MemberRow({
  member,
}: {
  member: DashboardMemberAttendance;
}) {
  return (
    <article className={`grid min-h-17 ${MEMBER_ROW_GRID_CLASS} items-center`}>
      <div className="px-3.75 py-[14.21px]">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[#09121C]">{member.name}</p>
          <MemberStatusBadges member={member} />
        </div>
        <p className="mt-0.5 text-[11px] leading-[16.5px] text-[#6B7280]">
          {member.meta}
        </p>
      </div>
      <div
        className={`grid ${METRIC_GRID_CLASS} items-center gap-3 py-2.75 pr-2.25 pl-5`}
      >
        <MetricBox label="지각 횟수" value={member.late} />
        <MetricBox
          label="이번 주 누적 시간"
          value={member.week}
          progress={member.weekProgress}
        />
        <MetricBox
          label="이번 달 누적 시간"
          value={member.total}
          progress={member.totalProgress}
        />
      </div>
    </article>
  );
}

function MetricBox({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress?: number;
}) {
  return (
    <div className="relative flex h-11.5 flex-col items-center justify-center overflow-hidden rounded-md border-[0.5px] border-[#C2C4C6] bg-white py-1.5">
      {progress !== undefined ? (
        <span
          className="absolute inset-y-0 left-0 bg-[#F1F8FF]"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      ) : null}
      <p className="relative text-[10px] text-[#8892A6]">{label}</p>
      <p className="relative text-[11px] font-bold text-[#09121C]">{value}</p>
    </div>
  );
}
