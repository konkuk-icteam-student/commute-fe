import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  label?: string;
}

// 응답을 기다리는 동안 보여 주는 회전 표시.
export default function Spinner({
  className,
  label = "불러오는 중",
}: SpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block h-7 w-7 animate-spin rounded-full border-2 border-[#DDE3EF] border-t-[#2563EB]",
        className,
      )}
      role="status"
      aria-label={label}
    />
  );
}
