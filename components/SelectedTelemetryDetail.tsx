'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AttackStage,
  TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile } from '@/lib/simulation-engine';
import { ChevronLeft } from 'lucide-react';
import {
  buildCorrelatedRawLog,
  tokenizeLogLineForHighlight } from '@/lib/log-inspector-utils';
import { buildBidirectionalTraceMeta } from '@/lib/sketch-zones-and-drilldown';

interface SelectedTelemetryDetailProps {
  selectedTelemetry: TelemetryEvent;
  currentStage: AttackStage | null;
  onClearTelemetrySelection: () => void;
  activeEnvironment?: ActiveEnvironmentId;
  width?: number;
  resizeHandle?: React.ReactNode;
}

export function SelectedTelemetryDetail({
  selectedTelemetry,
  currentStage,
  onClearTelemetrySelection,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  width = 300,
  resizeHandle }: SelectedTelemetryDetailProps) {
  const [artifactTab, setArtifactTab] = useState<'RAW_LOG' | 'DETECTION_RULE'>(
    'RAW_LOG'
  );

  const envProfile = getActiveEnvironmentProfile(activeEnvironment);
  const correlatedRaw = buildCorrelatedRawLog(
    selectedTelemetry,
    activeEnvironment
  );
  const rawLines = correlatedRaw.split('\n');
  const traceMeta = buildBidirectionalTraceMeta(selectedTelemetry);

  return (
    <motion.aside
      data-testid="inspector-panel"
      data-panel-width={width}
      initial={{ width: 0, opacity: 0, x: 20 }}
      animate={{ width, opacity: 1, x: 0 }}
      exit={{ width: 0, opacity: 0, x: 20 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      style={{ width }}
      dir="ltr"
      className="fixed lg:relative inset-y-12 lg:inset-y-auto right-0 z-30 max-w-[90vw] shrink-0 bg-white dark:bg-zinc-950 border-l border-zinc-200/80 dark:border-zinc-800/80 flex flex-col h-[calc(100dvh-3rem)] lg:h-full shadow-xl lg:shadow-none overflow-hidden"
    >
      {resizeHandle}
      {/* Clean Header with Back Action */}
      <div className="h-12 flex items-center justify-between gap-2 px-4 border-b border-zinc-200/70 dark:border-zinc-800/80 shrink-0">
        <h2 className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Trace Detail
        </h2>
        <button
          type="button"
          onClick={onClearTelemetrySelection}
          className="h-7 flex items-center gap-1 px-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{currentStage ? `S${currentStage.index}` : 'Back'}</span>
        </button>
      </div>

      {/* Spacious Scrollable Detail Body */}
      <div className="flex-1 overflow-auto p-4 space-y-5">
        {/* Title & Unboxed Metadata */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
            <span>Trace #{selectedTelemetry.no}</span>
            <span aria-hidden="true">·</span>
            <span>S{selectedTelemetry.stageIndex}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedTelemetry.mitreId}</span>
            <span
              data-testid="trace-detail-env-badge"
              className="px-1.5 py-0 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[9.5px] font-bold"
            >
              {envProfile.badgeLabel} · {envProfile.environmentTag}
            </span>
          </div>

          <h3
            dir="ltr"
            className="text-sm font-mono font-semibold text-zinc-900 dark:text-white leading-snug"
          >
            {selectedTelemetry.protocolOrEventId} —{' '}
            {selectedTelemetry.shortAction}
          </h3>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
            {selectedTelemetry.explanation}
          </p>
        </div>

        <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

        {/* Bidirectional Request / Response Summary (Clean Divider List, No Nested Boxes) */}
        <div
          data-testid="bidirectional-trace-card"
          className="space-y-2.5"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            <span>Request & Response Flow</span>
            <span className="text-[11px] font-mono font-normal text-zinc-400 tabular-nums">
              {selectedTelemetry.timestamp}
            </span>
          </div>

          <div
            dir="ltr"
            className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-[11.5px] font-mono"
          >
            <div className="py-2 flex flex-col gap-0.5">
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                #{traceMeta.forwardSeq} → Request
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {traceMeta.initiatorLabel} → {traceMeta.receiverLabel}
              </span>
            </div>

            <div className="py-2 flex flex-col gap-0.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                #{traceMeta.returnSeq} ⇠ Response
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {traceMeta.receiverLabel} ⇠ {traceMeta.returnLabel}
              </span>
            </div>
          </div>

          <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {traceMeta.returnDescription}
          </p>
        </div>

        <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

        {/* Raw Log & Detection Rule Viewer */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setArtifactTab('RAW_LOG')}
              className={`py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                artifactTab === 'RAW_LOG'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-2xs'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              Raw Log
            </button>
            <button
              type="button"
              onClick={() => setArtifactTab('DETECTION_RULE')}
              className={`py-1 text-[11px] font-mono font-medium rounded-md transition-colors cursor-pointer ${
                artifactTab === 'DETECTION_RULE'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-2xs'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {selectedTelemetry.detectionRule.type}
            </button>
          </div>

          {artifactTab === 'RAW_LOG' ? (
            <div
              className="p-3 bg-zinc-950 text-zinc-200 font-mono text-[10.5px] leading-relaxed overflow-x-auto rounded-xl border border-zinc-800"
              dir="ltr"
            >
              {rawLines.map((line, idx) => {
                const tokens = tokenizeLogLineForHighlight(line);
                return (
                  <div key={idx} className="flex items-baseline gap-2">
                    <span className="select-none text-[9px] text-zinc-600 w-4 shrink-0 text-right tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre-wrap break-all">
                      {tokens.map((tok, tIdx) =>
                        tok.kind === 'event_id' ? (
                          <span
                            key={tIdx}
                            className="text-amber-300 font-semibold"
                          >
                            {tok.text}
                          </span>
                        ) : tok.kind === 'indicator' ? (
                          <span
                            key={tIdx}
                            className="text-rose-300 font-semibold"
                          >
                            {tok.text}
                          </span>
                        ) : (
                          <span key={tIdx}>{tok.text}</span>
                        )
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2.5">
              <pre
                dir="ltr"
                className="p-3 bg-zinc-950 text-emerald-300 font-mono text-[10.5px] leading-relaxed overflow-x-auto rounded-xl border border-zinc-800 whitespace-pre-wrap"
              >
                {selectedTelemetry.detectionRule.ruleCode}
              </pre>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {selectedTelemetry.detectionRule.mitigation}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
