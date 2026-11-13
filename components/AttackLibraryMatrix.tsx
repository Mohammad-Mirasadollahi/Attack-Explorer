'use client';

import React from 'react';
import {
  AttackLibraryItem,
  MitreCategoryDescriptor } from '@/lib/attack-library-service';

interface AttackLibraryMatrixProps {
  mitreCategories: MitreCategoryDescriptor[];
  items: AttackLibraryItem[];
  onLaunchScenario: (scenarioId: string, stageIndex?: number) => void;
}

export function AttackLibraryMatrix({
  mitreCategories,
  items,
  onLaunchScenario }: AttackLibraryMatrixProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5"
      dir="ltr"
    >
      {mitreCategories.map((tactic) => {
        const matchingStages = items.flatMap((item) =>
          item.stages
            .filter((st) => st.mitreTacticPhase === tactic.phase)
            .map((st) => ({ item, stage: st }))
        );

        return (
          <div
            key={tactic.phase}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col min-w-0 overflow-hidden shadow-2xs"
          >
            <div className="p-2.5 bg-zinc-900 dark:bg-zinc-800 text-white border-b border-zinc-800 min-w-0">
              <div
                title={`PHASE ${tactic.phase} · ${tactic.tacticCode}`}
                className="text-[10px] font-mono opacity-75 truncate"
              >
                PHASE {tactic.phase} · {tactic.tacticCode}
              </div>
              <div
                title={tactic.shortName}
                className="text-xs font-bold uppercase tracking-wide truncate leading-snug"
              >
                {tactic.shortName}
              </div>
            </div>

            <div className="p-2 space-y-2 flex-1 min-w-0">
              {matchingStages.length === 0 ? (
                <div className="py-6 text-center text-[11px] font-mono text-zinc-400">
                  No techniques in filter
                </div>
              ) : (
                matchingStages.map(({ item, stage }) => (
                  <button
                    key={`${item.scenarioId}-${stage.index}`}
                    type="button"
                    title={`${stage.mitreTechniqueId} (Step #${stage.index}) · ${stage.title} — ${item.name}`}
                    onClick={() =>
                      onLaunchScenario(item.scenarioId, stage.index)
                    }
                    className="w-full text-left p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400 transition-colors cursor-pointer group min-w-0 overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1 min-w-0">
                      <span
                        title={stage.mitreTechniqueId}
                        className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 truncate min-w-0"
                      >
                        {stage.mitreTechniqueId}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                        Step #{stage.index}
                      </span>
                    </div>
                    <div
                      title={stage.title}
                      className="text-[11px] font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 leading-snug mb-1 truncate"
                    >
                      {stage.title}
                    </div>
                    <div
                      title={item.name}
                      className="text-[10px] font-mono text-zinc-500 truncate leading-snug"
                    >
                      {item.name}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
