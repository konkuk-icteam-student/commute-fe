import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function SettingsCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#DDE3EF] bg-white px-8 pt-8 pb-9.25",
        className,
      )}
    >
      {children}
    </div>
  );
}
