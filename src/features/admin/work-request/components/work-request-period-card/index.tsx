import type {
  WorkRequestFieldChangeHandler,
  WorkRequestFormValues,
} from "../../types";
import DatePickerInput from "../date-picker-input";
import FormField from "../form-field";
import SettingsCard from "../settings-card";

type CalendarField = "applyEndDate" | "applyStartDate" | "unavailableDate";

export default function WorkRequestPeriodCard({
  formValues,
  isEditable,
  onCalendarOpenChange,
  onFieldChange,
  openCalendar,
  targetMonth,
}: {
  formValues: WorkRequestFormValues;
  isEditable: boolean;
  onCalendarOpenChange: (field: CalendarField, isOpen: boolean) => void;
  onFieldChange: WorkRequestFieldChangeHandler;
  openCalendar: CalendarField | null;
  targetMonth: { month: number; year: number };
}) {
  return (
    <SettingsCard className="w-full max-w-130 min-w-0">
      <div className="flex min-w-0 gap-6">
        <FormField label="근로신청 시작">
          <DatePickerInput
            disabled={!isEditable}
            isOpen={openCalendar === "applyStartDate"}
            onChange={(value) => onFieldChange("applyStartDate", value)}
            onOpenChange={(isOpen) =>
              onCalendarOpenChange("applyStartDate", isOpen)
            }
            placeholder="MM.DD"
            target={targetMonth}
            value={formValues.applyStartDate}
          />
        </FormField>
        <FormField label="근로신청 마감">
          <DatePickerInput
            disabled={!isEditable}
            isOpen={openCalendar === "applyEndDate"}
            onChange={(value) => onFieldChange("applyEndDate", value)}
            onOpenChange={(isOpen) =>
              onCalendarOpenChange("applyEndDate", isOpen)
            }
            placeholder="MM.DD"
            target={targetMonth}
            value={formValues.applyEndDate}
          />
        </FormField>
      </div>
    </SettingsCard>
  );
}
