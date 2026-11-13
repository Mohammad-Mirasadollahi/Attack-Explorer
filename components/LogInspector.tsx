'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AttackScenario,
  TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT } from '@/lib/simulation-engine';
import {
  buildCorrelatedStepLogs,
  tokenizeLogLineForHighlight } from '@/lib/log-inspector-utils';
import { Check, ChevronDown, Copy } from 'lucide-react';

export interface LogInspectorProps {
  scenario: AttackScenario;
  activeStageIndex: number;
  selectedTelemetryId: string | null;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
  onSelectStage?: (stageIndex: number) => void;
  activeEnvironment?: ActiveEnvironmentId;
}

export function LogInspector({
  scenario,
  activeStageIndex,
  selectedTelemetryId,
  onSelectTelemetry,
  onSelectStage,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT }: LogInspectorProps) {
  const [activeTabByStep, setActiveTabByStep] = useState<
    Record<string, 'RAW' | 'RULE'>
  >({});
  const [manualExpandedId, setManualExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const enrichedLogs = useMemo(
    () =>
      buildCorrelatedStepLogs(scenario, activeStageIndex, activeEnvironment),
    [scenario, activeStageIndex, activeEnvironment]
  );

  const handleCopyLog = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <section
      data-testid="log-inspector"
      dir="ltr"
      aria-label="Sysmon and SIEM Step Log Inspector"
      className="space-y-2.5"
    >
      {enrichedLogs.map((item, idx) => {
        const isStepFocused =
          (activeStageIndex > 0 && item.stageIndex === activeStageIndex) ||
          selectedTelemetryId === item.id;
        const isExpanded =
          manualExpandedId === item.id ||
          (manualExpandedId === null &&
            (isStepFocused || (activeStageIndex === 0 && idx === 0)));

        const currentTab = activeTabByStep[item.id] || 'RAW';
        const logLines = item.correlatedRawLog.split('\n');

        return (
          <article
            key={item.id}
            data-testid={`log-inspector-step-${item.stageIndex}`}
            className={`rounded-xl border transition-colors overflow-hidden ${
              isStepFocused
                ? 'border-indigo-500/50 bg-indigo-50/20 dark:bg-indigo-950/15'
                : 'border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/40'
            }`}
          >
            {/* Clean Single-Line Accordion Trigger */}
            <button
              type="button"
              onClick={() => {
                setManualExpandedId((prev) =>
                  prev === item.id ? '__NONE__' : item.id
                );
                onSelectStage?.(item.stageIndex);
              }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <div
                  dir="ltr"
                  className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums"
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    S{item.stageIndex}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="break-words">{item.event.protocolOrEventId}</span>
                  <span
                    data-testid={`log-inspector-env-badge-${item.stageIndex}`}
                    className="px-1.5 py-0 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-[9.5px] font-bold"
                  >
                    {item.environmentBadge} · {item.environmentTag}
                  </span>
                </div>
                <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 break-words leading-snug mt-0.5">
                  {item.stageTitle}
                </div>
              </div>

              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="text-zinc-400 shrink-0"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.span>
            </button>

            {/* Expanded Log / Detection Rule Body */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden px-3 pb-3 pt-1 space-y-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60"
                >
                  <p className="text-[11.5px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {item.event.explanation}
                  </p>

                  <div
                    dir="ltr"
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 text-[10.5px] font-mono">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveTabByStep((prev) => ({
                            ...prev,
                            [item.id]: 'RAW' }))
                        }
                        className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                          currentTab === 'RAW'
                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        Raw Log
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveTabByStep((prev) => ({
                            ...prev,
                            [item.id]: 'RULE' }))
                        }
                        className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                          currentTab === 'RULE'
                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {item.event.detectionRule.type}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyLog(
                          item.id,
                          currentTab === 'RAW'
                            ? item.correlatedRawLog
                            : item.event.detectionRule.ruleCode
                        )
                      }
                      title="Copy"
                      className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-md cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {currentTab === 'RAW' ? (
                    <div
                      dir="ltr"
                      onClick={() => onSelectTelemetry?.(item.event)}
                      className="bg-zinc-950 text-zinc-200 font-mono text-[10.5px] leading-relaxed p-2.5 rounded-lg border border-zinc-800 overflow-x-auto max-h-44 cursor-pointer"
                    >
                      {logLines.map((line, lineIdx) => {
                        const tokens = tokenizeLogLineForHighlight(line);
                        return (
                          <div
                            key={lineIdx}
                            className="flex items-baseline gap-2"
                          >
                            <span className="select-none text-[9px] text-zinc-600 w-4 shrink-0 text-right tabular-nums">
                              {lineIdx + 1}
                            </span>
                            <span className="whitespace-pre-wrap break-all">
                              {tokens.map((tok, tokIdx) => {
                                if (tok.kind === 'event_id') {
                                  return (
                                    <span
                                      key={tokIdx}
                                      className="text-amber-300 font-semibold"
                                    >
                                      {tok.text}
                                    </span>
                                  );
                                }
                                if (tok.kind === 'indicator') {
                                  return (
                                    <span
                                      key={tokIdx}
                                      className="text-rose-300 font-semibold"
                                    >
                                      {tok.text}
                                    </span>
                                  );
                                }
                                return <span key={tokIdx}>{tok.text}</span>;
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div dir="ltr" className="space-y-2">
                      <pre className="p-2.5 bg-zinc-950 text-emerald-300 font-mono text-[10.5px] leading-relaxed overflow-x-auto max-h-44 rounded-lg border border-zinc-800 whitespace-pre-wrap">
                        {item.event.detectionRule.ruleCode}
                      </pre>
                      <div
                        dir="ltr"
                        className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed"
                      >
                        {item.event.detectionRule.mitigation}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        );
      })}
    </section>
  );
}
