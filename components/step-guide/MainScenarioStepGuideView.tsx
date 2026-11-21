'use client';

import React, { type MutableRefObject, type RefObject } from 'react';
import { motion } from 'motion/react';
import type { AttackScenario, TelemetryEvent } from '@/lib/attack-scenarios';
import type { CinematicPhase } from '@/lib/cinematic-camera-director';
import type { InspectorScopeContext } from '@/lib/inspector-scope';
import { buildStepStructuralBreakdown } from '@/lib/documentation-structural-diagrams';
import {
  hasSection3DScene,
  stepNumberToSectionKey,
} from '@/lib/section-3d-registry';
import { parseStructuredExplanationClauses } from '@/lib/scenario-step-guides';
import type { DiagramStepGuideModel } from '@/lib/scenario-step-guides';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Cpu,
  FileSearch,
  GitCommitHorizontal,
  Layers,
  Network,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { SketchNodeIcon } from '../SketchNodeIcons';
import {
  CommandBreakdownList,
  SingleCommandExplanationCard,
} from '../CommandBreakdownList';
import { StandardStoryTechnicalSection } from '../StandardStoryTechnicalSection';
import { StructuredClausesList } from './StructuredClausesList';

export interface MainScenarioStepGuideViewProps {
  scenario: AttackScenario;
  activeStageIndex: number;
  cinematicPhase: CinematicPhase | null | undefined;
  scopeContext?: InspectorScopeContext;
  selectedTelemetryId: string | null;
  isSeparatedScenario: boolean;
  briefing: DiagramStepGuideModel['briefing'];
  steps: DiagramStepGuideModel['steps'];
  briefingRef: RefObject<HTMLDivElement | null>;
  stepCardRefs: MutableRefObject<Record<number, HTMLDivElement | null>>;
  outroRef: RefObject<HTMLDivElement | null>;
  onSelectStage?: (stageIndex: number) => void;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
  onStartWalkthrough?: () => void;
  onResetWalkthrough?: () => void;
  onOpenProcessHierarchy?: () => void;
}

