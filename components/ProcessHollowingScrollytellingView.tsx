'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  HardDrive,
  KeyRound,
  Layers,
  Lock,
  Network,
  PauseCircle,
  PlayCircle,
  Radar,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Unlock,
} from 'lucide-react';
import { AttackScenario } from '@/lib/scenarios/types';
import { PROCESS_HOLLOWING_SCENARIO } from '@/lib/scenarios/process-hollowing';
import {
  ProcessHollowingStageVisualState,
  ProcessHollowingSubStepId,
  clampUnitProgress,
} from '@/lib/process-hollowing-scrollytelling';
import {
  UniversalExplanationLayerKind,
  UniversalScrollyChapterSpec,
  UniversalScrollySubStepSpec,
  UniversalScrollyVisualState,
  computeSubStepScrollThresholdEffect,
  computeUniversalScrollyVisualState,
  getUniversalScenarioScrollySpec,
} from '@/lib/universal-scrollytelling';
import { SketchNodeIcon } from './SketchNodeIcons';
import { NotebookLmInteractiveShapeCanvas } from './NotebookLmInteractiveShapeCanvas';

export interface ProcessHollowingScrollytellingViewProps {
  /**
   * Scenario to render in synchronized cinematic scrollytelling mode.
   * Defaults to PROCESS_HOLLOWING_SCENARIO if omitted for backward compatibility.
   */
  scenario?: AttackScenario;
  /**
   * The explanation cards (#0 Briefing and Stages #1..#N) rendered
   * in the right column alongside the sticky animated diagram on the left.
   * Each stage card inside children carries `data-scrolly-stage="0..N"`,
   * and each granular sub-step card carries `data-scrolly-substep="0A..ND"`.
   */
  children?: React.ReactNode;
  activeStageIndex?: number;
}

const LETTER_TO_STAGE_PROGRESS: Record<string, number> = {
  A: 0.12,
  B: 0.37,
  C: 0.62,
  D: 0.88,
};

function parseSubStepIdToStageAndProgress(subStepId: string): {
  stageNumber: number;
  stageProgress: number;
} {
  const match = /^(\d+)([A-D])$/i.exec(subStepId.trim());
  if (!match) {
    return { stageNumber: 0, stageProgress: 0.12 };
  }
  const stageNumber = Number.parseInt(match[1], 10);
  const letter = match[2].toUpperCase();
  return {
    stageNumber: Number.isFinite(stageNumber) ? stageNumber : 0,
    stageProgress: LETTER_TO_STAGE_PROGRESS[letter] ?? 0.12,
  };
}

interface UniversalScrollyContextValue {
  scenario: AttackScenario;
  visualState: UniversalScrollyVisualState;
  focusedMotionIndex: 0 | 1 | 2;
  onSelectSubStep: (subStepId: string) => void;
  onSelectMotion: (subStepId: string, motionIndex: 0 | 1 | 2) => void;
}

const ProcessHollowingScrollyContext =
  createContext<UniversalScrollyContextValue | null>(null);

/**
 * Distinct styling themes per explanation layer (Non-Technical Analogy vs. Sequence Bridge vs. Technical Deep-Dive vs. Forensic SIEM Catch)
 * so every explanation card and its active right-column scroll marker have a customized visual identity.
 */
function getLayerStyleTokens(layerKind: UniversalExplanationLayerKind): {
  cardIdleBg: string;
  cardActiveBg: string;
  cardActiveBorder: string;
  badgeBg: string;
  layerPillClass: string;
  markerAccentHex: string;
  markerBgClass: string;
} {
  switch (layerKind) {
    case 'ANALOGY_NARRATIVE':
      return {
        cardIdleBg:
          'bg-amber-50/35 dark:bg-amber-950/15 border-amber-200/80 dark:border-amber-800/60 hover:border-amber-400',
        cardActiveBg: 'bg-amber-50/85 dark:bg-zinc-900',
        cardActiveBorder:
          'border-amber-500 shadow-sm ring-1 ring-amber-500/35',
        badgeBg: 'bg-amber-600 text-white',
        layerPillClass:
          'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
        markerAccentHex: '#d97706',
        markerBgClass: 'bg-amber-500',
      };
    case 'CONCEPT_BRIDGE':
      return {
        cardIdleBg:
          'bg-indigo-50/35 dark:bg-indigo-950/15 border-indigo-200/80 dark:border-indigo-800/60 hover:border-indigo-400',
        cardActiveBg: 'bg-indigo-50/80 dark:bg-zinc-900',
        cardActiveBorder:
          'border-indigo-500 shadow-sm ring-1 ring-indigo-500/35',
        badgeBg: 'bg-indigo-600 text-white',
        layerPillClass:
          'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30',
        markerAccentHex: '#4f46e5',
        markerBgClass: 'bg-indigo-600',
      };
    case 'TECHNICAL_DEEP_DIVE':
      return {
        cardIdleBg:
          'bg-rose-50/30 dark:bg-rose-950/15 border-rose-200/80 dark:border-rose-800/60 hover:border-rose-400',
        cardActiveBg: 'bg-rose-50/80 dark:bg-zinc-900',
        cardActiveBorder: 'border-rose-500 shadow-sm ring-1 ring-rose-500/35',
        badgeBg: 'bg-rose-600 text-white',
        layerPillClass:
          'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30',
        markerAccentHex: '#e11d48',
        markerBgClass: 'bg-rose-600',
      };
    case 'FORENSIC_DETECTION':
      return {
        cardIdleBg:
          'bg-emerald-50/35 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-400',
        cardActiveBg: 'bg-emerald-50/80 dark:bg-zinc-900',
        cardActiveBorder:
          'border-emerald-500 shadow-sm ring-1 ring-emerald-500/35',
        badgeBg: 'bg-emerald-600 text-white',
        layerPillClass:
          'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
        markerAccentHex: '#059669',
        markerBgClass: 'bg-emerald-600',
      };
  }
}

/**
 * Renders the 4 synchronized Cinematic Storyboard & Technical Explanation sub-cards
 * (`A -> B -> C -> D`) inside each stage card in the right-hand explanation column.
 * Includes the synchronized Right-Column Active Scroll Marker ("Mark") so as the user scrolls,
 * the active section on the right is visually marked and locked 1-to-1 with the left sticky stage,
 * and each card exposes clickable MOTION ① / MOTION ② / MOTION ③ pills that describe and trigger
 * the exact shape-to-shape & internal shape animations on the left NotebookLM canvas.
 */
