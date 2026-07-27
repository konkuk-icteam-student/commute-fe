import { staffCapacityOptions, minimumUnitOptions } from "../../constants";
import type {
  WorkRequestFieldChangeHandler,
  WorkRequestFormValues,
} from "../../types";
import FormField from "../form-field";
import MockSelect from "../mock-select";
import SettingsCard from "../settings-card";

export default function WorkRuleSettingsCard({
  formValues,
  isEditable,
  onFieldChange,
}: {
  formValues: WorkRequestFormValues;
  isEditable: boolean;
  onFieldChange: WorkRequestFieldChangeHandler;
}) {
  return (
    <SettingsCard className="relative h-full w-full max-w-130 min-w-0">
      <div className="grid min-w-0 grid-cols-[minmax(0,218px)_minmax(0,218px)] gap-6">
        <FormField label="최대 근무 정원 (시간당)">
          <MockSelect
            disabled={!isEditable}
            onChange={(value) => onFieldChange("maxConcurrentWorkers", value)}
            options={staffCapacityOptions}
            value={formValues.maxConcurrentWorkers}
          />
        </FormField>
        <FormField label="최소 근무시간 단위">
          <MockSelect
            disabled={!isEditable}
            onChange={(value) => onFieldChange("minWorkUnitMinutes", value)}
            options={minimumUnitOptions}
            value={formValues.minWorkUnitMinutes}
          />
        </FormField>
      </div>
    </SettingsCard>
  );
}
