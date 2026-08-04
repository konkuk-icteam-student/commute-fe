import Image from "next/image";

import chevronLeftCircleIcon from "@/assets/icons/admin-worktime-request/ic_chevron_left_circle.svg";
import { cn } from "@/lib/utils";

export default function MonthMoveButton({
  ariaLabel,
  direction = "previous",
  disabled = false,
  onClick,
}: {
  ariaLabel: string;
  direction?: "next" | "previous";
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        "flex h-6 w-6 items-center justify-center",
        disabled ? "cursor-default opacity-40" : "cursor-pointer",
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <Image
        src={chevronLeftCircleIcon}
        alt=""
        width={24}
        height={24}
        className={cn("h-6 w-6", direction === "next" && "rotate-180")}
      />
    </button>
  );
}
