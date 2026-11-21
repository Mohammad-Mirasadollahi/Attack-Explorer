'use client';

import React from 'react';
import type { StructuredExplanationClause } from '@/lib/scenario-step-guides';

/**
 * Renders structured numbered clauses (#N.1, #N.2...) with natural inline
 * parenthetical explanations directly inside the text.
 */
export function StructuredClausesList({
  clauses,
  accent = 'indigo',
}: {
  clauses: StructuredExplanationClause[];
  accent?: 'indigo' | 'slate';
}) {
  if (!clauses || clauses.length === 0) return null;

  return (
    <div className="space-y-2">
      {clauses.map((clause, idx) => {
        const clauseAnchorId = `clause-${clause.clauseCode}`;
        return (
          <div
            key={`${clause.clauseCode}-${idx}`}
            id={clauseAnchorId}
            data-testid={`step-clause-${clause.clauseCode}`}
            onClick={() => {
              if (typeof window !== 'undefined') {
                const nextUrl = `${window.location.pathname}${window.location.search}#${clauseAnchorId}`;
                window.history.replaceState(null, '', nextUrl);
              }
            }}
            className={`p-2.5 rounded-lg border transition-colors scroll-mt-20 ${
              accent === 'indigo'
                ? 'bg-white/95 dark:bg-zinc-900/90 border-indigo-200/80 dark:border-indigo-900/50 hover:border-indigo-400'
                : 'bg-white/90 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400'
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                title={`Direct URL anchor: #${clauseAnchorId}`}
                className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-extrabold shrink-0 mt-0.5 ${
                  accent === 'indigo'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900'
                }`}
              >
                #{clause.clauseCode}
              </span>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed break-words flex-1">
                {clause.fullText.replace(/\(\s*why\s*:\s*/gi, '(')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
