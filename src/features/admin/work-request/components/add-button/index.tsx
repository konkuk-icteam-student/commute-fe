import { cn } from "@/lib/utils";

export default function AddButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "h-9.25 w-19.5 shrink-0 rounded-md text-[15px] font-semibold",
        disabled
          ? "bg-[#C6CBD4] text-white"
          : "cursor-pointer bg-[#2076FF] text-white",
      )}
      disabled={disabled}
      onClick={onClick}
    >
      추가
    </button>
  );
}
