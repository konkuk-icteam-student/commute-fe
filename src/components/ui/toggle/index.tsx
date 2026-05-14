"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ToggleProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange" | "onClick"
  > {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

export default function Toggle({
  checked,
  onCheckedChange,
  label = "자세히보기",
  className,
  type = "button",
  ...props
}: ToggleProps) {
  return (
    <button
      {...props}
      type={type}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-sm leading-5 font-medium text-[#19191B]",
        className,
      )}
    >
      <span>{label}</span>

      <div
        className={cn(
          "flex h-6 w-10 items-center rounded-xl px-1 transition-colors duration-200",
          checked ? "bg-[#2076FF]" : "bg-[#AFB1B6]",
        )}
      >
        <div
          className={cn(
            "h-4 w-4 rounded-full bg-white transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </div>
    </button>
  );
}
