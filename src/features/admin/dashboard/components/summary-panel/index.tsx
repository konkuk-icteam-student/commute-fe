import type { DashboardSummaryItem } from "../../types";

export default function SummaryPanel({
  items,
}: {
  items: DashboardSummaryItem[];
}) {
  return (
    <section className="mx-auto mt-7 w-full max-w-246 rounded-xl border border-[#DDE3EF] bg-[#F4F5F7] px-8 py-5.75">
      <h2 className="text-[24px] font-bold text-[#1E2124]">오늘 근로현황</h2>
      <div className="mt-4 grid grid-cols-4 gap-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex h-35 flex-col items-center justify-center rounded-xl border border-[#DDE3EF] bg-white"
          >
            <p className="text-[19px] font-bold text-[#1E2124]">{item.label}</p>
            <p
              className={`mt-2 text-[32px] font-bold ${
                item.variant === "warning" ? "text-[#FD7171]" : "text-[#1E2124]"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
