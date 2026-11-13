'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ACTIVE_ENVIRONMENT_LIST,
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
} from '@/lib/simulation-engine';
import { CanvasViewMode } from './DiagramCanvas';
import {
  Check,
  Cloud,
  Cpu,
  Crosshair,
  GitCommitHorizontal,
  Laptop,
  Library,
  Monitor,
  Moon,
  Network,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Scale,
  SearchCode,
  Server,
  Settings,
  Smartphone,
  Sun,
  Table2,
  X,
} from 'lucide-react';
import { OperationalGuideIcon } from './OperationalGuideIcon';
import { WorkbenchLayoutMode } from '@/lib/layout-preference';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: CanvasViewMode;
  onViewModeChange: (mode: CanvasViewMode) => void;
  activeEnvironment: ActiveEnvironmentId;
  onSelectEnvironment: (env: ActiveEnvironmentId) => void;
  tacticalMode: boolean;
  onToggleTacticalMode: () => void;
  showLegend: boolean;
  onToggleLegend: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  layoutMode: WorkbenchLayoutMode;
  onLayoutModeChange: (mode: WorkbenchLayoutMode) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  inspectorOpen: boolean;
  onToggleInspector: () => void;
  telemetryOpen: boolean;
  onToggleTelemetry: () => void;
  onOpenAttackLibrary: () => void;
  onOpenAnalyzerModal: () => void;
  onOpenSourcesModal: () => void;
}

