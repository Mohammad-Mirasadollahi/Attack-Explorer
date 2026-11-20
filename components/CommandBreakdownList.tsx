'use client';

import React from 'react';
import type {
  AttackScenario,
  AttackStage,
  ProcessTreeNode,
} from '@/modules/scenarios/types';
import {
  explainCommandLine,
  explainProcessNodeCommandLine,
  type StageCommandBreakdownItem,
} from '@/lib/command-line-explanations';
import { Cpu, Crosshair, ListTree, Terminal } from 'lucide-react';

interface CommandBreakdownListProps {
  commands: StageCommandBreakdownItem[];
  stageNumber?: number | string;
  compact?: boolean;
}

/**
 * Renders a detailed, line-by-line breakdown for every CommandLine and technical command
 * in a stage, explaining:
 * 1. The exact CommandLine / technical command executed
 * 2. What It Means (binary, syntax, and OS/subsystem mechanism)
 * 3. Exact Tactical & Forensic Purpose (why it is executed and what objective/artifact it produces)
 * 4. Individual Flag, Switch & Parameter Breakdown
 */
export function CommandBreakdownList({
  commands,
  stageNumber,
  compact = false,
}: CommandBreakdownListProps) {
  if (!commands || commands.length === 0) return null;

  return (
    <div
      data-testid={
        stageNumber != null
          ? `step-command-breakdown-list-${stageNumber}`
          : 'step-command-breakdown-list'
      }
      dir="ltr"
      className="rounded-xl bg-white/95 dark:bg-zinc-950/90 border border-indigo-200/90 dark:border-indigo-800/70 p-3 space-y-2.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-indigo-100 dark:border-indigo-900/60">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          <Terminal className="w-3.5 h-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>
            CommandLine & Technical Command Breakdown ({commands.length}{' '}
            {commands.length === 1 ? 'Command' : 'Commands'} Explained)
          </span>
        </div>
        <span className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
          Exact Meaning, Flags & Tactical Purpose of Every Command
        </span>
      </div>

      <div className="space-y-2.5">
        {commands.map((cmd, idx) => (
          <div
            key={`${cmd.id}-${idx}`}
            data-testid={`command-breakdown-card-${cmd.commandIndex}`}
            className="rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/75 p-3 space-y-2.5"
          >
            {/* Header Row: Command Badge & Subsystem */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono text-[10px] font-extrabold">
                <Terminal className="w-3 h-3 shrink-0" />
                <span>{cmd.badgeLabel}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[9.5px] font-semibold break-words">
                {cmd.toolOrSubsystem}
              </span>
            </div>

            {/* Verbatim CommandLine Terminal Box */}
            <div className="px-3 py-2 rounded-lg bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-relaxed break-words border border-zinc-800">
              <span className="text-zinc-500 select-none mr-1.5">$</span>
              <span>{cmd.rawCommand}</span>
            </div>

            {/* Two-Column Meaning & Exact Purpose Breakdown */}
            <div
              className={`grid grid-cols-1 ${
                compact ? '' : 'lg:grid-cols-2'
              } gap-2`}
            >
              {/* 1. What It Means */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-950/80 border border-indigo-200/70 dark:border-indigo-900/50 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  <Cpu className="w-3 h-3 shrink-0" />
                  <span>1. What This CommandLine Means (Mechanism):</span>
                </div>
                <p className="text-[11.5px] text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
                  {cmd.whatItMeans}
                </p>
              </div>

              {/* 2. Exact Tactical & Forensic Purpose */}
              <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  <Crosshair className="w-3 h-3 shrink-0" />
                  <span>2. Exact Purpose & Objective (Why Executed):</span>
                </div>
                <p className="text-[11.5px] text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
                  {cmd.exactPurpose}
                </p>
              </div>
            </div>

            {/* 3. Individual Flag, Switch & Argument Breakdown */}
            {cmd.parameters.length > 0 && (
              <div className="pt-1 space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-[9.5px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <ListTree className="w-3 h-3 shrink-0 text-indigo-500" />
                  <span>3. Argument, Flag & Parameter Breakdown:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {cmd.parameters.map((param, pIdx) => (
                    <div
                      key={`${cmd.id}-param-${pIdx}`}
                      className="p-2 rounded-lg bg-white/90 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-0.5"
                    >
                      <span className="font-mono text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 break-all">
                        {param.token}
                      </span>
                      <span className="text-[10.5px] text-zinc-600 dark:text-zinc-300 leading-snug break-words">
                        {param.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders an inline CommandLine meaning & purpose explanation block
 * directly beneath a process's CommandLine in process waterfall trees.
 */
export function ProcessCommandLineInlineExplanation({
  process,
  scenario,
  stage,
}: {
  process: ProcessTreeNode;
  scenario?: AttackScenario;
  stage?: AttackStage | null;
}) {
  const explained = explainProcessNodeCommandLine(process, scenario, stage);

  return (
    <div
      data-testid={`process-cmdline-explanation-${process.pid}`}
      dir="ltr"
      className="mt-1.5 p-2.5 rounded-lg bg-indigo-50/55 dark:bg-indigo-950/25 border border-indigo-200/75 dark:border-indigo-800/60 space-y-1.5 text-[11px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <span className="font-mono text-[9.5px] font-extrabold uppercase text-indigo-700 dark:text-indigo-300 block">
            CommandLine Meaning (What It Does):
          </span>
          <p className="text-zinc-800 dark:text-zinc-200 leading-snug break-words mt-0.5">
            {explained.whatItMeans}
          </p>
        </div>
        <div>
          <span className="font-mono text-[9.5px] font-extrabold uppercase text-amber-800 dark:text-amber-300 block">
            Exact Tactical Purpose (Why Used):
          </span>
          <p className="text-zinc-800 dark:text-zinc-200 leading-snug break-words mt-0.5">
            {explained.exactPurpose}
          </p>
        </div>
      </div>

      {explained.parameters.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-indigo-200/50 dark:border-indigo-800/50">
          {explained.parameters.map((p, idx) => (
            <span
              key={idx}
              className="inline-flex items-baseline gap-1 px-2 py-0.5 rounded bg-white/90 dark:bg-zinc-900/90 border border-indigo-200/70 dark:border-indigo-800/70 text-[10px] leading-snug break-words"
            >
              <strong className="font-mono text-indigo-700 dark:text-indigo-300">
                {p.token}:
              </strong>
              <span className="text-zinc-600 dark:text-zinc-300">
                {p.meaning}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Explains a single ad-hoc command string (e.g., inside an Expanded Sub-Board internal step
 * or a telemetry event card).
 */
export function SingleCommandExplanationCard({
  rawCommand,
  badgeLabel = 'EXECUTED COMMANDLINE',
  stageTitle,
  stageDescription,
  mitreId,
}: {
  rawCommand: string;
  badgeLabel?: string;
  stageTitle?: string;
  stageDescription?: string;
  mitreId?: string;
}) {
  if (!rawCommand || !rawCommand.trim()) return null;

  const item = explainCommandLine(rawCommand, {
    termLabel: badgeLabel,
    stageTitle,
    stageDescription,
    mitreId,
  });

  return <CommandBreakdownList commands={[item]} compact />;
}
