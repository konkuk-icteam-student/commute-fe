import type { AdminCalendarDay } from "@/utils/calendar";
import { cn } from "@/lib/utils";

export default function CalendarDayButton({
  day,
  isDisabled,
  isSelected,
  isToday,
  onSelectDate,
}: {
  day: AdminCalendarDay;
  isDisabled: boolean;
  isSelected: boolean;
  isToday: boolean;
  onSelectDate: (date: string) => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "relative mx-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[17px]",
        isDisabled
          ? "cursor-not-allowed text-[#C6CBD4]"
          : isSelected
            ? "bg-[#2076FF] text-white"
            : day.isCurrentMonth
              ? "text-[#454C53]"
              : "text-[#8A949E]",
      )}
      disabled={isDisabled}
      onClick={() => onSelectDate(day.dateValue)}
    >
      {day.day}
      {isToday ? (
        <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#D63D4A]" />
      ) : null}
    </button>
  );
}
