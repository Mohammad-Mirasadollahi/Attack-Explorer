'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AttackScenario } from '@/lib/attack-scenarios';
import { formatConciseStagePillLabel } from '@/lib/ui-text-standards';
import { WorkbenchIconTooltip } from './WorkbenchIconTooltip';
import { Check, Eye, EyeOff, Layers } from 'lucide-react';

interface AttackStepProgressBarProps {
  scenario: AttackScenario;
  activeStageIndex: number;
  isPlaying: boolean;
  onSelectStage: (stageIndex: number) => void;
}

export function AttackStepProgressBar({
  scenario,
  activeStageIndex,
  isPlaying,
  onSelectStage,
}: AttackStepProgressBarProps) {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const totalStages = scenario.stages.length;
  const progressPct =
    activeStageIndex === 0
      ? 0
      : Math.min(100, Math.round((activeStageIndex / totalStages) * 100));

  const currentStage =
    activeStageIndex > 0 ? scenario.stages[activeStageIndex - 1] : null;
  const currentConcise = currentStage
    ? formatConciseStagePillLabel(currentStage)
    : null;

  // Collapsed State: Ultra-compact single-line strip with "Show Stages" button
  if (isHidden) {
    return (
      <div
        dir="ltr"
        data-testid="attack-step-progress-bar-collapsed"
        data-active-stage={activeStageIndex}
        data-progress-pct={progressPct}
        className="shrink-0 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200/80 dark:border-zinc-800/80 px-3 py-1 flex items-center justify-between gap-2 z-30"
      >
        <div className="flex items-center gap-2 text-[10.5px] font-mono">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {activeStageIndex === 0
              ? `Overview (${totalStages} Stages)`
              : currentConcise?.shortLabel}
          </span>
          <span className="text-zinc-400">·</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">
            {progressPct}%
          </span>
        </div>

        <WorkbenchIconTooltip
          label="Show Stage Progress Bar"
          badge="STAGES"
          detail="Expand top attack stage timeline & progress bar"
          side="bottom"
          align="right"
        >
          <button
            type="button"
            data-testid="show-step-progress-bar-btn"
            aria-label="Show Attack Stage Progress Bar"
            onClick={() => setIsHidden(false)}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-800 text-[10.5px] font-mono font-semibold transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Show Stages</span>
          </button>
        </WorkbenchIconTooltip>
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      data-testid="attack-step-progress-bar"
      data-active-stage={activeStageIndex}
      data-progress-pct={progressPct}
      aria-label="Attack Stage Progress Bar"
      className="shrink-0 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200/80 dark:border-zinc-800/80 px-3 py-1.5 flex flex-col gap-1.5 z-30"
    >
      {/* Top Synchronized Continuous Progress Track */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <WorkbenchIconTooltip
            label={
              currentStage
                ? `Stage ${currentStage.index}: ${currentStage.title}`
                : `${scenario.name} (${totalStages} Stages)`
            }
            badge={currentStage ? currentStage.mitreTechniqueId : scenario.code}
            detail={
              currentStage ? currentStage.subtitle : scenario.shortSubtitle
            }
            side="bottom"
            align="left"
          >
            <span className="text-[10.5px] font-mono font-bold text-zinc-800 dark:text-zinc-200 cursor-default">
              {activeStageIndex === 0
                ? `FULL TOPOLOGY OVERVIEW (${totalStages} STAGES)`
                : `STAGE ${activeStageIndex} OF ${totalStages} · ${
                    currentStage?.title || ''
                  }`}
            </span>
          </WorkbenchIconTooltip>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono tabular-nums">
          <span className="text-zinc-500 dark:text-zinc-400">
            {isPlaying ? 'ANIMATING SEQUENCE' : 'SYNCHRONIZED'}
          </span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {progressPct}%
          </span>

          <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />

          <WorkbenchIconTooltip
            label="Hide Stage Progress Bar"
            badge="HIDE"
            detail="Collapse top stage bar to maximize diagram canvas height"
            side="bottom"
            align="right"
          >
            <button
              type="button"
              data-testid="hide-step-progress-bar-btn"
              aria-label="Hide Attack Stage Progress Bar"
              onClick={() => setIsHidden(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
            >
              <EyeOff className="w-3 h-3 shrink-0" />
              <span>Hide</span>
            </button>
          </WorkbenchIconTooltip>
        </div>
      </div>

      {/* Animated Fill Bar */}
      <div className="relative h-1.5 w-full rounded-full bg-zinc-200/80 dark:bg-zinc-800 overflow-hidden">
        <motion.div
          data-testid="attack-step-progress-fill"
          initial={false}
          animate={{
            width: `${activeStageIndex === 0 ? 100 : progressPct}%`,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className={`h-full rounded-full ${
            activeStageIndex === 0
              ? 'bg-zinc-400/50 dark:bg-zinc-600/50'
              : isPlaying
              ? 'bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500'
              : 'bg-indigo-600 dark:bg-indigo-500'
          }`}
        />
      </div>

      {/* Interactive Stage Step Nodes Synchronized with Diagram Nodes (Concise Labels + Rich Tooltips, Zero Truncation) */}
      <div
        role="group"
        aria-label="Attack Scenario Stage Steps"
        className="flex items-center gap-1.5 overflow-x-auto pb-0.5"
      >
        <WorkbenchIconTooltip
          label={`All Stages Overview (${totalStages} Stages)`}
          badge={scenario.code}
          detail={`${scenario.name} — ${scenario.shortSubtitle}`}
          side="bottom"
          align="left"
        >
          <button
            type="button"
            data-testid="visualizer-step-btn-0"
            onClick={() => onSelectStage(0)}
            className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
              activeStageIndex === 0
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-bold shadow-2xs'
                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Layers className="w-3 h-3 shrink-0" />
            <span>All Stages</span>
          </button>
        </WorkbenchIconTooltip>

        {scenario.stages.map((stage) => {
          const isCurrent = activeStageIndex === stage.index;
          const isCompleted = activeStageIndex > stage.index;
          const conciseMeta = formatConciseStagePillLabel(stage);

          return (
            <WorkbenchIconTooltip
              key={stage.index}
              label={conciseMeta.tooltipTitle}
              badge={conciseMeta.badge}
              detail={conciseMeta.tooltipDetail}
              side="bottom"
            >
              <button
                type="button"
                data-testid={`visualizer-step-btn-${stage.index}`}
                onClick={() => onSelectStage(stage.index)}
                className={`relative shrink-0 px-2.5 py-1 rounded-md text-[10.5px] font-mono flex items-center justify-between gap-2 transition-all cursor-pointer border whitespace-nowrap ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                    : isCompleted
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800/80 font-semibold'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-white text-indigo-700'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-2.5 h-2.5" />
                    ) : (
                      stage.index
                    )}
                  </span>
                  <span>{conciseMeta.shortLabel}</span>
                </span>

                <span
                  className={`text-[9px] shrink-0 ${
                    isCurrent
                      ? 'text-indigo-100'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {stage.mitreTechniqueId}
                </span>
              </button>
            </WorkbenchIconTooltip>
          );
        })}
      </div>
    </div>
  );
}
