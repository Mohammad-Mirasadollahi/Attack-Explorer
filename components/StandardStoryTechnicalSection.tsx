import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  parseStructuredExplanationClauses,
  type StructuredExplanationClause,
} from '@/lib/scenario-step-guides';
import {
  deduplicateTechnicalClausesAgainstStory,
  getSection3DDescriptor,
  hasSection3DScene,
  type Section3DKey,
  type StoryTechnicalMapping,
} from '@/lib/section-3d-registry';
import { ScenarioSection3DEmbed } from './three/ScenarioSection3DEmbed';

export interface StandardStoryTechnicalSectionProps {
  /** Scenario identifier used to look up any registered bespoke Three.js scene */
  scenarioId: string;
  /** Optional section key ('briefing' | 'step-1'..'step-5' | 'memory-forensics') */
  sectionKey?: Section3DKey | null;
  /** Heading inside the amber Story Analogy card */
  storyHeading?: string;
  /** Plain-language story-like analogy rendered FIRST (omit when `omitStory`) */
  storyAnalogy?: string;
  /** Optional explicit Story -> Technical translation pairs (auto-loaded from registry if omitted) */
  storyMappings?: StoryTechnicalMapping[];
  /**
   * When true, skip the amber Story Analogy + Story-to-Technical Key
   * (e.g. Steps #0 briefing — Overview already owns that story).
   */
  omitStory?: boolean;
  /** Heading above the Technical Deep-Dive numbered clauses rendered BELOW the 3D stage (or directly below Story when no 3D) */
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

const MAPPING_TONE_CLASSES: Record<
  StoryTechnicalMapping['tone'],
  { badge: string; arrow: string; tech: string }
> = {
  sky: {
    badge:
      'bg-sky-100/90 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 border-sky-300/80 dark:border-sky-800/70',
    arrow: 'text-sky-600 dark:text-sky-400',
    tech: 'text-sky-900 dark:text-sky-300',
  },
  rose: {
    badge:
      'bg-rose-100/90 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300/80 dark:border-rose-800/70',
    arrow: 'text-rose-600 dark:text-rose-400',
    tech: 'text-rose-900 dark:text-rose-300',
  },
  amber: {
    badge:
      'bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300/80 dark:border-amber-800/70',
    arrow: 'text-amber-600 dark:text-amber-400',
    tech: 'text-amber-900 dark:text-amber-300',
  },
  emerald: {
    badge:
      'bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300/80 dark:border-emerald-800/70',
    arrow: 'text-emerald-600 dark:text-emerald-400',
    tech: 'text-emerald-900 dark:text-emerald-300',
  },
};

/**
 * Canonical Overview-Standard Section Block:
 *   1. Real-World Story Analogy (100% Jargon-Free Overview Amber Card)
 *   1B. Story -> Technical Translation Key (Explicit "What each story piece means in Windows")
 *   2. Full-Width Interactive Cel-Shaded Anime 3D Stage (animating every step of the exact story)
 *   3. Technical Forensic Explanation (Overview Numbered Indigo-Badge Clause Cards — directly below the film)
 *
 * Used identically across Overview, Step-by-Step Guide, Memory Forensics, and dedicated Scenario Landing Pages.
 */
export function StandardStoryTechnicalSection({
  scenarioId,
  sectionKey = null,
  storyHeading = 'Story-to-Spec Analogy & Executive Summary',
  storyAnalogy = '',
  storyMappings,
  omitStory = false,
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

  const resolvedClauses = omitStory
    ? rawClauses
    : deduplicateTechnicalClausesAgainstStory(
        rawClauses,
        storyAnalogy,
        clausePrefix
      );

  const descriptor = sectionKey
    ? getSection3DDescriptor(scenarioId, sectionKey)
    : null;
  const resolvedMappings =
    storyMappings && storyMappings.length > 0
      ? storyMappings
      : descriptor?.storyMappings ?? [];

  const show3D = Boolean(
    sectionKey && hasSection3DScene(scenarioId, sectionKey)
  );
  const showStory = !omitStory && Boolean(storyAnalogy.trim());

  return (
    <div
      data-testid={
        sectionKey ? `standard-story-tech-3d-${sectionKey}` : undefined
      }
      className={`space-y-3 ${className}`}
    >
      {/* 1. FIRST: Story-Like Real-World Analogy (Exact Overview Amber Card Standard) */}
      {showStory && (
        <div
          data-testid={storyTestId}
          className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/60 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-2.5"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{storyHeading}</span>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
              {storyAnalogy}
            </p>
          </div>

          {/* 1B. Explicit Story <-> Technical Translation Key right inside the Story-to-Spec bridge */}
          {resolvedMappings.length > 0 && (
            <div
              data-testid={
                sectionKey ? `story-tech-mapping-key-${sectionKey}` : undefined
              }
              className="pt-2.5 border-t border-amber-200/80 dark:border-amber-800/60 space-y-1.5"
            >
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-900/90 dark:text-amber-300/90">
                Story-to-Technical Key (What Each Story Piece Means in Windows)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {resolvedMappings.map((item, idx) => {
                  const styles = MAPPING_TONE_CLASSES[item.tone];
                  return (
                    <div
                      key={`${item.storyTerm}-${idx}`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 dark:bg-zinc-950/75 border border-amber-200/70 dark:border-zinc-800 text-[11px] leading-snug"
                    >
                      <span
                        className={`px-1.5 py-0.5 rounded border font-bold shrink-0 ${styles.badge}`}
                      >
                        {item.storyTerm}
                      </span>
                      <ArrowRight
                        className={`w-3 h-3 shrink-0 ${styles.arrow}`}
                      />
                      <span
                        className={`font-mono font-semibold break-words min-w-0 ${styles.tech}`}
                      >
                        {item.technicalTerm}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. FULL-WIDTH STANDARD ANIME 3D STAGE (directly below Story, or first when Story omitted) */}
      {show3D && sectionKey && (
        <ScenarioSection3DEmbed
          scenarioId={scenarioId}
          sectionKey={sectionKey}
          className="pt-1"
        />
      )}

      {/* 3. BELOW FILM: Technical Explanation (Exact Overview Numbered Clause Standard) */}
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
    </div>
  );
}
