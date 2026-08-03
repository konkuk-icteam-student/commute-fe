import Image from "next/image";
import Link from "next/link";

import rightGrayIcon from "@/assets/icons/admin-common/ic_chevron_right_gray.svg";
import checkCircleIcon from "@/assets/icons/admin-common/ic_check_circle.svg";

export default function DashboardSectionHeader({
  arrowHref,
  headingId,
  title,
}: {
  arrowHref: string;
  headingId: string;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between px-5.25 pt-6 pb-5.25 text-[17px] font-bold text-[#1A2236]">
      <div className="flex items-center gap-2">
        <Image src={checkCircleIcon} alt="" width={20} height={20} />
        <h2 id={headingId} className="leading-[22.5px]">
          {title}
        </h2>
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
