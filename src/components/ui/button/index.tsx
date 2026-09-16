import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "lg" | "md" | "sm";
}

export default function Button({
  children,
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const buttonStyles =
    size === "lg"
      ? "w-full h-14 text-base rounded-[46px]"
      : size === "md"
        ? "w-29 h-9 text-sm rounded-lg"
        : "w-16 h-7 text-xs rounded-lg";

  return (
    <button
      className={cn(
        "flex cursor-pointer items-center justify-center bg-[#2076FF] font-normal text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#C6CBD4]",
        buttonStyles,
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
