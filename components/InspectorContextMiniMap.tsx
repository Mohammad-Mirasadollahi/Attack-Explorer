'use client';

import React, { useMemo } from 'react';
import {
  ArrowRight,
  Compass,
  Cpu,
  ExternalLink,
  GitBranch,
  Layers,
  Network,
  ShieldAlert,
  Terminal,
  Workflow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  InspectorMiniMapModel,
  InspectorScopeContext,
} from '@/lib/inspector-scope';
import { TelemetryEvent } from '@/lib/attack-scenarios';
import { SketchNodeIcon } from './SketchNodeIcons';
import {
  buildDocumentationArchitectureBlueprint,
  CascadingProcessWaterfallNode,
} from '@/lib/documentation-structural-diagrams';

export interface InspectorContextMiniMapProps {
  miniMap?: InspectorMiniMapModel | null;
  scopeContext: InspectorScopeContext;
  selectedTelemetry?: TelemetryEvent | null;
  filterStageIndex?: number | null;
  onSelectNode?: (nodeId: string | null) => void;
  onSelectMainNode?: (nodeId: string | null) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onSelectInternalNode?: (subNodeId: string | null) => void;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
  onReturnToDiagram?: () => void;
}

const TONE_STYLES: Record<
  'rose' | 'amber' | 'indigo' | 'emerald' | 'violet' | 'cyan',
  {
    border: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
    accentText: string;
  }
> = {
  rose: {
    border: 'border-rose-300 dark:border-rose-500/40',
    bg: 'bg-rose-50/50 dark:bg-rose-950/20',
    badgeBg: 'bg-rose-600 text-white',
    badgeText: 'text-rose-700 dark:text-rose-300',
    accentText: 'text-rose-600 dark:text-rose-400',
  },
  amber: {
    border: 'border-amber-300 dark:border-amber-500/40',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    badgeBg: 'bg-amber-600 text-white',
    badgeText: 'text-amber-700 dark:text-amber-300',
    accentText: 'text-amber-600 dark:text-amber-400',
  },
  indigo: {
    border: 'border-indigo-300 dark:border-indigo-500/40',
    bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
    badgeBg: 'bg-indigo-600 text-white',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    accentText: 'text-indigo-600 dark:text-indigo-400',
  },
  emerald: {
    border: 'border-emerald-300 dark:border-emerald-500/40',
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    accentText: 'text-emerald-600 dark:text-emerald-400',
  },
  violet: {
    border: 'border-violet-300 dark:border-violet-500/40',
    bg: 'bg-violet-50/50 dark:bg-violet-950/20',
    badgeBg: 'bg-violet-600 text-white',
    badgeText: 'text-violet-700 dark:text-violet-300',
    accentText: 'text-violet-600 dark:text-violet-400',
  },
  cyan: {
    border: 'border-cyan-300 dark:border-cyan-500/40',
    bg: 'bg-cyan-50/50 dark:bg-cyan-950/20',
    badgeBg: 'bg-cyan-600 text-white',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    accentText: 'text-cyan-600 dark:text-cyan-400',
  },
};

function getProcessStatusStyle(
  status: CascadingProcessWaterfallNode['process']['status']
) {
  switch (status) {
    case 'hollowed':
      return {
        badge:
          'bg-purple-600 text-white border-purple-700 dark:bg-purple-500 dark:border-purple-400',
        card: 'border-purple-300 dark:border-purple-500/45 bg-purple-50/40 dark:bg-purple-950/20',
        label: 'HOLLOWED IMAGE',
      };
    case 'injected':
      return {
        badge:
          'bg-violet-600 text-white border-violet-700 dark:bg-violet-500 dark:border-violet-400',
        card: 'border-violet-300 dark:border-violet-500/45 bg-violet-50/40 dark:bg-violet-950/20',
        label: 'INJECTED MEMORY',
      };
    case 'malicious':
      return {
        badge:
          'bg-rose-600 text-white border-rose-700 dark:bg-rose-500 dark:border-rose-400',
        card: 'border-rose-300 dark:border-rose-500/45 bg-rose-50/40 dark:bg-rose-950/20',
        label: 'MALICIOUS EXEC',
      };
    case 'suspicious':
      return {
        badge:
          'bg-amber-600 text-white border-amber-700 dark:bg-amber-500 dark:border-amber-400',
        card: 'border-amber-300 dark:border-amber-500/45 bg-amber-50/40 dark:bg-amber-950/20',
        label: 'SUSPICIOUS STAGE',
      };
    default:
      return {
        badge:
          'bg-slate-700 text-white border-slate-800 dark:bg-slate-700 dark:border-slate-600',
        card: 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90',
        label: 'HOST PARENT',
      };
  }
}

