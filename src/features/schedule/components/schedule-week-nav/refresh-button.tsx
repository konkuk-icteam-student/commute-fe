import Image from "next/image";

import icScheduleRefresh from "@/assets/icons/common/ic_schedule_refresh.svg";
import { cn } from "@/lib/utils";

// 화면이 보고 있는 조회를 다시 요청한다.
// 조회에 실패하면 표가 잠긴 채로 남으므로, 사용자가 직접 다시 시도할 통로가 된다.
// className은 배경이 흰색이 아닌 화면에서 버튼 바탕을 맞추는 데 쓴다.
export default function ScheduleRefreshButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "mr-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#DDE3EF]",
        className,
      )}
      type="button"
      onClick={onClick}
    >
      <Image src={icScheduleRefresh} alt="새로고침" />
    </button>
  );
}
