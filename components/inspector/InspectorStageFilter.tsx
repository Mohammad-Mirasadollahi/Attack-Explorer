'use client';

import React from 'react';
import { Maximize2 } from 'lucide-react';
import type { AttackScenario } from '@/lib/attack-scenarios';
import type { InspectorScopeContext } from '@/lib/inspector-scope';
import type { WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';

interface InspectorStageFilterProps {
  scenario: AttackScenario;
  activeStageIndex: number;
  onSelectStage: (stageIndex: number) => void;
  activeInspectNode: WhiteboardSketchNode | null;
  scopeContext?: InspectorScopeContext;
  onExpandedNodeChange?: (nodeId: string | null) => void;
  onCloseInspectorPage?: () => void;
}

/** Stage Filter strip — belongs on Steps / Process Hierarchy / Memory / Logs, not Overview. */
export function InspectorStageFilter({
  scenario,
  activeStageIndex,
  onSelectStage,
  activeInspectNode,
  scopeContext,
  onExpandedNodeChange,
  onCloseInspectorPage,
}: InspectorStageFilterProps) {
  return (
    <section
      data-testid="inspector-main-scenario-stage-card"
      className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mr-1">
          STAGE FILTER ({scenario.stages.length} STAGES):
        </span>
        <button
          type="button"
          data-testid="inspector-stage-pill-overview"
          onClick={() => onSelectStage(0)}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
            activeStageIndex === 0
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          All Stages
        </button>
        {scenario.stages.map((st) => (
          <button
            key={`stage-pill-${st.index}`}
            type="button"
            data-testid={`inspector-stage-pill-${st.index}`}
            onClick={() => onSelectStage(st.index)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              activeStageIndex === st.index
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            S{st.index} · {st.mitreTechniqueId}
          </button>
        ))}
      </div>

      {activeInspectNode &&
        !scopeContext?.isInsideSubBoard &&
        scopeContext?.selectedMainNode &&
        onExpandedNodeChange && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="inspector-open-node-subboard-btn"
              onClick={() => {
                onExpandedNodeChange(scopeContext.selectedMainNode!.id);
                onCloseInspectorPage?.();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand Internal Pipeline on Diagram</span>
            </button>
          </div>
        )}
    </section>
  );
}
