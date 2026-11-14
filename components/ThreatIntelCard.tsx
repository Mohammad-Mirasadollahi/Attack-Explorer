'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { AttackScenario } from '@/lib/attack-scenarios';
import {
  getCuratedThreatIntel,
  ThreatIntelContextData,
} from '@/lib/threat-intel-service';
import {
  AlertTriangle,
  ExternalLink,
  Globe,
  RefreshCw,
  ShieldAlert,
  Users,
} from 'lucide-react';

interface ThreatIntelCardProps {
  scenario: AttackScenario;
}

export function ThreatIntelCard({ scenario }: ThreatIntelCardProps) {
  const [liveIntelByScenario, setLiveIntelByScenario] = useState<
    Record<string, ThreatIntelContextData>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const intel = useMemo(
    () => liveIntelByScenario[scenario.id] ?? getCuratedThreatIntel(scenario),
    [liveIntelByScenario, scenario]
  );

  const fetchGroundedIntel = useCallback(async (scenarioId: string) => {
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 7000);
      const res = await fetch('/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId }),
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);
      if (res.ok) {
        const data = (await res.json()) as ThreatIntelContextData;
        if (data && data.scenarioId === scenarioId) {
          setLiveIntelByScenario((prev) => ({
            ...prev,
            [scenarioId]: data,
          }));
        }
      }
    } catch {
      // Retain curated fallback intelligence on offline/network errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <section
      data-testid="threat-intel-card"
      aria-label="Real-World Threat Intelligence and Search Grounding"
      className="p-3 rounded-xl bg-zinc-50/90 dark:bg-zinc-900/75 border border-zinc-200/90 dark:border-zinc-800 space-y-3"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Globe className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          <h4
            title="Threat Intel & Search Grounding"
            className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 min-w-0 leading-snug"
          >
            Threat Intel & Search Grounding
          </h4>
        </div>

        <button
          type="button"
          data-testid="threat-intel-refresh-btn"
          onClick={() => fetchGroundedIntel(scenario.id)}
          disabled={isLoading}
          title="Refresh Real-World Threat Context via Google Search Grounding"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 text-[10px] font-mono text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <RefreshCw
            className={`w-2.5 h-2.5 ${isLoading ? 'animate-spin text-indigo-500' : ''}`}
          />
          <span>{isLoading ? 'Grounding...' : 'Sync Live'}</span>
        </button>
      </div>

      {/* Source Grounding Status Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
        <span className="min-w-0 leading-snug">
          Mode:{' '}
          <strong className="text-indigo-600 dark:text-indigo-400">
            {intel.sourceMode === 'LIVE_SEARCH_GROUNDING'
              ? 'Google Search Grounded'
              : 'Verified Threat Intel Feed'}
          </strong>
        </span>
        <span className="shrink-0">{intel.scenarioCode}</span>
      </div>

      {/* Real-World Executive Context */}
      <p
        data-testid="threat-intel-summary"
        className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed break-words"
      >
        {intel.summary}
      </p>

      {/* Associated CVEs & CISA KEV */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-200">
          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="leading-snug">Associated CVEs & Exploited Flaws</span>
        </div>
        <div className="space-y-1.5" data-testid="threat-intel-cve-list">
          {intel.cves.map((cve) => (
            <div
              key={cve.id}
              className="p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-0.5 min-w-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 text-[10.5px] font-mono">
                <span
                  title={cve.id}
                  className="font-bold text-rose-600 dark:text-rose-400 min-w-0 leading-snug"
                >
                  {cve.id}
                </span>
                <span
                  title={`CVSS ${cve.cvss} · ${cve.status}`}
                  className="text-amber-600 dark:text-amber-400 font-semibold shrink-0 leading-snug"
                >
                  CVSS {cve.cvss} · {cve.status}
                </span>
              </div>
              <p className="text-[10.5px] text-zinc-600 dark:text-zinc-400 leading-snug break-words">
                {cve.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Known Threat Actor Groups */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-200">
          <Users className="w-3 h-3 text-indigo-500 shrink-0" />
          <span className="leading-snug">Associated Adversary & APT Groups</span>
        </div>
        <div className="space-y-1.5" data-testid="threat-intel-actors-list">
          {intel.actorGroups.map((actor) => (
            <div
              key={actor.name}
              className="p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-0.5 min-w-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
                <span
                  title={actor.name}
                  className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 min-w-0 leading-snug"
                >
                  {actor.name}
                </span>
                <span
                  title={actor.aliases}
                  className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400 leading-snug break-words"
                >
                  {actor.aliases}
                </span>
              </div>
              <div
                title={`Sectors: ${actor.targetSectors}`}
                className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 leading-snug break-words"
              >
                Sectors: {actor.targetSectors}
              </div>
              <p className="text-[10.5px] text-zinc-600 dark:text-zinc-400 leading-snug break-words">
                {actor.notableCampaign}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Grounded Web Citations */}
      {intel.groundedSources.length > 0 && (
        <div className="pt-1.5 border-t border-zinc-200/70 dark:border-zinc-800 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
            <ShieldAlert className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="leading-snug">Search-Grounded Citations</span>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            {intel.groundedSources.map((src, idx) => (
              <a
                key={`${src.uri}-${idx}`}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                title={`${src.title} — ${src.uri}`}
                className="inline-flex items-center justify-between gap-1.5 px-2 py-1 rounded bg-white dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline min-w-0"
              >
                <span className="min-w-0 leading-snug break-words">{src.title}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
