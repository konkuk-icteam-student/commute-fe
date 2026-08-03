"use client";

import Image from "next/image";
import { useState } from "react";

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
import CalendarDayButton from "../calendar-day-button";
import { CalendarDropdown, CalendarDropdownButton } from "../calendar-dropdown";
import CalendarMonthMoveButton from "../calendar-month-move-button";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];
const systemConfiguredDate = new Date(2022, 0, 1);

export default function CalendarPanel({
  onSelectDate,
  selectedDate,
}: {
  onSelectDate: (date: string) => void;
  selectedDate: string;
}) {
  const currentMonthDate = new Date();
  const maxViewDate = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth(),
    1,
  );
  const [viewDate, setViewDate] = useState(() => {
    const selectedMonthStart = getDateMonthStart(selectedDate);
    const selectedMonthValue = getMonthValue(selectedMonthStart);

    if (selectedMonthValue < getMonthValue(systemConfiguredDate)) {
      return systemConfiguredDate;
    }

    if (selectedMonthValue > getMonthValue(maxViewDate)) {
      return maxViewDate;
    }

    return selectedMonthStart;
  });
  const [openDropdown, setOpenDropdown] = useState<"month" | "year" | null>(
    null,
  );
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;
  const monthTitle = `${year}년 ${month}월`;
  const days = getPanelCalendarDays(year, month);
  const todayDate = formatDateValue(new Date());
  const availableYears = getAvailableYears(systemConfiguredDate, maxViewDate);
  const availableMonths = getAvailableMonths(
    year,
    systemConfiguredDate,
    maxViewDate,
  );
  const canMovePrevious =
    getMonthValue(viewDate) > getMonthValue(systemConfiguredDate);
  const canMoveNext = getMonthValue(viewDate) < getMonthValue(maxViewDate);

  const moveMonth = (offset: number) => {
    setViewDate((current) => {
      const nextDate = new Date(
        current.getFullYear(),
        current.getMonth() + offset,
        1,
      );
      const nextMonthValue = getMonthValue(nextDate);

      if (nextMonthValue < getMonthValue(systemConfiguredDate)) {
        return systemConfiguredDate;
      }

      if (nextMonthValue > getMonthValue(maxViewDate)) {
        return maxViewDate;
      }

      return nextDate;
    });
  };

  const selectDate = (dateValue: string) => {
    onSelectDate(dateValue);
    const nextViewDate = getDateMonthStart(dateValue);
    const nextMonthValue = getMonthValue(nextViewDate);

    if (nextMonthValue < getMonthValue(systemConfiguredDate)) {
      setViewDate(systemConfiguredDate);
      return;
    }

    if (nextMonthValue > getMonthValue(maxViewDate)) {
      setViewDate(maxViewDate);
      return;
    }

    setViewDate(nextViewDate);
  };

  const selectYear = (nextYear: number) => {
    const availableMonthsInNextYear = getAvailableMonths(
      nextYear,
      systemConfiguredDate,
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
            className="flex cursor-pointer items-center gap-1.5"
            onClick={() =>
              setOpenDropdown((current) => (current === "year" ? null : "year"))
            }
          >
            {year}년
            <Image src={calendarDropdownIcon} alt="" width={16} height={16} />
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5"
            onClick={() =>
              setOpenDropdown((current) =>
                current === "month" ? null : "month",
              )
            }
          >
            {month}월
            <Image src={calendarDropdownIcon} alt="" width={16} height={16} />
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
          <CalendarDropdown className="top-12 left-50 w-18.5 p-2">
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
                !isDateValueInRange(
                  day.dateValue,
                  systemConfiguredDate,
                  maxViewDate,
                )
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
