import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";

import icDown from "@/assets/icons/common/ic_down.svg";
import icCheck from "@/assets/icons/admin-member/ic_check.svg";

export type Grade = 1 | 2 | 3 | 4;

export interface GradeOption {
  value: Grade | null;
  label: string;
}

export const GRADE_OPTIONS: readonly GradeOption[] = [
  { value: null, label: "선택 안 함" },
  { value: 1, label: "1학년" },
  { value: 2, label: "2학년" },
  { value: 3, label: "3학년" },
  { value: 4, label: "4학년" },
];

export function normalizeGrade(value: number | null | undefined): Grade | null {
  return value === 1 || value === 2 || value === 3 || value === 4
    ? value
    : null;
}

interface GradeDropdownProps {
  value: Grade | null;
  onChange: (value: Grade | null) => void;
}

export default function GradeDropdown({ value, onChange }: GradeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedIndex = Math.max(
    GRADE_OPTIONS.findIndex((option) => option.value === value),
    0,
  );
  const selectedOption = GRADE_OPTIONS[selectedIndex];

  const openDropdown = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const closeDropdown = (restoreFocus = false) => {
    setIsOpen(false);

    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  };

  const selectOption = (index: number) => {
    onChange(GRADE_OPTIONS[index].value);
    closeDropdown(true);
  };

  const moveActiveOption = (offset: number) => {
    setActiveIndex(
      (currentIndex) =>
        (currentIndex + offset + GRADE_OPTIONS.length) % GRADE_OPTIONS.length,
    );
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    openDropdown();
  };

  const handleListboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActiveOption(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActiveOption(-1);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(GRADE_OPTIONS.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectOption(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeDropdown(true);
        break;
      case "Tab":
        closeDropdown();
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    listboxRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        className="flex h-12 w-full cursor-pointer items-center justify-between rounded-md border border-[#C6CBD4] bg-[#F8F9FB] px-3 text-left text-[#464A4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3568C0]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selectedOption.label}</span>
        <Image
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          src={icDown}
          alt=""
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-option-${activeIndex}`}
          className="absolute top-[calc(100%+0.75rem)] left-0 z-10 flex w-full flex-col gap-1 rounded-lg border border-[#C6CBD4] bg-white p-2 shadow-sm focus:outline-none"
          onKeyDown={handleListboxKeyDown}
        >
          {GRADE_OPTIONS.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <button
                key={option.label}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                className={`flex h-10 cursor-pointer items-center gap-2 rounded-md px-2.5 text-left text-[#1A2236] active:bg-[#D4DFED] ${
                  isSelected
                    ? "bg-[#E7EDF5] font-medium text-[#052B57]"
                    : isActive
                      ? "bg-[#F0F3F7]"
                      : "hover:bg-[#EEF2F7]"
                }`}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(index)}
              >
                {isSelected && (
                  <Image src={icCheck} alt="선택됨" aria-hidden="true" />
                )}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
