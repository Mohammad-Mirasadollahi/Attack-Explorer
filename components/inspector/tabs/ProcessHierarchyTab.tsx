'use client';

import React from 'react';
import { GitBranch } from 'lucide-react';
import type { TelemetryEvent } from '@/lib/attack-scenarios';
import type {
  InspectorMiniMapModel,
  InspectorScopeContext,
} from '@/lib/inspector-scope';
import { InspectorContextMiniMap } from '../../InspectorContextMiniMap';

export interface ProcessHierarchyTabProps {
  miniMapModel: InspectorMiniMapModel | null;
  effectiveScopeContext: InspectorScopeContext;
  selectedTelemetry: TelemetryEvent | null;
  activeStageIndex: number;
  onSelectStage: (stageIndex: number) => void;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  onClearTelemetrySelection: () => void;
  onSelectNode?: (nodeId: string | null) => void;
  onExpandedNodeChange?: (nodeId: string | null) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onCloseInspectorPage?: () => void;
}

/** Cascading Parent → Child Process Waterfall — Process Hierarchy–owned (single merged card). */
export function ProcessHierarchyTab({
  miniMapModel,
  effectiveScopeContext,
  selectedTelemetry,
  activeStageIndex,
  onSelectStage,
  onSelectTelemetry,
  onClearTelemetrySelection,
  onSelectNode,
  onExpandedNodeChange,
  onSelectInternalSubNode,
  onCloseInspectorPage,
}: ProcessHierarchyTabProps) {
  const scenario = effectiveScopeContext.scenario;

  return (
    <div
      data-testid="inspector-process-hierarchy-panel"
      className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-sm overflow-hidden"
    >
      <header className="px-5 py-4 border-b border-zinc-200/90 dark:border-zinc-800 space-y-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              <GitBranch className="w-3.5 h-3.5 shrink-0" />
              <span>Process Execution Hierarchy</span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-zinc-500 dark:text-zinc-400">
              {activeStageIndex > 0
                ? `STAGE S${activeStageIndex} / ${scenario.stages.length}`
                : `ALL ${scenario.stages.length} STAGES`}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white leading-snug">
            Cascading Parent ──▶ Child Process Waterfall
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Indented PPID → PID spawn tree. Stage pills highlight which
            processes are active; open Steps for each beat&apos;s narrative
            deep-dive.
          </p>
        </div>

        <div
          className="flex items-center gap-1.5 flex-wrap"
          aria-label="Stage Filter"
          data-testid="inspector-main-scenario-stage-card"
        >
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
              key={`hierarchy-stage-pill-${st.index}`}
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
      </header>

      {miniMapModel ? (
        <InspectorContextMiniMap
          miniMap={miniMapModel}
          scopeContext={effectiveScopeContext}
          selectedTelemetry={selectedTelemetry}
          filterStageIndex={activeStageIndex > 0 ? activeStageIndex : null}
          includeSections={{
            header: false,
            structuralBlueprint: false,
            cascadingProcess: true,
            cascadingProcessEmbedded: true,
            stateTransformation: false,
            topologyLinks: false,
          }}
          onSelectNode={(nodeId) => {
            onClearTelemetrySelection();
            onExpandedNodeChange?.(nodeId);
            onSelectNode?.(nodeId);
          }}
          onSelectInternalSubNode={(subNodeId) => {
            onClearTelemetrySelection();
            onSelectInternalSubNode?.(subNodeId);
          }}
          onSelectTelemetry={(ev) => {
            onSelectTelemetry(ev);
          }}
          onReturnToDiagram={() => onCloseInspectorPage?.()}
        />
      ) : (
        <div className="px-5 py-5 text-xs text-zinc-600 dark:text-zinc-400">
          No process hierarchy model is available for the current scope.
        </div>
      )}
    </div>
  );
}
