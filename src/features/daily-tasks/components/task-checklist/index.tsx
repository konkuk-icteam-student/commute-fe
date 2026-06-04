import Image from "next/image";

import checkIcon from "@/assets/icons/check-icon.svg";
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
          <button
            aria-pressed={task.completed}
            className={cn(
              "flex h-3.75 w-3.75 shrink-0 cursor-pointer items-center justify-center rounded border-[0.5px]",
              task.completed
                ? "border-[#2D81FF] bg-[#2D81FF]"
                : "border-[#C6CBD4] bg-white",
            )}
            type="button"
            onClick={() => onToggleTask(task.id)}
          >
            {task.completed && (
              <Image
                alt=""
                aria-hidden="true"
                src={checkIcon}
                width={8}
                height={6}
              />
            )}
          </button>
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
