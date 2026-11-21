'use client';

import React from 'react';
import {
  Activity,
  ArrowRight,
  Cpu,
  Layers,
  ListChecks,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { AttackScenario, TelemetryEvent } from '@/lib/attack-scenarios';
import type { InspectorScopeContext, InspectorScopeMode } from '@/lib/inspector-scope';
import { getRawScenarioStepGuide } from '@/lib/scenario-step-guides';
import { hasSection3DScene } from '@/lib/section-3d-registry';
import { SketchNodeIcon } from '../../SketchNodeIcons';
import { StandardStoryTechnicalSection } from '../../StandardStoryTechnicalSection';
import type { InspectorTab } from '../types';

export interface OverviewTabProps {
  scenario: AttackScenario;
  pageTitle: string;
  activeStageIndex: number;
  effectiveScope: InspectorScopeMode;
  effectiveScopeContext: InspectorScopeContext;
  scopeContext?: InspectorScopeContext;
  isInspectingSpecificMainNode: boolean;
  selectedTelemetry: TelemetryEvent | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  onSelectStage: (stageIndex: number) => void;
  onSelectNode?: (nodeId: string | null) => void;
  onExpandedNodeChange?: (nodeId: string | null) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onStartWalkthrough?: () => void;
  onCloseInspectorPage?: () => void;
  onSelectTab: (tab: InspectorTab) => void;
}

export function OverviewTab({
  scenario,
  pageTitle,
  activeStageIndex,
  effectiveScope,
  effectiveScopeContext,
  scopeContext,
  isInspectingSpecificMainNode,
  selectedTelemetry,
  onSelectTelemetry,
  onSelectStage,
  onSelectNode,
  onExpandedNodeChange,
  onSelectInternalSubNode,
  onStartWalkthrough,
  onCloseInspectorPage,
  onSelectTab,
}: OverviewTabProps) {
  const handleSelectTab = onSelectTab;
  const showScopedTitleCard =
    isInspectingSpecificMainNode || effectiveScope !== 'MAIN_SCENARIO';

  return (
    <div className="flex flex-col gap-5">
                  {/* Scoped Overview title card only for node / sub-board views.
                      Main-scenario Overview merges title into the story card below. */}
                  {showScopedTitleCard && (
                    <section
                      data-testid="inspector-overview-title-card"
                      className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 px-5 py-4 shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          data-testid="inspector-scope-badge"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 font-mono text-[10.5px] font-bold"
                        >
                          <Layers className="w-3 h-3 shrink-0" />
                          <span>
                            {effectiveScopeContext.scopeBadgeLabel ||
                              `SCENARIO · ${scenario.code}`}
                          </span>
                        </span>

                        <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[10.5px] font-semibold">
                          {`All ${scenario.stages.length} Stages`}
                        </span>
                      </div>

                      <h2
                        data-testid="inspector-scope-title"
                        className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white leading-snug break-words"
                      >
                        {pageTitle}
                      </h2>
                    </section>
                  )}
                  {/* No Stage Filter, Memory callout, Cascading Process, or VAD grids on Overview. */}

                  {/* CASE A: Clicked Main Topology Node Dedicated Page (`selectedMainNode`) */}
                  {isInspectingSpecificMainNode && scopeContext?.selectedMainNode ? (
                    <div
                      data-testid="inspector-selected-main-node-view"
                      className="flex flex-col gap-5"
                    >
                      {/* 1. Executive Story-to-Spec Analogy & Section Explanation */}
                      <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            <Sparkles className="w-4 h-4" />
                            <span>
                              Complete Section Explanation · Node #
                              {scopeContext.selectedMainNode.chainOrder}
                            </span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
                            {scopeContext.selectedMainNode.actionBadge}
                          </span>
                        </div>
    
                        <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white leading-snug">
                          {scopeContext.selectedMainNode.label} —{' '}
                          {scopeContext.selectedMainNode.sublabel}
                        </h2>
    
                        {scopeContext.selectedMainNode.hostContext && (
                          <div className="px-3 py-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/70 text-xs font-mono text-sky-900 dark:text-sky-200">
                            {scopeContext.selectedMainNode.hostContext}
                          </div>
                        )}
    
                        {scopeContext.selectedMainNodeStoryAnalogy && (
                          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/60 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-1">
                            <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 shrink-0" />
                              <span>Plain-English Story-to-Spec Analogy</span>
                            </div>
                            <p className="text-xs sm:text-[13px] leading-relaxed">
                              {scopeContext.selectedMainNodeStoryAnalogy}
                            </p>
                          </div>
                        )}
    
                        <div className="space-y-1">
                          <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Technical Forensic Role
                          </div>
                          <p
                            data-testid="inspector-scoped-story-analogy"
                            className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed"
                          >
                            {scopeContext.selectedMainNode.activitySummary ||
                              scopeContext.selectedMainNode.internalSummary}
                          </p>
                        </div>
                      </section>
    
                      {/* 2. Connected Inbound & Outbound Telemetry Arms */}
                      <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Network className="w-4 h-4 text-rose-500" />
                            <span>
                              Connected Network & Process Links (
                              {scopeContext.selectedMainNodeConnectedFlows.length})
                            </span>
                          </h3>
                          <span className="text-[11px] font-mono text-zinc-500">
                            Click any link to inspect raw packet telemetry
                          </span>
                        </div>
    
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {scopeContext.selectedMainNodeConnectedFlows.map((fl) => {
                            const isOutbound =
                              fl.fromNodeId === scopeContext.selectedMainNode?.id;
                            const isSelected =
                              selectedTelemetry?.id === fl.telemetryEvent.id;
                            return (
                              <div
                                key={fl.id}
                                data-testid={`inspector-connected-flow-card-${fl.stepNo}`}
                                onClick={() => onSelectTelemetry(fl.telemetryEvent)}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                                  isSelected
                                    ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/30'
                                    : 'bg-zinc-50/70 dark:bg-zinc-950/50 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800'
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-extrabold text-white ${
                                        isOutbound ? 'bg-rose-600' : 'bg-amber-600'
                                      }`}
                                    >
                                      STEP #{fl.stepNo} ·{' '}
                                      {isOutbound ? 'OUTBOUND' : 'INBOUND'}
                                    </span>
                                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                      {fl.label}
                                    </span>
                                  </div>
                                  <span className="px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 font-mono text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                                    {fl.protocolBadge &&
                                    fl.protocolBadge !==
                                      fl.telemetryEvent.protocolOrEventId
                                      ? `${fl.telemetryEvent.protocolOrEventId} · ${fl.protocolBadge}`
                                      : fl.telemetryEvent.protocolOrEventId}
                                  </span>
                                </div>
    
                                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                  {fl.telemetryEvent.info}
                                </p>
    
                                {fl.telemetryEvent.detectionRule && (
                                  <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                    <span>
                                      Detection Rule ({fl.telemetryEvent.detectionRule.type}
                                      ): {fl.telemetryEvent.detectionRule.title}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </section>
    
                      {/* 3. Internal Pipeline Sub-Nodes & Operations Inside This Node */}
                      {scopeContext.selectedMainNodeSubBoard && (
                        <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                <Cpu className="w-4 h-4" />
                                <span>
                                  Internal Architecture & Sub-Components (
                                  {
                                    scopeContext.selectedMainNodeSubBoard.subNodes
                                      .length
                                  }{' '}
                                  Sub-Nodes)
                                </span>
                              </h3>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {
                                  scopeContext.selectedMainNodeSubBoard
                                    .environmentBreadcrumb
                                }
                              </p>
                            </div>
                          </div>
    
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {scopeContext.selectedMainNodeSubBoard.subNodes.map(
                              (subNode) => (
                                <div
                                  key={subNode.id}
                                  className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-1.5"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="px-1.5 py-0.5 rounded bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                                      #{subNode.chainOrder} · {subNode.actionBadge}
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-500">
                                      {subNode.sublabel}
                                    </span>
                                  </div>
                                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                                    {subNode.label}
                                  </div>
                                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                    {subNode.internalSummary}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </section>
                      )}
                    </div>
                  ) : effectiveScope !== 'MAIN_SCENARIO' &&
                    scopeContext?.internalSubBoard &&
                    scopeContext?.expandedParentNode ? (
                    /* CASE B: Expanded Sub-Board (`EXPANDED_NODE`) or Internal Sub-Node (`INTERNAL_SUBNODE`) */
                    <div
                      data-testid={
                        effectiveScope === 'INTERNAL_SUBNODE'
                          ? 'internal-subnode-scoped-overview'
                          : 'expanded-node-scoped-overview'
                      }
                      className="flex flex-col gap-5"
                    >
                      <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {scopeContext.scopeBadgeLabel}
                          </span>
                          <span className="text-xs font-mono text-zinc-500">
                            Parent Host/Process: {scopeContext.expandedParentNode.label}
                          </span>
                        </div>
                        <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white">
                          {scopeContext.scopeTitle}
                        </h2>
                        <p
                          data-testid="inspector-scoped-story-analogy"
                          className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed"
                        >
                          {scopeContext.scopedStoryAnalogy}
                        </p>
                      </section>
    
                      {/* Internal Sub-Nodes Switcher Grid */}
                      <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                          Internal Pipeline Sub-Nodes (
                          {scopeContext.internalSubBoard.subNodes.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {scopeContext.internalSubBoard.subNodes.map((sn) => {
                            const isFocused =
                              scopeContext.focusedInternalSubNode?.id === sn.id;
                            return (
                              <button
                                key={sn.id}
                                type="button"
                                data-testid={`inspector-subnode-card-${sn.id}`}
                                onClick={() => onSelectInternalSubNode?.(sn.id)}
                                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                                  isFocused
                                    ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500/30'
                                    : 'bg-zinc-50/80 dark:bg-zinc-950/60 border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px] font-bold">
                                    #{sn.chainOrder} · {sn.actionBadge}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-500">
                                    {sn.sublabel}
                                  </span>
                                </div>
                                <div className="mt-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                                  {sn.label}
                                </div>
                                <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                  {sn.internalSummary}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </section>
    
                      {/* Scoped Internal Step-by-Step Operations */}
                      <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                          Internal Telemetry Steps (
                          {scopeContext.internalSteps.length})
                        </h3>
                        <div className="space-y-2.5">
                          {scopeContext.internalSteps.map((st) => (
                            <div
                              key={st.flow.id}
                              onClick={() => onSelectTelemetry(st.telemetryEvent)}
                              className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400 transition-colors cursor-pointer space-y-1.5"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                  #{st.sequenceCode} · {st.title}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 font-mono text-[10px]">
                                  {st.fromSubNode?.label || st.flow.fromNodeId} →{' '}
                                  {st.toSubNode?.label || st.flow.toNodeId}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {st.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  ) : (
                    /* CASE C: Full Main Scenario Page Explanation (`MAIN_SCENARIO`) */
                    (() => {
                      const mainScenarioOverviewContent = (
                        <div
                          data-testid="inspector-main-scenario-overview"
                          className="flex flex-col gap-5"
                        >
                          {/* 1. Merged title + Story-to-Spec (single card — no duplicate title strip) */}
                          <section
                            data-testid="inspector-overview-title-card"
                            className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-4"
                          >
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  data-testid="inspector-scope-badge"
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 font-mono text-[10.5px] font-bold"
                                >
                                  <Layers className="w-3 h-3 shrink-0" />
                                  <span>
                                    {effectiveScopeContext.scopeBadgeLabel ||
                                      `SCENARIO · ${scenario.code}`}
                                  </span>
                                </span>
                                <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[10.5px] font-semibold">
                                  {`All ${scenario.stages.length} Stages`}
                                </span>
                              </div>
                              <h2
                                data-testid="inspector-scope-title"
                                className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white leading-snug break-words"
                              >
                                {pageTitle}
                              </h2>
                            </div>

                            {(() => {
                              const rawBriefingGuide = getRawScenarioStepGuide(
                                scenario.id
                              );
                              return (
                                <StandardStoryTechnicalSection
                                  scenarioId={scenario.id}
                                  sectionKey={
                                    hasSection3DScene(scenario.id, 'briefing')
                                      ? 'briefing'
                                      : null
                                  }
                                  storyHeading="Story-to-Spec Analogy & Executive Summary"
                                  storyAnalogy={
                                    rawBriefingGuide?.briefing.storyAnalogy ||
                                    effectiveScopeContext.scopedStoryAnalogy ||
                                    scenario.overview
                                  }
                                  storyMappings={
                                    rawBriefingGuide?.briefing.storyMappings
                                  }
                                  technicalHeading="Technical Overview"
                                  technicalText={
                                    rawBriefingGuide?.briefing.plainSummary ||
                                    scenario.overview
                                  }
                                  clausePrefix="0"
                                />
                              );
                            })()}
                          </section>
    
                      {/* 2. Interactive Topology Sections Directory */}
                      <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-indigo-500" />
                            <span>
                              Diagram Topology Sections (
                              {effectiveScopeContext.schematic.nodes.length} Nodes)
                            </span>
                          </h3>
                          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                            Click any section to expand its dedicated pipeline page
                          </span>
                        </div>
    
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {effectiveScopeContext.schematic.nodes.map((node) => (
                            <button
                              key={node.id}
                              type="button"
                              data-testid={`inspector-directory-node-${node.id}`}
                              onClick={() => {
                                onExpandedNodeChange?.(node.id);
                                onSelectNode?.(node.id);
                              }}
                              className="text-left p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400 transition-all cursor-pointer flex items-start gap-3"
                            >
                              <div className="w-12 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1 shrink-0">
                                <SketchNodeIcon
                                  iconType={node.iconType}
                                  isActive={node.isActive}
                                  isCompromised={node.isCompromised}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9.5px] font-bold">
                                    #{node.chainOrder} · {node.actionBadge}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-400">
                                    {node.zoneLabel || node.zoneId}
                                  </span>
                                </div>
                                <div className="mt-1 text-xs font-bold text-zinc-900 dark:text-white leading-snug">
                                  {node.label}
                                </div>
                                <p className="mt-0.5 text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-snug">
                                  {node.activitySummary || node.internalSummary}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </section>
    
                      {/* 3. Compact Steps roadmap only — full stage deep-dives live on Steps tab */}
                      <section
                        data-testid="inspector-overview-steps-roadmap"
                        className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-4"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-rose-500" />
                            <span>
                              What later sections examine ({scenario.stages.length}{' '}
                              Steps)
                            </span>
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              data-testid="inspector-overview-open-steps-btn"
                              onClick={() => handleSelectTab('STEP_GUIDE')}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <ListChecks className="w-3 h-3" />
                              <span>Open Step-by-Step Guide</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            {onStartWalkthrough && (
                              <button
                                type="button"
                                onClick={() => {
                                  onStartWalkthrough();
                                  onCloseInspectorPage?.();
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Play className="w-3 h-3" />
                                <span>Play Guided Walkthrough</span>
                              </button>
                            )}
                          </div>
                        </div>
    
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Overview stays at roadmap altitude. Use Steps, Process
                          Hierarchy, and Memory for deep-dives — nothing else is
                          repeated here.
                        </p>
    
                        <div className="space-y-2">
                          {scenario.stages.map((st) => {
                            const isCurrent = activeStageIndex === st.index;
                            const rawStep = getRawScenarioStepGuide(
                              scenario.id
                            )?.steps.find((s) => s.stepNumber === st.index);
                            return (
                              <button
                                key={`overview-roadmap-stage-${st.index}`}
                                type="button"
                                data-testid={`inspector-stage-card-${st.index}`}
                                onClick={() => {
                                  onSelectStage(st.index);
                                  handleSelectTab('STEP_GUIDE');
                                }}
                                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-wrap items-center justify-between gap-2 ${
                                  isCurrent
                                    ? 'bg-indigo-50/70 dark:bg-indigo-950/35 border-indigo-500'
                                    : 'bg-zinc-50/70 dark:bg-zinc-950/50 border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-[10px] font-bold shrink-0">
                                    S{st.index}
                                  </span>
                                  <span className="text-sm font-bold text-zinc-950 dark:text-white leading-snug break-words">
                                    {rawStep?.plainTitle || st.title}
                                  </span>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono text-[10.5px] font-bold shrink-0">
                                  {st.mitreTechniqueId}
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                        </div>
                      );
    
                      return mainScenarioOverviewContent;
                    })()
                  )}
                </div>
  );
}
