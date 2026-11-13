'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AttackScenario,
  AttackStage,
  TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  clampPanelDimension,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile } from '@/lib/simulation-engine';
import {
  getScenarioAttribution,
  LEGAL_COMPLIANCE_STATEMENT } from '@/lib/attack-sources-and-legal';
import {
  ArrowLeft,
  ExternalLink,
  FileTerminal,
  GripVertical,
  Layers,
  Play,
  Scale,
  ShieldCheck,
  Zap } from 'lucide-react';
import { LogInspector } from './LogInspector';
import { SelectedTelemetryDetail } from './SelectedTelemetryDetail';
import { SourcesAndLegalContent } from './SourcesAndLegalModal';

export const MIN_INSPECTOR_WIDTH = 240;
export const MAX_INSPECTOR_WIDTH = 560;
export const DEFAULT_INSPECTOR_WIDTH = 310;

interface InspectorPanelProps {
  scenario: AttackScenario;
  currentStage: AttackStage | null;
  selectedTelemetry: TelemetryEvent | null;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
  onSelectStage?: (stageIndex: number) => void;
  onStartWalkthrough?: () => void;
  onClearTelemetrySelection: () => void;
  onOpenSourcesModal?: () => void;
  activeEnvironment?: ActiveEnvironmentId;
  width?: number;
  onResizeWidth?: (newWidth: number) => void;
}

