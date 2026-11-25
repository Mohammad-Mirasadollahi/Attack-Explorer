'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { PenLine } from 'lucide-react';
import type { Section3DKey } from '@/lib/section-3d-registry';
import { getTechnicalWhiteboard } from '@/lib/section-excalidraw-registry';
import { useHeavyMediaSlot } from '@/components/media/useHeavyMediaSlot';

const ExcalidrawBoard = dynamic(() => import('./ExcalidrawBoard'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[420px] sm:h-[520px] rounded-xl border border-slate-300/80 bg-[#FDFBF7] flex items-center justify-center"
      data-testid="excalidraw-technical-board-loading"
    >
      <div className="text-sm font-mono text-slate-600">
        Loading technical whiteboard...
      </div>
    </div>
  ),
});

export interface TechnicalWhiteboardEmbedProps {
  scenarioId: string;
  sectionKey: Section3DKey;
  className?: string;
}

/**
 * Static Excalidraw technical whiteboard only.
 * SVG+GSAP teaching clips are a separate surface (`TechnicalClipEmbed`).
 */
export function TechnicalWhiteboardEmbed({
  scenarioId,
  sectionKey,
  className = '',
}: TechnicalWhiteboardEmbedProps) {
  const { ref, active, activate } = useHeavyMediaSlot('board');
  const board = getTechnicalWhiteboard(scenarioId, sectionKey);
  if (!board) return null;

  return (
    <section
      data-testid={`technical-whiteboard-embed-${sectionKey}`}
      className={`w-full space-y-2 ${className}`}
      aria-label={`Technical whiteboard: ${board.title}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 text-[#FDFBF7] font-mono text-[10.5px] font-extrabold tracking-wide">
          <PenLine className="w-3 h-3" aria-hidden="true" />
          {board.boardBadge}
        </span>
        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {board.title}
        </h3>
      </div>
      <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
        {board.subtitle}
      </p>

      <div
        ref={ref}
        className="rounded-xl border-2 border-slate-800/90 dark:border-slate-600 overflow-hidden bg-[#FDFBF7] shadow-[3px_3px_0_#0f172a]"
        data-board-active={active ? 'true' : 'false'}
      >
        <div className="h-[500px] sm:h-[620px] w-full relative">
          {active ? (
            <ExcalidrawBoard
              key={`${scenarioId}:${sectionKey}`}
              skeletons={board.skeletons}
              tooltips={board.tooltips}
            />
          ) : (
            <button
              type="button"
              onClick={activate}
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 bg-[#FDFBF7] font-mono text-sm text-slate-700"
            >
              <PenLine className="h-4 w-4" />
              Open technical whiteboard
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
