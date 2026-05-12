import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
  onClick: () => void;
}

export default function Button({
  children,
  size = "md",
  disabled = false,
  onClick,
}: ButtonProps) {
  const buttonStyles =
    size === "lg"
      ? "w-full h-14 text-base rounded-[46px]"
      : size === "md"
        ? "w-29 h-9 text-sm rounded-lg"
        : "w-16 h-7 text-xs rounded-lg";

  // TODO: 호버 시 커서 변경되도록 설정 필요!!!!
  return (
    <button
      className={cn(
        "flex cursor-pointer items-center justify-center bg-[#2076FF] text-white disabled:cursor-auto disabled:bg-[#979797]",
        buttonStyles,
      )}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
