'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import {
  AttackScenario,
  TelemetryEvent,
} from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
} from '@/lib/simulation-engine';
import { CinematicPhase } from '@/lib/cinematic-camera-director';
import { buildDiagramStepGuideModel } from '@/lib/scenario-step-guides';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Cpu,
  FileSearch,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface StepByStepGuidePanelProps {
  scenario: AttackScenario;
  activeStageIndex: number;
  cinematicPhase?: CinematicPhase | null;
  isPlaying?: boolean;
  activeEnvironment?: ActiveEnvironmentId;
  onSelectStage?: (stageIndex: number) => void;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
  onStartWalkthrough?: () => void;
  onTogglePlay?: () => void;
  onResetWalkthrough?: () => void;
}

export function StepByStepGuidePanel({
  scenario,
  activeStageIndex,
  cinematicPhase = 'OVERVIEW',
  isPlaying = false,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  onSelectStage,
  onSelectTelemetry,
  onStartWalkthrough,
  onTogglePlay,
  onResetWalkthrough,
}: StepByStepGuidePanelProps) {
  const resolvedPhase: CinematicPhase = cinematicPhase ?? 'OVERVIEW';
  const briefingRef = useRef<HTMLDivElement | null>(null);
  const stepCardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const outroRef = useRef<HTMLDivElement | null>(null);

  const guideModel = useMemo(
    () =>
      buildDiagramStepGuideModel(
        scenario,
        activeStageIndex,
        resolvedPhase,
        activeEnvironment
      ),
    [scenario, activeStageIndex, resolvedPhase, activeEnvironment]
  );

  // Automatically scroll the active section into view during Auto-Play or stage changes
  useEffect(() => {
    if (
      cinematicPhase === 'INTRO_SURVEY' ||
      cinematicPhase === 'INTRO_FOCUS_ORIGIN' ||
      activeStageIndex === 0
    ) {
      briefingRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      return;
    }

    if (cinematicPhase === 'OUTRO_COMPLETE') {
      outroRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      return;
    }

    const activeEl = stepCardRefs.current[activeStageIndex];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeStageIndex, cinematicPhase, isPlaying]);

  const { briefing, steps } = guideModel;

  return (
    <div
      data-testid="step-by-step-guide-panel"
      data-is-playing={isPlaying ? 'true' : 'false'}
      data-active-stage={activeStageIndex}
      data-cinematic-phase={cinematicPhase}
      dir="ltr"
      className="space-y-3.5"
    >
      {/* Top Auto-Play Sync & Quick Step Selector Bar */}
      <div
        data-testid="step-guide-autoplay-bar"
        className="p-2.5 rounded-xl bg-zinc-100/95 dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800 space-y-2"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
          <div className="inline-flex items-center gap-1.5 min-w-0">
            {isPlaying ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
                <Radio className="w-3 h-3 animate-pulse shrink-0" />
                <span>AUTO-PLAY LIVE SYNC</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 text-[10px] font-mono font-bold">
                <BookOpen className="w-3 h-3 shrink-0" />
                <span>BRIEFING + {steps.length} NUMBERED STEPS</span>
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
            {briefing.isActiveBriefing
              ? 'STAGE: BRIEFING (#0)'
              : briefing.isOutroComplete
              ? 'STAGE: COMPLETE'
              : `STAGE: #${activeStageIndex} / ${steps.length}`}
          </span>
        </div>

        {/* Playback Controls & Quick Step Jump Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-zinc-200/70 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              data-testid="step-guide-play-toggle-btn"
              onClick={() => {
                if (onTogglePlay) {
                  onTogglePlay();
                } else if (onStartWalkthrough) {
                  onStartWalkthrough();
                }
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 shrink-0" />
                  <span>Pause Walkthrough</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 shrink-0" />
                  <span>Auto-Play Steps</span>
                </>
              )}
            </button>

            {(activeStageIndex > 0 || cinematicPhase !== 'OVERVIEW') && (
              <button
                type="button"
                data-testid="step-guide-reset-briefing-btn"
                onClick={() => {
                  if (onResetWalkthrough) {
                    onResetWalkthrough();
                  } else {
                    onSelectStage?.(0);
                  }
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-200/80 hover:bg-zinc-300/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[10px] font-mono font-semibold text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5 shrink-0" />
                <span>Briefing</span>
              </button>
            )}
          </div>

          {/* Numbered Step Quick Pills */}
          <div
            className="flex items-center gap-1 flex-wrap"
            aria-label="Quick Step Selector"
          >
            <button
              type="button"
              data-testid="step-guide-pill-0"
              onClick={() => onSelectStage?.(0)}
              title="Step #0: Scenario Briefing (Full Topology Survey)"
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                briefing.isActiveBriefing
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              #0
            </button>
            {steps.map((st) => (
              <button
                key={st.stepNumber}
                type="button"
                data-testid={`step-guide-pill-${st.stepNumber}`}
                onClick={() => onSelectStage?.(st.stepNumber)}
                title={`Step #${st.stepNumber}: ${st.plainTitle}`}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                  activeStageIndex === st.stepNumber && !briefing.isActiveBriefing
                    ? 'bg-rose-600 text-white'
                    : activeStageIndex > st.stepNumber || briefing.isOutroComplete
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                #{st.stepNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 0. SCENARIO BRIEFING CARD (Always at the very beginning of the Steps) */}
      <div
        ref={briefingRef}
        data-testid="step-guide-scenario-briefing"
        data-briefing-active={briefing.isActiveBriefing ? 'true' : 'false'}
        onClick={() => onSelectStage?.(0)}
        className={`rounded-xl border transition-all cursor-pointer overflow-hidden ${
          briefing.isActiveBriefing
            ? 'border-amber-500/80 bg-amber-50/60 dark:bg-amber-950/25 shadow-sm ring-1 ring-amber-500/30'
            : 'border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/50 hover:border-amber-500/50'
        }`}
      >
        {/* Briefing Header Strip */}
        <div className="px-3 py-2 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>STEP #0 · SCENARIO BRIEFING</span>
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
            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9.5px] font-mono">
              {briefing.scenarioCode}
            </span>
          </div>
        </div>

        {/* Briefing Body */}
        <div className="p-3 space-y-2.5">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-snug break-words">
            {briefing.headline}
          </h4>

          {/* Start -> N Stages -> Target Topology Bar */}
          <div className="p-2 rounded-lg bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
            <span className="text-amber-300 font-semibold leading-snug break-words">
              START: {briefing.originNodeLabel}
            </span>
            <span className="text-rose-400 font-bold shrink-0">
              ── {briefing.totalStages} STEPS ──▶
            </span>
            <span className="text-emerald-400 font-semibold leading-snug break-words">
              END: {briefing.finalNodeLabel}
            </span>
          </div>

          {/* Plain-Language Summary */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Plain-Language Attack Briefing (From Official Advisory):
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-200 leading-relaxed break-words">
              {briefing.plainSummary}
            </p>
          </div>

          {/* Diagram Layout Explanation */}
          <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
              <Compass className="w-3 h-3 shrink-0" />
              <span>How This Aligns With the Diagram:</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
              {briefing.diagramTopologySummary}
            </p>
          </div>

          {/* Documented Source Footer */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-1 text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
            <span>{briefing.documentedAdvisory}</span>
          </div>
        </div>
      </div>

      {/* NUMBERED STEP-BY-STEP CARDS (#1 .. #N) */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isActive = step.status === 'ACTIVE';
          const isCompleted = step.status === 'COMPLETED';

          return (
            <motion.div
              key={step.stepNumber}
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
              className={`rounded-xl border transition-all cursor-pointer overflow-hidden ${
                isActive
                  ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 shadow-md ring-1 ring-rose-500/35'
                  : isCompleted
                  ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 hover:border-emerald-500/70'
                  : 'border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/40 hover:border-indigo-500/50'
              }`}
            >
              {/* Step Card Header */}
              <div
                className={`px-3 py-2 flex flex-wrap items-center justify-between gap-2 border-b ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-700'
                    : isCompleted
                    ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/70'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-800'
                }`}
              >
                <div className="inline-flex items-center gap-2 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono font-extrabold shrink-0 ${
                      isActive
                        ? 'bg-white text-rose-700'
                        : isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    STEP #{step.stepNumber}
                  </span>
                  <span className="text-[10.5px] font-mono font-semibold leading-snug break-words">
                    {step.stageTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
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
                      isActive
                        ? 'bg-rose-800/90 text-rose-100'
                        : 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {step.mitreId}
                  </span>
                </div>
              </div>

              {/* Step Card Content */}
              <div className="p-3 space-y-2.5">
                {/* Plain Title */}
                <h5 className="text-xs font-bold text-zinc-900 dark:text-white leading-snug break-words">
                  {step.plainTitle}
                </h5>

                {/* Plain-Language Explanation */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    In Plain Language (Grounded in Official Docs):
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-200 leading-relaxed break-words">
                    {step.simpleExplanation}
                  </p>
                </div>

                {/* Practical Under-the-Hood Explanation */}
                <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-800/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
                    <Cpu className="w-3 h-3 shrink-0" />
                    <span>Why & How This Mechanism Works:</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
                    {step.howItWorksInPractice}
                  </p>
                </div>

                {/* Diagram Connection Box */}
                <div className="p-2.5 rounded-lg bg-zinc-100/90 dark:bg-zinc-950/90 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">
                    <span>On the Diagram:</span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {step.protocolOrEventId}
                    </span>
                  </div>

                  {/* Node-to-Node & Flow Badges */}
                  <div className="flex flex-col gap-1 text-[10px] font-mono">
                    <div className="flex flex-wrap items-center gap-1 text-zinc-800 dark:text-zinc-200">
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-semibold leading-snug break-words">
                        {step.fromNodeBadge}
                      </span>
                      <ArrowRight className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-semibold leading-snug break-words">
                        {step.toNodeBadge}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-semibold leading-snug break-words">
                        {step.forwardFlowBadge}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold leading-snug break-words">
                        {step.returnFlowBadge}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
                    {step.diagramAlignment}
                  </p>
                </div>

                {/* Documented Forensic / SIEM Evidence */}
                <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                      <ShieldAlert className="w-3 h-3 shrink-0" />
                      <span>Documented Forensic & SIEM Evidence:</span>
                    </span>

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
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[9.5px] font-mono font-bold transition-colors cursor-pointer shrink-0"
                      >
                        <FileSearch className="w-2.5 h-2.5 shrink-0" />
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
  );
}
