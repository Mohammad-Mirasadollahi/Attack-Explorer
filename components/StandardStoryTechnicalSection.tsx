import React from 'react';
import { Sparkles } from 'lucide-react';
import {
  parseStructuredExplanationClauses,
  type StructuredExplanationClause,
} from '@/lib/scenario-step-guides';
import {
  deduplicateTechnicalClausesAgainstStory,
  hasSection3DScene,
  type Section3DKey,
} from '@/lib/section-3d-registry';
import { ScenarioSection3DEmbed } from './three/ScenarioSection3DEmbed';

export interface StandardStoryTechnicalSectionProps {
  /** Scenario identifier used to look up any registered bespoke Three.js scene */
  scenarioId: string;
  /** Optional section key ('briefing' | 'step-1'..'step-5' | 'memory-forensics') */
  sectionKey?: Section3DKey | null;
  /** Heading inside the amber Story Analogy card */
  storyHeading?: string;
  /** Plain-language story-like analogy rendered FIRST */
  storyAnalogy: string;
  /** Heading above the Technical Deep-Dive numbered clauses rendered RIGHT BELOW the story */
  technicalHeading?: string;
  /** Either pre-parsed clauses or raw technical explanation text */
  technicalClauses?: StructuredExplanationClause[];
  technicalText?: string;
  /** Prefix code for numbered technical clauses (e.g., '0', '1', 'M') */
  clausePrefix?: string;
  /** Optional data-testid for the story analogy card */
  storyTestId?: string;
  /** Optional data-testid for the technical container */
  technicalTestId?: string;
  /** Optional extra className */
  className?: string;
}

/**
 * Canonical Overview-Standard Section Block:
 *   1. Real-World Story Analogy (Overview Amber Card)
 *   2. Technical Forensic Explanation (Overview Numbered Indigo-Badge Clause Cards — directly below Story)
 *   3. Full-Width Interactive Cel-Shaded Anime 3D Stage (when registered for this scenario & section)
 *
 * Used identically across Overview, Step-by-Step Guide, Memory Forensics, and dedicated Scenario Landing Pages.
 */
export function StandardStoryTechnicalSection({
  scenarioId,
  sectionKey = null,
  storyHeading = 'Story-to-Spec Analogy & Executive Summary',
  storyAnalogy,
  technicalHeading = 'Technical Forensic Explanation',
  technicalClauses,
  technicalText,
  clausePrefix = '0',
  storyTestId,
  technicalTestId,
  className = '',
}: StandardStoryTechnicalSectionProps) {
  const rawClauses =
    technicalClauses && technicalClauses.length > 0
      ? technicalClauses
      : technicalText
      ? parseStructuredExplanationClauses(technicalText, clausePrefix)
      : [];

  const resolvedClauses = deduplicateTechnicalClausesAgainstStory(
    rawClauses,
    storyAnalogy,
    clausePrefix
  );

  const show3D = Boolean(
    sectionKey && hasSection3DScene(scenarioId, sectionKey)
  );

  return (
    <div
      data-testid={
        sectionKey ? `standard-story-tech-3d-${sectionKey}` : undefined
      }
      className={`space-y-3 ${className}`}
    >
      {/* 1. FIRST: Story-Like Real-World Analogy (Exact Overview Amber Card Standard) */}
      <div
        data-testid={storyTestId}
        className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/60 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-1"
      >
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{storyHeading}</span>
        </div>
        <p className="text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
          {storyAnalogy}
        </p>
      </div>

      {/* 2. RIGHT BELOW STORY: Technical Explanation (Exact Overview Numbered Clause Standard) */}
      {resolvedClauses.length > 0 && (
        <div data-testid={technicalTestId} className="space-y-2">
          <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {technicalHeading}
          </div>
          <div className="space-y-2">
            {resolvedClauses.map((clause, cIdx) => (
              <div
                key={`${clause.clauseCode}-${cIdx}`}
                className="p-2.5 rounded-xl bg-zinc-50/90 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5"
              >
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9.5px] font-extrabold shrink-0 mt-0.5">
                    #{clause.clauseCode}
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed break-words flex-1">
                    {clause.fullText.replace(/\(\s*why\s*:\s*/gi, '(')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FULL-WIDTH STANDARD ANIME 3D STAGE */}
      {show3D && sectionKey && (
        <ScenarioSection3DEmbed
          scenarioId={scenarioId}
          sectionKey={sectionKey}
          className="pt-1"
        />
      )}
    </div>
  );
}
