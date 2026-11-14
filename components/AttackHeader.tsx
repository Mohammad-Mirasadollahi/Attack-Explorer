'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AttackScenario } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  ComputedStageView,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import { WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import { searchAttackGraphNodes } from '@/lib/canvas-interaction-engine';
import { CanvasViewMode } from './DiagramCanvas';
import { AnimeBrandLogo } from './AnimeBrandLogo';
import { SettingsDrawer } from './SettingsDrawer';
import { OperationalGuideIcon } from './OperationalGuideIcon';
import { WorkbenchIconTooltip } from './WorkbenchIconTooltip';
import { WorkbenchLayoutMode } from '@/lib/layout-preference';
import {
  Cloud,
  Cpu,
  Crosshair,
  GitCommitHorizontal,
  Keyboard,
  Laptop,
  Library,
  Network,
  PanelLeft,
  PanelRight,
  Scale,
  Search,
  SearchCode,
  Server,
  Settings,
  Sparkles,
  Table2,
  UserRound,
  X,
} from 'lucide-react';

interface AttackHeaderProps {
  scenario: AttackScenario;
  stageView: ComputedStageView;
  activeEnvironment?: ActiveEnvironmentId;
  onSelectEnvironment?: (env: ActiveEnvironmentId) => void;
  tacticalMode?: boolean;
  onToggleTacticalMode?: () => void;
  showLegend?: boolean;
  onToggleLegend?: () => void;
  viewMode: CanvasViewMode;
  onViewModeChange: (mode: CanvasViewMode) => void;
  onSelectStage: (stageIndex: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  canStepBackward: boolean;
  canStepForward: boolean;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  isDark: boolean;
  onToggleDark: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  inspectorOpen: boolean;
  onToggleInspector: () => void;
  telemetryOpen: boolean;
  onToggleTelemetry: () => void;
  onOpenAttackLibrary: () => void;
  onOpenAnalyzerModal: () => void;
  onOpenSourcesModal?: () => void;
  onOpenAboutModal?: () => void;
  onOpenShortcutsModal?: () => void;
  layoutMode?: WorkbenchLayoutMode;
  onLayoutModeChange?: (mode: WorkbenchLayoutMode) => void;
  onReplayIntro?: () => void;
  nodeSearchQuery?: string;
  onNodeSearchQueryChange?: (query: string) => void;
  graphNodes?: WhiteboardSketchNode[];
  onFocusGraphNode?: (nodeId: string) => void;
  onTriggerAutoLayout?: () => void;
  isAutoLayoutActive?: boolean;
}

export function AttackHeader({
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  onSelectEnvironment,
  tacticalMode = false,
  onToggleTacticalMode,
  showLegend = true,
  onToggleLegend,
  viewMode,
  onViewModeChange,
  playbackSpeed,
  onSpeedChange,
  isDark,
  onToggleDark,
  sidebarOpen,
  onToggleSidebar,
  inspectorOpen,
  onToggleInspector,
  telemetryOpen,
  onToggleTelemetry,
  onOpenAttackLibrary,
  onOpenAnalyzerModal,
  onOpenSourcesModal,
  onOpenAboutModal,
  onOpenShortcutsModal,
  layoutMode = 'RESPONSIVE',
  onLayoutModeChange,
  onReplayIntro,
  nodeSearchQuery = '',
  onNodeSearchQueryChange,
  graphNodes = [],
  onFocusGraphNode,
  onTriggerAutoLayout,
  isAutoLayoutActive = false,
}: AttackHeaderProps) {
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const currentEnvProfile = getActiveEnvironmentProfile(activeEnvironment);

  const searchResult = useMemo(
    () => searchAttackGraphNodes(graphNodes, nodeSearchQuery),
    [graphNodes, nodeSearchQuery]
  );

  // Close search dropdown when clicking outside
  useEffect(() => {
    const onDocPointerDown = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocPointerDown);
    return () => document.removeEventListener('mousedown', onDocPointerDown);
  }, []);

  const getEnvIcon = (
    envId: ActiveEnvironmentId,
    className = 'w-4 h-4 shrink-0'
  ) => {
    if (envId === 'SERVER') return <Server className={className} />;
    if (envId === 'CLOUD') return <Cloud className={className} />;
    return <Laptop className={className} />;
  };

