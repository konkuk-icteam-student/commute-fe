"use client";

import Image from "next/image";
import { useState } from "react";

import checkIcon from "@/assets/icons/admin-worktime-request/ic_check.svg";
import chevronDownIcon from "@/assets/icons/admin-worktime-request/ic_chevron_down.svg";
import { cn } from "@/lib/utils";

export default function MockSelect({
  defaultOpen = false,
  disabled = false,
  onChange,
  options,
  placeholder = "선택해주세요.",
  value,
  widthClassName = "w-full max-w-54.5",
}: {
  defaultOpen?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  options: string[];
  placeholder?: string;
  value: string;
  widthClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const selected = value;

  return (
    <div className={cn("relative min-w-0", widthClassName)}>
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-md border border-[#58616A]/33 bg-white px-4 text-left text-[15px] text-[#8A949E]",
          disabled ? "cursor-default" : "cursor-pointer",
        )}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate whitespace-nowrap",
            selected ? "text-[#1A2236]" : "text-[#8A949E]",
          )}
        >
          {selected || placeholder}
        </span>
        <Image
          src={chevronDownIcon}
          alt=""
          width={16}
          height={16}
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div className="absolute top-[calc(100%+5px)] left-0 z-20 w-full overflow-hidden rounded-md border border-[#CDD1D5] bg-white p-2">
          {options.map((option) => {
            const isSelected = option === selected;

            return (
              <button
                key={option}
                type="button"
                className={cn(
                  "flex h-10 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left text-[15px] text-[#1A2236] hover:bg-[#EEF2F7] active:bg-[#D6E0EB]",
                  isSelected && "bg-[#EEF2F7] text-[#052B57]",
                )}
                onClick={() => {
                  onChange?.(option);
                  setIsOpen(false);
                }}
              >
                <span className="flex w-3 shrink-0 items-center">
                  {isSelected ? (
                    <Image
                      src={checkIcon}
                      alt=""
                      width={12}
                      height={12}
                      className="h-3 w-3"
                    />
                  ) : null}
                </span>
                <span className="min-w-0 truncate whitespace-nowrap">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
