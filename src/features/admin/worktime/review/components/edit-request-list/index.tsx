import { useState } from "react";

import { cn } from "@/lib/utils";

import { DUMMY_WORKTIME_EDIT_REQUEST } from "../../../constants";
import { DUMMY_WORKTIME_COMPLETE_EDTI_REQUEST } from "../../../constants/dummy";
import { WorktimeEditRequestItem } from "../../../components";

interface EditRequestListProps {
  year: number;
  month: number;
}

export default function EditRequestList({ year, month }: EditRequestListProps) {
  const [tabType, setTabType] = useState<"PENDING" | "COMPLETED">("PENDING");

  console.log(year, month, tabType, "로 서버에 요청");

  const editRequestList =
    tabType === "PENDING"
      ? DUMMY_WORKTIME_EDIT_REQUEST
      : DUMMY_WORKTIME_COMPLETE_EDTI_REQUEST;

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
