'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Attack Explorer recovered from client exception:', error);
  }, [error]);

  return (
    <div
      dir="ltr"
      className="min-h-screen w-full flex items-center justify-center bg-[#09090B] text-zinc-100 p-6"
    >
      <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h2 className="text-sm font-bold tracking-tight">
            Workbench View Recovery
          </h2>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The interactive diagram workbench encountered a transient UI state
          error and is ready to resume.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resume Workbench</span>
          </button>
        </div>
      </div>
    </div>
  );
}
