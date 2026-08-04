import Image from "next/image";

import icScheduleRefresh from "@/assets/icons/common/ic_schedule_refresh.svg";

// 신청·수정 요청 화면의 새로고침 버튼.
// onClick을 넘기지 않으면 지금처럼 자리만 차지한다. (api 연동 시 연결 예정)
export default function ScheduleRefreshButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      className="mr-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#DDE3EF]"
      type="button"
      onClick={onClick}
    >
      <Image src={icScheduleRefresh} alt="새로고침" />
    </button>
  );
}
