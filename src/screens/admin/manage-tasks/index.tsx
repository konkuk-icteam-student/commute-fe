"use client";

import { useState } from "react";

import {
  CalendarPanel,
  getManageTaskDailyData,
  HandoverMemoPanel,
  manageTaskDefaultDate,
  TaskManagementPanel,
  WorkSchedulePanel,
} from "@/features/admin/manage-tasks";

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const parseDateValue = (dateValue: string) => {
  const [year, month, day] = dateValue.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const formatSelectedDateTitle = (dateValue: string) => {
  const date = parseDateValue(dateValue);

  return {
    dateText: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`,
    weekdayText: weekdayLabels[date.getDay()],
  };
};

export default function AdminManageTasksScreen() {
  const [selectedDate, setSelectedDate] = useState(manageTaskDefaultDate);
  const dailyData = getManageTaskDailyData(selectedDate);
  const { dateText, weekdayText } = formatSelectedDateTitle(selectedDate);

  return (
    <div className="min-w-[1363px] flex-1 bg-[#F4F5F7] px-10 py-11.5">
      <div className="mx-auto w-[1283px]">
        <h2 className="mb-4 text-[26px] leading-9 font-bold text-[#17191A]">
          {dateText} <span className="text-[#2076FF]">({weekdayText})</span>
        </h2>

        <div className="grid grid-cols-[384px_502px_349px] items-start gap-6">
          <div className="space-y-6">
            <CalendarPanel
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <HandoverMemoPanel key={selectedDate} memos={dailyData.memos} />
          </div>

          <WorkSchedulePanel groups={dailyData.scheduleGroups} />

          <TaskManagementPanel
            key={selectedDate}
            initialTasks={dailyData.tasks}
          />
        </div>
      </div>
    </div>
  );
}
