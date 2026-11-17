'use client';

import React, { useState } from 'react';
import {
  MemoryFlowchartPhaseId,
  MemoryFlowchartPhaseNode,
  MemoryForensicsFlowchartModel,
} from '@/lib/inspector-scope';
import {
  ArrowDown,
  ArrowRight,
  Binary,
  Database,
  Filter,
  HardDriveDownload,
  Microscope,
  ScanSearch,
  ShieldCheck,
  Workflow,
} from 'lucide-react';

interface MemoryForensicsFlowchartProps {
  flowchart: MemoryForensicsFlowchartModel;
  compact?: boolean;
}

function renderPhaseIcon(
  phaseId: MemoryFlowchartPhaseId,
  className = 'w-4 h-4 shrink-0'
) {
  switch (phaseId) {
    case 'MEMORY_DUMP':
      return <HardDriveDownload className={className} />;
    case 'STRING_ANALYSIS':
      return <ScanSearch className={className} />;
    case 'FORENSIC_EXTRACTION':
      return <Microscope className={className} />;
  }
}

function renderSecondaryPhaseIcon(
  phaseId: MemoryFlowchartPhaseId,
  className = 'w-3.5 h-3.5 shrink-0'
) {
  switch (phaseId) {
    case 'MEMORY_DUMP':
      return <Database className={className} />;
    case 'STRING_ANALYSIS':
      return <Binary className={className} />;
    case 'FORENSIC_EXTRACTION':
      return <ShieldCheck className={className} />;
  }
}

function getPhaseVisualTheme(phaseId: MemoryFlowchartPhaseId) {
  switch (phaseId) {
    case 'MEMORY_DUMP':
      return {
        cardBg:
          'bg-rose-50/70 dark:bg-rose-950/25 border-rose-200/90 dark:border-rose-800/70',
        activeRing: 'ring-2 ring-rose-500/80 dark:ring-rose-400/80',
        iconBox:
          'bg-rose-600 text-white shadow-xs border border-rose-500/80',
        badge:
          'bg-rose-100/90 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border-rose-300/80 dark:border-rose-700/70',
        headerText: 'text-rose-800 dark:text-rose-200',
        codePill: 'bg-rose-600 text-white',
        connector: 'text-rose-500 dark:text-rose-400',
      };
    case 'STRING_ANALYSIS':
      return {
        cardBg:
          'bg-indigo-50/70 dark:bg-indigo-950/25 border-indigo-200/90 dark:border-indigo-800/70',
        activeRing: 'ring-2 ring-indigo-500/80 dark:ring-indigo-400/80',
        iconBox:
          'bg-indigo-600 text-white shadow-xs border border-indigo-500/80',
        badge:
          'bg-indigo-100/90 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border-indigo-300/80 dark:border-indigo-700/70',
        headerText: 'text-indigo-800 dark:text-indigo-200',
        codePill: 'bg-indigo-600 text-white',
        connector: 'text-indigo-500 dark:text-indigo-400',
      };
    case 'FORENSIC_EXTRACTION':
      return {
        cardBg:
          'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-200/90 dark:border-emerald-800/70',
        activeRing: 'ring-2 ring-emerald-500/80 dark:ring-emerald-400/80',
        iconBox:
          'bg-emerald-600 text-white shadow-xs border border-emerald-500/80',
        badge:
          'bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300/80 dark:border-emerald-700/70',
        headerText: 'text-emerald-800 dark:text-emerald-200',
        codePill: 'bg-emerald-600 text-white',
        connector: 'text-emerald-500 dark:text-emerald-400',
      };
  }
}

