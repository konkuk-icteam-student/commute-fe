"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import {
  useDeleteAdminTodoMutation,
  useUpdateAdminTodoMutation,
} from "@/apis/admin/todos";
import { useUpdateTodoCompletionMutation } from "@/apis/todos";
import checkCircleIcon from "@/assets/icons/admin-common/ic_check_circle.svg";
import { Toast } from "@/components/ui";

import type { ManageTaskItem } from "../../types";
import TaskRepeatNotice from "../task-repeat-notice";
import TaskSection from "../task-section";

export default function TaskListPanel({
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
  const { updateAdminTodo, isPendingUpdateAdminTodo } =
    useUpdateAdminTodoMutation();
  const { deleteAdminTodo, isPendingDeleteAdminTodo } =
    useDeleteAdminTodoMutation();
  const { updateTodoCompletion, isPendingUpdateTodoCompletion } =
    useUpdateTodoCompletionMutation();
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const groupedTasks = ["오전", "오후"].map((period) => ({
    period,
    tasks: tasks.filter((task) => task.period === period),
  }));

  const toggleTask = (taskId: number) => {
    const currentTask = tasks.find((task) => task.id === taskId);

    if (!currentTask || isPendingUpdateTodoCompletion) {
      return;
    }

    updateTodoCompletion(
      {
        date: selectedDate,
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

    updateAdminTodo(
      {
        todoId: editingTaskId,
        description: trimmedTitle,
      },
      {
        onSuccess: () => {
          cancelEditTask();
          setToastMessage("업무가 수정되었습니다.");
        },
        onError: (error) => {
          setToastMessage(error.message);
        },
      },
    );
  };

  const openDeleteTask = (taskId: number) => {
    setEditingTaskId(null);
    setEditingTitle("");
    setDeletingTaskId(taskId);
  };

  const cancelDeleteTask = () => {
    setDeletingTaskId(null);
  };

  const dismissToast = useCallback(() => {
    setToastMessage("");
  }, []);

  const deleteTask = (taskId: number) => {
    deleteAdminTodo(
      { todoId: taskId },
      {
        onSuccess: () => {
          setDeletingTaskId(null);
          setToastMessage("업무가 삭제되었습니다.");
        },
        onError: (error) => {
          setToastMessage(error.message);
        },
      },
    );
  };

  return (
    <section className="rounded-lg border border-[#DDE3EF] bg-white px-3 py-4">
      <div className="mb-6 flex items-center gap-2 text-[17px] font-bold text-[#1A2236]">
        <Image src={checkCircleIcon} alt="" width={20} height={20} />
        업무사항
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-[13px] font-medium text-[#8892A6]">
          업무사항을 불러오는 중입니다.
        </p>
      ) : isError ? (
        <p className="py-8 text-center text-[13px] font-medium text-[#FD7171]">
          {errorMessage ?? "업무사항을 불러오지 못했습니다."}
        </p>
      ) : (
        <div className="space-y-4">
          {groupedTasks.map((group, groupIndex) => (
            <TaskSection
              deletingTaskId={deletingTaskId}
              editingTaskId={editingTaskId}
              editingTitle={editingTitle}
              hasBottomBorder={groupIndex < groupedTasks.length - 1}
              isDeletingTask={isPendingDeleteAdminTodo}
              isSavingEdit={isPendingUpdateAdminTodo}
              isTogglingTask={isPendingUpdateTodoCompletion}
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
      )}

      <TaskRepeatNotice />

      <Toast
        open={toastMessage.length > 0}
        message={toastMessage}
        onDismiss={dismissToast}
      />
    </section>
  );
}
