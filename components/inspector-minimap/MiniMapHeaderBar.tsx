'use client';

import React from 'react';
import { Compass, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AttackScenario, AttackStage } from '@/lib/attack-scenarios';
import type { DocumentationArchitectureBlueprint } from '@/lib/documentation-structural-diagrams';

export interface MiniMapHeaderBarProps {
  blueprint: DocumentationArchitectureBlueprint;
  scenario: AttackScenario;
  activeStageObj: AttackStage | null;
  stageBadge?: string | null;
  focusedNodeId: string | null;
  onClearFocus?: () => void;
  onReturnToDiagram?: () => void;
}

export function MiniMapHeaderBar({
  blueprint,
  scenario,
  activeStageObj,
  stageBadge,
  focusedNodeId,
  onClearFocus,
  onReturnToDiagram,
}: MiniMapHeaderBarProps) {
  return (
    <div className="px-4 sm:px-5 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/50 dark:from-indigo-950/35 dark:via-zinc-900 dark:to-violet-950/20 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
          <Compass className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              {blueprint.archetypeBadgeLabel}
            </span>
            <span
              data-testid="minimap-stage-badge"
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wider shrink-0',
                activeStageObj
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-200'
              )}
            >
              {stageBadge ||
                (activeStageObj
                  ? `STAGE S${activeStageObj.index} / ${scenario.stages.length}`
                  : `FULL TOPOLOGY (${scenario.stages.length} STAGES)`)}
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300/60 dark:border-indigo-500/30 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
              {blueprint.layoutModeLabel}
            </span>
          </div>
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 leading-snug break-words mt-0.5">
            {blueprint.archetypeDescription}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {focusedNodeId && (
          <button
            type="button"
            onClick={() => onClearFocus?.()}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-[11px] font-bold transition-colors cursor-pointer"
          >
            Show All Scenario Sections
          </button>
        )}
        {onReturnToDiagram && (
          <button
            type="button"
            onClick={onReturnToDiagram}
            data-testid="minimap-return-to-diagram-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer shrink-0"
            title="Close documentation view and highlight this exact node on the interactive whiteboard"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View in Diagram</span>
          </button>
        )}
      </div>
    </div>
  );
}
