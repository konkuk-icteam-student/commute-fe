import { useState } from "react";
import Image from "next/image";

import homeRefreshIcon from "@/assets/icons/home/ic_home_refresh.svg";

type DateRefreshButtonProps = {
  currentDateTime: string;
  onRefresh: () => void;
};

export default function DateRefreshButton({
  currentDateTime,
  onRefresh,
}: DateRefreshButtonProps) {
  const [rotationCount, setRotationCount] = useState(0);

  const refresh = () => {
    setRotationCount((count) => count + 1);
    onRefresh();
  };

  return (
    <button
      className="mt-5.5 ml-1.25 inline-flex h-6.5 w-fit max-w-full min-w-51.25 cursor-pointer items-center justify-center gap-1.25 rounded-[20px] border border-[#DDE3EF] bg-[#F0F2F8] px-[8.5px] text-[12px] leading-4 font-bold text-[#8892A6]"
      onClick={refresh}
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="shrink-0 transition-transform duration-1000 ease-in-out"
        src={homeRefreshIcon}
        style={{ transform: `rotate(${rotationCount * -360}deg)` }}
        width={12}
        height={12}
      />
      <span className="mt-0.5 min-w-0 truncate tracking-[0.015em]">
        {currentDateTime}
      </span>
    </button>
  );
}
