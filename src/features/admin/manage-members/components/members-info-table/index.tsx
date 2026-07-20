import Image from "next/image";

import icChevronRight from "@/assets/icons/admin-common/ic_chevron-right-black.svg";

// TODO: 추후 부모에게 prop으로 받아오기
import { DUMMY_MEMBER_LIST } from "../../constants";

// TODO: 서버에서 가져오기
const WEEKLY_TOTAL_HOURS = 13;
const MONTHLY_TOTAL_HOURS = 27;

interface MembersInfoTableProps {
  handleDetailOpen: (id: number) => void;
}

export default function MembersInfoTable({
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
          {DUMMY_MEMBER_LIST.map((student) => (
            <tr key={student.id} className="transition-colors hover:bg-gray-50">
              <td className="h-12 px-4 text-center font-medium whitespace-nowrap">
                {student.id}
              </td>
              <td className="h-12 px-4 font-medium whitespace-nowrap">
                {student.name}
              </td>
              <td className="h-12 px-4 whitespace-nowrap">
                {student.studentId}
              </td>
              <td className="h-12 px-4 whitespace-nowrap">
                {student.department}
              </td>
              <td className="h-12 px-4 whitespace-nowrap">
                {student.grade}학년
              </td>
              <td className="h-12 px-4 whitespace-nowrap">{student.phone}</td>
              <td className="h-12 px-4 whitespace-nowrap">
                {student.weeklyWorkedHours}시간 / {WEEKLY_TOTAL_HOURS}시간
              </td>
              <td className="h-12 px-4 whitespace-nowrap">
                {student.monthlyWorkedHours}시간 / {MONTHLY_TOTAL_HOURS}시간
              </td>
              <td className="h-12 px-4 whitespace-nowrap">
                총 {student.editRequestCount}건 (
                {student.monthlyEditRequestCount}건)
              </td>
              <td className="h-12 px-4 whitespace-nowrap">
                총 {student.attendanceIssueCount}건 (
                {student.monthlyAttendanceIssueCount}건)
              </td>
              <td className="h-12 px-4">
                <button
                  type="button"
                  className="cursor-pointer hover:bg-[#EEF4FF]"
                  onClick={() => handleDetailOpen(student.id)}
                >
                  <Image
                    className="h-7 w-7 rounded-lg border border-[#DDE3EF] p-1"
                    src={icChevronRight}
                    alt="상세보기"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
