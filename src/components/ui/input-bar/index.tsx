import { cn } from "@/lib/utils";

type InputBarType = "text" | "email" | "password";

type InputBarProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  type?: InputBarType;
  label?: string;
  errorMessage?: string;
};

export default function InputBar({
  type = "text",
  label,
  errorMessage,
  placeholder,
  className,
  autoComplete,
  inputMode,
  ...props
}: InputBarProps) {
  const resolvedAutoComplete =
    autoComplete ?? (type === "email" ? "email" : undefined);
  const resolvedInputMode = inputMode ?? (type === "email" ? "email" : "text");

  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="text-sm font-medium text-[#434343]">{label}</span>
      ) : null}
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={resolvedAutoComplete}
        inputMode={resolvedInputMode}
        aria-invalid={errorMessage ? true : undefined}
        className={cn(
          "w-full rounded-lg border border-[#D8DEE8] bg-white p-4 text-sm text-[#434343] transition-colors outline-none placeholder:text-[#A8B0BE] focus:border-[#2076FF] disabled:cursor-not-allowed disabled:bg-[#F4F6FA] disabled:text-[#A8B0BE]",
          errorMessage && "border-[#E5484D] focus:border-[#E5484D]",
          className,
        )}
        {...props}
      />
      {errorMessage ? (
        <span className="text-xs font-medium text-[#E5484D]">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}
