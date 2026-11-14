'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  InspectorScopeMode,
  resolveInspectorScopeContext,
  resolveScopedTelemetrySelection,
} from '@/lib/inspector-scope';
import {
  buildWhiteboardSchematic,
  WhiteboardSketchFlow,
  WhiteboardSketchNode,
} from '@/lib/sketch-zones-and-drilldown';
import {
  instantiateAttackVectorNode,
  PREDEFINED_ATTACK_VECTOR_LIBRARY,
} from '@/lib/canvas-interaction-engine';
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
import { AboutAuthorModal } from './AboutAuthorModal';
import { AttackStepProgressBar } from './AttackStepProgressBar';
import { AnimeIntroLoader } from './AnimeIntroLoader';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { shouldSkipIntroFromSearch } from '@/lib/intro-loader-sequence';
import { resolveKeyboardShortcutCommand } from '@/lib/keyboard-shortcuts';
import {
  applyWorkbenchLayoutMode,
  DEFAULT_LAYOUT_MODE,
  persistLayoutMode,
  readStoredLayoutMode,
  WorkbenchLayoutMode,
} from '@/lib/layout-preference';

export function AttackExplorerWorkbench() {
  // Strictly English-only interface
  const [isDark, setIsDark] = useState<boolean>(false);

  // Minimal Anime Game-Style Entrance Loading Sequence State
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Responsive (native mobile) by default; Desktop available in Settings
  const [layoutMode, setLayoutMode] =
    useState<WorkbenchLayoutMode>(DEFAULT_LAYOUT_MODE);

  const handleCompleteIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      if (shouldSkipIntroFromSearch(window.location.search)) {
        setShowIntro(false);
      }
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      const stored = readStoredLayoutMode();
      setLayoutMode(stored);
      applyWorkbenchLayoutMode(stored);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (layoutMode !== 'DESKTOP') return;
    const refreshDesktopViewport = () =>
      applyWorkbenchLayoutMode('DESKTOP', { refreshPhysicalWidth: true });
    // Only refresh on orientation changes — not every resize/pinch (that would
    // reset scale using the already-overridden layout width).
    window.addEventListener('orientationchange', refreshDesktopViewport);
    return () => {
      window.removeEventListener('orientationchange', refreshDesktopViewport);
    };
  }, [layoutMode]);

  const handleLayoutModeChange = (mode: WorkbenchLayoutMode) => {
    setLayoutMode(mode);
    persistLayoutMode(mode);
    applyWorkbenchLayoutMode(mode);
  };

  // Tactical Mode Grid Overlay & Diagram Legend State
  const [tacticalMode, setTacticalMode] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(true);

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

  // Top Workbench Toolbar Graph Node & MITRE Search + Auto-Layout State
  const [nodeSearchQuery, setNodeSearchQuery] = useState<string>('');
  const [activeGraphNodes, setActiveGraphNodes] = useState<
    WhiteboardSketchNode[]
  >([]);
  const [focusedSearchNodeId, setFocusedSearchNodeId] = useState<string | null>(
    null
  );
  const [focusSearchSeq, setFocusSearchSeq] = useState<number>(0);
  const [autoLayoutTriggerSeq, setAutoLayoutTriggerSeq] = useState<number>(0);
  const [isAutoLayoutActive, setIsAutoLayoutActive] = useState<boolean>(false);

  // Custom Drag-and-Drop / Injected Attack Vector Nodes & Flows per Scenario
  const [injectedVectorsByScenario, setInjectedVectorsByScenario] = useState<
    Record<
      string,
      { nodes: WhiteboardSketchNode[]; flows: WhiteboardSketchFlow[] }
    >
  >({});

  // Simulation Step & Selection State (0 = Overview, 1..N = Stage 1..N)
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [cinematicPhase, setCinematicPhase] = useState<CinematicPhase | null>(
    'OVERVIEW'
  );
  const [selectedTelemetryId, setSelectedTelemetryId] = useState<string | null>(
    null
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [selectedInternalSubNodeId, setSelectedInternalSubNodeId] = useState<
    string | null
  >(null);
  const [inspectorScopeOverride, setInspectorScopeOverride] =
    useState<InspectorScopeMode | null>(null);
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
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState<boolean>(false);

  // Responsive chrome: only auto-toggle side panels in true responsive mode
  useEffect(() => {
    if (layoutMode === 'DESKTOP') {
      const desktopRafId = window.requestAnimationFrame(() => {
        setSidebarOpen(false);
        setInspectorOpen(false);
      });
      return () => window.cancelAnimationFrame(desktopRafId);
    }

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
  }, [layoutMode]);

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

  const currentInjectedVectors = useMemo(
    () =>
      injectedVectorsByScenario[activeScenario.id] || {
        nodes: [],
        flows: [],
      },
    [injectedVectorsByScenario, activeScenario.id]
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

  const inspectorScopeContext = useMemo(
    () =>
      resolveInspectorScopeContext({
        scenario: activeScenario,
        activeStageIndex,
        activeEnvironment,
        selectedNodeId,
        expandedNodeId,
        selectedInternalSubNodeId,
        scopeOverride: inspectorScopeOverride,
      }),
    [
      activeScenario,
      activeStageIndex,
      activeEnvironment,
      selectedNodeId,
      expandedNodeId,
      selectedInternalSubNodeId,
      inspectorScopeOverride,
    ]
  );

  const selectedTelemetry = useMemo(() => {
    const scoped = resolveScopedTelemetrySelection({
      scenario: activeScenario,
      selectedTelemetryId,
      internalSubBoard: inspectorScopeContext.internalSubBoard,
      activeEnvironment,
    });
    if (scoped || !selectedTelemetryId) return scoped;
    const injectedFlow = currentInjectedVectors.flows.find(
      (f) => f.telemetryEvent.id === selectedTelemetryId
    );
    return injectedFlow ? injectedFlow.telemetryEvent : null;
  }, [
    activeScenario,
    selectedTelemetryId,
    activeEnvironment,
    inspectorScopeContext.internalSubBoard,
    currentInjectedVectors.flows,
  ]);

  const handleExpandedNodeChange = useCallback((nodeId: string | null) => {
    setExpandedNodeId(nodeId);
    setSelectedInternalSubNodeId(null);
    setInspectorScopeOverride(null);
    setSelectedTelemetryId(null);
  }, []);

  const handleSelectInternalSubNode = useCallback(
    (subNodeId: string | null) => {
      setSelectedInternalSubNodeId(subNodeId);
      setInspectorScopeOverride(null);
      setSelectedTelemetryId(null);
    },
    []
  );

  const handleFocusGraphNode = useCallback((nodeId: string) => {
    setFocusedSearchNodeId(nodeId);
    setFocusSearchSeq((prev) => prev + 1);
    setSelectedNodeId(nodeId);
  }, []);

  const handleTriggerAutoLayout = useCallback(() => {
    setAutoLayoutTriggerSeq((prev) => prev + 1);
  }, []);

  const handleInjectAttackVector = useCallback(
    (vectorId: string, dropCoords?: { wx: number; wy: number }) => {
      const template = PREDEFINED_ATTACK_VECTOR_LIBRARY.find(
        (v) => v.id === vectorId
      );
      if (!template) return;

      if (viewMode !== 'TOPOLOGY') {
        setViewMode('TOPOLOGY');
      }

      setInjectedVectorsByScenario((prev) => {
        const current = prev[activeScenario.id] || { nodes: [], flows: [] };
        const baseSchematic = buildWhiteboardSchematic(
          activeScenario,
          activeStageIndex,
          activeEnvironment
        );
        const existingNodes = [...baseSchematic.nodes, ...current.nodes];
        const existingFlows = [...baseSchematic.flows, ...current.flows];
        const { node, flow } = instantiateAttackVectorNode({
          template,
          existingNodes,
          existingFlows,
          dropWx: dropCoords?.wx,
          dropWy: dropCoords?.wy,
          activeStageIndex: activeStageIndex > 0 ? activeStageIndex : 1,
          sequenceOffset: current.nodes.length + 1,
        });

        setSelectedNodeId(node.id);
        if (flow) {
          setSelectedTelemetryId(flow.telemetryEvent.id);
        }

        return {
          ...prev,
          [activeScenario.id]: {
            nodes: [...current.nodes, node],
            flows: flow ? [...current.flows, flow] : current.flows,
          },
        };
      });

      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    },
    [activeEnvironment, activeScenario, activeStageIndex, viewMode]
  );

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
    setExpandedNodeId(null);
    setSelectedInternalSubNodeId(null);
    setInspectorScopeOverride(null);
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
    setExpandedNodeId(null);
    setSelectedInternalSubNodeId(null);
    setInspectorScopeOverride(null);
  };

  const handleStartGuidedWalkthrough = () => {
    setSelectedTelemetryId(null);
    setSelectedNodeId(null);
    setExpandedNodeId(null);
    setSelectedInternalSubNodeId(null);
    setInspectorScopeOverride(null);
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
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
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

  // Global Workbench Hotkeys (?, T, L, 1-4, [, ], Space, Esc)
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const command = resolveKeyboardShortcutCommand({
        key: e.key,
        code: e.code,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        targetTagName: target?.tagName,
        isContentEditable: target?.isContentEditable,
      });

      if (!command) return;

      if (command === 'TOGGLE_SHORTCUTS_HELP') {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
      } else if (command === 'ESCAPE') {
        setShortcutsModalOpen(false);
        setAttackLibraryOpen(false);
        setAnalyzerModalOpen(false);
        setSourcesModalOpen(false);
      } else if (command === 'TOGGLE_TACTICAL') {
        e.preventDefault();
        setTacticalMode((prev) => !prev);
      } else if (command === 'TOGGLE_LEGEND') {
        e.preventDefault();
        setShowLegend((prev) => !prev);
      } else if (command === 'VIEW_TOPOLOGY') {
        e.preventDefault();
        setViewMode('TOPOLOGY');
      } else if (command === 'VIEW_SEQUENCE') {
        e.preventDefault();
        setViewMode('SEQUENCE');
      } else if (command === 'VIEW_PROCESS_MEMORY') {
        e.preventDefault();
        setViewMode('PROCESS_MEMORY');
      } else if (command === 'VIEW_RAW_TABLES') {
        e.preventDefault();
        setViewMode('RAW_TABLES');
      } else if (command === 'STEP_BACKWARD') {
        e.preventDefault();
        setIsPlaying(false);
        setSelectedTelemetryId(null);
        setActiveStageIndex((prev) => {
          const next = stepBackward(prev);
          setCinematicPhase(next === 0 ? 'OVERVIEW' : 'STAGE_ACTIVE');
          return next;
        });
      } else if (command === 'STEP_FORWARD') {
        e.preventDefault();
        setIsPlaying(false);
        setSelectedTelemetryId(null);
        setCinematicPhase('STAGE_ACTIVE');
        setActiveStageIndex((prev) => stepForward(activeScenario, prev));
      } else if (
        command === 'PLAY_PAUSE_SEQUENCE' &&
        target?.tagName !== 'BUTTON'
      ) {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, [activeScenario]);

  return (
    <ActiveEnvironmentProvider
      value={activeEnvironment}
      onChange={setActiveEnvironment}
    >
      <div
        data-testid="workbench-root"
        data-active-environment={activeEnvironment}
        data-tactical-mode={tacticalMode ? 'true' : 'false'}
        data-intro-active={showIntro ? 'true' : 'false'}
        data-layout-mode={layoutMode}
        onContextMenu={(e) => e.preventDefault()}
        dir="ltr"
        className="min-h-screen h-screen flex flex-col bg-[#F4F4F5]/60 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 overflow-hidden"
      >
        {/* Minimal Anime Game-Style Entrance Loading Sequence */}
        <AnimatePresence mode="sync">
          {showIntro && (
            <AnimeIntroLoader
              key="anime-intro-loader"
              onComplete={handleCompleteIntro}
            />
          )}
        </AnimatePresence>

        {/* Main workbench reveals with motion after intro exits (no hard cut) */}
        <motion.div
          data-testid="workbench-shell"
          data-workbench-revealed={showIntro ? 'false' : 'true'}
          aria-hidden={showIntro}
          initial={false}
          animate={
            showIntro
              ? {
                  opacity: 0,
                }
              : {
                  opacity: 1,
                }
          }
          transition={{
            duration: 0.35,
            ease: 'easeOut',
          }}
          className={`flex flex-col flex-1 min-h-0 origin-center ${
            showIntro ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
        {/* Persistent Navigation Bar with Animated Logo, Navigation Links & Slide-Out Settings Drawer */}
        <AttackHeader
          scenario={activeScenario}
          stageView={stageView}
          activeEnvironment={activeEnvironment}
          onSelectEnvironment={setActiveEnvironment}
          tacticalMode={tacticalMode}
          onToggleTacticalMode={() => setTacticalMode((prev) => !prev)}
          showLegend={showLegend}
          onToggleLegend={() => setShowLegend((prev) => !prev)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSelectStage={handleSelectStage}
          onSelectScenario={(id) => handleSelectScenario(id, 0)}
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
          onToggleSidebar={() => {
            setSidebarOpen((prev) => {
              const next = !prev;
              if (next && typeof window !== 'undefined' && window.innerWidth < 1024) {
                setInspectorOpen(false);
              }
              return next;
            });
          }}
          inspectorOpen={inspectorOpen}
          onToggleInspector={() => {
            setInspectorOpen((prev) => {
              const next = !prev;
              if (next && typeof window !== 'undefined' && window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
              return next;
            });
          }}
          telemetryOpen={telemetryOpen}
          onToggleTelemetry={() => setTelemetryOpen((prev) => !prev)}
          onOpenAttackLibrary={() => setAttackLibraryOpen(true)}
          onOpenAnalyzerModal={() => setAnalyzerModalOpen(true)}
          onOpenSourcesModal={() => setSourcesModalOpen(true)}
          onOpenAboutModal={() => setAboutModalOpen(true)}
          onOpenShortcutsModal={() => setShortcutsModalOpen(true)}
          layoutMode={layoutMode}
          onLayoutModeChange={handleLayoutModeChange}
          onReplayIntro={() => setShowIntro(true)}
          nodeSearchQuery={nodeSearchQuery}
          onNodeSearchQueryChange={setNodeSearchQuery}
          graphNodes={activeGraphNodes}
          onFocusGraphNode={handleFocusGraphNode}
          onTriggerAutoLayout={handleTriggerAutoLayout}
          isAutoLayoutActive={isAutoLayoutActive}
        />

        {/* Visual Step-Indicator Progress Bar Synchronized with Animation State */}
        <AttackStepProgressBar
          scenario={activeScenario}
          activeStageIndex={activeStageIndex}
          isPlaying={isPlaying}
          onSelectStage={handleSelectStage}
        />

        <main
          onContextMenu={(e) => e.preventDefault()}
          className="relative flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden"
        >
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
                className="lg:hidden absolute inset-0 z-40 bg-black/35 backdrop-blur-[1px]"
              />
            )}
          </AnimatePresence>

          {/* Left Collapsible Scenarios & Attack Vectors Sidebar */}
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
                onInjectAttackVector={(vectorId) =>
                  handleInjectAttackVector(vectorId)
                }
              />
            )}
          </AnimatePresence>

          <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto sm:overflow-hidden">
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto sm:overflow-hidden">
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
                expandedNodeId={expandedNodeId}
                onExpandedNodeChange={handleExpandedNodeChange}
                selectedInternalSubNodeId={selectedInternalSubNodeId}
                onSelectInternalSubNode={handleSelectInternalSubNode}
                onSelectStage={handleSelectStage}
                cinematicPhase={cinematicPhase}
                isPlaying={isPlaying}
                onStartWalkthrough={handleStartGuidedWalkthrough}
                onResetWalkthrough={handleReset}
                onTogglePlay={handleTogglePlay}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                canStepBackward={activeStageIndex > 0}
                canStepForward={activeStageIndex < activeScenario.stages.length}
                playbackSpeed={playbackSpeed}
                onSpeedChange={setPlaybackSpeed}
                showLegend={showLegend}
                onToggleLegend={() => setShowLegend((prev) => !prev)}
                shortcutsModalOpen={shortcutsModalOpen}
                onOpenShortcutsModal={() => setShortcutsModalOpen(true)}
                onCloseShortcutsModal={() => setShortcutsModalOpen(false)}
                nodeSearchQuery={nodeSearchQuery}
                onNodeSearchQueryChange={setNodeSearchQuery}
                focusedSearchNodeId={focusedSearchNodeId}
                focusSearchSeq={focusSearchSeq}
                autoLayoutTriggerSeq={autoLayoutTriggerSeq}
                onAutoLayoutActiveChange={setIsAutoLayoutActive}
                onActiveNodesChange={setActiveGraphNodes}
                customInjectedNodes={currentInjectedVectors.nodes}
                customInjectedFlows={currentInjectedVectors.flows}
                onDropAttackVector={handleInjectAttackVector}
                forceDesktopCanvas={layoutMode === 'DESKTOP'}
              />

              {/* Right Collapsible & Resizable Story, Steps, SIEM & Sources Inspector Panel */}
              <AnimatePresence initial={false}>
                {inspectorOpen && (
                  <InspectorPanel
                    scenario={activeScenario}
                    currentStage={stageView.currentStage}
                    cinematicPhase={cinematicPhase}
                    isPlaying={isPlaying}
                    activeEnvironment={activeEnvironment}
                    selectedTelemetry={selectedTelemetry}
                    onSelectTelemetry={handleSelectTelemetry}
                    onSelectStage={handleSelectStage}
                    onStartWalkthrough={handleStartGuidedWalkthrough}
                    onTogglePlay={handleTogglePlay}
                    onResetWalkthrough={handleReset}
                    onClearTelemetrySelection={() => setSelectedTelemetryId(null)}
                    onOpenSourcesModal={() => setSourcesModalOpen(true)}
                    scopeContext={inspectorScopeContext}
                    onSelectNode={setSelectedNodeId}
                    onExpandedNodeChange={handleExpandedNodeChange}
                    onSelectInternalSubNode={handleSelectInternalSubNode}
                    onScopeOverrideChange={setInspectorScopeOverride}
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
                  events={
                    inspectorScopeContext.effectiveScope !== 'MAIN_SCENARIO'
                      ? inspectorScopeContext.scopedTelemetryEvents
                      : stageView.visibleTelemetry
                  }
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
        </motion.div>

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

        <AboutAuthorModal
          isOpen={aboutModalOpen}
          onClose={() => setAboutModalOpen(false)}
        />

        {/* Fallback Keyboard Shortcuts Modal when not in TOPOLOGY view */}
        {viewMode !== 'TOPOLOGY' && (
          <KeyboardShortcutsModal
            isOpen={shortcutsModalOpen}
            onClose={() => setShortcutsModalOpen(false)}
            tacticalMode={tacticalMode}
            showLegend={showLegend}
            isPlaying={isPlaying}
            onExecuteCommand={(cmd) => {
              if (cmd === 'TOGGLE_TACTICAL') setTacticalMode((v) => !v);
              else if (cmd === 'TOGGLE_LEGEND') setShowLegend((v) => !v);
              else if (cmd === 'PLAY_PAUSE_SEQUENCE') handleTogglePlay();
              else if (cmd === 'STEP_BACKWARD') handleStepBackward();
              else if (cmd === 'STEP_FORWARD') handleStepForward();
              else if (cmd === 'ESCAPE') setShortcutsModalOpen(false);
            }}
          />
        )}
      </div>
    </ActiveEnvironmentProvider>
  );
}
