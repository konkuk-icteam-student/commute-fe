"use client";

import { usePathname } from "next/navigation";

import {
  ADMIN_NAVIGATION_ITEMS,
  ADMIN_ROUTE_META,
} from "@/constants/navigation";
import { isPathActive } from "@/lib/route-match";
import AdminHeader from "./admin-header";
import AdminSidebar from "./admin-sidebar";

export default function AdminLayout({
  adminUser,
  children,
  showBackButton = false,
  title,
  variant = "with-sidebar",
}: Readonly<{
  adminUser?: {
    name: string;
    team?: string;
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
      isPathActive(pathname, item.href, { exact: item.href === "/admin" }),
    )?.label ??
    ADMIN_NAVIGATION_ITEMS[0].label;
  const shouldShowBackButton = showBackButton || !!routeMeta?.showBackButton;

  return (
    <main className="flex h-screen w-full min-w-0 overflow-hidden bg-white">
      {variant === "with-sidebar" ? <AdminSidebar pathname={pathname} /> : null}

      <div className="h-screen min-w-0 flex-1 overflow-x-auto overflow-y-auto">
        <section className="@container/dashboard relative z-10 flex min-h-full min-w-7xl flex-col">
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
