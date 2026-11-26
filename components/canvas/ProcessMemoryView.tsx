'use client';

import React, { useMemo } from 'react';
import type { AttackScenario, TelemetryEvent } from '@/modules/scenarios/types';
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
import {
  Cpu,
  GitBranch,
  Layers,
  ShieldAlert,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { MemoryForensicsFlowchart } from './MemoryForensicsFlowchart';
import { ScenarioSection3DEmbed } from '../three/ScenarioSection3DEmbed';
import { TechnicalClipEmbed } from '../technical-clip/TechnicalClipEmbed';
import { TechnicalWhiteboardEmbed } from '../excalidraw/TechnicalWhiteboardEmbed';
import { getSection3DDescriptor } from '@/lib/section-3d-registry';
import { hasTechnicalClip } from '@/lib/section-technical-clip-registry';
import { hasTechnicalWhiteboard } from '@/lib/section-excalidraw-registry';

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

        {/* 0. FIRST: Real-World Story Analogy + Story-to-Technical Key (Exact Overview Standard) */}
        {(() => {
          const mem3d = getSection3DDescriptor(
            scenario.id,
            'memory-forensics'
          );
          if (!mem3d) return null;
          return (
            <div
              data-testid="memory-story-analogy"
              className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/60 space-y-2.5"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Real-World Story Analogy · {mem3d.title}</span>
                </div>
                <p className="text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
                  {mem3d.storyCue}
                </p>
              </div>
              {mem3d.storyMappings.length > 0 && (
                <div
                  data-testid="story-tech-mapping-key-memory-forensics"
                  className="pt-2.5 border-t border-amber-200/80 dark:border-amber-800/60 space-y-1.5"
                >
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-900/90 dark:text-amber-300/90">
                    Story-to-Technical Key (What Each Story Piece Means in Practice)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {mem3d.storyMappings.map((item, idx) => (
                      <div
                        key={`${item.storyTerm}-${idx}`}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 dark:bg-zinc-950/75 border border-amber-200/70 dark:border-zinc-800 text-[11px] leading-snug"
                      >
                        <span className="px-1.5 py-0.5 rounded border bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300/80 dark:border-amber-800/70 font-bold shrink-0">
                          {item.storyTerm}
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 font-mono font-bold shrink-0">
                          →
                        </span>
                        <span className="font-mono font-semibold text-indigo-800 dark:text-sky-300 break-words min-w-0">
                          {item.technicalTerm}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 1. FULL-WIDTH STANDARD ANIME 3D VIRTUAL MEMORY DIFF STAGE (directly below Story) */}
        {getSection3DDescriptor(scenario.id, 'memory-forensics') && (
          <section data-testid="memory-story-and-3d-section">
            <ScenarioSection3DEmbed
              scenarioId={scenario.id}
              sectionKey="memory-forensics"
            />
          </section>
        )}

        {hasTechnicalClip(scenario.id, 'memory-forensics') && (
          <TechnicalClipEmbed
            scenarioId={scenario.id}
            sectionKey="memory-forensics"
          />
        )}

        {hasTechnicalWhiteboard(scenario.id, 'memory-forensics') && (
          <TechnicalWhiteboardEmbed
            scenarioId={scenario.id}
            sectionKey="memory-forensics"
          />
        )}

        {/* 2. BELOW FILM: Technical Documented Virtual Memory Forensics Briefing */}
        <section
          data-testid="memory-scope-briefing"
          className="p-4 rounded-xl bg-zinc-50/90 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span>
                  1. DOCUMENTED VIRTUAL MEMORY FORENSICS (VAD / PE-SIEVE GROUNDED)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                {scopedMemory.scopeExplanation}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300">
                {scopedMemory.memoryBlocks.length} Documented Memory Regions
              </span>
            </div>
          </div>

          {scopedMemory.structuredScopeClauses.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
              {scopedMemory.structuredScopeClauses.map((clause, cIdx) => (
                <div
                  key={`${clause.clauseCode}-${cIdx}`}
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-900/85 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5"
                >
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9.5px] font-extrabold shrink-0 mt-0.5">
                      #{clause.clauseCode}
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed break-words flex-1">
                      {clause.coreStatement}
                    </p>
                  </div>
                  {clause.parentheticalReasons.length > 0 && (
                    <div className="pl-6 space-y-1">
                      {clause.parentheticalReasons.map((reason, rIdx) => (
                        <div
                          key={rIdx}
                          data-testid={`memory-briefing-why-${rIdx}`}
                          className="px-2.5 py-1 rounded-md bg-amber-50/90 dark:bg-amber-950/35 border border-amber-200/80 dark:border-amber-800/60 text-[11px] font-mono text-amber-950 dark:text-amber-200 leading-snug break-words"
                        >
                          <strong className="text-amber-700 dark:text-amber-400">
                            WHY / MEMORY FORENSICS:
                          </strong>{' '}
                          ({reason})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Visual Memory Analysis Flowchart (Dump -> String Analysis -> Forensic Extraction) */}
        <MemoryForensicsFlowchart flowchart={scopedMemory.flowchart} />

        {/* 2. Step-by-Step Memory Analysis & VAD Mutation Waterfall */}
        <section
          data-testid="memory-step-by-step-waterfall"
          className="p-4 sm:p-5 rounded-2xl bg-zinc-50/60 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 space-y-3.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  2. Step-by-Step Memory Analysis & VAD Mutation Waterfall (
                  {scopedMemory.memoryStepTimeline.length} Memory Steps)
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Chronological RAM transition steps annotated with parenthetical (why ...) forensic explanations
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[10.5px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
              #M.1 └─▶ #M.{scopedMemory.memoryStepTimeline.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {scopedMemory.memoryStepTimeline.map((step, sIdx) => {
              const indentPx = Math.min(sIdx * 14, 42);
              return (
                <div
                  key={step.stepCode}
                  data-testid={`memory-waterfall-step-${step.stepNumber}`}
                  style={{ marginLeft: `${indentPx}px` }}
                  className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 shadow-2xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {sIdx > 0 && (
                        <span className="text-indigo-500 font-extrabold">
                          └─▶
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-extrabold">
                        STEP #{step.stepCode} · STAGE S{step.stageIndex}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10.5px] font-bold">
                        {step.processName} (PID {step.processPid} · PPID{' '}
                        {step.processPpid})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 text-[10.5px] font-bold">
                        {step.operationOrApi}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/70 text-purple-700 dark:text-purple-300 text-[10.5px] font-bold">
                      {step.targetAddress} · {step.targetSection} [
                      {step.permissions} · {step.regionSize} · {step.regionStatus}
                      ]
                    </span>
                  </div>

                  <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
                    {step.stepActionSummary}
                  </p>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 pt-0.5">
                    <div
                      data-testid={`memory-step-why-${step.stepNumber}`}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50/85 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-[11px] font-mono text-amber-950 dark:text-amber-200 leading-snug break-words"
                    >
                      <strong className="text-amber-700 dark:text-amber-400">
                        WHY THIS MEMORY STEP:
                      </strong>{' '}
                      {step.whyExplanation}
                    </div>

                    <div className="px-2.5 py-1.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 text-[11px] font-mono text-indigo-950 dark:text-indigo-200 leading-snug break-words">
                      <strong className="text-indigo-700 dark:text-indigo-400">
                        API / SYSCALL WHY:
                      </strong>{' '}
                      {step.operationWhyNote}
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/70 dark:border-emerald-800/50 text-[10.5px] font-mono text-emerald-900 dark:text-emerald-200 leading-snug break-words">
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      FORENSIC CATCH:
                    </strong>{' '}
                    {step.detectionEvidence}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 3. Left Column: Process Execution Tree & API Calls with Parenthetical (why ...) Annotations */}
          <div className="lg:col-span-5 xl:col-span-4 min-w-0 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pb-3 border-b border-zinc-200/70 dark:border-zinc-800">
              <div className="flex items-center gap-2 min-w-0">
                <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <h3
                  title="3. Process Execution Tree & API Calls"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 min-w-0 leading-snug"
                >
                  3. Process Execution Tree & API Calls
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
                  className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5 min-w-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9.5px] font-extrabold shrink-0">
                        #{proc.processStepCode}
                      </span>
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

                  {proc.statusWhyNote && (
                    <div
                      data-testid={`process-status-why-${proc.pid}`}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 text-[11px] font-mono text-amber-950 dark:text-amber-200 leading-relaxed break-words"
                    >
                      <strong className="text-amber-700 dark:text-amber-400">
                        PROCESS ROLE WHY:
                      </strong>{' '}
                      {proc.statusWhyNote}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div
                      title={proc.commandLine}
                      className="text-[11px] font-mono text-emerald-300 bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 break-all"
                    >
                      $ {proc.commandLine}
                    </div>
                    {proc.commandLineWhyNote && (
                      <div
                        data-testid={`process-cmdline-why-${proc.pid}`}
                        className="px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-[10.5px] font-mono text-zinc-600 dark:text-zinc-300 leading-relaxed break-words"
                      >
                        <strong className="text-indigo-600 dark:text-indigo-400">
                          CMDLINE WHY:
                        </strong>{' '}
                        {proc.commandLineWhyNote}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      API Calls & Parenthetical (why ...) Memory Annotations:
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono">
                      {proc.structuredApiSteps.map((apiStep) => (
                        <div
                          key={apiStep.stepCode}
                          title={apiStep.fullText}
                          className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-200/70 dark:border-indigo-800/60 space-y-1 leading-relaxed break-words"
                        >
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-extrabold">
                              #{apiStep.stepCode}
                            </span>
                            <span className="font-bold text-indigo-900 dark:text-indigo-200">
                              {apiStep.apiSignature}
                            </span>
                          </div>
                          <div className="text-[10.5px] text-zinc-700 dark:text-zinc-300 pl-1">
                            {apiStep.whyNote}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Right Column: Documented Virtual Memory Map & Hex Inspector with Structured (why ...) Clauses */}
          <div className="lg:col-span-7 xl:col-span-8 min-w-0 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pb-3 border-b border-zinc-200/70 dark:border-zinc-800">
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <h3
                  title="4. Virtual Memory Layout (VAD) & Hex Forensics"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 min-w-0 leading-snug"
                >
                  4. Virtual Memory Layout (VAD) & Hex Forensics
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400 shrink-0">
                VAD / PE-sieve · Step-by-Step Annotated
              </span>
            </div>

            <div className="space-y-3.5" dir="ltr">
              {scopedMemory.memoryBlocks.map((block, i) => (
                <div
                  key={`${block.address}-${i}`}
                  data-testid={`memory-block-card-${i}`}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-3 min-w-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-extrabold shrink-0">
                        STEP #{block.stepCode} · STAGE S{block.stageIndex}
                      </span>
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

                  {/* Correlated API / Syscall Triggering This Memory Region */}
                  {block.correlatedApiCall && (
                    <div className="px-2.5 py-1.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/25 border border-rose-200/70 dark:border-rose-800/60 text-[11px] font-mono text-rose-900 dark:text-rose-200 leading-snug break-words">
                      <strong className="text-rose-700 dark:text-rose-400">
                        TRIGGERING API / SYSCALL:
                      </strong>{' '}
                      {block.correlatedApiCall}
                    </div>
                  )}

                  {/* Parenthetical Why Notes for Address/Section and Permissions/Status */}
                  {(block.addressWhyNote || block.permissionsWhyNote) && (
                    <div
                      data-testid={`memory-block-why-notes-${i}`}
                      className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-800/60 space-y-1.5 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed break-words"
                    >
                      {block.addressWhyNote && (
                        <div>
                          <strong className="text-indigo-700 dark:text-indigo-400">
                            ADDRESS & SECTION WHY:
                          </strong>{' '}
                          {block.addressWhyNote}
                        </div>
                      )}
                      {block.permissionsWhyNote && (
                        <div>
                          <strong className="text-rose-700 dark:text-rose-400">
                            PERMISSIONS & VAD WHY:
                          </strong>{' '}
                          {block.permissionsWhyNote}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Structured Memory Clauses with Highlighted Parenthetical (why ...) Callouts */}
                  <div className="space-y-2">
                    {block.structuredClauses.map((clause, cIdx) => (
                      <div
                        key={`${clause.clauseCode}-${cIdx}`}
                        className="p-2.5 rounded-lg bg-zinc-50/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5"
                      >
                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9.5px] font-extrabold shrink-0 mt-0.5">
                            #{clause.clauseCode}
                          </span>
                          <p
                            dir="ltr"
                            title={block.description}
                            className="text-xs text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed break-words flex-1"
                          >
                            {clause.coreStatement}
                          </p>
                        </div>
                        {clause.parentheticalReasons.length > 0 && (
                          <div className="pl-6 space-y-1">
                            {clause.parentheticalReasons.map((reason, rIdx) => (
                              <div
                                key={rIdx}
                                className="px-2.5 py-1 rounded-md bg-amber-50/85 dark:bg-amber-950/35 border border-amber-200/80 dark:border-amber-800/60 text-[11px] font-mono text-amber-950 dark:text-amber-200 leading-snug break-words"
                              >
                                <strong className="text-amber-700 dark:text-amber-400">
                                  WHY / RAM MUTATION:
                                </strong>{' '}
                                ({reason})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Hex Preview & Byte-Level Parenthetical (why ...) Annotation */}
                  <div className="space-y-1.5">
                    <div
                      title={block.hexPreview}
                      className="px-3 py-2 bg-zinc-950 text-emerald-300 font-mono text-[11px] break-all rounded-lg border border-zinc-800"
                    >
                      {block.hexPreview}
                    </div>
                    {block.hexWhyNote && (
                      <div
                        data-testid={`memory-block-hex-why-${i}`}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/70 dark:border-emerald-800/60 text-[11px] font-mono text-emerald-950 dark:text-emerald-200 leading-relaxed break-words"
                      >
                        <strong className="text-emerald-700 dark:text-emerald-400">
                          HEX SIGNATURE WHY:
                        </strong>{' '}
                        {block.hexWhyNote}
                      </div>
                    )}
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
