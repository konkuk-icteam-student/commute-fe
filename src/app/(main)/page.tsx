import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { RecentCommuteTable } from "@/features/home/components/recent-commute-table";
import { SummaryCard } from "@/features/home/components/summary-card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-5 py-8">
        <section className="flex flex-col gap-5 border-b border-gray-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-emerald-700 uppercase">
              Today
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
              Commute dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
              Track student arrivals, late records, and campus commute activity
              from a simple operational view.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Export</Button>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </section>

        <section className="grid gap-4 py-8 md:grid-cols-3">
          <SummaryCard label="Checked in" tone="emerald" value="128" />
          <SummaryCard label="On route" tone="sky" value="34" />
          <SummaryCard label="Late arrivals" tone="amber" value="7" />
        </section>

        <RecentCommuteTable />
      </div>
    </main>
  );
}
