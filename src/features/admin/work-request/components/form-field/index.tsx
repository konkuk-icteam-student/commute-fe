import type { ReactNode } from "react";

export default function FormField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-2 block text-[15px] font-semibold text-[#464C53]">
        {label}
      </span>
      {children}
    </label>
  );
}
