"use client";

import { useCallback, useMemo, useState } from "react";

import { useGetAdminSystemCreatedYearQuery } from "@/apis/admin/system";
import { useGetAdminWorkSchedulesQuery } from "@/apis/admin/work-schedules";
import { useGetTodosQuery } from "@/apis/todos";
import {
  CalendarPanel,
  HandoverMemoPanel,
  manageTaskDataByDate,
  TaskManagementPanel,
  toManageTaskScheduleGroups,
  WorkSchedulePanel,
} from "@/features/admin/manage-tasks";
import type { ManageTaskMemo } from "@/features/admin/manage-tasks";
import { formatDateValue, parseDateValue } from "@/utils/calendar";
import { toManageTaskItem } from "@/utils/todos";

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const formatSelectedDateTitle = (dateValue: string) => {
  const date = parseDateValue(dateValue);

  return {
    dateText: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`,
    weekdayText: weekdayLabels[date.getDay()],
  };
};

const initialMemosByDate = Object.fromEntries(
  Object.entries(manageTaskDataByDate).map(([date, dailyData]) => [
    date,
    [...dailyData.memos],
  ]),
) as Record<string, ManageTaskMemo[]>;

export default function AdminManageTasksScreen() {
  const { adminSystemCreatedYearData } = useGetAdminSystemCreatedYearQuery();
  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateValue(new Date()),
  );
  const [memosByDate, setMemosByDate] = useState(initialMemosByDate);
  const {
    adminWorkSchedulesData,
    isFetchingAdminWorkSchedules,
    isErrorAdminWorkSchedules,
  } = useGetAdminWorkSchedulesQuery({
    startDate: selectedDate,
    endDate: selectedDate,
  });
  const { todosData, isFetchingTodos, isErrorTodos, todosError } =
    useGetTodosQuery({
      date: selectedDate,
    });
  const tasks = useMemo(
    () => [
      ...(todosData?.morningTodos ?? []).map(toManageTaskItem),
      ...(todosData?.afternoonTodos ?? []).map(toManageTaskItem),
    ],
    [todosData],
  );
  const dailyData = manageTaskDataByDate[selectedDate] ?? { memos: [] };
  const memos = memosByDate[selectedDate] ?? dailyData.memos;
  const scheduleGroups = useMemo(
    () => toManageTaskScheduleGroups(adminWorkSchedulesData),
    [adminWorkSchedulesData],
  );
  const { dateText, weekdayText } = formatSelectedDateTitle(selectedDate);
  const updateSelectedMemos = useCallback(
    (nextMemos: ManageTaskMemo[]) => {
      setMemosByDate((currentMemosByDate) => ({
        ...currentMemosByDate,
        [selectedDate]: nextMemos,
      }));
    },
    [selectedDate],
  );

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
              systemCreatedYear={adminSystemCreatedYearData?.createdYear}
              onSelectDate={setSelectedDate}
            />
            <HandoverMemoPanel
              memos={memos}
              onMemosChange={updateSelectedMemos}
            />
          </div>

          <WorkSchedulePanel
            groups={scheduleGroups}
            isError={isErrorAdminWorkSchedules}
            isLoading={isFetchingAdminWorkSchedules}
          />

          <TaskManagementPanel
            tasks={tasks}
            selectedDate={selectedDate}
            isError={isErrorTodos}
            isLoading={isFetchingTodos}
            errorMessage={todosError?.message}
          />
        </div>
      </div>
    </div>
  );
}
