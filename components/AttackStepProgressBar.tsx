'use client';

import React from 'react';
import { motion } from 'motion/react';
import { AttackScenario } from '@/lib/attack-scenarios';
import { Check, Layers } from 'lucide-react';

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
  const totalStages = scenario.stages.length;
  const progressPct =
    activeStageIndex === 0
      ? 0
      : Math.min(100, Math.round((activeStageIndex / totalStages) * 100));

  return (
    <div
      data-testid="attack-step-progress-bar"
      data-active-stage={activeStageIndex}
      data-progress-pct={progressPct}
      aria-label="Attack Stage Progress Bar"
      className="shrink-0 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200/80 dark:border-zinc-800/80 px-3 py-1.5 flex flex-col gap-1.5 z-20"
    >
      {/* Top Synchronized Continuous Progress Track */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10.5px] font-mono font-bold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
            {activeStageIndex === 0
              ? `FULL TOPOLOGY OVERVIEW (${totalStages} STAGES)`
              : `STAGE ${activeStageIndex} OF ${totalStages} · ${
                  scenario.stages[activeStageIndex - 1]?.title || ''
                }`}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono tabular-nums">
          <span className="text-zinc-500 dark:text-zinc-400">
            {isPlaying ? 'ANIMATING SEQUENCE' : 'SYNCHRONIZED'}
          </span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {progressPct}%
          </span>
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

      {/* Interactive Stage Step Nodes Synchronized with Diagram Nodes */}
      <div
        role="group"
        aria-label="Attack Scenario Stage Steps"
        className="flex items-center gap-1 overflow-x-auto pb-0.5"
      >
        <button
          type="button"
          data-testid="visualizer-step-btn-0"
          onClick={() => onSelectStage(0)}
          className={`px-2 py-1 rounded-md text-[10.5px] font-mono flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
            activeStageIndex === 0
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-bold shadow-2xs'
              : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Layers className="w-3 h-3 shrink-0" />
          <span>All Stages</span>
        </button>

        {scenario.stages.map((stage) => {
          const isCurrent = activeStageIndex === stage.index;
          const isCompleted = activeStageIndex > stage.index;

          return (
            <button
              key={stage.index}
              type="button"
              data-testid={`visualizer-step-btn-${stage.index}`}
              onClick={() => onSelectStage(stage.index)}
              title={`Stage ${stage.index}: ${stage.title} (${stage.mitreTechniqueId})`}
              className={`relative shrink-0 px-2.5 py-1 rounded-md text-[10.5px] font-mono flex items-center justify-between gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                isCurrent
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                  : isCompleted
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800/80 font-semibold'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
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
                <span>
                  S{stage.index}: {stage.title}
                </span>
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
          );
        })}
      </div>
    </div>
  );
}
