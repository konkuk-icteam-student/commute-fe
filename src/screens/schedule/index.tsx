"use client";

import { ScheduleHeader, ScheduleTable } from "@/features/schedule";
import { getMonthWeekOfDate } from "@/lib/date-formatter";

export default function ScheduleScreen() {
  const { year, month, week } = getMonthWeekOfDate(new Date());
  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4">
      <ScheduleHeader year={year} month={month} />
      <ScheduleTable year={year} month={month} week={week} />
    </div>
  );
}
