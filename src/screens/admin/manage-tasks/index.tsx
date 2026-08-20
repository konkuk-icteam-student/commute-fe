"use client";

import { useCallback, useMemo, useState } from "react";

import { useGetAdminSystemCreatedYearQuery } from "@/apis/admin/system";
import {
  useCreateHandoverMemoMutation,
  useDeleteHandoverMemoMutation,
  useGetHandoverMemosQuery,
} from "@/apis/handover-memos";
import { useGetAdminWorkSchedulesQuery } from "@/apis/work-schedules";
import { useGetTodosQuery } from "@/apis/todos";
import { Toast } from "@/components/ui";
import {
  CalendarPanel,
  HandoverMemoPanel,
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

const formatMemoCreatedAt = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}.${day} ${hours}:${minutes}`;
};

const toManageTaskMemo = (
  handoverMemo: import("@/apis/handover-memos").HandoverMemo,
): ManageTaskMemo => ({
  id: handoverMemo.memoId,
  author: handoverMemo.createdBy.name,
  createdAt: formatMemoCreatedAt(new Date(handoverMemo.createdAt)),
  content: handoverMemo.content,
  isMine: handoverMemo.isMine,
});

export default function AdminManageTasksScreen() {
  const { adminSystemCreatedYearData } = useGetAdminSystemCreatedYearQuery();
  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateValue(new Date()),
  );
  const [toastMessage, setToastMessage] = useState("");
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
  const {
    handoverMemosData,
    isFetchingHandoverMemos,
    isErrorHandoverMemos,
    handoverMemosError,
  } = useGetHandoverMemosQuery({
    date: selectedDate,
  });
  const { createHandoverMemo, isPendingCreateHandoverMemo } =
    useCreateHandoverMemoMutation();
  const { deleteHandoverMemo, isPendingDeleteHandoverMemo } =
    useDeleteHandoverMemoMutation();
  const tasks = useMemo(
    () => [
      ...(todosData?.morningTodos ?? []).map(toManageTaskItem),
      ...(todosData?.afternoonTodos ?? []).map(toManageTaskItem),
    ],
    [todosData],
  );
  const serverMemos = useMemo(
    () => (handoverMemosData?.memos ?? []).map(toManageTaskMemo),
    [handoverMemosData],
  );
  const memos = serverMemos;
  const scheduleGroups = useMemo(
    () => toManageTaskScheduleGroups(adminWorkSchedulesData),
    [adminWorkSchedulesData],
  );
  const { dateText, weekdayText } = formatSelectedDateTitle(selectedDate);
  const saveMemo = useCallback(
    (content: string, callbacks?: { onSuccess?: () => void }) => {
      createHandoverMemo(
        { content },
        {
          onSuccess: () => {
            callbacks?.onSuccess?.();
            setToastMessage("인수인계 메모를 작성했습니다.");
          },
          onError: (error) => {
            setToastMessage(error.message);
          },
        },
      );
    },
    [createHandoverMemo],
  );

  const deleteMemo = useCallback(
    (memoId: number) => {
      if (isPendingDeleteHandoverMemo) {
        return;
      }

      deleteHandoverMemo(
        { memoId },
        {
          onSuccess: () => {
            setToastMessage("인수인계 메모를 삭제했습니다.");
          },
          onError: (error) => {
            setToastMessage(error.message);
          },
        },
      );
    },
    [deleteHandoverMemo, isPendingDeleteHandoverMemo],
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
              errorMessage={handoverMemosError?.message}
              isError={isErrorHandoverMemos}
              isLoading={isFetchingHandoverMemos}
              isSaving={isPendingCreateHandoverMemo}
              memos={memos}
              onDeleteMemo={deleteMemo}
              onSaveMemo={saveMemo}
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
      <Toast
        open={toastMessage.length > 0}
        message={toastMessage}
        onDismiss={() => setToastMessage("")}
      />
    </div>
  );
}
