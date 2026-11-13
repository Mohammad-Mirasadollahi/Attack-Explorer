'use client';

import React from 'react';
import {
  AttackScenario,
  TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  ComputedStageView,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile } from '@/lib/simulation-engine';
import { buildBidirectionalTraceMeta } from '@/lib/sketch-zones-and-drilldown';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SequenceViewProps {
  scenario: AttackScenario;
  stageView: ComputedStageView;
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  activeEnvironment?: ActiveEnvironmentId;
}

export function SequenceView({
  scenario,
  stageView,
  selectedTelemetryId,
  onSelectTelemetry,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT }: SequenceViewProps) {
  const { currentStage, compromisedNodeIds } = stageView;
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  return (
    <div
      className="relative flex-1 w-full h-full overflow-auto p-6 bg-white dark:bg-[#09090B]"
      dir="ltr"
      data-testid="sequence-view"
      data-active-environment={activeEnvironment}
    >
      <div className="min-w-[720px] max-w-5xl mx-auto space-y-6">
        {/* Active Environment Architecture Banner */}
        <div
          data-testid="sequence-env-banner"
          className="flex flex-wrap items-center justify-between gap-3 min-w-0 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-xs"
        >
          <div className="flex flex-wrap items-center gap-2 font-mono min-w-0">
            <span
              title={envProfile.badgeLabel}
              className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10.5px] shrink-0"
            >
              {envProfile.badgeLabel}
            </span>
            <span
              title={envProfile.architectureHeadline}
              className="font-semibold text-zinc-800 dark:text-zinc-200 min-w-0 leading-snug break-words"
            >
              {envProfile.architectureHeadline}
            </span>
          </div>
          <span
            title={`${envProfile.environmentTag} · ${envProfile.primaryHostname} (${envProfile.subnetBadge})`}
            className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0 leading-snug"
          >
            {envProfile.environmentTag} · {envProfile.primaryHostname} (
            {envProfile.subnetBadge})
          </span>
        </div>

        {/* Clean Node Columns Header */}
        <div
          className="grid gap-3 pb-4 border-b border-zinc-200/90 dark:border-zinc-800 sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xs z-20 pt-2"
          style={{
            gridTemplateColumns: `repeat(${scenario.nodes.length}, minmax(130px, 1fr))` }}
        >
          {scenario.nodes.map((node, nIdx) => {
            const isCompromised = compromisedNodeIds.has(node.id);
            return (
              <div
                key={node.id}
                title={`Node ${nIdx + 1}: ${node.label} (${node.sublabel})`}
                className="flex flex-col items-center text-center px-2 space-y-1 min-w-0"
              >
                <span className="text-[10.5px] font-mono text-zinc-400 tabular-nums w-full">
                  Node {nIdx + 1}
                </span>
                <span
                  title={node.label}
                  className={`text-xs font-semibold leading-snug break-words w-full ${
                    isCompromised || node.role === 'attacker'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {node.label}
                </span>
                <span
                  title={node.sublabel}
                  className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums leading-snug break-words w-full"
                >
                  {node.sublabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stages & Bidirectional Sequence Rows */}
        <div className="relative space-y-8">
          {/* Subtle Vertical Lifelines */}
          <div
            className="absolute inset-0 grid pointer-events-none"
            style={{
              gridTemplateColumns: `repeat(${scenario.nodes.length}, minmax(130px, 1fr))` }}
          >
            {scenario.nodes.map((node) => (
              <div key={node.id} className="flex justify-center h-full">
                <div className="w-px h-full bg-zinc-200/70 dark:bg-zinc-800/70" />
              </div>
            ))}
          </div>

          {scenario.stages.map((st) => {
            const stageEvents = scenario.telemetry.filter(
              (t) => t.stageIndex === st.index
            );
            const isStageVisible =
              currentStage === null || st.index <= currentStage.index;
            const isCurrentStage =
              currentStage !== null && st.index === currentStage.index;

            return (
              <div
                key={st.index}
                className={`relative z-10 space-y-4 transition-opacity ${
                  isStageVisible ? 'opacity-100' : 'opacity-35'
                }`}
              >
                {/* Clean Stage Header */}
                <div
                  title={`Stage ${st.index} · ${st.title} (${st.mitreTechniqueId})`}
                  className={`flex items-center justify-between min-w-0 px-4 py-2 text-xs rounded-xl border ${
                    isCurrentStage
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 font-semibold'
                      : 'bg-zinc-50/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800'
                  }`}
                >
                  <span className="font-mono min-w-0 leading-snug break-words">
                    Stage {st.index} · {st.title} ({st.mitreTechniqueId})
                  </span>
                </div>

                {/* Clean Sequence Cards */}
                <div className="space-y-4">
                  {stageEvents.map((ev) => {
                    const globalIdx = scenario.telemetry.findIndex(
                      (t) => t.id === ev.id
                    );
                    const nextEv = scenario.telemetry[globalIdx + 1];
                    const traceMeta = buildBidirectionalTraceMeta(ev, nextEv);

                    const srcIdx = Math.max(
                      0,
                      scenario.nodes.findIndex((n) => n.id === ev.sourceNodeId)
                    );
                    const dstIdx = Math.max(
                      0,
                      scenario.nodes.findIndex((n) => n.id === ev.targetNodeId)
                    );
                    const totalCols = scenario.nodes.length;
                    const leftCol = Math.min(srcIdx, dstIdx);
                    const rightCol = Math.max(srcIdx, dstIdx);
                    const isLeftToRight = srcIdx <= dstIdx;

                    const leftPct = ((leftCol + 0.5) / totalCols) * 100;
                    const widthPct =
                      Math.max(0.5, rightCol - leftCol) * (100 / totalCols);
                    const isSelected = selectedTelemetryId === ev.id;

                    return (
                      <div
                        key={ev.id}
                        data-testid={`sequence-trace-row-${ev.no}`}
                        onClick={() => onSelectTelemetry(ev)}
                        className="relative cursor-pointer group"
                      >
                        <div
                          style={{
                            marginLeft: `${leftPct}%`,
                            width: `${widthPct}%` }}
                          className={`relative flex flex-col min-w-[200px] sm:min-w-[260px] p-3.5 rounded-xl border transition-all space-y-2.5 ${
                            isSelected
                              ? 'bg-white dark:bg-zinc-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                              : 'bg-white/95 dark:bg-zinc-900/95 border-zinc-200/90 dark:border-zinc-800 group-hover:border-zinc-400 dark:group-hover:border-zinc-700'
                          }`}
                        >
                          {/* Request Row */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 text-xs font-mono">
                              <span
                                title={`#${traceMeta.forwardSeq} ${ev.shortAction}`}
                                className="inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400 min-w-0 leading-snug"
                              >
                                <span className="shrink-0">#{traceMeta.forwardSeq}</span>
                                {isLeftToRight ? (
                                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                                )}
                                <span className="break-words">{ev.shortAction}</span>
                              </span>
                              <span
                                title={`${ev.protocolOrEventId} · ${ev.timestamp}`}
                                className="text-[11px] text-zinc-400 tabular-nums shrink-0 leading-snug"
                              >
                                {ev.protocolOrEventId} · {ev.timestamp}
                              </span>
                            </div>

                            <div className="h-0.5 w-full bg-rose-500/70 rounded-full" />

                            <div
                              title={ev.info}
                              className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 break-words leading-snug"
                            >
                              {ev.info}
                            </div>
                          </div>

                          {/* Response Row */}
                          <div className="pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 min-w-0 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                            <span
                              title={`#${traceMeta.returnSeq} ${traceMeta.returnLabel}`}
                              className="inline-flex items-center gap-1.5 font-medium min-w-0 leading-snug"
                            >
                              <span className="shrink-0">#{traceMeta.returnSeq}</span>
                              {isLeftToRight ? (
                                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                              ) : (
                                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span className="break-words">{traceMeta.returnLabel}</span>
                            </span>
                            <span
                              title={`${ev.targetLabel} ⇠ ${ev.sourceLabel}`}
                              className="text-zinc-400 shrink-0 leading-snug"
                            >
                              {ev.targetLabel} ⇠ {ev.sourceLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
