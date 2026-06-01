import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "status-working"
  | "status-scheduled"
  | "status-absent"
  | "status-completed"
  | "student-blue"
  | "student-green"
  | "student-red"
  | "student-orange"
  | "student-cyan"
  | "student-pink"
  | "student-purple";

const badgeVariantStyle: Record<BadgeVariant, string> = {
  "status-working": "bg-[#DBEAFE] text-[#1D4ED8]",
  "status-scheduled": "bg-[#F0F2F8] text-[#8892A6]",
  "status-absent": "bg-[#FFE4E4] text-[#FD7171]",
  "status-completed": "bg-[#DCFCE7] text-[#41C26D]",
  "student-blue": "bg-[#DBEAFE] text-[#5A7BC8]",
  "student-green": "bg-[#D7FAE3] text-[#66C185]",
  "student-red": "bg-[#FFE4E4] text-[#FD7171]",
  "student-orange": "bg-[#FFE8C7] text-[#D79430]",
  "student-cyan": "bg-[#D5EEF1] text-[#50A8B1]",
  "student-pink": "bg-[#FBDDEA] text-[#D8679B]",
  "student-purple": "bg-[#E6DDF5] text-[#8266C3]",
};

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  text: ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({
  text,
  variant = "status-scheduled",
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
