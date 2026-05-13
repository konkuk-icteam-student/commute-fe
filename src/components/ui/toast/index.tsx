"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  open?: boolean;
  message: ReactNode;
  duration?: number;
  onDismiss?: () => void;
  panelClassName?: string;
  contentClassName?: string;
}

export default function Toast({
  open = true,
  message,
  duration = 2000,
  onDismiss,
  className,
  panelClassName,
  contentClassName,
  ...props
}: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss?.();
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [duration, onDismiss, open]);

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
      role="status"
      aria-live="polite"
    >
      <section
        className={cn(
          "w-76.5 max-w-full rounded-[10px] bg-white shadow-[0_4px_20px_0_#00000040]",
          panelClassName,
        )}
      >
        <div
          className={cn(
            "flex min-h-29.25 items-center justify-center px-10 py-11 text-center text-[#000000]",
            contentClassName,
          )}
        >
          <p className="text-center align-middle text-sm leading-none font-medium tracking-[0.21px]">
            {message}
          </p>
        </div>
      </section>
    </div>
  );
}
