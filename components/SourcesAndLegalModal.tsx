'use client';

import React from 'react';
import { motion } from 'motion/react';
import { AttackScenario } from '@/lib/attack-scenarios';
import {
  getScenarioAttribution,
  GLOBAL_FRAMEWORK_SOURCES,
  LEGAL_COMPLIANCE_STATEMENT } from '@/lib/attack-sources-and-legal';
import { InspectorScopeContext } from '@/lib/inspector-scope';
import {
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  Scale,
  ShieldCheck,
  X } from 'lucide-react';

interface SourcesAndLegalViewProps {
  scenario: AttackScenario;
  compact?: boolean;
  scopeContext?: InspectorScopeContext;
}

export function SourcesAndLegalContent({
  scenario,
  compact = false,
  scopeContext }: SourcesAndLegalViewProps) {
  const attribution = getScenarioAttribution(scenario);
  const isExpandedScope = Boolean(
    scopeContext &&
      scopeContext.effectiveScope !== 'MAIN_SCENARIO' &&
      scopeContext.internalSubBoard
  );
  const scopedMitreIds = isExpandedScope && scopeContext
    ? Array.from(
        new Set(
          scopeContext.scopedTelemetryEvents
            .map((ev) => ev.mitreId)
            .filter(Boolean)
        )
      )
    : [];

  return (
    <div
      data-testid="sources-and-legal-content"
      data-inspector-scope={scopeContext?.effectiveScope || 'MAIN_SCENARIO'}
      className="space-y-4 text-left"
      dir="ltr"
    >
      {/* 0. Active Expanded Scope Attribution & Architecture Reference */}
      {isExpandedScope && scopeContext && scopeContext.internalSubBoard && (
        <div
          data-testid="sources-current-scope-card"
          className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/35 border border-indigo-300/80 dark:border-indigo-800/80 space-y-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono">
            <span className="inline-flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>{scopeContext.scopeBadgeText}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-600/15 text-indigo-800 dark:text-indigo-200 border border-indigo-500/30 font-bold">
              {scopeContext.internalSubBoard.boardCode}
            </span>
          </div>
          <div className="text-xs font-bold text-zinc-900 dark:text-white leading-snug break-words">
            {scopeContext.internalSubBoard.title}
          </div>
          <div className="text-[10.5px] font-mono text-zinc-600 dark:text-zinc-300 leading-snug break-words">
            {scopeContext.internalSubBoard.hostSystemLabel}
          </div>
          <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
            {scopeContext.internalSubBoard.architectureNote}
          </p>
          {scopedMitreIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                Scoped MITRE IDs:
              </span>
              {scopedMitreIds.map((mId) => (
                <span
                  key={mId}
                  className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9.5px] font-mono font-bold"
                >
                  {mId}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 1. Legal & Synthetic Telemetry Compliance Banner */}
      <div
        data-testid="legal-compliance-guarantee-box"
        className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/80 space-y-2"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{LEGAL_COMPLIANCE_STATEMENT.headline}</span>
        </div>
        <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
          {LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee}
        </p>
        <p className="text-[10.5px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
          {LEGAL_COMPLIANCE_STATEMENT.noHarmfulCodeGuarantee}
        </p>
      </div>

      {/* 2. Scenario-Specific MITRE ATT&CK® Citations */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <BookOpenCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              Scenario Citations: {scenario.code} ({scenario.name})
            </span>
          </h4>
        </div>

        <div className="space-y-2">
          {attribution.mitreTechniques.map((tech) => (
            <div
              key={tech.id}
              data-testid={`source-mitre-citation-${tech.id}`}
              className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px] shrink-0">
                    {tech.id}
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white break-words">
                    {tech.name}
                  </span>
                </div>
                <div className="text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  MITRE ATT&CK® Tactic: {tech.tactic}
                </div>
              </div>
              <a
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-700 shrink-0"
              >
                <span>MITRE</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Primary Technical Documentation & Advisories for This Scenario */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-700 dark:text-zinc-300">
          Primary Technical Specifications & Log Schemas
        </h4>
        <div className="space-y-2">
          {attribution.primarySources.map((src) => (
            <div
              key={src.id}
              data-testid={`scenario-source-card-${src.id}`}
              className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    {src.organization} · {src.referenceCode}
                  </span>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                    {src.title}
                  </div>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 shrink-0"
                >
                  <span>Source</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {src.usageSummary}
              </p>
              <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>License / Terms: {src.licenseOrTerms}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Global Framework & Standard Attributions */}
      {!compact && (
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-500" />
            <span>Global Frameworks, Open Standards & Trademark Notice</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {GLOBAL_FRAMEWORK_SOURCES.map((fw) => (
              <div
                key={fw.id}
                data-testid={`global-source-card-${fw.id}`}
                className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                    {fw.organization}
                  </span>
                  <a
                    href={fw.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>{fw.referenceCode}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                  {fw.title}
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {fw.usageSummary}
                </p>
                <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                  Terms: {fw.licenseOrTerms}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 font-mono pt-1">
            {LEGAL_COMPLIANCE_STATEMENT.copyrightAttribution}
          </p>
        </div>
      )}
    </div>
  );
}

interface SourcesAndLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: AttackScenario;
}

export function SourcesAndLegalModal({
  isOpen,
  onClose,
  scenario }: SourcesAndLegalModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sources, Citations and Legal Compliance"
      data-testid="sources-legal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 backdrop-blur-xs p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.16 }}
        onClick={(e) => e.stopPropagation()}
        dir="ltr"
        className="w-full max-w-4xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[86vh] overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                Authoritative Sources, Citations & Legal Compliance
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Verified technical references, open-source licenses & synthetic telemetry notice
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="close-sources-legal-modal-btn"
            aria-label="Close Sources and Legal Modal"
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <SourcesAndLegalContent scenario={scenario} />
        </div>
      </motion.div>
    </div>
  );
}
