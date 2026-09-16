import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BottomActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fixed?: boolean;
}

export default function BottomActionButton({
  children,
  className,
  fixed = false,
  type = "button",
  ...props
}: BottomActionButtonProps) {
  return (
    <button
      className={cn(
        "flex h-14 cursor-pointer items-center justify-center rounded-[46px] bg-[#2076FF] text-base font-normal text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#C6CBD4]",
        fixed
          ? "fixed bottom-5.75 left-1/2 w-[calc(100%-48px)] max-w-88 -translate-x-1/2"
          : "w-full",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
