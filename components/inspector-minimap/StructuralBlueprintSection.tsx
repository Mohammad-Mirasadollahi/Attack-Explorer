'use client';

import React from 'react';
import { ArrowRight, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AttackScenario } from '@/lib/attack-scenarios';
import type { DocumentationArchitectureBlueprint } from '@/lib/documentation-structural-diagrams';
import { TONE_STYLES } from './styles';

export interface StructuralBlueprintSectionProps {
  blueprint: DocumentationArchitectureBlueprint;
  scenario: AttackScenario;
  onSelectNode?: (nodeId: string | null) => void;
}

export function StructuralBlueprintSection({
  blueprint,
  scenario,
  onSelectNode,
}: StructuralBlueprintSectionProps) {
  return (
    <div
      data-testid="documentation-structural-blueprint-grid"
      className="p-4 sm:p-5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 space-y-3"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Structural Architecture Pipeline — {blueprint.archetypeTitle}
          </h4>
        </div>
        <span className="text-[10.5px] font-mono font-semibold text-zinc-500 dark:text-zinc-400">
          Page-Native Structural Flow · {scenario.code}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {blueprint.layers.map((layer, index) => {
          const tone = TONE_STYLES[layer.accentTone];
          const isLast = index === blueprint.layers.length - 1;
          return (
            <div
              key={layer.id}
              onClick={() => {
                if (layer.linkedNodeId) {
                  onSelectNode?.(layer.linkedNodeId);
                }
              }}
              className={cn(
                'rounded-xl border p-3.5 flex flex-col justify-between gap-2.5 relative transition-all cursor-pointer hover:shadow-xs',
                tone.border,
                tone.bg
              )}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[9.5px] font-mono font-extrabold uppercase tracking-wider',
                      tone.badgeBg
                    )}
                  >
                    {layer.tierRoleLabel}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono font-extrabold text-zinc-800 dark:text-zinc-200">
                    {layer.nodeNumberBadge} · {layer.stageRef}
                  </span>
                </div>

                <div className="text-[13px] font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                  {layer.primaryTitle}
                </div>
                <div
                  className={cn(
                    'text-[11px] font-mono font-semibold leading-snug break-words',
                    tone.badgeText
                  )}
                >
                  {layer.technicalContext}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                {layer.keyArtifacts.map((art, aIdx) => (
                  <div
                    key={aIdx}
                    className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 px-2 py-1 rounded border border-zinc-200/70 dark:border-zinc-800/70 leading-snug break-words"
                  >
                    {art}
                  </div>
                ))}
              </div>

              {!isLast && (
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                  <span className="leading-snug break-words">
                    Next: {layer.transitionArrowLabel}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
