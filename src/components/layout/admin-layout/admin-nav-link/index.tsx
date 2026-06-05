import Image from "next/image";
import Link from "next/link";

import type { ADMIN_NAVIGATION_ITEMS } from "@/constants/navigation";

type AdminNavItem = (typeof ADMIN_NAVIGATION_ITEMS)[number];

export default function AdminNavLink({
  isActive,
  item,
}: {
  isActive: boolean;
  item: AdminNavItem;
}) {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={`flex h-12 w-full items-center gap-3 rounded-lg px-3 min-[1728px]:w-48.75 ${
        isActive ? "bg-[#EEF4FF]" : ""
      }`}
    >
      <Image
        src={isActive ? item.activeIcon : item.icon}
        alt=""
        width={item.iconSize.width}
        height={item.iconSize.height}
      />
      <span
        className={`text-base leading-[150%] font-bold ${
          isActive ? "text-[#005AF0]" : "text-[#B9BCC2]"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}
