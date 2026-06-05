import { cn } from "@/lib/utils";

interface WorkingHoursCardProps {
  label: string;
  hours: number;
  maxHours?: number;
  withProgressBar?: boolean;
  isRed?: boolean;
}

export default function WorkingHoursCard({
  label,
  hours,
  maxHours,
  withProgressBar = false,
  isRed = false,
}: WorkingHoursCardProps) {
  const progressPercent =
    maxHours && maxHours > 0 ? (hours / maxHours) * 100 : 0;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border border-[#DDE3EF] px-3",
        withProgressBar ? "py-3" : "py-2",
      )}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <span className="text-xs leading-4.5 font-medium text-[#1A2236]">
          {label}
        </span>
        <span className="text-xs leading-4.5 font-bold text-[#C6CBD4]">
          <span className={isRed ? "text-[#FD7171]" : "text-[#1D4ED8]"}>
            {hours}{" "}
          </span>
          {maxHours && `/ ${maxHours}h`}
        </span>
      </div>
      {maxHours && withProgressBar && (
        <div
          className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAEA]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={maxHours}
          aria-valuenow={hours}
        >
          <div
            className="absolute left-0 h-full rounded-full bg-[#1D4ED8]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
