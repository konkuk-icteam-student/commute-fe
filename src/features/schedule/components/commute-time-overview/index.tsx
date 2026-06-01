interface CommuteTimeOverviewProps {
  week: number;
  month: number;
  usedHours: number;
  weeklyTotalHours: number;
  monthlyTargetHours: number;
}

export default function CommuteTimeOverview({
  week,
  month,
  usedHours,
  weeklyTotalHours,
  monthlyTargetHours,
}: CommuteTimeOverviewProps) {
  const cappedUsedHours = Math.min(Math.max(usedHours, 0), monthlyTargetHours);
  const monthlyProgressPercent =
    monthlyTargetHours > 0
      ? (cappedUsedHours / monthlyTargetHours) * 100
      : 0;

  return (
    <section className="flex w-full flex-col gap-2">
      <div className="flex flex-row items-center justify-between rounded-[10px] border border-[#DDE3EF] px-3 py-2">
        <span className="text-xs leading-4.5 font-medium text-[#1A2236]">
          {week}주차 총 시간
        </span>
        <span className="text-xs leading-4.5 font-bold text-[#1D4ED8]">
          {usedHours} / {weeklyTotalHours}h
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-[10px] border border-[#DDE3EF] p-3">
        <div className="flex w-full flex-row items-center justify-between">
          <span className="text-xs leading-4.5 font-medium text-[#1A2236]">
            {month}월 전체
          </span>
          <span className="text-xs leading-4.5 font-bold text-[#1D4ED8]">
            {usedHours} / {monthlyTargetHours}h
          </span>
        </div>
        <div
          className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAEA]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={monthlyTargetHours}
          aria-valuenow={cappedUsedHours}
        >
          <div
            className="absolute left-0 h-full rounded-full bg-[#1D4ED8]"
            style={{ width: `${monthlyProgressPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
