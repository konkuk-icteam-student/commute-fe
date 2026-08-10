import type { MouseEvent } from "react";

import { useUpdateAdminWorkChangeRequestMutation } from "@/apis/admin/work-change-requests";
import { cn } from "@/lib/utils";

import { WorktimeChangeRequestType } from "../../types";
import {
  formatWorktimeRequestDateTime,
  formatWorktimeRequestSlot,
} from "../../utils";

interface WorktimeEditRequestItemProps {
  type: "CARD" | "LIST";
  requestId: number;
  requestedAt: string;
  name: string;
  deleteSlots: WorktimeChangeRequestType[];
  addSlots: WorktimeChangeRequestType[];
  reason: string;
  statusCode?: string;
  rejectReason?: string | null;
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
  statusCode = "CS01",
  rejectReason,
  userResult,
  handleClickRequestCard,
}: WorktimeEditRequestItemProps) {
  const {
    updateAdminWorkChangeRequest,
    isPendingUpdateAdminWorkChangeRequest,
  } = useUpdateAdminWorkChangeRequestMutation();
  const isPendingRequest = statusCode === "CS01";

  const handleReject = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rejectReason = window.prompt("반려 사유를 입력해주세요.");

    if (!rejectReason?.trim()) {
      return;
    }

    updateAdminWorkChangeRequest({
      requestId,
      statusCode: "CS03",
      rejectReason: rejectReason.trim(),
    });
  };
  const handleAccept = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    updateAdminWorkChangeRequest({
      requestId,
      statusCode: "CS02",
      rejectReason: null,
    });
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
      {deleteSlots.length > 0 && (
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
      )}
      {addSlots.length > 0 && (
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
      )}
      <div className="flex flex-col gap-2">
        <span className="text-base font-bold text-[#464C53]">사유</span>
        <span className="text-base text-[#464C53]">{reason}</span>
      </div>
      {!isPendingRequest && (
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold text-[#464C53]">처리 상태</span>
          <span className="text-base text-[#464C53]">
            {statusCode === "CS02" ? "승인완료" : "반려"}
          </span>
          {rejectReason && (
            <span className="text-base text-[#FD7171]">{rejectReason}</span>
          )}
        </div>
      )}
      {isPendingRequest && (
        <div className="mt-5 flex flex-row items-center justify-end gap-2">
          <button
            className="cursor-pointer rounded-md border px-5 py-1.5 text-base disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={isPendingUpdateAdminWorkChangeRequest}
            onClick={handleReject}
          >
            반려
          </button>
          <button
            className="cursor-pointer rounded-md bg-[#256EF4] px-5 py-1.5 text-base text-white disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={isPendingUpdateAdminWorkChangeRequest}
            onClick={handleAccept}
          >
            승인
          </button>
        </div>
      )}
    </div>
  );
}
