"use client";

import { useRef, useState } from "react";

import type { ManageTaskItem } from "../../types";
import TaskAddPanel, { type TaskPeriod } from "../task-add-panel";
import TaskListPanel from "../task-list-panel";

export default function TaskManagementPanel({
  initialTasks,
}: {
  initialTasks: ManageTaskItem[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const nextTaskIdRef = useRef(
    initialTasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1,
  );

  const addTask = ({ period, title }: { period: TaskPeriod; title: string }) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: nextTaskIdRef.current,
        period,
        title,
        assignee: "미완료",
        completed: false,
      },
    ]);
    nextTaskIdRef.current += 1;
  };

  const updateTasks = (nextTasks: ManageTaskItem[]) => {
    setTasks(nextTasks);
  };

  return (
    <div className="space-y-5">
      <TaskListPanel tasks={tasks} onTasksChange={updateTasks} />
      <TaskAddPanel onAddTask={addTask} />
    </div>
  );
}
