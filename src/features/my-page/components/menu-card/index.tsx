import Image from "next/image";
import Link from "next/link";

import chevronRightIcon from "@/assets/icons/my-page/ic_chevron_right.svg";
import logoutIcon from "@/assets/icons/my-page/ic_logout.svg";
import worktimeHistoryIcon from "@/assets/icons/my-page/ic_worktime_history.svg";

interface MenuItemProps {
  href?: string;
  iconSrc: string;
  label: string;
}

function MenuItem({ href, iconSrc, label }: MenuItemProps) {
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-2">
        <Image
          alt=""
          aria-hidden="true"
          className="shrink-0"
          height={15}
          src={iconSrc}
          unoptimized
          width={15}
        />
        <span className="flex items-center truncate pt-0.5 text-[12px] leading-4.5 font-bold tracking-[0.21px]">
          {label}
        </span>
      </span>
      <Image
        alt=""
        aria-hidden="true"
        className="shrink-0"
        height={18}
        src={chevronRightIcon}
        unoptimized
        width={18}
      />
    </>
  );

  const className =
    "flex h-10.5 w-full cursor-pointer items-center justify-between gap-3 pl-4.5 pr-2.5 text-sm leading-5 font-bold text-[#1A2236]";

  if (href) {
    return (
      <Link className={className} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} type="button">
      {content}
    </button>
  );
}

export default function MenuCard() {
  return (
    <section className="overflow-hidden rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white shadow-[0_2px_8px_0_#F3F2F2]">
      <MenuItem
        href="/my-page/worktime-history"
        iconSrc={worktimeHistoryIcon}
        label="근무시간 신청기록"
      />
      <div className="border-t-[0.5px] border-[#DDE3EF]" />
      <MenuItem iconSrc={logoutIcon} label="로그아웃" />
    </section>
  );
}
