'use client';

import React, { useMemo } from 'react';
import { AttackScenario, TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import {
  InspectorScopeContext,
  resolveInspectorScopeContext,
  resolveScopedMemoryForensics,
} from '@/lib/inspector-scope';
import { Cpu, Layers, ShieldAlert, Terminal } from 'lucide-react';

interface ProcessMemoryViewProps {
  scenario: AttackScenario;
  activeEnvironment?: ActiveEnvironmentId;
  scopeContext?: InspectorScopeContext;
  selectedTelemetry?: TelemetryEvent | null;
}

export function ProcessMemoryView({
  scenario,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  scopeContext,
  selectedTelemetry = null,
}: ProcessMemoryViewProps) {
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  const effectiveScopeContext = useMemo(() => {
    if (scopeContext) return scopeContext;
    return resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 0,
      activeEnvironment,
      selectedNodeId: null,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
  }, [scopeContext, scenario, activeEnvironment]);

  const scopedMemory = useMemo(
    () =>
      resolveScopedMemoryForensics(effectiveScopeContext, selectedTelemetry),
    [effectiveScopeContext, selectedTelemetry]
  );

  // Strict grounding: if no documented memory exists for this scenario or current Inspector section, render nothing
  if (
    !scopedMemory.hasDocumentedMemory ||
    scopedMemory.memoryBlocks.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="relative w-full p-4 sm:p-6 bg-white dark:bg-[#09090B]"
      dir="ltr"
      data-testid="process-memory-view"
      data-active-environment={activeEnvironment}
    >
      <div className="w-full space-y-5">
        {/* Active Environment & Scope Memory Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-xs">
          <div className="flex flex-wrap items-center gap-2 font-mono min-w-0">
            <span
              data-testid="memory-env-badge"
              title={envProfile.badgeLabel}
              className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10.5px] shrink-0"
            >
              {envProfile.badgeLabel}
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-[10.5px] shrink-0">
              {effectiveScopeContext.scopeBadgeLabel}
            </span>
            <span
              title={`${envProfile.primaryHostname} · ${envProfile.osSummary}`}
              className="font-semibold text-zinc-800 dark:text-zinc-200 min-w-0 leading-snug break-words"
            >
              {envProfile.primaryHostname} · {envProfile.osSummary}
            </span>
          </div>
          <span
            title={`${envProfile.environmentTag} · ${envProfile.subnetBadge}`}
            className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0 leading-snug"
          >
            {envProfile.environmentTag} · {envProfile.subnetBadge}
          </span>
        </div>

        {/* Context-Aware Memory Forensics Briefing */}
        <section
          data-testid="memory-scope-briefing"
          className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 flex flex-wrap items-start justify-between gap-3"
        >
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              <Cpu className="w-3.5 h-3.5 shrink-0" />
              <span>
                DOCUMENTED VIRTUAL MEMORY FORENSICS (VAD / PE-SIEVE GROUNDED)
              </span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
              {scopedMemory.scopeExplanation}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300">
              {scopedMemory.memoryBlocks.length} Documented Memory Regions
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Process Execution Tree (Compact 4/12 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 min-w-0 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pb-3 border-b border-zinc-200/70 dark:border-zinc-800">
              <div className="flex items-center gap-2 min-w-0">
                <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <h3
                  title="Process Execution Tree & API Calls"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 min-w-0 leading-snug"
                >
                  Process Execution Tree & API Calls
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400 tabular-nums shrink-0">
                {scopedMemory.relatedProcessTree.length} processes
              </span>
            </div>

            <div className="space-y-3" dir="ltr">
              {scopedMemory.relatedProcessTree.map((proc, index) => (
                <div
                  key={`${proc.pid}-${index}`}
                  style={{ marginLeft: `${index * 12}px` }}
                  className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2 min-w-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span
                        title={proc.name}
                        className="font-semibold text-zinc-900 dark:text-white min-w-0 leading-snug break-words"
                      >
                        {proc.name}
                      </span>
                      <span
                        title={`PID ${proc.pid} · PPID ${proc.ppid}`}
                        className="text-zinc-400 tabular-nums shrink-0"
                      >
                        PID {proc.pid} · PPID {proc.ppid}
                      </span>
                    </div>
                    <span
                      title={`${proc.status} · ${proc.integrity}`}
                      className={`text-[11px] font-medium shrink-0 ${
                        proc.status === 'normal'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {proc.status} · {proc.integrity}
                    </span>
                  </div>

                  <div
                    title={proc.commandLine}
                    className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg break-all"
                  >
                    {proc.commandLine}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 min-w-0 text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                    {proc.apiCalls.map((api, idx) => (
                      <React.Fragment key={idx}>
                        <span title={api} className="leading-snug break-all">
                          {api}
                        </span>
                        {idx < proc.apiCalls.length - 1 && (
                          <span className="text-zinc-300 dark:text-zinc-700">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Documented Virtual Memory Map & Hex Inspector (Wide 8/12 on xl for Forensic Explanations) */}
          <div className="lg:col-span-7 xl:col-span-8 min-w-0 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pb-3 border-b border-zinc-200/70 dark:border-zinc-800">
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <h3
                  title="Virtual Memory Layout & Hex Forensics"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 min-w-0 leading-snug"
                >
                  Virtual Memory Layout & Hex Forensics
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400 shrink-0">
                VAD / PE-sieve
              </span>
            </div>

            <div className="space-y-3" dir="ltr">
              {scopedMemory.memoryBlocks.map((block, i) => (
                <div
                  key={`${block.address}-${i}`}
                  data-testid={`memory-block-card-${i}`}
                  className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5 min-w-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span
                        title={`${block.address} · ${block.section}`}
                        className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums min-w-0 leading-snug"
                      >
                        {block.address} · {block.section}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                        {block.processName} (PID {block.processPid})
                      </span>
                    </div>
                    <span
                      title={`${block.permissions} (${block.size}) · ${block.status}`}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 leading-snug ${
                        block.permissions === 'RWX' ||
                        block.status === 'injected' ||
                        block.status === 'shellcode'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {(block.permissions === 'RWX' ||
                        block.status === 'injected' ||
                        block.status === 'shellcode') && (
                        <ShieldAlert className="w-3 h-3 shrink-0" />
                      )}
                      <span>
                        {block.permissions} ({block.size}) · {block.status}
                      </span>
                    </span>
                  </div>

                  <p
                    dir="ltr"
                    title={block.description}
                    className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed break-words"
                  >
                    {block.description}
                  </p>

                  <div
                    title={block.hexPreview}
                    className="px-3 py-2 bg-zinc-950 text-emerald-300 font-mono text-[11px] break-all rounded-lg border border-zinc-800"
                  >
                    {block.hexPreview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