export function SettingsDrawer({
  isOpen,
  onClose,
  viewMode,
  onViewModeChange,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  onSelectEnvironment,
  tacticalMode,
  onToggleTacticalMode,
  showLegend,
  onToggleLegend,
  isDark,
  onToggleDark,
  layoutMode,
  onLayoutModeChange,
  playbackSpeed,
  onSpeedChange,
  sidebarOpen,
  onToggleSidebar,
  inspectorOpen,
  onToggleInspector,
  telemetryOpen,
  onToggleTelemetry,
  onOpenAttackLibrary,
  onOpenAnalyzerModal,
  onOpenSourcesModal,
}: SettingsDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const viewTabs: Array<{
    id: CanvasViewMode;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'TOPOLOGY',
      label: 'Diagram (Topology)',
      icon: <Network className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'SEQUENCE',
      label: 'Sequence Flow',
      icon: <GitCommitHorizontal className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'PROCESS_MEMORY',
      label: 'Process Memory',
      icon: <Cpu className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'RAW_TABLES',
      label: 'Tables & Packets',
      icon: <Table2 className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  const getEnvIcon = (envId: ActiveEnvironmentId) => {
    if (envId === 'SERVER') return <Server className="w-3.5 h-3.5 shrink-0" />;
    if (envId === 'CLOUD') return <Cloud className="w-3.5 h-3.5 shrink-0" />;
    return <Laptop className="w-3.5 h-3.5 shrink-0" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="settings-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
          />

          {/* Slide-Out Global Settings & Configuration Drawer */}
          <motion.aside
            key="settings-slideout-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Global Settings and Configuration Drawer"
            data-testid="settings-popover-menu"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            dir="ltr"
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Workbench Settings & Configuration
                </h2>
              </div>
              <button
                type="button"
                data-testid="close-settings-drawer-btn"
                aria-label="Close Settings Drawer"
                onClick={onClose}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Settings Sections */}
            <div className="flex-1 overflow-auto p-4 space-y-5">
              {/* 1. Canvas View Mode Switches */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
                  1. Canvas View Mode
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800">
                  {viewTabs.map((tab) => {
                    const isSelected = viewMode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        data-testid={`drawer-view-mode-${tab.id}`}
                        onClick={() => onViewModeChange(tab.id)}
                        className={`flex items-center gap-1.5 py-2 px-2.5 text-xs font-medium rounded-lg transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs font-semibold'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {tab.icon}
                        <span className="break-words leading-snug">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Active Target Environment Profile */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
                  2. Active System Environment
                </div>
                <div className="space-y-1.5">
                  {ACTIVE_ENVIRONMENT_LIST.map((env) => {
                    const isSelected = env.id === activeEnvironment;
                    return (
                      <button
                        key={env.id}
                        type="button"
                        data-testid={`drawer-env-option-${env.id}`}
                        onClick={() => onSelectEnvironment(env.id)}
                        className={`w-full flex items-center justify-between gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-400 dark:border-indigo-700'
                            : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="p-1.5 rounded-lg text-white shrink-0"
                            style={{ backgroundColor: env.accentHex }}
                          >
                            {getEnvIcon(env.id)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-zinc-900 dark:text-white break-words">
                              {env.badgeLabel} ({env.shortLabel})
                            </div>
                            <div className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400 break-words">
                              {env.hostname} · {env.telemetryTag}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Display Preferences & Visual Overlays */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
                  3. Display & Animation Preferences
                </div>

                <div className="space-y-1.5">
                  {/* Dark / Light Theme Toggle */}
                  <button
                    type="button"
                    data-testid="drawer-theme-toggle-btn"
                    onClick={onToggleDark}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                      {isDark ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-indigo-500" />
                      )}
                      <span>Color Theme</span>
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {isDark ? 'Dark Workbench' : 'Light Workbench'}
                    </span>
                  </button>

                  {/* Desktop vs Responsive layout (Responsive default on phones) */}
                  <div
                    data-testid="drawer-layout-mode-section"
                    className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden"
                  >
                    <div className="px-3 pt-2.5 pb-1.5 flex items-start gap-2">
                      {layoutMode === 'DESKTOP' ? (
                        <Monitor className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                          Screen Layout
                        </div>
                        <p className="text-[10.5px] leading-snug text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Responsive is the default on phones (compact UI).
                          Desktop forces the full workbench; pinch to zoom the
                          page, drag to pan the diagram, and use Box Select for
                          marquee.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-1.5">
                      <button
                        type="button"
                        data-testid="drawer-layout-mode-desktop"
                        onClick={() => onLayoutModeChange('DESKTOP')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                          layoutMode === 'DESKTOP'
                            ? 'bg-teal-500 text-white shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5 shrink-0" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        data-testid="drawer-layout-mode-responsive"
                        onClick={() => onLayoutModeChange('RESPONSIVE')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                          layoutMode === 'RESPONSIVE'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5 shrink-0" />
                        <span>Responsive</span>
                      </button>
                    </div>
                  </div>

                  {/* Tactical Grid Mode Toggle */}
                  <button
                    type="button"
                    data-testid="settings-tactical-mode-btn"
                    onClick={onToggleTacticalMode}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                      <Crosshair className="w-4 h-4 text-emerald-500" />
                      <span>Tactical Grid Overlay</span>
                    </span>
                    <span
                      className={`text-[11px] font-mono font-semibold ${
                        tacticalMode
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {tacticalMode ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Diagram Legend Panel Toggle */}
                  <button
                    type="button"
                    data-testid="settings-legend-toggle-btn"
                    onClick={onToggleLegend}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                      <OperationalGuideIcon tacticalMode={tacticalMode} size="sm" />
                      <span>Diagram Visual Legend · Operational Guide</span>
                    </span>
                    <span
                      className={`text-[11px] font-mono font-semibold ${
                        showLegend
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {showLegend ? 'VISIBLE' : 'HIDDEN'}
                    </span>
                  </button>

                  {/* Playback Speed Selector */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                    <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      Animation Speed
                    </span>
                    <div className="flex items-center gap-1">
                      {[0.5, 1, 2].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          data-testid={`settings-playback-speed-${spd}`}
                          onClick={() => onSpeedChange(spd)}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded-lg cursor-pointer transition-colors ${
                            playbackSpeed === spd
                              ? 'bg-indigo-600 text-white font-semibold'
                              : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {spd}×
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Workspace Dock & Panel Toggles */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
                  4. Workspace Panels
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    data-testid="drawer-toggle-sidebar-btn"
                    onClick={onToggleSidebar}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                      <PanelLeft className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Left Scenarios Sidebar</span>
                    </span>
                    <span className="text-[10.5px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {sidebarOpen ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    type="button"
                    data-testid="drawer-toggle-inspector-btn"
                    onClick={onToggleInspector}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                      <PanelRight className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Right Inspector & Analytics</span>
                    </span>
                    <span className="text-[10.5px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {inspectorOpen ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    type="button"
                    data-testid="toggle-bottom-telemetry-btn"
                    onClick={onToggleTelemetry}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-xs transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                      <PanelBottom className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Bottom Telemetry Stream</span>
                    </span>
                    <span className="text-[10.5px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {telemetryOpen ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 5. Forensic Modals & Reference Suites */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
                  5. Reference & Forensic Suites
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    data-testid="open-attack-library-btn"
                    onClick={() => {
                      onClose();
                      onOpenAttackLibrary();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Library className="w-3.5 h-3.5 text-indigo-500" />
                      <span>MITRE ATT&CK Technique Library</span>
                    </span>
                    <span className="text-[10.5px] font-mono text-zinc-400">
                      Open
                    </span>
                  </button>

                  <button
                    type="button"
                    data-testid="open-log-analyzer-btn"
                    onClick={() => {
                      onClose();
                      onOpenAnalyzerModal();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <SearchCode className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Analyze Custom Raw SIEM Log</span>
                    </span>
                    <span className="text-[10.5px] font-mono text-zinc-400">
                      Open
                    </span>
                  </button>

                  <button
                    type="button"
                    data-testid="open-sources-legal-btn"
                    onClick={() => {
                      onClose();
                      onOpenSourcesModal();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100/70 text-xs text-emerald-800 dark:text-emerald-200 font-medium transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Sources & Legal Compliance</span>
                    </span>
                    <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400">
                      View
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
