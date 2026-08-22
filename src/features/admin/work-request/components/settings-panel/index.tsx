"use client";

import { useState } from "react";
import Image from "next/image";

import icRightButton from "@/assets/icons/common/ic_right_button.svg";
import { cn } from "@/lib/utils";

import type {
  WorkRequestFieldChangeHandler,
  WorkRequestFormValues,
} from "../../types";
import UnavailableSettingsCard from "../unavailable-settings-card";
import WorkHourSettingsCard from "../work-hour-settings-card";
import WorkRequestPeriodCard from "../work-request-period-card";
import WorkRuleSettingsCard from "../work-rule-settings-card";

type CalendarField = "applyEndDate" | "applyStartDate" | "unavailableDate";

const MONTH_ARROW_CLASS_NAME =
  "flex cursor-pointer items-center justify-center rounded-full";
const MONTH_ARROW_DISABLED_CLASS_NAME = "cursor-not-allowed opacity-35";

export default function SettingsPanel({
  formValues,
  isActive,
  isDirty,
  isEditable,
  isEditing,
  isNextMonthDisabled,
  isPrevMonthDisabled,
  isSaving,
  isStartReady,
  monthLabel,
  onAddUnavailableDate,
  onAddUnavailableTimeRange,
  onCancelEdit,
  onEdit,
  onFieldChange,
  onNextMonth,
  onPrevMonth,
  onStart,
  onUpdate,
  targetMonth,
}: {
  formValues: WorkRequestFormValues;
  isActive: boolean;
  isDirty: boolean;
  isEditable: boolean;
  isEditing: boolean;
  isNextMonthDisabled: boolean;
  isPrevMonthDisabled: boolean;
  isSaving: boolean;
  isStartReady: boolean;
  monthLabel: string;
  onAddUnavailableDate: () => void;
  onAddUnavailableTimeRange: () => void;
  onCancelEdit: () => void;
  onEdit: () => void;
  onFieldChange: WorkRequestFieldChangeHandler;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onStart: () => void;
  onUpdate: () => void;
  targetMonth: { month: number; year: number };
}) {
  const [openCalendar, setOpenCalendar] = useState<CalendarField | null>(null);
  const handleCalendarOpenChange = (field: CalendarField, isOpen: boolean) => {
    setOpenCalendar(isOpen ? field : null);
  };

  return (
    <section className="relative z-10 rounded-xl border border-[#DDE3EF] bg-white px-8 pt-8 pb-5.75">
      <div className="mb-4.75 flex items-center justify-between">
        <h2 className="text-[19px] font-bold text-[#1A2236]">근로신청 설정</h2>
        {/* 설정할 달을 앞뒤로 옮긴다. 화살표는 근로시간 관리 헤더와 같은 것을 쓴다. */}
        <div className="mr-6 flex flex-row items-center gap-4">
          <button
            className={cn(
              MONTH_ARROW_CLASS_NAME,
              isPrevMonthDisabled && MONTH_ARROW_DISABLED_CLASS_NAME,
            )}
            type="button"
            disabled={isPrevMonthDisabled}
            onClick={onPrevMonth}
          >
            <Image
              className="h-9 w-9 rotate-180"
              src={icRightButton}
              alt="이전달"
            />
          </button>
          <p className="text-[24px] font-bold text-[#1A2236]">{monthLabel}</p>
          <button
            className={cn(
              MONTH_ARROW_CLASS_NAME,
              isNextMonthDisabled && MONTH_ARROW_DISABLED_CLASS_NAME,
            )}
            type="button"
            disabled={isNextMonthDisabled}
            onClick={onNextMonth}
          >
            <Image className="h-9 w-9" src={icRightButton} alt="다음달" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,520fr)_minmax(0,860fr)] gap-[clamp(12px,2vw,28px)]">
        <WorkRequestPeriodCard
          formValues={formValues}
          isEditable={isEditable}
          onCalendarOpenChange={handleCalendarOpenChange}
          onFieldChange={onFieldChange}
          openCalendar={openCalendar}
          targetMonth={targetMonth}
        />
        <UnavailableSettingsCard
          formValues={formValues}
          isEditable={isEditable}
          onAddUnavailableDate={onAddUnavailableDate}
          onAddUnavailableTimeRange={onAddUnavailableTimeRange}
          onCalendarOpenChange={handleCalendarOpenChange}
          onFieldChange={onFieldChange}
          openCalendar={openCalendar}
          targetMonth={targetMonth}
        />
        <WorkRuleSettingsCard
          formValues={formValues}
          isEditable={isEditable}
          onFieldChange={onFieldChange}
        />
        <WorkHourSettingsCard
          formValues={formValues}
          isActive={isActive}
          isDirty={isDirty}
          isEditable={isEditable}
          isEditing={isEditing}
          isSaving={isSaving}
          isStartReady={isStartReady}
          onCancelEdit={onCancelEdit}
          onEdit={onEdit}
          onFieldChange={onFieldChange}
          onStart={onStart}
          onUpdate={onUpdate}
        />
      </div>
    </section>
  );
}
