import { cn } from "@/lib/utils";

import type { ManageTaskItem } from "../../types";
import TaskRow from "../task-row";

export default function TaskSection({
  deletingTaskId,
  editingTaskId,
  editingTitle,
  hasBottomBorder,
  isDeletingTask,
  isSavingEdit,
  isTogglingTask,
  onCancelDelete,
  onCancelEdit,
  onDelete,
  onEditTitleChange,
  onOpenDelete,
  onOpenEdit,
  onSaveEdit,
  onToggle,
  period,
  tasks,
}: {
  deletingTaskId: number | null;
  editingTaskId: number | null;
  editingTitle: string;
  hasBottomBorder: boolean;
  isDeletingTask: boolean;
  isSavingEdit: boolean;
  isTogglingTask: boolean;
  onCancelDelete: () => void;
  onCancelEdit: () => void;
  onDelete: (taskId: number) => void;
  onEditTitleChange: (title: string) => void;
  onOpenDelete: (taskId: number) => void;
  onOpenEdit: (task: ManageTaskItem) => void;
  onSaveEdit: () => void;
  onToggle: (taskId: number) => void;
  period: string;
  tasks: ManageTaskItem[];
}) {
  return (
    <div>
      <h3 className="border-b-[0.3px] border-[#DDE3EF] p-2 px-1.5 text-sm leading-3.5 font-bold text-[#000000]">
        {period}
      </h3>
      <ul
        className={cn(hasBottomBorder && "border-b-[0.3px] border-[#DDE3EF]")}
      >
        {tasks.map((task) => (
          <TaskRow
            deletingTaskId={deletingTaskId}
            editingTaskId={editingTaskId}
            editingTitle={editingTitle}
            isDeletingTask={isDeletingTask}
            isSavingEdit={isSavingEdit}
            isTogglingTask={isTogglingTask}
            key={task.id}
            onCancelDelete={onCancelDelete}
            onCancelEdit={onCancelEdit}
            onDelete={onDelete}
            onEditTitleChange={onEditTitleChange}
            onOpenDelete={onOpenDelete}
            onOpenEdit={onOpenEdit}
            onSaveEdit={onSaveEdit}
            onToggle={onToggle}
            task={task}
          />
        ))}
      </ul>
    </div>
  );
}
