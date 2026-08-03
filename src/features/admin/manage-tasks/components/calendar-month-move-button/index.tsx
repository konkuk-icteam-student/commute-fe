import Image from "next/image";

import chevronRightCircleIcon from "@/assets/icons/admin-manage-tasks/ic_chevron_right_circle.svg";
import { cn } from "@/lib/utils";

export default function CalendarMonthMoveButton({
  ariaLabel,
  disabled = false,
  direction,
  onClick,
}: {
  ariaLabel: string;
  disabled?: boolean;
  direction: "next" | "previous";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        "flex h-8 w-8 items-center justify-center",
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <Image
        src={chevronRightCircleIcon}
        alt=""
        width={32}
        height={32}
        className={cn(direction === "previous" && "rotate-180")}
      />
    </button>
  );
}
