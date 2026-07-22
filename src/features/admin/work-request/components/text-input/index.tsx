import Image from "next/image";

import calendarIcon from "@/assets/icons/admin-worktime-request/ic_calendar.svg";
import clockIcon from "@/assets/icons/admin-worktime-request/ic_clock.svg";
import { cn } from "@/lib/utils";

export default function TextInput({
  disabled = false,
  icon = "calendar",
  onChange,
  placeholder,
  suffix,
  textAlign = "left",
  value,
  widthClassName = "w-full max-w-43",
}: {
  disabled?: boolean;
  icon?: "calendar" | "clock" | "none";
  onChange?: (value: string) => void;
  placeholder: string;
  suffix?: string;
  textAlign?: "left" | "right";
  value?: string;
  widthClassName?: string;
}) {
  const iconSize = icon === "clock" ? 17 : 16;
  const inputIcon = icon === "clock" ? clockIcon : calendarIcon;

  return (
    <div
      className={cn(
        "flex min-h-10 min-w-0 items-center gap-2 rounded-md border border-[#58616A]/33 bg-white px-4 py-1.5",
        widthClassName,
      )}
    >
      <input
        disabled={disabled}
        className={cn(
          "mt-0.5 min-w-0 flex-1 bg-transparent text-[15px] text-[#1A2236] outline-none placeholder:text-[#8A949E]",
          textAlign === "right" && "text-right",
        )}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      {suffix ? (
        <span className="shrink-0 text-[15px] text-[#8A949E]">{suffix}</span>
      ) : null}
      {icon !== "none" ? (
        <Image
          src={inputIcon}
          alt=""
          width={iconSize}
          height={iconSize}
          className={
            icon === "clock" ? "h-4.25 w-4.25 shrink-0" : "h-4 w-4 shrink-0"
          }
        />
      ) : null}
    </div>
  );
}
