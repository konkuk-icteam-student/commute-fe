import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

interface WorkingHoursCardProps {
  label: string;
  hours: number;
  maxHours?: number;
  withProgressBar?: boolean;
  isRed?: boolean;
  isOverflow?: boolean;
  // 시간을 아직 받지 못한 상태. 0 / 0h가 스쳐 지나가지 않도록 숫자 대신 스피너를 보여 준다.
  isLoading?: boolean;
}

export default function WorkingHoursCard({
  label,
  hours,
  maxHours,
  withProgressBar = false,
  isRed = false,
  isOverflow = false,
  isLoading = false,
}: WorkingHoursCardProps) {
  const progressPercent =
    maxHours && maxHours > 0 ? (hours / maxHours) * 100 : 0;

  return (
    <section
      className={cn(
        "relative flex w-full flex-col items-center gap-2 rounded-[10px] border border-[#DDE3EF] px-3",
        withProgressBar ? "py-3" : "py-2",
        isOverflow && "border-[#FD7171]",
      )}
    >
      {/* 라벨은 화면에서 만드는 값이라 기다릴 필요가 없다. 숫자와 막대만 감춘다. */}
      <div className="flex w-full flex-row items-center justify-between">
        <span className="text-xs leading-4.5 font-medium text-[#1A2236]">
          {label}
        </span>
        <span
          className={cn(
            "text-xs leading-4.5 font-bold text-[#C6CBD4]",
            isLoading && "invisible",
          )}
        >
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
      {isLoading && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <Spinner className="h-4 w-4 border" />
        </div>
      )}
      {maxHours !== undefined && withProgressBar && (
        <div
          className={cn(
            "relative h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAEA]",
            isLoading && "invisible",
          )}
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
