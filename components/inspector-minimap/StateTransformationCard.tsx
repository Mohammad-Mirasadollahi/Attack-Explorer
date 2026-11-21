'use client';

import React from 'react';
import { Cpu, Layers, ShieldAlert } from 'lucide-react';
import type { DocumentationArchitectureBlueprint } from '@/lib/documentation-structural-diagrams';

export interface StateTransformationCardProps {
  stateTransformation: DocumentationArchitectureBlueprint['stateTransformation'];
  className?: string;
}

export function StateTransformationCard({
  stateTransformation,
  className,
}: StateTransformationCardProps) {
  return (
    <div
      data-testid="documentation-state-transformation-card"
      className={
        className ??
        'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col justify-between gap-3'
      }
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-6 h-6 rounded-md bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 leading-snug break-words">
              {stateTransformation.title}
            </h4>
            <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
              Before-and-after structural state differential
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 p-3 space-y-1.5">
          <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            1. {stateTransformation.beforeLabel}
          </div>
          {stateTransformation.beforeSpecs.map((spec, sIdx) => (
            <div
              key={sIdx}
              className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 leading-snug break-words"
            >
              • {spec}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/25 p-2.5 flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              2. STRUCTURAL MUTATION / EXPLOIT OPERATOR
            </div>
            <div className="text-[11.5px] font-mono font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
              {stateTransformation.mutationOperator}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-rose-300 dark:border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20 p-3 space-y-1.5">
          <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-300">
            3. {stateTransformation.afterLabel}
          </div>
          {stateTransformation.afterSpecs.map((spec, sIdx) => (
            <div
              key={sIdx}
              className="text-[11px] font-mono text-zinc-800 dark:text-zinc-200 leading-snug break-words"
            >
              • {spec}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/25 p-2.5 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <div className="text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            4. VERIFIED SIEM / EDR DETECTION CATCH
          </div>
          <div className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
            {stateTransformation.detectionSignal}
          </div>
        </div>
      </div>
    </div>
  );
}
