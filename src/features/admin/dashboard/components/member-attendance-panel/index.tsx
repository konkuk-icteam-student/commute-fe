"use client";

import Image from "next/image";

import rightCircleIcon from "@/assets/icons/admin-common/ic_chevron_right_circle.svg";
import rightCircleDisabledIcon from "@/assets/icons/admin-common/ic_chevron_right_circle_disabled.svg";
import searchIcon from "@/assets/icons/admin-dashboard/ic_search.svg";
import type { DashboardMemberAttendance } from "../../types";
import DashboardPanel from "../dashboard-panel";
import MemberRow from "./member-row";

const MEMBER_ROW_MIN_WIDTH_CLASS = "min-w-143.25";

export default function MemberAttendancePanel({
  members,
  isLoading = false,
  isError = false,
  page,
  query,
  totalPages,
  onPageChange,
  onQueryChange,
}: {
  members: DashboardMemberAttendance[];
  isLoading?: boolean;
  isError?: boolean;
  page: number;
  query: string;
  totalPages: number;
  onPageChange: (page: number) => void;
  onQueryChange: (query: string) => void;
}) {
  const pageCount = Math.max(1, totalPages);
  const currentPage = Math.min(page, pageCount - 1);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pageCount - 1;
  const isPreviousPageDisabled = isLoading || isError || isFirstPage;
  const isNextPageDisabled = isLoading || isError || isLastPage;
  const statusMessage = isLoading
    ? "인원별 근태 현황을 불러오는 중입니다."
    : isError
      ? "인원별 근태 현황을 불러오지 못했습니다."
      : members.length === 0
        ? "조회된 인원이 없습니다."
        : undefined;

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
                onQueryChange(event.target.value);
              }}
            />
          </label>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-default"
              aria-label="이전 페이지"
              disabled={isPreviousPageDisabled}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <Image
                src={
                  isPreviousPageDisabled
                    ? rightCircleDisabledIcon
                    : rightCircleIcon
                }
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
              disabled={isNextPageDisabled}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <Image
                src={
                  isNextPageDisabled ? rightCircleDisabledIcon : rightCircleIcon
                }
                alt=""
                width={32}
                height={32}
              />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className={MEMBER_ROW_MIN_WIDTH_CLASS}>
            {statusMessage ? (
              <div className="flex h-40 items-center justify-center text-sm font-medium text-[#6B7280]">
                {statusMessage}
              </div>
            ) : (
              members.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}
