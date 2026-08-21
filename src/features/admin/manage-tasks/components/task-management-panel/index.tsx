"use client";

import { useCallback, useState } from "react";

import { useCreateAdminTodoMutation } from "@/apis/admin/todos";
import { Toast } from "@/components/ui";

import type { ManageTaskItem } from "../../types";
import TaskAddPanel, { type TaskPeriod } from "../task-add-panel";
import TaskListPanel from "../task-list-panel";

const taskPeriodTimeSlot: Record<TaskPeriod, string> = {
  오전: "09:00",
  오후: "13:00",
};

export default function TaskManagementPanel({
  errorMessage,
  isError,
  isLoading,
  selectedDate,
  tasks,
}: {
  errorMessage?: string;
  isError: boolean;
  isLoading: boolean;
  selectedDate: string;
  tasks: ManageTaskItem[];
}) {
  const [toastMessage, setToastMessage] = useState("");
  const { createAdminTodo, isPendingCreateAdminTodo } =
    useCreateAdminTodoMutation();

  const addTask = ({
    period,
    title,
  }: {
    period: TaskPeriod;
    title: string;
  }) => {
    createAdminTodo(
      {
        date: selectedDate,
        timeSlot: taskPeriodTimeSlot[period],
        description: title,
      },
      {
        onSuccess: () => {
          setToastMessage("업무가 추가되었습니다.");
        },
        onError: (error) => {
          setToastMessage(error.message);
        },
      },
    );
  };

  const dismissToast = useCallback(() => {
    setToastMessage("");
  }, []);

  return (
    <div className="space-y-5">
      <TaskListPanel
        errorMessage={errorMessage}
        isError={isError}
        isLoading={isLoading}
        selectedDate={selectedDate}
        tasks={tasks}
      />
      <TaskAddPanel
        isAdding={isPendingCreateAdminTodo}
        onAddTask={addTask}
      />
      <Toast
        open={toastMessage.length > 0}
        message={toastMessage}
        onDismiss={dismissToast}
      />
    </div>
  );
}
