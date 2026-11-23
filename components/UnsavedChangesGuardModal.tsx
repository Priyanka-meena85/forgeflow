"use client";

import React from "react";

interface UnsavedChangesGuardModalProps {
  isOpen: boolean;
  onStay: () => void;
  onDiscard: () => void;
  targetTabName?: string;
}

export function UnsavedChangesGuardModal({
  isOpen,
  onStay,
  onDiscard,
  targetTabName,
}: UnsavedChangesGuardModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="unsaved-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in font-humanist"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-rose-200 animate-in zoom-in-95 duration-150 max-h-[90dvh] overflow-y-auto my-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base shrink-0">
            <span className="css-icon-alert"></span>
          </div>
          <div>
            <h3 id="unsaved-modal-title" className="text-base font-bold text-slate-900">
              Unsaved Changes Warning
            </h3>
            <p className="text-xs text-slate-500">
              You are currently modifying an industrial technical draft.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-rose-50/50 p-3.5 rounded-xl border border-rose-100">
          Switching to <strong>&quot;{targetTabName || "another tab"}&quot;</strong> will discard your unsaved edits. Would you like to stay and save your changes, or discard them and proceed?
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onStay}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            Stay in Editor
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer shadow-xs"
          >
            Discard &amp; Switch
          </button>
        </div>
      </div>
    </div>
  );
}
