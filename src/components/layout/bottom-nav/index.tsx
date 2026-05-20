"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { userNavigationItems } from "@/constants/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto h-20 w-full max-w-150 rounded-t-[20px] [border-width:0.5px_0.5px_0_0.5px] border-solid border-[#DDE3EF] bg-white px-6.5 py-4">
      <div className="flex h-full items-center justify-between">
        {userNavigationItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className="flex h-12 w-17.5 flex-col items-center"
              href={item.href}
              key={item.href}
            >
              <div className="flex h-8 items-center justify-center">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={
                    isActive ? item.activeIconSize.height : item.iconSize.height
                  }
                  src={isActive ? item.activeIcon : item.icon}
                  unoptimized
                  width={
                    isActive ? item.activeIconSize.width : item.iconSize.width
                  }
                />
              </div>
              <span
                className={`h-4 text-center text-xs leading-4 font-bold ${
                  isActive ? "text-[#2563EB]" : "text-[#C6CBD4]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
