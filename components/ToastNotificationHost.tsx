"use client";

import React, { useEffect } from "react";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info";
  title?: string;
  message: string;
}

interface ToastNotificationHostProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastNotificationHost({ toasts, onDismiss }: ToastNotificationHostProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        onDismiss(toast.id);
      }, 4500)
    );
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? "bg-emerald-950/90 border-emerald-700/80 text-emerald-100 shadow-emerald-950/20"
                : isError
                ? "bg-rose-950/90 border-rose-700/80 text-rose-100 shadow-rose-950/20"
                : "bg-slate-900/90 border-slate-700/80 text-slate-100 shadow-slate-950/20"
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <span
                className={`mt-0.5 shrink-0 ${
                  isSuccess
                    ? "css-icon-shield text-emerald-400"
                    : isError
                    ? "css-icon-alert text-rose-400"
                    : "css-icon-bolt text-sky-400"
                }`}
              ></span>
              <div className="space-y-0.5 min-w-0">
                {toast.title && (
                  <p className="text-xs font-bold tracking-tight text-white">{toast.title}</p>
                )}
                <p className="text-xs leading-relaxed opacity-90 break-words">{toast.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-white/10 transition cursor-pointer shrink-0"
            >
              <span className="css-icon-cross text-xs"></span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
