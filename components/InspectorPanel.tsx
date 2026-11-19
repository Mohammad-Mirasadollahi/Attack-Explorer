'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AttackScenario,
  AttackStage,
  TelemetryEvent,
} from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import { CinematicPhase } from '@/lib/cinematic-camera-director';
import {
  buildInspectorMiniMapModel,
  InspectorScopeContext,
  InspectorScopeMode,
  isSeparatedStepsAndSequenceScenario,
  resolveInspectorScopeContext,
  resolveScopedMemoryForensics,
} from '@/lib/inspector-scope';
import { ThreatIntelCard } from './ThreatIntelCard';
import { LogInspector } from './LogInspector';
import { SelectedTelemetryDetail } from './SelectedTelemetryDetail';
import { StepByStepGuidePanel } from './StepByStepGuidePanel';
import { InspectorContextMiniMap } from './InspectorContextMiniMap';
import { SketchNodeIcon } from './SketchNodeIcons';
import { ProcessMemoryView } from './canvas/ProcessMemoryView';
import { buildStepStructuralBreakdown } from '@/lib/documentation-structural-diagrams';
import {
  getRawScenarioStepGuide,
  parseStructuredExplanationClauses,
} from '@/lib/scenario-step-guides';
import { buildStageCommandBreakdowns } from '@/lib/command-line-explanations';
import { CommandBreakdownList } from './CommandBreakdownList';
import { StandardStoryTechnicalSection } from './StandardStoryTechnicalSection';
import {
  getSection3DDescriptor,
  hasSection3DScene,
  stepNumberToSectionKey,
} from '@/lib/section-3d-registry';
import {
  getScenarioAttribution,
  LEGAL_COMPLIANCE_STATEMENT,
} from '@/lib/attack-sources-and-legal';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Cpu,
  ExternalLink,
  Layers,
  ListChecks,
  Maximize2,
  Network,
  Play,
  Scale,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';


export type InspectorTab =
  | 'OVERVIEW'
  | 'STEP_GUIDE'
  | 'SEQUENCE'
  | 'MEMORY'
  | 'SIEM_LOGS'
  | 'SOURCES';

interface InspectorPanelProps {
  scenario: AttackScenario;
  currentStage: AttackStage | null;
  cinematicPhase?: CinematicPhase | null;
  isPlaying?: boolean;
  activeEnvironment?: ActiveEnvironmentId;
  selectedTelemetry: TelemetryEvent | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  onSelectStage: (stageIndex: number) => void;
  onStartWalkthrough?: () => void;
  onTogglePlay?: () => void;
  onResetWalkthrough?: () => void;
  onClearTelemetrySelection: () => void;
  onOpenSourcesModal: () => void;
  /** Hierarchical scope context resolved from diagram state */
  scopeContext?: InspectorScopeContext;
  onSelectNode?: (nodeId: string | null) => void;
  onExpandedNodeChange?: (nodeId: string | null) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  /** Controlled active tab for persistence across reloads */
  activeTab?: InspectorTab;
  onTabChange?: (tab: InspectorTab) => void;
  /** Close full-screen inspector page and return to the active diagram */
  onCloseInspectorPage?: () => void;
  /** Controlled visibility of the left navigation panel via the single main top-header button */
  sidebarOpen?: boolean;
}

export interface FloatingHoverInspectorTriggerProps {
  scenario: AttackScenario;
  currentStage: AttackStage | null;
  scopeContext: InspectorScopeContext;
  selectedTelemetry: TelemetryEvent | null;
  onOpenInspectorPage: () => void;
}

/**
 * Floating Hover Inspector Option rendered on the active diagram/workbench page.
 * - Shows a compact floating pill in its resting state.
 * - Expands smoothly on hover (`onMouseEnter`) up to a bounded viewport height
 *   with an internal vertical scrollbar for long descriptions so the bottom
 *   action button ("Open Main Scenario Page" / "Open Dedicated Section Page")
 *   is always visible.
 * - Never renders a redundant "Main Page" button on the hover card (users return
 *   to the main topology via the diagram's Back button).
 */
