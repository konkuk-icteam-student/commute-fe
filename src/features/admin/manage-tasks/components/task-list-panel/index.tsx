"use client";

import Image from "next/image";
import { useState } from "react";

import checkCircleIcon from "@/assets/icons/admin-common/ic_check_circle.svg";
import clickedPencilIcon from "@/assets/icons/admin-manage-tasks/ic_clicked_pencil.svg";
import clickedTrashIcon from "@/assets/icons/admin-manage-tasks/ic_clicked_trash.svg";
import pencilIcon from "@/assets/icons/admin-manage-tasks/ic_pencil.svg";
import trashIcon from "@/assets/icons/admin-manage-tasks/ic_trash.svg";
import infoCircleIcon from "@/assets/icons/common/ic_info_circle.svg";
import { CheckButton } from "@/components/ui";
import { cn } from "@/lib/utils";

import type { ManageTaskItem } from "../../types";

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
            assignee: "미완료",
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

    if (!editingTaskId || trimmedTitle.length === 0) {
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
          <div key={group.period}>
            <h3 className="border-b-[0.3px] border-[#DDE3EF] p-2 px-1.5 text-sm leading-3.5 font-bold text-[#000000]">
              {group.period}
            </h3>
            <ul
              className={cn(
                groupIndex < groupedTasks.length - 1 &&
                  "border-b-[0.3px] border-[#DDE3EF]",
              )}
            >
              {group.tasks.map((task) => (
                <li
                  key={task.id}
                  className={cn(
                    "border-b-[0.5px] border-[#DDE3EF] last:border-b-0",
                    editingTaskId === task.id
                      ? "grid min-h-16 grid-cols-[minmax(0,1fr)_112px] items-center gap-x-2 py-2.25"
                      : deletingTaskId === task.id
                        ? "grid min-h-10 grid-cols-[15px_minmax(0,1fr)_112px] items-center gap-x-4 py-2.25 pl-2"
                        : "grid min-h-10 grid-cols-[15px_minmax(0,1fr)_60px] items-center gap-x-4 py-2.25 pl-2",
                  )}
                >
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        className="ml-2 h-7.5 rounded-md border-[0.5px] border-[#2563EB] px-3 py-2 text-[14px] text-[#1A2236] outline-none"
                        value={editingTitle}
                        onChange={(event) =>
                          setEditingTitle(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            saveEditTask();
                          }

                          if (event.key === "Escape") {
                            cancelEditTask();
                          }
                        }}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="h-6.25 w-10 rounded-md bg-[#2563EB] text-[11px] font-semibold text-white"
                          onClick={saveEditTask}
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          className="h-6.25 w-10 rounded-md border border-[#DDE3EF] bg-white text-[11px] font-semibold text-[#1A2236]"
                          onClick={cancelEditTask}
                        >
                          취소
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckButton
                        checked={task.completed}
                        label={`${task.title} 완료 여부`}
                        onClick={() => toggleTask(task.id)}
                      />
                      <div>
                        <p
                          className={cn(
                            "truncate text-[15px] font-bold",
                            task.completed
                              ? "text-[#2076FF] line-through decoration-[0.5px]"
                              : "text-[#1A2236]",
                          )}
                        >
                          {task.title}
                        </p>
                        <p className="text-[12px] font-medium text-[#8892A6]">
                          {task.completedAt
                            ? `${task.assignee} ${task.completedAt}`
                            : task.assignee}
                        </p>
                      </div>
                      {deletingTaskId === task.id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="h-6.25 w-10 rounded-md bg-[#FD7171] text-[11px] font-semibold text-white"
                            onClick={() => deleteTask(task.id)}
                          >
                            삭제
                          </button>
                          <button
                            type="button"
                            className="h-6.25 w-10 rounded-md border border-[#DDE3EF] bg-white text-[11px] font-semibold text-[#1A2236]"
                            onClick={cancelDeleteTask}
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <ActionIconButton
                            defaultIcon={pencilIcon}
                            hoverIcon={clickedPencilIcon}
                            label={`${task.title} 수정`}
                            onClick={() => openEditTask(task)}
                          />
                          <ActionIconButton
                            defaultIcon={trashIcon}
                            hoverIcon={clickedTrashIcon}
                            label={`${task.title} 삭제`}
                            onClick={() => openDeleteTask(task.id)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[12px_minmax(0,1fr)] gap-1 rounded-lg bg-[#F0F2F8] px-2.5 py-2 text-[12px] leading-5 text-[#8892A6]">
        <Image
          src={infoCircleIcon}
          alt=""
          width={12}
          height={12}
          className="mt-1 h-3 w-3"
        />
        <p className="min-w-0">
          업무의{" "}
          <span className="font-bold">
            수정 · 삭제 내용은 다음 날짜의 매일 반복 반영
          </span>
          됩니다.
          <br />
          오늘 하루만 변경하려면 관리자 메모를 이용해주세요.
        </p>
      </div>
    </section>
  );
}

function ActionIconButton({
  defaultIcon,
  hoverIcon,
  label,
  onClick,
}: {
  defaultIcon: string;
  hoverIcon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="group relative flex h-6 w-6 items-center justify-center"
      onClick={onClick}
    >
      <Image
        src={defaultIcon}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 group-hover:opacity-0"
      />
      <Image
        src={hoverIcon}
        alt=""
        width={24}
        height={24}
        className="absolute h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
      />
    </button>
  );
}
