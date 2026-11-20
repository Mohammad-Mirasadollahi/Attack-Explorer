'use client';

import React from 'react';
import { Eye, Maximize2, Minimize2 } from 'lucide-react';

export type StageCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface StageTopActionsProps {
  cutawayTestId: string;
  fullPageTestId: string;
  cutawayMode: StageCutawayMode;
  isFullPage: boolean;
  onCycleCutaway: () => void;
  onToggleFullPage: () => void;
}

/** Top-right cutaway + full-page controls shared by anime 3D stages. */
export function StageTopActions({
  cutawayTestId,
  fullPageTestId,
  cutawayMode,
  isFullPage,
  onCycleCutaway,
  onToggleFullPage,
}: StageTopActionsProps) {
  return (
    <div className="pointer-events-auto absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
      <button
        type="button"
        data-testid={cutawayTestId}
        onClick={onCycleCutaway}
        aria-label={`Toggle cutaway view, currently ${cutawayMode}`}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-900 dark:border-slate-600 text-[11px] font-mono font-bold shadow-[2px_2px_0px_#0F172A] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
          cutawayMode === 'OPEN'
            ? 'bg-rose-600 text-white'
            : cutawayMode === 'SEALED'
              ? 'bg-slate-800 text-slate-100'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-sky-50 dark:hover:bg-slate-800'
        }`}
      >
        <Eye className="w-3.5 h-3.5 shrink-0" />
        <span>Cutaway: {cutawayMode}</span>
      </button>

      <button
        type="button"
        data-testid={fullPageTestId}
        onClick={onToggleFullPage}
        aria-label={
          isFullPage ? 'Exit full page 3D view' : 'Expand 3D scene to full page'
        }
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-mono font-extrabold shadow-[2px_2px_0px_#0F172A] transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        {isFullPage ? (
          <>
            <Minimize2 className="w-3.5 h-3.5 shrink-0" />
            <span>Exit Full Page</span>
          </>
        ) : (
          <>
            <Maximize2 className="w-3.5 h-3.5 shrink-0" />
            <span>Full Page</span>
          </>
        )}
      </button>
    </div>
  );
}
