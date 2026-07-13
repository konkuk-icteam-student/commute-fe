import { Fragment } from "react";

import { DUMMY_WORKTIME_DETAIL_SCHEDULE } from "../../constants";
import WorktimeDetailTableCell from "../worktime-detail-table-cell";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function WorktimeDetailTable() {
  const { maxConcurrentWorkers, slots } =
    DUMMY_WORKTIME_DETAIL_SCHEDULE.details;
  const slotsByTime =
    slots[0]?.map((_, slotIndex) =>
      slots.map((dailySlots) => dailySlots[slotIndex]),
    ) ?? [];

  return (
    <div className="grid grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-2.5">
      <span aria-hidden="true" />
      {slots.map((dailySlots) => {
        const date = dailySlots[0].date;

        const [, month, day] = date.split("-");
        const weekday =
          WEEKDAY_LABELS[new Date(`${date}T00:00:00Z`).getUTCDay()];

        return (
          <div className="flex flex-col items-center gap-1" key={date}>
            <span className="text-xl font-bold">{weekday}</span>
            <span className="font-bold text-[#2D81FF]">
              {Number(month)}.{Number(day)}
            </span>
          </div>
        );
      })}

      {slotsByTime.map((timeSlots) => (
        <Fragment key={timeSlots[0]?.start}>
          <span className="mt-3 text-xs font-bold text-[#8E8E93]">
            {timeSlots[0]?.start}
          </span>
          {timeSlots.map((slot) => (
            <WorktimeDetailTableCell
              key={`${slot.date}-${slot.start}`}
              slot={slot}
              maxConcurrentWorkers={maxConcurrentWorkers}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