export function InspectorPanel({
  scenario,
  currentStage,
  selectedTelemetry,
  onSelectTelemetry,
  onSelectStage,
  onStartWalkthrough,
  onClearTelemetrySelection,
  onOpenSourcesModal,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  width = DEFAULT_INSPECTOR_WIDTH,
  onResizeWidth }: InspectorPanelProps) {
  const [panelMode, setPanelMode] = useState<
    'STORY_AND_SPECS' | 'FULL_LOGS' | 'SOURCES_AND_LEGAL'
  >('STORY_AND_SPECS');
  const [isDragging, setIsDragging] = useState(false);
  const [walkthroughHovered, setWalkthroughHovered] = useState(false);

  const activeStageIndex = currentStage ? currentStage.index : 0;
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);
  const attribution = getScenarioAttribution(scenario);

  const stagePacket = currentStage
    ? scenario.telemetry.find((t) => t.stageIndex === currentStage.index) ||
      scenario.telemetry[currentStage.index - 1] ||
      null
    : null;

  const handlePointerDownResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!onResizeWidth) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    setIsDragging(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const nextWidth = clampPanelDimension(
        startWidth + deltaX,
        MIN_INSPECTOR_WIDTH,
        MAX_INSPECTOR_WIDTH
      );
      onResizeWidth(nextWidth);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleKeyDownResize = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onResizeWidth) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onResizeWidth(
        clampPanelDimension(width + 24, MIN_INSPECTOR_WIDTH, MAX_INSPECTOR_WIDTH)
      );
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onResizeWidth(
        clampPanelDimension(width - 24, MIN_INSPECTOR_WIDTH, MAX_INSPECTOR_WIDTH)
      );
    } else if (e.key === 'Home' || e.key === 'Enter') {
      e.preventDefault();
      onResizeWidth(DEFAULT_INSPECTOR_WIDTH);
    }
  };

  const resizeHandleNode = (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize right inspector panel"
      aria-valuemin={MIN_INSPECTOR_WIDTH}
      aria-valuemax={MAX_INSPECTOR_WIDTH}
      aria-valuenow={width}
      tabIndex={0}
      data-testid="inspector-resize-handle"
      title="Drag to resize inspector width (double-click to reset)"
      onPointerDown={handlePointerDownResize}
      onKeyDown={handleKeyDownResize}
      onDoubleClick={() => onResizeWidth?.(DEFAULT_INSPECTOR_WIDTH)}
      className={`group/handle absolute inset-y-0 left-0 w-3 z-40 cursor-col-resize flex items-center justify-start select-none touch-none focus:outline-none ${
        isDragging ? 'bg-indigo-500/20' : 'hover:bg-indigo-500/10'
      }`}
    >
      <div
        className={`w-[2px] h-full transition-colors ${
          isDragging
            ? 'bg-indigo-500'
            : 'bg-transparent group-hover/handle:bg-indigo-500/70 group-focus-visible/handle:bg-indigo-500'
        }`}
      />
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-0.5 h-7 w-3 rounded-full bg-zinc-200/95 dark:bg-zinc-800/95 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center opacity-75 group-hover/handle:opacity-100 group-hover/handle:border-indigo-500 transition-opacity shadow-2xs">
        <GripVertical className="w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400 group-hover/handle:text-indigo-500" />
      </div>
    </div>
  );

  if (selectedTelemetry) {
    return (
      <SelectedTelemetryDetail
        selectedTelemetry={selectedTelemetry}
        currentStage={currentStage}
        onClearTelemetrySelection={onClearTelemetrySelection}
        activeEnvironment={activeEnvironment}
        width={width}
        resizeHandle={resizeHandleNode}
      />
    );
  }

  return (
    <motion.aside
      data-testid="inspector-panel"
      data-panel-width={width}
      data-active-environment={activeEnvironment}
      initial={{ width: 0, opacity: 0, x: 20 }}
      animate={{ width, opacity: 1, x: 0 }}
      exit={{ width: 0, opacity: 0, x: 20 }}
      transition={
        isDragging
          ? { duration: 0 }
          : { duration: 0.14, ease: 'easeOut' }
      }
      style={{ width }}
      dir="ltr"
      className="fixed lg:relative inset-y-12 lg:inset-y-auto right-0 z-30 max-w-[90vw] shrink-0 bg-white dark:bg-zinc-950 border-l border-zinc-200/80 dark:border-zinc-800/80 flex flex-col h-[calc(100dvh-3rem)] lg:h-full shadow-xl lg:shadow-none overflow-hidden"
    >
      {resizeHandleNode}
      {/* 3-Tab Segmented Mode Header: Overview | SIEM Logs | Sources */}
      <div className="p-3 border-b border-zinc-200/70 dark:border-zinc-800/80 shrink-0">
        <div
          role="tablist"
          aria-label="Inspector Mode"
          className="grid grid-cols-3 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900"
        >
          <button
            type="button"
            role="tab"
            data-testid="inspector-tab-overview"
            aria-selected={panelMode === 'STORY_AND_SPECS'}
            onClick={() => setPanelMode('STORY_AND_SPECS')}
            className="relative flex items-center justify-center gap-1 py-1 px-1.5 text-[10.5px] font-medium rounded-md transition-colors cursor-pointer"
          >
            {panelMode === 'STORY_AND_SPECS' && (
              <motion.span
                layoutId="inspectorMainModePill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-2xs"
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1 ${
                panelMode === 'STORY_AND_SPECS'
                  ? 'text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3 h-3 shrink-0" />
              <span className="truncate">Overview</span>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            data-testid="inspector-tab-logs"
            aria-selected={panelMode === 'FULL_LOGS'}
            onClick={() => setPanelMode('FULL_LOGS')}
            className="relative flex items-center justify-center gap-1 py-1 px-1.5 text-[10.5px] font-medium rounded-md transition-colors cursor-pointer"
          >
            {panelMode === 'FULL_LOGS' && (
              <motion.span
                layoutId="inspectorMainModePill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-2xs"
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1 ${
                panelMode === 'FULL_LOGS'
                  ? 'text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <FileTerminal className="w-3 h-3 shrink-0" />
              <span className="truncate">SIEM Logs</span>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            data-testid="inspector-tab-sources"
            aria-selected={panelMode === 'SOURCES_AND_LEGAL'}
            onClick={() => setPanelMode('SOURCES_AND_LEGAL')}
            className="relative flex items-center justify-center gap-1 py-1 px-1.5 text-[10.5px] font-medium rounded-md transition-colors cursor-pointer"
          >
            {panelMode === 'SOURCES_AND_LEGAL' && (
              <motion.span
                layoutId="inspectorMainModePill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-2xs"
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1 ${
                panelMode === 'SOURCES_AND_LEGAL'
                  ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Scale className="w-3 h-3 shrink-0" />
              <span className="truncate">Sources</span>
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active Environment Tag Strip */}
        <div
          data-testid="inspector-active-env-badge"
          data-environment-id={activeEnvironment}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-2 text-[10px] font-mono"
        >
          <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate">
            {envProfile.badgeLabel}
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 truncate">
            {envProfile.environmentTag}
          </span>
        </div>

        {panelMode === 'STORY_AND_SPECS' ? (
          <>
            {/* Narrative Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                  <span>
                    {currentStage
                      ? `Stage ${currentStage.index} of ${scenario.stages.length}`
                      : 'Scenario Overview'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {currentStage
                      ? currentStage.mitreTechniqueId
                      : scenario.code}
                  </span>
                </div>

                {currentStage && onSelectStage && (
                  <button
                    type="button"
                    data-testid="inspector-back-to-overview-btn"
                    onClick={() => onSelectStage(0)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-[10.5px] font-mono font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>OVERVIEW</span>
                  </button>
                )}
              </div>

              {currentStage ? (
                <>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug">
                    {currentStage.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {currentStage.description}
                  </p>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug">
                      {scenario.name}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                      {scenario.shortSubtitle}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                    {scenario.overview}
                  </p>
                  {onStartWalkthrough && (
                    <div className="mt-2.5 flex items-center">
                      <motion.button
                        type="button"
                        layout
                        data-testid="inspector-start-walkthrough-btn"
                        data-anime-style="cyber-mecha"
                        data-expanded={walkthroughHovered ? 'true' : 'false'}
                        aria-label={`Start Guided Walkthrough (${scenario.stages.length} Steps)`}
                        onMouseEnter={() => setWalkthroughHovered(true)}
                        onMouseLeave={() => setWalkthroughHovered(false)}
                        onFocus={() => setWalkthroughHovered(true)}
                        onBlur={() => setWalkthroughHovered(false)}
                        onClick={onStartWalkthrough}
                        animate={{
                          skewX: walkthroughHovered ? -10 : 0,
                          rotate: walkthroughHovered ? -2 : 0 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 26 }}
                        className="relative h-9 px-2.5 rounded-xl bg-[#0A0E1A] text-white text-xs font-bold inline-flex items-center gap-0 shadow-[0_4px_16px_rgba(225,29,72,0.4)] border-2 border-rose-500 hover:border-amber-400 overflow-hidden cursor-pointer focus:outline-none"
                      >
                        <span className="relative flex items-center justify-center w-5 h-5 shrink-0">
                          <motion.svg
                            viewBox="0 0 24 24"
                            animate={{
                              rotate: walkthroughHovered ? 180 : 0,
                              scale: walkthroughHovered ? 1.15 : 1 }}
                            transition={{
                              type: 'spring',
                              stiffness: 360,
                              damping: 18 }}
                            className="w-4 h-4 text-rose-500"
                          >
                            <path
                              d="M12 1 L14.8 9.2 L23 12 L14.8 14.8 L12 23 L9.2 14.8 L1 12 L9.2 9.2 Z"
                              fill="currentColor"
                              stroke="#FDE047"
                              strokeWidth="1.2"
                            />
                          </motion.svg>
                          <Play className="w-2 h-2 fill-amber-300 text-amber-300 absolute" />
                          <Zap className="w-2.5 h-2.5 text-cyan-300 fill-cyan-300 absolute -top-1 -right-1" />
                        </span>

                        <motion.span
                          initial={false}
                          animate={{
                            maxWidth: walkthroughHovered ? 245 : 0,
                            opacity: walkthroughHovered ? 1 : 0,
                            marginLeft: walkthroughHovered ? 8 : 0,
                            paddingRight: walkthroughHovered ? 4 : 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 28 }}
                          className="overflow-hidden whitespace-nowrap text-[11px] font-black uppercase tracking-wider text-amber-200"
                        >
                          {`Guided Walkthrough (${scenario.stages.length} Steps)`}
                        </motion.span>
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Live Packet Card when in a Stage */}
            {currentStage && stagePacket && (
              <motion.div
                key={`stage-packet-card-${currentStage.index}`}
                data-testid="inspector-live-packet-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
                onClick={() => onSelectTelemetry?.(stagePacket)}
                className="rounded-xl border border-rose-500/40 bg-zinc-950 text-white overflow-hidden shadow-sm cursor-pointer hover:border-rose-500 transition-colors"
              >
                <div className="px-3 py-1.5 bg-rose-600 text-white flex items-center justify-between gap-2 text-[10.5px] font-mono">
                  <span className="font-bold truncate">
                    #{currentStage.index}.1→ {stagePacket.shortAction}
                  </span>
                  <span className="text-rose-100 truncate">
                    {stagePacket.sourceLabel} → {stagePacket.targetLabel}
                  </span>
                </div>
                <div className="p-2.5 space-y-1.5">
                  <div className="text-[11px] font-mono text-amber-300 leading-snug line-clamp-2 break-all">
                    {stagePacket.info}
                  </div>
                  <div className="pt-1 border-t border-zinc-800 flex items-center justify-between text-[9.5px] font-mono text-zinc-400">
                    <span>
                      PACKET {currentStage.index} OF {scenario.stages.length} ·{' '}
                      {stagePacket.protocolOrEventId}
                    </span>
                    <span className="text-emerald-400">
                      ⇠#{currentStage.index}.2 {stagePacket.sizeOrCode}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

            {/* Technical Specifications or Stage Timeline */}
            {currentStage ? (
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Technical Specifications
                </h4>
                <dl className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                  {currentStage.keySpecs.map((spec, idx) => (
                    <div key={idx} className="py-2 flex flex-col gap-0.5">
                      <dt className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {spec.term}
                      </dt>
                      <dd className="font-mono text-[11.5px] text-zinc-900 dark:text-zinc-100 break-words">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Attack Chain Stages
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                    {scenario.stages.length}
                  </span>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
                  {scenario.stages.map((st) => (
                    <button
                      key={st.index}
                      type="button"
                      onClick={() => onSelectStage?.(st.index)}
                      className="w-full py-2.5 flex flex-col gap-0.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {st.index}. {st.title}
                        </span>
                        <span className="text-[10.5px] font-mono text-zinc-400 shrink-0">
                          {st.mitreTechniqueId}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {st.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

            {/* Always-Visible Authoritative Sources & Legal Compliance Attribution Card */}
            <div
              data-testid="inspector-sources-summary-card"
              className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/35 border border-emerald-200/90 dark:border-emerald-800/75 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 dark:text-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Verified Sources & Legal Notice</span>
                </span>
                <button
                  type="button"
                  data-testid="inspector-open-full-sources-btn"
                  onClick={() =>
                    onOpenSourcesModal
                      ? onOpenSourcesModal()
                      : setPanelMode('SOURCES_AND_LEGAL')
                  }
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono font-bold cursor-pointer transition-colors"
                >
                  <span>Full Citations</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1 text-[9.5px] font-mono">
                {attribution.mitreTechniques.map((t) => (
                  <a
                    key={t.id}
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold hover:underline"
                  >
                    MITRE {t.id}
                  </a>
                ))}
                {attribution.primarySources.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:underline"
                  >
                    {s.referenceCode}
                  </a>
                ))}
              </div>

              <p className="text-[10px] text-emerald-800/90 dark:text-emerald-300/90 leading-snug">
                {attribution.syntheticDataNotice}{' '}
                {LEGAL_COMPLIANCE_STATEMENT.copyrightAttribution}
              </p>
            </div>
          </>
        ) : panelMode === 'FULL_LOGS' ? (
          <LogInspector
            scenario={scenario}
            activeStageIndex={activeStageIndex}
            selectedTelemetryId={null}
            onSelectTelemetry={onSelectTelemetry}
            onSelectStage={onSelectStage}
            activeEnvironment={activeEnvironment}
          />
        ) : (
          <SourcesAndLegalContent scenario={scenario} compact />
        )}
      </div>
    </motion.aside>
  );
}
