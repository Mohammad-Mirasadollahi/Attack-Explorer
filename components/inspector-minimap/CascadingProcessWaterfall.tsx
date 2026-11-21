'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { AttackScenario, AttackStage } from '@/lib/attack-scenarios';
import type { CascadingProcessWaterfallNode } from '@/lib/documentation-structural-diagrams';
import { ProcessCommandLineInlineExplanation } from '../CommandBreakdownList';
import { getProcessStatusStyle } from './styles';

export interface CascadingProcessWaterfallProps {
  nodes: CascadingProcessWaterfallNode[];
  scenario: AttackScenario;
  activeStageObj: AttackStage | null;
  embedded?: boolean;
}

export function CascadingProcessWaterfall({
  nodes,
  scenario,
  activeStageObj,
  embedded = false,
}: CascadingProcessWaterfallProps) {
  return (
    <div
      data-testid="documentation-cascading-process-waterfall"
      className={cn(
        embedded
          ? 'space-y-0 divide-y divide-zinc-200/90 dark:divide-zinc-800'
          : 'space-y-2.5'
      )}
    >
      {nodes.map((node) => {
        const style = getProcessStatusStyle(node.process.status);
        const indentLevel = Math.min(node.depth, 4);
        const indentClasses = [
          'ml-0',
          'ml-4 sm:ml-7',
          'ml-8 sm:ml-14',
          'ml-12 sm:ml-20',
          'ml-16 sm:ml-24',
        ][indentLevel];

        return (
          <div
            key={`${node.process.pid}-${node.orderIndex}`}
            data-testid={`cascading-process-node-${node.process.pid}`}
            className={cn(
              'relative transition-all',
              indentClasses,
              embedded ? 'py-3 first:pt-0 last:pb-0' : '',
              !node.isHighlightedInStage && 'opacity-65'
            )}
          >
            {node.depth > 0 && (
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                <span className="inline-block w-3.5 h-3 border-l-2 border-b-2 border-indigo-400 dark:border-indigo-500 rounded-bl-sm" />
                <span className="leading-snug break-words">
                  SPAWNED CHILD OF {node.parentName} (PPID {node.parentPid} ──▶
                  PID {node.process.pid})
                </span>
              </div>
            )}

            <div
              className={cn(
                embedded
                  ? 'space-y-2'
                  : cn('rounded-xl border p-3 space-y-2 shadow-2xs', style.card)
              )}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-mono font-extrabold">
                    DEPTH {node.depth} · STAGE S{node.stageNumber}
                  </span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border',
                      style.badge
                    )}
                  >
                    {style.label}
                  </span>
                  <span className="text-[13px] font-mono font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                    {node.process.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                    PPID {node.parentPid} ──▶ PID {node.process.pid}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-500/30">
                    {node.process.user} · {node.process.integrity}
                  </span>
                </div>
              </div>

              <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-snug break-words border border-zinc-800">
                <span className="text-zinc-500 select-none mr-1.5">$</span>
                {node.process.commandLine}
              </div>

              <ProcessCommandLineInlineExplanation
                process={node.process}
                scenario={scenario}
                stage={activeStageObj}
              />

              <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9.5px] font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400">
                    API / Syscalls:
                  </span>
                  {node.syscallChain.map((call, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono font-semibold text-zinc-700 dark:text-zinc-300 leading-snug break-words"
                    >
                      {call}
                    </span>
                  ))}
                </div>

                {node.memorySummary && (
                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/40 text-[10px] font-mono font-bold text-purple-800 dark:text-purple-300 leading-snug break-words">
                    VAD RAM: {node.memorySummary}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
