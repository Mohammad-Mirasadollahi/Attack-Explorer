'use client';

import React from 'react';

export interface StageStoryCaptionProps {
  testId: string;
  accentHex: string;
  actLabel: string;
  stageTag: string;
  mitreCode: string;
  title: string;
  storyExcerpt: string;
  technicalParallel: string;
}

/** Top-left manga-style story caption shared by all anime 3D stages. */
export function StageStoryCaption({
  testId,
  accentHex,
  actLabel,
  stageTag,
  mitreCode,
  title,
  storyExcerpt,
  technicalParallel,
}: StageStoryCaptionProps) {
  return (
    <div
      data-testid={testId}
      className="pointer-events-auto absolute top-3 left-3 z-20 max-w-[min(368px,52vw)] rounded-xl bg-white/95 dark:bg-slate-950/94 border-2 border-slate-900 dark:border-slate-700 shadow-[3px_3px_0px_#0F172A] px-3 py-2 text-left space-y-1"
    >
      <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono font-bold">
        <span
          style={{ backgroundColor: accentHex }}
          className="px-1.5 py-0.5 rounded text-slate-950 font-extrabold"
        >
          {actLabel}
        </span>
        <span className="text-slate-600 dark:text-slate-300">{stageTag}</span>
        <span aria-hidden="true" className="text-slate-400">
          ·
        </span>
        <span className="text-rose-600 dark:text-rose-400">{mitreCode}</span>
      </div>

      <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-950 dark:text-white leading-snug">
        {title}
      </h3>

      <p className="text-[11.5px] font-medium text-slate-800 dark:text-slate-200 leading-snug">
        &ldquo;{storyExcerpt}&rdquo;
      </p>

      <div className="pt-1 border-t border-slate-200 dark:border-slate-800 text-[10.5px] font-mono text-indigo-700 dark:text-sky-300 leading-snug">
        {technicalParallel}
      </div>
    </div>
  );
}
