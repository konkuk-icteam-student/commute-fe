import Image from "next/image";

import chevronLeftCircleIcon from "@/assets/icons/admin-worktime-request/ic_chevron_left_circle.svg";
import sortIcon from "@/assets/icons/admin-worktime-request/ic_sort.svg";
import { cn } from "@/lib/utils";
import { workRequestSummaryRows } from "../../mocks";

export default function SummaryTable() {
  return (
    <div className="min-h-74 min-w-0">
      <PaginationIndicator />
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
          {workRequestSummaryRows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[#D6E0EB] text-sm text-[#464C53]"
            >
              <td className="px-4 py-[14.5px] font-semibold whitespace-nowrap">
                {row.name}
              </td>
              <td className="px-4 py-[14.5px] whitespace-nowrap">
                {row.studentId}
              </td>
              <td className="px-4 py-[14.5px] whitespace-nowrap">
                {row.department}
              </td>
              <td className="px-4 py-[14.5px] whitespace-nowrap">
                {row.grade}
              </td>
              <td className="px-4 py-[14.5px] whitespace-nowrap">
                {row.totalHours}
              </td>
              <td className="px-4 py-[14.5px] whitespace-nowrap">
                <StatusBadge status={row.status} />
              </td>
              <td className="w-40 px-4 py-[14.5px] whitespace-nowrap">
                <AppliedAt value={row.appliedAt} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaginationIndicator() {
  return (
    <div className="mb-5 flex items-center gap-1.5">
      <button
        type="button"
        className="flex h-5 w-5 items-center justify-center"
      >
        <Image
          src={chevronLeftCircleIcon}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
        />
      </button>
      <span className="text-[15px] font-bold text-[#1A2236]">1/3</span>
      <button
        type="button"
        className="flex h-5 w-5 items-center justify-center"
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

function StatusBadge({ status }: { status: string }) {
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

function AppliedAt({ value }: { value: string }) {
  const [date, time] = value.split(" ");

  if (!date || !time) {
    return <span className="whitespace-nowrap">{value}</span>;
  }

  return <span className="whitespace-nowrap">{`${date} ${time}`}</span>;
}
