'use client';

import React, { useMemo } from 'react';
import { AttackScenario, TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  ComputedStageView,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import {
  buildScopedSequenceModel,
  InspectorScopeContext,
  resolveInspectorScopeContext,
} from '@/lib/inspector-scope';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Cpu,
  GitCommitHorizontal,
  Layers,
  ShieldAlert,
  Terminal,
} from 'lucide-react';

interface SequenceViewProps {
  scenario: AttackScenario;
  stageView?: ComputedStageView;
  scopeContext?: InspectorScopeContext;
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  onSelectStage?: (stageIndex: number) => void;
  activeEnvironment?: ActiveEnvironmentId;
}

export function SequenceView({
  scenario,
  stageView,
  scopeContext,
  selectedTelemetryId,
  onSelectTelemetry,
  onSelectStage,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
}: SequenceViewProps) {
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  const effectiveScopeContext = useMemo(() => {
    if (scopeContext) return scopeContext;
    const activeStageIndex = stageView?.currentStage?.index ?? 0;
    return resolveInspectorScopeContext({
      scenario,
      activeStageIndex,
      activeEnvironment,
      selectedNodeId: null,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
  }, [scopeContext, scenario, stageView, activeEnvironment]);

  const selectedTelemetryObj = useMemo(() => {
    if (!selectedTelemetryId) return null;
    return (
      scenario.telemetry.find((t) => t.id === selectedTelemetryId) || null
    );
  }, [scenario.telemetry, selectedTelemetryId]);

  const sequenceModel = useMemo(
    () =>
      buildScopedSequenceModel(effectiveScopeContext, selectedTelemetryObj),
    [effectiveScopeContext, selectedTelemetryObj]
  );

  // Never fabricate or invent sequence data where none exists in documentation
  if (
    !sequenceModel.hasDocumentedSequence ||
    sequenceModel.exchanges.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="relative w-full p-4 sm:p-6 bg-white dark:bg-[#09090B]"
      dir="ltr"
      data-testid="sequence-view"
      data-active-environment={activeEnvironment}
    >
      <div className="w-full space-y-6">
        {/* Active Environment & Scope Architecture Banner */}
        <div
          data-testid="sequence-env-banner"
          className="flex flex-wrap items-center justify-between gap-3 min-w-0 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-xs"
        >
          <div className="flex flex-wrap items-center gap-2 font-mono min-w-0">
            <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10.5px] shrink-0">
              {envProfile.badgeLabel}
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-[10.5px] shrink-0">
              {effectiveScopeContext.scopeBadgeLabel}
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 min-w-0 leading-snug break-words">
              {sequenceModel.scopeTitle}
            </span>
          </div>
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0 leading-snug">
            {envProfile.environmentTag} · {envProfile.primaryHostname} (
            {envProfile.subnetBadge})
          </span>
        </div>

        {/* Principled Sequence Briefing & How-to-Read Guide */}
        <section
          data-testid="sequence-briefing-card"
          className="p-4 sm:p-5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50 space-y-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                <GitCommitHorizontal className="w-3.5 h-3.5 shrink-0" />
                <span>
                  STORY-TO-SPEC SEQUENCE GUIDE · CHRONOLOGICAL REQUEST /
                  RESPONSE TRACE
                </span>
              </div>
              <p className="text-[12.5px] text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                {sequenceModel.scopeBriefing} Each exchange below explains{' '}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  who initiates the action (Sender)
                </strong>
                ,{' '}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  who receives and responds (Receiver)
                </strong>
                , the{' '}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  real-world story analogy
                </strong>
                , and the{' '}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  documented technical & SIEM evidence
                </strong>
                .
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300">
                {sequenceModel.exchanges.length} Documented Exchanges
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                {sequenceModel.participants.length} Participating Nodes
              </span>
            </div>
          </div>

          {/* Legend: How to read #N.1 Forward vs #N.2 Return */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-rose-200/80 dark:border-rose-900/50 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400">
                <span>#N.1</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                <span>FORWARD ACTION (REQUEST)</span>
              </div>
              <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-snug">
                The command, API call, exploit payload, or network packet sent
                from the Initiator node to the Target node.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-emerald-200/80 dark:border-emerald-900/50 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span>#N.2</span>
                <span>RETURN CHANNEL (RESPONSE)</span>
              </div>
              <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-snug">
                The kernel handle, memory pointer, session ticket, or ACK status
                returned by the Target back to the Initiator.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-amber-200/80 dark:border-amber-900/50 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>NEXT HANDOFF & EVIDENCE</span>
              </div>
              <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-snug">
                Shows how the returned output unlocks the next stage and which
                SIEM / EDR sensor logs the exchange.
              </p>
            </div>
          </div>

          {/* Sequence Quick-Jump Bar */}
          {onSelectStage &&
            effectiveScopeContext.effectiveScope === 'MAIN_SCENARIO' && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-indigo-200/60 dark:border-indigo-900/40">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mr-1">
                  Highlight Stage:
                </span>
                <button
                  type="button"
                  onClick={() => onSelectStage(0)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                    effectiveScopeContext.activeStageIndex === 0
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400'
                  }`}
                >
                  All ({sequenceModel.exchanges.length})
                </button>
                {sequenceModel.exchanges.map((ex) => {
                  const isFocusedStage =
                    effectiveScopeContext.activeStageIndex === ex.stageIndex;
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => onSelectStage(ex.stageIndex)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                        isFocusedStage
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400'
                      }`}
                    >
                      #{ex.sequenceCode} · {ex.actionTitle}
                    </button>
                  );
                })}
              </div>
            )}
        </section>

        {/* Participating Nodes Roster (Lifeline Header) */}
        {sequenceModel.participants.length > 0 && (
          <section
            data-testid="sequence-participants-bar"
            className="space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Participating Nodes in This Sequence Scope (
                {sequenceModel.participants.length})
              </span>
              <span className="text-[10.5px] font-mono text-zinc-400">
                Ordered by Kill-Chain Sequence
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {sequenceModel.participants.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-zinc-50/90 dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {p.badge}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 break-words">
                      {p.zoneLabel}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                    {p.label}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                    {p.sublabel}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chronological Story-to-Spec Sequence Exchange Cards */}
        <section className="space-y-5">
          {sequenceModel.exchanges.map((ex) => {
            const isSelected =
              ex.isSelectedPacket ||
              selectedTelemetryId === ex.telemetryEvent.id;
            const isHighlightedStage =
              effectiveScopeContext.activeStageIndex > 0 &&
              effectiveScopeContext.activeStageIndex === ex.stageIndex;

            return (
              <article
                key={ex.id}
                data-testid={`sequence-trace-row-${ex.stepNumber}`}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isSelected || isHighlightedStage
                    ? 'bg-white dark:bg-zinc-900 border-indigo-500 ring-2 ring-indigo-500/15 shadow-sm'
                    : ex.isActiveExchange
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200/95 dark:border-zinc-800'
                    : 'bg-zinc-50/60 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 opacity-80'
                }`}
              >
                {/* Exchange Header Bar */}
                <div className="px-4 py-3 bg-zinc-50/90 dark:bg-zinc-900/90 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-600 text-white shrink-0">
                      SEQ #{ex.sequenceCode}
                    </span>
                    <h3 className="text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                      {ex.plainTitle}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      {ex.mitreId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {ex.protocolOrEventId}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
                      {ex.timestamp}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTelemetry(ex.telemetryEvent)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                      }`}
                    >
                      {isSelected ? 'Selected Packet' : 'Inspect Packet'}
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  {/* Visual Initiator (Sender) ⇄ Receiver (Target) Swimlane Box */}
                  <div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800/90">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                      {/* Left Column: Initiator (Sender) — Compact */}
                      <div className="lg:col-span-3 xl:col-span-2 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-1.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                              INITIATOR (SENDER)
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                              {ex.initiatorBadge}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                            {ex.initiatorLabel}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                            {ex.initiatorSublabel}
                          </div>
                        </div>
                        <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] font-mono text-zinc-400 break-words">
                          {ex.initiatorZoneLabel}
                        </div>
                      </div>

                      {/* Center Column: Bidirectional Forward (#N.1) & Return (#N.2) Exchange Explanations — Wide */}
                      <div className="lg:col-span-6 xl:col-span-8 flex flex-col justify-center space-y-2.5 px-1">
                        {/* Forward Request Track (#N.1 ──▶) */}
                        <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/25 border border-rose-200/80 dark:border-rose-900/50 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                            <span className="inline-flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                              <span>#{ex.forwardSeq}</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                              <span className="break-words">
                                {ex.actionTitle}
                              </span>
                            </span>
                            <span className="text-[10.5px] font-mono font-semibold text-rose-700/80 dark:text-rose-300/80">
                              {ex.initiatorLabel} ──▶ {ex.receiverLabel}
                            </span>
                          </div>
                          <div className="h-0.5 w-full bg-rose-500/70 rounded-full" />
                          <p className="text-[11.5px] font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                            {ex.forwardPayloadSummary}
                          </p>
                        </div>

                        {/* Return Response Track (◀── #N.2) */}
                        <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-900/50 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                              <span>#{ex.returnSeq}</span>
                              <span className="break-words">
                                {ex.returnLabel}
                              </span>
                            </span>
                            <span className="text-[10.5px] font-mono font-semibold text-emerald-700/80 dark:text-emerald-300/80">
                              {ex.initiatorLabel} ◀── {ex.receiverLabel}
                            </span>
                          </div>
                          <div className="h-0.5 w-full border-b border-dashed border-emerald-500/80" />
                          <p className="text-[11.5px] text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                            {ex.returnDescription}
                          </p>
                        </div>
                      </div>

                      {/* Right Column: Receiver (Target) — Compact */}
                      <div className="lg:col-span-3 xl:col-span-2 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-1.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              RECEIVER (TARGET)
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                              {ex.receiverBadge}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                            {ex.receiverLabel}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                            {ex.receiverSublabel}
                          </div>
                        </div>
                        <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] font-mono text-zinc-400 break-words">
                          {ex.receiverZoneLabel}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4-Part Story-to-Spec Narrative Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* 1. Real-World Story Analogy */}
                    <div className="p-3.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/15 border border-amber-200/70 dark:border-amber-900/40 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>1. Real-World Story Analogy</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                        {ex.storyAnalogy}
                      </p>
                    </div>

                    {/* 2. Story <-> Sequence Technical Bridge */}
                    <div className="p-3.5 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/15 border border-indigo-200/70 dark:border-indigo-900/40 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        <Activity className="w-3.5 h-3.5 shrink-0" />
                        <span>2. Story ↔ Sequence Technical Bridge</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                        {ex.technicalBridge}
                      </p>
                    </div>

                    {/* 3. Under the Hood & Next Handoff */}
                    <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        <Cpu className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                        <span>3. Under the Hood & Next Handoff</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                        {ex.underTheHood}
                      </p>
                      <div className="pt-1.5 border-t border-zinc-200/70 dark:border-zinc-800 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 leading-snug break-words">
                        ↪ {ex.continuationHint}
                      </div>
                    </div>

                    {/* 4. Documented Forensic & SIEM Evidence */}
                    <div className="p-3.5 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-200/70 dark:border-emerald-900/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span>4. Documented Forensic & SIEM Evidence</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                        {ex.detectionAndEvidence}
                      </p>
                      {ex.keySpecs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {ex.keySpecs.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-mono bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
                            >
                              <Terminal className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                              <span className="break-words">{spec}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
