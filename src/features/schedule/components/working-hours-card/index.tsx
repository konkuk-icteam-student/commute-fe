import { cn } from "@/lib/utils";

interface WorkingHoursCardProps {
  label: string;
  hours: number;
  maxHours?: number;
  withProgressBar?: boolean;
  isRed?: boolean;
  isOverflow?: boolean;
}

export default function WorkingHoursCard({
  label,
  hours,
  maxHours,
  withProgressBar = false,
  isRed = false,
  isOverflow = false,
}: WorkingHoursCardProps) {
  const progressPercent =
    maxHours && maxHours > 0 ? (hours / maxHours) * 100 : 0;

  return (
    <section
      className={cn(
        "flex w-full flex-col items-center gap-2 rounded-[10px] border border-[#DDE3EF] px-3",
        withProgressBar ? "py-3" : "py-2",
        isOverflow && "border-[#FD7171]",
      )}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <span className="text-xs leading-4.5 font-medium text-[#1A2236]">
          {label}
        </span>
        <span className="text-xs leading-4.5 font-bold text-[#C6CBD4]">
          <span
            className={
              isRed || isOverflow ? "text-[#FD7171]" : "text-[#1D4ED8]"
            }
          >
            {hours}
            {maxHours === undefined && "h"}
          </span>
          {maxHours !== undefined && ` / ${maxHours}h`}
        </span>
      </div>
      {maxHours !== undefined && withProgressBar && (
        <div
          className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAEA]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={maxHours}
          aria-valuenow={hours}
        >
          <div
            className={cn(
              "absolute left-0 h-full rounded-full bg-[#1D4ED8]",
              isOverflow && "bg-[#FD7171]",
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </section>
  );
}
