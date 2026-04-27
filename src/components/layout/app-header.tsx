import Link from "next/link";
import { navigationItems } from "@/constants/navigation";

export function AppHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link className="text-base font-bold text-gray-950" href="/">
          Commute
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          {navigationItems.map((item) => (
            <Link
              className="transition-colors hover:text-gray-950"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
          href="/login"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
