import Image from "next/image";
import type { ReactNode } from "react";

import icDown from "@/assets/icons/common/ic_down.svg";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  countLabel?: string;
  headerDivider?: "inset" | "full" | "none";
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function SectionCard({
  title,
  countLabel,
  headerDivider = "inset",
  isOpen,
  onToggle,
  children,
}: SectionCardProps) {
  const shouldShowHeaderDivider = isOpen && headerDivider !== "none";

  return (
    <section className="rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white">
      <button
        className={cn(
          "flex h-11.5 w-full cursor-pointer items-center justify-between px-3",
          shouldShowHeaderDivider &&
            headerDivider === "full" &&
            "border-b-[0.5px] border-[#DDE3EF]",
        )}
        type="button"
        onClick={onToggle}
      >
        <div
          className={cn(
            "flex h-full w-full items-center justify-between",
            shouldShowHeaderDivider &&
              headerDivider === "inset" &&
              "border-b-[0.3px] border-[#DDE3EF]",
          )}
        >
          <h2 className="text-[14px] leading-3.5 font-bold tracking-[0.24px] text-black">
            {title}
          </h2>
          <div className="flex items-center justify-center gap-1.25 pr-1">
            {countLabel && (
              <span className="flex h-5.25 min-w-9.25 items-center justify-center rounded-2xl border-[0.5px] border-[#DDE3EF] bg-[#EDF5FF] px-2 text-[11px] leading-none font-bold text-[#2563EB]">
                {countLabel}
              </span>
            )}
            <span className="flex h-5 w-5 items-center justify-center rounded-2xl border-[0.5px] border-[#DDE3EF] bg-[#EFF6FF]">
              <Image
                alt=""
                aria-hidden="true"
                className={cn(
                  "transition-transform",
                  isOpen ? "" : "rotate-180",
                )}
                src={icDown}
                width={9}
                height={5}
              />
            </span>
          </div>
        </div>
      </button>
      {isOpen && children}
    </section>
  );
}
