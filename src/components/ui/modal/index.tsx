import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  open?: boolean;
  title?: ReactNode;
  children?: ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  panelClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  buttonClassName?: string;
}

export default function Modal({
  open = true,
  title,
  children,
  buttonText = "확인",
  onButtonClick,
  className,
  panelClassName,
  titleClassName,
  contentClassName,
  buttonClassName,
  ...props
}: ModalProps) {
  if (!open) {
    return null;
  }

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
          "flex max-h-103 w-3/5 min-w-76.5 flex-col overflow-hidden rounded-[10px] bg-white opacity-100 shadow-[0_4px_20px_0_#00000040]",
          panelClassName,
        )}
      >
        <div
          className={cn(
            "modal-scrollbar flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-y-auto px-6 py-7 text-[#000000]",
            contentClassName,
          )}
        >
          {title ? (
            <h2
              className={cn(
                "text-center align-middle text-xl leading-none font-bold tracking-[0.21px]",
                titleClassName,
              )}
            >
              {title}
            </h2>
          ) : null}

          {children}
        </div>

        <button
          type="button"
          className={cn(
            "flex h-14 min-h-14 w-full shrink-0 cursor-pointer items-center justify-center bg-[#2076FF] text-base leading-6 font-normal tracking-[0.24px] text-white",
            buttonClassName,
          )}
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </section>
    </div>
  );
}