export function ProcessHollowingSyncedSubStepsList({
  stageNumber,
  scenario: propScenario,
}: {
  stageNumber: number;
  scenario?: AttackScenario;
}) {
  const ctx = useContext(ProcessHollowingScrollyContext);
  const effectiveScenario =
    propScenario || ctx?.scenario || PROCESS_HOLLOWING_SCENARIO;

  const spec = useMemo(
    () => getUniversalScenarioScrollySpec(effectiveScenario),
    [effectiveScenario]
  );

  const chapter = useMemo(
    () =>
      spec.chapters.find((c) => c.stageNumber === stageNumber) ||
      spec.chapters[0],
    [spec.chapters, stageNumber]
  );

  const isActiveStage = ctx?.visualState.stageNumber === chapter.stageNumber;

  return (
    <div
      data-testid={`scrolly-synced-substeps-stage-${stageNumber}`}
      className={`relative p-3 rounded-xl border transition-colors space-y-2.5 ${
        isActiveStage
          ? 'bg-indigo-50/60 dark:bg-indigo-950/35 border-indigo-400/90 dark:border-indigo-600/80 shadow-xs'
          : 'bg-indigo-50/35 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-800/60'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>
            Synchronized Cinematic Motion Breakdown ({chapter.subSteps.length}{' '}
            Phases · {chapter.timeRangeRef})
          </span>
        </span>
        <div className="flex items-center gap-1.5">
          {isActiveStage && (
            <span
              data-testid={`scrolly-stage-active-indicator-${stageNumber}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono text-[9px] font-extrabold shadow-2xs"
            >
              <ArrowLeft className="w-2.5 h-2.5 shrink-0" />
              <span>SYNCED WITH LEFT STAGE</span>
            </span>
          )}
          <span className="text-[9.5px] font-mono font-semibold text-zinc-500 dark:text-zinc-400">
            Scroll or click any phase / motion cue to animate shapes on the left stage
          </span>
        </div>
      </div>

      {/* Synchronized Right-Column Sub-Step Explanation Cards with Left-Side Scroll Match Rail & Marker */}
      <div className="relative pl-4 sm:pl-5 space-y-2.5">
        {/* Continuous Left-Edge Scroll Synchronization Track Rail */}
        <div
          aria-hidden="true"
          className="absolute left-1.5 top-2 bottom-2 w-1 rounded-full bg-zinc-200/90 dark:bg-zinc-800 overflow-hidden"
        />

        {chapter.subSteps.map((sub) => {
          const isCurrentSubStep = ctx?.visualState.activeSubStepId === sub.id;
          const isCompletedSubStep = Boolean(
            ctx &&
              (ctx.visualState.stageNumber > sub.stageNumber ||
                (ctx.visualState.stageNumber === sub.stageNumber &&
                  ctx.visualState.subStepIndex > sub.subStepIndex))
          );

          const overallProgress = ctx?.visualState.overallProgress ?? 0;
          const thresholdEffect = computeSubStepScrollThresholdEffect(
            overallProgress,
            sub,
            Boolean(isCurrentSubStep)
          );
          const layerTokens = getLayerStyleTokens(sub.layerKind);

          return (
            <motion.div
              key={sub.id}
              data-scrolly-substep={sub.id}
              data-testid={`scrolly-explanation-card-${sub.id}`}
              data-active-match={isCurrentSubStep ? 'true' : 'false'}
              data-mechanism-kind={sub.shapeChoreography.mechanismKind}
              animate={{
                opacity: thresholdEffect.opacity,
                y: thresholdEffect.translateY,
                scale: thresholdEffect.scale,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={(e) => {
                e.stopPropagation();
                ctx?.onSelectSubStep(sub.id);
              }}
              className={`relative p-3 rounded-xl border-2 transition-colors cursor-pointer space-y-1.5 ${
                isCurrentSubStep
                  ? `${layerTokens.cardActiveBg} ${layerTokens.cardActiveBorder}`
                  : isCompletedSubStep
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-400/50 dark:border-emerald-800/60 hover:border-emerald-500'
                    : layerTokens.cardIdleBg
              }`}
            >
              {/* RIGHT-COLUMN SYNCHRONIZED ACTIVE SCROLL MARKER ("نشانگر کنار بخش فعال") */}
              <div
                aria-hidden="true"
                className="absolute -left-4 sm:-left-5 top-0 bottom-0 w-4 sm:w-5 flex flex-col items-center justify-center pointer-events-none"
              >
                {isCurrentSubStep ? (
                  <motion.div
                    layoutId={`scrolly-right-column-active-mark-${effectiveScenario.id}`}
                    data-testid="scrolly-active-right-marker"
                    data-active-substep-marker={sub.id}
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    className="relative flex items-center justify-center"
                  >
                    {/* Vertical Glowing Bar along active explanation section */}
                    <div
                      className={`w-1.5 h-12 rounded-full ${layerTokens.markerBgClass} shadow-sm`}
                    />
                    {/* Morphing SVG Pointer Badge pointing left to the synchronized stage */}
                    <div className="absolute -left-1.5 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border-2 border-rose-500 shadow-sm flex items-center justify-center">
                      <svg
                        viewBox="0 0 28 28"
                        className="w-3.5 h-3.5 overflow-visible"
                      >
                        <motion.path
                          d={
                            ctx?.visualState.interpolatedIndicatorPathD ||
                            sub.morphConfig.indicatorMorphPathD
                          }
                          fill={layerTokens.markerAccentHex}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </motion.div>
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isCompletedSubStep
                        ? 'bg-emerald-500'
                        : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  />
                )}
              </div>

              {/* Top Row: Phase Code + Customized Layer Style Badge + Active Left-Stage Match Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-extrabold ${
                      isCurrentSubStep
                        ? layerTokens.badgeBg
                        : isCompletedSubStep
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-800 dark:bg-zinc-700 text-white'
                    }`}
                  >
                    PHASE {sub.id} · {sub.clauseNumber}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded border font-mono text-[9px] font-extrabold ${layerTokens.layerPillClass}`}
                  >
                    {sub.layerKindBadge}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[9.5px] font-bold">
                    {sub.timestampRef}
                  </span>
                  <span className="font-mono text-[10.5px] font-extrabold text-zinc-800 dark:text-zinc-200">
                    {sub.clauseTitle}
                  </span>
                </div>

                {isCurrentSubStep ? (
                  <span
                    data-testid={`scrolly-live-match-badge-${sub.id}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono text-[9px] font-extrabold shadow-2xs"
                  >
                    <ArrowLeft className="w-2.5 h-2.5 shrink-0" />
                    <Radio className="w-2.5 h-2.5 shrink-0 animate-pulse" />
                    <span>LIVE MATCH ON LEFT STAGE ({sub.id})</span>
                  </span>
                ) : (
                  <span className="font-mono text-[9px] font-semibold text-zinc-400 dark:text-zinc-500">
                    Scroll {Math.round(sub.scrollThresholdStart * 100)}%–
                    {Math.round(sub.scrollThresholdEnd * 100)}%
                  </span>
                )}
              </div>

              {/* Headline & Scroll-Threshold Faded Explanation Text */}
              <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-snug break-words">
                {sub.headline}
              </div>

              <motion.p
                animate={{
                  opacity: isCurrentSubStep
                    ? 1
                    : Math.max(0.68, thresholdEffect.opacity),
                }}
                transition={{ duration: 0.2 }}
                className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed break-words"
              >
                {sub.explanation}
              </motion.p>

              {/* Layer-Specific Technical / Story / Forensic Footer Strip */}
              <div className="pt-1.5 flex flex-wrap items-center justify-between gap-1.5 border-t border-zinc-200/70 dark:border-zinc-800/80 font-mono text-[10px]">
                <span className="text-amber-800 dark:text-amber-300 font-semibold break-words">
                  <strong>
                    {sub.layerKind === 'ANALOGY_NARRATIVE'
                      ? 'Story Mapping:'
                      : sub.layerKind === 'CONCEPT_BRIDGE'
                        ? 'Sequence Exchange:'
                        : sub.layerKind === 'FORENSIC_DETECTION'
                          ? 'Sensor Correlation:'
                          : 'Visual / Memory State:'}
                  </strong>{' '}
                  {sub.stateDeltaSummary}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
                  {sub.protocolBadge} · {sub.returnBadge}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProcessHollowingScrollytellingView({
  scenario: propScenario,
  children,
  activeStageIndex = 0,
}: ProcessHollowingScrollytellingViewProps) {
  const scenario = propScenario || PROCESS_HOLLOWING_SCENARIO;
  const maxStageIndex = scenario.stages.length;

  const [scrollState, setScrollState] = useState<{
    stageNumber: number;
    stageProgress: number;
  }>(() => ({
    stageNumber:
      typeof activeStageIndex === 'number' &&
      activeStageIndex >= 0 &&
      activeStageIndex <= maxStageIndex
        ? activeStageIndex
        : 0,
    stageProgress: 0.12,
  }));

  const [manualMotionOverride, setManualMotionOverride] = useState<{
    subStepId: string;
    motionIndex: 0 | 1 | 2;
  } | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimeoutRef = useRef<number | null>(null);

  // Framer Motion useScroll hook for window scroll tracking + custom MotionValue for inner overflow-y-auto containers
  const { scrollYProgress: windowScrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });
  const containerScrollProgress = useMotionValue(0);
  const smoothScrollProgress = useSpring(containerScrollProgress, {
    stiffness: 210,
    damping: 30,
    mass: 0.35,
  });

  const visualState = useMemo(
    () =>
      computeUniversalScrollyVisualState(
        scenario,
        scrollState.stageNumber,
        scrollState.stageProgress
      ),
    [scenario, scrollState.stageNumber, scrollState.stageProgress]
  );

  // Keep smoothScrollProgress synchronized with visualState.overallProgress
  useEffect(() => {
    containerScrollProgress.set(visualState.overallProgress);
  }, [visualState.overallProgress, containerScrollProgress]);

  // Core DOM measurement routine invoked by framer-motion's useScroll event AND inner container scroll events
  const evaluateScrollPosition = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const stageElements = Array.from(
      wrapper.querySelectorAll<HTMLElement>('[data-scrolly-stage]')
    );
    if (stageElements.length === 0) return;

    const scroller = stageElements[0].closest(
      '.overflow-y-auto'
    ) as HTMLElement | null;
    const viewportTop = scroller ? scroller.getBoundingClientRect().top : 0;
    const viewportHeight = scroller
      ? scroller.clientHeight
      : window.innerHeight;

    // Reading focal line at 38% down the scroll viewport
    const focalY = viewportTop + viewportHeight * 0.38;

    // 1. Check granular [data-scrolly-substep] cards first for continuous 1-to-1 paragraph & SVG morph sync
    const subStepElements = Array.from(
      wrapper.querySelectorAll<HTMLElement>('[data-scrolly-substep]')
    );
    if (subStepElements.length > 0) {
      let bestSubEl: HTMLElement | null = null;
      let bestSubId: string | null = null;
      let bestSubDistance = Number.POSITIVE_INFINITY;

      for (const subEl of subStepElements) {
        const rawSubId = subEl.getAttribute('data-scrolly-substep');
        if (!rawSubId) continue;

        const rect = subEl.getBoundingClientRect();
        if (rect.height <= 0) continue;

        if (focalY >= rect.top && focalY <= rect.bottom) {
          bestSubEl = subEl;
          bestSubId = rawSubId;
          bestSubDistance = 0;
          break;
        }

        const dist =
          focalY < rect.top ? rect.top - focalY : focalY - rect.bottom;
        if (dist < bestSubDistance) {
          bestSubDistance = dist;
          bestSubId = rawSubId;
          bestSubEl = subEl;
        }
      }

      if (bestSubId && bestSubEl && bestSubDistance < 280) {
        const parsed = parseSubStepIdToStageAndProgress(bestSubId);
        const rect = bestSubEl.getBoundingClientRect();
        // Compute continuous intra-substep progress (0..1) so SVG paths morph smoothly as the user scrolls inside each card
        const localRatio = clampUnitProgress(
          (focalY - rect.top) / Math.max(1, rect.height)
        );
        const baseIndex = Math.floor(parsed.stageProgress * 4); // 0..3
        const continuousStageProgress = clampUnitProgress(
          (baseIndex + Math.min(0.96, Math.max(0.04, localRatio))) / 4
        );

        setScrollState((prev) => {
          if (
            prev.stageNumber === parsed.stageNumber &&
            Math.abs(prev.stageProgress - continuousStageProgress) < 0.008
          ) {
            return prev;
          }
          return {
            stageNumber: parsed.stageNumber,
            stageProgress: continuousStageProgress,
          };
        });
        return;
      }
    }

    // 2. Fallback: continuous progress within the active [data-scrolly-stage] card
    let matchedStage = 0;
    let matchedProgress = 0.12;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const el of stageElements) {
      const rawStageAttr = el.getAttribute('data-scrolly-stage');
      const stageNum = rawStageAttr ? Number.parseInt(rawStageAttr, 10) : 0;
      if (!Number.isFinite(stageNum)) continue;

      const rect = el.getBoundingClientRect();
      if (rect.height <= 0) continue;

      if (focalY >= rect.top && focalY <= rect.bottom) {
        matchedStage = stageNum;
        matchedProgress = clampUnitProgress(
          (focalY - rect.top) / Math.max(1, rect.height)
        );
        bestDistance = 0;
        break;
      }

      const distanceToCard =
        focalY < rect.top ? rect.top - focalY : focalY - rect.bottom;
      if (distanceToCard < bestDistance) {
        bestDistance = distanceToCard;
        matchedStage = stageNum;
        matchedProgress = focalY < rect.top ? 0.08 : 0.92;
      }
    }

    setScrollState((prev) => {
      if (
        prev.stageNumber === matchedStage &&
        Math.abs(prev.stageProgress - matchedProgress) < 0.01
      ) {
        return prev;
      }
      return {
        stageNumber: matchedStage,
        stageProgress: matchedProgress,
      };
    });
  }, []);

  // Subscribe to framer-motion's useScroll motion value changes for window scroll synchronization
  useMotionValueEvent(windowScrollYProgress, 'change', () => {
    evaluateScrollPosition();
  });

  // Also bind passive scroll capture listener so inner .overflow-y-auto containers (e.g. InspectorPanel) trigger frame-accurate updates
  useEffect(() => {
    let rafId: number | null = null;
    const onScroll = (e: Event) => {
      if (
        e.target instanceof Element &&
        e.target.closest('[data-testid="process-hollowing-sticky-stage"]')
      ) {
        return;
      }
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        evaluateScrollPosition();
      });
    };

    window.addEventListener('scroll', onScroll, {
      passive: true,
      capture: true,
    });
    return () => {
      window.removeEventListener('scroll', onScroll, {
        capture: true,
      });
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (programmaticTimeoutRef.current !== null) {
        window.clearTimeout(programmaticTimeoutRef.current);
      }
    };
  }, [evaluateScrollPosition]);

  // Jump to a specific sub-step when the user clicks a sub-step pill, Prev/Next, or explanation card
  const handleSelectSubStep = useCallback((subStepId: string) => {
    const parsed = parseSubStepIdToStageAndProgress(subStepId);

    setScrollState({
      stageNumber: parsed.stageNumber,
      stageProgress: parsed.stageProgress,
    });

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const subStepEl = wrapper.querySelector<HTMLElement>(
      `[data-scrolly-substep="${subStepId}"]`
    );
    const stageEl = wrapper.querySelector<HTMLElement>(
      `[data-scrolly-stage="${parsed.stageNumber}"]`
    );
    const targetEl = subStepEl ?? stageEl;
    if (!targetEl) return;

    const scroller = targetEl.closest(
      '.overflow-y-auto'
    ) as HTMLElement | null;
    const targetRect = targetEl.getBoundingClientRect();
    const targetPointViewportY = subStepEl
      ? targetRect.top + Math.min(targetRect.height * 0.35, 90)
      : targetRect.top + targetRect.height * parsed.stageProgress;

    isProgrammaticScrollRef.current = true;
    if (programmaticTimeoutRef.current !== null) {
      window.clearTimeout(programmaticTimeoutRef.current);
    }

    if (scroller) {
      const scrollerRect = scroller.getBoundingClientRect();
      const desiredFocalY = scrollerRect.top + scroller.clientHeight * 0.38;
      const deltaY = targetPointViewportY - desiredFocalY;
      scroller.scrollTo({
        top: Math.max(0, scroller.scrollTop + deltaY),
        behavior: 'smooth',
      });
    } else {
      const desiredFocalY = window.innerHeight * 0.38;
      const deltaY = targetPointViewportY - desiredFocalY;
      window.scrollTo({
        top: Math.max(0, window.scrollY + deltaY),
        behavior: 'smooth',
      });
    }

    programmaticTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 950);
  }, []);

  const focusedMotionIndex: 0 | 1 | 2 =
    manualMotionOverride &&
    manualMotionOverride.subStepId === visualState.activeSubStepId
      ? manualMotionOverride.motionIndex
      : visualState.activeMotionIndex;

  const handleSelectMotion = useCallback(
    (subStepId: string, motionIndex: 0 | 1 | 2) => {
      setManualMotionOverride({ subStepId, motionIndex });
      if (visualState.activeSubStepId !== subStepId) {
        handleSelectSubStep(subStepId);
      }
    },
    [visualState.activeSubStepId, handleSelectSubStep]
  );

  const contextValue = useMemo<UniversalScrollyContextValue>(
    () => ({
      scenario,
      visualState,
      focusedMotionIndex,
      onSelectSubStep: handleSelectSubStep,
      onSelectMotion: handleSelectMotion,
    }),
    [
      scenario,
      visualState,
      focusedMotionIndex,
      handleSelectSubStep,
      handleSelectMotion,
    ]
  );

  return (
    <ProcessHollowingScrollyContext.Provider value={contextValue}>
      <div
        ref={wrapperRef}
        dir="ltr"
        data-testid="process-hollowing-scrollytelling-view"
        data-scenario-id={scenario.id}
        data-archetype={visualState.archetype}
        className="w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Sticky Scroll-Driven Animated Diagram + Morphing SVG Conduit + Synchronized Narrator */}
          <div className="lg:col-span-5 lg:sticky lg:top-3 z-20">
            <ProcessHollowingStickyStage
              visualState={visualState}
              smoothScrollProgress={smoothScrollProgress}
              focusedMotionIndex={focusedMotionIndex}
              onSelectSubStep={handleSelectSubStep}
              onSelectMotion={(motionIdx) =>
                handleSelectMotion(visualState.activeSubStepId, motionIdx)
              }
            />
          </div>

          {/* RIGHT COLUMN: Synchronized Explanation Cards with Active Scroll Marker */}
          <div className="lg:col-span-7 min-w-0 space-y-4">{children}</div>
        </div>
      </div>
    </ProcessHollowingScrollyContext.Provider>
  );
}

