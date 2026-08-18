import Image from "next/image";

import type { AdminWorker } from "@/apis/admin/workers";
import icChevronRight from "@/assets/icons/admin-common/ic_chevron-right-black.svg";

import {
  EMPTY_MEMBER_TEXT,
  formatGrade,
  formatMinutesToHours,
} from "../../utils";

interface MembersInfoTableProps {
  workers: AdminWorker[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  handleDetailOpen: (id: number) => void;
}

const COLUMN_COUNT = 11;

export default function MembersInfoTable({
  workers,
  isLoading,
  isError,
  errorMessage,
  handleDetailOpen,
}: MembersInfoTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-left text-[13px]">
        <colgroup>
          <col className="w-14" />
          <col className="w-20" />
          <col className="w-28" />
          <col className="w-32" />
          <col className="w-16" />
          <col className="w-32" />
          <col className="w-36" />
          <col className="w-36" />
          <col className="w-36" />
          <col className="w-37" />
          <col className="w-20" />
        </colgroup>

        <thead>
          <tr className="border-b-2 border-[#D6E0EB] font-bold">
            <th className="h-10 px-4 text-center">번호</th>
            <th className="h-10 px-4">성명</th>
            <th className="h-10 px-4">학번</th>
            <th className="h-10 px-4">학과</th>
            <th className="h-10 px-4">학년</th>
            <th className="h-10 px-4">연락처</th>
            <th className="h-10 px-4">주간 누적 근무시간</th>
            <th className="h-10 px-4">월간 누적 근무시간</th>
            <th className="h-10 px-2">수강인원 횟수 (이번달)</th>
            <th className="h-10 px-2">근태 이상 횟수 (이번달)</th>
            <th className="h-10 px-4">상세보기</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDE3EF] border-b border-[#DDE3EF] text-sm text-[#464C53]">
          {isError || isLoading || workers.length === 0 ? (
            <tr>
              <td
                className="py-8 text-center text-base text-[#6B7280]"
                colSpan={COLUMN_COUNT}
              >
                {isError ? (
                  // 조회에 실패하면 빈 표가 인원이 없는 것처럼 보이므로 사유를 적는다.
                  <span className="text-[#FD7171]">
                    {errorMessage ?? "근무인원을 불러오지 못했습니다."}
                  </span>
                ) : isLoading ? (
                  "근무인원을 불러오는 중입니다."
                ) : (
                  "조회된 근무인원이 없습니다."
                )}
              </td>
            </tr>
          ) : (
            workers.map((worker) => (
              <tr
                key={worker.userId}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="h-12 px-4 text-center font-medium whitespace-nowrap">
                  {worker.userId}
                </td>
                <td className="h-12 px-4 font-medium whitespace-nowrap">
                  {worker.name}
                </td>
                <td className="h-12 px-4 whitespace-nowrap">
                  {worker.studentId ?? EMPTY_MEMBER_TEXT}
                </td>
                <td className="h-12 px-4 whitespace-nowrap">
                  {worker.department ?? EMPTY_MEMBER_TEXT}
                </td>
                <td className="h-12 px-4 whitespace-nowrap">
                  {formatGrade(worker.grade)}
                </td>
                <td className="h-12 px-4 whitespace-nowrap">
                  {worker.phoneNumber ?? EMPTY_MEMBER_TEXT}
                </td>
                <td className="h-12 px-4 whitespace-nowrap">
                  {formatMinutesToHours(worker.weeklyWorkedMinutes)}시간 /{" "}
                  {formatMinutesToHours(worker.weeklyLimitMinutes)}시간
                </td>
                <td className="h-12 px-4 whitespace-nowrap">
                  {formatMinutesToHours(worker.monthlyWorkedMinutes)}시간 /{" "}
                  {formatMinutesToHours(worker.monthlyLimitMinutes)}시간
                </td>
                <td className="h-12 px-4 whitespace-nowrap">
                  총 {worker.totalChangeRequestCount}건 (승인{" "}
                  {worker.approvedChangeRequestCount}건)
                </td>
                <td className="h-12 px-4 whitespace-nowrap">
                  총 {worker.totalAttendanceIssueCount}건 (지각{" "}
                  {worker.lateCount}건)
                </td>
                <td className="h-12 px-4">
                  <button
                    type="button"
                    className="cursor-pointer hover:bg-[#EEF4FF]"
                    onClick={() => handleDetailOpen(worker.userId)}
                  >
                    <Image
                      className="h-7 w-7 rounded-lg border border-[#DDE3EF] p-1"
                      src={icChevronRight}
                      alt="상세보기"
                    />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
