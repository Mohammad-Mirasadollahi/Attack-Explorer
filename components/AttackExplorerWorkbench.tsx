'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ATTACK_SCENARIOS,
  AttackCategory,
  TelemetryEvent } from '@/lib/attack-scenarios';
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
import dynamic from 'next/dynamic';
import { AttackHeader } from './AttackHeader';
import { AttackSidebar } from './AttackSidebar';
import { CanvasViewMode, DiagramCanvas } from './DiagramCanvas';
import {
  DEFAULT_INSPECTOR_WIDTH,
  FloatingHoverInspectorTrigger,
  InspectorPanel,
  InspectorTab,
} from './InspectorPanel';
const AnimeIntroLoader = dynamic(() =>
  import('./AnimeIntroLoader').then((m) => m.AnimeIntroLoader)
);
const AttackLibrary = dynamic(() =>
  import('./AttackLibrary').then((m) => m.AttackLibrary)
);
const LogAnalyzerModal = dynamic(() =>
  import('./LogAnalyzerModal').then((m) => m.LogAnalyzerModal)
);
const SourcesAndLegalModal = dynamic(() =>
  import('./SourcesAndLegalModal').then((m) => m.SourcesAndLegalModal)
);
const AboutAuthorModal = dynamic(() =>
  import('./AboutAuthorModal').then((m) => m.AboutAuthorModal)
);
const KeyboardShortcutsModal = dynamic(() =>
  import('./KeyboardShortcutsModal').then((m) => m.KeyboardShortcutsModal)
);
import { shouldSkipIntroFromSearch } from '@/lib/intro-loader-sequence';
import { resolveKeyboardShortcutCommand } from '@/lib/keyboard-shortcuts';
import {
  applyWorkbenchLayoutMode,
  DEFAULT_LAYOUT_MODE,
  persistLayoutMode,
  readStoredLayoutMode,
  WorkbenchLayoutMode,
} from '@/lib/layout-preference';
import {
  hasStoredDiagramSnapshot,
  readLastVisitedDiagramSnapshot,
  saveLastVisitedDiagramSnapshot,
} from '@/lib/diagram-memory-store';

