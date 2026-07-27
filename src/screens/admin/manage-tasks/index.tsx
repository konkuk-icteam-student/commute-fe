"use client";

import { useState } from "react";

import {
  CalendarPanel,
  getManageTaskDailyData,
  HandoverMemoPanel,
  manageTaskDataByDate,
  TaskManagementPanel,
  WorkSchedulePanel,
} from "@/features/admin/manage-tasks";
import type {
  ManageTaskItem,
  ManageTaskMemo,
} from "@/features/admin/manage-tasks";
import { formatDateValue, parseDateValue } from "@/utils/calendar";

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const formatSelectedDateTitle = (dateValue: string) => {
  const date = parseDateValue(dateValue);

  return {
    dateText: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`,
    weekdayText: weekdayLabels[date.getDay()],
  };
};

const initialTasksByDate = Object.fromEntries(
  Object.entries(manageTaskDataByDate).map(([date, dailyData]) => [
    date,
    [...dailyData.tasks],
  ]),
) as Record<string, ManageTaskItem[]>;

const initialMemosByDate = Object.fromEntries(
  Object.entries(manageTaskDataByDate).map(([date, dailyData]) => [
    date,
    [...dailyData.memos],
  ]),
) as Record<string, ManageTaskMemo[]>;

export default function AdminManageTasksScreen() {
  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateValue(new Date()),
  );
  const [tasksByDate, setTasksByDate] = useState(initialTasksByDate);
  const [memosByDate, setMemosByDate] = useState(initialMemosByDate);
  const dailyData = getManageTaskDailyData(selectedDate);
  const tasks = tasksByDate[selectedDate] ?? dailyData.tasks;
  const memos = memosByDate[selectedDate] ?? dailyData.memos;
  const { dateText, weekdayText } = formatSelectedDateTitle(selectedDate);
  const updateSelectedTasks = (nextTasks: ManageTaskItem[]) => {
    setTasksByDate((currentTasksByDate) => ({
      ...currentTasksByDate,
      [selectedDate]: nextTasks,
    }));
  };
  const updateSelectedMemos = (nextMemos: ManageTaskMemo[]) => {
    setMemosByDate((currentMemosByDate) => ({
      ...currentMemosByDate,
      [selectedDate]: nextMemos,
    }));
  };

  return (
    <div className="min-w-340.75 flex-1 bg-[#F4F5F7] px-10 py-11.5">
      <div className="mx-auto w-320.75">
        <h2 className="mb-4 text-[26px] leading-9 font-bold text-[#17191A]">
          {dateText} <span className="text-[#2076FF]">({weekdayText})</span>
        </h2>

        <div className="grid grid-cols-[384px_502px_349px] items-start gap-6">
          <div className="space-y-6">
            <CalendarPanel
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <HandoverMemoPanel
              memos={memos}
              onMemosChange={updateSelectedMemos}
            />
          </div>

          <WorkSchedulePanel groups={dailyData.scheduleGroups} />

          <TaskManagementPanel
            tasks={tasks}
            onTasksChange={updateSelectedTasks}
          />
        </div>
      </div>
    </div>
  );
}
