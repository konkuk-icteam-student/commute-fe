import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type BadgeVariant = "blue" | "gray" | "green" | "red";

const badgeVariantStyle: Record<BadgeVariant, string> = {
  blue: "bg-[#DBEAFE] text-[#1D4ED8]",
  gray: "bg-[#F0F2F8] text-[#8892A6]",
  green: "bg-[#DCFCE7] text-[#41C26D]",
  red: "bg-[#FFE4E4] text-[#FD7171]",
};

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  text: ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({
  text,
  variant = "gray",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        "flex h-5.25 items-center rounded-2xl px-2 text-[11px] leading-none font-bold",
        badgeVariantStyle[variant],
        className,
      )}
    >
      {text}
    </span>
  );
}