interface ProcessHollowingStickyStageProps {
  visualState: UniversalScrollyVisualState;
  smoothScrollProgress?: ReturnType<typeof useSpring>;
  focusedMotionIndex?: 0 | 1 | 2;
  onSelectSubStep: (id: string) => void;
  onSelectMotion?: (motionIdx: 0 | 1 | 2) => void;
}

export function ProcessHollowingStickyStage({
  visualState,
  focusedMotionIndex,
  onSelectSubStep,
  onSelectMotion,
}: ProcessHollowingStickyStageProps) {
  const { activeChapter: chapter, activeSubStep: subStep, allSubSteps, palette } =
    visualState;
  const effectiveMotionIndex: 0 | 1 | 2 =
    focusedMotionIndex ?? visualState.activeMotionIndex;

  const currentGlobalIdx = allSubSteps.findIndex((s) => s.id === subStep.id);
  const prevSubStep =
    currentGlobalIdx > 0 ? allSubSteps[currentGlobalIdx - 1] : null;
  const nextSubStep =
    currentGlobalIdx >= 0 && currentGlobalIdx < allSubSteps.length - 1
      ? allSubSteps[currentGlobalIdx + 1]
      : null;

  const layerTokens = getLayerStyleTokens(subStep.layerKind);

  return (
    <motion.div
      data-testid="process-hollowing-sticky-stage"
      data-active-substep={subStep.id}
      data-active-choreography={subStep.visualChoreography}
      className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-sm overflow-hidden text-zinc-900 dark:text-zinc-100"
    >
      {/* 1. Compact Top Header Strip with Scenario Archetype Identity & Phase Scrubber */}
      <div className="px-3 py-2 bg-zinc-100/95 dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <div className="inline-flex items-center gap-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9px] font-extrabold">
              <Sparkles className="w-2.5 h-2.5 shrink-0" />
              <span>LIVE SCROLL</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/25 font-mono text-[9px] font-bold">
              {chapter.stageNumber === 0
                ? 'STAGE #0 · BRIEFING'
                : `STAGE #${chapter.stageNumber} · ${chapter.mitreCode.split('·')[0]?.trim()}`}
            </span>
            <span className="hidden xl:inline-block px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[8.5px] font-bold">
              {palette.themeLabel}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-mono text-[8.5px] font-extrabold text-rose-600 dark:text-rose-400 mr-0.5">
              MATCH: {subStep.id} ({Math.round(visualState.overallProgress * 100)}%)
            </span>
            <button
              type="button"
              disabled={!prevSubStep}
              data-testid="scrolly-prev-substep-btn"
              onClick={() => prevSubStep && onSelectSubStep(prevSubStep.id)}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[9px] font-bold text-zinc-700 dark:text-zinc-300 disabled:opacity-40 hover:border-indigo-400 cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-2.5 h-2.5" />
              <span>Prev</span>
            </button>
            <span className="px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[9px] font-bold">
              {subStep.timestampRef}
            </span>
            <button
              type="button"
              disabled={!nextSubStep}
              data-testid="scrolly-next-substep-btn"
              onClick={() => nextSubStep && onSelectSubStep(nextSubStep.id)}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[9px] font-bold text-zinc-700 dark:text-zinc-300 disabled:opacity-40 hover:border-indigo-400 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* All Sub-Step Scrubber Pills (0A..ND) in Ultra-Compact Row */}
        <div
          role="tablist"
          aria-label={`${visualState.scenarioName} Cinematic Sub-Steps`}
          className="flex items-center gap-0.5 flex-wrap"
        >
          {allSubSteps.map((s) => {
            const isCurrent = s.id === subStep.id;
            const isSameStage = s.stageNumber === visualState.stageNumber;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                data-testid={`scrolly-substep-btn-${s.id}`}
                onClick={() => onSelectSubStep(s.id)}
                title={`${s.badgeLabel}: ${s.headline}`}
                className={`relative px-1.5 py-0.5 rounded font-mono text-[8.5px] leading-none font-bold transition-colors cursor-pointer ${
                  isCurrent
                    ? 'text-white'
                    : isSameStage
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                      : 'bg-zinc-200/75 dark:bg-zinc-800/90 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                {isCurrent && (
                  <motion.span
                    layoutId={`scrolly-active-substep-pill-${visualState.scenarioId}`}
                    transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                    className={`absolute inset-0 rounded ${palette.activeMarkerBgClass} shadow-2xs`}
                  />
                )}
                <span className="relative z-10">{s.id}</span>
              </button>
            );
          })}
        </div>

        {/* 4 Intra-Stage Cinematic Phase Pills (A -> B -> C -> D) + Integrated Progress Bar */}
        <div className="grid grid-cols-4 gap-1">
          {chapter.subSteps.map((phaseSpec) => {
            const isActivePhase = phaseSpec.id === subStep.id;
            const isCompletedPhase =
              phaseSpec.subStepIndex < visualState.subStepIndex;
            return (
              <button
                key={phaseSpec.id}
                type="button"
                onClick={() => onSelectSubStep(phaseSpec.id)}
                className={`relative px-1.5 py-1 rounded-md border text-left font-mono transition-colors cursor-pointer overflow-hidden flex items-center justify-between gap-1 ${
                  isActivePhase
                    ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100'
                    : isCompletedPhase
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/25 border-emerald-400/60 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <span className="text-[8.5px] font-extrabold shrink-0">
                  {phaseSpec.id}
                </span>
                <span className="text-[8px] truncate font-semibold">
                  {phaseSpec.subStepLetter === 'A'
                    ? 'STORY'
                    : phaseSpec.subStepLetter === 'B'
                      ? 'FLOW'
                      : phaseSpec.subStepLetter === 'C'
                        ? 'TECH'
                        : 'SIEM'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${palette.stageAccentClass}`}
            animate={{
              width: `${Math.max(5, Math.round(visualState.overallProgress * 100))}%`,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          />
        </div>
      </div>

      {/* 2. Compact Single-Row Active Sub-Step Context Banner + Inline Morphing SVG Telemetry Conduit */}
      <motion.div
        key={`banner-${subStep.id}`}
        initial={{ opacity: 0.35, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="px-3 py-1.5 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-2"
      >
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className={`px-1.5 py-0.5 rounded font-mono text-[8.5px] leading-none font-extrabold ${layerTokens.badgeBg}`}
            >
              {subStep.badgeLabel}
            </span>
            <span
              className={`px-1 py-0.5 rounded border font-mono text-[8px] leading-none font-extrabold ${layerTokens.layerPillClass}`}
            >
              {subStep.layerKindBadge}
            </span>
            <span className="font-mono text-[8.5px] font-bold text-indigo-700 dark:text-indigo-300 truncate">
              {subStep.clauseNumber} · {subStep.clauseTitle}
            </span>
          </div>
          <div
            title={subStep.headline}
            className="text-[11px] font-extrabold text-zinc-900 dark:text-white leading-tight truncate"
          >
            {subStep.headline}
          </div>
        </div>

        {/* Inline Scroll-Driven Morphing SVG Waveform & Phase Conduit */}
        <div
          data-testid="scrolly-morphing-svg-conduit"
          className="w-32 sm:w-40 shrink-0 rounded-md bg-white/90 dark:bg-zinc-950/85 border border-zinc-200/80 dark:border-zinc-800 px-2 py-1"
        >
          <div className="flex items-center justify-between font-mono text-[7.5px] text-zinc-500 dark:text-zinc-400 leading-none mb-0.5">
            <span className="truncate max-w-[45%]">{subStep.protocolBadge}</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 truncate max-w-[50%]">
              → {subStep.returnBadge}
            </span>
          </div>
          <svg
            viewBox="0 0 540 116"
            className="w-full h-5 overflow-visible"
            role="img"
            aria-label={`Morphing telemetry path for phase ${subStep.id}`}
          >
            {/* Secondary Return / Envelope Morphing Path */}
            <motion.path
              data-testid="scrolly-morphing-secondary-path"
              d={visualState.interpolatedSecondaryPathD}
              fill="none"
              stroke={subStep.morphConfig.accentFillHex}
              strokeWidth="2.2"
              strokeDasharray="4 3"
              opacity={0.55}
              animate={{ d: visualState.interpolatedSecondaryPathD }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            />
            {/* Primary Forward Action Morphing Path */}
            <motion.path
              data-testid="scrolly-morphing-primary-path"
              d={visualState.interpolatedPrimaryPathD}
              fill="none"
              stroke={subStep.morphConfig.strokeHex}
              strokeWidth="3.2"
              strokeLinecap="round"
              animate={{ d: visualState.interpolatedPrimaryPathD }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            />
            <circle
              cx="24"
              cy="64"
              r="7"
              fill={subStep.morphConfig.strokeHex}
            />
            <circle
              cx="270"
              cy={
                subStep.subStepLetter === 'C'
                  ? 36
                  : subStep.subStepLetter === 'D'
                    ? 16
                    : 64
              }
              r="7"
              fill={subStep.morphConfig.accentFillHex}
            />
            <circle
              cx="516"
              cy={subStep.subStepLetter === 'C' ? 28 : 64}
              r="7"
              fill="#059669"
            />
            {/* Traveling Packet Marker driven by scroll progress */}
            <motion.circle
              cx={
                24 +
                492 *
                  clampUnitProgress(
                    subStep.morphConfig.packetProgress * 0.75 +
                      visualState.intraSubStepProgress * 0.25
                  )
              }
              cy={
                subStep.subStepLetter === 'C'
                  ? 42
                  : subStep.subStepLetter === 'D'
                    ? 34
                    : 64
              }
              r="8.5"
              fill={layerTokens.markerAccentHex}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </motion.div>

      {/* 3. Main Interactive Animated Graphic Area Tailored to Scenario Archetype & Explanation Layer */}
      <div className="p-2.5 bg-[#FAFAFA] dark:bg-zinc-950/80 flex flex-col justify-between">
        <motion.div
          key={`stage-scene-${visualState.scenarioId}-${visualState.stageNumber}-${subStep.subStepLetter}`}
          initial={{ opacity: 0, scale: 0.97, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className="space-y-2"
        >
          {visualState.processHollowingState ? (
            <>
              {visualState.stageNumber === 0 && (
                <Stage0BriefingScene
                  visualState={visualState.processHollowingState}
                  onSelectSubStep={(id) => onSelectSubStep(id)}
                />
              )}
              {visualState.stageNumber === 1 && (
                <Stage1SuspendedSpawnScene
                  visualState={visualState.processHollowingState}
                />
              )}
              {visualState.stageNumber === 2 && (
                <Stage2MemoryUnmapScene
                  visualState={visualState.processHollowingState}
                />
              )}
              {visualState.stageNumber === 3 && (
                <Stage3AllocationInjectionScene
                  visualState={visualState.processHollowingState}
                />
              )}
              {visualState.stageNumber === 4 && (
                <Stage4ThreadHijackScene
                  visualState={visualState.processHollowingState}
                />
              )}
              {visualState.stageNumber === 5 && (
                <Stage5C2BeaconFftScene
                  visualState={visualState.processHollowingState}
                />
              )}
            </>
          ) : (
            <NotebookLmInteractiveShapeCanvas
              visualState={visualState}
              focusedMotionIndex={effectiveMotionIndex}
              onSelectMotionIndex={(idx) => onSelectMotion?.(idx)}
              onSelectSubStep={onSelectSubStep}
            />
          )}
        </motion.div>
      </div>

      {/* 4. Compact Synchronized Video Narrator Box + Bottom Telemetry Strip */}
      <motion.div
        key={`footer-${subStep.id}`}
        initial={{ opacity: 0.4, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="px-3 py-2 bg-zinc-100/90 dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800 space-y-1.5"
      >
        <div
          data-testid="sticky-stage-narrator-box"
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-indigo-200/90 dark:border-indigo-800/80 space-y-0.5"
        >
          <div className="flex items-center justify-between gap-1 font-mono text-[9px] font-extrabold text-indigo-700 dark:text-indigo-300">
            <span className="inline-flex items-center gap-1 truncate">
              <BookOpen className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">
                SYNCED SCENE · CLAUSE {subStep.clauseNumber} ({subStep.layerKindBadge})
              </span>
            </span>
            <span className="text-rose-600 dark:text-rose-400 shrink-0">
              {subStep.timestampRef}
            </span>
          </div>
          <p
            title={subStep.explanation}
            className="text-[10.5px] text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-2 break-words"
          >
            {subStep.explanation}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <div
            title={subStep.stateDeltaSummary}
            className="px-2 py-1 rounded-lg bg-amber-50/85 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/70 flex items-center gap-1.5 text-[9.5px] font-mono min-w-0"
          >
            <Cpu className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="min-w-0 flex-1 truncate">
              <span className="font-bold text-amber-900 dark:text-amber-300">
                {subStep.layerKind === 'ANALOGY_NARRATIVE' ? 'Model: ' : 'State: '}
              </span>
              <span className="text-zinc-800 dark:text-zinc-200">
                {subStep.stateDeltaSummary}
              </span>
            </div>
          </div>

          <div className="px-2 py-1 rounded-lg bg-emerald-50/85 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-800/70 flex items-center gap-1.5 text-[9.5px] font-mono text-emerald-900 dark:text-emerald-200 min-w-0">
            <div className="w-4 h-4 rounded bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType="SIEM_SENSOR"
                isActive={false}
                isCompromised={false}
              />
            </div>
            <span
              data-testid="sticky-stage-sysmon-badge"
              title={
                visualState.processHollowingState
                  ? visualState.processHollowingState.activeSysmonBadge
                  : subStep.detectionEvidence
              }
              className="font-semibold truncate"
            >
              {visualState.processHollowingState
                ? visualState.processHollowingState.activeSysmonBadge
                : subStep.detectionEvidence}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * STAGE 0 (00:00 - 01:33): 4 Cinematic Phases (0A -> 0B -> 0C -> 0D)
 * - 0A: Untrusted Dropper Blocked by Firewall/EDR (with animated blocked packet shockwave)
 * - 0B: Trusted Microsoft-Signed svchost.exe Container ("Armored Bank Truck")
 * - 0C: Disk vs. Volatile RAM Split Diagram (Animated memory swap inside RAM while Disk stays green)
 * - 0D: Complete 5-Stage Kill-Chain Architecture Map with traveling motion pulse
 */
function Stage0BriefingScene({
  visualState,
  onSelectSubStep,
}: {
  visualState: ProcessHollowingStageVisualState;
  onSelectSubStep: (id: ProcessHollowingSubStepId) => void;
}) {
  const { activeSubStepId, subStepIndex } = visualState;

  return (
    <div className="space-y-2" data-testid="stage-0-briefing-scene">
      {/* TOP SHAPE: Untrusted Loader vs. Trusted Host Container with Animated Packet SVG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Card A: Untrusted Dropper (0A Focus) */}
        <motion.div
          animate={{
            scale: activeSubStepId === '0A' ? 1.015 : 0.99,
            opacity: activeSubStepId === '0A' || activeSubStepId === '0D' ? 1 : 0.85,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="relative rounded-xl bg-white dark:bg-zinc-900 border-2 border-rose-400 dark:border-rose-500/80 p-2 shadow-2xs space-y-1"
        >
          {activeSubStepId === '0A' && (
            <motion.div
              layoutId="stage0-focus-ring"
              className="absolute inset-0 rounded-xl ring-2 ring-rose-500/60 pointer-events-none"
            />
          )}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-7 h-6 rounded-md bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 flex items-center justify-center p-0.5 shrink-0">
                <SketchNodeIcon
                  iconType="MALWARE_PAYLOAD"
                  isActive={false}
                  isCompromised={true}
                />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10.5px] font-extrabold text-zinc-900 dark:text-white truncate">
                  Invoice_Q4.exe [3104]
                </div>
                <div className="font-mono text-[8.5px] text-zinc-500 truncate">
                  ...\Downloads\Invoice_Q4.exe
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[8px] font-extrabold shrink-0">
              UNSIGNED
            </span>
          </div>

          {/* Animated Blocked Socket Path */}
          <div className="px-1.5 py-1 rounded-lg bg-rose-50/90 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800 font-mono text-[9px] space-y-0.5">
            <div className="flex items-center justify-between text-rose-800 dark:text-rose-200 font-bold">
              <span>Direct TCP/443</span>
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-2.5 h-2.5" />
                <span>EDR BLOCKED</span>
              </span>
            </div>
            <svg viewBox="0 0 200 16" className="w-full h-3.5 overflow-visible">
              <line
                x1="8"
                y1="8"
                x2="155"
                y2="8"
                stroke="#f43f5e"
                strokeWidth="1.8"
                strokeDasharray="4 3"
              />
              <motion.circle
                key={`drop-pkt-${activeSubStepId}`}
                cx="20"
                cy="8"
                r="3.5"
                fill="#e11d48"
                initial={{ cx: 14 }}
                animate={{ cx: [14, 148, 132] }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
              />
              <g transform="translate(158, 1)">
                <rect width="34" height="14" rx="3" fill="#e11d48" />
                <text
                  x="17"
                  y="10"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="bold"
                >
                  DROP
                </text>
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Card B: Trusted svchost.exe Container (0B Focus) */}
        <motion.div
          animate={{
            scale: activeSubStepId === '0B' ? 1.015 : 0.99,
            opacity: activeSubStepId !== '0A' ? 1 : 0.85,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="relative rounded-xl bg-white dark:bg-zinc-900 border-2 border-sky-400 dark:border-sky-500/80 p-2 shadow-2xs space-y-1"
        >
          {activeSubStepId === '0B' && (
            <motion.div
              layoutId="stage0-focus-ring"
              className="absolute inset-0 rounded-xl ring-2 ring-sky-500/60 pointer-events-none"
            />
          )}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-7 h-6 rounded-md bg-sky-50 dark:bg-zinc-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center p-0.5 shrink-0">
                <SketchNodeIcon
                  iconType="PROCESS_THREAD"
                  isActive={false}
                  isCompromised={subStepIndex >= 2}
                />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10.5px] font-extrabold text-zinc-900 dark:text-white truncate">
                  svchost.exe [4892]
                </div>
                <div className="font-mono text-[8.5px] text-zinc-500 truncate">
                  C:\Windows\System32\svchost.exe
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono text-[8px] font-extrabold shrink-0">
              MS SIGNED
            </span>
          </div>

          {/* Animated Allowed Socket Path */}
          <div className="px-1.5 py-1 rounded-lg bg-emerald-50/90 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800 font-mono text-[9px] space-y-0.5">
            <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-200 font-bold">
              <span>Armored Host</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>FIREWALL PASS</span>
              </span>
            </div>
            <svg viewBox="0 0 200 16" className="w-full h-3.5 overflow-visible">
              <line
                x1="8"
                y1="8"
                x2="155"
                y2="8"
                stroke="#10b981"
                strokeWidth="1.8"
                strokeDasharray="4 3"
              />
              <motion.circle
                key={`pass-pkt-${activeSubStepId}`}
                cx="20"
                cy="8"
                r="3.5"
                fill="#059669"
                initial={{ cx: 14 }}
                animate={{ cx: 148 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
              <g transform="translate(158, 1)">
                <rect width="34" height="14" rx="3" fill="#059669" />
                <text
                  x="17"
                  y="10"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="bold"
                >
                  PASS
                </text>
              </g>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* MIDDLE SHAPE (0C Focus): NTFS Disk vs. Volatile RAM Split Architecture */}
      <motion.div
        animate={{
          scale: activeSubStepId === '0C' ? 1.01 : 0.995,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 24 }}
        className={`relative rounded-xl border p-2 font-mono space-y-1.5 ${
          activeSubStepId === '0C'
            ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-500 shadow-xs'
            : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between text-[9.5px]">
          <span className="font-extrabold uppercase text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            <span>Disk File vs. Volatile RAM Divergence (0x00400000)</span>
          </span>
          <span className="text-[8.5px] font-bold text-rose-600 dark:text-rose-400">
            {subStepIndex >= 2 ? 'RAM HOLLOWED & SWAPPED' : 'BASELINE IMAGE'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[9px]">
          {/* Left: C: Drive On-Disk File */}
          <div className="p-1.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-300 dark:border-emerald-800 space-y-0.5">
            <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
              <span>NTFS Disk (System32)</span>
              <span>✓ CLEAN</span>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 text-zinc-700 dark:text-zinc-300">
              svchost.exe (.text RX)
            </div>
          </div>

          {/* Right: Volatile RAM PID 4892 */}
          <div className="p-1.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/25 border border-rose-300 dark:border-rose-800 space-y-0.5 overflow-hidden">
            <div className="flex items-center justify-between font-bold text-rose-800 dark:text-rose-300">
              <span>RAM (PID 4892)</span>
              <span>{subStepIndex >= 2 ? 'RWX BEACON' : 'SEC_IMAGE'}</span>
            </div>
            <motion.div
              key={subStepIndex >= 2 ? 'ram-beacon' : 'ram-clean'}
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className={`px-1.5 py-0.5 rounded border font-bold ${
                subStepIndex >= 2
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-white dark:bg-zinc-900 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
              }`}
            >
              {subStepIndex >= 2
                ? '0x00400000: Cobalt Strike (264 KB)'
                : '0x00400000: Signed svchost.exe'}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM SHAPE (0D Focus): 5-Stage Kill-Chain Pipeline with Animated Pulse */}
      <motion.div
        className={`rounded-xl border p-2 space-y-1.5 ${
          activeSubStepId === '0D'
            ? 'bg-amber-50/60 dark:bg-amber-950/25 border-amber-500 shadow-xs'
            : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between font-mono text-[9.5px]">
          <span className="font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            0D · 5-Stage Kill-Chain Motion Map (Click Any Stage)
          </span>
          <span className="text-zinc-500 text-[8.5px]">EID 1 → 10 → 25 → 3</span>
        </div>

        <div className="grid grid-cols-5 gap-1">
          {[
            {
              stage: 1,
              sub: '1A' as ProcessHollowingSubStepId,
              title: '#1 Spawn',
              api: 'SUSPENDED',
              eid: 'EID 1',
            },
            {
              stage: 2,
              sub: '2A' as ProcessHollowingSubStepId,
              title: '#2 Unmap',
              api: 'NtUnmap',
              eid: 'PEB+0x10',
            },
            {
              stage: 3,
              sub: '3A' as ProcessHollowingSubStepId,
              title: '#3 Inject',
              api: '264KB RWX',
              eid: 'EID 10',
            },
            {
              stage: 4,
              sub: '4A' as ProcessHollowingSubStepId,
              title: '#4 Hijack',
              api: 'RCX Swap',
              eid: 'EID 25',
            },
            {
              stage: 5,
              sub: '5A' as ProcessHollowingSubStepId,
              title: '#5 Beacon',
              api: 'TLS FFT',
              eid: 'EID 3',
            },
          ].map((item, idx) => (
            <motion.button
              key={item.stage}
              type="button"
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                borderColor:
                  activeSubStepId === '0D' ? '#f59e0b' : 'rgba(161,161,170,0.35)',
              }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectSubStep(item.sub)}
              className="p-1 rounded-lg bg-zinc-50 dark:bg-zinc-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border text-left transition-colors cursor-pointer"
            >
              <div className="font-mono text-[9px] font-extrabold text-zinc-900 dark:text-white">
                {item.title}
              </div>
              <div className="font-mono text-[8px] text-indigo-600 dark:text-indigo-400 truncate">
                {item.api}
              </div>
              <div className="font-mono text-[7.5px] text-rose-600 dark:text-rose-400 font-bold">
                {item.eid}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * STAGE 1 (01:34 - 02:22): 4 Cinematic Phases (1A -> 1B -> 1C -> 1D)
 * - 1A: CreateProcessW Call & Lineage Anomaly (services.exe vs Invoice_Q4.exe)
 * - 1B: Ring-3 -> Ring-0 ntdll!NtCreateUserProcess allocating EPROCESS [PID 4892] & PEB
 * - 1C: CREATE_SUSPENDED (0x00000004) freezing Primary Thread TID 4896 (SuspendCount = 1)
 * - 1D: PROCESS_INFORMATION returning hProcess = 0x01C4 & hThread = 0x01C8 along curved SVG paths
 */
function Stage1SuspendedSpawnScene({
  visualState,
}: {
  visualState: ProcessHollowingStageVisualState;
}) {
  const {
    activeSubStepId,
    kernelEprocessCreated,
    createSuspendedFlagActive,
    hasProcessHandle,
    hasThreadHandle,
  } = visualState;

  return (
    <div
      data-testid="stage-1-suspended-spawn-scene"
      className="flex flex-col items-center justify-between gap-1.5"
    >
      {/* TOP NODE: Invoice_Q4.exe PID: 3104 + Lineage Comparison Strip */}
      <motion.div
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full rounded-xl bg-white dark:bg-zinc-900 border-2 border-rose-500/80 p-2 shadow-xs space-y-1.5 z-10"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 rounded-md bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType="MALWARE_PAYLOAD"
                isActive={false}
                isCompromised={true}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] font-extrabold text-zinc-900 dark:text-white">
                  Invoice_Q4.exe
                </span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[9px] font-bold text-zinc-700 dark:text-zinc-300">
                  PID: 3104
                </span>
              </div>
              <div className="font-mono text-[9px] text-zinc-500 dark:text-zinc-400">
                Parent Anomaly: Spawns svchost.exe without services.exe or -k flag
              </div>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[8.5px] font-extrabold shrink-0">
            RING-3 LOADER
          </span>
        </div>

        {/* PROCESS_INFORMATION Kernel Handles Slot */}
        <motion.div
          animate={{
            scale: hasProcessHandle ? 1.01 : 1,
          }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className={`px-2 py-1 rounded-lg border font-mono text-[10px] flex flex-wrap items-center justify-between gap-1 transition-colors ${
            hasProcessHandle
              ? 'bg-amber-50/90 dark:bg-amber-950/35 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200'
              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <span className="font-semibold">PROCESS_INFORMATION:</span>
          {hasProcessHandle ? (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              data-testid="stage1-acquired-handles-readout"
              className="font-extrabold"
            >
              <span className="text-rose-600 dark:text-rose-400">
                hProcess = 0x01C4 (0x1FFFFF)
              </span>{' '}
              |{' '}
              <span className="text-amber-700 dark:text-amber-300">
                hThread = 0x01C8
              </span>
            </motion.span>
          ) : (
            <span className="italic">[ Awaiting Kernel Handle Return ]</span>
          )}
        </motion.div>
      </motion.div>

      {/* MIDDLE CHOREOGRAPHY: Ring-3 -> Ring-0 Syscall Bridge + Curved Handle Return Paths */}
      <div className="relative w-full min-h-[108px] flex flex-col items-center justify-center py-0.5">
        <svg
          viewBox="0 0 560 116"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="scrolly-arrow-hprocess"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#e11d48" />
            </marker>
            <marker
              id="scrolly-arrow-hthread"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#d97706" />
            </marker>
          </defs>

          {/* Center Downward Syscall Spine */}
          <line
            x1="280"
            y1="6"
            x2="280"
            y2="110"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <motion.circle
            key={`syscall-dot-${activeSubStepId}`}
            cx="280"
            cy="18"
            r="4.5"
            fill="#4f46e5"
            initial={{ cy: 10 }}
            animate={{ cy: 104 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          />

          {/* Left Curved Return Path: hProcess = 0x01C4 */}
          <motion.path
            d="M 120 108 C 16 108, 16 10, 120 10"
            fill="none"
            stroke="#e11d48"
            strokeWidth="2.4"
            strokeDasharray="5 4"
            markerEnd="url(#scrolly-arrow-hprocess)"
            initial={false}
            animate={{
              opacity: hasProcessHandle ? 1 : 0.16,
            }}
            transition={{ duration: 0.35 }}
          />
          {hasProcessHandle && (
            <motion.circle
              key={`hproc-dot-${activeSubStepId}`}
              r="5"
              fill="#e11d48"
              initial={{ cx: 120, cy: 108 }}
              animate={{
                cx: [120, 42, 42, 120],
                cy: [108, 80, 30, 10],
              }}
              transition={{ duration: 0.85, ease: 'easeInOut' }}
            />
          )}

          {/* Right Curved Return Path: hThread = 0x01C8 */}
          <motion.path
            d="M 440 108 C 544 108, 544 10, 440 10"
            fill="none"
            stroke="#d97706"
            strokeWidth="2.4"
            strokeDasharray="5 4"
            markerEnd="url(#scrolly-arrow-hthread)"
            initial={false}
            animate={{
              opacity: hasThreadHandle ? 1 : 0.16,
            }}
            transition={{ duration: 0.35 }}
          />
          {hasThreadHandle && (
            <motion.circle
              key={`hthr-dot-${activeSubStepId}`}
              r="5"
              fill="#d97706"
              initial={{ cx: 440, cy: 108 }}
              animate={{
                cx: [440, 518, 518, 440],
                cy: [108, 80, 30, 10],
              }}
              transition={{ duration: 0.85, ease: 'easeInOut' }}
            />
          )}
        </svg>

        <div className="w-full flex items-center justify-between gap-1.5 z-10 px-1">
          {/* Left Handle Pill (1D) */}
          <motion.div
            animate={{
              opacity: hasProcessHandle ? 1 : 0.28,
              scale: hasProcessHandle ? 1.04 : 0.92,
              x: hasProcessHandle ? 0 : -8,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/90 border border-rose-500 text-rose-700 dark:text-rose-200 font-mono text-[9.5px] font-extrabold shadow-xs"
          >
            ⇠ hProcess = 0x01C4
          </motion.div>

          {/* Center Syscall & Kernel Objects Stack (1A -> 1B -> 1C) */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ scale: !kernelEprocessCreated ? 1.04 : 0.98 }}
              className="px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-[9.5px] font-extrabold shadow-2xs"
            >
              1A · CreateProcessW(&quot;svchost.exe&quot;)
            </motion.div>

            {/* 1B: Ring-0 Kernel EPROCESS & PEB Box */}
            <motion.div
              animate={{
                opacity: kernelEprocessCreated ? 1 : 0.38,
                scale: kernelEprocessCreated ? 1.02 : 0.94,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              data-testid="stage1-kernel-eprocess-badge"
              className={`px-2 py-0.5 rounded-md border font-mono text-[9px] font-bold ${
                kernelEprocessCreated
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              1B · Ring-0 EPROCESS [4892] + PEB @ 0x00400000
            </motion.div>

            {/* 1C: CREATE_SUSPENDED Flag */}
            <motion.div
              animate={{
                opacity: createSuspendedFlagActive ? 1 : 0.38,
                scale: createSuspendedFlagActive ? 1.04 : 0.94,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              data-testid="stage1-create-suspended-badge"
              className={`px-2 py-0.5 rounded-md border font-mono text-[9px] font-extrabold ${
                createSuspendedFlagActive
                  ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              1C · CREATE_SUSPENDED (0x00000004)
            </motion.div>
          </div>

          {/* Right Handle Pill (1D) */}
          <motion.div
            animate={{
              opacity: hasThreadHandle ? 1 : 0.28,
              scale: hasThreadHandle ? 1.04 : 0.92,
              x: hasThreadHandle ? 0 : 8,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/90 border border-amber-500 text-amber-800 dark:text-amber-200 font-mono text-[9.5px] font-extrabold shadow-xs"
          >
            hThread = 0x01C8 ⇠
          </motion.div>
        </div>
      </div>

      {/* BOTTOM NODE: svchost.exe PID: 4892 + KTHREAD TID 4896 State */}
      <motion.div
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full rounded-xl bg-white dark:bg-zinc-900 border-2 border-sky-500/80 p-2 shadow-xs space-y-1.5 z-10"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 rounded-md bg-sky-50 dark:bg-zinc-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType="PROCESS_THREAD"
                isActive={false}
                isCompromised={createSuspendedFlagActive}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] font-extrabold text-zinc-900 dark:text-white">
                  svchost.exe
                </span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[9px] font-bold text-zinc-700 dark:text-zinc-300">
                  PID: 4892
                </span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[8.5px] font-bold">
                  Base: 0x00400000
                </span>
              </div>
              <div className="font-mono text-[9px] text-zinc-500 dark:text-zinc-400">
                C:\Windows\System32\svchost.exe (Child Host Container)
              </div>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono text-[8.5px] font-extrabold shrink-0">
            MICROSOFT SIGNED
          </span>
        </div>

        {/* Primary Thread TID 4896 Status Bar with Motion Lock */}
        <motion.div
          key={createSuspendedFlagActive ? 'tid-frozen' : 'tid-standby'}
          initial={{ scale: 0.96, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          data-testid="stage1-thread-status-bar"
          className={`px-2 py-1 rounded-lg border font-mono text-[10px] font-bold flex items-center justify-between gap-1.5 ${
            createSuspendedFlagActive
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-700 dark:text-rose-300'
              : 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-200'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {createSuspendedFlagActive ? (
              <>
                <Lock className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Primary Thread (TID 4896) : FROZEN / SUSPENDED</span>
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Primary Thread (TID 4896) : Initializing</span>
              </>
            )}
          </div>
          <span className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-zinc-900 text-[9px] font-extrabold">
            {createSuspendedFlagActive ? 'SuspendCount = 1' : 'SuspendCount = 0'}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * STAGE 2 (02:23 - 03:00): 4 Cinematic Phases (2A -> 2B -> 2C -> 2D)
 * - 2A: PEB+0x10 Struct Inspection resolving ImageBaseAddress = 0x00400000
 * - 2B: Signed svchost.exe PE Sections (.text, .rdata, .data) & SEC_IMAGE VAD
 * - 2C: NtUnmapViewOfSection(0x01C4, 0x00400000) actively ejecting sections with spring motion
 * - 2D: STATUS_SUCCESS (0x00000000) leaving [ UNMAPPED MEMORY VOID ] at 0x00400000
 */
function Stage2MemoryUnmapScene({
  visualState,
}: {
  visualState: ProcessHollowingStageVisualState;
}) {
  const {
    activeSubStepId,
    peSectionsInspected,
    unmapSyscallActive,
    memoryUnmapped,
  } = visualState;

  return (
    <div
      data-testid="stage-2-memory-unmap-scene"
      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-stretch"
    >
      {/* Left Column: Handle + PEB Struct Table + NtUnmapViewOfSection Syscall */}
      <div className="sm:col-span-5 flex flex-col justify-between gap-1.5">
        {/* PEB Structure Inspector Shape (2A) */}
        <motion.div className="rounded-xl bg-white dark:bg-zinc-900 border-2 border-indigo-400 dark:border-indigo-700 p-2 space-y-1">
          <div className="flex items-center justify-between font-mono text-[9.5px]">
            <span className="font-extrabold text-indigo-700 dark:text-indigo-300">
              2A · PEB Struct (0x7FFDF000)
            </span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[8px] font-bold">
              hProcess 0x01C4
            </span>
          </div>

          <div className="space-y-0.5 font-mono text-[9px]">
            <div className="px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-950 text-zinc-500 flex justify-between">
              <span>+0x00 InheritedAddr</span>
              <span>0x00</span>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-950 text-zinc-500 flex justify-between">
              <span>+0x02 BeingDebugged</span>
              <span>0x00</span>
            </div>
            <motion.div
              key={`peb-base-${activeSubStepId}`}
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200 font-extrabold flex justify-between"
            >
              <span>+0x10 ImageBase</span>
              <span>0x00400000</span>
            </motion.div>
          </div>
        </motion.div>

        {/* VAD & FILE_OBJECT Link Shape (2B) */}
        <motion.div
          animate={{
            opacity: peSectionsInspected ? 1 : 0.55,
          }}
          className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 font-mono text-[9px] space-y-0.5"
        >
          <div className="font-extrabold text-zinc-800 dark:text-zinc-200">
            2B · Kernel VAD Node
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Type:</span>
            <span
              className={`font-bold ${
                memoryUnmapped
                  ? 'text-rose-600 line-through'
                  : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              SEC_IMAGE (svchost.exe)
            </span>
          </div>
        </motion.div>

        {/* Native Syscall Card (2C & 2D) */}
        <motion.div
          animate={{
            opacity: unmapSyscallActive || memoryUnmapped ? 1 : 0.45,
            scale: unmapSyscallActive || memoryUnmapped ? 1.01 : 0.98,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          data-testid="stage2-ntunmap-card"
          className={`rounded-xl border-2 p-2 space-y-0.5 font-mono ${
            memoryUnmapped
              ? 'bg-rose-50/90 dark:bg-rose-950/35 border-rose-500'
              : unmapSyscallActive
                ? 'bg-amber-50/90 dark:bg-amber-950/35 border-amber-500'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <div className="text-[9.5px] font-extrabold text-rose-700 dark:text-rose-300">
            2C/2D · Native Syscall
          </div>
          <div className="text-[9px] font-bold text-zinc-900 dark:text-white break-all">
            NtUnmapViewOfSection(0x01C4, 0x00400000)
          </div>
          <div className="text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400">
            {memoryUnmapped
              ? '✓ STATUS_SUCCESS (0x00000000)'
              : unmapSyscallActive
                ? '⚡ Ejecting SEC_IMAGE Pages...'
                : 'Awaiting Syscall...'}
          </div>
        </motion.div>
      </div>

      {/* Right Column: svchost.exe Virtual Memory Space with Animated Section Ejection */}
      <div className="sm:col-span-7 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-2.5 flex flex-col justify-between space-y-1.5">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1 font-mono">
          <span className="text-[11px] font-extrabold text-zinc-900 dark:text-white">
            svchost.exe — Virtual Memory (PID 4892)
          </span>
        </div>

        <div className="px-1.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-[9px]">
          <span className="text-zinc-500 font-bold">0x7FFE0000</span>
          <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
            ntdll.dll (System Loader)
          </span>
        </div>

        {/* 0x00400000 Primary ImageBase Box with Motion Ejection */}
        <motion.div
          data-testid="stage2-base-memory-block"
          className={`p-2 rounded-xl border-2 border-dashed space-y-1 min-h-[132px] flex flex-col justify-center overflow-hidden transition-colors ${
            memoryUnmapped
              ? 'bg-rose-50/75 dark:bg-rose-950/30 border-rose-500'
              : unmapSyscallActive
                ? 'bg-amber-50/75 dark:bg-amber-950/30 border-amber-500'
                : 'bg-sky-50/75 dark:bg-sky-950/30 border-sky-500'
          }`}
        >
          {!memoryUnmapped ? (
            <>
              <div className="flex items-center justify-between font-mono text-[9.5px]">
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300">
                  0x00400000 (ImageBase)
                </span>
                <span className="text-sky-700 dark:text-sky-300 font-bold">
                  {unmapSyscallActive ? 'UNMAPPING...' : '✓ Signed PE'}
                </span>
              </div>
              <div className="space-y-1 font-mono text-[9px]">
                {[
                  {
                    addr: '+0x0000',
                    label: 'PE Header (MZ / Signed Catalog)',
                    delay: 0,
                  },
                  {
                    addr: '+0x1000',
                    label: '.text (Legitimate Executable Code · RX)',
                    delay: 0.05,
                  },
                  {
                    addr: '+0x18000',
                    label: '.rdata (Read-Only Imports · R)',
                    delay: 0.1,
                  },
                  {
                    addr: '+0x26000',
                    label: '.data (Global State · RW)',
                    delay: 0.15,
                  },
                ].map((sec) => (
                  <motion.div
                    key={sec.addr}
                    animate={{
                      x: unmapSyscallActive ? 36 : 0,
                      opacity: unmapSyscallActive ? 0.35 : 1,
                      scale: unmapSyscallActive ? 0.95 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 20,
                      delay: sec.delay,
                    }}
                    className="px-1.5 py-1 rounded bg-white dark:bg-zinc-900 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 font-semibold flex items-center justify-between"
                  >
                    <span>{sec.label}</span>
                    <span className="text-[8px] text-zinc-400">{sec.addr}</span>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="text-center space-y-1 py-1.5 font-mono"
            >
              <div className="text-[11px] font-extrabold text-rose-700 dark:text-rose-300">
                0x00400000 | UNMAPPED MEMORY VOID
              </div>
              <div className="text-[9.5px] text-zinc-700 dark:text-zinc-300">
                Legitimate svchost.exe sections stripped via NtUnmapViewOfSection
              </div>
              <span className="inline-block px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold">
                SEC_IMAGE VAD Unlinked · Hollow Shell Ready
              </span>
            </motion.div>
          )}
        </motion.div>

        <div className="px-1.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-[9px]">
          <span className="text-zinc-500 font-bold">0x00100000</span>
          <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
            Process Heap &amp; Thread Stack
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * STAGE 3 (03:01 - 03:40): 4 Cinematic Phases (3A -> 3B -> 3C -> 3D)
 * - 3A: VirtualAllocEx reserving 264 KB MEM_PRIVATE | PAGE_EXECUTE_READWRITE (0x40)
 * - 3B: WriteProcessMemory streaming DOS "MZ" (4D 5A 90 00) & NT "PE" headers (35%)
 * - 3C: Streaming .text, .rdata, .data sections (270,336 Bytes / 100%)
 * - 3D: VAD Forensics Mismatch (MEM_PRIVATE RWX vs SEC_IMAGE) & Sysmon EID 10 (0x1FFFFF)
 */
function Stage3AllocationInjectionScene({
  visualState,
}: {
  visualState: ProcessHollowingStageVisualState;
}) {
  const {
    activeSubStepId,
    peHeadersWritten,
    payloadWritten,
    vadAnomalyFlagged,
    payloadBytesCommitted,
  } = visualState;

  const progressPct = payloadWritten ? 100 : peHeadersWritten ? 35 : 0;

  return (
    <div
      data-testid="stage-3-allocation-injection-scene"
      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-stretch"
    >
      {/* Left Column: Attacker Loader + Animated Byte Stream + VAD Forensics */}
      <div className="sm:col-span-5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-rose-400 dark:border-rose-500/80 p-2 flex flex-col justify-between space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-6 rounded-md bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 flex items-center justify-center p-0.5 shrink-0">
            <SketchNodeIcon
              iconType="MALWARE_PAYLOAD"
              isActive={false}
              isCompromised={true}
            />
          </div>
          <div>
            <div className="font-mono text-[8.5px] font-bold uppercase text-rose-600 dark:text-rose-400">
              ATTACKER LOADER
            </div>
            <div className="font-mono text-[11px] font-extrabold text-zinc-900 dark:text-white">
              Invoice_Q4.exe [3104]
            </div>
          </div>
        </div>

        {/* Animated Cross-Process Byte Pipe */}
        <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[9px] space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-500">hProcess:</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              0x01C4 (0x1FFFFF)
            </span>
          </div>
          <svg viewBox="0 0 180 18" className="w-full h-3.5 overflow-visible">
            <line
              x1="6"
              y1="9"
              x2="174"
              y2="9"
              stroke="#e11d48"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {peHeadersWritten && (
              <>
                <motion.circle
                  key={`wpm-dot1-${activeSubStepId}`}
                  r="3.5"
                  cy="9"
                  fill="#e11d48"
                  initial={{ cx: 10 }}
                  animate={{ cx: 164 }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                />
                <motion.circle
                  key={`wpm-dot2-${activeSubStepId}`}
                  r="3.5"
                  cy="9"
                  fill="#f59e0b"
                  initial={{ cx: 10 }}
                  animate={{ cx: 132 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.15,
                    ease: 'easeOut',
                  }}
                />
              </>
            )}
          </svg>
          <div className="text-[8.5px] font-bold text-rose-600 dark:text-rose-400 text-center">
            {payloadWritten
              ? '270,336 Bytes Streamed (100%)'
              : peHeadersWritten
                ? 'Streaming MZ / PE Headers (35%)'
                : '3A · VirtualAllocEx RWX Ready'}
          </div>
        </div>

        {/* 3D VAD Anomaly Comparison Card */}
        <motion.div
          animate={{
            scale: vadAnomalyFlagged ? 1.02 : 0.98,
          }}
          className={`p-1.5 rounded-xl border font-mono text-[9px] space-y-0.5 ${
            vadAnomalyFlagged
              ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
              : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-zinc-800 dark:text-zinc-200'
          }`}
        >
          <div className="font-extrabold flex items-center justify-between">
            <span>3D · VAD Forensics</span>
            <span>EID 10</span>
          </div>
          <div className="text-[8.5px] leading-snug">
            Expected: <strong>SEC_IMAGE (RX)</strong>
            <br />
            Detected: <strong>MEM_PRIVATE (RWX 0x40)</strong>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Hollowed Target svchost.exe Memory Inspector */}
      <div className="sm:col-span-7 rounded-xl bg-white dark:bg-zinc-900 border-2 border-sky-400 dark:border-sky-500/80 p-2 flex flex-col justify-between space-y-1.5">
        <div className="flex items-center justify-between gap-2 font-mono">
          <div>
            <div className="text-[8.5px] font-bold uppercase text-sky-600 dark:text-sky-400">
              TARGET VIRTUAL MEMORY (0x00400000)
            </div>
            <div className="text-[11px] font-extrabold text-zinc-900 dark:text-white">
              svchost.exe (PID 4892 · 264 KB)
            </div>
          </div>
          <div className="flex items-center gap-1">
            {['R', 'W', 'X'].map((perm) => (
              <motion.span
                key={perm}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[8.5px] font-extrabold"
              >
                {perm}
              </motion.span>
            ))}
          </div>
        </div>

        <div
          data-testid="stage3-api-call-banner"
          className="px-1.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 font-mono text-[9px] font-extrabold text-indigo-900 dark:text-indigo-200 text-center break-words"
        >
          {peHeadersWritten
            ? 'CALL: WriteProcessMemory(0x01C4, Base: 0x00400000, Buffer, 270,336 Bytes)'
            : 'CALL: VirtualAllocEx(0x01C4, Base: 0x00400000, 264KB, PAGE_EXECUTE_READWRITE)'}
        </div>

        {/* Live Hex & Section Stream Box */}
        <div
          className={`p-2 rounded-xl border-2 space-y-1.5 font-mono ${
            peHeadersWritten
              ? 'bg-rose-50/75 dark:bg-rose-950/30 border-rose-500'
              : 'bg-amber-50/75 dark:bg-amber-950/30 border-amber-500'
          }`}
        >
          <div className="flex justify-between text-[9.5px] font-bold">
            <span>Committed: {payloadBytesCommitted.toLocaleString()} B</span>
            <span>{progressPct}% of 264 KB</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${Math.max(8, progressPct)}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="h-full bg-gradient-to-r from-rose-600 to-amber-500"
            />
          </div>

          {/* 3B: Live Hex Dump Row */}
          <motion.div
            animate={{
              opacity: peHeadersWritten ? 1 : 0.45,
              y: peHeadersWritten ? 0 : 4,
            }}
            className="px-1.5 py-1 rounded bg-zinc-900 text-emerald-400 text-[8.5px] leading-tight"
          >
            <div>0x00400000: 4D 5A 90 00 03 00 00 00 | MZ......</div>
            <div>0x00400080: 50 45 00 00 64 86 06 00 | PE..d...</div>
          </motion.div>

          {/* 3C: Injected Beacon Sections */}
          <div className="grid grid-cols-3 gap-1 text-[8px]">
            {[
              { name: '.text (Beacon)', rva: '+0x1000', ready: payloadWritten },
              { name: '.rdata (C2)', rva: '+0x28000', ready: payloadWritten },
              { name: '.data (Config)', rva: '+0x3A000', ready: payloadWritten },
            ].map((sec) => (
              <motion.div
                key={sec.name}
                animate={{
                  scale: sec.ready ? 1 : 0.94,
                  opacity: sec.ready ? 1 : 0.4,
                }}
                className={`p-1 rounded border text-center font-bold ${
                  sec.ready
                    ? 'bg-white dark:bg-zinc-900 border-rose-400 text-rose-700 dark:text-rose-300'
                    : 'bg-zinc-100 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-400'
                }`}
              >
                <div>{sec.name}</div>
                <div className="text-[7.5px] opacity-75">{sec.rva}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * STAGE 4 (03:41 - 04:35): 4 Cinematic Phases (4A -> 4B -> 4C -> 4D)
 * - 4A: GetThreadContext(0x01C8) — RCX points to unmapped 0x00412000 (SuspendCount = 1)
 * - 4B: SetThreadContext(0x01C8) — Sliding TID 4896 pointer to 0x004014A0 (RCX overwritten)
 * - 4C: ResumeThread(0x01C8) — SuspendCount drops 1 -> 0 & Thread State -> RUNNING
 * - 4D: Sysmon Event ID 25 ProcessTampering ("Image is replaced") kernel sensor alert
 */
function Stage4ThreadHijackScene({
  visualState,
}: {
  visualState: ProcessHollowingStageVisualState;
}) {
  const isRcxHijacked = visualState.rcxEntryPoint === '0x004014A0';
  const isRunning = visualState.suspendCount === 0;
  const { tamperingEventFired } = visualState;

  return (
    <div
      data-testid="stage-4-thread-hijack-scene"
      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-stretch"
    >
      {/* Left Column: Address Space with Sliding TID 4896 Pointer */}
      <div className="sm:col-span-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-2.5 flex flex-col justify-between space-y-1.5 relative">
        <div className="font-mono text-[9.5px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-zinc-200 dark:border-zinc-800 pb-1">
          PROCESS ADDRESS SPACE (PID 4892)
        </div>

        <div className="relative pl-18 space-y-2 my-auto py-0.5">
          {/* Sliding TID 4896 Pointer */}
          <motion.div
            animate={{
              top: isRcxHijacked ? '58%' : '12%',
              scale: isRunning ? 1.04 : 1,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            data-testid="stage4-tid-pointer"
            className={`absolute left-0 px-1.5 py-0.5 rounded-lg border-2 font-mono text-[9.5px] font-extrabold flex items-center gap-1 shadow-xs z-10 ${
              isRcxHijacked
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-700'
            }`}
          >
            <span>TID 4896</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </motion.div>

          {/* Top Box: Unmapped Old Entry 0x00412000 */}
          <div
            className={`p-1.5 rounded-xl border-2 border-dashed font-mono transition-opacity ${
              isRcxHijacked
                ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 opacity-50'
                : 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-500 opacity-100'
            }`}
          >
            <div className="text-[9.5px] font-extrabold text-zinc-800 dark:text-zinc-200">
              [ UNMAPPED MEMORY VOID ]
            </div>
            <div className="text-[9px] font-extrabold text-amber-700 dark:text-amber-300">
              Stale Entry: 0x00412000
            </div>
          </div>

          {/* Bottom Box: Cobalt Strike Payload 0x004014A0 */}
          <motion.div
            animate={{
              scale: isRcxHijacked ? 1.015 : 0.985,
            }}
            className={`p-1.5 rounded-xl border-2 font-mono space-y-0.5 ${
              isRcxHijacked
                ? 'bg-rose-50/90 dark:bg-rose-950/35 border-rose-500 shadow-xs'
                : 'bg-white dark:bg-zinc-950 border-rose-300 dark:border-rose-800/70'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9.5px] font-extrabold text-rose-700 dark:text-rose-300">
                COBALT STRIKE BEACON
              </span>
              {isRunning && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[7.5px] font-bold"
                >
                  EXECUTING
                </motion.span>
              )}
            </div>
            <div className="text-[10px] font-extrabold text-zinc-900 dark:text-white">
              New Entry: 0x004014A0
            </div>
          </motion.div>
        </div>

        {/* 4D: Sysmon Event ID 25 Sensor Alert */}
        <motion.div
          animate={{
            opacity: tamperingEventFired ? 1 : 0.45,
            scale: tamperingEventFired ? 1.01 : 0.99,
          }}
          className={`px-2 py-1 rounded-lg border font-mono text-[8.5px] font-bold flex items-center justify-between ${
            tamperingEventFired
              ? 'bg-rose-600 text-white border-rose-700'
              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
          }`}
        >
          <span>4D · SYSMON EVENT ID 25</span>
          <span>Type: &ldquo;Image is replaced&rdquo;</span>
        </motion.div>
      </div>

      {/* Right Column: 64-Bit CPU Register File & Scheduler Controller (TID 4896) */}
      <div className="sm:col-span-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-2.5 flex flex-col justify-between space-y-1.5">
        <div className="font-mono text-[9.5px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-zinc-200 dark:border-zinc-800 pb-1">
          CPU CONTEXT_FULL (TID: 4896)
        </div>

        <div className="grid grid-cols-2 gap-1.5 font-mono">
          <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <div className="text-[8px] text-zinc-500 uppercase font-bold">
              SuspendCount
            </div>
            <motion.div
              key={`sc-${visualState.suspendCount}`}
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              data-testid="stage4-suspend-count"
              className={`text-xs font-extrabold ${
                isRunning
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {visualState.suspendCount}
            </motion.div>
          </div>

          <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <div className="text-[8px] text-zinc-500 uppercase font-bold">
              Scheduler
            </div>
            <div
              className={`text-[10.5px] font-extrabold mt-0.5 flex items-center gap-1 ${
                isRunning
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              {isRunning ? (
                <>
                  <PlayCircle className="w-3 h-3 shrink-0" />
                  <span>RUNNING</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-3 h-3 shrink-0" />
                  <span>FROZEN</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 64-Bit Register File Table */}
        <div className="p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 font-mono text-[9px]">
          <motion.div
            key={visualState.rcxEntryPoint}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`px-1.5 py-1 rounded-lg border-2 flex items-center justify-between font-extrabold ${
              isRcxHijacked
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100'
                : 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-900 dark:text-sky-100'
            }`}
          >
            <span>RCX (Entry):</span>
            <span data-testid="stage4-rcx-value">
              {visualState.rcxEntryPoint}
            </span>
          </motion.div>
          <div className="px-1.5 py-0.5 flex justify-between text-zinc-500">
            <span>RIP (Instruction):</span>
            <span>
              {isRunning ? '0x004014A0 (Beacon)' : 'ntdll!RtlUserThreadStart'}
            </span>
          </div>
          <div className="px-1.5 py-0.5 flex justify-between text-zinc-500">
            <span>RSP (Stack Ptr):</span>
            <span>0x0014F8A0</span>
          </div>
        </div>

        <div className="px-2 py-1 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 font-mono text-[9px]">
          <div className="font-extrabold text-indigo-800 dark:text-indigo-300">
            {isRunning
              ? '4C · ResumeThread(0x01C8) -> Executing'
              : isRcxHijacked
                ? '4B · SetThreadContext(RCX = 0x004014A0)'
                : '4A · GetThreadContext(hThread = 0x01C8)'}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * STAGE 5 (04:36 - 06:07): 4 Cinematic Phases (5A -> 5B -> 5C -> 5D)
 * - 5A: Edge Firewall Bypass (svchost.exe [TRUSTED] -> PASS) with animated TLS packets
 * - 5B: Malleable C2 HTTP Profile (GET /jquery-3.3.1.min.js + JA3 Fingerprint)
 * - 5C: Time-Domain Heartbeat Train (t = 60s, 120s, 180s, 240s ± 20% Jitter)
 * - 5D: Frequency-Domain SIEM FFT Spectrum Spike at f = 0.0167 Hz (1/60s)
 */
function Stage5C2BeaconFftScene({
  visualState,
}: {
  visualState: ProcessHollowingStageVisualState;
}) {
  const { malleableProfileActive, c2BeaconActive, fftSpectrumLocked } =
    visualState;

  return (
    <div data-testid="stage-5-c2-beacon-scene" className="space-y-2">
      {/* Top 3-Node Pipeline with Animated TLS Packet Stream */}
      <div className="grid grid-cols-3 gap-1.5 items-stretch">
        <div className="p-1.5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-sky-400 dark:border-sky-500/80 font-mono space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-5 rounded bg-sky-50 dark:bg-zinc-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType="VICTIM_LAPTOP"
                isActive={false}
                isCompromised={true}
              />
            </div>
            <div className="text-[9px] font-extrabold text-zinc-900 dark:text-white truncate">
              WKS-04
            </div>
          </div>
          <div className="text-[8px] font-bold text-sky-700 dark:text-sky-300 truncate">
            svchost.exe [4892]
          </div>
        </div>

        <div className="p-1.5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-emerald-500/80 font-mono space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-5 rounded bg-emerald-50 dark:bg-zinc-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType="FIREWALL_ROUTER"
                isActive={false}
                isCompromised={false}
              />
            </div>
            <div className="text-[9px] font-extrabold text-zinc-900 dark:text-white truncate">
              EDGE FW
            </div>
          </div>
          <div className="px-1 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-[8px] font-extrabold text-emerald-800 dark:text-emerald-300 text-center">
            SIGNED → PASS
          </div>
        </div>

        <div className="p-1.5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-rose-500/80 font-mono space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-5 rounded bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 flex items-center justify-center p-0.5 shrink-0">
              <SketchNodeIcon
                iconType="ATTACKER"
                isActive={false}
                isCompromised={true}
              />
            </div>
            <div className="text-[9px] font-extrabold text-rose-700 dark:text-rose-300 truncate">
              C2 SERVER
            </div>
          </div>
          <div className="text-[8px] font-bold text-zinc-900 dark:text-white truncate">
            185.220.101.42:443
          </div>
        </div>
      </div>

      {/* 5B: Malleable C2 HTTP Profile & JA3 Inspector */}
      <motion.div
        layout
        animate={{
          opacity: malleableProfileActive ? 1 : 0.65,
          scale: malleableProfileActive && !c2BeaconActive ? 1.01 : 1,
        }}
        className="px-2 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 font-mono text-[8.5px] flex flex-wrap items-center justify-between gap-1"
      >
        <div>
          <span className="font-extrabold text-indigo-700 dark:text-indigo-300">
            5B · Malleable C2:{' '}
          </span>
          <span className="text-zinc-800 dark:text-zinc-200 font-bold">
            GET /jquery-3.3.1.min.js (TLS 1.3)
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold">
          JA3: 72a589da...48eea
        </span>
      </motion.div>

      {/* 5C & 5D: Dual Time-Domain Heartbeat + Frequency-Domain FFT Spectrum */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-2 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="font-mono text-[9.5px] font-extrabold text-zinc-900 dark:text-white">
            {fftSpectrumLocked
              ? '5D · FFT FREQUENCY SPECTRUM (f₀ = 0.0167 Hz LOCK)'
              : '5C · TIME-DOMAIN BEACON CADENCE (Δt = 60s ± 20%)'}
          </span>
          <span
            data-testid="stage5-fft-status-badge"
            className={`px-1.5 py-0.5 rounded font-mono text-[8.5px] font-extrabold ${
              c2BeaconActive
                ? 'bg-rose-600 text-white'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            {fftSpectrumLocked
              ? 'SIEM: FFT PERIODICITY MATCH'
              : c2BeaconActive
                ? 'HEARTBEAT CADENCE ACTIVE'
                : 'SIEM: CAPTURING TLS FLOWS'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-stretch">
          {/* Left 7 Cols: Time-Domain Pulses (60s, 120s, 180s, 240s) */}
          <div className="sm:col-span-7 p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <div className="font-mono text-[8px] font-bold text-zinc-500 mb-0.5">
              TIME DOMAIN · Δt = 60s ± 20% Jitter
            </div>
            <svg
              viewBox="0 0 360 78"
              className="w-full h-14 overflow-visible"
              role="img"
              aria-label="Cobalt Strike 60-second time-domain heartbeat"
            >
              <line
                x1="12"
                y1="60"
                x2="348"
                y2="60"
                stroke="currentColor"
                className="text-zinc-300 dark:text-zinc-800"
                strokeWidth="1.5"
              />
              <motion.path
                d="M 12 60 L 42 60 L 52 14 L 62 60 L 122 60 L 132 14 L 142 60 L 202 60 L 212 14 L 222 60 L 282 60 L 292 14 L 302 60 L 348 60"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.2"
                initial={{ pathLength: 0.25 }}
                animate={{ pathLength: c2BeaconActive ? 1 : 0.45 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
              {[
                { x: 52, t: '60s' },
                { x: 132, t: '120s' },
                { x: 212, t: '180s' },
                { x: 292, t: '240s' },
              ].map((pt) => (
                <g key={pt.t}>
                  <circle cx={pt.x} cy="14" r="3.5" fill="#e11d48" />
                  <text
                    x={pt.x}
                    y="73"
                    textAnchor="middle"
                    className="fill-zinc-600 dark:fill-zinc-400 font-mono text-[8.5px] font-bold"
                  >
                    {pt.t}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Right 5 Cols: Frequency-Domain FFT Peak (0.0167 Hz) */}
          <div
            className={`sm:col-span-5 p-1.5 rounded-lg border font-mono ${
              fftSpectrumLocked
                ? 'bg-rose-50/80 dark:bg-rose-950/35 border-rose-500'
                : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="text-[8px] font-bold text-rose-700 dark:text-rose-300 mb-0.5">
              FFT SPECTRUM · f₀ = 0.0167 Hz
            </div>
            <svg viewBox="0 0 220 78" className="w-full h-14 overflow-visible">
              <line
                x1="10"
                y1="60"
                x2="210"
                y2="60"
                stroke="currentColor"
                className="text-zinc-300 dark:text-zinc-800"
                strokeWidth="1.5"
              />
              <motion.path
                d="M 10 58 Q 40 55, 70 57 T 98 56 L 110 10 L 122 56 Q 160 57, 210 58"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.2"
                animate={{
                  scaleY: fftSpectrumLocked ? 1 : 0.45,
                }}
                style={{ transformOrigin: '110px 60px' }}
                transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              />
              <circle cx="110" cy="10" r="4" fill="#e11d48" />
              <text
                x="110"
                y="73"
                textAnchor="middle"
                className="fill-rose-600 dark:fill-rose-400 font-mono text-[8.5px] font-extrabold"
              >
                0.0167 Hz (1/60s)
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
