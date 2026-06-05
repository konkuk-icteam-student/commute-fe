"use client";

import { usePathname } from "next/navigation";

import {
  ADMIN_NAVIGATION_ITEMS,
  ADMIN_ROUTE_META,
} from "@/constants/navigation";
import AdminHeader from "./admin-header";
import AdminSidebar from "./admin-sidebar";

const DEFAULT_ADMIN_USER = {
  name: "관리자 1212님",
  team: "정보운영팀",
} as const;

export default function AdminLayout({
  adminUser = DEFAULT_ADMIN_USER,
  children,
  showBackButton = false,
  title,
  variant = "with-sidebar",
}: Readonly<{
  adminUser?: {
    name: string;
    team: string;
  };
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  variant?: "topbar" | "with-sidebar";
}>) {
  const pathname = usePathname();
  const routeMeta = ADMIN_ROUTE_META.find((item) => item.href === pathname);
  const currentTitle =
    title ??
    routeMeta?.label ??
    ADMIN_NAVIGATION_ITEMS.find((item) =>
      item.href === "/admin"
        ? pathname === item.href
        : pathname.startsWith(item.href),
    )?.label ??
    ADMIN_NAVIGATION_ITEMS[0].label;
  const shouldShowBackButton = showBackButton || !!routeMeta?.showBackButton;

  return (
    <main className="min-h-screen w-full overflow-x-auto bg-[#F5F5F5]">
      <div className="flex min-h-screen min-w-0">
        {variant === "with-sidebar" ? (
          <AdminSidebar pathname={pathname} />
        ) : null}

        <section className="relative z-10 flex min-w-0 flex-1 flex-col">
          <AdminHeader
            adminUser={adminUser}
            showBackButton={shouldShowBackButton}
            title={currentTitle}
          />
          {children}
        </section>
      </div>
    </main>
  );
}
