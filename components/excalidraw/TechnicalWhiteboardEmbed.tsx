'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PenLine } from 'lucide-react';
import {
  getSection3DDescriptor,
  type Section3DKey,
} from '@/lib/section-3d-registry';
import { PROCESS_HOLLOWING_TECHNICAL_BOARDS } from '@/modules/scenarios/process-hollowing/excalidraw';
import type { TechnicalBoardDescriptor } from '@/lib/excalidraw-boards/board-primitives';
import { hasAnyTechnicalWhiteboard } from '@/lib/malware-2d-blueprints/manifest';
import { loadAnyTechnicalWhiteboard } from '@/lib/scenario-2d-blueprints/loader';
import { useHeavyMediaSlot } from '@/components/media/useHeavyMediaSlot';

function BoardLoading() {
  return (
    <div
      className="w-full h-[420px] sm:h-[520px] rounded-xl border border-slate-300/80 bg-[#FDFBF7] flex items-center justify-center"
      data-testid="excalidraw-technical-board-loading"
    >
      <div className="text-sm font-mono text-slate-600">
        Loading technical whiteboard...
      </div>
    </div>
  );
}

const ExcalidrawBoard = dynamic(() => import('./ExcalidrawBoard'), {
  ssr: false,
  loading: () => <BoardLoading />,
});

function compactBoardBadge(sectionKey: Section3DKey): string {
  if (sectionKey === 'briefing') return 'TECH BOARD · BRIEFING #0';
  if (sectionKey === 'memory-forensics') return 'TECH BOARD · MEMORY DIFF';
  return `TECH BOARD · STEP #${sectionKey.replace('step-', '')}`;
}

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

  const isProcessHollowing = scenarioId === 'process-hollowing';
  const staticBoard = isProcessHollowing
    ? PROCESS_HOLLOWING_TECHNICAL_BOARDS[sectionKey] ?? null
    : null;
  const hasLazyBoard =
    !isProcessHollowing && hasAnyTechnicalWhiteboard(scenarioId, sectionKey);

  const targetKey = `${scenarioId}:${sectionKey}`;
  const [loadedState, setLoadedState] = useState<{
    key: string;
    board: TechnicalBoardDescriptor | null;
    error: boolean;
  }>({ key: '', board: null, error: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!active || staticBoard || !hasLazyBoard) return;
    let cancelled = false;
    void loadAnyTechnicalWhiteboard(scenarioId, sectionKey)
      .then((loaded) => {
        if (!cancelled) {
          setLoadedState({ key: targetKey, board: loaded, error: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadedState({ key: targetKey, board: null, error: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [active, staticBoard, hasLazyBoard, scenarioId, sectionKey, targetKey, attempt]);

  if (!staticBoard && !hasLazyBoard) return null;

  const isCurrent = loadedState.key === targetKey;
  const resolvedBoard = staticBoard ?? (isCurrent ? loadedState.board : null);
  const loadError = !staticBoard && isCurrent && loadedState.error;

  const desc = !staticBoard
    ? getSection3DDescriptor(scenarioId, sectionKey)
    : null;
  const boardBadge =
    staticBoard?.boardBadge ?? compactBoardBadge(sectionKey);
  const title = staticBoard?.title ?? desc?.title ?? `${scenarioId} — ${sectionKey}`;
  const subtitle = staticBoard?.subtitle ?? desc?.technicalCue ?? '';

  return (
    <section
      data-testid={`technical-whiteboard-embed-${sectionKey}`}
      className={`w-full space-y-2 ${className}`}
      aria-label={`Technical whiteboard: ${title}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 text-[#FDFBF7] font-mono text-[10.5px] font-extrabold tracking-wide">
          <PenLine className="w-3 h-3" aria-hidden="true" />
          {boardBadge}
        </span>
        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {title}
        </h3>
      </div>
      <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
        {subtitle}
      </p>

      <div
        ref={ref}
        className="rounded-xl border-2 border-slate-800/90 dark:border-slate-600 overflow-hidden bg-[#FDFBF7] shadow-[3px_3px_0_#0f172a]"
        data-board-active={active ? 'true' : 'false'}
      >
        <div className="h-[500px] sm:h-[620px] w-full relative">
          {active ? (
            loadError ? (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#FDFBF7] p-4"
                data-testid="excalidraw-technical-board-error"
              >
                <div className="font-mono text-xs text-rose-700">
                  Failed to load technical whiteboard.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoadedState({ key: '', board: null, error: false });
                    setAttempt((n) => n + 1);
                  }}
                  className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 font-mono text-xs font-bold text-white hover:bg-slate-800"
                >
                  Retry
                </button>
              </div>
            ) : resolvedBoard ? (
              <ExcalidrawBoard
                key={targetKey}
                skeletons={resolvedBoard.skeletons}
                tooltips={resolvedBoard.tooltips}
              />
            ) : (
              <BoardLoading />
            )
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
