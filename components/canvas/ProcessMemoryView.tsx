'use client';

import React from 'react';
import { AttackScenario} from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile } from '@/lib/simulation-engine';
import { Layers, Terminal } from 'lucide-react';

interface ProcessMemoryViewProps {
  scenario: AttackScenario;
  activeEnvironment?: ActiveEnvironmentId;
}

export function ProcessMemoryView({
  scenario,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT }: ProcessMemoryViewProps) {
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  return (
    <div
      className="relative flex-1 w-full h-full overflow-auto p-6 bg-white dark:bg-[#09090B]"
      dir="ltr"
      data-testid="process-memory-view"
      data-active-environment={activeEnvironment}
    >
      <div className="max-w-6xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-xs">
        <div className="flex items-center gap-2 font-mono">
          <span
            data-testid="memory-env-badge"
            className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10.5px]"
          >
            {envProfile.badgeLabel}
          </span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {envProfile.primaryHostname} · {envProfile.osSummary}
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
          {envProfile.environmentTag} · {envProfile.subnetBadge}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        {/* Left Column: Process Execution Tree */}
        <div className="lg:col-span-6 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200/70 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Process Execution Tree & API Calls
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400 tabular-nums">
              {scenario.processTree.length} processes
            </span>
          </div>

          <div className="space-y-3" dir="ltr">
            {scenario.processTree.map((proc, index) => (
              <div
                key={proc.pid}
                style={{ marginLeft: `${index * 14}px` }}
                className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {proc.name}
                    </span>
                    <span className="text-zinc-400 tabular-nums">
                      PID {proc.pid} · PPID {proc.ppid}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      proc.status === 'normal'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {proc.status} · {proc.integrity}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg overflow-x-auto">
                  {proc.commandLine}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                  {proc.apiCalls.map((api, idx) => (
                    <React.Fragment key={idx}>
                      <span>{api}</span>
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

        {/* Right Column: Virtual Memory Map & Hex Inspector */}
        <div className="lg:col-span-6 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200/70 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Virtual Memory Layout & Hex Forensics
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              VAD / PE-sieve
            </span>
          </div>

          {scenario.processTree.some((p) => p.memoryBlocks?.length) ? (
            <div className="space-y-3" dir="ltr">
              {scenario.processTree
                .flatMap((p) => p.memoryBlocks || [])
                .map((block, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {block.address} · {block.section}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          block.permissions === 'RWX'
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : 'text-zinc-500'
                        }`}
                      >
                        {block.permissions} ({block.size}) · {block.status}
                      </span>
                    </div>

                    <p
                      dir="ltr"
                      className="text-xs text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed"
                    >
                      {block.description}
                    </p>

                    <div className="px-3 py-2 bg-zinc-950 text-emerald-300 font-mono text-[11px] overflow-x-auto rounded-lg border border-zinc-800">
                      {block.hexPreview}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              This scenario focuses on network and OS telemetry and child process spawning.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
