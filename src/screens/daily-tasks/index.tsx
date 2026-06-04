"use client";

import { useMemo, useState } from "react";

import {
  HandoverMemoPanel,
  mockDailyTasksByPeriod,
  PeriodTabs,
  SectionCard,
  TaskChecklist,
  todayTaskDate,
  type DailyTaskPeriod,
  type HandoverMemo,
  WorkTimeList,
} from "@/features/daily-tasks";

const formatMemoCreatedAt = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}.${day} ${hours}:${minutes}`;
};

export default function DailyTasksScreen() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<DailyTaskPeriod>("morning");
  const [tasksByPeriod, setTasksByPeriod] = useState(() => ({
    morning: mockDailyTasksByPeriod.morning.tasks,
    afternoon: mockDailyTasksByPeriod.afternoon.tasks,
  }));
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
  const currentDailyTaskData = mockDailyTasksByPeriod[selectedPeriod];
  const tasks = tasksByPeriod[selectedPeriod];
  const handoverMemos = handoverMemosByPeriod[selectedPeriod];
  const memo = memoByPeriod[selectedPeriod];
  const completedTaskCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [section]: !currentSections[section],
    }));
  };

  const toggleTask = (taskId: number) => {
    setTasksByPeriod((currentTasksByPeriod) => ({
      ...currentTasksByPeriod,
      [selectedPeriod]: currentTasksByPeriod[selectedPeriod].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    }));
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
          {todayTaskDate}
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
          <TaskChecklist tasks={tasks} onToggleTask={toggleTask} />
        </SectionCard>

        <SectionCard
          headerDivider="none"
          isOpen={openSections.workTime}
          title="근로 시간"
          onToggle={() => toggleSection("workTime")}
        >
          <WorkTimeList workTimeSlots={currentDailyTaskData.workTimeSlots} />
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
    </main>
  );
}
