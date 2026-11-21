'use client';

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import type { AttackScenario, TelemetryEvent } from '@/lib/attack-scenarios';
import type { CinematicPhase } from '@/lib/cinematic-camera-director';
import type { InspectorScopeContext } from '@/lib/inspector-scope';
import { parseStructuredExplanationClauses } from '@/lib/scenario-step-guides';
import {
  Compass,
  FileSearch,
  GitCommitHorizontal,
  Layers,
  Network,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { SketchNodeIcon } from '../SketchNodeIcons';
import { SingleCommandExplanationCard } from '../CommandBreakdownList';
import { StandardStoryTechnicalSection } from '../StandardStoryTechnicalSection';
import { StructuredClausesList } from './StructuredClausesList';

export interface ExpandedStepGuideViewProps {
  scenario: AttackScenario;
  activeStageIndex: number;
  cinematicPhase: CinematicPhase | null | undefined;
  scopeContext: InspectorScopeContext;
  internalSteps: NonNullable<InspectorScopeContext['internalSteps']>;
  isSeparatedScenario: boolean;
  selectedSubNode: InspectorScopeContext['selectedSubNode'];
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
}

export function ExpandedStepGuideView({
  scenario,
  activeStageIndex,
  cinematicPhase,
  scopeContext,
  internalSteps,
  isSeparatedScenario,
  selectedSubNode,
  onSelectInternalSubNode,
  onSelectTelemetry,
}: ExpandedStepGuideViewProps) {
  const briefingRef = useRef<HTMLDivElement | null>(null);
  const stepCardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const subBoard = scopeContext.internalSubBoard!;

  return (

      <div
        data-testid="step-by-step-guide-panel"
        data-inspector-scope={scopeContext.effectiveScope}
        data-active-stage={activeStageIndex}
        data-cinematic-phase={cinematicPhase}
        dir="ltr"
        className="space-y-4"
      >
        {/* Top Scoped Internal Pipeline Bar */}
        <div
          data-testid="step-guide-nav-bar"
          className="p-3 rounded-xl bg-zinc-100/95 dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
            <div className="inline-flex items-center gap-1.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 text-[10px] font-mono font-bold leading-snug break-words">
                <Layers className="w-3 h-3 shrink-0" />
                <span>{scopeContext.scopeBadgeText}</span>
              </span>
            </div>

            <span className="text-[10px] font-mono font-semibold text-zinc-500 dark:text-zinc-400">
              {isSeparatedScenario
                ? `STEP-BY-STEP GUIDE: ${internalSteps.length} INTERNAL STAGES`
                : `UNIFIED STEPS & SEQUENCE: ${internalSteps.length} INTERNAL EXCHANGES`}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-zinc-200/70 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                data-testid="step-guide-pill-0"
                onClick={() => onSelectInternalSubNode?.(null)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                  !selectedSubNode
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                {isSeparatedScenario
                  ? '#0 Step Briefing'
                  : '#0 Briefing & Sequence Map'}
              </button>
              {internalSteps.map((st) => {
                const isFocused = Boolean(
                  selectedSubNode && st.isRelatedToSelectedSubNode
                );
                return (
                  <button
                    key={st.flow.id}
                    type="button"
                    data-testid={`step-guide-pill-${st.stepNumber}`}
                    onClick={() => {
                      if (st.toSubNode) {
                        onSelectInternalSubNode?.(st.toSubNode.id);
                      }
                    }}
                    title={`#${st.sequenceCode}: ${st.title}`}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      isFocused
                        ? 'bg-rose-600 text-white'
                        : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                    }`}
                  >
                    #{st.sequenceCode}
                  </button>
                );
              })}
            </div>

            {selectedSubNode && (
              <button
                type="button"
                data-testid="step-guide-clear-subnode-filter-btn"
                onClick={() => onSelectInternalSubNode?.(null)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-200/80 hover:bg-zinc-300/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[9.5px] font-mono font-semibold text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5 shrink-0" />
                <span>All Sub-Steps</span>
              </button>
            )}
          </div>
        </div>

        {/* 0. EXPANDED NODE INTERNAL PIPELINE & SEQUENCE BRIEFING CARD */}
        <div
          id="step-0"
          ref={briefingRef}
          data-testid="step-guide-scenario-briefing"
          data-briefing-active={!selectedSubNode ? 'true' : 'false'}
          onClick={() => onSelectInternalSubNode?.(null)}
          className={`rounded-xl border transition-all cursor-pointer overflow-hidden scroll-mt-16 ${
            !selectedSubNode
              ? 'border-amber-500/80 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm ring-1 ring-amber-500/30'
              : 'border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/50 hover:border-amber-500/50'
          }`}
        >
          <div className="px-3.5 py-2.5 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
            <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-amber-400 uppercase tracking-wider min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {isSeparatedScenario
                  ? 'STEP #0 · INTERNAL PIPELINE STEP BRIEFING'
                  : 'STEP #0 · INTERNAL PIPELINE & SEQUENCE BRIEFING'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9.5px] font-mono">
              {subBoard.boardCode}
            </span>
          </div>

          <div className="p-3.5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-snug break-words">
                {subBoard.title}
              </h4>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px] font-semibold">
                {`Parent Node #${subBoard.sequenceLineage.parentSequenceCode} · Steps #${subBoard.sequenceLineage.internalSeqChain[0] || `${subBoard.sequenceLineage.parentSequenceCode}.1`}..#${subBoard.sequenceLineage.internalSeqChain[subBoard.sequenceLineage.internalSeqChain.length - 1] || `${subBoard.sequenceLineage.parentSequenceCode}.4`}`}
              </span>
            </div>

            {/* Layer 1: Real-World Story Analogy for Expanded Sub-Board */}
            {scopeContext.subBoardStoryAnalogy && (
              <div
                data-testid="step-guide-briefing-story-analogy"
                className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/70 space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>1. Real-World Story Analogy (Sub-Board Scope):</span>
                </div>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
                  {scopeContext.subBoardStoryAnalogy}
                </p>
              </div>
            )}

            {/* Layer 2: Structured Architecture Clauses */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>{`2. Technical Architecture (${subBoard.environmentBreadcrumb}):`}</span>
              </div>
              <StructuredClausesList
                clauses={parseStructuredExplanationClauses(
                  subBoard.architectureNote,
                  `${subBoard.sequenceLineage.parentSequenceCode}.0`
                )}
              />
            </div>

            {/* Layer 3A: Visual Participating Internal Sub-Nodes Grid (With Icons & Shapes) */}
            <div className="p-3 rounded-xl bg-white/95 dark:bg-zinc-950/85 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <Network className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    3A. Visual Internal Pipeline Sub-Nodes ({subBoard.subNodes.length} Stages)
                  </span>
                </span>
                <span className="text-[9.5px] font-mono text-zinc-500">
                  Click any sub-node to focus its sequence step
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {subBoard.subNodes.map((sn) => {
                  const isSelectedSn = selectedSubNode?.id === sn.id;
                  return (
                    <div
                      key={sn.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInternalSubNode?.(sn.id);
                      }}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelectedSn
                          ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500/30'
                          : 'bg-zinc-50/80 dark:bg-zinc-900/70 border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400'
                      }`}
                    >
                      <div className="w-10 h-9 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1 shrink-0">
                        <SketchNodeIcon
                          iconType={sn.iconType}
                          isActive={sn.isActive}
                          isCompromised={sn.isCompromised}
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9px] font-extrabold">
                            #{sn.sequenceCode}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400">
                            {sn.actionBadge}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-zinc-900 dark:text-white leading-snug break-words">
                          {sn.label}
                        </div>
                        <div className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                          {sn.sublabel}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer 3B: Cascading Internal Sequence Waterfall (#P.1 └─▶ #P.4) — Shown only when Unified */}
            {!isSeparatedScenario && (
              <div className="p-3 rounded-xl bg-white/95 dark:bg-zinc-950/85 border border-indigo-200/80 dark:border-indigo-900/50 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    <GitCommitHorizontal className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      3B. Cascading Internal Sequence Waterfall (#
                      {subBoard.sequenceLineage.internalSeqChain[0] ||
                        `${subBoard.sequenceLineage.parentSequenceCode}.1`}{' '}
                      └─▶ #
                      {subBoard.sequenceLineage.internalSeqChain[
                        subBoard.sequenceLineage.internalSeqChain.length - 1
                      ] || `${subBoard.sequenceLineage.parentSequenceCode}.4`}
                      )
                    </span>
                  </span>
                  <span className="text-[9.5px] font-mono text-zinc-500">
                    Ordered Chronological Sub-Step Chain
                  </span>
                </div>

                <div className="space-y-1.5">
                  {internalSteps.map((st, idx) => {
                    const indentPx = Math.min(idx, 4) * 14;
                    return (
                      <div
                        key={st.flow.id}
                        style={{ marginLeft: `${indentPx}px` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (st.toSubNode) {
                            onSelectInternalSubNode?.(st.toSubNode.id);
                          }
                        }}
                        className="p-2 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/70 hover:border-indigo-400 transition-colors flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono"
                      >
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          {idx > 0 && (
                            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                              └─▶
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9.5px] font-extrabold">
                            #{st.sequenceCode}
                          </span>
                          {st.fromSubNode && (
                            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-semibold text-zinc-800 dark:text-zinc-200">
                              {st.fromSubNode.label}
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-bold">
                            {st.forwardFlowBadge}
                          </span>
                          {st.toSubNode && (
                            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-semibold text-zinc-800 dark:text-zinc-200">
                              {st.toSubNode.label}
                            </span>
                          )}
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[9.5px] font-semibold">
                          {st.returnFlowBadge}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-1 flex flex-wrap items-center justify-between gap-1 text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
              <span>{subBoard.hostSystemLabel}</span>
            </div>
          </div>
        </div>

        {/* NUMBERED INTERNAL SUB-FLOW STEPS & SEQUENCE EXCHANGES (#N.1 .. #N.4) */}
        <div className="space-y-3.5">
          {internalSteps.map((step) => {
            const isActive = Boolean(
              selectedSubNode
                ? step.isRelatedToSelectedSubNode
                : step.isCurrentStep
            );
            const structuredStepClauses = parseStructuredExplanationClauses(
              step.explanation,
              step.sequenceCode
            );

            return (
              <motion.div
                key={step.flow.id}
                id={`substep-${step.toSubNode?.id || step.stepNumber}`}
                ref={(el) => {
                  stepCardRefs.current[step.stepNumber] = el;
                }}
                data-testid={`step-guide-card-${step.stepNumber}`}
                data-step-number={step.stepNumber}
                data-sequence-code={step.sequenceCode}
                data-step-status={isActive ? 'ACTIVE' : 'UPCOMING'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => {
                  if (step.toSubNode) {
                    onSelectInternalSubNode?.(step.toSubNode.id);
                  }
                }}
                className={`rounded-xl border transition-all cursor-pointer overflow-hidden scroll-mt-16 ${
                  isActive
                    ? 'border-rose-500 bg-rose-50/35 dark:bg-rose-950/20 shadow-md ring-1 ring-rose-500/35'
                    : 'border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/40 hover:border-indigo-500/50'
                }`}
              >
                {/* Internal Step & Sequence Card Header */}
                <div
                  className={`px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b ${
                    isActive
                      ? 'bg-rose-600 text-white border-rose-700'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-800'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono font-extrabold shrink-0 ${
                        isActive
                          ? 'bg-white text-rose-700'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {isSeparatedScenario
                        ? `STEP #${step.sequenceCode}`
                        : `STEP #${step.sequenceCode} · SEQ #${step.sequenceCode}`}
                    </span>
                    <span className="text-xs font-mono font-bold leading-snug break-words">
                      {step.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isActive && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-300 text-slate-950 text-[9.5px] font-mono font-bold">
                        FOCUSED
                      </span>
                    )}
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold ${
                        isActive
                          ? 'bg-rose-800/90 text-rose-100'
                          : 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {step.mitreId}
                    </span>
                  </div>
                </div>

                {/* Internal Step Card Content */}
                <div className="p-3.5 space-y-3">
                  {/* Layer 1: Story Analogy for Internal Transition */}
                  <div
                    data-testid={`step-guide-story-analogy-${step.stepNumber}`}
                    className="p-3 rounded-lg bg-amber-50/75 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/70 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>1. Real-World Story Analogy:</span>
                    </div>
                    <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
                      {step.storyAnalogy}
                    </p>
                  </div>

                  {/* Layer 2 (Unified Only): Visual Initiator Sub-Node ⇄ Receiver Sub-Node Sequence Swimlane */}
                  {!isSeparatedScenario && (
                    <div
                      data-testid={`sequence-trace-row-${step.stepNumber}`}
                      className="p-3 rounded-xl bg-zinc-50/90 dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        <span className="inline-flex items-center gap-1.5">
                          <GitCommitHorizontal className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            2. Visual Sequence Exchange — Initiator Sub-Node ⇄ Receiver Sub-Node
                          </span>
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {step.protocolOrEventId}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
                        {/* Left: Initiator Sub-Node */}
                        <div className="lg:col-span-3 p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-2.5">
                          {step.fromSubNode && (
                            <div className="w-10 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1 shrink-0">
                              <SketchNodeIcon
                                iconType={step.fromSubNode.iconType}
                                isActive={step.fromSubNode.isActive}
                                isCompromised={step.fromSubNode.isCompromised}
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1 space-y-0.5 font-mono">
                            <div className="text-[9px] font-extrabold uppercase text-rose-600 dark:text-rose-400">
                              INITIATOR · #{step.fromSubNode?.sequenceCode || step.stepNumber}
                            </div>
                            <div className="text-[11px] font-bold text-zinc-900 dark:text-white leading-snug break-words">
                              {step.fromSubNode?.label || step.flow.fromNodeId}
                            </div>
                            <div className="text-[9.5px] text-zinc-500 leading-snug break-words">
                              {step.fromSubNode?.sublabel || step.fromSubNode?.actionBadge}
                            </div>
                          </div>
                        </div>

                        {/* Center: Forward (#P.N→) & Return (⇠#P.N) Tracks with Animated SVG Interacting Vectors */}
                        <div className="lg:col-span-6 flex flex-col justify-center gap-2">
                          <div className="p-2 rounded-lg bg-rose-50/75 dark:bg-rose-950/25 border border-rose-200/80 dark:border-rose-900/50 space-y-1 font-mono">
                            <div className="flex flex-wrap items-center justify-between gap-1 text-[10.5px]">
                              <span className="font-extrabold text-rose-700 dark:text-rose-300 inline-flex items-center gap-1">
                                <span>{step.forwardFlowBadge}</span>
                              </span>
                              <span className="text-[9.5px] text-rose-600 dark:text-rose-400">
                                FORWARD REQUEST ──▶
                              </span>
                            </div>
                            <svg
                              viewBox="0 0 260 14"
                              className="w-full h-3.5 overflow-visible"
                              aria-hidden="true"
                            >
                              <line
                                x1="4"
                                y1="7"
                                x2="250"
                                y2="7"
                                stroke="#e11d48"
                                strokeWidth="2"
                                strokeDasharray="5 3"
                              />
                              <polygon
                                points="256,7 248,3 248,11"
                                fill="#e11d48"
                              />
                              <motion.circle
                                cy="7"
                                r="4"
                                fill="#e11d48"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                                animate={{ cx: [10, 246] }}
                                transition={{
                                  duration: 2.1,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              />
                            </svg>
                            <div className="text-[10.5px] text-zinc-700 dark:text-zinc-300 leading-snug break-words">
                              {step.telemetryEvent.info}
                            </div>
                          </div>

                          <div className="p-2 rounded-lg bg-emerald-50/75 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-900/50 space-y-1 font-mono">
                            <div className="flex flex-wrap items-center justify-between gap-1 text-[10.5px]">
                              <span className="font-extrabold text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1">
                                <span>{step.returnFlowBadge}</span>
                              </span>
                              <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400">
                                ◀── RETURN CHANNEL
                              </span>
                            </div>
                            <svg
                              viewBox="0 0 260 14"
                              className="w-full h-3.5 overflow-visible"
                              aria-hidden="true"
                            >
                              <line
                                x1="256"
                                y1="7"
                                x2="10"
                                y2="7"
                                stroke="#10b981"
                                strokeWidth="1.75"
                                strokeDasharray="4 3"
                              />
                              <polygon
                                points="4,7 12,3 12,11"
                                fill="#10b981"
                              />
                              <motion.circle
                                cy="7"
                                r="3.5"
                                fill="#10b981"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                                animate={{ cx: [246, 12] }}
                                transition={{
                                  duration: 2.4,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              />
                            </svg>
                            <div className="text-[10.5px] text-zinc-700 dark:text-zinc-300 leading-snug break-words">
                              {step.returnDescription}
                            </div>
                          </div>
                        </div>

                        {/* Right: Receiver Sub-Node */}
                        <div className="lg:col-span-3 p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-2.5">
                          {step.toSubNode && (
                            <div className="w-10 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1 shrink-0">
                              <SketchNodeIcon
                                iconType={step.toSubNode.iconType}
                                isActive={step.toSubNode.isActive}
                                isCompromised={step.toSubNode.isCompromised}
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1 space-y-0.5 font-mono">
                            <div className="text-[9px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                              RECEIVER · #{step.toSubNode?.sequenceCode || step.stepNumber}
                            </div>
                            <div className="text-[11px] font-bold text-zinc-900 dark:text-white leading-snug break-words">
                              {step.toSubNode?.label || step.flow.toNodeId}
                            </div>
                            <div className="text-[9.5px] text-zinc-500 leading-snug break-words">
                              {step.toSubNode?.sublabel || step.toSubNode?.actionBadge}
                            </div>
                          </div>
                        </div>
                      </div>

                      {step.continuationHint && (
                        <div className="px-2.5 py-1.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/60 text-[10.5px] font-mono text-indigo-900 dark:text-indigo-200 leading-snug break-words">
                          ↪ {step.continuationHint}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Layer 2/3: Story-to-Scenario Technical Bridge */}
                  <div
                    data-testid={`step-guide-technical-bridge-${step.stepNumber}`}
                    className="space-y-1.5"
                  >
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {isSeparatedScenario
                        ? '2. Story ↔ Scenario Technical Bridge:'
                        : '3. Story ↔ Scenario Technical Bridge:'}
                    </div>
                    <StructuredClausesList clauses={structuredStepClauses} />
                  </div>

                  {/* Sub-Step CommandLine & Technical Operation Breakdown */}
                  <SingleCommandExplanationCard
                    rawCommand={
                      step.telemetryEvent.shortAction ||
                      step.telemetryEvent.rawLog ||
                      step.title
                    }
                    badgeLabel={`SUB-STEP #${step.sequenceCode} COMMANDLINE`}
                    stageTitle={step.title}
                    stageDescription={step.explanation}
                    mitreId={step.mitreId}
                  />

                  {/* Layer 3/4: Documented Telemetry / Packet Inspection */}
                  <div
                    data-testid={`step-guide-under-the-hood-${step.stepNumber}`}
                    className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span>{`${
                          isSeparatedScenario ? '3' : '4'
                        }. Documented Sensor Evidence · ${step.telemetryEvent.sourceType} · ${step.telemetryEvent.protocolOrEventId}`}</span>
                      </span>

                      {onSelectTelemetry && (
                        <button
                          type="button"
                          data-testid={`step-guide-inspect-packet-${step.stepNumber}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTelemetry(step.telemetryEvent);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[9.5px] font-mono font-bold transition-colors cursor-pointer shrink-0"
                        >
                          <FileSearch className="w-3 h-3 shrink-0" />
                          <span>Inspect Packet</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-950 dark:text-emerald-100/90 leading-relaxed break-words">
                      {step.telemetryEvent.info}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
  );
}
