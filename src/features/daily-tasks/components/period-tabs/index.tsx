import { cn } from "@/lib/utils";

import { dailyTaskPeriods } from "../../constants";
import type { DailyTaskPeriod } from "../../types";

type PeriodTabsProps = {
  selectedPeriod: DailyTaskPeriod;
  onChange: (period: DailyTaskPeriod) => void;
};

export default function PeriodTabs({
  selectedPeriod,
  onChange,
}: PeriodTabsProps) {
  return (
    <div className="flex rounded-sm bg-[#F0F2F8] p-0.5">
      {dailyTaskPeriods.map((period) => {
        const isSelected = selectedPeriod === period.value;

        return (
          <button
            className={cn(
              "inline-flex h-6 w-8.75 cursor-pointer items-center justify-center rounded-sm px-1.5 text-[12px] leading-none font-medium",
              isSelected
                ? "border-0.5 border-[#DDE3EF] bg-white text-[#1A2236]"
                : "text-[#8892A6]",
            )}
            key={period.value}
            type="button"
            onClick={() => onChange(period.value)}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
}
