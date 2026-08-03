import Image from "next/image";

import kuLogo from "@/assets/icons/admin-nav/ic_KU_logo.svg";
import { ADMIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import { isPathActive } from "@/lib/route-match";
import AdminNavLink from "../admin-nav-link";

export default function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="sticky top-0 z-0 h-screen w-77 shrink-0 border-r-[0.5px] [border-right-width:0.5px] border-[#DDE3EF] bg-white px-10.75 pt-20 shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]">
      <div className="flex h-16.5 w-55.5 items-center gap-3">
        <Image
          src={kuLogo}
          alt="KU"
          width={90}
          height={47}
          className="h-auto w-22.5"
          priority
        />
        <p className="text-[22px] leading-[150%] font-bold whitespace-nowrap text-[#111111]">
          건국대학교
          <br />
          출근부 시스템
        </p>
      </div>

      <nav className="mt-12 h-68 w-48.75 space-y-2">
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