export function FloatingHoverInspectorTrigger({
  scenario,
  currentStage,
  scopeContext,
  selectedTelemetry,
  onOpenInspectorPage,
}: FloatingHoverInspectorTriggerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const activeStageIndex = currentStage ? currentStage.index : 0;
  const activeTargetNode =
    scopeContext.diagramScope === 'INTERNAL_SUBNODE' &&
    (scopeContext.selectedSubNode || scopeContext.focusedInternalSubNode)
      ? scopeContext.selectedSubNode || scopeContext.focusedInternalSubNode
      : scopeContext.diagramScope === 'EXPANDED_NODE' &&
        scopeContext.expandedParentNode
      ? scopeContext.expandedParentNode
      : null;

  const targetTypeBadge = selectedTelemetry
    ? `PACKET · ${selectedTelemetry.protocolOrEventId}`
    : scopeContext.diagramScope === 'INTERNAL_SUBNODE' &&
      (scopeContext.selectedSubNode || scopeContext.focusedInternalSubNode)
    ? `SUB-NODE · #${
        (scopeContext.selectedSubNode || scopeContext.focusedInternalSubNode)!
          .chainOrder
      }`
    : scopeContext.diagramScope === 'EXPANDED_NODE' &&
      scopeContext.expandedParentNode
    ? `PIPELINE · #${scopeContext.expandedParentNode.chainOrder}`
    : activeStageIndex > 0
    ? `STAGE S${activeStageIndex} · ${scenario.code}`
    : `SCENARIO · ${scenario.code}`;

  const targetHeadline = selectedTelemetry
    ? `${selectedTelemetry.sourceLabel || selectedTelemetry.sourceNodeId} → ${selectedTelemetry.targetLabel || selectedTelemetry.targetNodeId}`
    : activeTargetNode
    ? activeTargetNode.label
    : currentStage
    ? `Stage ${currentStage.index}: ${currentStage.title}`
    : scenario.name;

  const targetSummary = selectedTelemetry
    ? selectedTelemetry.info
    : activeTargetNode
    ? activeTargetNode.activitySummary ||
      activeTargetNode.internalSummary ||
      scopeContext.scopedStoryAnalogy
    : currentStage
    ? currentStage.description
    : scenario.overview;

  const activeZoneLabel =
    scopeContext.selectedSubNodeZone?.title ||
    scopeContext.focusedInternalSubNodeZone?.title ||
    scopeContext.expandedParentNodeZone?.title ||
    activeTargetNode?.zoneLabel ||
    'Full Attack Topology';

  return (
    <div
      data-testid="floating-hover-inspector-trigger"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      className="fixed top-14 right-3.5 z-50 flex flex-col items-end pointer-events-auto"
    >
      {/* Compact Hover Trigger Pill */}
      <motion.button
        type="button"
        data-testid="open-full-inspector-page-btn"
        onClick={onOpenInspectorPage}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-lg backdrop-blur-md transition-all cursor-pointer ${
          activeTargetNode || selectedTelemetry
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/80 shadow-indigo-500/25'
            : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 border-zinc-700/80 dark:border-zinc-300'
        }`}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              activeTargetNode || selectedTelemetry
                ? 'bg-amber-300'
                : 'bg-indigo-400 dark:bg-indigo-600'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              activeTargetNode || selectedTelemetry
                ? 'bg-amber-300'
                : 'bg-indigo-400 dark:bg-indigo-600'
            }`}
          />
        </span>

        <BookOpen className="w-3.5 h-3.5 shrink-0" />

        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/20 dark:bg-black/15">
          {targetTypeBadge}
        </span>

        <span className="text-[11px] font-bold leading-snug break-words">
          {targetHeadline}
        </span>

        <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
      </motion.button>

      {/* Expandable Hover Preview Card (Bounded Height + Scrollable Summary + Pinned Footer CTA) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            data-testid="floating-hover-inspector-preview-card"
            className="mt-2 w-80 sm:w-96 max-h-[min(60vh,380px)] rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-3.5 text-left flex flex-col gap-2.5 overflow-hidden z-50"
          >
            <div className="shrink-0 flex items-start justify-between gap-2.5 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {activeTargetNode && (
                  <div className="w-11 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center shrink-0 p-1">
                    <SketchNodeIcon
                      iconType={activeTargetNode.iconType}
                      isActive={activeTargetNode.isActive}
                      isCompromised={activeTargetNode.isCompromised}
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {activeTargetNode || selectedTelemetry
                      ? `EXPANDED SECTION · ${activeZoneLabel}`
                      : `SCENARIO INSPECTOR · ${scenario.stages.length} STAGES`}
                  </div>
                  <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-snug break-words">
                    {targetHeadline}
                  </div>
                  {activeTargetNode && (
                    <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      {activeTargetNode.sublabel} · {activeTargetNode.actionBadge}
                    </div>
                  )}
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[9px] font-bold shrink-0">
                FULL PAGE
              </span>
            </div>

            <div
              data-testid="hover-card-scrollable-summary"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 min-h-0 max-h-[min(34vh,210px)] overflow-y-auto overscroll-contain pr-1.5 space-y-2"
            >
              {!activeTargetNode && !selectedTelemetry && scenario.stages.length > 0 && (
                <div
                  data-testid="hover-card-main-stages-list"
                  className="pb-2 border-b border-zinc-100 dark:border-zinc-800 space-y-1"
                >
                  <div className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Attack Stages ({scenario.stages.length})
                  </div>
                  {scenario.stages.map((st) => (
                    <div
                      key={st.index}
                      className={`flex items-start gap-1.5 text-[10.5px] leading-snug rounded px-1.5 py-0.5 ${
                        activeStageIndex === st.index
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span className="font-mono font-bold text-[9.5px] text-indigo-600 dark:text-indigo-400 shrink-0">
                        S{st.index}
                      </span>
                      <span className="break-words flex-1">{st.title}</span>
                      <span className="font-mono text-[9px] text-zinc-400 shrink-0">
                        {st.mitreTechniqueId}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
                {targetSummary}
              </p>
            </div>

            <div className="shrink-0 flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                data-testid="hover-card-open-dedicated-page-btn"
                onClick={onOpenInspectorPage}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {activeTargetNode || selectedTelemetry
                    ? 'Open Dedicated Section Page'
                    : 'Open Main Scenario Page'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InspectorPanel({
  scenario,
  currentStage,
  cinematicPhase = 'OVERVIEW',
  isPlaying = false,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  selectedTelemetry,
  onSelectTelemetry,
  onSelectStage,
  onStartWalkthrough,
  onTogglePlay,
  onResetWalkthrough,
  onClearTelemetrySelection,
  onOpenSourcesModal,
  scopeContext,
  onSelectNode,
  onExpandedNodeChange,
  onSelectInternalSubNode,
  activeTab: controlledActiveTab,
  onTabChange,
  onCloseInspectorPage,
  sidebarOpen = true,
}: InspectorPanelProps) {
  const [internalActiveTab, setInternalActiveTab] =
    useState<InspectorTab>('OVERVIEW');

  const rawActiveTab = controlledActiveTab ?? internalActiveTab;
  const handleSelectTab = (nextTab: InspectorTab) => {
    setInternalActiveTab(nextTab);
    onTabChange?.(nextTab);
  };

  const envProfile = getActiveEnvironmentProfile(activeEnvironment);
  const sourcesProfile = getScenarioAttribution(scenario);
  const activeStageIndex = currentStage ? currentStage.index : 0;

  const effectiveScope: InspectorScopeMode =
    scopeContext?.effectiveScope || 'MAIN_SCENARIO';

  const effectiveScopeContext = useMemo<InspectorScopeContext>(() => {
    const base =
      scopeContext ||
      resolveInspectorScopeContext({
        scenario,
        activeStageIndex,
        activeEnvironment,
        selectedNodeId: null,
        expandedNodeId: null,
        selectedInternalSubNodeId: null,
      });
    // When on the Main Topology Diagram (MAIN_SCENARIO), always present the full Main Scenario
    // and all its stages rather than locking onto a single unexpanded node section.
    if (base.effectiveScope === 'MAIN_SCENARIO' && base.selectedMainNode) {
      return resolveInspectorScopeContext({
        scenario,
        activeStageIndex,
        activeEnvironment,
        selectedNodeId: null,
        expandedNodeId: null,
        selectedInternalSubNodeId: null,
      });
    }
    return base;
  }, [scopeContext, scenario, activeStageIndex, activeEnvironment]);

  const scopedMemory = useMemo(
    () =>
      resolveScopedMemoryForensics(effectiveScopeContext, selectedTelemetry),
    [effectiveScopeContext, selectedTelemetry]
  );

  const isStreamlinedStepGuideScenario = isSeparatedStepsAndSequenceScenario(
    scenario.id
  );

  const resolvedActiveTab: InspectorTab =
    rawActiveTab === 'MEMORY' && !scopedMemory.hasDocumentedMemory
      ? 'OVERVIEW'
      : rawActiveTab === 'SEQUENCE'
      ? 'STEP_GUIDE'
      : rawActiveTab;

  const isInspectingSpecificMainNode = Boolean(
    effectiveScope === 'MAIN_SCENARIO' &&
      effectiveScopeContext.selectedMainNode
  );

  // Build miniature topological context map model for top-left of the page
  const miniMapModel = useMemo(() => {
    return buildInspectorMiniMapModel(
      effectiveScopeContext,
      selectedTelemetry,
      activeStageIndex,
      scenario.stages.length
    );
  }, [
    effectiveScopeContext,
    selectedTelemetry,
    activeStageIndex,
    scenario.stages.length,
  ]);

  const activeInspectNode =
    effectiveScopeContext.effectiveScope === 'INTERNAL_SUBNODE' &&
    effectiveScopeContext.focusedInternalSubNode
      ? effectiveScopeContext.focusedInternalSubNode
      : effectiveScopeContext.effectiveScope === 'EXPANDED_NODE' &&
        effectiveScopeContext.expandedParentNode
      ? effectiveScopeContext.expandedParentNode
      : null;

  const activeInspectZone =
    effectiveScopeContext.effectiveScope !== 'MAIN_SCENARIO'
      ? effectiveScopeContext.focusedInternalSubNodeZone ||
        effectiveScopeContext.expandedParentNodeZone
      : null;

  const pageTitle = selectedTelemetry
    ? `Packet Telemetry: ${selectedTelemetry.protocolOrEventId} (${selectedTelemetry.sourceLabel || selectedTelemetry.sourceNodeId} → ${selectedTelemetry.targetLabel || selectedTelemetry.targetNodeId})`
    : activeInspectNode
    ? `${activeInspectNode.label} (${activeInspectNode.sublabel})`
    : currentStage
    ? `Stage ${currentStage.index}: ${currentStage.title}`
    : scenario.name;

  const visibleTabs = useMemo(() => {
    const stepCount =
      effectiveScope !== 'MAIN_SCENARIO' && effectiveScopeContext.internalSteps
        ? effectiveScopeContext.internalSteps.length
        : scenario.stages.length;

    const tabs: Array<{
      id: InspectorTab;
      label: string;
      testId: string;
      icon: React.ReactNode;
    }> = [
      {
        id: 'OVERVIEW',
        label: 'Overview & Deep-Dive',
        testId: 'inspector-tab-overview',
        icon: <BookOpen className="w-3.5 h-3.5 shrink-0" />,
      },
      {
        id: 'STEP_GUIDE',
        label: isStreamlinedStepGuideScenario
          ? `Step-by-Step Guide (${stepCount})`
          : `Steps & Sequence (${stepCount})`,
        testId: 'inspector-tab-steps',
        icon: <ListChecks className="w-3.5 h-3.5 shrink-0" />,
      },
    ];

    if (scopedMemory.hasDocumentedMemory) {
      tabs.push({
        id: 'MEMORY',
        label: `Memory (${scopedMemory.memoryBlocks.length})`,
        testId: 'inspector-tab-memory',
        icon: <Cpu className="w-3.5 h-3.5 shrink-0" />,
      });
    }

    tabs.push(
      {
        id: 'SIEM_LOGS',
        label: `SIEM Logs (${
          effectiveScopeContext.scopedTelemetryEvents.length ||
          scenario.telemetry.length
        })`,
        testId: 'inspector-tab-logs',
        icon: <Terminal className="w-3.5 h-3.5 shrink-0" />,
      },
      {
        id: 'SOURCES',
        label: 'Sources & Intel',
        testId: 'inspector-tab-sources',
        icon: <Scale className="w-3.5 h-3.5 shrink-0" />,
      }
    );

    return tabs;
  }, [
    effectiveScope,
    effectiveScopeContext.internalSteps,
    isStreamlinedStepGuideScenario,
    scenario.stages.length,
    scenario.telemetry.length,
    effectiveScopeContext.scopedTelemetryEvents.length,
    scopedMemory.hasDocumentedMemory,
    scopedMemory.memoryBlocks.length,
  ]);

  return (
    <aside
      dir="ltr"
      aria-label="Full-Screen Forensic Inspector Page"
      data-testid="inspector-full-page"
      data-inspector-scope={effectiveScope}
      className="flex-1 w-full h-full min-h-0 bg-[#F4F4F5]/90 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 flex flex-row overflow-hidden"
    >
      {/* Dedicated Left Navigation Panel (Controlled by Single Main Header Collapse Button) */}
      {sidebarOpen && (
        <nav
          aria-label="Inspector Navigation Sidebar"
          data-testid="inspector-left-nav-sidebar"
          className="shrink-0 w-[232px] sm:w-[244px] h-full p-3 bg-white/95 dark:bg-zinc-950/95 border-r border-zinc-200/90 dark:border-zinc-800/90 backdrop-blur-md flex flex-col justify-between transition-all duration-200 z-20"
        >
          <div className="flex flex-col gap-3 min-h-0 overflow-y-auto workbench-scrollbar">
            {/* Top Action Row: Back to Diagram (No Logo, No Duplicate Collapse Button) */}
            {onCloseInspectorPage && (
              <button
                type="button"
                data-testid="inspector-back-to-diagram-btn"
                title="Back to Diagram"
                onClick={onCloseInspectorPage}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span>Back to Diagram</span>
              </button>
            )}

            <div className="h-px w-full bg-zinc-200/80 dark:bg-zinc-800/80" />

            {/* Primary Full-Page View Tabs */}
            <div
              role="tablist"
              aria-label="Inspector View Tabs"
              className="flex flex-col gap-1"
            >
              <span className="px-2 pb-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                INSPECTOR VIEWS
              </span>
              {visibleTabs.map((tab) => {
                const isSelected = resolvedActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    data-testid={tab.testId}
                    aria-selected={isSelected}
                    aria-label={tab.label}
                    title={tab.label}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-left rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-2xs border border-indigo-200/80 dark:border-indigo-800/80'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 border border-transparent'
                    }`}
                  >
                    {tab.icon}
                    <span className="leading-snug break-words">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Full-Screen Scrollable Unified Single-Column Documentation Body */}
      <div className="flex-1 min-w-0 min-h-0 overflow-y-auto workbench-scrollbar transition-all duration-200">
        <div
          data-testid="inspector-unified-single-column-layout"
          className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-5"
        >
          {/* 1. Unified Stage Filter Strip */}
          <section
            data-testid="inspector-main-scenario-stage-card"
            className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mr-1">
                STAGE FILTER ({scenario.stages.length} STAGES):
              </span>
              <button
                type="button"
                data-testid="inspector-stage-pill-overview"
                onClick={() => onSelectStage(0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  activeStageIndex === 0
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                All Stages (Overview)
              </button>
              {scenario.stages.map((st) => (
                <button
                  key={`stage-pill-${st.index}`}
                  type="button"
                  data-testid={`inspector-stage-pill-${st.index}`}
                  onClick={() => onSelectStage(st.index)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    activeStageIndex === st.index
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  S{st.index} · {st.mitreTechniqueId}
                </button>
              ))}
            </div>

            {activeInspectNode &&
              !scopeContext?.isInsideSubBoard &&
              scopeContext?.selectedMainNode &&
              onExpandedNodeChange && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-testid="inspector-open-node-subboard-btn"
                    onClick={() => {
                      onExpandedNodeChange(scopeContext.selectedMainNode!.id);
                      onCloseInspectorPage?.();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand Internal Pipeline on Diagram</span>
                  </button>
                </div>
              )}
          </section>

          {/* 2. Selected Packet / Telemetry Deep-Dive Banner (when a flow packet is clicked) */}
          {selectedTelemetry && (
            <div className="rounded-2xl overflow-hidden border border-rose-300 dark:border-rose-800/80 shadow-sm">
              <SelectedTelemetryDetail
                selectedTelemetry={selectedTelemetry}
                currentStage={currentStage}
                onClearTelemetrySelection={onClearTelemetrySelection}
                activeEnvironment={activeEnvironment}
                scopeBadgeText={scopeContext?.scopeBadgeText}
                effectiveScope={effectiveScope}
              />
            </div>
          )}

          {/* 3. Merged Focused Section Technical Identity & Forensic Specs Banner (Shown ONLY on Overview page when inspecting a specific node) */}
          {resolvedActiveTab === 'OVERVIEW' && activeInspectNode && (
            <section
              data-testid="inspector-section-identity-card"
              className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-4 sm:p-5 shadow-sm flex flex-col gap-3.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-16 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1.5 shrink-0">
                    <SketchNodeIcon
                      iconType={activeInspectNode.iconType}
                      isActive={activeInspectNode.isActive}
                      isCompromised={activeInspectNode.isCompromised}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px] font-bold">
                        #{activeInspectNode.sequenceCode || activeInspectNode.chainOrder}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] font-bold">
                        {activeInspectNode.actionBadge}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[9.5px] font-bold ${
                          activeInspectNode.isCompromised
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {activeInspectNode.isCompromised
                          ? 'COMPROMISED'
                          : 'ACTIVE TELEMETRY'}
                      </span>
                    </div>
                    <h2 className="mt-1 text-base font-extrabold text-zinc-950 dark:text-white leading-snug break-words">
                      {activeInspectNode.label}
                    </h2>
                    <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 break-words">
                      {activeInspectNode.sublabel}
                    </div>
                  </div>
                </div>

                {/* Forensic Artifacts List */}
                {activeInspectNode.originalNode?.details?.artifacts &&
                  activeInspectNode.originalNode.details.artifacts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {activeInspectNode.originalNode.details.artifacts.map(
                        (art, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-lg bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/70 font-mono text-[10.5px] break-all"
                          >
                            {art}
                          </span>
                        )
                      )}
                    </div>
                  )}
              </div>

              {/* Technical Specs 4-Column Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/70 dark:border-zinc-800/80 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase">
                    ZONE LOCATION
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 break-words">
                    {activeInspectZone
                      ? `${activeInspectZone.code} · ${activeInspectZone.title}`
                      : activeInspectNode.zoneLabel || activeInspectNode.zoneId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase">
                    ENDPOINT / PORT / PID
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 break-words">
                    {activeInspectNode.originalNode?.details?.pidOrPort ||
                      activeInspectNode.sublabel}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase">
                    OS / SUBSYSTEM TYPE
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 break-words">
                    {activeInspectNode.originalNode?.details?.osOrType ||
                      envProfile.badgeLabel}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase">
                    PRIVILEGE CONTEXT
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 break-words">
                    {activeInspectNode.originalNode?.details?.privilege ||
                      'Standard / System Context'}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* =====================================================================
              TAB 1: OVERVIEW & DEEP-DIVE (Merged Executive Story + Structural Diagrams + Stages)
              ===================================================================== */}
          {resolvedActiveTab === 'OVERVIEW' && (
            <div className="flex flex-col gap-5">
              {/* Dedicated Overview Scenario / Section Title & Scope Card */}
              <section
                data-testid="inspector-overview-title-card"
                className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 px-5 py-4 shadow-sm flex flex-col gap-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    data-testid="inspector-scope-badge"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 font-mono text-[10.5px] font-bold"
                  >
                    <Layers className="w-3 h-3 shrink-0" />
                    <span>
                      {effectiveScopeContext.scopeBadgeLabel ||
                        `SCENARIO · ${scenario.code}`}
                    </span>
                  </span>

                  <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[10.5px] font-semibold">
                    {activeStageIndex > 0
                      ? `Stage S${activeStageIndex} of ${scenario.stages.length}`
                      : `All ${scenario.stages.length} Stages`}
                  </span>
                </div>

                <h2
                  data-testid="inspector-scope-title"
                  className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white leading-snug break-words"
                >
                  {pageTitle}
                </h2>
              </section>
              {/* Context-Aware Documented Virtual Memory Forensics Callout */}
              {scopedMemory.hasDocumentedMemory && (
                <section
                  data-testid="inspector-overview-memory-callout"
                  className="rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 p-4 shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                        <Cpu className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          DOCUMENTED VIRTUAL MEMORY FORENSICS IN THIS SECTION (
                          {scopedMemory.memoryBlocks.length} VAD REGIONS ·{' '}
                          {scopedMemory.memoryStepTimeline.length} MEMORY STEPS)
                        </span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                        {scopedMemory.scopeExplanation}
                      </p>
                    </div>
                    <button
                      type="button"
                      data-testid="inspector-overview-open-memory-btn"
                      onClick={() => handleSelectTab('MEMORY')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Open Memory Forensics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                    {scopedMemory.memoryBlocks.map((mb, idx) => (
                      <div
                        key={`${mb.address}-${idx}`}
                        className="p-2.5 rounded-xl bg-white/95 dark:bg-zinc-900/90 border border-rose-200/80 dark:border-rose-800/70 space-y-1 text-[11px] font-mono"
                      >
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9.5px] font-extrabold">
                            STEP #{mb.stepCode} · S{mb.stageIndex}
                          </span>
                          <span className="font-bold text-indigo-700 dark:text-indigo-300">
                            {mb.address} · {mb.section} ({mb.permissions} ·{' '}
                            {mb.size})
                          </span>
                        </div>
                        <div className="text-[10.5px] text-amber-900 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/30 px-2 py-1 rounded border border-amber-200/70 dark:border-amber-800/50 leading-snug break-words">
                          <strong className="text-amber-700 dark:text-amber-400">
                            WHY:
                          </strong>{' '}
                          {mb.permissionsWhyNote}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Merged Page-Native Structural Architecture Blueprint & Cascading Process Waterfall */}
              {miniMapModel && (
                <InspectorContextMiniMap
                  miniMap={miniMapModel}
                  scopeContext={effectiveScopeContext}
                  selectedTelemetry={selectedTelemetry}
                  filterStageIndex={activeStageIndex > 0 ? activeStageIndex : null}
                  onSelectNode={(nodeId) => {
                    onClearTelemetrySelection();
                    onExpandedNodeChange?.(nodeId);
                    onSelectNode?.(nodeId);
                  }}
                  onSelectInternalSubNode={(subNodeId) => {
                    onClearTelemetrySelection();
                    onSelectInternalSubNode?.(subNodeId);
                  }}
                  onSelectTelemetry={(ev) => {
                    onSelectTelemetry(ev);
                  }}
                  onReturnToDiagram={() => onCloseInspectorPage?.()}
                />
              )}

              {/* CASE A: Clicked Main Topology Node Dedicated Page (`selectedMainNode`) */}
              {isInspectingSpecificMainNode && scopeContext?.selectedMainNode ? (
                <div
                  data-testid="inspector-selected-main-node-view"
                  className="flex flex-col gap-5"
                >
                  {/* 1. Executive Story-to-Spec Analogy & Section Explanation */}
                  <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-4 h-4" />
                        <span>
                          Complete Section Explanation · Node #
                          {scopeContext.selectedMainNode.chainOrder}
                        </span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
                        {scopeContext.selectedMainNode.actionBadge}
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white leading-snug">
                      {scopeContext.selectedMainNode.label} —{' '}
                      {scopeContext.selectedMainNode.sublabel}
                    </h2>

                    {scopeContext.selectedMainNode.hostContext && (
                      <div className="px-3 py-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/70 text-xs font-mono text-sky-900 dark:text-sky-200">
                        {scopeContext.selectedMainNode.hostContext}
                      </div>
                    )}

                    {scopeContext.selectedMainNodeStoryAnalogy && (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/60 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span>Plain-English Story-to-Spec Analogy</span>
                        </div>
                        <p className="text-xs sm:text-[13px] leading-relaxed">
                          {scopeContext.selectedMainNodeStoryAnalogy}
                        </p>
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Technical Forensic Role
                      </div>
                      <p
                        data-testid="inspector-scoped-story-analogy"
                        className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed"
                      >
                        {scopeContext.selectedMainNode.activitySummary ||
                          scopeContext.selectedMainNode.internalSummary}
                      </p>
                    </div>
                  </section>

                  {/* 2. Connected Inbound & Outbound Telemetry Arms */}
                  <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                        <Network className="w-4 h-4 text-rose-500" />
                        <span>
                          Connected Network & Process Links (
                          {scopeContext.selectedMainNodeConnectedFlows.length})
                        </span>
                      </h3>
                      <span className="text-[11px] font-mono text-zinc-500">
                        Click any link to inspect raw packet telemetry
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {scopeContext.selectedMainNodeConnectedFlows.map((fl) => {
                        const isOutbound =
                          fl.fromNodeId === scopeContext.selectedMainNode?.id;
                        const isSelected =
                          selectedTelemetry?.id === fl.telemetryEvent.id;
                        return (
                          <div
                            key={fl.id}
                            data-testid={`inspector-connected-flow-card-${fl.stepNo}`}
                            onClick={() => onSelectTelemetry(fl.telemetryEvent)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                              isSelected
                                ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/30'
                                : 'bg-zinc-50/70 dark:bg-zinc-950/50 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-extrabold text-white ${
                                    isOutbound ? 'bg-rose-600' : 'bg-amber-600'
                                  }`}
                                >
                                  STEP #{fl.stepNo} ·{' '}
                                  {isOutbound ? 'OUTBOUND' : 'INBOUND'}
                                </span>
                                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                  {fl.label}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 font-mono text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                                {fl.protocolBadge &&
                                fl.protocolBadge !==
                                  fl.telemetryEvent.protocolOrEventId
                                  ? `${fl.telemetryEvent.protocolOrEventId} · ${fl.protocolBadge}`
                                  : fl.telemetryEvent.protocolOrEventId}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                              {fl.telemetryEvent.info}
                            </p>

                            {fl.telemetryEvent.detectionRule && (
                              <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  Detection Rule ({fl.telemetryEvent.detectionRule.type}
                                  ): {fl.telemetryEvent.detectionRule.title}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* 3. Internal Pipeline Sub-Nodes & Operations Inside This Node */}
                  {scopeContext.selectedMainNodeSubBoard && (
                    <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            <span>
                              Internal Architecture & Sub-Components (
                              {
                                scopeContext.selectedMainNodeSubBoard.subNodes
                                  .length
                              }{' '}
                              Sub-Nodes)
                            </span>
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {
                              scopeContext.selectedMainNodeSubBoard
                                .environmentBreadcrumb
                            }
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {scopeContext.selectedMainNodeSubBoard.subNodes.map(
                          (subNode) => (
                            <div
                              key={subNode.id}
                              className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                                  #{subNode.chainOrder} · {subNode.actionBadge}
                                </span>
                                <span className="text-[10px] font-mono text-zinc-500">
                                  {subNode.sublabel}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-zinc-900 dark:text-white">
                                {subNode.label}
                              </div>
                              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                {subNode.internalSummary}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  )}
                </div>
              ) : effectiveScope !== 'MAIN_SCENARIO' &&
                scopeContext?.internalSubBoard &&
                scopeContext?.expandedParentNode ? (
                /* CASE B: Expanded Sub-Board (`EXPANDED_NODE`) or Internal Sub-Node (`INTERNAL_SUBNODE`) */
                <div
                  data-testid={
                    effectiveScope === 'INTERNAL_SUBNODE'
                      ? 'internal-subnode-scoped-overview'
                      : 'expanded-node-scoped-overview'
                  }
                  className="flex flex-col gap-5"
                >
                  <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {scopeContext.scopeBadgeLabel}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">
                        Parent Host/Process: {scopeContext.expandedParentNode.label}
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white">
                      {scopeContext.scopeTitle}
                    </h2>
                    <p
                      data-testid="inspector-scoped-story-analogy"
                      className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed"
                    >
                      {scopeContext.scopedStoryAnalogy}
                    </p>
                  </section>

                  {/* Internal Sub-Nodes Switcher Grid */}
                  <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Internal Pipeline Sub-Nodes (
                      {scopeContext.internalSubBoard.subNodes.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {scopeContext.internalSubBoard.subNodes.map((sn) => {
                        const isFocused =
                          scopeContext.focusedInternalSubNode?.id === sn.id;
                        return (
                          <button
                            key={sn.id}
                            type="button"
                            data-testid={`inspector-subnode-card-${sn.id}`}
                            onClick={() => onSelectInternalSubNode?.(sn.id)}
                            className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                              isFocused
                                ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500/30'
                                : 'bg-zinc-50/80 dark:bg-zinc-950/60 border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px] font-bold">
                                #{sn.chainOrder} · {sn.actionBadge}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">
                                {sn.sublabel}
                              </span>
                            </div>
                            <div className="mt-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                              {sn.label}
                            </div>
                            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                              {sn.internalSummary}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Scoped Internal Step-by-Step Operations */}
                  <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Internal Telemetry Steps (
                      {scopeContext.internalSteps.length})
                    </h3>
                    <div className="space-y-2.5">
                      {scopeContext.internalSteps.map((st) => (
                        <div
                          key={st.flow.id}
                          onClick={() => onSelectTelemetry(st.telemetryEvent)}
                          className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400 transition-colors cursor-pointer space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              #{st.sequenceCode} · {st.title}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 font-mono text-[10px]">
                              {st.fromSubNode?.label || st.flow.fromNodeId} →{' '}
                              {st.toSubNode?.label || st.flow.toNodeId}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {st.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : (
                /* CASE C: Full Main Scenario Page Explanation (`MAIN_SCENARIO`) */
                (() => {
                  const mainScenarioOverviewContent = (
                    <div
                      data-testid="inspector-main-scenario-overview"
                      className="flex flex-col gap-5"
                    >
                      {/* 1. Main Scenario Executive Story-to-Spec Analogy */}
                      <section
                        className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3"
                      >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-4 h-4" />
                        <span>
                          Main Page · Complete Scenario Architecture & Story
                        </span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono text-xs font-bold">
                        {scenario.code}
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white leading-snug">
                      {scenario.name}
                    </h2>

                    {(() => {
                      const rawBriefingGuide = getRawScenarioStepGuide(
                        scenario.id
                      );
                      return (
                        <StandardStoryTechnicalSection
                          scenarioId={scenario.id}
                          sectionKey={
                            hasSection3DScene(scenario.id, 'briefing')
                              ? 'briefing'
                              : null
                          }
                          storyHeading="Story-to-Spec Analogy & Executive Summary"
                          storyAnalogy={
                            rawBriefingGuide?.briefing.storyAnalogy ||
                            effectiveScopeContext.scopedStoryAnalogy ||
                            scenario.overview
                          }
                          technicalHeading="Technical Architecture & Forensic Overview"
                          technicalText={
                            rawBriefingGuide?.briefing.plainSummary ||
                            scenario.overview
                          }
                          clausePrefix="0"
                        />
                      );
                    })()}

                  </section>

                  {/* 2. Interactive Topology Sections Directory */}
                  <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        <span>
                          Diagram Topology Sections (
                          {effectiveScopeContext.schematic.nodes.length} Nodes)
                        </span>
                      </h3>
                      <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                        Click any section to expand its dedicated pipeline page
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {effectiveScopeContext.schematic.nodes.map((node) => (
                        <button
                          key={node.id}
                          type="button"
                          data-testid={`inspector-directory-node-${node.id}`}
                          onClick={() => {
                            onExpandedNodeChange?.(node.id);
                            onSelectNode?.(node.id);
                          }}
                          className="text-left p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-400 transition-all cursor-pointer flex items-start gap-3"
                        >
                          <div className="w-12 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center p-1 shrink-0">
                            <SketchNodeIcon
                              iconType={node.iconType}
                              isActive={node.isActive}
                              isCompromised={node.isCompromised}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9.5px] font-bold">
                                #{node.chainOrder} · {node.actionBadge}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400">
                                {node.zoneLabel || node.zoneId}
                              </span>
                            </div>
                            <div className="mt-1 text-xs font-bold text-zinc-900 dark:text-white leading-snug">
                              {node.label}
                            </div>
                            <p className="mt-0.5 text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-snug">
                              {node.activitySummary || node.internalSummary}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* 3. Complete Chronological Stages Breakdown with Stage-Specific Structural Diagrams */}
                  <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-rose-500" />
                        <span>
                          Chronological Attack Stages & Structural Breakdown (
                          {scenario.stages.length} Stages)
                        </span>
                      </h3>
                      {onStartWalkthrough && (
                        <button
                          type="button"
                          onClick={() => {
                            onStartWalkthrough();
                            onCloseInspectorPage?.();
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          <span>Play Guided Walkthrough on Diagram</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {scenario.stages.map((st) => {
                        const isCurrent = activeStageIndex === st.index;
                        const stageDiagram = buildStepStructuralBreakdown(
                          scenario,
                          st,
                          effectiveScopeContext
                        );
                        return (
                          <div
                            key={`stage-card-${st.index}`}
                            data-testid={`inspector-stage-card-${st.index}`}
                            className={`p-4 sm:p-5 rounded-xl border transition-all space-y-3 ${
                              isCurrent
                                ? 'bg-indigo-50/70 dark:bg-indigo-950/35 border-indigo-500'
                                : 'bg-zinc-50/70 dark:bg-zinc-950/50 border-zinc-200/80 dark:border-zinc-800'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-[10px] font-bold">
                                  STAGE S{st.index}
                                </span>
                                <span className="text-sm font-extrabold text-zinc-950 dark:text-white leading-snug break-words">
                                  {st.title}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono text-[10.5px] font-bold">
                                {st.mitreTechniqueId} · {st.mitreTechniqueName}
                              </span>
                            </div>

                            {(() => {
                              const secKey = stepNumberToSectionKey(st.index);
                              const sec3d = secKey
                                ? getSection3DDescriptor(scenario.id, secKey)
                                : null;
                              const rawGuide = getRawScenarioStepGuide(
                                scenario.id
                              );
                              const stepStory = rawGuide?.steps.find(
                                (s) => s.stepNumber === st.index
                              )?.storyAnalogy;

                              if (secKey && sec3d) {
                                return (
                                  <StandardStoryTechnicalSection
                                    scenarioId={scenario.id}
                                    sectionKey={secKey}
                                    storyHeading={`Story Analogy · Stage S${st.index} (${sec3d.title})`}
                                    storyAnalogy={stepStory || sec3d.storyCue}
                                    technicalHeading={`Technical Forensic Deep-Dive · Stage S${st.index}`}
                                    technicalText={st.description}
                                    clausePrefix={String(st.index)}
                                  />
                                );
                              }

                              return (
                                <div className="space-y-1.5">
                                  {parseStructuredExplanationClauses(
                                    st.description,
                                    String(st.index)
                                  ).map((clause, cIdx) => (
                                    <div
                                      key={`${clause.clauseCode}-${cIdx}`}
                                      className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1"
                                    >
                                      <div className="flex items-start gap-2">
                                        <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9.5px] font-extrabold shrink-0 mt-0.5">
                                          #{clause.clauseCode}
                                        </span>
                                        <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed break-words flex-1">
                                          {clause.fullText.replace(
                                            /\(\s*why\s*:\s*/gi,
                                            '('
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}

                            {/* Stage-Specific Structural Conduit & Process Spawn Diagram */}
                            <div
                              data-testid={`stage-structural-conduit-${st.index}`}
                              className="rounded-xl border border-indigo-200/80 dark:border-indigo-500/30 bg-white dark:bg-zinc-900 p-3 space-y-2.5"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch text-[11px] font-mono">
                                {/* Initiator (Compact 3/12) */}
                                <div className="lg:col-span-3 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 flex flex-col justify-center">
                                  <div className="text-[9.5px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                                    INITIATOR · #{stageDiagram.conduit.initiatorNumber}
                                  </div>
                                  <div className="font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                                    {stageDiagram.conduit.initiatorLabel}
                                  </div>
                                  <div className="text-[10px] text-zinc-500 leading-snug break-words">
                                    {stageDiagram.conduit.initiatorSublabel}
                                  </div>
                                </div>

                                {/* Forward & Return Action Conduit (Wide 6/12 = 50% width for Technical Explanation + Animated SVG Interacting Vectors) */}
                                <div className="lg:col-span-6 p-2.5 rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col justify-center gap-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9.5px] font-extrabold">
                                      {stageDiagram.conduit.forwardArrowCode}
                                    </span>
                                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 leading-snug break-words">
                                      {stageDiagram.conduit.forwardProtocolOrApi}
                                    </span>
                                  </div>
                                  <svg
                                    viewBox="0 0 260 22"
                                    className="w-full h-5 overflow-visible"
                                    aria-hidden="true"
                                  >
                                    <line
                                      x1="4"
                                      y1="6"
                                      x2="250"
                                      y2="6"
                                      stroke="#e11d48"
                                      strokeWidth="2"
                                      strokeDasharray="5 3"
                                    />
                                    <polygon
                                      points="256,6 248,2 248,10"
                                      fill="#e11d48"
                                    />
                                    <motion.circle
                                      cy="6"
                                      r="3.5"
                                      fill="#e11d48"
                                      stroke="#ffffff"
                                      strokeWidth="1.5"
                                      animate={{ cx: [10, 246] }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                      }}
                                    />
                                    <line
                                      x1="256"
                                      y1="16"
                                      x2="10"
                                      y2="16"
                                      stroke="#10b981"
                                      strokeWidth="1.5"
                                      strokeDasharray="4 3"
                                    />
                                    <polygon
                                      points="4,16 12,12 12,20"
                                      fill="#10b981"
                                    />
                                    <motion.circle
                                      cy="16"
                                      r="3"
                                      fill="#10b981"
                                      stroke="#ffffff"
                                      strokeWidth="1.2"
                                      animate={{ cx: [246, 12] }}
                                      transition={{
                                        duration: 2.3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                      }}
                                    />
                                  </svg>
                                  <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                                    {stageDiagram.conduit.forwardActionLabel}
                                  </div>
                                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-snug break-words pt-0.5 border-t border-rose-200/60 dark:border-rose-800/40">
                                    {stageDiagram.conduit.returnArrowCode}:{' '}
                                    {stageDiagram.conduit.returnVerificationLabel}
                                  </div>
                                </div>

                                {/* Target & SIEM Catch (Compact 3/12) */}
                                <div className="lg:col-span-3 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-center">
                                  <div className="text-[9.5px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300">
                                    TARGET · #{stageDiagram.conduit.targetNumber} ──▶ SENSOR
                                  </div>
                                  <div className="font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                                    {stageDiagram.conduit.targetLabel}
                                  </div>
                                  <div className="text-[10px] text-emerald-800 dark:text-emerald-300 leading-snug break-words mt-0.5">
                                    Catch: {stageDiagram.conduit.sensorRuleOrEvent}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Stage CommandLine & Technical Command Breakdown */}
                            <CommandBreakdownList
                              commands={buildStageCommandBreakdowns(
                                scenario,
                                st
                              )}
                              stageNumber={st.index}
                            />

                            {st.keySpecs && st.keySpecs.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {st.keySpecs.map((spec, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-2 py-0.5 rounded bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 text-[10.5px] font-mono text-emerald-900 dark:text-emerald-200 leading-snug break-words"
                                  >
                                    <strong>{spec.term}:</strong> {spec.value}
                                  </span>
                                ))}
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  </section>
                    </div>
                  );

                  return mainScenarioOverviewContent;
                })()
              )}
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP GUIDE */}
          {resolvedActiveTab === 'STEP_GUIDE' && (
            <div className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm">
              <StepByStepGuidePanel
                scenario={scenario}
                activeStageIndex={activeStageIndex}
                cinematicPhase={cinematicPhase}
                isPlaying={isPlaying}
                activeEnvironment={activeEnvironment}
                scopeContext={effectiveScopeContext}
                selectedTelemetryId={selectedTelemetry?.id || null}
                onSelectStage={onSelectStage}
                onSelectTelemetry={onSelectTelemetry}
                onSelectInternalSubNode={onSelectInternalSubNode}
                onStartWalkthrough={onStartWalkthrough}
                onTogglePlay={onTogglePlay}
                onResetWalkthrough={onResetWalkthrough}
              />
            </div>
          )}

          {/* TAB 3: DOCUMENTED VIRTUAL MEMORY FORENSICS (VAD / PE-SIEVE) */}
          {resolvedActiveTab === 'MEMORY' &&
            scopedMemory.hasDocumentedMemory && (
              <div className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 overflow-hidden shadow-sm">
                <ProcessMemoryView
                  scenario={scenario}
                  activeEnvironment={activeEnvironment}
                  scopeContext={effectiveScopeContext}
                  selectedTelemetry={selectedTelemetry}
                />
              </div>
            )}

          {/* TAB 5: SIEM / EDR LOGS */}
          {resolvedActiveTab === 'SIEM_LOGS' && (
            <div className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm">
              <LogInspector
                scenario={scenario}
                activeStageIndex={activeStageIndex}
                selectedTelemetryId={selectedTelemetry?.id || null}
                onSelectTelemetry={onSelectTelemetry}
                onSelectStage={onSelectStage}
                activeEnvironment={activeEnvironment}
                scopeContext={effectiveScopeContext}
              />
            </div>
          )}

          {/* TAB 6: THREAT INTEL & SOURCES */}
          {resolvedActiveTab === 'SOURCES' && (
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm">
                <ThreatIntelCard scenario={scenario} />
              </div>

              <section className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    <span>
                      Verified Analytical Sources (
                      {sourcesProfile.primarySources.length})
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={onOpenSourcesModal}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    <span>Open Legal & Citations Modal</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee}
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
