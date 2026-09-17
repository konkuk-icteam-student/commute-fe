import { CheckButton } from "@/components/ui";
import { cn } from "@/lib/utils";

import type { DailyTaskItem } from "../../types";

type TaskChecklistProps = {
  isTogglingTask?: boolean;
  tasks: DailyTaskItem[];
  onToggleTask: (taskId: number) => void;
};

export default function TaskChecklist({
  isTogglingTask = false,
  tasks,
  onToggleTask,
}: TaskChecklistProps) {
  return (
    <ul className="px-3 pb-4">
      {tasks.map((task) => (
        <li
          className="flex min-h-7.75 items-center gap-2 border-b-[0.3px] border-[#DDE3EF] py-1.5 last:border-b-0"
          key={task.id}
        >
          <CheckButton
            checked={task.completed}
            disabled={isTogglingTask}
            label={`${task.title} 완료 여부`}
            onClick={() => onToggleTask(task.id)}
          />
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-[12px] leading-5.25 font-medium",
                task.completed ? "text-[#C6CBD4] line-through" : "text-black",
              )}
            >
              {task.title}
            </p>
            {task.completed && task.completedAt ? (
              <p className="text-[10px] leading-2.75 font-medium text-[#1A2236]">
                {task.assignee ?? "관리자"} {task.completedAt}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
