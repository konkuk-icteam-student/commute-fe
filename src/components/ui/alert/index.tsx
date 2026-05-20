import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  open?: boolean;
  title?: ReactNode;
  message: ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  panelClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  buttonGroupClassName?: string;
  cancelButtonClassName?: string;
  confirmButtonClassName?: string;
}

export default function Alert({
  open = true,
  title,
  message,
  cancelText = "취소",
  confirmText = "확인",
  onCancel,
  onConfirm,
  className,
  panelClassName,
  titleClassName,
  contentClassName,
  buttonGroupClassName,
  cancelButtonClassName,
  confirmButtonClassName,
  ...props
}: AlertProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      {...props}
      className={cn(
        "fixed inset-y-0 left-1/2 z-[60] flex w-full max-w-150 -translate-x-1/2 items-center justify-center bg-[#444444]/30 px-5",
        className,
      )}
      role="alertdialog"
      aria-modal="true"
    >
      <section
        className={cn(
          "w-76.5 max-w-full overflow-hidden rounded-[10px] bg-white shadow-[0_4px_20px_0_#00000040]",
          panelClassName,
        )}
      >
        <div
          className={cn(
            "px-6 py-7 text-center text-[#000000]",
            contentClassName,
          )}
        >
          {title ? (
            <h2
              className={cn(
                "text-center align-middle text-base leading-none font-bold tracking-[0.21px]",
                titleClassName,
              )}
            >
              {title}
            </h2>
          ) : null}

          <p className="mt-5 text-center align-middle text-sm leading-none font-medium tracking-[0.21px] whitespace-pre-line">
            {message}
          </p>
        </div>

        <div className={cn("flex h-10 min-h-10", buttonGroupClassName)}>
          <button
            type="button"
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center bg-[#C6CBD4] text-base leading-6 font-normal tracking-[0.24px] text-white",
              cancelButtonClassName,
            )}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center bg-[#2076FF] text-base leading-6 font-normal tracking-[0.24px] text-white",
              confirmButtonClassName,
            )}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}
