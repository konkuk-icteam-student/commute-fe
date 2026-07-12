import type { DashboardSummaryItem } from "../../types";

export default function SummaryPanel({
  items,
}: {
  items: DashboardSummaryItem[];
}) {
  return (
    <section className="mx-auto mt-5 w-full max-w-246 rounded-xl border border-[#DDE3EF] bg-[#F4F5F7] px-6 py-5 min-[1728px]:mt-7 min-[1728px]:px-8 min-[1728px]:py-5.75">
      <h2 className="text-[20px] font-bold text-[#1E2124] min-[1728px]:text-[24px]">
        오늘 근로현황
      </h2>
      <div className="mt-4 grid grid-cols-4 gap-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex h-28 flex-col items-center justify-center rounded-xl border border-[#DDE3EF] bg-white min-[1728px]:h-35"
          >
            <p className="text-[16px] font-bold text-[#1E2124] min-[1728px]:text-[19px]">
              {item.label}
            </p>
            <p
              className={`mt-2 text-[28px] font-bold min-[1728px]:text-[32px] ${
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
