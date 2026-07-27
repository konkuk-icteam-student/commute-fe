"use client";

import Image from "next/image";
import { useState } from "react";

import checkCircleIcon from "@/assets/icons/admin-common/ic_check_circle.svg";

import type { ManageTaskItem } from "../../types";
import TaskRepeatNotice from "../task-repeat-notice";
import TaskSection from "../task-section";

const formatCompletedAt = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes} 완료`;
};

export default function TaskListPanel({
  onTasksChange,
  tasks,
}: {
  onTasksChange: (tasks: ManageTaskItem[]) => void;
  tasks: ManageTaskItem[];
}) {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const groupedTasks = ["오전", "오후"].map((period) => ({
    period,
    tasks: tasks.filter((task) => task.period === period),
  }));

  const toggleTask = (taskId: number) => {
    onTasksChange(
      tasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        if (task.completed) {
          return {
            ...task,
            completed: false,
            completedAt: undefined,
          };
        }

        return {
          ...task,
          assignee: "관리자",
          completed: true,
          completedAt: formatCompletedAt(new Date()),
        };
      }),
    );
  };

  const openEditTask = (task: ManageTaskItem) => {
    setDeletingTaskId(null);
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditingTitle("");
  };

  const saveEditTask = () => {
    const trimmedTitle = editingTitle.trim();

    if (editingTaskId === null || trimmedTitle.length === 0) {
      return;
    }

    onTasksChange(
      tasks.map((task) =>
        task.id === editingTaskId ? { ...task, title: trimmedTitle } : task,
      ),
    );
    cancelEditTask();
  };

  const openDeleteTask = (taskId: number) => {
    setEditingTaskId(null);
    setEditingTitle("");
    setDeletingTaskId(taskId);
  };

  const cancelDeleteTask = () => {
    setDeletingTaskId(null);
  };

  const deleteTask = (taskId: number) => {
    onTasksChange(tasks.filter((task) => task.id !== taskId));
    setDeletingTaskId(null);
  };

  return (
    <section className="rounded-lg border border-[#DDE3EF] bg-white px-3 py-4">
      <div className="mb-6 flex items-center gap-2 text-[17px] font-bold text-[#1A2236]">
        <Image src={checkCircleIcon} alt="" width={20} height={20} />
        업무사항
      </div>

      <div className="space-y-4">
        {groupedTasks.map((group, groupIndex) => (
          <TaskSection
            deletingTaskId={deletingTaskId}
            editingTaskId={editingTaskId}
            editingTitle={editingTitle}
            hasBottomBorder={groupIndex < groupedTasks.length - 1}
            key={group.period}
            onCancelDelete={cancelDeleteTask}
            onCancelEdit={cancelEditTask}
            onDelete={deleteTask}
            onEditTitleChange={setEditingTitle}
            onOpenDelete={openDeleteTask}
            onOpenEdit={openEditTask}
            onSaveEdit={saveEditTask}
            onToggle={toggleTask}
            period={group.period}
            tasks={group.tasks}
          />
        ))}
      </div>

      <TaskRepeatNotice />
    </section>
  );
}
