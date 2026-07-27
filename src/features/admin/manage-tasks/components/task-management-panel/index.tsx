"use client";

import type { ManageTaskItem } from "../../types";
import TaskAddPanel, { type TaskPeriod } from "../task-add-panel";
import TaskListPanel from "../task-list-panel";

export default function TaskManagementPanel({
  onTasksChange,
  tasks,
}: {
  onTasksChange: (tasks: ManageTaskItem[]) => void;
  tasks: ManageTaskItem[];
}) {
  const addTask = ({
    period,
    title,
  }: {
    period: TaskPeriod;
    title: string;
  }) => {
    const nextTaskId =
      tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;

    onTasksChange([
      ...tasks,
      {
        id: nextTaskId,
        period,
        title,
        completed: false,
      },
    ]);
  };

  return (
    <div className="space-y-5">
      <TaskListPanel tasks={tasks} onTasksChange={onTasksChange} />
      <TaskAddPanel onAddTask={addTask} />
    </div>
  );
}
