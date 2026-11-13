'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ATTACK_SCENARIOS,
  AttackCategory,
  TelemetryEvent,
  TelemetrySourceType } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  computeStageView,
  DEFAULT_ACTIVE_ENVIRONMENT,
  DEFAULT_PLAYBACK_SPEED,
  filterScenarios,
  ScenarioGroupByMode,
  ScenarioSortOption,
  stepBackward,
  stepForward,
  tagTelemetryEventWithEnvironment } from '@/lib/simulation-engine';
import { ActiveEnvironmentProvider } from '@/lib/active-environment-context';
import { CinematicPhase } from '@/lib/cinematic-camera-director';
import { AttackHeader } from './AttackHeader';
import { AttackSidebar } from './AttackSidebar';
import { AttackLibrary } from './AttackLibrary';
import { CanvasViewMode, DiagramCanvas } from './DiagramCanvas';
import { DEFAULT_INSPECTOR_WIDTH, InspectorPanel } from './InspectorPanel';
import {
  DEFAULT_TELEMETRY_HEIGHT,
  TelemetryFlowPanel } from './TelemetryFlowPanel';
import { LogAnalyzerModal } from './LogAnalyzerModal';
import { SourcesAndLegalModal } from './SourcesAndLegalModal';

export function AttackExplorerWorkbench() {
  // Strictly English-only interface
  const [isDark, setIsDark] = useState<boolean>(false);

  // Tactical Mode Grid Overlay State
  const [tacticalMode, setTacticalMode] = useState<boolean>(false);

  // Current Active Environment State ('WORKSTATION' | 'SERVER' | 'CLOUD')
  const [activeEnvironment, setActiveEnvironment] =
    useState<ActiveEnvironmentId>(DEFAULT_ACTIVE_ENVIRONMENT);

  // Scenario, Filter, Sort & Categorize State
  const [category, setCategory] = useState<AttackCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<ScenarioSortOption>('DEFAULT');
  const [groupBy, setGroupBy] = useState<ScenarioGroupByMode>('CATEGORY');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    ATTACK_SCENARIOS[0].id
  );

  // Simulation Step & Selection State (0 = Overview, 1..N = Stage 1..N)
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [cinematicPhase, setCinematicPhase] = useState<CinematicPhase | null>(
    'OVERVIEW'
  );
  const [selectedTelemetryId, setSelectedTelemetryId] = useState<string | null>(
    null
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [telemetryFilter, setTelemetryFilter] = useState<
    TelemetrySourceType | 'ALL'
  >('ALL');
  const [viewMode, setViewMode] = useState<CanvasViewMode>('TOPOLOGY');

  // Playback, Collapsible & Resizable Panels & Modal State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(
    DEFAULT_PLAYBACK_SPEED
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);
  const [inspectorWidth, setInspectorWidth] = useState<number>(
    DEFAULT_INSPECTOR_WIDTH
  );
  const [telemetryOpen, setTelemetryOpen] = useState<boolean>(false);
  const [telemetryHeight, setTelemetryHeight] = useState<number>(
    DEFAULT_TELEMETRY_HEIGHT
  );
  const [attackLibraryOpen, setAttackLibraryOpen] = useState<boolean>(false);
  const [analyzerModalOpen, setAnalyzerModalOpen] = useState<boolean>(false);
  const [sourcesModalOpen, setSourcesModalOpen] = useState<boolean>(false);

  // Responsive viewport adaptation
  useEffect(() => {
    let wasDesktop = window.innerWidth >= 1024;
    const rafId = window.requestAnimationFrame(() => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        setInspectorOpen(false);
      }
    });
    const handleResize = () => {
      const isNowDesktop = window.innerWidth >= 1024;
      if (isNowDesktop !== wasDesktop) {
        wasDesktop = isNowDesktop;
        setSidebarOpen(isNowDesktop);
        setInspectorOpen(isNowDesktop);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync Dark Mode class with <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const filteredScenarios = useMemo(
    () => filterScenarios(ATTACK_SCENARIOS, category, searchQuery),
    [category, searchQuery]
  );

  const activeScenario = useMemo(
    () =>
      ATTACK_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
      ATTACK_SCENARIOS[0],
    [selectedScenarioId]
  );

  const stageView = useMemo(
    () =>
      computeStageView(
        activeScenario,
        activeStageIndex,
        telemetryFilter,
        activeEnvironment
      ),
    [activeScenario, activeStageIndex, telemetryFilter, activeEnvironment]
  );

  const selectedTelemetry = useMemo(() => {
    const found =
      activeScenario.telemetry.find((t) => t.id === selectedTelemetryId) ||
      null;
    return found
      ? tagTelemetryEventWithEnvironment(found, activeEnvironment)
      : null;
  }, [activeScenario, selectedTelemetryId, activeEnvironment]);

  // Prince-of-Persia / Protocol-Explorer Cinematic Walkthrough Sequencer
  useEffect(() => {
    if (!isPlaying) return;

    if (cinematicPhase === 'INTRO_SURVEY') {
      const t1 = window.setTimeout(() => {
        setCinematicPhase('INTRO_FOCUS_ORIGIN');
      }, Math.round(850 / playbackSpeed));
      return () => window.clearTimeout(t1);
    }

    if (cinematicPhase === 'INTRO_FOCUS_ORIGIN') {
      const t2 = window.setTimeout(() => {
        setCinematicPhase('STAGE_ACTIVE');
      }, Math.round(850 / playbackSpeed));
      return () => window.clearTimeout(t2);
    }

    const intervalMs = Math.round(2300 / playbackSpeed);
    const timer = window.setInterval(() => {
      setActiveStageIndex((prev) => {
        if (prev >= activeScenario.stages.length) {
          setIsPlaying(false);
          setCinematicPhase('OUTRO_COMPLETE');
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, cinematicPhase, playbackSpeed, activeScenario.stages.length]);

  const handleSelectScenario = (scenarioId: string, stageIdx: number = 0) => {
    setSelectedScenarioId(scenarioId);
    setActiveStageIndex(stageIdx);
    setCinematicPhase(stageIdx === 0 ? 'OVERVIEW' : 'STAGE_ACTIVE');
    setSelectedTelemetryId(null);
    setSelectedNodeId(null);
    setIsPlaying(false);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleSelectStage = (stageIdx: number) => {
    setIsPlaying(false);
    setActiveStageIndex(stageIdx);
    setCinematicPhase(stageIdx === 0 ? 'OVERVIEW' : 'STAGE_ACTIVE');
    setSelectedTelemetryId(null);
    setSelectedNodeId(null);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setSelectedTelemetryId(null);
    setCinematicPhase('STAGE_ACTIVE');
    setActiveStageIndex((prev) => stepForward(activeScenario, prev));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setSelectedTelemetryId(null);
    setActiveStageIndex((prev) => {
      const next = stepBackward(prev);
      setCinematicPhase(next === 0 ? 'OVERVIEW' : 'STAGE_ACTIVE');
      return next;
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStageIndex(0);
    setCinematicPhase('OVERVIEW');
    setSelectedTelemetryId(null);
    setSelectedNodeId(null);
  };

  const handleStartGuidedWalkthrough = () => {
    setSelectedTelemetryId(null);
    setSelectedNodeId(null);
    setActiveStageIndex(1);
    setCinematicPhase('INTRO_SURVEY');
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (
      !isPlaying &&
      (activeStageIndex === 0 ||
        activeStageIndex >= activeScenario.stages.length ||
        cinematicPhase === 'OUTRO_COMPLETE')
    ) {
      handleStartGuidedWalkthrough();
    } else if (!isPlaying) {
      setCinematicPhase('STAGE_ACTIVE');
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSelectTelemetry = (event: TelemetryEvent) => {
    setIsPlaying(false);
    setSelectedTelemetryId((prev) => (prev === event.id ? null : event.id));
    if (!inspectorOpen) {
      setInspectorOpen(true);
    }
  };

  const displayedScenarios = useMemo(() => {
    if (category === 'ACTIVE_DIRECTORY') {
      const q = searchQuery.trim().toLowerCase();
      return ATTACK_SCENARIOS.filter(
        (s) =>
          (s.category === 'ACTIVE_DIRECTORY' ||
            s.category === 'NETWORK_WEB') &&
          (!q ||
            s.name.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q))
      );
    }
    return filteredScenarios;
  }, [category, searchQuery, filteredScenarios]);

  return (
    <ActiveEnvironmentProvider
      value={activeEnvironment}
      onChange={setActiveEnvironment}
    >
      <div
        data-testid="workbench-root"
        data-active-environment={activeEnvironment}
        data-tactical-mode={tacticalMode ? 'true' : 'false'}
        dir="ltr"
        className="min-h-screen h-screen flex flex-col bg-[#F4F4F5]/60 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 overflow-hidden"
      >
        {/* Single Unified 48px Top Bar with Active Environment Badge/Dropdown, Tactical Mode Toggle & Sources */}
        <AttackHeader
          scenario={activeScenario}
          stageView={stageView}
          activeEnvironment={activeEnvironment}
          onSelectEnvironment={setActiveEnvironment}
          tacticalMode={tacticalMode}
          onToggleTacticalMode={() => setTacticalMode((prev) => !prev)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSelectStage={handleSelectStage}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onReset={handleReset}
          canStepBackward={activeStageIndex > 0}
          canStepForward={activeStageIndex < activeScenario.stages.length}
          playbackSpeed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          isDark={isDark}
          onToggleDark={() => setIsDark((prev) => !prev)}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          inspectorOpen={inspectorOpen}
          onToggleInspector={() => setInspectorOpen((prev) => !prev)}
          telemetryOpen={telemetryOpen}
          onToggleTelemetry={() => setTelemetryOpen((prev) => !prev)}
          onOpenAttackLibrary={() => setAttackLibraryOpen(true)}
          onOpenAnalyzerModal={() => setAnalyzerModalOpen(true)}
          onOpenSourcesModal={() => setSourcesModalOpen(true)}
        />

        <main className="relative flex-1 flex min-h-0 overflow-hidden">
          {/* Mobile/Tablet Backdrop when a side drawer is open */}
          <AnimatePresence>
            {(sidebarOpen || inspectorOpen) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setSidebarOpen(false);
                  setInspectorOpen(false);
                }}
                className="lg:hidden fixed inset-0 top-12 z-20 bg-black/35 backdrop-blur-[1px]"
              />
            )}
          </AnimatePresence>

          {/* Left Collapsible Scenarios Sidebar */}
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <AttackSidebar
                category={category}
                onSelectCategory={setCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                displayedScenarios={displayedScenarios}
                activeScenarioId={activeScenario.id}
                onSelectScenario={(id) => handleSelectScenario(id, 0)}
                sortBy={sortBy}
                onSortChange={setSortBy}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
              />
            )}
          </AnimatePresence>

          <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
            <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
              <DiagramCanvas
                scenario={activeScenario}
                stageView={stageView}
                activeEnvironment={activeEnvironment}
                onSelectEnvironment={setActiveEnvironment}
                tacticalMode={tacticalMode}
                onToggleTacticalMode={() => setTacticalMode((prev) => !prev)}
                viewMode={viewMode}
                selectedTelemetryId={selectedTelemetryId}
                onSelectTelemetry={handleSelectTelemetry}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                onSelectStage={handleSelectStage}
                cinematicPhase={cinematicPhase}
                isPlaying={isPlaying}
                onStartWalkthrough={handleStartGuidedWalkthrough}
                onResetWalkthrough={handleReset}
              />

              {/* Right Collapsible & Resizable Story, SIEM & Sources Inspector Panel */}
              <AnimatePresence initial={false}>
                {inspectorOpen && (
                  <InspectorPanel
                    scenario={activeScenario}
                    currentStage={stageView.currentStage}
                    activeEnvironment={activeEnvironment}
                    selectedTelemetry={selectedTelemetry}
                    onSelectTelemetry={handleSelectTelemetry}
                    onSelectStage={handleSelectStage}
                    onStartWalkthrough={handleStartGuidedWalkthrough}
                    onClearTelemetrySelection={() => setSelectedTelemetryId(null)}
                    onOpenSourcesModal={() => setSourcesModalOpen(true)}
                    width={inspectorWidth}
                    onResizeWidth={setInspectorWidth}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Collapsible & Resizable Telemetry Stream Panel */}
            <AnimatePresence initial={false}>
              {telemetryOpen && (
                <TelemetryFlowPanel
                  events={stageView.visibleTelemetry}
                  activeEnvironment={activeEnvironment}
                  selectedTelemetryId={selectedTelemetryId}
                  onSelectTelemetry={handleSelectTelemetry}
                  telemetryFilter={telemetryFilter}
                  onTelemetryFilterChange={setTelemetryFilter}
                  activeStageIndex={activeStageIndex}
                  height={telemetryHeight}
                  onResizeHeight={setTelemetryHeight}
                />
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* MITRE ATT&CK Technique & Scenario Library Modal */}
        <AttackLibrary
          isOpen={attackLibraryOpen}
          onClose={() => setAttackLibraryOpen(false)}
          activeScenarioId={activeScenario.id}
          onSelectScenario={handleSelectScenario}
        />

        {/* Interactive Raw Log & Malware Trace Analyzer Modal */}
        <LogAnalyzerModal
          isOpen={analyzerModalOpen}
          onClose={() => setAnalyzerModalOpen(false)}
          onSelectScenario={(id) => handleSelectScenario(id, 0)}
        />

        {/* Authoritative Sources, Citations & Legal Compliance Modal */}
        <SourcesAndLegalModal
          isOpen={sourcesModalOpen}
          onClose={() => setSourcesModalOpen(false)}
          scenario={activeScenario}
        />
      </div>
    </ActiveEnvironmentProvider>
  );
}
