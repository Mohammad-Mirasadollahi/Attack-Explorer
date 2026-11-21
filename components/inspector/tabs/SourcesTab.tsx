'use client';

import React from 'react';
import { ExternalLink, Scale } from 'lucide-react';
import type { AttackScenario } from '@/lib/attack-scenarios';
import {
  getScenarioAttribution,
  LEGAL_COMPLIANCE_STATEMENT,
} from '@/lib/attack-sources-and-legal';
import { ThreatIntelCard } from '../../ThreatIntelCard';

export interface SourcesTabProps {
  scenario: AttackScenario;
  onOpenSourcesModal: () => void;
}

export function SourcesTab({ scenario, onOpenSourcesModal }: SourcesTabProps) {
  const sourcesProfile = getScenarioAttribution(scenario);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm">
        <ThreatIntelCard scenario={scenario} />
      </div>

      <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <Scale className="w-4 h-4" />
            <span>
              Verified Analytical Sources ({sourcesProfile.primarySources.length})
            </span>
          </h3>
          <button
            type="button"
            onClick={onOpenSourcesModal}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
          >
            <span>Open Legal & Citations Modal</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee}
        </p>
      </section>
    </div>
  );
}
