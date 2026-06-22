import WorkingHoursCard from "../working-hours-card";
import ScheduleChangeList from "../schedule-change-item";
import { getMergedApplyPayload } from "../../utils";
import { ScheduleApplyPayload } from "../../types";

interface ScheduleApplySummaryProps {
  month: number;
  week: number;
  maxMonthHours: number;
  maxWeekHours: number;
  applyPayload: ScheduleApplyPayload;
  addRequestHours: number;
  deleteRequestHours: number;
  weekTotalTimeAfterApply: number;
  monthTotalTimeAfterApply: number;
}

export default function ScheduleApplySummary({
  month,
  week,
  maxMonthHours,
  maxWeekHours,
  applyPayload,
  addRequestHours,
  deleteRequestHours,
  weekTotalTimeAfterApply,
  monthTotalTimeAfterApply,
}: ScheduleApplySummaryProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <WorkingHoursCard label="근무 신청" hours={addRequestHours} />
        <ScheduleChangeList
          changeItems={getMergedApplyPayload(applyPayload).addSlots}
        />
      </div>
      <div className="flex flex-col gap-2">
        <WorkingHoursCard label="근무 삭제" hours={deleteRequestHours} isRed />
        <ScheduleChangeList
          isAdd={false}
          changeItems={getMergedApplyPayload(applyPayload).deleteSlots}
        />
      </div>
      <WorkingHoursCard
        label={`${week}주차 총 시간`}
        hours={weekTotalTimeAfterApply}
        maxHours={maxWeekHours}
        isOverflow={weekTotalTimeAfterApply > maxWeekHours}
      />
      <WorkingHoursCard
        label={`${month}월 전체`}
        hours={monthTotalTimeAfterApply}
        maxHours={maxMonthHours}
        withProgressBar
        isOverflow={monthTotalTimeAfterApply > maxMonthHours}
      />
    </div>
  );
}
