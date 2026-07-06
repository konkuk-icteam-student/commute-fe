import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import informIcon from "@/assets/icons/common/ic_inform_blue.svg";
import icRight from "@/assets/icons/common/ic_chevron_right.svg";
import { SLOT_STATUS_CLASS_NAME } from "@/features/schedule";

const SCHEDULE_STATUS_LEGEND_ITEMS = [
  {
    label: "신청 불가",
    className: SLOT_STATUS_CLASS_NAME.UNAVAILABLE,
  },
  {
    label: "추가 신청",
    className: SLOT_STATUS_CLASS_NAME.PENDING_ADD,
  },
  {
    label: "삭제 신청",
    className: SLOT_STATUS_CLASS_NAME.PENDING_DELETE,
  },
  {
    label: "근무 시간",
    className: SLOT_STATUS_CLASS_NAME.MY_SCHEDULE,
  },
];

export default function WorktimeEditRequestHeader() {
  const handleConfirmAll = () => {
    console.log("일괄 승인");
  };

  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <Link
          href="/admin/worktime/review"
          className="flex flex-row items-center gap-0.5"
        >
          <h2 className="text-xl font-bold text-[#052B57]">
            근로시간 수정요청
          </h2>
          <Image
            className="h-8 w-8"
            src={icRight}
            alt="근로시간 수정요청 페이지"
          />
        </Link>
        <button
          className="cursor-pointer rounded-md bg-[#256EF4] px-4 py-2 text-base text-white"
          type="button"
          onClick={handleConfirmAll}
        >
          일괄 승인
        </button>
      </div>
      <section className="flex w-full flex-col items-start gap-2 rounded-[10px] bg-[#DBEAFE] px-4 py-2.5">
        <div className="flex flex-row items-center gap-1.75">
          <Image
            className="pt-px pr-px"
            src={informIcon}
            alt=""
            aria-hidden="true"
          />
          <span className="text-[11px] leading-3 text-[#1A2236]">
            클릭한 카드 작성자의 시간표가 표시됩니다.
          </span>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-2.5 pl-5">
          {SCHEDULE_STATUS_LEGEND_ITEMS.map(({ label, className }) => (
            <div key={label} className="flex flex-row items-center gap-0.75">
              <div className={cn("h-2.5 w-2.5 rounded-full", className)} />
              <span className="text-[10px] text-[#1A2236]">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </header>
  );
}