export function MemoryForensicsFlowchart({
  flowchart,
  compact = false,
}: MemoryForensicsFlowchartProps) {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<
    'ALL' | MemoryFlowchartPhaseId
  >('ALL');
  const [selectedStepNumber, setSelectedStepNumber] = useState<number | 'ALL'>(
    'ALL'
  );

  if (!flowchart || flowchart.stepRows.length === 0) {
    return null;
  }

  const visibleStepRows =
    selectedStepNumber === 'ALL'
      ? flowchart.stepRows
      : flowchart.stepRows.filter(
          (row) => row.stepNumber === selectedStepNumber
        );

  return (
    <section
      data-testid={
        compact
          ? 'inspector-memory-forensics-flowchart'
          : 'memory-forensics-flowchart'
      }
      className={`rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs ${
        compact ? 'p-3.5 space-y-3' : 'p-4 sm:p-5 space-y-4'
      }`}
    >
      {/* Header & Interactive Cognitive-Load Filter Bar */}
      <div className="space-y-3 pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-rose-600 text-white shadow-2xs shrink-0">
              <Workflow className="w-4 h-4" />
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 leading-snug break-words">
              Visual Memory Analysis Flowchart (Dump ──▶ String Analysis ──▶ Forensic Extraction)
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[11px] font-mono font-bold text-rose-700 dark:text-rose-300 shrink-0">
            {flowchart.totalSteps} Memory Step{flowchart.totalSteps === 1 ? '' : 's'} · 3 Phases Each
          </span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed break-words">
          Icon-guided visual schematic mirroring documented memory steps{' '}
          <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
            #M.1 ──▶ #M.{flowchart.totalSteps}
          </span>{' '}
          (why visual flowchart: decomposes dense RAM hex dumps, VAD page permissions, and API syscalls into three predictable visual phases so analysts can trace memory tampering at a glance).
        </p>

        {/* Phase Filter Controls */}
        <div
          data-testid="memory-flowchart-phase-filters"
          className="flex flex-wrap items-center gap-1.5 pt-0.5"
        >
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400 mr-1">
            <Filter className="w-3 h-3" />
            Phase Focus:
          </span>
          <button
            type="button"
            onClick={() => setSelectedPhaseFilter('ALL')}
            data-testid="memory-flowchart-filter-ALL"
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-colors cursor-pointer border ${
              selectedPhaseFilter === 'ALL'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200/70 dark:hover:bg-zinc-800'
            }`}
          >
            All 3 Phases
          </button>
          <button
            type="button"
            onClick={() => setSelectedPhaseFilter('MEMORY_DUMP')}
            data-testid="memory-flowchart-filter-MEMORY_DUMP"
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-colors cursor-pointer border ${
              selectedPhaseFilter === 'MEMORY_DUMP'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/70 hover:bg-rose-100/80'
            }`}
          >
            <HardDriveDownload className="w-3 h-3 shrink-0" />
            <span>1. Memory Dump</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPhaseFilter('STRING_ANALYSIS')}
            data-testid="memory-flowchart-filter-STRING_ANALYSIS"
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-colors cursor-pointer border ${
              selectedPhaseFilter === 'STRING_ANALYSIS'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/70 hover:bg-indigo-100/80'
            }`}
          >
            <ScanSearch className="w-3 h-3 shrink-0" />
            <span>2. String Analysis</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPhaseFilter('FORENSIC_EXTRACTION')}
            data-testid="memory-flowchart-filter-FORENSIC_EXTRACTION"
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-colors cursor-pointer border ${
              selectedPhaseFilter === 'FORENSIC_EXTRACTION'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/70 hover:bg-emerald-100/80'
            }`}
          >
            <Microscope className="w-3 h-3 shrink-0" />
            <span>3. Forensic Extraction</span>
          </button>
        </div>
      </div>

      {/* Top 3-Phase Macro Pipeline Schematic */}
      <div
        data-testid="memory-flowchart-macro-pipeline"
        className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch"
      >
        {flowchart.summaryPhases.map((macro, pIdx) => {
          const theme = getPhaseVisualTheme(macro.phaseId);
          const isSelected = selectedPhaseFilter === macro.phaseId;
          const isDimmed =
            selectedPhaseFilter !== 'ALL' &&
            selectedPhaseFilter !== macro.phaseId;

          return (
            <div
              key={macro.phaseId}
              data-testid={`memory-macro-phase-${macro.phaseId}`}
              onClick={() =>
                setSelectedPhaseFilter(
                  selectedPhaseFilter === macro.phaseId ? 'ALL' : macro.phaseId
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedPhaseFilter(
                    selectedPhaseFilter === macro.phaseId
                      ? 'ALL'
                      : macro.phaseId
                  );
                }
              }}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                theme.cardBg
              } ${isSelected ? theme.activeRing : ''} ${
                isDimmed ? 'opacity-55 hover:opacity-90' : 'opacity-100'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${theme.iconBox}`}
                  >
                    {renderPhaseIcon(macro.iconKind, 'w-4 h-4')}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${theme.badge}`}
                  >
                    {macro.artifactCountLabel}
                  </span>
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div
                    className={`text-xs font-extrabold font-mono leading-snug break-words ${theme.headerText}`}
                  >
                    {macro.title}
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug break-words">
                    {macro.subtitle}
                  </div>
                </div>

                <div className="px-2.5 py-1.5 rounded-lg bg-white/85 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800/80 text-[10.5px] font-mono text-zinc-700 dark:text-zinc-300 leading-snug break-words">
                  {macro.whyPhaseMatters}
                </div>
              </div>

              {/* Visual Flow Arrow Connector to Next Macro Phase */}
              {pIdx < flowchart.summaryPhases.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:flex items-center justify-center absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow-2xs text-zinc-600 dark:text-zinc-300"
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Selector Bar when multiple memory steps exist */}
      {flowchart.stepRows.length > 1 && (
        <div
          data-testid="memory-flowchart-step-selector"
          className="flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mr-1">
            Mirror Documentation Step:
          </span>
          <button
            type="button"
            onClick={() => setSelectedStepNumber('ALL')}
            data-testid="memory-flowchart-step-btn-ALL"
            className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-bold transition-colors cursor-pointer border ${
              selectedStepNumber === 'ALL'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100'
            }`}
          >
            All Steps (#M.1–#M.{flowchart.totalSteps})
          </button>
          {flowchart.stepRows.map((row) => (
            <button
              key={row.stepCode}
              type="button"
              onClick={() =>
                setSelectedStepNumber(
                  selectedStepNumber === row.stepNumber ? 'ALL' : row.stepNumber
                )
              }
              data-testid={`memory-flowchart-step-btn-${row.stepNumber}`}
              className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-bold transition-colors cursor-pointer border ${
                selectedStepNumber === row.stepNumber
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100'
              }`}
            >
              #{row.stepCode} · {row.processName} ({row.targetAddress})
            </button>
          ))}
        </div>
      )}

      {/* Step-by-Step Visual Flowchart Rows */}
      <div
        data-testid="memory-flowchart-steps-grid"
        className="space-y-3.5"
      >
        {visibleStepRows.map((row, rIdx) => {
          const displayedPhases: MemoryFlowchartPhaseNode[] =
            selectedPhaseFilter === 'ALL'
              ? row.phases
              : row.phases.filter((p) => p.phaseId === selectedPhaseFilter);

          return (
            <div
              key={row.stepCode}
              data-testid={`memory-flowchart-step-row-${row.stepNumber}`}
              className="p-3.5 sm:p-4 rounded-xl bg-zinc-50/75 dark:bg-zinc-900/55 border border-zinc-200/90 dark:border-zinc-800 space-y-3"
            >
              {/* Row Step Header mirroring Documentation Step #M.X */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10.5px] font-extrabold shrink-0">
                    DOC STEP #{row.stepCode} · STAGE S{row.stageIndex}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[10.5px] font-bold text-zinc-800 dark:text-zinc-200">
                    {row.processName} (PID {row.processPid})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/70 font-mono text-[10.5px] font-bold text-purple-700 dark:text-purple-300">
                    {row.targetAddress} · {row.targetSection} [{row.permissions} ·{' '}
                    {row.regionSize} · {row.regionStatus.toUpperCase()}]
                  </span>
                </div>
                <span className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400">
                  #{row.stepCode}.1 Dump ──▶ #{row.stepCode}.2 Strings ──▶ #
                  {row.stepCode}.3 Extraction
                </span>
              </div>

              {/* 3-Node Visual Flowchart Pipeline for this Memory Step */}
              <div
                className={`grid grid-cols-1 ${
                  displayedPhases.length === 3
                    ? 'xl:grid-cols-3'
                    : 'xl:grid-cols-1'
                } gap-3 items-stretch`}
              >
                {displayedPhases.map((phaseNode, pIdx) => {
                  const theme = getPhaseVisualTheme(phaseNode.phaseId);
                  return (
                    <div
                      key={phaseNode.phaseCode}
                      data-testid={`memory-flowchart-node-${phaseNode.phaseCode}`}
                      className={`relative flex flex-col justify-between p-3 rounded-xl border ${theme.cardBg} space-y-2.5`}
                    >
                      <div className="space-y-2">
                        {/* Node Top Bar with Icon & Step-Phase Code */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${theme.iconBox}`}
                            >
                              {renderPhaseIcon(phaseNode.iconKind, 'w-3.5 h-3.5')}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-extrabold ${theme.codePill}`}
                                >
                                  #{phaseNode.phaseCode}
                                </span>
                                <span
                                  className={`text-[11px] font-extrabold font-mono leading-snug break-words ${theme.headerText}`}
                                >
                                  {phaseNode.phaseTitle}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${theme.badge}`}
                          >
                            {renderSecondaryPhaseIcon(
                              phaseNode.iconKind,
                              'w-3 h-3 shrink-0'
                            )}
                            <span>{phaseNode.badgeLabel}</span>
                          </span>
                        </div>

                        {/* Primary Forensic Artifact Box */}
                        <div className="p-2 rounded-lg bg-white/90 dark:bg-zinc-950/90 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                          <div className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                            {phaseNode.primaryArtifact}
                          </div>
                          <div className="text-[10.5px] font-mono text-zinc-600 dark:text-zinc-400 leading-snug break-words">
                            {phaseNode.secondarySpec}
                          </div>
                        </div>
                      </div>

                      {/* Parenthetical (why ...) Annotation */}
                      <div
                        data-testid={`memory-flowchart-why-${phaseNode.phaseCode}`}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50/90 dark:bg-amber-950/35 border border-amber-200/80 dark:border-amber-800/60 text-[10.5px] font-mono text-amber-950 dark:text-amber-200 leading-snug break-words"
                      >
                        <strong className="text-amber-700 dark:text-amber-400">
                          WHY #{phaseNode.phaseCode}:
                        </strong>{' '}
                        {phaseNode.whyAnnotation}
                      </div>

                      {/* Horizontal connector arrow on desktop */}
                      {pIdx < displayedPhases.length - 1 && (
                        <div
                          aria-hidden="true"
                          className="hidden xl:flex items-center justify-center absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow-2xs text-zinc-700 dark:text-zinc-300"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Downward transition arrow to next memory step */}
              {rIdx < visibleStepRows.length - 1 && (
                <div className="flex items-center justify-center pt-1 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 gap-1.5">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>
                    NEXT MEMORY MUTATION STEP #{visibleStepRows[rIdx + 1].stepCode}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
