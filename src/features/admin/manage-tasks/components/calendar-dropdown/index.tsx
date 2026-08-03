import Image from "next/image";
import type { ReactNode } from "react";

import checkBlackIcon from "@/assets/icons/admin-manage-tasks/ic_check_black.svg";
import { cn } from "@/lib/utils";

export function CalendarDropdown({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute z-20 max-h-44 w-23 overflow-y-auto rounded-lg bg-white p-1.5 shadow-[0_2px_10px_0_#00000026]",
        className,
      )}
    >
      <div>{children}</div>
    </div>
  );
}

export function CalendarDropdownButton({
  isSelected,
  label,
  onClick,
}: {
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "m-0 flex w-full cursor-pointer items-center rounded-md px-2 py-2.5 text-left text-[15px] text-[#1A2236] hover:bg-[#EEF2F7] active:bg-[#D6E0EB]",
        isSelected && "bg-[#EEF2F7]",
      )}
      onClick={onClick}
    >
      {isSelected ? (
        <Image
          src={checkBlackIcon}
          alt=""
          width={12}
          height={12}
          className="mr-[5.5px] h-3 w-3"
        />
      ) : null}
      <span>{label}</span>
    </button>
  );
}
