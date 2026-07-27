import clickedPencilIcon from "@/assets/icons/admin-manage-tasks/ic_clicked_pencil.svg";
import clickedTrashIcon from "@/assets/icons/admin-manage-tasks/ic_clicked_trash.svg";
import pencilIcon from "@/assets/icons/admin-manage-tasks/ic_pencil.svg";
import trashIcon from "@/assets/icons/admin-manage-tasks/ic_trash.svg";
import { CheckButton } from "@/components/ui";
import { cn } from "@/lib/utils";

import type { ManageTaskItem } from "../../types";
import TaskActionIconButton from "../task-action-icon-button";

export default function TaskRow({
  deletingTaskId,
  editingTaskId,
  editingTitle,
  onCancelDelete,
  onCancelEdit,
  onDelete,
  onEditTitleChange,
  onOpenDelete,
  onOpenEdit,
  onSaveEdit,
  onToggle,
  task,
}: {
  deletingTaskId: number | null;
  editingTaskId: number | null;
  editingTitle: string;
  onCancelDelete: () => void;
  onCancelEdit: () => void;
  onDelete: (taskId: number) => void;
  onEditTitleChange: (title: string) => void;
  onOpenDelete: (taskId: number) => void;
  onOpenEdit: (task: ManageTaskItem) => void;
  onSaveEdit: () => void;
  onToggle: (taskId: number) => void;
  task: ManageTaskItem;
}) {
  const isEditing = editingTaskId === task.id;
  const isDeleting = deletingTaskId === task.id;

  return (
    <li
      className={cn(
        "border-b-[0.5px] border-[#DDE3EF] last:border-b-0",
        isEditing
          ? "grid min-h-16 grid-cols-[minmax(0,1fr)_112px] items-center gap-x-2 py-2.25"
          : isDeleting
            ? "grid min-h-10 grid-cols-[15px_minmax(0,1fr)_112px] items-center gap-x-4 py-2.25 pl-2"
            : "grid min-h-10 grid-cols-[15px_minmax(0,1fr)_60px] items-center gap-x-4 py-2.25 pl-2",
      )}
    >
      {isEditing ? (
        <TaskEditContent
          editingTitle={editingTitle}
          onCancel={onCancelEdit}
          onChange={onEditTitleChange}
          onSave={onSaveEdit}
        />
      ) : (
        <>
          <CheckButton
            checked={task.completed}
            label={`${task.title} 완료 여부`}
            onClick={() => onToggle(task.id)}
          />
          <TaskContent task={task} />
          {isDeleting ? (
            <TaskDeleteActions
              onCancel={onCancelDelete}
              onDelete={() => onDelete(task.id)}
            />
          ) : (
            <div className="flex justify-end gap-3">
              <TaskActionIconButton
                defaultIcon={pencilIcon}
                hoverIcon={clickedPencilIcon}
                label={`${task.title} 수정`}
                onClick={() => onOpenEdit(task)}
              />
              <TaskActionIconButton
                defaultIcon={trashIcon}
                hoverIcon={clickedTrashIcon}
                label={`${task.title} 삭제`}
                onClick={() => onOpenDelete(task.id)}
              />
            </div>
          )}
        </>
      )}
    </li>
  );
}

function TaskEditContent({
  editingTitle,
  onCancel,
  onChange,
  onSave,
}: {
  editingTitle: string;
  onCancel: () => void;
  onChange: (title: string) => void;
  onSave: () => void;
}) {
  return (
    <>
      <input
        className="ml-2 h-7.5 rounded-md border-[0.5px] border-[#2563EB] px-3 py-2 text-[14px] text-[#1A2236] outline-none"
        value={editingTitle}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) {
            return;
          }

          if (event.key === "Enter") {
            onSave();
          }

          if (event.key === "Escape") {
            onCancel();
          }
        }}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="h-6.25 w-10 rounded-md bg-[#2563EB] text-[11px] font-semibold text-white"
          onClick={onSave}
        >
          저장
        </button>
        <button
          type="button"
          className="h-6.25 w-10 rounded-md border border-[#DDE3EF] bg-white text-[11px] font-semibold text-[#1A2236]"
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </>
  );
}

function TaskContent({ task }: { task: ManageTaskItem }) {
  return (
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
        {task.completed && task.completedAt
          ? `${task.assignee ?? "관리자"} ${task.completedAt}`
          : "미완료"}
      </p>
    </div>
  );
}

function TaskDeleteActions({
  onCancel,
  onDelete,
}: {
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="h-6.25 w-10 rounded-md bg-[#FD7171] text-[11px] font-semibold text-white"
        onClick={onDelete}
      >
        삭제
      </button>
      <button
        type="button"
        className="h-6.25 w-10 rounded-md border border-[#DDE3EF] bg-white text-[11px] font-semibold text-[#1A2236]"
        onClick={onCancel}
      >
        취소
      </button>
    </div>
  );
}
