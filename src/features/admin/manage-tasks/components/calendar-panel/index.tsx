"use client";

import Image from "next/image";
import { memo, useState } from "react";

import calendarDropdownIcon from "@/assets/icons/admin-manage-tasks/ic_calendar_dropdown.svg";
import {
  formatDateValue,
  getAvailableMonths,
  getAvailableYears,
  getDateMonthStart,
  getMonthValue,
  getPanelCalendarDays,
  isDateValueInRange,
} from "@/utils/calendar";
import { cn } from "@/lib/utils";
import CalendarDayButton from "../calendar-day-button";
import { CalendarDropdown, CalendarDropdownButton } from "../calendar-dropdown";
import CalendarMonthMoveButton from "../calendar-month-move-button";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const clampMonthDate = ({
  date,
  maxDate,
  maxMonthValue,
  minDate,
  minMonthValue,
}: {
  date: Date;
  maxDate: Date;
  maxMonthValue: number;
  minDate: Date;
  minMonthValue: number;
}) => {
  const monthValue = getMonthValue(date);

  if (monthValue < minMonthValue) {
    return minDate;
  }

  if (monthValue > maxMonthValue) {
    return maxDate;
  }

  return date;
};

function CalendarPanel({
  onSelectDate,
  selectedDate,
  systemCreatedYear,
}: {
  onSelectDate: (date: string) => void;
  selectedDate: string;
  systemCreatedYear?: number;
}) {
  const currentMonthDate = new Date();
  const currentYear = currentMonthDate.getFullYear();
  const minViewYear = Math.min(systemCreatedYear ?? currentYear, currentYear);
  const maxViewDate = new Date(currentYear, currentMonthDate.getMonth() + 1, 1);
  const minViewDate = new Date(minViewYear, 0, 1);
  const minMonthValue = getMonthValue(minViewDate);
  const maxMonthValue = getMonthValue(maxViewDate);
  const [viewDate, setViewDate] = useState(() => {
    const selectedMonthStart = getDateMonthStart(selectedDate);

    return clampMonthDate({
      date: selectedMonthStart,
      maxDate: maxViewDate,
      maxMonthValue,
      minDate: minViewDate,
      minMonthValue,
    });
  });
  const [openDropdown, setOpenDropdown] = useState<"month" | "year" | null>(
    null,
  );
  const clampedViewDate = clampMonthDate({
    date: viewDate,
    maxDate: maxViewDate,
    maxMonthValue,
    minDate: minViewDate,
    minMonthValue,
  });
  const year = clampedViewDate.getFullYear();
  const month = clampedViewDate.getMonth() + 1;
  const monthTitle = `${year}년 ${month}월`;
  const days = getPanelCalendarDays(year, month);
  const todayDate = formatDateValue(new Date());
  const availableYears = getAvailableYears(minViewDate, maxViewDate);
  const availableMonths = getAvailableMonths(year, minViewDate, maxViewDate);
  const clampedMonthValue = getMonthValue(clampedViewDate);
  const canMovePrevious = clampedMonthValue > minMonthValue;
  const canMoveNext = clampedMonthValue < maxMonthValue;

  const moveMonth = (offset: number) => {
    setViewDate(() => {
      const nextDate = new Date(
        clampedViewDate.getFullYear(),
        clampedViewDate.getMonth() + offset,
        1,
      );

      return clampMonthDate({
        date: nextDate,
        maxDate: maxViewDate,
        maxMonthValue,
        minDate: minViewDate,
        minMonthValue,
      });
    });
  };

  const selectDate = (dateValue: string) => {
    onSelectDate(dateValue);
    const nextViewDate = getDateMonthStart(dateValue);

    setViewDate(
      clampMonthDate({
        date: nextViewDate,
        maxDate: maxViewDate,
        maxMonthValue,
        minDate: minViewDate,
        minMonthValue,
      }),
    );
  };

  const selectYear = (nextYear: number) => {
    const availableMonthsInNextYear = getAvailableMonths(
      nextYear,
      minViewDate,
      maxViewDate,
    );
    const nextMonth = availableMonthsInNextYear.includes(month)
      ? month
      : availableMonthsInNextYear[0];

    setViewDate(new Date(nextYear, nextMonth - 1, 1));
    setOpenDropdown(null);
  };

  const selectMonth = (nextMonth: number) => {
    setViewDate(new Date(year, nextMonth - 1, 1));
    setOpenDropdown(null);
  };

  const moveToday = () => {
    const today = new Date();
    const todayDateValue = formatDateValue(today);

    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(todayDateValue);
  };

  return (
    <section className="flex w-96 flex-col overflow-hidden rounded-xl border border-[#DDE3EF] bg-white">
      <div className="relative mt-2 flex h-14 items-center justify-between px-6">
        <CalendarMonthMoveButton
          ariaLabel="이전 달"
          disabled={!canMovePrevious}
          direction="previous"
          onClick={() => moveMonth(-1)}
        />
        <div className="flex items-center gap-5 text-[19px] font-bold text-[#1E2124]">
          <button
            type="button"
            aria-expanded={openDropdown === "year"}
            className="flex cursor-pointer items-center gap-1.5"
            onClick={() =>
              setOpenDropdown((current) => (current === "year" ? null : "year"))
            }
          >
            {year}년
            <Image
              src={calendarDropdownIcon}
              alt=""
              width={16}
              height={16}
              className={cn(
                "transition-transform",
                openDropdown === "year" && "rotate-180",
              )}
            />
          </button>
          <button
            type="button"
            aria-expanded={openDropdown === "month"}
            className="flex cursor-pointer items-center gap-1.5"
            onClick={() =>
              setOpenDropdown((current) =>
                current === "month" ? null : "month",
              )
            }
          >
            {month}월
            <Image
              src={calendarDropdownIcon}
              alt=""
              width={16}
              height={16}
              className={cn(
                "transition-transform",
                openDropdown === "month" && "rotate-180",
              )}
            />
          </button>
        </div>
        {openDropdown === "year" ? (
          <CalendarDropdown className="top-12 left-25 w-25.25 p-2">
            {availableYears.map((availableYear) => (
              <CalendarDropdownButton
                isSelected={availableYear === year}
                key={availableYear}
                label={`${availableYear}`}
                onClick={() => selectYear(availableYear)}
              />
            ))}
          </CalendarDropdown>
        ) : null}
        {openDropdown === "month" ? (
          <CalendarDropdown className="top-12 left-50 w-22 p-2">
            {availableMonths.map((availableMonth) => (
              <CalendarDropdownButton
                isSelected={availableMonth === month}
                key={availableMonth}
                label={`${availableMonth}월`}
                onClick={() => selectMonth(availableMonth)}
              />
            ))}
          </CalendarDropdown>
        ) : null}
        <CalendarMonthMoveButton
          ariaLabel="다음 달"
          disabled={!canMoveNext}
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
              isDisabled={
                !isDateValueInRange(day.dateValue, minViewDate, maxViewDate)
              }
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

export default memo(CalendarPanel);
