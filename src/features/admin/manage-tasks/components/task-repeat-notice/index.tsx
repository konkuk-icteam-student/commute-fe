import Image from "next/image";

import infoCircleIcon from "@/assets/icons/common/ic_info_circle.svg";

export default function TaskRepeatNotice() {
  return (
    <div className="mt-3 grid grid-cols-[12px_minmax(0,1fr)] gap-1 rounded-lg bg-[#F0F2F8] px-2.5 py-2 text-[12px] leading-5 text-[#8892A6]">
      <Image
        src={infoCircleIcon}
        alt=""
        width={12}
        height={12}
        className="mt-1 h-3 w-3"
      />
      <p className="min-w-0">
        업무의{" "}
        <span className="font-bold">
          수정 · 삭제 내용은 다음 날짜의 매일 반복 반영
        </span>
        됩니다.
        <br />
        오늘 하루만 변경하려면 관리자 메모를 이용해주세요.
      </p>
    </div>
  );
}
