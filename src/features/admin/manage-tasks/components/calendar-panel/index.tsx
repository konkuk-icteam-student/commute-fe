"use client";

import Image from "next/image";
import { useState } from "react";

import calendarDropdownIcon from "@/assets/icons/admin-manage-tasks/ic_calendar_dropdown.svg";
import chevronRightCircleIcon from "@/assets/icons/admin-manage-tasks/ic_chevron_right_circle.svg";
import {
  getPanelCalendarDays,
  type AdminCalendarDay,
} from "@/features/admin/common";
import { cn } from "@/lib/utils";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const formatCalendarDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getMonthDate = (dateValue: string) => {
  const [year, month] = dateValue.split("-").map(Number);

  return new Date(year, month - 1, 1);
};

export default function CalendarPanel({
  onSelectDate,
  selectedDate,
}: {
  onSelectDate: (date: string) => void;
  selectedDate: string;
}) {
  const [viewDate, setViewDate] = useState(() => {
    return getMonthDate(selectedDate);
  });
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;
  const monthTitle = `${year}년 ${month}월`;
  const days = getPanelCalendarDays(year, month);
  const todayDate = formatCalendarDate(new Date());

  const moveMonth = (offset: number) => {
    setViewDate((current) => {
      return new Date(current.getFullYear(), current.getMonth() + offset, 1);
    });
  };

  const selectDate = (dateValue: string) => {
    onSelectDate(dateValue);
    setViewDate(getMonthDate(dateValue));
  };

  const moveToday = () => {
    const today = new Date();
    const todayDateValue = formatCalendarDate(today);

    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(todayDateValue);
  };

  return (
    <section className="flex w-96 flex-col overflow-hidden rounded-xl border border-[#DDE3EF] bg-white">
      <div className="mt-2 flex h-14 items-center justify-between px-6">
        <MonthMoveButton
          ariaLabel="이전 달"
          direction="previous"
          onClick={() => moveMonth(-1)}
        />
        <div className="flex items-center gap-8 text-[19px] font-bold text-[#1E2124]">
          <button type="button" className="flex items-center gap-1.5">
            {year}년
            <Image src={calendarDropdownIcon} alt="" width={16} height={16} />
          </button>
          <button type="button" className="flex items-center gap-1.5">
            {month}월
            <Image src={calendarDropdownIcon} alt="" width={16} height={16} />
          </button>
        </div>
        <MonthMoveButton
          ariaLabel="다음 달"
          direction="next"
          onClick={() => moveMonth(1)}
        />
      </div>

      <div className="px-4">
        <div className="mt-4 mb-2 grid grid-cols-7 gap-1.75 text-center text-[15px] leading-6 text-[#1E2124]">
          {dayLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <h3 className="mt-2 mb-0.5 ml-2.75 text-[15px] font-bold text-[#464C53]">
          {monthTitle}
        </h3>

        <div className="grid grid-cols-7 gap-x-1.75 gap-y-0.5 text-center">
          {days.map((day) => (
            <CalendarDayButton
              day={day}
              isSelected={day.dateValue === selectedDate}
              isToday={day.dateValue === todayDate}
              key={day.dateValue}
              onSelectDate={selectDate}
            />
          ))}
        </div>
      </div>

      <div className="mt-5.25 flex items-center justify-end border-t border-[#DDE3EF] px-6 pt-3.75 pb-5">
        <button
          type="button"
          className="h-6.75 rounded-2xl border-[0.5px] border-[#DDE3EF] bg-[#EDF5FF] px-4 text-[15px] font-medium text-[#2563EB]"
          onClick={moveToday}
        >
          오늘로 이동
        </button>
      </div>
    </section>
  );
}

function CalendarDayButton({
  day,
  isSelected,
  isToday,
  onSelectDate,
}: {
  day: AdminCalendarDay;
  isSelected: boolean;
  isToday: boolean;
  onSelectDate: (date: string) => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "relative mx-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[17px]",
        isSelected
          ? "bg-[#2076FF] text-white"
          : day.isCurrentMonth
            ? "text-[#454C53]"
            : "text-[#8A949E]",
      )}
      onClick={() => onSelectDate(day.dateValue)}
    >
      {day.day}
      {isToday ? (
        <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#D63D4A]" />
      ) : null}
    </button>
  );
}

function MonthMoveButton({
  ariaLabel,
  direction,
  onClick,
}: {
  ariaLabel: string;
  direction: "next" | "previous";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex h-8 w-8 cursor-pointer items-center justify-center"
      onClick={onClick}
    >
      <Image
        src={chevronRightCircleIcon}
        alt=""
        width={32}
        height={32}
        className={cn(direction === "previous" && "rotate-180")}
      />
    </button>
  );
}