export function MainScenarioStepGuideView({
  scenario,
  activeStageIndex,
  cinematicPhase,
  scopeContext,
  selectedTelemetryId,
  isSeparatedScenario,
  briefing,
  steps,
  briefingRef,
  stepCardRefs,
  outroRef,
  onSelectStage,
  onSelectTelemetry,
  onStartWalkthrough,
  onResetWalkthrough,
  onOpenProcessHierarchy,
}: MainScenarioStepGuideViewProps) {
  return (
    <div
      data-testid="step-by-step-guide-panel"
      data-inspector-scope="MAIN_SCENARIO"
      data-active-stage={activeStageIndex}
      data-cinematic-phase={cinematicPhase}
      dir="ltr"
      className="flex flex-col"
    >

      {/* Merged Stage Filter + Steps jump chrome (single header — no duplicate Stage Filter card) */}
      <div
        data-testid="step-guide-nav-bar"
        className="px-4 py-3 border-b border-zinc-200/90 dark:border-zinc-800 space-y-2.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 text-[10px] font-mono font-bold">
              <BookOpen className="w-3 h-3 shrink-0" />
              <span>
                {isSeparatedScenario
                  ? 'STEP-BY-STEP GUIDE'
                  : 'STEPS & SEQUENCE'}
              </span>
            </span>
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              STAGE FILTER ({steps.length} STAGES):
            </span>
          </div>

          <span className="text-[10px] font-mono font-semibold text-zinc-500 dark:text-zinc-400">
            {briefing.isActiveBriefing
              ? 'STAGE: BRIEFING'
              : briefing.isOutroComplete
                ? 'STAGE: COMPLETE'
                : `STAGE: ${activeStageIndex} / ${steps.length}`}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 flex-wrap"
          aria-label="Stage Filter"
          data-testid="inspector-main-scenario-stage-card"
        >
          <button
            type="button"
            data-testid="step-guide-pill-0"
            onClick={() => {
              if (onResetWalkthrough) {
                onResetWalkthrough();
              } else {
                onSelectStage?.(0);
              }
              briefingRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
            title="All Stages · Scenario Briefing"
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              briefing.isActiveBriefing || activeStageIndex === 0
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            All Stages
          </button>
          {steps.map((st) => (
            <button
              key={st.stepNumber}
              type="button"
              data-testid={`step-guide-pill-${st.stepNumber}`}
              onClick={() => {
                onSelectStage?.(st.stepNumber);
                stepCardRefs.current[st.stepNumber]?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
              title={`Stage ${st.stepNumber}: ${st.plainTitle}`}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                activeStageIndex === st.stepNumber && !briefing.isActiveBriefing
                  ? 'bg-indigo-600 text-white'
                  : activeStageIndex > st.stepNumber || briefing.isOutroComplete
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              S{st.stepNumber} · {st.mitreId}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">

      {(() => {
        const cardsContent = (
          <>
            {/* 0. SCENARIO & SEQUENCE BRIEFING CARD (With Visual Participating Nodes & Cascading Sequence Waterfall) */}
            <div
              id="step-0"
              ref={briefingRef}
              data-testid="step-guide-scenario-briefing"
              data-briefing-active={briefing.isActiveBriefing ? 'true' : 'false'}
              onClick={() => onSelectStage?.(0)}
              className={`rounded-xl border transition-all cursor-pointer overflow-hidden scroll-mt-16 ${
                briefing.isActiveBriefing
                  ? 'border-amber-500/80 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm ring-1 ring-amber-500/30'
                  : 'border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/50 hover:border-amber-500/50'
              }`}
            >
        {/* Briefing Header Strip */}
        <div className="px-3.5 py-2.5 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-amber-400 uppercase tracking-wider min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {isSeparatedScenario
                ? 'STEP #0 · SCENARIO BRIEFING'
                : 'STEP #0 · SCENARIO & SEQUENCE BRIEFING'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {(cinematicPhase === 'INTRO_SURVEY' ||
              cinematicPhase === 'INTRO_FOCUS_ORIGIN') && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9.5px] font-mono font-bold">
                {cinematicPhase === 'INTRO_SURVEY'
                  ? 'SURVEYING MAP'
                  : 'ORIGIN FOCUS'}
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9.5px] font-mono">
              {briefing.scenarioCode}
            </span>
          </div>
        </div>

        {/* Briefing Body */}
        <div className="p-3.5 space-y-3.5">
          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-snug break-words">
            {briefing.headline}
          </h4>

          {/* Start -> N Stages -> Target Topology Bar */}
          <div className="p-2.5 rounded-lg bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono">
            <span className="text-amber-300 font-semibold leading-snug break-words">
              ORIGIN: {briefing.originNodeLabel}
            </span>
            <span className="text-rose-400 font-bold shrink-0">
              ── {briefing.totalStages} SEQUENTIAL STEPS ──▶
            </span>
            <span className="text-emerald-400 font-semibold leading-snug break-words">
              FINAL SENSOR / TARGET: {briefing.finalNodeLabel}
            </span>
          </div>

          {/* Scenario Briefing: technical deep-dive only (Overview already owns Story Analogy) */}
          <StandardStoryTechnicalSection
            scenarioId={scenario.id}
            sectionKey={
              hasSection3DScene(scenario.id, 'briefing') ? 'briefing' : null
            }
            omitStory
            technicalHeading="1. Scenario Briefing · Technical Deep-Dive:"
            technicalText={[
              briefing.plainSummary,
              briefing.diagramTopologySummary,
              steps.length > 0
                ? `This Step-by-Step Guide expands each kill-chain stage in order: ${steps
                    .map(
                      (st) =>
                        `Step #${st.stepNumber} (${st.mitreId}) covers ${st.plainTitle || st.stageTitle}`
                    )
                    .join('; ')}.`
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            clausePrefix="0"
            technicalTestId="step-guide-briefing-plain-summary"
          />

          {/* Layer 2: Visual Participating Topology Nodes Grid (①..⑥ with Node Icons) */}
          <div
            data-testid="sequence-participants-bar"
            className="p-3 rounded-xl bg-white/95 dark:bg-zinc-950/85 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Network className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isSeparatedScenario
                    ? `2. Scenario Topology Nodes Roster (${briefing.topologyNodes.length} Nodes · ①..⑥)`
                    : `2A. Participating Topology Nodes Roster (${briefing.topologyNodes.length} Nodes · ①..⑥)`}
                </span>
              </span>
              <span className="text-[9.5px] font-mono text-zinc-500">
                Ordered Left-to-Right by Kill-Chain Architecture
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {briefing.topologyNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-2.5 rounded-lg bg-zinc-50/90 dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800 flex items-start gap-2.5"
                >
                  <div className="w-11 h-9 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1 shrink-0">
                    <SketchNodeIcon
                      iconType={node.iconType}
                      isActive={activeStageIndex === 0}
                      isCompromised={node.isCompromised}
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9.5px] font-extrabold">
                        Node {node.circledNumber} (#{node.chainOrder})
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 break-words">
                        {node.zoneLabel}
                      </span>
                    </div>
                    <div className="text-[11.5px] font-bold text-zinc-900 dark:text-white leading-snug break-words">
                      {node.label}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                      {node.sublabel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2B (Unified Only): Cascading Sequence Waterfall (Step #1 └─▶ Step #N with Visual Node Icons) */}
          {!isSeparatedScenario && (
            <div className="p-3 rounded-xl bg-white/95 dark:bg-zinc-950/85 border border-indigo-200/80 dark:border-indigo-900/50 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  <GitCommitHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    2B. Cascading Sequence Waterfall (Step #1 └─▶ Step #{briefing.sequenceWaterfall.length})
                  </span>
                </span>
                <span className="text-[9.5px] font-mono text-zinc-500">
                  Click any row to jump directly to that Step & Sequence card
                </span>
              </div>

              <div className="space-y-1.5">
                {briefing.sequenceWaterfall.map((wf, idx) => {
                  const indentPx = Math.min(idx, 5) * 14;
                  const isCurrentWf = activeStageIndex === wf.stepNumber;
                  return (
                    <div
                      key={wf.stepNumber}
                      style={{ marginLeft: `${indentPx}px` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStage?.(wf.stepNumber);
                      }}
                      className={`p-2 rounded-lg border transition-all flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono ${
                        isCurrentWf
                          ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/30'
                          : 'bg-zinc-50/85 dark:bg-zinc-900/75 border-zinc-200/90 dark:border-zinc-800 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        {idx > 0 && (
                          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                            └─▶
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9.5px] font-extrabold">
                          STEP #{wf.stepNumber}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[9.5px] font-bold">
                          {wf.mitreId}
                        </span>

                        {/* Initiator Chip with Mini Icon */}
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-semibold text-zinc-800 dark:text-zinc-200">
                          <span className="w-4 h-3.5 inline-flex items-center justify-center shrink-0">
                            <SketchNodeIcon
                              iconType={wf.fromNodeIcon}
                              isActive={isCurrentWf}
                              isCompromised={true}
                            />
                          </span>
                          <span>
                            {wf.fromNodeCircled} #{wf.fromNodeOrder} {wf.fromNodeLabel}
                          </span>
                        </span>

                        {/* Forward Arrow Badge */}
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-bold">
                          #{wf.stepNumber}→ {wf.actionLabel}
                        </span>

                        {/* Receiver Chip with Mini Icon */}
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-semibold text-zinc-800 dark:text-zinc-200">
                          <span className="w-4 h-3.5 inline-flex items-center justify-center shrink-0">
                            <SketchNodeIcon
                              iconType={wf.toNodeIcon}
                              isActive={isCurrentWf}
                              isCompromised={wf.toNodeOrder <= 4}
                            />
                          </span>
                          <span>
                            {wf.toNodeCircled} #{wf.toNodeOrder} {wf.toNodeLabel}
                          </span>
                        </span>
                      </div>

                      {/* Return Channel & Protocol Chip */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[9.5px] font-semibold">
                          ⇠#{wf.stepNumber} {wf.returnLabel}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9.5px]">
                          {wf.protocolOrEventId}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Documented Source Footer */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-1 text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
            <span>{briefing.documentedAdvisory}</span>
          </div>
        </div>
      </div>

      {/* NUMBERED STEP-BY-STEP & SEQUENCE CARDS (#1 .. #N) */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isActive = step.status === 'ACTIVE';
          const isCompleted = step.status === 'COMPLETED';
          const isSelectedPacket = Boolean(
            selectedTelemetryId &&
              step.telemetryEvent &&
              selectedTelemetryId === step.telemetryEvent.id
          );
          const stageObj =
            scenario.stages.find((s) => s.index === step.stepNumber) ||
            scenario.stages[step.stepNumber - 1];
          const stepDiagram =
            scopeContext && stageObj
              ? buildStepStructuralBreakdown(scenario, stageObj, scopeContext)
              : null;

          return (
            <motion.div
              key={step.stepNumber}
              id={`step-${step.stepNumber}`}
              ref={(el) => {
                stepCardRefs.current[step.stepNumber] = el;
              }}
              data-testid={`step-guide-card-${step.stepNumber}`}
              data-step-number={step.stepNumber}
              data-step-status={step.status}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => onSelectStage?.(step.stepNumber)}
              className={`rounded-xl border transition-all cursor-pointer overflow-hidden scroll-mt-16 ${
                isActive || isSelectedPacket
                  ? 'border-rose-500 bg-rose-50/35 dark:bg-rose-950/20 shadow-md ring-1 ring-rose-500/35'
                  : isCompleted
                  ? 'border-emerald-500/40 bg-emerald-50/15 dark:bg-emerald-950/10 hover:border-emerald-500/70'
                  : 'border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/40 hover:border-indigo-500/50'
              }`}
            >
              {/* Unified Step & Sequence Card Header */}
              <div
                className={`px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b ${
                  isActive || isSelectedPacket
                    ? 'bg-rose-600 text-white border-rose-700'
                    : isCompleted
                    ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/70'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-800'
                }`}
              >
                <div className="inline-flex items-center gap-2 min-w-0 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono font-extrabold shrink-0 ${
                      isActive || isSelectedPacket
                        ? 'bg-white text-rose-700'
                        : isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {isSeparatedScenario
                      ? `STEP #${step.stepNumber}`
                      : `STEP #${step.stepNumber} · SEQ #${step.forwardSeq}`}
                  </span>
                  <span className="text-xs font-mono font-bold leading-snug break-words">
                    {step.stageTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono tabular-nums ${
                      isActive || isSelectedPacket
                        ? 'bg-rose-800/90 text-rose-100'
                        : 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    {step.timestamp}
                  </span>
                  {isActive && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-300 text-slate-950 text-[9.5px] font-mono font-bold">
                      ACTIVE
                    </span>
                  )}
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold ${
                      isActive || isSelectedPacket
                        ? 'bg-rose-800/90 text-rose-100'
                        : 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {step.mitreId}
                  </span>
                </div>
              </div>

              {/* Step Card Content */}
              <div className="p-3.5 space-y-3.5">
                {/* Plain Title */}
                <h5 className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white leading-snug break-words">
                  {step.plainTitle}
                </h5>

                {/* 1 + 3D + 2: Canonical Overview Standard (Story FIRST -> Full-Width 3D Stage -> Technical Bridge BELOW film) */}
                {(() => {
                  const stepSectionKey = stepNumberToSectionKey(
                    step.stepNumber
                  );
                  const resolvedSectionKey =
                    stepSectionKey &&
                    hasSection3DScene(scenario.id, stepSectionKey)
                      ? stepSectionKey
                      : null;
                  return (
                    <StandardStoryTechnicalSection
                      scenarioId={scenario.id}
                      sectionKey={resolvedSectionKey}
                      storyHeading="1. Real-World Story Analogy:"
                      storyAnalogy={step.storyAnalogy}
                      storyMappings={step.storyMappings}
                      technicalHeading="2. Story ↔ Scenario Technical Bridge:"
                      technicalClauses={step.structuredClauses}
                      storyTestId={`step-guide-story-analogy-${step.stepNumber}`}
                      technicalTestId={`step-guide-technical-bridge-${step.stepNumber}`}
                    />
                  );
                })()}

                {/* 3 (Unified Only). Visual Sequence Exchange Swimlane — Initiator (Sender) ⇄ Receiver (Target) with Node Icons */}
                {!isSeparatedScenario && (
                  <div
                    data-testid={`sequence-trace-row-${step.stepNumber}`}
                    className="p-3 rounded-xl bg-zinc-50/95 dark:bg-zinc-950/85 border border-zinc-200/90 dark:border-zinc-800 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      <span className="inline-flex items-center gap-1.5">
                        <GitCommitHorizontal className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          3. Visual Sequence Exchange — Initiator (Sender) ⇄ Receiver (Target)
                        </span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {step.protocolOrEventId}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                      {/* Left Column: Initiator (Sender) with SketchNodeIcon */}
                      <div className="lg:col-span-3 p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-2">
                        <div className="flex items-start gap-2.5">
                          <div className="w-11 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1 shrink-0">
                            <SketchNodeIcon
                              iconType={step.fromNodeIcon}
                              isActive={isActive}
                              isCompromised={true}
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5 font-mono">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-extrabold uppercase text-rose-600 dark:text-rose-400">
                                INITIATOR (SENDER)
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300">
                                {step.fromNodeCircled} #{step.fromNodeOrder}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                              {step.fromNodeLabel}
                            </div>
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                              {step.fromNodeSublabel}
                            </div>
                          </div>
                        </div>
                        <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/80 text-[9.5px] font-mono text-zinc-400 break-words">
                          Zone: {step.fromNodeZone}
                        </div>
                      </div>

                      {/* Center Column: Bidirectional Forward (#N→) & Return (⇠#N) Animated Shape Interaction Tracks */}
                      <div className="lg:col-span-6 flex flex-col justify-center space-y-2">
                        {/* Forward Request Track (#N→) */}
                        <div className="p-2.5 rounded-lg bg-rose-50/75 dark:bg-rose-950/25 border border-rose-200/80 dark:border-rose-900/50 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                            <span className="inline-flex items-center gap-1.5 font-extrabold text-rose-600 dark:text-rose-400">
                              <span>#{step.forwardSeq}→</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                              <span className="break-words">
                                {step.forwardActionLabel}
                              </span>
                            </span>
                            <span className="text-[10px] font-mono font-semibold text-rose-700/80 dark:text-rose-300/80">
                              {step.fromNodeLabel} ──▶ {step.toNodeLabel}
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
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          </svg>
                          <p className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                            {step.forwardPayloadSummary}
                          </p>
                        </div>

                        {/* Return Response Track (⇠#N) */}
                        <div className="p-2.5 rounded-lg bg-emerald-50/75 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-900/50 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                            <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-700 dark:text-emerald-400">
                              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                              <span>⇠#{step.returnSeq}</span>
                              <span className="break-words">
                                {step.returnActionLabel}
                              </span>
                            </span>
                            <span className="text-[10px] font-mono font-semibold text-emerald-700/80 dark:text-emerald-300/80">
                              {step.fromNodeLabel} ◀── {step.toNodeLabel}
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
                                duration: 2.3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          </svg>
                          <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                            {step.returnDescription}
                          </p>
                        </div>
                      </div>

                      {/* Right Column: Receiver (Target) with SketchNodeIcon */}
                      <div className="lg:col-span-3 p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-2">
                        <div className="flex items-start gap-2.5">
                          <div className="w-11 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1 shrink-0">
                            <SketchNodeIcon
                              iconType={step.toNodeIcon}
                              isActive={isActive}
                              isCompromised={step.toNodeOrder <= 4}
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5 font-mono">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                                RECEIVER (TARGET)
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                                {step.toNodeCircled} #{step.toNodeOrder}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                              {step.toNodeLabel}
                            </div>
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                              {step.toNodeSublabel}
                            </div>
                          </div>
                        </div>
                        <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/80 text-[9.5px] font-mono text-zinc-400 break-words">
                          Zone: {step.toNodeZone}
                        </div>
                      </div>
                    </div>

                    {/* Next Sequence Handoff Banner */}
                    <div className="px-2.5 py-1.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/60 text-[10.5px] font-mono text-indigo-900 dark:text-indigo-200 leading-snug break-words">
                      ↪ {step.continuationHint}
                    </div>
                  </div>
                )}

                {/* 3/4. Practical Under-the-Hood Mechanism & Specs */}
                <div
                  data-testid={`step-guide-under-the-hood-${step.stepNumber}`}
                  className="p-3 rounded-lg bg-indigo-50/45 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-800/60 space-y-2"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isSeparatedScenario
                        ? '3. Under the Hood (How It Works in Practice & Key Specs):'
                        : '4. Under the Hood (How It Works in Practice & Key Specs):'}
                    </span>
                  </div>
                  <StructuredClausesList
                    clauses={step.structuredPracticeClauses}
                    accent="slate"
                  />
                  {step.commandBreakdowns &&
                    step.commandBreakdowns.length > 0 && (
                      <CommandBreakdownList
                        commands={step.commandBreakdowns}
                        stageNumber={step.stepNumber}
                      />
                    )}
                  {step.keySpecs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {step.keySpecs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-indigo-200/80 dark:border-indigo-800/70"
                        >
                          <Terminal className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                          <span className="break-words">
                            <strong>{spec.term}:</strong> {spec.value}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4/5. Step-Specific Visual State Machine (process cascade → Process Hierarchy) */}
                {stepDiagram && (
                  <div
                    data-testid={`step-guide-structural-diagram-${step.stepNumber}`}
                    className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-indigo-200/80 dark:border-indigo-500/30 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        <Terminal className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isSeparatedScenario ? '4' : '5'}. Visual State Machine
                          (S{step.stepNumber})
                        </span>
                      </span>
                      <span className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
                        {stepDiagram.structuralStateCard.kindLabel}
                      </span>
                    </div>

                    {/* Step State Differential Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10.5px] font-mono">
                      <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                        <div className="text-[9px] font-extrabold uppercase text-zinc-500">
                          [1] INPUT / ENTRY SPEC
                        </div>
                        <div className="text-zinc-800 dark:text-zinc-200 leading-snug break-words mt-0.5">
                          {stepDiagram.structuralStateCard.beforeState}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-700/40">
                        <div className="text-[9px] font-extrabold uppercase text-amber-700 dark:text-amber-300">
                          [2] EXECUTED OPERATION ──▶
                        </div>
                        <div className="text-zinc-900 dark:text-zinc-100 font-semibold leading-snug break-words mt-0.5">
                          {stepDiagram.structuralStateCard.operationExecuted}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-700/40">
                        <div className="text-[9px] font-extrabold uppercase text-rose-700 dark:text-rose-300">
                          [3] RESULTING STATE
                        </div>
                        <div className="text-zinc-900 dark:text-zinc-100 leading-snug break-words mt-0.5">
                          {stepDiagram.structuralStateCard.resultingState}
                        </div>
                      </div>
                    </div>

                    {/* Cascading Process lives only on Process Hierarchy — pointer when present */}
                    {stepDiagram.stepProcessCascade.length > 0 &&
                      onOpenProcessHierarchy && (
                        <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[10.5px] text-zinc-600 dark:text-zinc-400 leading-snug">
                            Parent → Child process tree for this stage is on the
                            Process Hierarchy tab.
                          </p>
                          <button
                            type="button"
                            data-testid={`step-guide-open-process-hierarchy-${step.stepNumber}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenProcessHierarchy();
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[9.5px] font-mono font-bold transition-colors cursor-pointer shrink-0"
                          >
                            <GitCommitHorizontal className="w-3 h-3 shrink-0" />
                            <span>Open Process Hierarchy</span>
                          </button>
                        </div>
                      )}
                  </div>
                )}

                {/* 5/6. Documented Forensic & SIEM Sensor Evidence (With Visual Sensor Node Icon) */}
                <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 min-w-0">
                      <div className="w-8 h-7 rounded bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center p-0.5 shrink-0">
                        <SketchNodeIcon
                          iconType={step.siemNodeIcon}
                          isActive={isActive}
                          isCompromised={false}
                        />
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 leading-snug break-words">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isSeparatedScenario ? '5' : '6'}. Documented SIEM Sensor Catch · Node {step.siemNodeCircled} (#
                          {step.siemNodeOrder} {step.siemNodeLabel})
                        </span>
                      </span>
                    </div>

                    {step.telemetryEvent && onSelectTelemetry && (
                      <button
                        type="button"
                        data-testid={`step-guide-inspect-packet-${step.stepNumber}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (step.telemetryEvent) {
                            onSelectTelemetry(step.telemetryEvent);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[9.5px] font-mono font-bold transition-colors cursor-pointer shrink-0"
                      >
                        <FileSearch className="w-3 h-3 shrink-0" />
                        <span>Inspect Packet</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-950 dark:text-emerald-100/90 leading-relaxed break-words">
                    {step.detectionAndEvidence}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
          </>
        );

        return cardsContent;
      })()}

      {/* OUTRO COMPLETE CARD when walkthrough finishes */}
      {briefing.isOutroComplete && (
        <div
          ref={outroRef}
          data-testid="step-guide-outro-complete"
          className="p-3 rounded-xl bg-emerald-950 text-white border border-emerald-500/60 space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>ATTACK SCENARIO COMPLETE</span>
            </div>
            {onStartWalkthrough && (
              <button
                type="button"
                onClick={onStartWalkthrough}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10.5px] font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-emerald-100 leading-relaxed">
            {`Completed all ${briefing.totalStages} documented steps from "${briefing.originNodeLabel}" to "${briefing.finalNodeLabel}".`}
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
