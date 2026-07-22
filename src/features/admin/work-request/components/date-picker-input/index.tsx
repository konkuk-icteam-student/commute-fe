"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import calendarIcon from "@/assets/icons/admin-worktime-request/ic_calendar.svg";
import chevronLeftIcon from "@/assets/icons/admin-worktime-request/ic_chevron_left.svg";
import { cn } from "@/lib/utils";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const pad2 = (value: number) => String(value).padStart(2, "0");

function formatDateValue(year: number, month: number, day: number) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function formatDisplayValue(value: string) {
  const match = value.match(/^\d{4}-(\d{2})-(\d{2})$/);

  if (!match) {
    return value;
  }

  return `${match[1]}.${match[2]}`;
}

function getInitialViewDate({
  target,
  value,
}: {
  target: { month: number; year: number };
  value: string;
}) {
  const match = value.match(/^(\d{4})-(\d{2})-\d{2}$/);

  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, 1);
  }

  return new Date(target.year, target.month - 1, 1);
}

export default function DatePickerInput({
  disabled = false,
  isOpen,
  onOpenChange,
  onChange,
  placeholder = "MM.DD",
  target,
  value,
  widthClassName = "w-full max-w-43",
}: {
  disabled?: boolean;
  isOpen: boolean;
  onChange?: (value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
  placeholder?: string;
  target: { month: number; year: number };
  value: string;
  widthClassName?: string;
}) {
  const [viewDate, setViewDate] = useState(() =>
    getInitialViewDate({ target, value }),
  );

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth() + 1;
  const selectedDate = value.match(/^\d{4}-\d{2}-\d{2}$/) ? value : "";
  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();
    const lastDate = new Date(viewYear, viewMonth, 0).getDate();

    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: lastDate }, (_, index) => index + 1),
    ];
  }, [viewMonth, viewYear]);

  const moveMonth = (offset: number) => {
    setViewDate((current) => {
      return new Date(current.getFullYear(), current.getMonth() + offset, 1);
    });
  };

  return (
    <div className={cn("relative min-w-0", widthClassName)}>
      <button
        type="button"
        className={cn(
          "flex min-h-10 w-full items-center gap-2 rounded-md border border-[#58616A]/33 bg-white px-4 py-1.5 text-left",
          disabled ? "cursor-default" : "cursor-pointer",
        )}
        disabled={disabled}
        onClick={() => {
          if (!isOpen) {
            setViewDate(getInitialViewDate({ target, value }));
          }

          onOpenChange(!isOpen);
        }}
      >
        <span
          className={cn(
            "mt-0.5 min-w-0 flex-1 truncate text-[15px]",
            value ? "text-[#1A2236]" : "text-[#8A949E]",
          )}
        >
          {value ? formatDisplayValue(value) : placeholder}
        </span>
        <Image
          src={calendarIcon}
          alt=""
          width={16}
          height={16}
          className="h-4 w-4 shrink-0"
        />
      </button>

      {isOpen ? (
        <div className="absolute top-14 left-0 z-30 w-75.5 max-w-75.5 rounded-2xl border border-[#E5E8EF] bg-white px-6 py-4.25 shadow-[0_18px_40px_rgba(26,34,54,0.12)]">
          <div className="mb-5 flex items-center justify-between px-1.75">
            <MonthMoveButton
              ariaLabel="이전 달"
              onClick={() => moveMonth(-1)}
            />
            <p className="text-[15px] font-extrabold text-[#1F2937]">
              {viewYear}년 {viewMonth}월
            </p>
            <MonthMoveButton
              ariaLabel="다음 달"
              direction="next"
              onClick={() => moveMonth(1)}
            />
          </div>

          <div className="grid grid-cols-7 text-center">
            {dayLabels.map((day, index) => (
              <div
                key={day}
                className={cn(
                  "text-xs font-bold text-[#9AA3B2]",
                  index === 0 && "text-[#E5484D]",
                  index === 6 && "text-[#2C6EF2]",
                )}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 py-1 text-center">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="h-7" />;
              }

              const dateValue = formatDateValue(viewYear, viewMonth, day);
              const isSelected = dateValue === selectedDate;

              return (
                <button
                  key={dateValue}
                  type="button"
                  className={cn(
                    "mx-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[13.5px] font-medium text-[#374151] hover:bg-[#EEF2F7] active:bg-[#D6E0EB]",
                    isSelected && "bg-[#EEF2F7] text-[#052B57]",
                  )}
                  onClick={() => {
                    onChange?.(dateValue);
                    onOpenChange(false);
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MonthMoveButton({
  ariaLabel,
  direction = "previous",
  onClick,
}: {
  ariaLabel: string;
  direction?: "next" | "previous";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center justify-center rounded-[9px] border border-[#DDE3EF] p-1.5"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <Image
        src={chevronLeftIcon}
        alt=""
        width={16}
        height={16}
        className={cn("h-4 w-4", direction === "next" && "rotate-180")}
      />
    </button>
  );
}
