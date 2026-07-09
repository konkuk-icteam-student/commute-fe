import type { MouseEvent } from "react";

import { cn } from "@/lib/utils";

import { WorktimeChangeRequestType } from "../../types";
import {
  formatWorktimeRequestDateTime,
  formatWorktimeRequestSlot,
} from "../../utils";

interface WorktimeEditRequestItemProps {
  type: "CARD" | "LIST";
  requestId: string;
  requestedAt: string;
  name: string;
  deleteSlots: WorktimeChangeRequestType[];
  addSlots: WorktimeChangeRequestType[];
  reason: string;
  userResult?: string;
  handleClickRequestCard?: (name: string) => void;
}

export default function WorktimeEditRequestItem({
  type = "CARD",
  requestId,
  requestedAt,
  name,
  deleteSlots,
  addSlots,
  reason,
  userResult,
  handleClickRequestCard,
}: WorktimeEditRequestItemProps) {
  const handleReject = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(requestId, " 요청 거절");
  };
  const handleAccept = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(requestId, " 요청 승인");
  };

  // 완전 중요!!! 요청 시간, 삭제, 추가 시간 모두 포맷하도록 하기.
  // TODO: 근로시간 관리 - 근로시간 수정요청 페이지 진행
  return (
    <div
      role="button"
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl bg-white p-6",
        type === "CARD"
          ? userResult === name
            ? "border-2 border-[#256EF4]"
            : "border border-[#B1B8BE]"
          : "",
      )}
      onClick={() => handleClickRequestCard && handleClickRequestCard(name)}
    >
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-bold">{name}</h3>
        <span className="text-sm text-[#6B7280]">
          {formatWorktimeRequestDateTime(requestedAt)}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-base font-bold text-[#FD7171]">삭제</span>
        {deleteSlots.map((item, index) => (
          <span
            key={`${item.start}-${item.end} / ${index}`}
            className="text-base text-[#464C53]"
          >
            {formatWorktimeRequestSlot(item)}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-base font-bold text-[#2563EB]">추가</span>
        {addSlots.map((item, index) => (
          <span
            key={`${item.start}-${item.end} / ${index}`}
            className="text-base text-[#464C53]"
          >
            {formatWorktimeRequestSlot(item)}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-base font-bold text-[#464C53]">사유</span>
        <span className="text-base text-[#464C53]">{reason}</span>
      </div>
      <div className="mt-5 flex flex-row items-center justify-end gap-2">
        <button
          className="cursor-pointer rounded-md border px-5 py-1.5 text-base"
          type="button"
          onClick={handleReject}
        >
          반려
        </button>
        <button
          className="cursor-pointer rounded-md bg-[#256EF4] px-5 py-1.5 text-base text-white"
          type="button"
          onClick={handleAccept}
        >
          승인
        </button>
      </div>
    </div>
  );
}
