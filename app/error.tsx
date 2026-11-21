"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ForgeFlow Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 font-humanist px-4 text-center">
      <div className="max-w-lg w-full space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 font-bold text-2xl font-mono">
          !
        </div>

        <div className="w-12 h-1 bg-red-500 mx-auto rounded-full" />

        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Application Error Encountered
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed">
          {error?.message || "An unexpected error occurred while rendering this view."}
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Retry Request
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider transition"
          >
            Return to Console
          </a>
        </div>
      </div>
    </div>
  );
}
