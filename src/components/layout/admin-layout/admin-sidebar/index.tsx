import Image from "next/image";

import kuLogo from "@/assets/icons/admin-nav/ic_KU_logo.svg";
import { ADMIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import { isPathActive } from "@/lib/route-match";
import AdminNavLink from "../admin-nav-link";

// 1728px 이상에서는 Figma 데스크톱 기준 치수를 사용합니다.
export default function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="relative z-0 w-65 shrink-0 border-r-[0.5px] [border-right-width:0.5px] border-[#DDE3EF] bg-white px-8 pt-6.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.25)] min-[1728px]:w-77 min-[1728px]:px-10.75 min-[1728px]:pt-20">
      <div className="flex h-15 w-48 items-center gap-3 min-[1728px]:h-16.5 min-[1728px]:w-55.5">
        <Image
          src={kuLogo}
          alt="KU"
          width={90}
          height={47}
          className="h-auto w-20 min-[1728px]:w-22.5"
          priority
        />
        <p className="text-lg leading-[150%] font-bold whitespace-nowrap text-[#111111] min-[1728px]:text-[22px]">
          건국대학교
          <br />
          출근부 시스템
        </p>
      </div>

      <nav className="mt-10 h-auto w-full space-y-2 min-[1728px]:mt-12 min-[1728px]:h-68 min-[1728px]:w-48.75">
        {ADMIN_NAVIGATION_ITEMS.map((item) => {
          const isActive = isPathActive(pathname, item.href, {
            exact: item.href === "/admin",
          });

          return (
            <AdminNavLink isActive={isActive} item={item} key={item.href} />
          );
        })}
      </nav>
    </aside>
  );
}
