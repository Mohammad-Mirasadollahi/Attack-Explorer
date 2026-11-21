'use client';

import React from 'react';
import { Terminal } from 'lucide-react';
import type { AttackScenario, AttackStage } from '@/lib/attack-scenarios';
import type { CascadingProcessWaterfallNode } from '@/lib/documentation-structural-diagrams';
import { CascadingProcessWaterfall } from './CascadingProcessWaterfall';

export interface CascadingProcessCardProps {
  nodes: CascadingProcessWaterfallNode[];
  scenario: AttackScenario;
  activeStageObj: AttackStage | null;
  className?: string;
}

export function CascadingProcessCard({
  nodes,
  scenario,
  activeStageObj,
  className,
}: CascadingProcessCardProps) {
  return (
    <div
      className={
        className ??
        'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3'
      }
    >
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Cascading Process Execution Hierarchy (Parent ──▶ Child Waterfall)
            </h4>
            <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
              Indented parent-to-child process spawn tree (PPID ──▶ PID)
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
          {nodes.length} Process Nodes
        </span>
      </div>
      <CascadingProcessWaterfall
        nodes={nodes}
        scenario={scenario}
        activeStageObj={activeStageObj}
        embedded={false}
      />
    </div>
  );
}