export function AttackExplorerWorkbench() {
  // Strictly English-only interface
  const [isDark, setIsDark] = useState<boolean>(false);

  // Default to false on SSR & initial load so crawlers, Lighthouse, and users see the workbench immediately without LCP delay or aria-hidden
  const [showIntro, setShowIntro] = useState<boolean>(false);

  // Responsive (native mobile) by default; Desktop available in Settings
  const [layoutMode, setLayoutMode] =
    useState<WorkbenchLayoutMode>(DEFAULT_LAYOUT_MODE);

  const handleCompleteIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('intro') === '1' &&
        !shouldSkipIntroFromSearch(window.location.search) &&
        !hasStoredDiagramSnapshot()
      ) {
        setShowIntro(true);
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

  // Top Workbench Toolbar Graph Node & MITRE Search State
  const [nodeSearchQuery, setNodeSearchQuery] = useState<string>('');
  const [activeGraphNodes, setActiveGraphNodes] = useState<
    WhiteboardSketchNode[]
  >([]);
  const [focusedSearchNodeId, setFocusedSearchNodeId] = useState<string | null>(
    null
  );
  const [focusSearchSeq, setFocusSearchSeq] = useState<number>(0);

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
  const [viewMode, setViewMode] = useState<CanvasViewMode>('TOPOLOGY');

  // Playback, Collapsible Sidebar & Dedicated Full-Screen Inspector Page State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(
    DEFAULT_PLAYBACK_SPEED
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  // Inspector is now a dedicated full-screen page (closed by default on the diagram page, opened via Hover Inspector trigger or Header button)
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('OVERVIEW');
  const [inspectorWidth, setInspectorWidth] = useState<number>(
    DEFAULT_INSPECTOR_WIDTH
  );
  const [attackLibraryOpen, setAttackLibraryOpen] = useState<boolean>(false);
  const [analyzerModalOpen, setAnalyzerModalOpen] = useState<boolean>(false);
  const [sourcesModalOpen, setSourcesModalOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState<boolean>(false);

  // Restore last visited workbench state or URL ?scenario=<id> parameter on mount
  const [memoryHydrated, setMemoryHydrated] = useState<boolean>(false);
  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      const remembered = readLastVisitedDiagramSnapshot(ATTACK_SCENARIOS[0].id);
      let queryScenarioId: string | null = null;
      try {
        const params = new URLSearchParams(window.location.search);
        queryScenarioId = params.get('scenario');
      } catch {
        queryScenarioId = null;
      }

      const queryScenario = queryScenarioId
        ? ATTACK_SCENARIOS.find((s) => s.id === queryScenarioId)
        : undefined;

      if (queryScenario) {
        setSelectedScenarioId(queryScenario.id);
        setActiveStageIndex(0);
        setCinematicPhase('OVERVIEW');
        setShowIntro(false);
      } else {
        const validScenario = ATTACK_SCENARIOS.find(
          (s) => s.id === remembered.scenarioId
        );
        if (validScenario) {
          setSelectedScenarioId(validScenario.id);
          const clampedStage = Math.min(
            remembered.activeStageIndex,
            validScenario.stages.length
          );
          setActiveStageIndex(clampedStage);
          setCinematicPhase(clampedStage === 0 ? 'OVERVIEW' : 'STAGE_ACTIVE');
        }
      }
      setActiveEnvironment(remembered.activeEnvironment);
      setExpandedNodeId(queryScenario ? null : remembered.expandedNodeId);
      setSelectedNodeId(queryScenario ? null : remembered.selectedNodeId);
      setSelectedInternalSubNodeId(
        queryScenario ? null : remembered.selectedInternalSubNodeId
      );
      setSelectedTelemetryId(
        queryScenario ? null : remembered.selectedTelemetryId
      );
      setTacticalMode(remembered.tacticalMode);
      setViewMode(remembered.viewMode);
      setInspectorOpen(queryScenario ? false : remembered.inspectorOpen);
      setInspectorTab(remembered.inspectorTab);
      setInspectorScopeOverride(
        queryScenario ? null : remembered.inspectorScopeOverride
      );
      setIsDark(remembered.isDark);
      setPlaybackSpeed(remembered.playbackSpeed);
      setMemoryHydrated(true);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Automatically save the complete workbench state in localStorage whenever the user interacts with stage, node, or view configuration
  useEffect(() => {
    if (!memoryHydrated) return;
    saveLastVisitedDiagramSnapshot({
      scenarioId: selectedScenarioId,
      activeStageIndex,
      activeEnvironment,
      expandedNodeId,
      selectedNodeId,
      selectedInternalSubNodeId,
      selectedTelemetryId,
      tacticalMode,
      viewMode,
      inspectorOpen,
      inspectorTab,
      inspectorScopeOverride,
      isDark,
      playbackSpeed,
    });
  }, [
    memoryHydrated,
    viewMode,
    inspectorOpen,
    inspectorTab,
    inspectorScopeOverride,
    isDark,
    playbackSpeed,
    selectedScenarioId,
    activeStageIndex,
    activeEnvironment,
    expandedNodeId,
    selectedNodeId,
    selectedInternalSubNodeId,
    selectedTelemetryId,
    tacticalMode,
  ]);

  // Handler when clicking the "Attack Explorer" logo: return immediately to the active diagram view
  const handleReturnToLastVisitedDiagram = useCallback(() => {
    setViewMode('TOPOLOGY');
    setInspectorOpen(false);
    setAttackLibraryOpen(false);
    setAnalyzerModalOpen(false);
    setSourcesModalOpen(false);
    setAboutModalOpen(false);
    setShortcutsModalOpen(false);
  }, []);

  // Responsive chrome: only auto-toggle left sidebar in responsive mode
  useEffect(() => {
    if (layoutMode === 'DESKTOP') {
      const desktopRafId = window.requestAnimationFrame(() => {
        setSidebarOpen(false);
      });
      return () => window.cancelAnimationFrame(desktopRafId);
    }

    let wasDesktop = window.innerWidth >= 1024;
    const rafId = window.requestAnimationFrame(() => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    });
    const handleResize = () => {
      const isNowDesktop = window.innerWidth >= 1024;
      if (isNowDesktop !== wasDesktop) {
        wasDesktop = isNowDesktop;
        setSidebarOpen(isNowDesktop);
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
        'ALL',
        activeEnvironment
      ),
    [activeScenario, activeStageIndex, activeEnvironment]
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

  // Global Workbench Hotkeys (?, T, 1-4, [, ], Space, Esc)
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
      } else if (command === 'VIEW_TOPOLOGY') {
        e.preventDefault();
        setInspectorOpen(false);
        setViewMode('TOPOLOGY');
      } else if (command === 'VIEW_SEQUENCE') {
        e.preventDefault();
        setInspectorOpen(true);
        setInspectorTab('SEQUENCE');
      } else if (command === 'VIEW_PROCESS_MEMORY') {
        e.preventDefault();
        setInspectorOpen(true);
        setInspectorTab('MEMORY');
      } else if (command === 'VIEW_RAW_TABLES') {
        e.preventDefault();
        setInspectorOpen(false);
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

        {/* Main workbench shell remains accessible in SSR HTML for crawlers and screen readers */}
        <motion.div
          data-testid="workbench-shell"
          data-workbench-revealed={showIntro ? 'false' : 'true'}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.35,
            ease: 'easeOut',
          }}
          className={`flex flex-col flex-1 min-h-0 origin-center ${
            showIntro ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          {/* Persistent Navigation Bar with Animated Logo (Memory Return), Navigation Links & Slide-Out Settings Drawer */}
          <AttackHeader
            scenario={activeScenario}
            activeEnvironment={activeEnvironment}
            onSelectEnvironment={setActiveEnvironment}
            tacticalMode={tacticalMode}
            onToggleTacticalMode={() => setTacticalMode((prev) => !prev)}
            viewMode={viewMode}
            onViewModeChange={(mode) => {
              setInspectorOpen(false);
              setViewMode(mode);
            }}
            onSelectScenario={(id) => handleSelectScenario(id, 0)}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            isDark={isDark}
            onToggleDark={() => setIsDark((prev) => !prev)}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => {
              setSidebarOpen((prev) => !prev);
            }}
            inspectorOpen={inspectorOpen}
            onToggleInspector={() => {
              setInspectorOpen((prev) => !prev);
            }}
            onOpenAttackLibrary={() => setAttackLibraryOpen(true)}
            onOpenAnalyzerModal={() => setAnalyzerModalOpen(true)}
            onOpenSourcesModal={() => setSourcesModalOpen(true)}
            onOpenAboutModal={() => setAboutModalOpen(true)}
            onOpenShortcutsModal={() => setShortcutsModalOpen(true)}
            layoutMode={layoutMode}
            onLayoutModeChange={handleLayoutModeChange}
            onReplayIntro={handleReturnToLastVisitedDiagram}
            nodeSearchQuery={nodeSearchQuery}
            onNodeSearchQueryChange={setNodeSearchQuery}
            graphNodes={activeGraphNodes}
            onFocusGraphNode={(nodeId) => {
              setInspectorOpen(false);
              handleFocusGraphNode(nodeId);
            }}
          />

          <main
            onContextMenu={(e) => e.preventDefault()}
            className="relative flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden"
          >
            {/* Mobile/Tablet Backdrop when left sidebar drawer is open */}
            <AnimatePresence>
              {sidebarOpen && !inspectorOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setSidebarOpen(false);
                  }}
                  className="lg:hidden absolute inset-0 z-40 bg-black/35 backdrop-blur-[1px]"
                />
              )}
            </AnimatePresence>

            {/* Left Collapsible Scenarios & Attack Vectors Sidebar (Hidden when viewing full-screen Inspector page) */}
            <AnimatePresence initial={false}>
              {sidebarOpen && !inspectorOpen && (
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

            <div className="relative flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto sm:overflow-hidden">
              {inspectorOpen ? (
                /* Dedicated Full-Screen Forensic Inspector Page */
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
                  activeTab={inspectorTab}
                  onTabChange={setInspectorTab}
                  onCloseInspectorPage={() => {
                    setInspectorScopeOverride(null);
                    setInspectorOpen(false);
                  }}
                  onReturnToRememberedDiagram={
                    handleReturnToLastVisitedDiagram
                  }
                  sidebarOpen={sidebarOpen}
                  width={inspectorWidth}
                  onResizeWidth={setInspectorWidth}
                />
              ) : (
                /* Main Active Workbench View + Floating Hover Inspector Option */
                <div className="relative flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto sm:overflow-hidden">
                  {/* Floating Hover Inspector Trigger on the Active Page */}
                  <FloatingHoverInspectorTrigger
                    scenario={activeScenario}
                    currentStage={stageView.currentStage}
                    scopeContext={inspectorScopeContext}
                    selectedTelemetry={selectedTelemetry}
                    onOpenInspectorPage={() => {
                      setInspectorScopeOverride(null);
                      setSidebarOpen(true);
                      setInspectorOpen(true);
                    }}
                  />

                  <DiagramCanvas
                    scenario={activeScenario}
                    stageView={stageView}
                    activeEnvironment={activeEnvironment}
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
                    cinematicPhase={cinematicPhase}
                    isPlaying={isPlaying}
                    onStartWalkthrough={handleStartGuidedWalkthrough}
                    onResetWalkthrough={handleReset}
                    onTogglePlay={handleTogglePlay}
                    onStepForward={handleStepForward}
                    onStepBackward={handleStepBackward}
                    canStepBackward={activeStageIndex > 0}
                    canStepForward={
                      activeStageIndex < activeScenario.stages.length
                    }
                    playbackSpeed={playbackSpeed}
                    onSpeedChange={setPlaybackSpeed}
                    shortcutsModalOpen={shortcutsModalOpen}
                    onOpenShortcutsModal={() => setShortcutsModalOpen(true)}
                    onCloseShortcutsModal={() => setShortcutsModalOpen(false)}
                    nodeSearchQuery={nodeSearchQuery}
                    onNodeSearchQueryChange={setNodeSearchQuery}
                    focusedSearchNodeId={focusedSearchNodeId}
                    focusSearchSeq={focusSearchSeq}
                    onActiveNodesChange={setActiveGraphNodes}
                    customInjectedNodes={currentInjectedVectors.nodes}
                    customInjectedFlows={currentInjectedVectors.flows}
                    onDropAttackVector={handleInjectAttackVector}
                    forceDesktopCanvas={layoutMode === 'DESKTOP'}
                  />
                </div>
              )}
            </div>
          </main>
        </motion.div>

        {/* Lazy-loaded Modals (mounted only when opened to keep initial DOM < 1500 nodes) */}
        {attackLibraryOpen && (
          <AttackLibrary
            isOpen={attackLibraryOpen}
            onClose={() => setAttackLibraryOpen(false)}
            activeScenarioId={activeScenario.id}
            onSelectScenario={handleSelectScenario}
          />
        )}

        {analyzerModalOpen && (
          <LogAnalyzerModal
            isOpen={analyzerModalOpen}
            onClose={() => setAnalyzerModalOpen(false)}
            onSelectScenario={(id) => handleSelectScenario(id, 0)}
          />
        )}

        {sourcesModalOpen && (
          <SourcesAndLegalModal
            isOpen={sourcesModalOpen}
            onClose={() => setSourcesModalOpen(false)}
            scenario={activeScenario}
          />
        )}

        {aboutModalOpen && (
          <AboutAuthorModal
            isOpen={aboutModalOpen}
            onClose={() => setAboutModalOpen(false)}
          />
        )}

        {viewMode !== 'TOPOLOGY' && shortcutsModalOpen && (
          <KeyboardShortcutsModal
            isOpen={shortcutsModalOpen}
            onClose={() => setShortcutsModalOpen(false)}
            tacticalMode={tacticalMode}
            isPlaying={isPlaying}
            onExecuteCommand={(cmd) => {
              if (cmd === 'TOGGLE_TACTICAL') setTacticalMode((v) => !v);
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
