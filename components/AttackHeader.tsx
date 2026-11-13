'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AttackScenario } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  ComputedStageView,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import { CanvasViewMode } from './DiagramCanvas';
import { AnimeBrandLogo } from './AnimeBrandLogo';
import { SettingsDrawer } from './SettingsDrawer';
import { OperationalGuideIcon } from './OperationalGuideIcon';
import {
  Cloud,
  Cpu,
  GitCommitHorizontal,
  Laptop,
  Library,
  Network,
  PanelLeft,
  PanelRight,
  Scale,
  SearchCode,
  Server,
  Settings,
  Table2,
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
  onReplayIntro?: () => void;
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
  onReplayIntro,
}: AttackHeaderProps) {
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const currentEnvProfile = getActiveEnvironmentProfile(activeEnvironment);

  const getEnvIcon = (
    envId: ActiveEnvironmentId,
    className = 'w-3.5 h-3.5 shrink-0'
  ) => {
    if (envId === 'SERVER') return <Server className={className} />;
    if (envId === 'CLOUD') return <Cloud className={className} />;
    return <Laptop className={className} />;
  };

  const viewNavLinks: Array<{
    id: CanvasViewMode;
    label: string;
    tooltip: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'TOPOLOGY',
      label: 'Diagram',
      tooltip: 'Interactive Attack Topology Diagram View',
      icon: <Network className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'SEQUENCE',
      label: 'Sequence',
      tooltip: 'Chronological Attack Sequence Flow View',
      icon: <GitCommitHorizontal className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'PROCESS_MEMORY',
      label: 'Memory',
      tooltip: 'Process Virtual Memory & Syscall Forensic View',
      icon: <Cpu className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'RAW_TABLES',
      label: 'Tables & Packets',
      tooltip: 'Raw Telemetry Tables & Bidirectional Packet Inspector',
      icon: <Table2 className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  return (
    <>
      <header
        dir="ltr"
        data-testid="persistent-navigation-bar"
        className="shrink-0 h-12 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-2.5 sm:px-3.5 flex items-center justify-between gap-1.5 sm:gap-2 z-40 overflow-hidden"
      >
        {/* Left Zone: Animated Logo + Scenarios Sidebar Toggle + Active Environment Indicator */}
        <div className="flex items-center gap-1.5 min-w-0 shrink-0">
          <AnimeBrandLogo size="sm" showWordmark onClick={onReplayIntro} />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          <button
            type="button"
            data-testid="toggle-left-sidebar-btn"
            aria-label="Toggle left scenarios panel"
            title="Toggle Attack Scenarios & Operational Guide Sidebar"
            onClick={onToggleSidebar}
            className={`h-8 px-2 flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer min-w-0 max-w-[140px] ${
              sidebarOpen
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <PanelLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline truncate">Scenarios</span>
          </button>

          {/* Active Environment Status Pill (Click opens consolidated Settings Drawer) */}
          <button
            type="button"
            data-testid="header-environment-dropdown-trigger"
            onClick={() => setSettingsDrawerOpen(true)}
            title={`Active Environment: ${currentEnvProfile.badgeLabel} (${currentEnvProfile.telemetryTag}) — Click to configure in Settings`}
            className="h-8 px-2 hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer min-w-0 max-w-[175px]"
          >
            {getEnvIcon(
              activeEnvironment,
              'w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0'
            )}
            <span
              data-testid="header-active-environment-badge"
              data-environment-id={activeEnvironment}
              className="flex items-center gap-1 min-w-0 truncate"
            >
              <span className="hidden 2xl:inline font-semibold truncate">
                {currentEnvProfile.badgeLabel}
              </span>
              <span className="2xl:hidden font-semibold truncate">
                {currentEnvProfile.shortLabel}
              </span>
            </span>
          </button>
        </div>

        {/* Center Zone: Primary App Navigation Links (Views + Restored Operational Guide + Reference Suites) */}
        <nav
          aria-label="Primary Workbench Navigation"
          data-testid="primary-app-nav-links"
          className="hidden md:flex items-center gap-1.5 min-w-0 shrink overflow-hidden"
        >
          <div
            role="tablist"
            aria-label="Diagram View Mode"
            className="flex items-center gap-0.5 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 min-w-0 shrink"
          >
            {viewNavLinks.map((tab) => {
              const isSelected = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  data-testid={`view-mode-tab-${tab.id}`}
                  aria-selected={isSelected}
                  title={tab.tooltip}
                  onClick={() => onViewModeChange(tab.id)}
                  className="relative flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer min-w-0 max-w-[140px]"
                >
                  {isSelected && (
                    <motion.span
                      layoutId="canvasViewModeSlidingPill"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-2xs border border-zinc-200/70 dark:border-zinc-700"
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-1 min-w-0 ${
                      isSelected
                        ? 'text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden lg:block shrink-0" />

          {/* Quick Navigation Links: Restored Operational Guide Badge + MITRE Library + Log Analyzer + Sources */}
          <div className="hidden lg:flex items-center gap-1 min-w-0 shrink">
            {/* Restored Operational Guide Icon & Signature Styled Navigation Button */}
            <button
              type="button"
              data-testid="nav-operational-guide-btn"
              aria-pressed={showLegend}
              onClick={() => {
                if (viewMode !== 'TOPOLOGY') {
                  onViewModeChange('TOPOLOGY');
                }
                onToggleLegend?.();
              }}
              title="Operational Guide & Diagram Visual Legend — Toggle visual semantics & interactive guide on the diagram"
              className={`h-8 px-2 flex items-center gap-1.5 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer min-w-0 max-w-[168px] ${
                showLegend
                  ? tacticalMode
                    ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-indigo-50/95 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 border-indigo-300/90 dark:border-indigo-700/90 shadow-2xs'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <OperationalGuideIcon tacticalMode={tacticalMode} size="sm" />
              <span className="truncate">Operational Guide</span>
            </button>

            <button
              type="button"
              data-testid="nav-link-attack-library"
              onClick={onOpenAttackLibrary}
              title="Open MITRE ATT&CK Technique & Scenario Library"
              className="h-8 px-2 flex items-center gap-1 rounded-lg text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer min-w-0 max-w-[130px]"
            >
              <Library className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">MITRE Library</span>
            </button>

            <button
              type="button"
              data-testid="nav-link-log-analyzer"
              onClick={onOpenAnalyzerModal}
              title="Open Interactive Raw SIEM Log & Malware Trace Analyzer"
              className="h-8 px-2 flex items-center gap-1 rounded-lg text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer min-w-0 max-w-[125px]"
            >
              <SearchCode className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">Log Analyzer</span>
            </button>

            {onOpenSourcesModal && (
              <button
                type="button"
                data-testid="header-sources-legal-btn"
                onClick={onOpenSourcesModal}
                title="View Authoritative Attack Analysis Sources, Citations & Legal Compliance"
                className="h-8 px-2 flex items-center gap-1 rounded-lg text-[11px] font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer min-w-0 max-w-[100px]"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="hidden xl:inline truncate">Sources</span>
              </button>
            )}
          </div>
        </nav>

        {/* Right Zone: Inspector Toggle + Slide-Out Settings Drawer Trigger */}
        <div className="flex items-center gap-1.5 shrink-0 min-w-0">
          <button
            type="button"
            data-testid="toggle-right-inspector-btn"
            aria-label="Toggle right inspector panel"
            title="Toggle Right Inspector & Analytics Panel"
            onClick={onToggleInspector}
            className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer min-w-0 max-w-[120px] ${
              inspectorOpen
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <PanelRight className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline truncate">Inspector</span>
          </button>

          {/* Consolidated Slide-Out Settings Drawer Trigger */}
          <button
            type="button"
            data-testid="settings-menu-btn"
            aria-label="Open Global Settings Drawer"
            aria-expanded={settingsDrawerOpen}
            title="Open Global Workbench Settings & Configuration Drawer"
            onClick={() => setSettingsDrawerOpen((v) => !v)}
            className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer min-w-0 max-w-[115px] ${
              settingsDrawerOpen
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Settings</span>
          </button>
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
