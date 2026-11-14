'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AttackScenario,
  AttackStage,
  TelemetryEvent,
} from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  clampPanelDimension,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import {
  getScenarioAttribution,
  LEGAL_COMPLIANCE_STATEMENT,
} from '@/lib/attack-sources-and-legal';
import { CinematicPhase } from '@/lib/cinematic-camera-director';
import {
  InspectorScopeContext,
  InspectorScopeMode,
} from '@/lib/inspector-scope';
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  BookOpen,
  Compass,
  Cpu,
  ExternalLink,
  FileSearch,
  FileTerminal,
  GripVertical,
  Layers,
  ListOrdered,
  Maximize2,
  Scale,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { LogInspector } from './LogInspector';
import { SelectedTelemetryDetail } from './SelectedTelemetryDetail';
import { SourcesAndLegalContent } from './SourcesAndLegalModal';
import { MitreStats } from './MitreStats';
import { ThreatIntelCard } from './ThreatIntelCard';
import { StepByStepGuidePanel } from './StepByStepGuidePanel';

export const MIN_INSPECTOR_WIDTH = 260;
export const MAX_INSPECTOR_WIDTH = 620;
export const DEFAULT_INSPECTOR_WIDTH = 350;

interface InspectorPanelProps {
  scenario: AttackScenario;
  currentStage: AttackStage | null;
  cinematicPhase?: CinematicPhase | null;
  isPlaying?: boolean;
  selectedTelemetry: TelemetryEvent | null;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
  onSelectStage?: (stageIndex: number) => void;
  onStartWalkthrough?: () => void;
  onTogglePlay?: () => void;
  onResetWalkthrough?: () => void;
  onClearTelemetrySelection: () => void;
  onOpenSourcesModal?: () => void;
  activeEnvironment?: ActiveEnvironmentId;
  scopeContext?: InspectorScopeContext;
  onSelectNode?: (nodeId: string | null) => void;
  onExpandedNodeChange?: (nodeId: string | null) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onScopeOverrideChange?: (override: InspectorScopeMode | null) => void;
  width?: number;
  onResizeWidth?: (newWidth: number) => void;
}

