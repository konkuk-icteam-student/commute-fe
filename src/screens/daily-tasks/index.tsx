"use client";

import { useMemo, useState } from "react";

import {
  useCreateHandoverMemoMutation,
  useDeleteHandoverMemoMutation,
  useGetHandoverMemosQuery,
} from "@/apis/handover-memos";
import { useGetAdminWorkSchedulesQuery } from "@/apis/work-schedules";
import {
  useGetTodosQuery,
  useUpdateTodoCompletionMutation,
} from "@/apis/todos";
import { Toast } from "@/components/ui";
import {
  formatDailyTaskDate,
  HandoverMemoPanel,
  PeriodTabs,
  SectionCard,
  TaskChecklist,
  type DailyTaskPeriod,
  type HandoverMemo,
  toDailyTaskWorkTimeSlots,
  WorkTimeList,
} from "@/features/daily-tasks";
import { formatDateValue } from "@/utils/calendar";
import { toDailyTaskItem } from "@/utils/todos";

const formatMemoCreatedAt = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}.${day} ${hours}:${minutes}`;
};

const toHandoverMemo = (
  handoverMemo: import("@/apis/handover-memos").HandoverMemo,
): HandoverMemo => ({
  id: handoverMemo.memoId,
  author: handoverMemo.createdBy.name,
  createdAt: formatMemoCreatedAt(new Date(handoverMemo.createdAt)),
  content: handoverMemo.content,
  isMine: handoverMemo.isMine,
});

export default function DailyTasksScreen() {
  const today = useMemo(() => new Date(), []);
  const todayDate = formatDateValue(today);
  const [selectedPeriod, setSelectedPeriod] =
    useState<DailyTaskPeriod>("morning");
  const [memo, setMemo] = useState("");
  const [openSections, setOpenSections] = useState({
    tasks: true,
    workTime: false,
    memo: false,
  });
  const {
    adminWorkSchedulesData,
    isFetchingAdminWorkSchedules,
    isErrorAdminWorkSchedules,
  } = useGetAdminWorkSchedulesQuery({
    startDate: todayDate,
    endDate: todayDate,
  });
  const { todosData, isFetchingTodos, isErrorTodos, todosError } =
    useGetTodosQuery({
      date: todayDate,
    });
  const {
    handoverMemosData,
    isFetchingHandoverMemos,
    isErrorHandoverMemos,
    handoverMemosError,
  } = useGetHandoverMemosQuery({
    date: todayDate,
  });
  const { updateTodoCompletion, isPendingUpdateTodoCompletion } =
    useUpdateTodoCompletionMutation();
  const { createHandoverMemo, isPendingCreateHandoverMemo } =
    useCreateHandoverMemoMutation();
  const { deleteHandoverMemo, isPendingDeleteHandoverMemo } =
    useDeleteHandoverMemoMutation();
  const tasksByPeriod = useMemo(
    () => ({
      morning: (todosData?.morningTodos ?? []).map(toDailyTaskItem),
      afternoon: (todosData?.afternoonTodos ?? []).map(toDailyTaskItem),
    }),
    [todosData],
  );
  const tasks = tasksByPeriod[selectedPeriod];
  const handoverMemos = useMemo(
    () => (handoverMemosData?.memos ?? []).map(toHandoverMemo),
    [handoverMemosData],
  );
  const workTimeSlots = toDailyTaskWorkTimeSlots(
    adminWorkSchedulesData,
    selectedPeriod,
  );
  const completedTaskCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );
  const [toastMessage, setToastMessage] = useState("");

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [section]: !currentSections[section],
    }));
  };

  const toggleTask = (taskId: number) => {
    const currentTask = tasks.find((task) => task.id === taskId);

    if (!currentTask || isPendingUpdateTodoCompletion) {
      return;
    }

    updateTodoCompletion(
      {
        date: todayDate,
        todoId: taskId,
        isCompleted: !currentTask.completed,
      },
      {
        onError: (error) => {
          setToastMessage(error.message);
        },
      },
    );
  };

  const changeMemo = (nextMemo: string) => {
    setMemo(nextMemo);
  };

  const deleteMemo = (memoId: number) => {
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
  };

  const saveMemo = (nextMemo: string) => {
    const trimmedMemo = nextMemo.trim();

    if (trimmedMemo.length === 0) {
      return;
    }

    createHandoverMemo(
      { content: trimmedMemo },
      {
        onSuccess: () => {
          setMemo("");
          setToastMessage("인수인계 메모를 작성했습니다.");
        },
        onError: (error) => {
          setToastMessage(error.message);
        },
      },
    );
  };

  return (
    <main className="min-h-screen w-full bg-white pt-8.75 pr-5.25 pb-28 pl-5.75 text-[#111827]">
      <header className="ml-px">
        <h1 className="text-[20px] leading-[19.5px] font-bold text-[#1A2236]">
          오늘의 업무
        </h1>
        <p className="mt-1 text-[11px] leading-4.5 font-bold tracking-[0.24px] text-[#1D4ED8]">
          {formatDailyTaskDate(today)}
        </p>
      </header>

      <div className="mt-2 mr-0.75 mb-3.5 flex justify-end">
        <PeriodTabs
          selectedPeriod={selectedPeriod}
          onChange={setSelectedPeriod}
        />
      </div>

      <div className="flex flex-col gap-4">
        <SectionCard
          countLabel={`${completedTaskCount}/${tasks.length}`}
          isOpen={openSections.tasks}
          title="업무 사항"
          onToggle={() => toggleSection("tasks")}
        >
          {isFetchingTodos ? (
            <p className="px-4 pt-2 pb-4 text-[12px] font-bold text-[#8892A6]">
              업무 사항을 불러오는 중입니다.
            </p>
          ) : isErrorTodos ? (
            <p className="px-4 pt-2 pb-4 text-[12px] font-bold text-[#8892A6]">
              {todosError?.message ?? "업무 사항을 불러오지 못했습니다."}
            </p>
          ) : tasks.length > 0 ? (
            <TaskChecklist
              isTogglingTask={isPendingUpdateTodoCompletion}
              tasks={tasks}
              onToggleTask={toggleTask}
            />
          ) : (
            <p className="px-4 pt-2 pb-4 text-[12px] font-bold text-[#8892A6]">
              등록된 업무 사항이 없습니다.
            </p>
          )}
        </SectionCard>

        <SectionCard
          headerDivider="none"
          isOpen={openSections.workTime}
          title="근로 시간"
          onToggle={() => toggleSection("workTime")}
        >
          {isFetchingAdminWorkSchedules ? (
            <p className="px-4 pb-4 text-[12px] font-bold text-[#8892A6]">
              근로 시간을 불러오는 중입니다.
            </p>
          ) : isErrorAdminWorkSchedules ? (
            <p className="px-4 pb-4 text-[12px] font-bold text-[#8892A6]">
              근로 시간을 불러오지 못했습니다.
            </p>
          ) : workTimeSlots.length > 0 ? (
            <WorkTimeList workTimeSlots={workTimeSlots} />
          ) : (
            <p className="px-4 pb-4 text-[12px] font-bold text-[#8892A6]">
              등록된 근로 시간이 없습니다.
            </p>
          )}
        </SectionCard>

        <SectionCard
          countLabel={`${handoverMemos.length}건`}
          headerDivider="full"
          isOpen={openSections.memo}
          title="인수인계 메모"
          onToggle={() => toggleSection("memo")}
        >
          {isFetchingHandoverMemos ? (
            <p className="px-4 pb-4 text-[12px] font-bold text-[#8892A6]">
              인수인계 메모를 불러오는 중입니다.
            </p>
          ) : isErrorHandoverMemos ? (
            <p className="px-4 pb-4 text-[12px] font-bold text-[#8892A6]">
              {handoverMemosError?.message ??
                "인수인계 메모를 불러오지 못했습니다."}
            </p>
          ) : (
            <HandoverMemoPanel
              handoverMemos={handoverMemos}
              isSaving={isPendingCreateHandoverMemo}
              memo={memo}
              onChangeMemo={changeMemo}
              onDeleteMemo={deleteMemo}
              onSaveMemo={saveMemo}
            />
          )}
        </SectionCard>
      </div>

      <Toast
        open={toastMessage.length > 0}
        message={toastMessage}
        onDismiss={() => setToastMessage("")}
      />
    </main>
  );
}
