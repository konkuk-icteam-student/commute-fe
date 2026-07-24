import type {
  WorkRequestFieldChangeHandler,
  WorkRequestFormValues,
} from "../../types";
import SettingsActionButtons from "../settings-action-buttons";
import SettingsCard from "../settings-card";
import TimeRangeInput from "../time-range-input";

export default function WorkHourSettingsCard({
  formValues,
  isActive,
  isDirty,
  isEditable,
  isEditing,
  isSaving,
  isStartReady,
  onCancelEdit,
  onEdit,
  onEnd,
  onFieldChange,
  onStart,
  onUpdate,
}: {
  formValues: WorkRequestFormValues;
  isActive: boolean;
  isDirty: boolean;
  isEditable: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isStartReady: boolean;
  onCancelEdit: () => void;
  onEdit: () => void;
  onEnd: () => void;
  onFieldChange: WorkRequestFieldChangeHandler;
  onStart: () => void;
  onUpdate: () => void;
}) {
  return (
    <div className="flex w-full max-w-215 min-w-0 items-center gap-2.5">
      <SettingsCard className="h-full min-w-0 shrink grow basis-140">
        <div className="grid min-w-0 grid-cols-2 gap-6">
          <TimeRangeInput
            disabled={!isEditable}
            end={formValues.weeklyMaxMinutes}
            label="주별 최소~최대 근무 시간"
            onEndChange={(value) => onFieldChange("weeklyMaxMinutes", value)}
            onStartChange={(value) => onFieldChange("weeklyMinMinutes", value)}
            start={formValues.weeklyMinMinutes}
          />
          <TimeRangeInput
            disabled={!isEditable}
            end={formValues.monthlyMaxMinutes}
            label="월별 최소~최대 근무 시간"
            onEndChange={(value) => onFieldChange("monthlyMaxMinutes", value)}
            onStartChange={(value) => onFieldChange("monthlyMinMinutes", value)}
            start={formValues.monthlyMinMinutes}
          />
        </div>
      </SettingsCard>

      <div className="flex max-w-68.25 min-w-17.5 shrink-[10] grow basis-68.25 flex-wrap items-center justify-center gap-3 self-center">
        <SettingsActionButtons
          isActive={isActive}
          isDirty={isDirty}
          isEditing={isEditing}
          isSaving={isSaving}
          isStartReady={isStartReady}
          onCancelEdit={onCancelEdit}
          onEdit={onEdit}
          onEnd={onEnd}
          onStart={onStart}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}