export function InspectorPanel({
  scenario,
  currentStage,
  cinematicPhase = 'OVERVIEW',
  isPlaying = false,
  selectedTelemetry,
  onSelectTelemetry,
  onSelectStage,
  onStartWalkthrough,
  onTogglePlay,
  onResetWalkthrough,
  onClearTelemetrySelection,
  onOpenSourcesModal,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  scopeContext,
  onSelectNode,
  onExpandedNodeChange,
  onSelectInternalSubNode,
  onScopeOverrideChange,
  width = DEFAULT_INSPECTOR_WIDTH,
  onResizeWidth,
}: InspectorPanelProps) {
  const [panelMode, setPanelMode] = useState<
    'STORY_AND_SPECS' | 'STEP_GUIDE' | 'FULL_LOGS' | 'SOURCES_AND_LEGAL'
  >(isPlaying ? 'STEP_GUIDE' : 'STORY_AND_SPECS');
  const [isDragging, setIsDragging] = useState(false);

  // Automatically reveal the Step-by-Step Guide in the Right Panel when Auto-Play starts
  useEffect(() => {
    if (!isPlaying) return;
    const rafId = window.requestAnimationFrame(() => {
      setPanelMode('STEP_GUIDE');
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [isPlaying]);

  const activeStageIndex = currentStage ? currentStage.index : 0;
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);
  const attribution = getScenarioAttribution(scenario);

  const effectiveScope: InspectorScopeMode =
    scopeContext?.effectiveScope ?? 'MAIN_SCENARIO';
  const diagramScope: InspectorScopeMode =
    scopeContext?.diagramScope ?? 'MAIN_SCENARIO';
  const scopeBadgeText = scopeContext?.scopeBadgeText ?? 'Scenario';

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
        scopeBadgeText={scopeBadgeText}
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
      data-inspector-scope={effectiveScope}
      data-diagram-scope={diagramScope}
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
      className="absolute lg:relative inset-y-0 lg:inset-y-auto right-0 z-50 lg:z-20 max-w-[90vw] shrink-0 bg-white dark:bg-zinc-950 border-l border-zinc-200/80 dark:border-zinc-800/80 flex flex-col h-full shadow-2xl lg:shadow-none overflow-hidden"
    >
      {resizeHandleNode}
      {/* 4-Tab Segmented Mode Header: Overview | Steps | SIEM Logs | Sources */}
      <div className="p-3 border-b border-zinc-200/70 dark:border-zinc-800/80 shrink-0 space-y-2">
        <div
          role="tablist"
          aria-label="Inspector Mode"
          className="grid grid-cols-4 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900"
        >
          <button
            type="button"
            role="tab"
            data-testid="inspector-tab-overview"
            aria-selected={panelMode === 'STORY_AND_SPECS'}
            onClick={() => setPanelMode('STORY_AND_SPECS')}
            className="relative flex items-center justify-center gap-1 py-1 px-1 text-[10px] font-medium rounded-md transition-colors cursor-pointer"
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
              <span className="whitespace-nowrap">Overview</span>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            data-testid="inspector-tab-step-guide"
            aria-selected={panelMode === 'STEP_GUIDE'}
            onClick={() => setPanelMode('STEP_GUIDE')}
            title="Step-by-Step Diagram Walkthrough & Scenario Briefing"
            className="relative flex items-center justify-center gap-1 py-1 px-1 text-[10px] font-medium rounded-md transition-colors cursor-pointer"
          >
            {panelMode === 'STEP_GUIDE' && (
              <motion.span
                layoutId="inspectorMainModePill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-2xs"
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1 ${
                panelMode === 'STEP_GUIDE'
                  ? 'text-indigo-600 dark:text-indigo-300 font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <ListOrdered className="w-3 h-3 shrink-0" />
              <span className="whitespace-nowrap">Steps</span>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            data-testid="inspector-tab-logs"
            aria-selected={panelMode === 'FULL_LOGS'}
            onClick={() => setPanelMode('FULL_LOGS')}
            className="relative flex items-center justify-center gap-1 py-1 px-1 text-[10px] font-medium rounded-md transition-colors cursor-pointer"
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
              <span className="whitespace-nowrap">SIEM Logs</span>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            data-testid="inspector-tab-sources"
            aria-selected={panelMode === 'SOURCES_AND_LEGAL'}
            onClick={() => setPanelMode('SOURCES_AND_LEGAL')}
            className="relative flex items-center justify-center gap-1 py-1 px-1 text-[10px] font-medium rounded-md transition-colors cursor-pointer"
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
              <span className="whitespace-nowrap">Sources</span>
            </span>
          </button>
        </div>

        {/* Context-Aware Scope Indicator & Scope Navigation Bar */}
        <div
          data-testid="inspector-scope-bar"
          className={`px-2.5 py-1.5 rounded-lg border flex flex-col gap-1.5 text-[10px] font-mono ${
            effectiveScope === 'INTERNAL_SUBNODE'
              ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/90 dark:border-rose-800/75'
              : effectiveScope === 'EXPANDED_NODE'
              ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200/90 dark:border-indigo-800/75'
              : 'bg-zinc-50 dark:bg-zinc-900/70 border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
            <span className="text-[9.5px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 shrink-0">
              Scope
            </span>
            <span
              data-testid="inspector-scope-badge"
              className={`px-1.5 py-0.5 rounded font-bold leading-snug break-words ${
                effectiveScope === 'INTERNAL_SUBNODE'
                  ? 'bg-rose-600 text-white'
                  : effectiveScope === 'EXPANDED_NODE'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
              }`}
            >
              {scopeBadgeText}
            </span>
          </div>

          {/* Scope Jump Controls when Diagram is Expanded or Overridden */}
          {(diagramScope !== 'MAIN_SCENARIO' ||
            scopeContext?.isScenarioOverrideActive) && (
            <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-zinc-200/70 dark:border-zinc-800/70">
              {scopeContext?.isScenarioOverrideActive ? (
                <button
                  type="button"
                  data-testid="inspector-return-to-expanded-scope-btn"
                  onClick={() => onScopeOverrideChange?.(null)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[9.5px] font-semibold cursor-pointer transition-colors leading-snug break-words"
                >
                  <Maximize2 className="w-2.5 h-2.5 shrink-0" />
                  <span>{`Return to ${scopeContext.diagramScopeBadgeText}`}</span>
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-1">
                  {effectiveScope === 'INTERNAL_SUBNODE' &&
                    scopeContext?.expandedNode && (
                      <button
                        type="button"
                        data-testid="inspector-scope-parent-node-btn"
                        onClick={() => onSelectInternalSubNode?.(null)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[9.5px] font-semibold cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-2.5 h-2.5 shrink-0" />
                        <span>{`Node #${scopeContext.expandedNode.chainOrder}`}</span>
                      </button>
                    )}

                  <button
                    type="button"
                    data-testid="inspector-scope-scenario-btn"
                    onClick={() => onScopeOverrideChange?.('MAIN_SCENARIO')}
                    title="Inspect global scenario view without leaving the expanded diagram"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-[9.5px] font-semibold cursor-pointer transition-colors"
                  >
                    <span>Scenario View</span>
                  </button>
                </div>
              )}

              {diagramScope !== 'MAIN_SCENARIO' && (
                <button
                  type="button"
                  data-testid="inspector-back-to-main-topology-btn"
                  onClick={() => {
                    onScopeOverrideChange?.(null);
                    onExpandedNodeChange?.(null);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-[9.5px] font-semibold cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-2.5 h-2.5 shrink-0" />
                  <span>Main Topology</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Active Environment Tag Strip */}
        <div
          data-testid="inspector-active-env-badge"
          data-environment-id={activeEnvironment}
          title={`${envProfile.badgeLabel} · ${envProfile.environmentTag}`}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 min-w-0 text-[10px] font-mono"
        >
          <span
            title={envProfile.badgeLabel}
            className="font-bold text-indigo-600 dark:text-indigo-400 min-w-0 leading-snug"
          >
            {envProfile.badgeLabel}
          </span>
          <span
            title={envProfile.environmentTag}
            className="text-zinc-500 dark:text-zinc-400 shrink-0 leading-snug"
          >
            {envProfile.environmentTag}
          </span>
        </div>

        {panelMode === 'STORY_AND_SPECS' ? (
          effectiveScope === 'INTERNAL_SUBNODE' &&
          scopeContext?.selectedSubNode &&
          scopeContext?.internalSubBoard &&
          scopeContext?.expandedNode ? (
            /* =====================================================================
             * SCOPE 3: SELECTED INTERNAL SUB-NODE OVERVIEW
             * ===================================================================== */
            <div
              data-testid="inspector-internal-subnode-overview"
              className="space-y-4"
            >
              {/* Sub-Node Header & Role */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold">
                    {scopeContext.selectedSubNode.actionBadge}
                  </span>
                  {scopeContext.selectedSubNodeZone && (
                    <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold">
                      {`${scopeContext.selectedSubNodeZone.code} · ${scopeContext.selectedSubNodeZone.title}`}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug break-words">
                    {scopeContext.selectedSubNode.label}
                  </h3>
                  <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 leading-snug break-words">
                    {scopeContext.selectedSubNode.sublabel}
                  </p>
                </div>

                {/* Documented Sub-Node Activity & Internal Summary */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                  <p className="text-xs text-zinc-700 dark:text-zinc-200 leading-relaxed break-words">
                    {scopeContext.selectedSubNode.activitySummary}
                  </p>
                  {scopeContext.selectedSubNode.internalSummary &&
                    scopeContext.selectedSubNode.internalSummary !==
                      scopeContext.selectedSubNode.activitySummary && (
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed break-words pt-1 border-t border-zinc-200/70 dark:border-zinc-800">
                        {scopeContext.selectedSubNode.internalSummary}
                      </p>
                    )}
                </div>

                {/* Parent Host & Sub-Board Context */}
                <dl className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                  {scopeContext.selectedSubNode.hostContext && (
                    <div className="py-2 flex flex-col gap-0.5 min-w-0">
                      <dt className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400">
                        Host / Process Context
                      </dt>
                      <dd className="font-mono text-[11px] text-zinc-900 dark:text-zinc-100 break-words">
                        {scopeContext.selectedSubNode.hostContext}
                      </dd>
                    </div>
                  )}
                  <div className="py-2 flex flex-col gap-0.5 min-w-0">
                    <dt className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400">
                      Parent Expanded Board
                    </dt>
                    <dd className="font-mono text-[11px] text-zinc-900 dark:text-zinc-100 break-words">
                      {`${scopeContext.internalSubBoard.boardCode} · ${scopeContext.internalSubBoard.title}`}
                    </dd>
                  </div>
                  <div className="py-2 flex flex-col gap-0.5 min-w-0">
                    <dt className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400">
                      Environment Breadcrumb
                    </dt>
                    <dd className="font-mono text-[11px] text-zinc-900 dark:text-zinc-100 break-words">
                      {scopeContext.internalSubBoard.environmentBreadcrumb}
                    </dd>
                  </div>
                  {scopeContext.selectedSubNodeZone && (
                    <div className="py-2 flex flex-col gap-0.5 min-w-0">
                      <dt className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400">
                        Internal Zone Boundary
                      </dt>
                      <dd className="font-mono text-[11px] text-zinc-900 dark:text-zinc-100 break-words">
                        {`${scopeContext.selectedSubNodeZone.title} (${scopeContext.selectedSubNodeZone.subtitle})`}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

              {/* Related Sub-Flows & Telemetry for This Sub-Node */}
              <div
                data-testid="inspector-subnode-related-flows"
                className="space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Connected Internal Flows & Telemetry
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                    {scopeContext.relatedSubFlows.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {scopeContext.relatedSubFlows.map((fl) => (
                    <div
                      key={fl.id}
                      data-testid={`inspector-subnode-flow-card-${fl.stepNo}`}
                      className="p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold">
                          {`#${fl.sequenceCode} · ${fl.protocolBadge}`}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                          {fl.telemetryEvent.mitreId}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-zinc-900 dark:text-white leading-snug break-words">
                        {fl.label}
                      </div>
                      <div className="text-[10.5px] font-mono text-indigo-600 dark:text-indigo-400 leading-snug break-words">
                        {`${fl.initiatorLabel} → ${fl.targetLabel}`}
                      </div>

                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
                        {fl.telemetryEvent.explanation}
                      </p>

                      <div className="p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 space-y-1 text-[10px] font-mono">
                        <div className="text-emerald-700 dark:text-emerald-400 font-semibold leading-snug break-words">
                          {`⇠#${fl.returnSeq} · ${fl.returnLabel}`}
                        </div>
                        <div className="text-zinc-600 dark:text-zinc-300 leading-snug break-words font-sans text-[11px]">
                          {fl.traceMeta.returnDescription}
                        </div>
                      </div>

                      {fl.traceMeta.continuationHint && (
                        <div className="text-[10px] font-mono text-amber-700 dark:text-amber-300 leading-snug break-words">
                          {fl.traceMeta.continuationHint}
                        </div>
                      )}

                      {onSelectTelemetry && (
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            data-testid={`inspector-subnode-inspect-flow-${fl.stepNo}`}
                            onClick={() => onSelectTelemetry(fl.telemetryEvent)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono font-bold cursor-pointer transition-colors"
                          >
                            <FileSearch className="w-3 h-3 shrink-0" />
                            <span>Inspect Packet</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

              {/* Sibling Internal Sub-Nodes Switcher */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Internal Pipeline Sub-Nodes
                  </h4>
                  <button
                    type="button"
                    onClick={() => onSelectInternalSubNode?.(null)}
                    className="text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {`View All Node #${scopeContext.expandedNode.chainOrder}`}
                  </button>
                </div>

                <div className="space-y-1.5">
                  {scopeContext.internalSubBoard.subNodes.map((sn) => {
                    const isCurrentSub =
                      sn.id === scopeContext.selectedSubNode?.id;
                    return (
                      <button
                        key={sn.id}
                        type="button"
                        data-testid={`inspector-subnode-switch-${sn.chainOrder}`}
                        onClick={() => onSelectInternalSubNode?.(sn.id)}
                        className={`w-full p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                          isCurrentSub
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/25'
                            : 'border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {sn.actionBadge}
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400">
                            {`#${scopeContext.expandedNode?.chainOrder}.${sn.chainOrder}`}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-zinc-900 dark:text-white leading-snug break-words mt-0.5">
                          {sn.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : effectiveScope === 'EXPANDED_NODE' &&
            scopeContext?.expandedNode &&
            scopeContext?.internalSubBoard ? (
            /* =====================================================================
             * SCOPE 2: EXPANDED NODE INTERNAL SUB-BOARD OVERVIEW
             * ===================================================================== */
            <div
              data-testid="inspector-expanded-node-overview"
              className="space-y-4"
            >
              {/* Expanded Node Title, Breadcrumb & Host System */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">
                    {scopeContext.internalSubBoard.boardCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-semibold">
                    {scopeContext.expandedNode.actionBadge}
                  </span>
                </div>

                <div>
                  <h3
                    title={scopeContext.internalSubBoard.title}
                    className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug break-words"
                  >
                    {scopeContext.internalSubBoard.title}
                  </h3>
                  <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1 leading-snug break-words">
                    {scopeContext.internalSubBoard.subtitle}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1 text-[11px]">
                  <div className="font-mono font-semibold text-zinc-800 dark:text-zinc-200 leading-snug break-words">
                    {scopeContext.internalSubBoard.hostSystemLabel}
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                    {scopeContext.internalSubBoard.environmentBreadcrumb}
                  </div>
                </div>

                {/* Architecture Note from buildInternalNodeSubBoard */}
                <div
                  data-testid="inspector-expanded-architecture-note"
                  className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/25 border border-indigo-200/80 dark:border-indigo-800/70 space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
                    <Compass className="w-3 h-3 shrink-0" />
                    <span>Internal Architecture & Telemetry Scope</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-200 leading-relaxed break-words">
                    {scopeContext.internalSubBoard.architectureNote}
                  </p>
                </div>

                {/* Sequence Lineage Card */}
                <div
                  data-testid="inspector-expanded-sequence-lineage"
                  className="p-2.5 rounded-lg bg-slate-900 text-white border border-slate-800 space-y-1 text-[10px] font-mono"
                >
                  <div className="text-amber-300 font-bold leading-snug break-words">
                    {scopeContext.internalSubBoard.sequenceLineage.lineageBadgeText}
                  </div>
                  {scopeContext.internalSubBoard.sequenceLineage.inboundParentSeqs
                    .length > 0 && (
                    <div className="text-slate-300 leading-snug break-words">
                      {`Inbound Parent Seq: ${scopeContext.internalSubBoard.sequenceLineage.inboundParentSeqs.join(', ')}`}
                    </div>
                  )}
                  <div className="text-indigo-300 leading-snug break-words">
                    {`Internal Sequence Chain: ${scopeContext.internalSubBoard.sequenceLineage.internalSeqChain.join(' → ')}`}
                  </div>
                  {scopeContext.internalSubBoard.sequenceLineage.outboundParentSeqs
                    .length > 0 && (
                    <div className="text-emerald-300 leading-snug break-words">
                      {`Outbound Parent Seq: ${scopeContext.internalSubBoard.sequenceLineage.outboundParentSeqs.join(', ')}`}
                    </div>
                  )}
                </div>

                {/* Companion Host / Process Switcher if present */}
                {scopeContext.companionNode && (
                  <button
                    type="button"
                    data-testid="inspector-switch-companion-node-btn"
                    onClick={() =>
                      onExpandedNodeChange?.(scopeContext.companionNode!.id)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/70 border border-sky-300 dark:border-sky-800 flex items-center justify-between gap-2 text-left text-[11px] font-semibold text-sky-800 dark:text-sky-200 cursor-pointer transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5 min-w-0 leading-snug break-words">
                      <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {scopeContext.internalSubBoard.currentScopeType ===
                        'MALWARE_ON_HOST'
                          ? `Switch to Host: ${scopeContext.companionNode.label}`
                          : `Switch to Process: ${scopeContext.companionNode.label}`}
                      </span>
                    </span>
                    <span className="font-mono text-[10px] shrink-0">
                      {`Node #${scopeContext.companionNode.chainOrder}`}
                    </span>
                  </button>
                )}

                {/* Quick CTA to open the Scoped Internal Pipeline Steps */}
                <button
                  type="button"
                  data-testid="inspector-open-step-guide-btn"
                  onClick={() => setPanelMode('STEP_GUIDE')}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-indigo-50/90 hover:bg-indigo-100/90 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-900 dark:text-indigo-200 min-w-0 leading-snug">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Internal Pipeline Step-by-Step Guide</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9.5px] font-mono font-bold shrink-0">
                    {`${scopeContext.internalSubBoard.subFlows.length} STEPS`}
                  </span>
                </button>
              </div>

              <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

              {/* Interactive Internal Sub-Nodes List */}
              <div
                data-testid="inspector-expanded-subnodes-list"
                className="space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Internal Pipeline Sub-Nodes
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                    {scopeContext.internalSubBoard.subNodes.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {scopeContext.internalSubBoard.subNodes.map((subNode) => (
                    <button
                      key={subNode.id}
                      type="button"
                      data-testid={`inspector-expanded-subnode-item-${subNode.chainOrder}`}
                      onClick={() => onSelectInternalSubNode?.(subNode.id)}
                      className="w-full p-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 hover:border-indigo-500/60 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {subNode.actionBadge}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
                          {`#${scopeContext.expandedNode?.chainOrder}.${subNode.chainOrder}`}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-white leading-snug break-words">
                        {subNode.label}
                      </div>
                      <div className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                        {subNode.sublabel}
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug break-words pt-0.5">
                        {subNode.activitySummary}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

              {/* Documented Original Node Specifications (if present on parent node) */}
              {scopeContext.expandedNode.originalNode?.details && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Node Technical Specifications
                  </h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
                    {scopeContext.expandedNode.originalNode.details.description}
                  </p>
                  <dl className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                    <div className="py-2 flex flex-col gap-0.5 min-w-0">
                      <dt className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                        OS / Type
                      </dt>
                      <dd className="font-mono text-[11.5px] text-zinc-900 dark:text-zinc-100 break-words">
                        {
                          scopeContext.expandedNode.originalNode.details
                            .osOrType
                        }
                      </dd>
                    </div>
                    {scopeContext.expandedNode.originalNode.details
                      .pidOrPort && (
                      <div className="py-2 flex flex-col gap-0.5 min-w-0">
                        <dt className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                          PID / Port
                        </dt>
                        <dd className="font-mono text-[11.5px] text-zinc-900 dark:text-zinc-100 break-words">
                          {
                            scopeContext.expandedNode.originalNode.details
                              .pidOrPort
                          }
                        </dd>
                      </div>
                    )}
                    {scopeContext.expandedNode.originalNode.details
                      .privilege && (
                      <div className="py-2 flex flex-col gap-0.5 min-w-0">
                        <dt className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                          Privilege Context
                        </dt>
                        <dd className="font-mono text-[11.5px] text-zinc-900 dark:text-zinc-100 break-words">
                          {
                            scopeContext.expandedNode.originalNode.details
                              .privilege
                          }
                        </dd>
                      </div>
                    )}
                    {scopeContext.expandedNode.originalNode.details.artifacts
                      .length > 0 && (
                      <div className="py-2 flex flex-col gap-0.5 min-w-0">
                        <dt className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                          Documented Artifacts
                        </dt>
                        <dd className="font-mono text-[11px] text-zinc-900 dark:text-zinc-100 break-words">
                          {scopeContext.expandedNode.originalNode.details.artifacts.join(
                            ' · '
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Internal Sub-Flows Packet List */}
              <div
                data-testid="inspector-expanded-subflows-list"
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Internal Telemetry Flows
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                    {scopeContext.internalSubBoard.subFlows.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {scopeContext.internalSubBoard.subFlows.map((fl) => (
                    <div
                      key={fl.id}
                      onClick={() => onSelectTelemetry?.(fl.telemetryEvent)}
                      className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-rose-500/50 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          {`#${fl.sequenceCode} · ${fl.label}`}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {fl.telemetryEvent.protocolOrEventId}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug break-words">
                        {fl.telemetryEvent.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* =====================================================================
             * SCOPE 1: MAIN SCENARIO TOPOLOGY OVERVIEW
             * ===================================================================== */
            <>
              {/* Selected Main-Board Node Details Card (when single-clicked on main topology) */}
              {scopeContext?.selectedMainNode && (
                <div
                  data-testid="inspector-selected-main-node-card"
                  className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/90 dark:border-indigo-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">
                      {`NODE #${scopeContext.selectedMainNode.chainOrder} · ${scopeContext.selectedMainNode.actionBadge}`}
                    </span>
                    <button
                      type="button"
                      data-testid="inspector-clear-selected-node-btn"
                      onClick={() => onSelectNode?.(null)}
                      title="Clear node selection"
                      className="p-0.5 rounded text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white leading-snug break-words">
                      {scopeContext.selectedMainNode.label}
                    </div>
                    <div className="text-[10.5px] font-mono text-indigo-600 dark:text-indigo-400 leading-snug break-words">
                      {scopeContext.selectedMainNode.sublabel}
                    </div>
                  </div>

                  {scopeContext.selectedMainNode.hostContext && (
                    <div className="text-[10.5px] font-mono text-zinc-600 dark:text-zinc-300 leading-snug break-words">
                      {scopeContext.selectedMainNode.hostContext}
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                    {scopeContext.selectedMainNode.activitySummary}
                  </p>

                  <div className="pt-1 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      data-testid="inspector-expand-selected-node-btn"
                      onClick={() =>
                        onExpandedNodeChange?.(scopeContext.selectedMainNode!.id)
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-bold cursor-pointer transition-colors"
                    >
                      <Maximize2 className="w-3 h-3 shrink-0" />
                      <span>Expand Internal Pipeline</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Narrative Section */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                  <div
                    title={
                      currentStage
                        ? `Stage ${currentStage.index} of ${scenario.stages.length} · ${currentStage.mitreTechniqueId}`
                        : `Scenario Briefing · ${scenario.code}`
                    }
                    className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 tabular-nums min-w-0"
                  >
                    <span>
                      {currentStage
                        ? `Stage ${currentStage.index} of ${scenario.stages.length}`
                        : 'Scenario Briefing'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="shrink-0">
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
                      title="Return to full scenario briefing"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-[10.5px] font-mono font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shrink-0"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>BRIEFING</span>
                    </button>
                  )}
                </div>

                {currentStage ? (
                  <>
                    <h3
                      title={currentStage.title}
                      className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug break-words"
                    >
                      {currentStage.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
                      {currentStage.description}
                    </p>
                  </>
                ) : (
                  <>
                    <div>
                      <h3
                        title={scenario.name}
                        className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug break-words"
                      >
                        {scenario.name}
                      </h3>
                      <p
                        title={scenario.shortSubtitle}
                        className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug break-words"
                      >
                        {scenario.shortSubtitle}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1 break-words">
                      {scenario.overview}
                    </p>
                  </>
                )}

                {/* Quick CTA to open the numbered Step-by-Step Diagram Walkthrough */}
                <button
                  type="button"
                  data-testid="inspector-open-step-guide-btn"
                  onClick={() => setPanelMode('STEP_GUIDE')}
                  className="w-full mt-1.5 px-3 py-2 rounded-lg bg-indigo-50/90 hover:bg-indigo-100/90 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-900 dark:text-indigo-200 min-w-0 leading-snug">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Plain-Language Step-by-Step Guide</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9.5px] font-mono font-bold shrink-0">
                    {scenario.stages.length} STEPS
                  </span>
                </button>
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
                  <div className="px-3 py-1.5 bg-rose-600 text-white flex flex-wrap items-center justify-between gap-2 min-w-0 text-[10.5px] font-mono">
                    <span
                      title={`#${currentStage.index}.1→ ${stagePacket.shortAction}`}
                      className="font-bold min-w-0 leading-snug break-words"
                    >
                      #{currentStage.index}.1→ {stagePacket.shortAction}
                    </span>
                    <span
                      title={`${stagePacket.sourceLabel} → ${stagePacket.targetLabel}`}
                      className="text-rose-100 leading-snug break-words"
                    >
                      {stagePacket.sourceLabel} → {stagePacket.targetLabel}
                    </span>
                  </div>
                  <div className="p-2.5 space-y-1.5">
                    <div
                      title={stagePacket.info}
                      className="text-[11px] font-mono text-amber-300 leading-snug break-words"
                    >
                      {stagePacket.info}
                    </div>
                    <div className="pt-1 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 min-w-0 text-[9.5px] font-mono text-zinc-400">
                      <span
                        title={`PACKET ${currentStage.index} OF ${scenario.stages.length} · ${stagePacket.protocolOrEventId}`}
                        className="min-w-0 leading-snug"
                      >
                        PACKET {currentStage.index} OF {scenario.stages.length}{' '}
                        · {stagePacket.protocolOrEventId}
                      </span>
                      <span
                        title={`⇠#${currentStage.index}.2 ${stagePacket.sizeOrCode}`}
                        className="text-emerald-400 shrink-0 leading-snug"
                      >
                        ⇠#{currentStage.index}.2 {stagePacket.sizeOrCode}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

              {/* MITRE ATT&CK Coverage Bar Chart (Recharts) */}
              <MitreStats
                scenario={scenario}
                activeStageIndex={activeStageIndex}
                onSelectStage={onSelectStage}
              />

              {/* Real-World Threat Intelligence with Gemini Search Grounding */}
              <ThreatIntelCard scenario={scenario} />

              <div className="h-px bg-zinc-200/70 dark:bg-zinc-800/80" />

              {/* Technical Specifications or Stage Timeline */}
              {currentStage ? (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Technical Specifications
                  </h4>
                  <dl className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                    {currentStage.keySpecs.map((spec, idx) => (
                      <div
                        key={idx}
                        className="py-2 flex flex-col gap-0.5 min-w-0"
                      >
                        <dt
                          title={spec.term}
                          className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words"
                        >
                          {spec.term}
                        </dt>
                        <dd
                          title={spec.value}
                          className="font-mono text-[11.5px] text-zinc-900 dark:text-zinc-100 break-words"
                        >
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
                      Scenario Briefing & Attack Chain Stages
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                      {scenario.stages.length}
                    </span>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
                    {/* Step 0: Scenario Briefing right at the start of the stages list */}
                    <button
                      type="button"
                      data-testid="overview-stage-briefing-btn"
                      onClick={() => setPanelMode('STEP_GUIDE')}
                      className="w-full py-2.5 flex flex-col gap-0.5 bg-amber-50/50 hover:bg-amber-100/60 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 rounded-lg px-2 -mx-2 transition-colors cursor-pointer text-left min-w-0"
                    >
                      <div className="flex items-start justify-between gap-2 w-full min-w-0">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 min-w-0 leading-snug break-words">
                          <Sparkles className="w-3 h-3 shrink-0" />
                          <span>0. Scenario Briefing (Full Topology Survey)</span>
                        </span>
                        <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 shrink-0">
                          BRIEFING
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug break-words w-full">
                        {scenario.shortSubtitle}
                      </p>
                    </button>

                    {scenario.stages.map((st) => (
                      <button
                        key={st.index}
                        type="button"
                        onClick={() => onSelectStage?.(st.index)}
                        title={`${st.index}. ${st.title} (${st.mitreTechniqueId}) — ${st.subtitle}`}
                        className="w-full py-2.5 flex flex-col gap-0.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer text-left min-w-0"
                      >
                        <div className="flex items-start justify-between gap-2 w-full min-w-0">
                          <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 min-w-0 leading-snug break-words">
                            {st.index}. {st.title}
                          </span>
                          <span className="text-[10.5px] font-mono text-zinc-400 shrink-0">
                            {st.mitreTechniqueId}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words w-full">
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
                <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                  <span
                    title="Verified Sources & Legal Notice"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 dark:text-emerald-200 min-w-0 leading-snug"
                  >
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
                    title="Open full citations and legal documentation"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono font-bold cursor-pointer transition-colors shrink-0"
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
          )
        ) : panelMode === 'STEP_GUIDE' ? (
          <StepByStepGuidePanel
            scenario={scenario}
            activeStageIndex={activeStageIndex}
            cinematicPhase={cinematicPhase}
            isPlaying={isPlaying}
            activeEnvironment={activeEnvironment}
            scopeContext={scopeContext}
            onSelectStage={onSelectStage}
            onSelectTelemetry={onSelectTelemetry}
            onSelectInternalSubNode={onSelectInternalSubNode}
            onStartWalkthrough={onStartWalkthrough}
            onTogglePlay={onTogglePlay}
            onResetWalkthrough={onResetWalkthrough}
          />
        ) : panelMode === 'FULL_LOGS' ? (
          <LogInspector
            scenario={scenario}
            activeStageIndex={activeStageIndex}
            selectedTelemetryId={null}
            onSelectTelemetry={onSelectTelemetry}
            onSelectStage={onSelectStage}
            activeEnvironment={activeEnvironment}
            scopeContext={scopeContext}
          />
        ) : (
          <SourcesAndLegalContent
            scenario={scenario}
            compact
            scopeContext={scopeContext}
          />
        )}
      </div>
    </motion.aside>
  );
}
