import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function SettingsActionButtons({
  isActive,
  isDirty,
  isEditing,
  isSaving,
  isStartReady,
  onCancelEdit,
  onEdit,
  onEnd,
  onStart,
  onUpdate,
}: {
  isActive: boolean;
  isDirty: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isStartReady: boolean;
  onCancelEdit: () => void;
  onEdit: () => void;
  onEnd: () => void;
  onStart: () => void;
  onUpdate: () => void;
}) {
  if (!isActive) {
    return (
      <button
        type="button"
        className={cn(
          "h-16.5 w-full max-w-60.5 min-w-17.5 overflow-hidden rounded-md px-2 text-xl font-semibold whitespace-nowrap",
          isStartReady
            ? "cursor-pointer bg-[#2076FF] text-white"
            : "bg-[#EFEFF1] text-[#6D7882]",
        )}
        disabled={!isStartReady || isSaving}
        onClick={onStart}
      >
        {isSaving ? "저장중" : "신청받기"}
      </button>
    );
  }

  if (isEditing) {
    return (
      <>
        <ActionButton
          className="max-w-27.75 bg-[#CDD1D5] text-[#6D7882]"
          onClick={onCancelEdit}
        >
          취소
        </ActionButton>
        <ActionButton
          className={cn(
            "max-w-36.5",
            isDirty ? "bg-[#2076FF] text-white" : "bg-[#EFEFF1] text-[#6D7882]",
          )}
          disabled={!isDirty || isSaving}
          onClick={onUpdate}
        >
          {isSaving ? "저장중" : "수정 완료"}
        </ActionButton>
      </>
    );
  }

  return (
    <>
      <ActionButton
        className="max-w-36.5 bg-[#2076FF] text-white"
        onClick={onEdit}
      >
        수정하기
      </ActionButton>
      <ActionButton
        className="max-w-27.75 bg-[#F84D4D] text-white"
        onClick={onEnd}
      >
        종료
      </ActionButton>
    </>
  );
}

function ActionButton({
  children,
  className,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  className: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "h-16 min-w-17.5 flex-1 overflow-hidden rounded-md px-2 text-xl font-semibold whitespace-nowrap",
        disabled ? "" : "cursor-pointer",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
