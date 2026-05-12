import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
  handleClick: () => void;
}

export default function Button({
  children,
  size = "md",
  disabled = false,
  handleClick,
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
        "flex items-center justify-center bg-[#2076FF] text-white",
        buttonStyles,
        disabled && "bg-[#979797]",
      )}
      type="button"
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
