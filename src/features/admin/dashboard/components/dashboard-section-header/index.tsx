import Image from "next/image";
import Link from "next/link";

import rightGrayIcon from "@/assets/icons/admin-common/ic_chevron_right_gray.svg";
import checkCircleIcon from "@/assets/icons/admin-dashboard/ic_check_circle.svg";

export default function DashboardSectionHeader({
  arrowHref,
  title,
}: {
  arrowHref: string;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 text-[15px] font-bold text-[#1A2236] min-[1728px]:px-5.25 min-[1728px]:pt-6 min-[1728px]:pb-5.25 min-[1728px]:text-[17px]">
      <div className="flex items-center gap-2">
        <Image src={checkCircleIcon} alt="" width={20} height={20} />
        <span className="leading-[22.5px]">{title}</span>
      </div>
      <Link
        href={arrowHref}
        className="flex cursor-pointer items-center justify-center"
        aria-label={`${title} 페이지로 이동`}
      >
        <Image src={rightGrayIcon} alt="" width={16} height={16} />
      </Link>
    </div>
  );
}
