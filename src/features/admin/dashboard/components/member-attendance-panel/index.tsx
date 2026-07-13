"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import rightCircleIcon from "@/assets/icons/admin-common/ic_chevron_right_circle.svg";
import rightCircleDisabledIcon from "@/assets/icons/admin-common/ic_chevron_right_circle_disabled.svg";
import searchIcon from "@/assets/icons/admin-dashboard/ic_search.svg";
import DashboardSectionHeader from "../dashboard-section-header";
import type {
  DashboardMemberAttendance,
  DashboardMemberStatusCode,
} from "../../types";

const statusStyles: Record<
  DashboardMemberStatusCode,
  { badge: string; dot: string }
> = {
  AT01: {
    badge: "bg-[#DCFCE7] text-[#008236]",
    dot: "text-[#00C950]",
  },
  AT02: {
    badge: "bg-[#F0F2F8] text-[#8892A6]",
    dot: "text-[#8E8E93]",
  },
  AT03: {
    badge: "bg-[#FEE2E2] text-[#B91C1C]",
    dot: "text-[#E31B23]",
  },
};

const statusLabels: Record<DashboardMemberStatusCode, string> = {
  AT01: "근무중",
  AT02: "출근예정",
  AT03: "지각",
};

const PAGE_SIZE = 5;

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
    <section className="rounded-xl border border-[#DDE3EF] bg-[#F4F5F7]">
      <DashboardSectionHeader
        title="인원별 근태 현황"
        arrowHref="/admin/members"
      />
      <div className="mx-4 mb-4 rounded-xl bg-white p-3 min-[1728px]:mx-5.25 min-[1728px]:mb-5 min-[1728px]:p-4">
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
          <div className="min-w-146.25">
            {visibleMembers.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberRow({ member }: { member: DashboardMemberAttendance }) {
  const statusStyle = statusStyles[member.statusCode];

  return (
    <article className="grid min-h-17 grid-cols-[200px_minmax(0,1fr)] items-center">
      <div className="px-3.75 py-[14.21px]">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[#09121C]">{member.name}</p>
          <span
            className={`rounded-full px-2 py-px text-[10px] font-bold ${statusStyle.badge}`}
          >
            <span className={statusStyle.dot}>●</span>
            <span className="ml-1">{statusLabels[member.statusCode]}</span>
          </span>
        </div>
        <p className="mt-0.5 text-[11px] leading-[16.5px] text-[#6B7280]">
          {member.meta}
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,80px)_minmax(0,132px)_minmax(0,139px)] items-center gap-3 px-5 py-2.75">
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
