interface WorkSummaryCardProps {
  title: string;
  currentHours: number;
  totalHours: number;
}

export default function WorkSummaryCard({
  title,
  currentHours,
  totalHours,
}: WorkSummaryCardProps) {
  const progress =
    totalHours > 0
      ? Math.max(0, Math.min((currentHours / totalHours) * 100, 100))
      : 0;

  return (
    <article className="min-w-0 rounded-2xl border-[0.5px] border-[#DDE3EF] bg-white px-3 py-5 shadow-[0_2px_8px_0_#F3F2F2]">
      <h2 className="text-[10px] font-bold text-[#8892A6]">{title}</h2>
      <p className="mt-2 flex items-end gap-1 px-0.75 leading-none">
        <strong className="text-[20px] font-bold text-[#2563EB]">
          {currentHours}
        </strong>
        <span className="pt-1 text-xs font-bold text-[#C6CBD4]">
          / {totalHours}h
        </span>
      </p>
      <div
        className="relative mt-3 ml-0.75 h-1.5 w-[calc(100%_-_10.5px)] overflow-hidden rounded-full bg-[#EFF2F8]"
        role="progressbar"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={totalHours}
        aria-valuenow={currentHours}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#2563EB]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </article>
  );
}
