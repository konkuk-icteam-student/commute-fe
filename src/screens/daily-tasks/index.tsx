"use client";

import { useMemo, useState } from "react";

import {
  useGetTodosQuery,
  useUpdateTodoCompletionMutation,
} from "@/apis/todos";
import { useGetPeriodSchedulesQuery } from "@/apis/work-schedules";
import { Toast } from "@/components/ui";
import {
  formatDailyTaskDate,
  HandoverMemoPanel,
  mockDailyTasksByPeriod,
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

export default function DailyTasksScreen() {
  const today = useMemo(() => new Date(), []);
  const todayDate = formatDateValue(today);
  const [selectedPeriod, setSelectedPeriod] =
    useState<DailyTaskPeriod>("morning");
  const [handoverMemosByPeriod, setHandoverMemosByPeriod] = useState(() => ({
    morning: mockDailyTasksByPeriod.morning.handoverMemos,
    afternoon: mockDailyTasksByPeriod.afternoon.handoverMemos,
  }));
  const [memoByPeriod, setMemoByPeriod] = useState({
    morning: "",
    afternoon: "",
  });
  const [openSections, setOpenSections] = useState({
    tasks: true,
    workTime: false,
    memo: false,
  });
  const {
    periodSchedulesData,
    isFetchingPeriodSchedules,
    isErrorPeriodSchedules,
  } = useGetPeriodSchedulesQuery({
    startDate: todayDate,
    endDate: todayDate,
  });
  const { todosData, isFetchingTodos, isErrorTodos, todosError } =
    useGetTodosQuery({
      date: todayDate,
    });
  const {
    updateTodoCompletion,
    isPendingUpdateTodoCompletion,
    pendingTodoCompletionId,
  } = useUpdateTodoCompletionMutation();
  const tasksByPeriod = useMemo(
    () => ({
      morning: (todosData?.morningTodos ?? []).map(toDailyTaskItem),
      afternoon: (todosData?.afternoonTodos ?? []).map(toDailyTaskItem),
    }),
    [todosData],
  );
  const tasks = tasksByPeriod[selectedPeriod];
  const handoverMemos = handoverMemosByPeriod[selectedPeriod];
  const memo = memoByPeriod[selectedPeriod];
  const workTimeSlots = toDailyTaskWorkTimeSlots(
    periodSchedulesData,
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
    setMemoByPeriod((currentMemoByPeriod) => ({
      ...currentMemoByPeriod,
      [selectedPeriod]: nextMemo,
    }));
  };

  const deleteMemo = (memoId: number) => {
    setHandoverMemosByPeriod((currentMemosByPeriod) => ({
      ...currentMemosByPeriod,
      [selectedPeriod]: currentMemosByPeriod[selectedPeriod].filter(
        (handoverMemo) => handoverMemo.id !== memoId || !handoverMemo.isMine,
      ),
    }));
  };

  const saveMemo = (nextMemo: string) => {
    const trimmedMemo = nextMemo.trim();

    if (trimmedMemo.length === 0) {
      return;
    }

    const newMemo: HandoverMemo = {
      id: Date.now(),
      author: "현재 사용자",
      createdAt: formatMemoCreatedAt(new Date()),
      content: trimmedMemo,
      isMine: true,
    };

    setHandoverMemosByPeriod((currentMemosByPeriod) => ({
      ...currentMemosByPeriod,
      [selectedPeriod]: [...currentMemosByPeriod[selectedPeriod], newMemo],
    }));

    setMemoByPeriod((currentMemoByPeriod) => ({
      ...currentMemoByPeriod,
      [selectedPeriod]: "",
    }));
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
            <p className="px-4 pb-4 text-[12px] font-bold text-[#8892A6]">
              업무 사항을 불러오는 중입니다.
            </p>
          ) : isErrorTodos ? (
            <p className="px-4 pb-4 text-[12px] font-bold text-[#8892A6]">
              {todosError?.message ?? "업무 사항을 불러오지 못했습니다."}
            </p>
          ) : tasks.length > 0 ? (
            <TaskChecklist
              tasks={tasks}
              onToggleTask={toggleTask}
              togglingTaskId={pendingTodoCompletionId}
            />
          ) : (
            <p className="px-4 pb-4 text-[12px] font-bold text-[#8892A6]">
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
          {isFetchingPeriodSchedules ? (
            <p className="px-4 pb-4 text-[12px] font-bold text-[#8892A6]">
              근로 시간을 불러오는 중입니다.
            </p>
          ) : isErrorPeriodSchedules ? (
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
          <HandoverMemoPanel
            handoverMemos={handoverMemos}
            memo={memo}
            onChangeMemo={changeMemo}
            onDeleteMemo={deleteMemo}
            onSaveMemo={saveMemo}
          />
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
