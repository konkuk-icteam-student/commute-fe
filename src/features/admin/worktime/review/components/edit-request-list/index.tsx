import { useState } from "react";

import { useGetAdminWorkChangeRequestsQuery } from "@/apis/admin/work-change-requests";
import { cn } from "@/lib/utils";

import { WorktimeEditRequestItem } from "../../../components";
import { toWorktimeEditRequestItems } from "../../../utils";

interface EditRequestListProps {
  year: number;
  month: number;
}

export default function EditRequestList({ year, month }: EditRequestListProps) {
  const [tabType, setTabType] = useState<"PENDING" | "COMPLETED">("PENDING");
  const {
    adminWorkChangeRequestsData,
    isPendingAdminWorkChangeRequests,
    isErrorAdminWorkChangeRequests,
  } = useGetAdminWorkChangeRequestsQuery({
    year,
    month,
    statusCode: tabType === "PENDING" ? "CS01" : "ALL",
    page: 0,
    size: 20,
  });
  const editRequestList = adminWorkChangeRequestsData
    ? toWorktimeEditRequestItems(adminWorkChangeRequestsData).filter((item) =>
        tabType === "PENDING"
          ? item.statusCode === "CS01"
          : item.statusCode !== "CS01",
      )
    : [];

  return (
    <div className="flex w-full max-w-250 flex-col items-center gap-4 rounded-xl bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <div className="flex w-full flex-row">
        <button
          type="button"
          className={cn(
            "flex h-14 flex-1 items-center justify-center",
            tabType === "PENDING"
              ? "border-b-4 border-b-[#063A74] text-[#063A74]"
              : "border-b-2 border-b-[#B1B8BE]",
          )}
          onClick={() => setTabType("PENDING")}
        >
          <span className="text-lg font-bold">대기 중인 요청</span>
        </button>
        <button
          type="button"
          className={cn(
            "flex h-14 flex-1 items-center justify-center",
            tabType === "COMPLETED"
              ? "border-b-4 border-b-[#063A74] text-[#063A74]"
              : "border-b-2 border-b-[#b1b8be83]",
          )}
          onClick={() => setTabType("COMPLETED")}
        >
          <span className="text-lg font-bold">처리된 요청</span>
        </button>
      </div>
      {isPendingAdminWorkChangeRequests ? (
        <p className="py-8 text-base text-[#6B7280]">
          수정 요청을 불러오는 중입니다.
        </p>
      ) : isErrorAdminWorkChangeRequests ? (
        <p className="py-8 text-base text-[#FD7171]">
          수정 요청을 불러오지 못했습니다.
        </p>
      ) : editRequestList.length === 0 ? (
        <p className="py-8 text-base text-[#6B7280]">
          {tabType === "PENDING"
            ? "대기 중인 수정 요청이 없습니다."
            : "처리된 수정 요청이 없습니다."}
        </p>
      ) : null}
      {editRequestList.map((item, index) => (
        <div key={item.requestId} className="w-full">
          <WorktimeEditRequestItem type="LIST" {...item} />
          {index !== editRequestList.length - 1 && (
            <div className="h-px w-full bg-[#B1B8BE]" />
          )}
        </div>
      ))}
    </div>
  );
}
