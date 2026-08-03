"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import rightCircleIcon from "@/assets/icons/admin-common/ic_chevron_right_circle.svg";
import rightCircleDisabledIcon from "@/assets/icons/admin-common/ic_chevron_right_circle_disabled.svg";
import searchIcon from "@/assets/icons/admin-dashboard/ic_search.svg";
import type {
  DashboardMemberAttendanceIssueCode,
  DashboardMemberAttendance,
  DashboardMemberWorkStatusCode,
} from "../../types";
import DashboardPanel from "../dashboard-panel";

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

const PAGE_SIZE = 6;
const MEMBER_ROW_GRID_CLASS = "grid-cols-[169px_404px]";
const MEMBER_ROW_MIN_WIDTH_CLASS = "min-w-143.25";
const METRIC_GRID_CLASS = "grid-cols-[80px_132px_139px]";

export default function MemberAttendancePanel({
  members,
}: {
  members: DashboardMemberAttendance[];
}) {
  const [selectedPage, setSelectedPage] = useState(0);
  const [query, setQuery] = useState("");
  const filteredMembers = useMemo(
    () => members.filter((member) => member.name.includes(query.trim())),
    [members, query],
  );
  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const currentPage = Math.min(selectedPage, pageCount - 1);
  const visibleMembers = filteredMembers.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pageCount - 1;

  return (
    <DashboardPanel title="인원별 근태 현황" arrowHref="/admin/members">
      <div className="mx-5.25 mb-5 rounded-xl bg-white p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex h-9.75 w-53.5 items-center gap-2 rounded-lg border border-[#DDE3EF] bg-[rgba(244,245,247,0.57)] p-3">
            <Image src={searchIcon} alt="" width={15} height={15} />
            <input
              aria-label="이름 검색"
              className="mt-0.5 min-w-0 flex-1 text-[14px] outline-none placeholder:text-[#8892A6]"
              placeholder="이름을 검색하세요."
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedPage(0);
              }}
            />
          </label>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-default"
              aria-label="이전 페이지"
              disabled={isFirstPage}
              onClick={() => setSelectedPage(currentPage - 1)}
            >
              <Image
                src={isFirstPage ? rightCircleDisabledIcon : rightCircleIcon}
                alt=""
                width={32}
                height={32}
                className="rotate-180"
              />
            </button>
            <span className="text-[16px] text-[#09121C]">
              <strong className="font-bold">{currentPage + 1}</strong>/
              {pageCount}
            </span>
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-default"
              aria-label="다음 페이지"
              disabled={isLastPage}
              onClick={() => setSelectedPage(currentPage + 1)}
            >
              <Image
                src={isLastPage ? rightCircleDisabledIcon : rightCircleIcon}
                alt=""
                width={32}
                height={32}
              />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className={MEMBER_ROW_MIN_WIDTH_CLASS}>
            {visibleMembers.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}

function MemberRow({ member }: { member: DashboardMemberAttendance }) {
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

function MemberStatusBadges({ member }: { member: DashboardMemberAttendance }) {
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
