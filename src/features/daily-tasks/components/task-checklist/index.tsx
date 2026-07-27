import { CheckButton } from "@/components/ui";
import { cn } from "@/lib/utils";

import type { DailyTaskItem } from "../../types";

type TaskChecklistProps = {
  tasks: DailyTaskItem[];
  onToggleTask: (taskId: number) => void;
};

export default function TaskChecklist({
  tasks,
  onToggleTask,
}: TaskChecklistProps) {
  return (
    <ul className="px-3 pb-4">
      {tasks.map((task) => (
        <li
          className="flex h-7.75 items-center gap-2 border-b-[0.3px] border-[#DDE3EF] last:border-b-0"
          key={task.id}
        >
          <CheckButton
            checked={task.completed}
            label={`${task.title} 완료 여부`}
            onClick={() => onToggleTask(task.id)}
          />
          <span
            className={cn(
              "text-[12px] leading-5.25 font-medium",
              task.completed ? "text-[#C6CBD4] line-through" : "text-black",
            )}
          >
            {task.title}
          </span>
        </li>
      ))}
    </ul>
  );
}
