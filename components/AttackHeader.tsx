'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AttackScenario} from '@/lib/attack-scenarios';
import {
  ACTIVE_ENVIRONMENT_LIST,
  ActiveEnvironmentId,
  ComputedStageView,
  cyclePlaybackSpeed,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile } from '@/lib/simulation-engine';
import { CanvasViewMode } from './DiagramCanvas';
import { AnimeBrandLogo } from './AnimeBrandLogo';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Cloud,
  Cpu,
  Crosshair,
  GitCommitHorizontal,
  Laptop,
  Library,
  Moon,
  Network,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Pause,
  Play,
  RotateCcw,
  Scale,
  SearchCode,
  Server,
  Settings,
  StepForward,
  Sun,
  Table2 } from 'lucide-react';

interface AttackHeaderProps {
  scenario: AttackScenario;
  stageView: ComputedStageView;
  activeEnvironment?: ActiveEnvironmentId;
  onSelectEnvironment?: (env: ActiveEnvironmentId) => void;
  tacticalMode?: boolean;
  onToggleTacticalMode?: () => void;
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
}

export function AttackHeader({
  scenario,
  stageView,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  onSelectEnvironment,
  tacticalMode = false,
  onToggleTacticalMode,
  viewMode,
  onViewModeChange,
  onSelectStage,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  canStepBackward,
  canStepForward,
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
  onOpenSourcesModal }: AttackHeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [envMenuOpen, setEnvMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const envMenuRef = useRef<HTMLDivElement>(null);
  const { currentStage } = stageView;
  const activeStageIndex = currentStage ? currentStage.index : 0;
  const currentEnvProfile = getActiveEnvironmentProfile(activeEnvironment);

  useEffect(() => {
    if (!settingsOpen && !envMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
      if (
        envMenuRef.current &&
        !envMenuRef.current.contains(e.target as Node)
      ) {
        setEnvMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [settingsOpen, envMenuOpen]);

  const getEnvIcon = (
    envId: ActiveEnvironmentId,
    className = 'w-3.5 h-3.5 shrink-0'
  ) => {
    if (envId === 'SERVER') return <Server className={className} />;
    if (envId === 'CLOUD') return <Cloud className={className} />;
    return <Laptop className={className} />;
  };

  const getEnvBadgeTheme = (envId: ActiveEnvironmentId) => {
    if (envId === 'SERVER') {
      return 'bg-violet-50/95 dark:bg-violet-950/75 text-violet-800 dark:text-violet-200 border-violet-300/90 dark:border-violet-800 hover:bg-violet-100/90 dark:hover:bg-violet-900/80';
    }
    if (envId === 'CLOUD') {
      return 'bg-emerald-50/95 dark:bg-emerald-950/75 text-emerald-800 dark:text-emerald-200 border-emerald-300/90 dark:border-emerald-800 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/80';
    }
    return 'bg-sky-50/95 dark:bg-sky-950/75 text-sky-800 dark:text-sky-200 border-sky-300/90 dark:border-sky-800 hover:bg-sky-100/90 dark:hover:bg-sky-900/80';
  };

  const viewTabs: Array<{
    id: CanvasViewMode;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'TOPOLOGY',
      label: 'Diagram',
      icon: <Network className="w-3.5 h-3.5 shrink-0" /> },
    {
      id: 'SEQUENCE',
      label: 'Sequence',
      icon: <GitCommitHorizontal className="w-3.5 h-3.5 shrink-0" /> },
    {
      id: 'PROCESS_MEMORY',
      label: 'Memory',
      icon: <Cpu className="w-3.5 h-3.5 shrink-0" /> },
    {
      id: 'RAW_TABLES',
      label: 'Tables & Packets',
      icon: <Table2 className="w-3.5 h-3.5 shrink-0" /> },
  ];

  return (
    <header
      dir="ltr"
      className="shrink-0 h-12 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3 z-40"
    >
      {/* Left Zone: Bespoke Anime Brand Logo + Scenarios Toggle + Active Environment Switcher + Tactical Mode Toggle */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <AnimeBrandLogo size="md" showWordmark />

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

        <button
          type="button"
          data-testid="toggle-left-sidebar-btn"
          aria-label="Toggle left scenarios panel"
          title="Toggle Scenarios Sidebar"
          onClick={onToggleSidebar}
          className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            sidebarOpen
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
              : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <PanelLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Scenarios</span>
        </button>

        {/* Current Active Environment Badge & Dropdown Switcher */}
        <div className="relative" ref={envMenuRef}>
          <button
            type="button"
            data-testid="header-environment-dropdown-trigger"
            aria-label="Switch Current Active Environment"
            aria-expanded={envMenuOpen}
            aria-haspopup="listbox"
            onClick={() => setEnvMenuOpen((v) => !v)}
            title={`Current Active Environment: ${currentEnvProfile.badgeLabel} (${currentEnvProfile.telemetryTag})`}
            className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${getEnvBadgeTheme(
              activeEnvironment
            )}`}
          >
            {getEnvIcon(activeEnvironment)}
            <span
              data-testid="header-active-environment-badge"
              data-environment-id={activeEnvironment}
              className="flex items-center gap-1.5"
            >
              <span className="hidden md:inline font-semibold">
                {currentEnvProfile.badgeLabel}
              </span>
              <span className="md:hidden font-semibold">
                {currentEnvProfile.shortLabel}
              </span>
              <span className="hidden 2xl:inline-flex px-1.5 py-0.2 rounded bg-black/8 dark:bg-white/10 font-mono text-[10px]">
                {currentEnvProfile.telemetryTag}
              </span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 opacity-75 transition-transform duration-150 ${
                envMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {envMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                role="listbox"
                aria-label="Select Active System Environment"
                dir="ltr"
                data-testid="header-environment-dropdown-menu"
                className="absolute left-0 mt-2 w-80 bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-xl shadow-2xl p-2 space-y-1.5 z-50"
              >
                <div className="px-2 py-1 flex items-center justify-between text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/80">
                  <span>Active Environment Context</span>
                  <span className="text-indigo-500 font-semibold">
                    {currentEnvProfile.shortLabel}
                  </span>
                </div>

                {ACTIVE_ENVIRONMENT_LIST.map((env) => {
                  const isSelected = env.id === activeEnvironment;
                  return (
                    <button
                      key={env.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      data-testid={`env-option-${env.id}`}
                      onClick={() => {
                        onSelectEnvironment?.(env.id);
                        setEnvMenuOpen(false);
                      }}
                      className={`w-full flex items-start justify-between gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-400/80 dark:border-indigo-700 shadow-2xs'
                          : 'bg-zinc-50/50 dark:bg-zinc-900/40 border-transparent hover:bg-zinc-100/80 dark:hover:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className="mt-0.5 p-1.5 rounded-lg text-white shrink-0"
                          style={{ backgroundColor: env.accentHex }}
                        >
                          {getEnvIcon(env.id, 'w-3.5 h-3.5')}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">
                              {env.shortLabel}
                            </span>
                            <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                              · {env.badgeLabel}
                            </span>
                          </div>
                          <div className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                            {env.hostname} ({env.ipSubnet})
                          </div>
                          <div className="inline-flex items-center px-1.5 py-0.2 rounded bg-zinc-200/75 dark:bg-zinc-800 text-[9.5px] font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                            {env.telemetryTag}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tactical Mode Grid Overlay Toggle Button */}
        {onToggleTacticalMode && (
          <button
            type="button"
            data-testid="tactical-mode-toggle-btn"
            aria-pressed={tacticalMode}
            onClick={onToggleTacticalMode}
            title={
              tacticalMode
                ? 'Tactical Grid Overlay Active (Click to disable)'
                : 'Enable Tactical Grid Overlay on Canvas'
            }
            className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
              tacticalMode
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Crosshair
              className={`w-3.5 h-3.5 shrink-0 ${
                tacticalMode ? 'text-emerald-400 animate-spin' : ''
              }`}
              style={{ animationDuration: '8s' }}
            />
            <span className="hidden lg:inline">Tactical Grid</span>
          </button>
        )}
      </div>

      {/* Center Zone: Unified Stage Stepper (All | S1..SN) + Play / Step / Reset */}
      <div className="flex items-center gap-1.5 shrink-0 py-1">
        <div
          role="group"
          aria-label="Attack Stage Stepper"
          className="flex items-center gap-0.5 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800"
        >
          <button
            type="button"
            data-testid="visualizer-step-btn-0"
            onClick={() => onSelectStage(0)}
            className="relative px-2 py-1 text-[11px] font-mono font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            {currentStage === null && (
              <motion.span
                layoutId="visualizerStepActivePill"
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="absolute inset-0 rounded-md bg-zinc-900 dark:bg-zinc-100"
              />
            )}
            <span
              className={`relative z-10 ${
                currentStage === null
                  ? 'text-white dark:text-zinc-900 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              All
            </span>
          </button>

          {scenario.stages.map((st) => {
            const isStepActive = currentStage?.index === st.index;
            return (
              <button
                key={st.index}
                type="button"
                data-testid={`visualizer-step-btn-${st.index}`}
                onClick={() => onSelectStage(st.index)}
                title={`S${st.index}: ${st.title}`}
                className="relative px-2 py-1 text-[11px] font-mono font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
              >
                {isStepActive && (
                  <motion.span
                    layoutId="visualizerStepActivePill"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 28 }}
                    className="absolute inset-0 rounded-md bg-indigo-600"
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isStepActive
                      ? 'text-white font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  S{st.index}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clean Playback Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous step"
            disabled={!canStepBackward}
            onClick={onStepBackward}
            className="h-7 w-7 flex items-center justify-center text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 disabled:opacity-35 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            data-testid="canvas-play-pause-btn"
            onClick={onTogglePlay}
            className="h-7 flex items-center gap-1.5 px-2.5 text-[11px] font-medium text-white dark:text-zinc-900 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 rounded-lg cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            data-testid="canvas-step-forward-btn"
            onClick={onStepForward}
            disabled={!canStepForward && activeStageIndex !== 0}
            title="Next Step"
            className="h-7 w-7 flex items-center justify-center text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 disabled:opacity-35 cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            data-testid="header-playback-speed-btn"
            onClick={() => onSpeedChange(cyclePlaybackSpeed(playbackSpeed))}
            title={`Playback Speed: ${playbackSpeed}× (Click to cycle)`}
            className="h-7 px-2 flex items-center justify-center text-[11px] font-mono font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors cursor-pointer tabular-nums"
          >
            {playbackSpeed}×
          </button>

          {activeStageIndex > 0 && (
            <button
              type="button"
              data-testid="canvas-reset-btn"
              onClick={onReset}
              title="Reset to All Stages"
              className="h-7 w-7 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Right Zone: View Tabs + Sources & Legal + Inspector + Settings */}
      <div className="flex items-center gap-2 shrink-0">
        {/* View Mode Tabs (Diagram | Sequence | Memory | Tables & Packets) */}
        <div
          role="tablist"
          aria-label="Diagram View Mode"
          className="hidden md:flex items-center gap-0.5 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800"
        >
          {viewTabs.map((tab) => {
            const isSelected = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                data-testid={`view-mode-tab-${tab.id}`}
                aria-selected={isSelected}
                onClick={() => onViewModeChange(tab.id)}
                className="relative flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer"
              >
                {isSelected && (
                  <motion.span
                    layoutId="canvasViewModeSlidingPill"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30 }}
                    className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-2xs border border-zinc-200/70 dark:border-zinc-700"
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-1.5 ${
                    isSelected
                      ? 'text-zinc-900 dark:text-white font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Authoritative Sources & Legal Compliance Quick Button */}
        {onOpenSourcesModal && (
          <button
            type="button"
            data-testid="header-sources-legal-btn"
            onClick={onOpenSourcesModal}
            title="View Authoritative Attack Analysis Sources, Citations & Legal Compliance"
            className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg border border-emerald-300/80 dark:border-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden xl:inline">Sources & Legal</span>
          </button>
        )}

        {/* Right Inspector Toggle */}
        <button
          type="button"
          data-testid="toggle-right-inspector-btn"
          aria-label="Toggle right inspector panel"
          title="Toggle Inspector Panel"
          onClick={onToggleInspector}
          className={`h-8 px-2.5 flex items-center gap-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            inspectorOpen
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
              : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <PanelRight className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden lg:inline">Inspector</span>
        </button>

        {/* Unified Settings & Tools Menu (⚙️) */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            data-testid="settings-menu-btn"
            aria-label="Open Settings and Tools menu"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((v) => !v)}
            className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              settingsOpen
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Settings</span>
          </button>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                dir="ltr"
                data-testid="settings-popover-menu"
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-xl shadow-xl p-3 space-y-3 z-50"
              >
                {/* Section 1: View Mode (for mobile < md screens) */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-zinc-400 px-1">
                    Canvas View Mode
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                    {viewTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          onViewModeChange(tab.id);
                          setSettingsOpen(false);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                          viewMode === tab.id
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs font-semibold'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {tab.icon}
                        <span className="truncate">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800/80" />

                {/* Section 2: Workspace Panels & Tools */}
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-zinc-400 px-1">
                    Panels, Tactical Grid & Legal
                  </div>

                  {onToggleTacticalMode && (
                    <button
                      type="button"
                      data-testid="settings-tactical-mode-btn"
                      onClick={() => {
                        onToggleTacticalMode();
                        setSettingsOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Crosshair className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Tactical Grid Overlay</span>
                      </span>
                      <span
                        className={`text-[10.5px] font-mono ${
                          tacticalMode
                            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            : 'text-zinc-400'
                        }`}
                      >
                        {tacticalMode ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    data-testid="toggle-bottom-telemetry-btn"
                    onClick={() => {
                      onToggleTelemetry();
                      setSettingsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <PanelBottom className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Bottom Telemetry Stream</span>
                    </span>
                    <span
                      className={`text-[10.5px] font-mono ${
                        telemetryOpen
                          ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {telemetryOpen ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    type="button"
                    data-testid="open-attack-library-btn"
                    onClick={() => {
                      setSettingsOpen(false);
                      onOpenAttackLibrary();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Library className="w-3.5 h-3.5 text-indigo-500" />
                      <span>MITRE ATT&CK Library</span>
                    </span>
                    <span className="text-[10.5px] text-zinc-400">Open</span>
                  </button>

                  <button
                    type="button"
                    data-testid="open-log-analyzer-btn"
                    onClick={() => {
                      setSettingsOpen(false);
                      onOpenAnalyzerModal();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <SearchCode className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Analyze Custom Raw Log</span>
                    </span>
                    <span className="text-[10.5px] text-zinc-400">Open</span>
                  </button>

                  {onOpenSourcesModal && (
                    <button
                      type="button"
                      data-testid="open-sources-legal-btn"
                      onClick={() => {
                        setSettingsOpen(false);
                        onOpenSourcesModal();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors cursor-pointer font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <Scale className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Sources & Legal Compliance</span>
                      </span>
                      <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400">
                        View
                      </span>
                    </button>
                  )}
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800/80" />

                {/* Section 3: Preferences (Theme & Playback Speed) */}
                <div className="space-y-2">
                  <div className="text-[11px] font-medium text-zinc-400 px-1">
                    Preferences
                  </div>

                  <button
                    type="button"
                    onClick={onToggleDark}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                  >
                    {isDark ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Switch to Light Theme</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Switch to Dark Theme</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between px-1 pt-1">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      Playback Speed
                    </span>
                    <div className="flex items-center gap-1">
                      {[0.5, 1, 2].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          data-testid={`settings-playback-speed-${spd}`}
                          onClick={() => onSpeedChange(spd)}
                          className={`px-2 py-0.5 text-[11px] font-mono rounded-md cursor-pointer ${
                            playbackSpeed === spd
                              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {spd}×
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
