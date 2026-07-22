import type {
  WorkRequestFieldChangeHandler,
  WorkRequestFormValues,
} from "../../types";
import AddButton from "../add-button";
import DatePickerInput from "../date-picker-input";
import TextInput from "../text-input";

type CalendarField = "applyEndDate" | "applyStartDate" | "unavailableDate";

export default function UnavailableSettingsCard({
  formValues,
  isEditable,
  onAddUnavailableDate,
  onAddUnavailableTimeRange,
  onCalendarOpenChange,
  onFieldChange,
  openCalendar,
  targetMonth,
}: {
  formValues: WorkRequestFormValues;
  isEditable: boolean;
  onAddUnavailableDate: () => void;
  onAddUnavailableTimeRange: () => void;
  onCalendarOpenChange: (field: CalendarField, isOpen: boolean) => void;
  onFieldChange: WorkRequestFieldChangeHandler;
  openCalendar: CalendarField | null;
  targetMonth: { month: number; year: number };
}) {
  return (
    <div className="w-full max-w-215 min-w-0 rounded-xl border border-[#DDE3EF] bg-white px-8 pt-8.5 pb-8">
      <div className="flex min-w-0 flex-wrap gap-x-8 gap-y-4">
        <UnavailableDateField
          formValues={formValues}
          isEditable={isEditable}
          onAddUnavailableDate={onAddUnavailableDate}
          onCalendarOpenChange={onCalendarOpenChange}
          onFieldChange={onFieldChange}
          openCalendar={openCalendar}
          targetMonth={targetMonth}
        />
        <UnavailableTimeRangeField
          formValues={formValues}
          isEditable={isEditable}
          onAddUnavailableTimeRange={onAddUnavailableTimeRange}
          onFieldChange={onFieldChange}
        />
      </div>
    </div>
  );
}

function UnavailableDateField({
  formValues,
  isEditable,
  onAddUnavailableDate,
  onCalendarOpenChange,
  onFieldChange,
  openCalendar,
  targetMonth,
}: {
  formValues: WorkRequestFormValues;
  isEditable: boolean;
  onAddUnavailableDate: () => void;
  onCalendarOpenChange: (field: CalendarField, isOpen: boolean) => void;
  onFieldChange: WorkRequestFieldChangeHandler;
  openCalendar: CalendarField | null;
  targetMonth: { month: number; year: number };
}) {
  return (
    <div className="max-w-90 min-w-0 flex-1">
      <p className="mb-2 text-[15px] font-semibold text-[#464C53]">
        신청 불가 일자
      </p>
      <div className="flex min-w-0 items-start gap-3">
        <DatePickerInput
          disabled={!isEditable}
          isOpen={openCalendar === "unavailableDate"}
          onChange={(value) => onFieldChange("unavailableDateInput", value)}
          onOpenChange={(isOpen) =>
            onCalendarOpenChange("unavailableDate", isOpen)
          }
          placeholder="MM.DD"
          target={targetMonth}
          value={formValues.unavailableDateInput}
        />
        <AddButton disabled={!isEditable} onClick={onAddUnavailableDate} />
      </div>
    </div>
  );
}

function UnavailableTimeRangeField({
  formValues,
  isEditable,
  onAddUnavailableTimeRange,
  onFieldChange,
}: {
  formValues: WorkRequestFormValues;
  isEditable: boolean;
  onAddUnavailableTimeRange: () => void;
  onFieldChange: WorkRequestFieldChangeHandler;
}) {
  return (
    <div className="max-w-90 min-w-0 flex-1">
      <p className="mb-2 text-[15px] font-semibold text-[#464C53]">
        신청 불가 시간대
      </p>
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-0.5">
          <TextInput
            disabled={!isEditable}
            icon="none"
            onChange={(value) =>
              onFieldChange("unavailableTimeRangeStartInput", value)
            }
            placeholder="00:00"
            value={formValues.unavailableTimeRangeStartInput}
            widthClassName="w-full max-w-30"
          />
          <span className="text-[19px] text-[#1A2236]">~</span>
          <TextInput
            disabled={!isEditable}
            icon="none"
            onChange={(value) =>
              onFieldChange("unavailableTimeRangeEndInput", value)
            }
            placeholder="00:00"
            value={formValues.unavailableTimeRangeEndInput}
            widthClassName="w-full max-w-30"
          />
        </div>
        <AddButton disabled={!isEditable} onClick={onAddUnavailableTimeRange} />
      </div>
    </div>
  );
}