  const viewNavLinks: Array<{
    id: CanvasViewMode;
    label: string;
    tooltip: string;
    badge: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'TOPOLOGY',
      label: 'Diagram',
      tooltip: 'Interactive Attack Topology Diagram View',
      badge: 'VIEW 1',
      icon: <Network className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'SEQUENCE',
      label: 'Sequence',
      tooltip: 'Chronological Attack Sequence Flow View',
      badge: 'VIEW 2',
      icon: <GitCommitHorizontal className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'PROCESS_MEMORY',
      label: 'Memory',
      tooltip: 'Process Virtual Memory & Syscall Forensic View',
      badge: 'VIEW 3',
      icon: <Cpu className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'RAW_TABLES',
      label: 'Tables & Packets',
      tooltip: 'Raw Telemetry Tables & Bidirectional Packet Inspector',
      badge: 'VIEW 4',
      icon: <Table2 className="w-4 h-4 shrink-0" />,
    },
  ];

  const handleSelectSearchNode = (nodeId: string) => {
    if (viewMode !== 'TOPOLOGY') {
      onViewModeChange('TOPOLOGY');
    }
    onFocusGraphNode?.(nodeId);
    setSearchDropdownOpen(false);
  };

  return (
    <>
      <header
        dir="ltr"
        data-testid="persistent-navigation-bar"
        className="relative shrink-0 h-12 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-2.5 sm:px-3.5 flex items-center justify-between gap-2 z-40 overflow-visible"
      >
        {/* Left Zone: Animated Logo + Icon-Only Scenarios Sidebar Toggle + Icon-Only Active Environment Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <WorkbenchIconTooltip
            label="Attack Explorer"
            badge="INTRO"
            detail="Click to replay anime entrance sequence"
            align="left"
          >
            <AnimeBrandLogo size="sm" showWordmark onClick={onReplayIntro} />
          </WorkbenchIconTooltip>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          <WorkbenchIconTooltip
            label="Scenarios"
            badge={sidebarOpen ? 'OPEN' : 'PANEL'}
            detail="Toggle Attack Scenarios & Operational Playbooks"
            align="left"
          >
            <button
              type="button"
              data-testid="toggle-left-sidebar-btn"
              aria-label="Scenarios"
              onClick={onToggleSidebar}
              className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                sidebarOpen
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-2xs'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <PanelLeft className="w-4 h-4 shrink-0" />
            </button>
          </WorkbenchIconTooltip>

          {/* Active Environment Icon-Only Trigger (Click opens consolidated Settings Drawer) */}
          <WorkbenchIconTooltip
            label={currentEnvProfile.badgeLabel}
            badge={currentEnvProfile.shortLabel}
            detail={`Active Environment: ${currentEnvProfile.telemetryTag}`}
            align="left"
          >
            <button
              type="button"
              data-testid="header-environment-dropdown-trigger"
              aria-label={currentEnvProfile.badgeLabel}
              onClick={() => setSettingsDrawerOpen(true)}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
            >
              {getEnvIcon(
                activeEnvironment,
                'w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0'
              )}
              <span
                data-testid="header-active-environment-badge"
                data-environment-id={activeEnvironment}
                className="sr-only"
              >
                {currentEnvProfile.badgeLabel}
              </span>
            </button>
          </WorkbenchIconTooltip>
        </div>

        {/* Center Zone: Primary View Mode Links + Top Toolbar Attack Graph Node Search Bar + Quick Tools */}
        <nav
          aria-label="Primary Workbench Navigation"
          data-testid="primary-app-nav-links"
          className="flex items-center gap-1.5 min-w-0"
        >
          <div
            role="tablist"
            aria-label="Diagram View Mode"
            className="flex items-center gap-0.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 shrink-0"
          >
            {viewNavLinks.map((tab) => {
              const isSelected = viewMode === tab.id;
              return (
                <WorkbenchIconTooltip
                  key={tab.id}
                  label={tab.label}
                  badge={isSelected ? 'ACTIVE' : tab.badge}
                  detail={tab.tooltip}
                >
                  <button
                    type="button"
                    role="tab"
                    data-testid={`view-mode-tab-${tab.id}`}
                    aria-label={tab.label}
                    aria-selected={isSelected}
                    onClick={() => onViewModeChange(tab.id)}
                    className="relative h-7 w-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="canvasViewModeSlidingPill"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-2xs border border-zinc-200/70 dark:border-zinc-700"
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center justify-center ${
                        isSelected
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {tab.icon}
                    </span>
                  </button>
                </WorkbenchIconTooltip>
              );
            })}
          </div>

          {/* Top Workbench Toolbar Attack Graph Node Search Bar */}
          <div
            ref={searchContainerRef}
            data-testid="top-toolbar-node-search"
            className="relative flex items-center shrink-0"
          >
            <div
              className={`h-8 w-36 sm:w-48 md:w-56 lg:w-64 px-2.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                searchResult.isFiltering
                  ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/25'
                  : 'bg-zinc-50/95 dark:bg-zinc-900/95 border-zinc-200/80 dark:border-zinc-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
              }`}
            >
              <Search
                className={`w-3.5 h-3.5 shrink-0 ${
                  searchResult.isFiltering
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              <input
                ref={searchInputRef}
                type="text"
                data-testid="top-toolbar-node-search-input"
                aria-label="Search and filter attack graph nodes"
                value={nodeSearchQuery}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  onNodeSearchQueryChange?.(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    if (nodeSearchQuery) {
                      onNodeSearchQueryChange?.('');
                    }
                    setSearchDropdownOpen(false);
                    searchInputRef.current?.blur();
                  } else if (
                    e.key === 'Enter' &&
                    searchResult.matchedNodes.length > 0
                  ) {
                    e.preventDefault();
                    handleSelectSearchNode(searchResult.matchedNodes[0].id);
                  }
                }}
                placeholder="Find graph node, IP, host..."
                className="w-full min-w-0 bg-transparent text-[11px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
              />

              {searchResult.isFiltering && (
                <span
                  data-testid="top-toolbar-node-search-count"
                  className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold tabular-nums shrink-0 ${
                    searchResult.matchedNodes.length > 0
                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                      : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {searchResult.matchedNodes.length}/{searchResult.totalNodes}
                </span>
              )}

              {nodeSearchQuery.length > 0 && (
                <button
                  type="button"
                  data-testid="top-toolbar-node-search-clear"
                  aria-label="Clear node search filter"
                  onClick={() => {
                    onNodeSearchQueryChange?.('');
                    setSearchDropdownOpen(false);
                    searchInputRef.current?.focus();
                  }}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Interactive Node Search & Filter Results Dropdown */}
            <AnimatePresence>
              {searchDropdownOpen &&
                (searchResult.isFiltering || graphNodes.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.14 }}
                    data-testid="top-toolbar-node-search-results"
                    className="absolute top-[calc(100%+6px)] left-0 w-80 sm:w-96 max-h-80 overflow-y-auto rounded-xl bg-white/98 dark:bg-zinc-900/98 border border-zinc-200/90 dark:border-zinc-800 shadow-2xl backdrop-blur-md p-2 z-50 flex flex-col gap-1"
                  >
                    <div className="px-2 py-1 flex items-center justify-between gap-2 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/80">
                      <span className="font-bold uppercase tracking-wider">
                        {searchResult.isFiltering
                          ? `Matching Attack Nodes (${searchResult.matchedNodes.length} of ${searchResult.totalNodes})`
                          : `Attack Graph Nodes (${graphNodes.length})`}
                      </span>
                      <span className="text-[9.5px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        Click to Focus
                      </span>
                    </div>

                    {(searchResult.isFiltering
                      ? searchResult.matchedNodes
                      : graphNodes
                    ).length === 0 ? (
                      <div
                        data-testid="top-toolbar-node-search-empty"
                        className="px-3 py-4 text-center text-xs text-zinc-500 dark:text-zinc-400"
                      >
                        No graph nodes match &ldquo;{nodeSearchQuery}&rdquo;.
                        Try searching by hostname, IP address, or stage role.
                      </div>
                    ) : (
                      (searchResult.isFiltering
                        ? searchResult.matchedNodes
                        : graphNodes
                      ).map((node) => (
                        <button
                          key={node.id}
                          type="button"
                          data-testid={`top-toolbar-search-result-${node.id}`}
                          onClick={() => handleSelectSearchNode(node.id)}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-indigo-50/90 dark:hover:bg-indigo-950/50 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800/70 transition-colors flex items-start justify-between gap-2 cursor-pointer group"
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9px] font-bold shrink-0">
                                #{node.chainOrder}
                              </span>
                              <span className="text-[11.5px] font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                                {node.label}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                              {node.sublabel} · {node.zoneLabel ?? node.zoneId}
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-600 group-hover:text-white text-zinc-600 dark:text-zinc-300 font-mono text-[9px] font-semibold shrink-0 transition-colors">
                            <Crosshair className="w-2.5 h-2.5" />
                            <span>Focus</span>
                          </span>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Top Workbench Toolbar Force-Directed Auto-Layout Trigger Button */}
          {onTriggerAutoLayout && (
            <WorkbenchIconTooltip
              label="Force-Directed Auto-Layout"
              badge={isAutoLayoutActive ? 'APPLIED · A' : 'HOTKEY A'}
              detail="Automatically organize attack graph nodes via Coulomb repulsion & Hooke spring forces"
            >
              <button
                type="button"
                data-testid="top-toolbar-auto-layout-btn"
                aria-label="Auto-Layout Attack Graph"
                aria-pressed={isAutoLayoutActive}
                onClick={() => {
                  if (viewMode !== 'TOPOLOGY') {
                    onViewModeChange('TOPOLOGY');
                  }
                  onTriggerAutoLayout();
                }}
                className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg border text-[11px] font-mono font-semibold transition-all cursor-pointer shrink-0 ${
                  isAutoLayoutActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-zinc-50/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="hidden xl:inline whitespace-nowrap">
                  Auto-Layout
                </span>
              </button>
            </WorkbenchIconTooltip>
          )}

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* Quick Navigation Icon-Only Links: Operational Guide + MITRE Library + Log Analyzer + Sources */}
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <WorkbenchIconTooltip
              label="Operational Guide"
              badge={showLegend ? 'ACTIVE' : 'GUIDE'}
              detail="Toggle Visual Semantics & Interactive Diagram Legend"
            >
              <button
                type="button"
                data-testid="nav-operational-guide-btn"
                aria-label="Operational Guide"
                aria-pressed={showLegend}
                onClick={() => {
                  if (viewMode !== 'TOPOLOGY') {
                    onViewModeChange('TOPOLOGY');
                  }
                  onToggleLegend?.();
                }}
                className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                  showLegend
                    ? tacticalMode
                      ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-indigo-50/95 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 border-indigo-300/90 dark:border-indigo-700/90 shadow-2xs'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <OperationalGuideIcon tacticalMode={tacticalMode} size="sm" />
              </button>
            </WorkbenchIconTooltip>

            <WorkbenchIconTooltip
              label="MITRE Library"
              badge="ATT&CK"
              detail="Open MITRE ATT&CK Technique & Scenario Matrix"
            >
              <button
                type="button"
                data-testid="nav-link-attack-library"
                aria-label="MITRE Library"
                onClick={onOpenAttackLibrary}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Library className="w-4 h-4 text-indigo-500 shrink-0" />
              </button>
            </WorkbenchIconTooltip>

            <WorkbenchIconTooltip
              label="Log Analyzer"
              badge="SIEM"
              detail="Open Interactive Raw SIEM Log & Malware Trace Analyzer"
            >
              <button
                type="button"
                data-testid="nav-link-log-analyzer"
                aria-label="Log Analyzer"
                onClick={onOpenAnalyzerModal}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <SearchCode className="w-4 h-4 text-indigo-500 shrink-0" />
              </button>
            </WorkbenchIconTooltip>

            {onOpenSourcesModal && (
              <WorkbenchIconTooltip
                label="Sources & Legal"
                badge="VERIFIED"
                detail="Authoritative Attack Analysis Sources & Citations"
              >
                <button
                  type="button"
                  data-testid="header-sources-legal-btn"
                  aria-label="Sources"
                  onClick={onOpenSourcesModal}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-emerald-200/80 dark:border-emerald-900/70 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                >
                  <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                </button>
              </WorkbenchIconTooltip>
            )}

            {onOpenShortcutsModal && (
              <WorkbenchIconTooltip
                label="Keyboard Shortcuts"
                badge="?"
                detail="Hotkeys for Tools (B: Box Select, P: Pan/Pen, A: Auto-Layout) & Canvas Navigation"
              >
                <button
                  type="button"
                  data-testid="open-shortcuts-modal-btn"
                  aria-label="Keyboard Shortcuts"
                  onClick={onOpenShortcutsModal}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Keyboard className="w-4 h-4 text-indigo-500 shrink-0" />
                </button>
              </WorkbenchIconTooltip>
            )}
          </div>
        </nav>

        {/* Right Zone: About CTA + Inspector + Settings */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenAboutModal && (
            <WorkbenchIconTooltip
              label="About the Creator"
              badge="PROFILE"
              detail="GitHub, X, and LinkedIn profiles for Mohammad Mirasadollahi"
              align="right"
            >
              <motion.button
                type="button"
                data-testid="header-about-author-btn"
                aria-label="About"
                onClick={onOpenAboutModal}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="relative h-8 pl-2 pr-2.5 flex items-center gap-1.5 rounded-lg border border-teal-400/80 dark:border-teal-500/70 bg-teal-500 text-white shadow-[0_0_0_0_rgba(20,184,166,0.55)] hover:bg-teal-400 cursor-pointer overflow-hidden"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-lg"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(20,184,166,0.55)',
                      '0 0 0 8px rgba(20,184,166,0)',
                      '0 0 0 0 rgba(20,184,166,0)',
                    ],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-8 w-8 bg-white/35 skew-x-[-20deg]"
                  animate={{ x: [0, 88] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 1.1,
                  }}
                />
                <motion.span
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative shrink-0"
                >
                  <UserRound className="w-3.5 h-3.5" />
                </motion.span>
                <motion.span
                  className="relative text-[11px] font-bold tracking-wide whitespace-nowrap"
                  animate={{ opacity: [1, 0.72, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  About
                </motion.span>
              </motion.button>
            </WorkbenchIconTooltip>
          )}

          <WorkbenchIconTooltip
            label="Inspector"
            badge={inspectorOpen ? 'OPEN' : 'PANEL'}
            detail="Toggle Right Forensic Inspector & Telemetry Panel"
            align="right"
          >
            <button
              type="button"
              data-testid="toggle-right-inspector-btn"
              aria-label="Inspector"
              onClick={onToggleInspector}
              className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                inspectorOpen
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-2xs'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <PanelRight className="w-4 h-4 shrink-0" />
            </button>
          </WorkbenchIconTooltip>

          {/* Consolidated Slide-Out Settings Drawer Trigger */}
          <WorkbenchIconTooltip
            label="Settings"
            badge="CONFIG"
            detail="Open Global Workbench Settings & Environment Drawer"
            align="right"
          >
            <button
              type="button"
              data-testid="settings-menu-btn"
              aria-label="Settings"
              aria-expanded={settingsDrawerOpen}
              onClick={() => setSettingsDrawerOpen((v) => !v)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                settingsDrawerOpen
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
            </button>
          </WorkbenchIconTooltip>
        </div>
      </header>

      {/* Consolidated Slide-Out Settings Drawer */}
      <SettingsDrawer
        isOpen={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        activeEnvironment={activeEnvironment}
        onSelectEnvironment={(env) => onSelectEnvironment?.(env)}
        tacticalMode={tacticalMode}
        onToggleTacticalMode={() => onToggleTacticalMode?.()}
        showLegend={showLegend}
        onToggleLegend={() => onToggleLegend?.()}
        isDark={isDark}
        onToggleDark={onToggleDark}
        layoutMode={layoutMode}
        onLayoutModeChange={(mode) => onLayoutModeChange?.(mode)}
        playbackSpeed={playbackSpeed}
        onSpeedChange={onSpeedChange}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
        inspectorOpen={inspectorOpen}
        onToggleInspector={onToggleInspector}
        telemetryOpen={telemetryOpen}
        onToggleTelemetry={onToggleTelemetry}
        onOpenAttackLibrary={onOpenAttackLibrary}
        onOpenAnalyzerModal={onOpenAnalyzerModal}
        onOpenSourcesModal={() => onOpenSourcesModal?.()}
      />
    </>
  );
}
