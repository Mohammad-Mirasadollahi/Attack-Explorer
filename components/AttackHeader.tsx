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
import { WorkbenchIconTooltip } from './WorkbenchIconTooltip';
import {
  Cloud,
  Cpu,
  GitCommitHorizontal,
  Keyboard,
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
  onOpenShortcutsModal?: () => void;
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
  onOpenShortcutsModal,
  onReplayIntro,
}: AttackHeaderProps) {
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const currentEnvProfile = getActiveEnvironmentProfile(activeEnvironment);

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

  return (
    <>
      <header
        dir="ltr"
        data-testid="persistent-navigation-bar"
        className="relative shrink-0 h-12 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-2.5 sm:px-3.5 flex items-center justify-between gap-2 z-40 overflow-visible"
      >
        {/* Left Zone: Animated Logo + Icon-Only Scenarios Sidebar Toggle + Icon-Only Active Environment Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <AnimeBrandLogo size="sm" showWordmark onClick={onReplayIntro} />

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

        {/* Center Zone: Icon-Only Primary App Navigation Links with Custom App-Styled Tooltips */}
        <nav
          aria-label="Primary Workbench Navigation"
          data-testid="primary-app-nav-links"
          className="flex items-center gap-1.5 shrink-0"
        >
          <div
            role="tablist"
            aria-label="Diagram View Mode"
            className="flex items-center gap-0.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800"
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

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* Quick Navigation Icon-Only Links: Operational Guide + MITRE Library + Log Analyzer + Sources */}
          <div className="hidden sm:flex items-center gap-1">
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
                detail="Hotkeys for Tools (B: Box Select, P: Pan/Pen) & Canvas Navigation"
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

        {/* Right Zone: Icon-Only Inspector Toggle + Icon-Only Slide-Out Settings Drawer Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
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
