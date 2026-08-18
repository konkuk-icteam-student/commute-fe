import Image from "next/image";

import checkIcon from "@/assets/icons/daily-tasks/ic_check.svg";
import { cn } from "@/lib/utils";

type CheckButtonProps = {
  checked: boolean;
  className?: string;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
};

export default function CheckButton({
  checked,
  className,
  disabled = false,
  label,
  onClick,
}: CheckButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={checked}
      className={cn(
        "flex h-3.75 w-3.75 shrink-0 cursor-pointer items-center justify-center rounded border-[0.5px] disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "border-[#2D81FF] bg-[#2D81FF]" : "border-[#C6CBD4] bg-white",
        className,
      )}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {checked ? (
        <Image alt="" aria-hidden="true" src={checkIcon} width={8} height={6} />
      ) : null}
    </button>
  );
}
