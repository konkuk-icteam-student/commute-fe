import type { Todo } from "@/apis/todos";
import type { ManageTaskItem } from "@/features/admin/manage-tasks";
import type { DailyTaskItem } from "@/features/daily-tasks";

export const formatTodoCompletedAt = (completedTime?: string | null) => {
  if (!completedTime) {
    return undefined;
  }

  const minuteTime = completedTime.includes("T")
    ? completedTime.split("T")[1]?.slice(0, 5)
    : completedTime.slice(0, 5);

  return `${minuteTime ?? completedTime} 완료`;
};

export const getTodoPeriod = (timeSlot: string) => {
  const hour = Number(timeSlot.split(":")[0]);

  return hour < 12 ? "morning" : "afternoon";
};

export const toDailyTaskItem = (todo: Todo): DailyTaskItem => ({
  id: todo.todoId,
  title: todo.description,
  completed: todo.status === "COMPLETED",
});

export const toManageTaskItem = (todo: Todo): ManageTaskItem => ({
  id: todo.todoId,
  period: getTodoPeriod(todo.timeSlot) === "morning" ? "오전" : "오후",
  title: todo.description,
  assignee: todo.completedByName ?? undefined,
  completed: todo.status === "COMPLETED",
  completedAt: formatTodoCompletedAt(todo.completedTime),
});