export const InspectorContextMiniMap: React.FC<
  InspectorContextMiniMapProps
> = ({
  miniMap,
  scopeContext,
  selectedTelemetry,
  filterStageIndex = null,
  onSelectNode,
  onSelectMainNode,
  onSelectInternalSubNode,
  onSelectInternalNode,
  onSelectTelemetry,
  onReturnToDiagram,
}) => {
  const handleSelectNode = onSelectNode || onSelectMainNode;
  const handleSelectSubNode = onSelectInternalSubNode || onSelectInternalNode;

  const {
    schematic,
    selectedMainNode,
    expandedParentNode,
    focusedInternalSubNode,
    internalSubBoard,
    selectedMainNodeSubBoard,
    scenario,
  } = scopeContext;

  const effectiveStageFilter =
    filterStageIndex !== null
      ? filterStageIndex
      : scopeContext.activeStageIndex > 0
        ? scopeContext.activeStageIndex
        : null;

  const blueprint = useMemo(
    () =>
      buildDocumentationArchitectureBlueprint(
        scopeContext,
        effectiveStageFilter
      ),
    [scopeContext, effectiveStageFilter]
  );

  const focusedNode =
    scopeContext.effectiveScope === 'INTERNAL_SUBNODE' &&
    focusedInternalSubNode
      ? focusedInternalSubNode
      : scopeContext.effectiveScope === 'EXPANDED_NODE' && expandedParentNode
        ? expandedParentNode
        : selectedMainNode || miniMap?.primaryNode || null;

  const focusedNodeId = focusedNode?.id || null;
  const activeSubBoard = internalSubBoard || selectedMainNodeSubBoard || null;

  const activeStageObj = useMemo(() => {
    if (effectiveStageFilter === null || effectiveStageFilter === 0) {
      return null;
    }
    return (
      scenario.stages.find((s) => s.index === effectiveStageFilter) ||
      scenario.stages[effectiveStageFilter - 1] ||
      null
    );
  }, [scenario.stages, effectiveStageFilter]);

  const connectionArms = useMemo(() => {
    if (miniMap && miniMap.connectionArms.length > 0) {
      return miniMap.connectionArms;
    }
    const flows = schematic?.flows || [];
    const nodes = schematic?.nodes || [];
    const byId = new Map(nodes.map((n) => [n.id, n]));
    if (focusedNode) {
      return flows
        .filter(
          (fl) =>
            fl.fromNodeId === focusedNode.id || fl.toNodeId === focusedNode.id
        )
        .map((fl) => {
          const isOutbound = fl.fromNodeId === focusedNode.id;
          const neighbor =
            byId.get(isOutbound ? fl.toNodeId : fl.fromNodeId) || focusedNode;
          return {
            flow: fl,
            direction: (isOutbound ? 'OUTBOUND' : 'INBOUND') as
              | 'OUTBOUND'
              | 'INBOUND'
              | 'ACTIVE_STAGE',
            neighborNode: neighbor,
          };
        });
    }
    return flows.map((fl) => ({
      flow: fl,
      direction: 'ACTIVE_STAGE' as const,
      neighborNode: byId.get(fl.toNodeId) || nodes[0],
    }));
  }, [miniMap, schematic, focusedNode]);

  return (
    <div
      data-testid="inspector-context-minimap"
      className="rounded-2xl border border-indigo-200/80 dark:border-indigo-500/30 bg-white dark:bg-zinc-900/95 overflow-hidden shadow-sm space-y-0"
    >
      {/* 1. Documentation Blueprint Header Bar */}
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
                {miniMap?.stageBadge ||
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
              onClick={() => handleSelectNode?.(null)}
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

      {/* 2. Four-Tier Scenario Structural Architecture Blueprint */}
      <div
        data-testid="documentation-structural-blueprint-grid"
        className="p-4 sm:p-5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 space-y-3"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Structural Architecture Pipeline — {blueprint.archetypeTitle}
            </h4>
          </div>
          <span className="text-[10.5px] font-mono font-semibold text-zinc-500 dark:text-zinc-400">
            Page-Native Structural Flow · {scenario.code}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {blueprint.layers.map((layer, index) => {
            const tone = TONE_STYLES[layer.accentTone];
            const isLast = index === blueprint.layers.length - 1;
            return (
              <div
                key={layer.id}
                onClick={() => {
                  if (layer.linkedNodeId) {
                    handleSelectNode?.(layer.linkedNodeId);
                  }
                }}
                className={cn(
                  'rounded-xl border p-3.5 flex flex-col justify-between gap-2.5 relative transition-all cursor-pointer hover:shadow-xs',
                  tone.border,
                  tone.bg
                )}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[9.5px] font-mono font-extrabold uppercase tracking-wider',
                        tone.badgeBg
                      )}
                    >
                      {layer.tierRoleLabel}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono font-extrabold text-zinc-800 dark:text-zinc-200">
                      {layer.nodeNumberBadge} · {layer.stageRef}
                    </span>
                  </div>

                  <div className="text-[13px] font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                    {layer.primaryTitle}
                  </div>
                  <div
                    className={cn(
                      'text-[11px] font-mono font-semibold leading-snug break-words',
                      tone.badgeText
                    )}
                  >
                    {layer.technicalContext}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  {layer.keyArtifacts.map((art, aIdx) => (
                    <div
                      key={aIdx}
                      className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 px-2 py-1 rounded border border-zinc-200/70 dark:border-zinc-800/70 leading-snug break-words"
                    >
                      {art}
                    </div>
                  ))}
                </div>

                {!isLast && (
                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                    <span className="leading-snug break-words">
                      Next: {layer.transitionArrowLabel}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Cascading Process Lineage Waterfall (حالت آبشاری) & Structural State Transformation */}
      <div className="p-4 sm:p-5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/30 grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left/Main 7 Cols: Cascading Process Lineage Waterfall (حالت آبشاری) */}
        <div
          data-testid="documentation-cascading-process-waterfall"
          className="xl:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3"
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
              {blueprint.cascadingProcesses.length} Process Nodes
            </span>
          </div>

          <div className="space-y-2.5">
            {blueprint.cascadingProcesses.map((node) => {
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
                    !node.isHighlightedInStage && 'opacity-65'
                  )}
                >
                  {/* Waterfall Step Connector Bar for Child Processes */}
                  {node.depth > 0 && (
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      <span className="inline-block w-3.5 h-3 border-l-2 border-b-2 border-indigo-400 dark:border-indigo-500 rounded-bl-sm" />
                      <span className="leading-snug break-words">
                        SPAWNED CHILD OF {node.parentName} (PPID{' '}
                        {node.parentPid} ──▶ PID {node.process.pid})
                      </span>
                    </div>
                  )}

                  <div
                    className={cn(
                      'rounded-xl border p-3 space-y-2 shadow-2xs',
                      style.card
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

                    {/* Command Line */}
                    <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-snug break-words border border-zinc-800">
                      <span className="text-zinc-500 select-none mr-1.5">
                        $
                      </span>
                      {node.process.commandLine}
                    </div>

                    {/* Syscall / API Call Chain + Memory Summary */}
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
        </div>

        {/* Right 5 Cols: Structural State Transformation Card (Before -> Mutation -> After) */}
        <div
          data-testid="documentation-state-transformation-card"
          className="xl:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col justify-between gap-3"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-6 h-6 rounded-md bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                  {blueprint.stateTransformation.title}
                </h4>
                <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                  Before-and-after structural state differential
                </p>
              </div>
            </div>

            {/* Baseline / Before State */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 p-3 space-y-1.5">
              <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                1. {blueprint.stateTransformation.beforeLabel}
              </div>
              {blueprint.stateTransformation.beforeSpecs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 leading-snug break-words"
                >
                  • {spec}
                </div>
              ))}
            </div>

            {/* Mutation Operator Bridge */}
            <div className="rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/25 p-2.5 flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  2. STRUCTURAL MUTATION / EXPLOIT OPERATOR
                </div>
                <div className="text-[11.5px] font-mono font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                  {blueprint.stateTransformation.mutationOperator}
                </div>
              </div>
            </div>

            {/* Post-Mutation / Compromised State */}
            <div className="rounded-lg border border-rose-300 dark:border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20 p-3 space-y-1.5">
              <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                3. {blueprint.stateTransformation.afterLabel}
              </div>
              {blueprint.stateTransformation.afterSpecs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="text-[11px] font-mono text-zinc-800 dark:text-zinc-200 leading-snug break-words"
                >
                  • {spec}
                </div>
              ))}
            </div>
          </div>

          {/* SIEM / Sensor Catch */}
          <div className="rounded-lg border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/25 p-2.5 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                4. VERIFIED SIEM / EDR DETECTION CATCH
              </div>
              <div className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                {blueprint.stateTransformation.detectionSignal}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Focused Section & Connected Neighbors Conduit (Zero-Overlap Documentation Grid) */}
      <div className="p-4 sm:p-5 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Network className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
              {focusedNode
                ? `Focused Section & Neighbor Links — #${focusedNode.chainOrder} ${focusedNode.label}`
                : `Interactive Topology Sections & Connected Links (${schematic.nodes.length} Sections)`}
            </span>
          </div>
          <span className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400">
            Click any section or link to scope all explanations & telemetry
          </span>
        </div>

        {focusedNode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            {/* Active Focused Section Card */}
            <div
              data-testid="minimap-focused-node-card"
              className="lg:col-span-5 rounded-xl border-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-zinc-900 p-3.5 shadow-sm flex flex-col justify-between gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-mono font-extrabold uppercase tracking-wider leading-snug break-words">
                  ACTIVE FOCUS · #{focusedNode.sequenceCode || focusedNode.chainOrder} ·{' '}
                  {focusedNode.actionBadge}
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                  {focusedNode.zoneLabel || focusedNode.zoneId}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-12 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 p-1">
                  <SketchNodeIcon
                    iconType={focusedNode.iconType}
                    isActive={focusedNode.isActive}
                    isCompromised={focusedNode.isCompromised}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                    {focusedNode.label}
                  </div>
                  <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 leading-snug break-words mt-0.5">
                    {focusedNode.sublabel}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug break-words pt-1 border-t border-zinc-100 dark:border-zinc-800">
                {focusedNode.activitySummary || focusedNode.internalSummary}
              </p>
            </div>

            {/* Connected Links & Neighbor Conduit */}
            <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-3.5 flex flex-col justify-between gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-rose-500" />
                  Connected Links & Neighbors ({connectionArms.length})
                </span>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  Click to Inspect Neighbor or Packet
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {connectionArms.slice(0, 6).map((arm) => {
                  const isInbound = arm.direction === 'INBOUND';
                  const isSelected =
                    selectedTelemetry?.id === arm.flow.telemetryEvent.id;
                  return (
                    <button
                      key={arm.flow.id}
                      type="button"
                      onClick={() => {
                        if (onSelectTelemetry) {
                          onSelectTelemetry(arm.flow.telemetryEvent);
                        } else {
                          handleSelectNode?.(arm.neighborNode.id);
                        }
                      }}
                      data-testid={`minimap-arm-chip-${arm.flow.id}`}
                      className={cn(
                        'text-left p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1',
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500/40'
                          : isInbound
                            ? 'bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-300 dark:bg-emerald-950/25 dark:hover:bg-emerald-950/45 dark:border-emerald-500/40'
                            : 'bg-rose-50/60 hover:bg-rose-100/70 border-rose-300 dark:bg-rose-950/25 dark:hover:bg-rose-950/45 dark:border-rose-500/40'
                      )}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold',
                            isInbound
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                          )}
                        >
                          #{arm.flow.sequenceCode} · STAGE S{arm.flow.stageIndex}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                          {isInbound ? '⇠ INBOUND' : '──▶ OUTBOUND'}
                        </span>
                      </div>
                      <div className="text-[12px] font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                        #{arm.neighborNode.chainOrder} {arm.neighborNode.label}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 leading-snug break-words">
                        {arm.flow.label} ({arm.flow.protocolBadge})
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Full Scenario Non-Overlapping Connected Links Strip */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {connectionArms.slice(0, 6).map((arm) => (
              <button
                key={arm.flow.id}
                type="button"
                onClick={() => handleSelectNode?.(arm.neighborNode.id)}
                data-testid={`minimap-arm-chip-${arm.flow.id}`}
                className="text-left p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 transition-all cursor-pointer flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono font-extrabold">
                    #{arm.flow.sequenceCode} ──▶ #{arm.neighborNode.chainOrder}{' '}
                    {arm.neighborNode.label}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-zinc-500">
                    S{arm.flow.stageIndex}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 leading-snug break-words">
                  {arm.flow.label} ({arm.flow.protocolBadge})
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Internal Sub-Board Strip when a Node has Internal Sub-Nodes */}
        {activeSubBoard && activeSubBoard.subNodes.length > 0 && (
          <div
            data-testid="minimap-internal-subnode-strip"
            className="pt-2.5 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                INTERNAL SUB-COMPONENTS INSIDE {focusedNode?.label || 'HOST'} (
                {activeSubBoard.subNodes.length})
              </span>
              {focusedInternalSubNode && (
                <button
                  type="button"
                  onClick={() => handleSelectSubNode?.(null)}
                  className="text-[10px] font-mono font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
                >
                  Reset to Whole Host
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {activeSubBoard.subNodes.map((sn, idx) => {
                const isSelectedSub = focusedInternalSubNode?.id === sn.id;
                return (
                  <button
                    key={sn.id}
                    type="button"
                    onClick={() =>
                      handleSelectSubNode?.(isSelectedSub ? null : sn.id)
                    }
                    data-testid={`minimap-subnode-pill-${sn.id}`}
                    className={cn(
                      'text-left p-2 rounded-lg border transition-all cursor-pointer',
                      isSelectedSub
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                        : 'bg-white hover:bg-indigo-50/60 dark:bg-zinc-900 dark:hover:bg-indigo-950/30 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
                    )}
                  >
                    <div className="text-[10px] font-mono font-extrabold uppercase opacity-80">
                      SUB-NODE {idx + 1} · {sn.actionBadge}
                    </div>
                    <div className="text-[11.5px] font-bold leading-snug break-words mt-0.5">
                      {sn.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Section Switcher Bar */}
        <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mr-1">
            All Sections:
          </span>
          {schematic.nodes.map((node) => {
            const isFocused = node.id === focusedNodeId;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => handleSelectNode?.(node.id)}
                data-testid={`minimap-switch-node-${node.id}`}
                className={cn(
                  'px-2 py-0.5 rounded text-[10.5px] font-mono font-bold transition-all cursor-pointer leading-snug break-words',
                  isFocused
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-800'
                )}
              >
                #{node.chainOrder} {node.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
