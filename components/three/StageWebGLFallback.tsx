'use client';

import React from 'react';

export function StageWebGLFallback({
  error,
  hint,
}: {
  error: string;
  hint: string;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100">
      <div className="max-w-md space-y-2 border-2 border-sky-400 bg-slate-900 p-5 rounded-xl">
        <div className="font-mono text-xs font-bold text-sky-400">
          3D ANIME SCENE FALLBACK
        </div>
        <p className="text-sm font-semibold">{error}</p>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
    </div>
  );
}
