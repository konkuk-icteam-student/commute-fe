type SummaryCardProps = {
  label: string;
  value: string;
  tone: "emerald" | "sky" | "amber";
};

const toneClasses = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  sky: "border-sky-200 bg-sky-50 text-sky-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
};

export function SummaryCard({ label, tone, value }: SummaryCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <strong className="text-3xl font-bold text-gray-950">{value}</strong>
        <span
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}
        >
          Today
        </span>
      </div>
    </article>
  );
}
