"use client";

import Image from "next/image";
import Link from "next/link";

import rightGrayIcon from "@/assets/icons/admin-common/ic_chevron_right_gray.svg";
import minusFilledIcon from "@/assets/icons/common/ic_minus_filled.svg";
import plusFilledIcon from "@/assets/icons/common/ic_plus_filled.svg";
import DashboardSectionHeader from "../dashboard-section-header";
import type { DashboardWorkRequest } from "../../types";

export default function WorkRequestPanel({
  requests,
}: {
  requests: DashboardWorkRequest[];
}) {
  const handleReject = (requestId: number) => {
    // TODO: 근로 시간 수정요청 반려 API 연동 시 실제 action으로 교체합니다.
    console.log("반려 버튼 클릭", { requestId });
  };

  const handleApprove = (requestId: number) => {
    // TODO: 근로 시간 수정요청 승인 API 연동 시 실제 action으로 교체합니다.
    console.log("승인 버튼 클릭", { requestId });
  };

  return (
    <section className="rounded-xl border border-[#DDE3EF] bg-[#F4F5F7]">
      <DashboardSectionHeader
        title="근로 시간 승인 요청"
        arrowHref="/admin/worktime/review"
      />
      <div className="grid grid-cols-2 gap-2 px-4 pt-0 pb-4 min-[1728px]:gap-4 min-[1728px]:px-5.25 min-[1728px]:pb-5">
        {requests.map((request) => (
          <article
            key={request.id}
            className="rounded-xl border border-[#DDE3EF] bg-white px-4 pt-2.75 pb-3.25 shadow-[0_1px_2px_0_rgba(20,24,33,0.04)]"
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
            <ul className="mt-2.75 space-y-2">
              {request.changes.map((change, changeIndex) => (
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
            <div className="mt-3.5 mr-1 flex justify-end gap-2">
              <button
                type="button"
                className="h-6.75 w-15 cursor-pointer rounded-md border border-[#DDE3EF] bg-white text-[16px] text-[#1E2124]"
                onClick={() => handleReject(request.id)}
              >
                반려
              </button>
              <button
                type="button"
                className="h-6.75 w-15 cursor-pointer rounded-md bg-[#2076FF] text-[16px] text-white"
                onClick={() => handleApprove(request.id)}
              >
                승인
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
