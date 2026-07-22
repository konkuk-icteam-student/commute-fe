"use client";

import { useState } from "react";

import type {
  WorkRequestFieldChangeHandler,
  WorkRequestFormValues,
} from "../../types";
import UnavailableSettingsCard from "../unavailable-settings-card";
import WorkHourSettingsCard from "../work-hour-settings-card";
import WorkRequestPeriodCard from "../work-request-period-card";
import WorkRuleSettingsCard from "../work-rule-settings-card";

type CalendarField = "applyEndDate" | "applyStartDate" | "unavailableDate";

export default function SettingsPanel({
  formValues,
  isActive,
  isDirty,
  isEditable,
  isEditing,
  isSaving,
  isStartReady,
  monthLabel,
  onAddUnavailableDate,
  onAddUnavailableTimeRange,
  onCancelEdit,
  onEdit,
  onEnd,
  onFieldChange,
  onStart,
  onUpdate,
  targetMonth,
}: {
  formValues: WorkRequestFormValues;
  isActive: boolean;
  isDirty: boolean;
  isEditable: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isStartReady: boolean;
  monthLabel: string;
  onAddUnavailableDate: () => void;
  onAddUnavailableTimeRange: () => void;
  onCancelEdit: () => void;
  onEdit: () => void;
  onEnd: () => void;
  onFieldChange: WorkRequestFieldChangeHandler;
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
        <p className="mr-6 text-[24px] font-bold text-[#1A2236]">
          {monthLabel}
        </p>
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
          onEnd={onEnd}
          onFieldChange={onFieldChange}
          onStart={onStart}
          onUpdate={onUpdate}
        />
      </div>
    </section>
  );
}
