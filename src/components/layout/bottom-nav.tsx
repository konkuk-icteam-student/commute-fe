"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { userNavigationItems } from "@/constants/navigation";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto h-20 w-full max-w-150 bg-[#F0F4FC] px-[26px] py-4">
      <div className="flex h-full items-center justify-between">
        {userNavigationItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className="flex w-[70px] flex-col items-center gap-2"
              href={item.href}
              key={item.href}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                aria-hidden="true"
                src={isActive ? item.activeIcon : item.icon}
              />
              <span
                className={`text-center font-['Noto_Sans_KR'] text-xs leading-4 font-bold tracking-[0.6px] ${
                  isActive ? "text-[#3E9DF7]" : "text-[#B7B7B7]"
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
