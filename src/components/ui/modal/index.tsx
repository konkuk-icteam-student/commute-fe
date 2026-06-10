import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { getModalActions } from "./actions";

interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  open?: boolean;
  title?: ReactNode;
  children?: ReactNode;
  confirmText?: string;
  onConfirmClick?: () => void;
  cancelText?: string;
  onCancelClick?: () => void;
  panelClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
}

export default function Modal({
  open = true,
  title,
  children,
  confirmText,
  onConfirmClick,
  cancelText,
  onCancelClick,
  className,
  panelClassName,
  titleClassName,
  contentClassName,
  confirmButtonClassName,
  cancelButtonClassName,
  ...props
}: ModalProps) {
  if (!open) {
    return null;
  }

  const actions = getModalActions({
    cancelText,
    onCancelClick,
    confirmText,
    onConfirmClick,
  });

  return (
    <div
      {...props}
      className={cn(
        "fixed inset-y-0 left-1/2 z-60 flex w-full max-w-150 -translate-x-1/2 items-center justify-center bg-[#444444]/30 px-5",
        className,
      )}
      role="dialog"
      aria-modal="true"
    >
      <section
        className={cn(
          "flex max-h-103 max-w-80 flex-col items-center justify-center overflow-hidden rounded-[10px] bg-white text-center opacity-100 shadow-[0_4px_20px_0_#00000040]",
          panelClassName,
        )}
      >
        <div
          className={cn(
            "modal-scrollbar flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-6 py-7 text-sm text-[#000000]",
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

          {children}
        </div>

        {actions.length > 0 ? (
          <div className="flex w-full shrink-0">
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                className={cn(
                  "flex h-10 flex-1 cursor-pointer items-center justify-center text-sm leading-6 font-normal tracking-[0.24px] text-white",
                  action.key === "confirm" ? "bg-[#2076FF]" : "bg-[#CBD1DA]",
                  action.key === "confirm"
                    ? confirmButtonClassName
                    : cancelButtonClassName,
                )}
                onClick={action.onClick}
              >
                {action.text}
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
