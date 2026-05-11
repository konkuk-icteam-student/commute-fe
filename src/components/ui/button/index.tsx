import { cn } from "@/lib/utils";

type ButtonSize = "lg" | "md" | "sm";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  size?: ButtonSize;
  children: React.ReactNode;
};

const sizeStyles: Record<ButtonSize, string> = {
  lg: "h-14 w-full rounded-full text-base",
  md: "h-9 w-29 rounded-lg text-sm",
  sm: "h-7 w-16 rounded-lg text-xs",
};

export default function Button({
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex cursor-pointer items-center justify-center bg-[#2076FF] font-normal whitespace-nowrap text-white transition-colors disabled:bg-[#979797]",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
