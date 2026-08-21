"use client";

import { useState } from "react";
import Image from "next/image";
import { useQueries } from "@tanstack/react-query";

import {
  ADMIN_WORKERS_QUERY_KEY,
  getAdminWorkerDetailApi,
  useGetAdminWorkersQuery,
  type AdminWorker,
  type GetAdminWorkerDetailResponse,
} from "@/apis/admin/workers";
import chevronLeftCircleIcon from "@/assets/icons/admin-worktime-request/ic_chevron_left_circle.svg";
import sortIcon from "@/assets/icons/admin-worktime-request/ic_sort.svg";
import { cn } from "@/lib/utils";
import {
  EMPTY_MEMBER_TEXT,
  formatGrade,
  formatMinutesToHours,
} from "@/features/admin/manage-members/utils";
import { formatWorkRequestSummaryRequestedAt } from "../../utils";

const PAGE_SIZE = 5;
const COLUMN_COUNT = 7;

interface SummaryTableProps {
  date: string;
  minimumSubmittedMinutes: number;
}

export default function SummaryTable({
  date,
  minimumSubmittedMinutes,
}: SummaryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    adminWorkersData,
    isFetchingAdminWorkers,
    isErrorAdminWorkers,
    adminWorkersError,
  } = useGetAdminWorkersQuery({
    date,
    page: currentPage - 1,
    size: PAGE_SIZE,
  });

  const workers = adminWorkersData?.workers ?? [];
  const detailQueries = useQueries({
    queries: workers.map((worker) => {
      const params = { date, userId: worker.userId };

      return {
        queryKey: ADMIN_WORKERS_QUERY_KEY.DETAIL(params),
        queryFn: () => getAdminWorkerDetailApi(params),
        enabled: worker.userId > 0,
        retry: 1,
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
      };
    }),
  });

  const totalPage = Math.max(adminWorkersData?.totalPages ?? 1, 1);
  const isFetchingDetails = detailQueries.some((query) => query.isFetching);
  const isErrorDetails = detailQueries.some((query) => query.isError);
  const isLoading = isFetchingAdminWorkers || isFetchingDetails;
  const detailByUserId = new Map(
    detailQueries
      .map((query) => query.data)
      .filter((detail): detail is GetAdminWorkerDetailResponse =>
        Boolean(detail),
      )
      .map((detail) => [detail.userId, detail]),
  );

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    setCurrentPage((page) => page - 1);
  };

  const handleNextPage = () => {
    if (currentPage >= totalPage) return;
    setCurrentPage((page) => page + 1);
  };

  return (
    <div className="min-h-74 min-w-0">
      <PaginationIndicator
        currentPage={currentPage}
        totalPage={totalPage}
        onNext={handleNextPage}
        onPrev={handlePrevPage}
      />
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b-[1.5px] border-[#D6E0EB] text-[13px] font-bold text-[#131416]">
            <th className="w-21 px-4 py-2.5 whitespace-nowrap">성명</th>
            <th className="w-29 px-4 py-2.5 whitespace-nowrap">학번</th>
            <th className="w-31 px-4 py-2.5 whitespace-nowrap">학과</th>
            <th className="w-20 px-4 py-2.5 whitespace-nowrap">학년</th>
            <th className="w-24 px-4 py-2.5 whitespace-nowrap">총 제출시간</th>
            <th className="w-22 px-4 py-2.5 whitespace-nowrap">
              <span className="inline-flex gap-1">
                상태
                <Image
                  src={sortIcon}
                  alt=""
                  width={13}
                  height={13}
                  className="mt-px"
                />
              </span>
            </th>
            <th className="w-40 px-4 py-2.5 whitespace-nowrap">
              최근 신청시각
            </th>
          </tr>
        </thead>
        <tbody>
          {isErrorAdminWorkers || isErrorDetails || isLoading || workers.length === 0 ? (
            <tr>
              <td
                className="px-4 py-10 text-center text-sm text-[#6B7280]"
                colSpan={COLUMN_COUNT}
              >
                {isErrorAdminWorkers || isErrorDetails ? (
                  <span className="text-[#FD7171]">
                    {adminWorkersError?.message ??
                      "근로신청 요약을 불러오지 못했습니다."}
                  </span>
                ) : isLoading ? (
                  "근로신청 요약을 불러오는 중입니다."
                ) : (
                  "조회된 근로신청 내역이 없습니다."
                )}
              </td>
            </tr>
          ) : (
            workers.map((worker) => {
              const detail = detailByUserId.get(worker.userId);
              const submittedMinutes = detail?.submittedMinutes ?? 0;
              const status =
                submittedMinutes >= minimumSubmittedMinutes
                  ? "충족"
                  : "미충족";

              return (
                <SummaryRow
                  key={worker.userId}
                  detail={detail}
                  status={status}
                  worker={worker}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function SummaryRow({
  detail,
  status,
  worker,
}: {
  detail?: GetAdminWorkerDetailResponse;
  status: "충족" | "미충족";
  worker: AdminWorker;
}) {
  return (
    <tr className="border-b border-[#D6E0EB] text-sm text-[#464C53]">
      <td className="px-4 py-[14.5px] font-semibold whitespace-nowrap">
        {detail?.name ?? worker.name}
      </td>
      <td className="px-4 py-[14.5px] whitespace-nowrap">
        {detail?.studentId ?? worker.studentId ?? EMPTY_MEMBER_TEXT}
      </td>
      <td className="px-4 py-[14.5px] whitespace-nowrap">
        {detail?.department ?? worker.department ?? EMPTY_MEMBER_TEXT}
      </td>
      <td className="px-4 py-[14.5px] whitespace-nowrap">
        {formatGrade(detail?.grade ?? worker.grade)}
      </td>
      <td className="px-4 py-[14.5px] whitespace-nowrap">
        {formatMinutesToHours(detail?.submittedMinutes ?? 0)}시간
      </td>
      <td className="px-4 py-[14.5px] whitespace-nowrap">
        <StatusBadge status={status} />
      </td>
      <td className="w-40 px-4 py-[14.5px] whitespace-nowrap">
        <AppliedAt value={detail?.lastRequestedAt} />
      </td>
    </tr>
  );
}

function PaginationIndicator({
  currentPage,
  onNext,
  onPrev,
  totalPage,
}: {
  currentPage: number;
  onNext: () => void;
  onPrev: () => void;
  totalPage: number;
}) {
  return (
    <div className="mb-5 flex items-center gap-1.5">
      <button
        type="button"
        className="flex h-5 w-5 items-center justify-center disabled:cursor-default"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={onPrev}
      >
        <Image
          src={chevronLeftCircleIcon}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
        />
      </button>
      <span className="text-[15px] font-bold text-[#1A2236]">
        {currentPage}/{totalPage}
      </span>
      <button
        type="button"
        className="flex h-5 w-5 items-center justify-center disabled:cursor-default"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPage}
        onClick={onNext}
      >
        <Image
          src={chevronLeftCircleIcon}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 rotate-180"
        />
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: "충족" | "미충족" }) {
  const isUnsatisfied = status === "미충족";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap",
        isUnsatisfied
          ? "bg-[#EFEFF1] text-[#8892A6]"
          : "bg-[#DBEAFE] text-[#4379EF]",
      )}
    >
      ● {status}
    </span>
  );
}

function AppliedAt({ value }: { value?: string | null }) {
  return (
    <span className="whitespace-nowrap">
      {value ? formatWorkRequestSummaryRequestedAt(value) : EMPTY_MEMBER_TEXT}
    </span>
  );
}
