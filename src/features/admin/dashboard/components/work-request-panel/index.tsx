"use client";

import Image from "next/image";
import Link from "next/link";

import rightGrayIcon from "@/assets/icons/admin-common/ic_chevron_right_gray.svg";
import minusFilledIcon from "@/assets/icons/common/ic_minus_filled.svg";
import plusFilledIcon from "@/assets/icons/common/ic_plus_filled.svg";
import { useUpdateAdminWorkChangeRequestMutation } from "@/apis/admin/work-change-requests";
import type { DashboardWorkRequest } from "../../types";
import DashboardPanel from "../dashboard-panel";

const MAX_VISIBLE_CHANGE_COUNT = 3;

export default function WorkRequestPanel({
  isError = false,
  isLoading = false,
  requests,
}: {
  isError?: boolean;
  isLoading?: boolean;
  requests: DashboardWorkRequest[];
}) {
  const {
    updateAdminWorkChangeRequest,
    isPendingUpdateAdminWorkChangeRequest,
  } = useUpdateAdminWorkChangeRequestMutation();

  const handleReject = (requestId: number) => {
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

  const handleApprove = (requestId: number) => {
    updateAdminWorkChangeRequest({
      requestId,
      statusCode: "CS02",
      rejectReason: null,
    });
  };

  return (
    <DashboardPanel
      title="근로 시간 승인 요청"
      arrowHref="/admin/worktime/review"
    >
      <div className="grid grid-cols-2 gap-4 px-5.25 pt-0 pb-5">
        {isLoading ? (
          <p className="col-span-2 py-8 text-center text-[15px] text-[#6B7280]">
            요청을 불러오는 중입니다.
          </p>
        ) : isError ? (
          <p className="col-span-2 py-8 text-center text-[15px] text-[#FD7171]">
            요청을 불러오지 못했습니다.
          </p>
        ) : requests.length === 0 ? (
          <p className="col-span-2 py-8 text-center text-[15px] text-[#6B7280]">
            대기 중인 요청이 없습니다.
          </p>
        ) : null}
        {requests.map((request) => (
          <article
            key={request.id}
            className="flex min-h-41 flex-col rounded-xl border border-[#DDE3EF] bg-white px-4 pt-2.75 pb-3.25 shadow-[0_1px_2px_0_rgba(20,24,33,0.04)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-bold text-[#1A2236]">
                {request.name}
              </p>
              <Link
                href={`/admin/worktime/review?requestId=${request.id}`}
                className="flex h-6 w-6 cursor-pointer items-center justify-center"
                aria-label={`${request.name} 수정요청 검토`}
              >
                <Image src={rightGrayIcon} alt="" width={16} height={16} />
              </Link>
            </div>
            <ul className="mt-2.75 h-16 space-y-2 overflow-hidden">
              {request.changes
                .slice(0, MAX_VISIBLE_CHANGE_COUNT)
                .map((change, changeIndex) => (
                  <li
                    key={`${change.text}-${changeIndex}`}
                    className="flex items-start gap-1 text-[14px] leading-4 font-medium text-[#8892A6]"
                  >
                    <Image
                      src={
                        change.type === "add" ? plusFilledIcon : minusFilledIcon
                      }
                      alt=""
                      width={10}
                      height={10}
                    />
                    {change.text}
                  </li>
                ))}
            </ul>
            <div className="mt-auto mr-1 flex justify-end gap-2">
              <button
                type="button"
                className="h-6.75 w-15 cursor-pointer rounded-md border border-[#DDE3EF] bg-white text-[16px] text-[#1E2124] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPendingUpdateAdminWorkChangeRequest}
                onClick={() => handleReject(request.id)}
              >
                반려
              </button>
              <button
                type="button"
                className="h-6.75 w-15 cursor-pointer rounded-md bg-[#2076FF] text-[16px] text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPendingUpdateAdminWorkChangeRequest}
                onClick={() => handleApprove(request.id)}
              >
                승인
              </button>
            </div>
          </article>
        ))}
      </div>
    </DashboardPanel>
  );
}
