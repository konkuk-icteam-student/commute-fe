import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  state?: "default" | "active" | "error" | "success";
}

export default function Input({
  label,
  state = "default",
  className,
  "aria-invalid": ariaInvalid,
  ...props
}: InputProps) {
  const showStatusIcon = state === "error" || state === "success";

  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-sm font-normal text-[#434343]">
          {label}
        </span>
      ) : null}
      <span className="relative block">
        <input
          className={cn(
            "h-13.25 w-full rounded-lg border border-[#BDBDBD] bg-white px-4.5 text-sm font-normal text-[#09121C] transition-colors outline-none placeholder:text-[#09121C]/50",
            showStatusIcon && "pr-11",
            state !== "error" && "focus:border-[#8DB4FF]",
            state === "active" && "border-[#2663EB]/70",
            state === "error" &&
              "border-[#EB2626]/70 focus:border-[#EB2626]/70",
            state === "success" && "border-[#2663EB]/70",
            className,
          )}
          aria-invalid={ariaInvalid ?? (state === "error" ? true : undefined)}
          {...props}
        />
        {state === "error" ? (
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-xl leading-none text-[#F24822]"
          >
            ×
          </span>
        ) : null}
        {state === "success" ? (
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-lg leading-none text-[#2563EB]"
          >
            ✓
          </span>
        ) : null}
      </span>
    </label>
  );
}
