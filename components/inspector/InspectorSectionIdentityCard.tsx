'use client';

import React from 'react';
import { SketchNodeIcon } from '../SketchNodeIcons';
import type { WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import type { NetworkZoneColumn } from '@/lib/sketch-zones-and-drilldown';

interface InspectorSectionIdentityCardProps {
  activeInspectNode: WhiteboardSketchNode;
  activeInspectZone: NetworkZoneColumn | null;
  envBadgeLabel: string;
}

/** Focused Section Technical Identity & Forensic Specs — Overview only. */
export function InspectorSectionIdentityCard({
  activeInspectNode,
  activeInspectZone,
  envBadgeLabel,
}: InspectorSectionIdentityCardProps) {
  return (
<section
              data-testid="inspector-section-identity-card"
              className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-4 sm:p-5 shadow-sm flex flex-col gap-3.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-16 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1.5 shrink-0">
                    <SketchNodeIcon
                      iconType={activeInspectNode.iconType}
                      isActive={activeInspectNode.isActive}
                      isCompromised={activeInspectNode.isCompromised}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px] font-bold">
                        #{activeInspectNode.sequenceCode || activeInspectNode.chainOrder}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] font-bold">
                        {activeInspectNode.actionBadge}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[9.5px] font-bold ${
                          activeInspectNode.isCompromised
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {activeInspectNode.isCompromised
                          ? 'COMPROMISED'
                          : 'ACTIVE TELEMETRY'}
                      </span>
                    </div>
                    <h2 className="mt-1 text-base font-extrabold text-zinc-950 dark:text-white leading-snug break-words">
                      {activeInspectNode.label}
                    </h2>
                    <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 break-words">
                      {activeInspectNode.sublabel}
                    </div>
                  </div>
                </div>

                {/* Forensic Artifacts List */}
                {activeInspectNode.originalNode?.details?.artifacts &&
                  activeInspectNode.originalNode.details.artifacts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {activeInspectNode.originalNode.details.artifacts.map(
                        (art, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-lg bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/70 font-mono text-[10.5px] break-all"
                          >
                            {art}
                          </span>
                        )
                      )}
                    </div>
                  )}
              </div>

              {/* Technical Specs 4-Column Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/70 dark:border-zinc-800/80 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase">
                    ZONE LOCATION
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 break-words">
                    {activeInspectZone
                      ? `${activeInspectZone.code} · ${activeInspectZone.title}`
                      : activeInspectNode.zoneLabel || activeInspectNode.zoneId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase">
                    ENDPOINT / PORT / PID
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 break-words">
                    {activeInspectNode.originalNode?.details?.pidOrPort ||
                      activeInspectNode.sublabel}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase">
                    OS / SUBSYSTEM TYPE
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 break-words">
                    {activeInspectNode.originalNode?.details?.osOrType ||
                      envBadgeLabel}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase">
                    PRIVILEGE CONTEXT
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 break-words">
                    {activeInspectNode.originalNode?.details?.privilege ||
                      'Standard / System Context'}
                  </span>
                </div>
              </div>
            </section>
  );
}
