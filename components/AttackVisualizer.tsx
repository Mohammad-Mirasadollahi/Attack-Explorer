'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AttackScenario,
  TelemetryEvent,
} from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  ComputedStageView,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import {
  buildInternalNodeSubBoard,
  buildWhiteboardSchematic,
  NetworkZoneColumn,
  WhiteboardSketchFlow,
  WhiteboardSketchNode,
} from '@/lib/sketch-zones-and-drilldown';
import {
  CinematicPhase,
  computeCinematicDirectorState,
} from '@/lib/cinematic-camera-director';
import {
  applyNodePositionOffsets,
  applyZonePositionOffsets,
  ATTACK_VECTOR_DRAG_MIME_TYPE,
  computeForceDirectedNodeLayout,
  computeMarqueeSelectedNodeIds,
  computePanFromMinimapPoint,
  computeScrollWheelZoom,
  ForceLayoutPresetMode,
  MarqueeBoxCoords,
  MAX_CANVAS_ZOOM,
  MIN_CANVAS_ZOOM,
  moveSelectedNodesByDelta,
  NodeOffsetDelta,
  Point2D,
  recomputeGeometryForMovedBoard,
  resolveCanvasHoldInteractionMode,
  searchAttackGraphNodes,
  WHITEBOARD_HEIGHT,
  WHITEBOARD_WIDTH,
} from '@/lib/canvas-interaction-engine';
import { DEFAULT_DIAGRAM_NODE_TOOLTIP_OPEN_DELAY_MS } from '@/lib/tooltip-positioning';
import { SketchWhiteboardSvg } from './canvas/SketchWhiteboardSvg';
import { ResponsiveMobileZonesView } from './canvas/ResponsiveMobileZonesView';
import { TacticalGridOverlay } from './canvas/TacticalGridOverlay';
import { NodeHoverTooltip } from './NodeHoverTooltip';
import { PlaybackControlBar } from './PlaybackControlBar';
import {
  CanvasController,
  CanvasControllerHandle,
} from './CanvasController';
import { DraggableDiagramNode } from './DraggableDiagramNode';
import { WorkbenchIconTooltip } from './WorkbenchIconTooltip';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import {
  KEYBOARD_PAN_STEP_PX,
  resolveKeyboardShortcutCommand,
  ShortcutCommandId,
} from '@/lib/keyboard-shortcuts';
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Hand,
  Maximize2,
  Minimize2,
  MousePointer,
  Move,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export interface AttackVisualizerProps {
  scenario: AttackScenario;
  stageView: ComputedStageView;
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  cinematicPhase?: CinematicPhase | null;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  canStepBackward?: boolean;
  canStepForward?: boolean;
  playbackSpeed?: number;
  onSpeedChange?: (speed: number) => void;
  onStartWalkthrough?: () => void;
  onResetWalkthrough?: () => void;
  activeEnvironment?: ActiveEnvironmentId;
  tacticalMode?: boolean;
  onToggleTacticalMode?: () => void;
  shortcutsModalOpen?: boolean;
  onOpenShortcutsModal?: () => void;
  onCloseShortcutsModal?: () => void;
  nodeSearchQuery?: string;
  onNodeSearchQueryChange?: (query: string) => void;
  focusedSearchNodeId?: string | null;
  focusSearchSeq?: number;
  onActiveNodesChange?: (nodes: WhiteboardSketchNode[]) => void;
  customInjectedNodes?: WhiteboardSketchNode[];
  customInjectedFlows?: WhiteboardSketchFlow[];
  onDropAttackVector?: (
    vectorId: string,
    dropCoords?: { wx: number; wy: number }
  ) => void;
  /** Controlled expanded parent node ID for internal sub-board scope */
  expandedNodeId?: string | null;
  onExpandedNodeChange?: (nodeId: string | null) => void;
  /** Controlled selected sub-node ID inside the expanded sub-board */
  selectedInternalSubNodeId?: string | null;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  /** Prefer full desktop topology board even on narrow physical screens */
  forceDesktopCanvas?: boolean;
}

interface PortalAnimationState {
  mode: 'EXPAND' | 'COLLAPSE';
  xPct: number;
  yPct: number;
  nodeLabel: string;
  seqKey: number;
}

export type CanvasInteractionMode = 'SELECT' | 'PAN';

export function AttackVisualizer({
  scenario,
  stageView,
  selectedTelemetryId,
  onSelectTelemetry,
  selectedNodeId,
  onSelectNode,
  cinematicPhase = null,
  isPlaying = false,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  canStepBackward = false,
  canStepForward = true,
  playbackSpeed = 0.5,
  onSpeedChange,
  onStartWalkthrough,
  onResetWalkthrough,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  tacticalMode = false,
  onToggleTacticalMode,
  shortcutsModalOpen = false,
  onOpenShortcutsModal,
  onCloseShortcutsModal,
  nodeSearchQuery = '',
  onNodeSearchQueryChange,
  focusedSearchNodeId = null,
  focusSearchSeq = 0,
  onActiveNodesChange,
  customInjectedNodes = [],
  customInjectedFlows = [],
  onDropAttackVector,
  expandedNodeId: controlledExpandedNodeId,
  onExpandedNodeChange,
  selectedInternalSubNodeId: controlledSelectedSubNodeId,
  onSelectInternalSubNode,
  forceDesktopCanvas = false,
}: AttackVisualizerProps) {
  const { currentStage } = stageView;
  const activeStageIndex = currentStage ? currentStage.index : 0;
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  // Zoom, Pan, Marquee Selection & Object Dragging State (Default 'PAN' so clicking & dragging empty space moves the diagram immediately)
  const [manualZoom, setManualZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<Point2D>({ x: 0, y: 0 });
  const [interactionMode, setInteractionMode] =
    useState<CanvasInteractionMode>('PAN');
  const [isPanningCanvas, setIsPanningCanvas] = useState<boolean>(false);
  const [isBoxSelectHoldActive, setIsBoxSelectHoldActive] =
    useState<boolean>(false);
  const [isDraggingNodes, setIsDraggingNodes] = useState<boolean>(false);
  const [draggingZoneTitle, setDraggingZoneTitle] = useState<string | null>(
    null
  );
  const [multiSelectedNodeIds, setMultiSelectedNodeIds] = useState<string[]>(
    []
  );
  const [isVectorDragOver, setIsVectorDragOver] = useState<boolean>(false);

  // User-dragged position offsets for main topology nodes, sub-board nodes, and zones
  const [nodeOffsetsByScenario, setNodeOffsetsByScenario] = useState<
    Record<string, Record<string, NodeOffsetDelta>>
  >({});
  const [zoneOffsetsByScenario, setZoneOffsetsByScenario] = useState<
    Record<string, Record<string, NodeOffsetDelta>>
  >({});

  // Visibility toggle for Top Toolbar
  const [topBarHidden, setTopBarHidden] = useState<boolean>(false);

  // Force-Directed Auto-Layout state per board scope
  const [autoLayoutModeByScope, setAutoLayoutModeByScope] = useState<
    Record<string, ForceLayoutPresetMode | null>
  >({});
  const [isAutoLayoutAnimating, setIsAutoLayoutAnimating] =
    useState<boolean>(false);
  const autoLayoutTimerRef = useRef<number | null>(null);

  const [autoCameraEnabled, setAutoCameraEnabled] = useState<boolean>(true);
  const [internalActiveSketchNodeId, setInternalActiveSketchNodeId] = useState<
    string | null
  >(null);
  const [internalSelectedSubNodeId, setInternalSelectedSubNodeId] = useState<
    string | null
  >(null);

  const activeSketchNodeId =
    controlledExpandedNodeId !== undefined
      ? controlledExpandedNodeId
      : internalActiveSketchNodeId;
  const selectedInternalSubNodeId =
    controlledSelectedSubNodeId !== undefined
      ? controlledSelectedSubNodeId
      : internalSelectedSubNodeId;

  const setActiveSketchNodeId = useCallback(
    (nextId: string | null) => {
      setInternalActiveSketchNodeId(nextId);
      onExpandedNodeChange?.(nextId);
    },
    [onExpandedNodeChange]
  );

  const setSelectedInternalSubNodeId = useCallback(
    (nextSubId: string | null) => {
      setInternalSelectedSubNodeId(nextSubId);
      onSelectInternalSubNode?.(nextSubId);
    },
    [onSelectInternalSubNode]
  );

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [nodeContextMenu, setNodeContextMenu] = useState<{
    node: WhiteboardSketchNode;
    x: number;
    y: number;
    isSubBoard: boolean;
  } | null>(null);
  const [diagramTooltipsEnabled, setDiagramTooltipsEnabled] =
    useState<boolean>(true);
  const [diagramTooltipCollapsed, setDiagramTooltipCollapsed] =
    useState<boolean>(false);
  const hoverOpenTimeoutRef = useRef<number | null>(null);
  const hoverClearTimeoutRef = useRef<number | null>(null);

  const clearHoverOpenTimeout = useCallback(() => {
    if (hoverOpenTimeoutRef.current !== null) {
      window.clearTimeout(hoverOpenTimeoutRef.current);
      hoverOpenTimeoutRef.current = null;
    }
  }, []);

  const clearHoverTimeout = useCallback(() => {
    if (hoverClearTimeoutRef.current !== null) {
      window.clearTimeout(hoverClearTimeoutRef.current);
      hoverClearTimeoutRef.current = null;
    }
  }, []);

  const handleNodeHoverChange = useCallback(
    (nextNodeId: string | null) => {
      clearHoverOpenTimeout();
      clearHoverTimeout();
      if (nextNodeId !== null) {
        hoverOpenTimeoutRef.current = window.setTimeout(() => {
          setHoveredNodeId(nextNodeId);
          hoverOpenTimeoutRef.current = null;
        }, DEFAULT_DIAGRAM_NODE_TOOLTIP_OPEN_DELAY_MS);
      } else {
        hoverClearTimeoutRef.current = window.setTimeout(() => {
          setHoveredNodeId(null);
          hoverClearTimeoutRef.current = null;
        }, 185);
      }
    },
    [clearHoverOpenTimeout, clearHoverTimeout]
  );

  const handleTooltipMouseEnter = useCallback(() => {
    clearHoverOpenTimeout();
    clearHoverTimeout();
  }, [clearHoverOpenTimeout, clearHoverTimeout]);

  const handleTooltipMouseLeave = useCallback(() => {
    clearHoverOpenTimeout();
    clearHoverTimeout();
    hoverClearTimeoutRef.current = window.setTimeout(() => {
      setHoveredNodeId(null);
      hoverClearTimeoutRef.current = null;
    }, 140);
  }, [clearHoverOpenTimeout, clearHoverTimeout]);

  useEffect(() => {
    return () => {
      if (hoverOpenTimeoutRef.current !== null) {
        window.clearTimeout(hoverOpenTimeoutRef.current);
      }
      if (hoverClearTimeoutRef.current !== null) {
        window.clearTimeout(hoverClearTimeoutRef.current);
      }
    };
  }, []);

  const [portalOrigin, setPortalOrigin] = useState<{
    xPct: number;
    yPct: number;
  }>({ xPct: 50, yPct: 50 });
  const [portalAnim, setPortalAnim] = useState<PortalAnimationState | null>(
    null
  );
  const [lastReturnedNodeId, setLastReturnedNodeId] = useState<string | null>(
    null
  );

  const boardContainerRef = useRef<HTMLDivElement>(null);
  const cameraRigRef = useRef<HTMLDivElement>(null);
  const canvasControllerRef = useRef<CanvasControllerHandle | null>(null);
  const panOffsetRef = useRef<Point2D>({ x: 0, y: 0 });
  const manualZoomRef = useRef<number>(1);
  const panHudTextRef = useRef<HTMLSpanElement | null>(null);
  const marqueeElRef = useRef<HTMLDivElement | null>(null);
  const didDragObjectRef = useRef<boolean>(false);
  const spacePressedRef = useRef<boolean>(false);
  const boardGestureActiveRef = useRef<boolean>(false);

  const hideMarqueeEl = useCallback(() => {
    const el = marqueeElRef.current;
    if (!el) return;
    el.hidden = true;
    el.style.left = '0%';
    el.style.top = '0%';
    el.style.width = '0%';
    el.style.height = '0%';
  }, []);

  const paintMarqueeEl = useCallback((box: MarqueeBoxCoords) => {
    const el = marqueeElRef.current;
    if (!el) return;
    const left = (Math.min(box.startWx, box.currentWx) / WHITEBOARD_WIDTH) * 100;
    const top = (Math.min(box.startWy, box.currentWy) / WHITEBOARD_HEIGHT) * 100;
    const width =
      (Math.abs(box.currentWx - box.startWx) / WHITEBOARD_WIDTH) * 100;
    const height =
      (Math.abs(box.currentWy - box.startWy) / WHITEBOARD_HEIGHT) * 100;
    el.hidden = false;
    el.style.left = `${left}%`;
    el.style.top = `${top}%`;
    el.style.width = `${width}%`;
    el.style.height = `${height}%`;
  }, []);

  const isCanvasInteracting =
    isPanningCanvas || isDraggingNodes || isBoxSelectHoldActive;

  // Track Spacebar for quick pan anywhere
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        spacePressedRef.current = true;
      } else if (e.key === 'Escape') {
        setMultiSelectedNodeIds([]);
        setNodeContextMenu(null);
        hideMarqueeEl();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spacePressedRef.current = false;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [hideMarqueeEl]);

  const {
    zones: scenarioZones,
    backboneLinks: scenarioBackboneLinks,
    nodes: baseSketchNodes,
    flows: baseSketchFlows,
  } = useMemo(
    () =>
      buildWhiteboardSchematic(scenario, activeStageIndex, activeEnvironment),
    [scenario, activeStageIndex, activeEnvironment]
  );

  const rawSketchNodes = useMemo(
    () =>
      customInjectedNodes.length > 0
        ? [...baseSketchNodes, ...customInjectedNodes]
        : baseSketchNodes,
    [baseSketchNodes, customInjectedNodes]
  );

  const rawSketchFlows = useMemo(
    () =>
      customInjectedFlows.length > 0
        ? [...baseSketchFlows, ...customInjectedFlows]
        : baseSketchFlows,
    [baseSketchFlows, customInjectedFlows]
  );

  const boardScopeKey = `${scenario.id}-${activeEnvironment}-${
    activeSketchNodeId || 'MAIN'
  }`;

  const currentBoardNodeOffsets = useMemo(
    () => nodeOffsetsByScenario[boardScopeKey] || {},
    [nodeOffsetsByScenario, boardScopeKey]
  );

  const currentBoardZoneOffsets = useMemo(
    () => zoneOffsetsByScenario[boardScopeKey] || {},
    [zoneOffsetsByScenario, boardScopeKey]
  );

  // Apply offsets to main topology nodes & recompute main flows
  const mainBoardNodeOffsets = useMemo(
    () => nodeOffsetsByScenario[`${scenario.id}-${activeEnvironment}-MAIN`] || {},
    [nodeOffsetsByScenario, scenario.id, activeEnvironment]
  );

  const sketchNodes = useMemo(
    () => applyNodePositionOffsets(rawSketchNodes, mainBoardNodeOffsets),
    [rawSketchNodes, mainBoardNodeOffsets]
  );

  const { flows: sketchFlows, backboneLinks: movedMainBackboneLinks } = useMemo(
    () =>
      recomputeGeometryForMovedBoard(
        rawSketchNodes,
        sketchNodes,
        rawSketchFlows,
        scenarioBackboneLinks
      ),
    [rawSketchNodes, sketchNodes, rawSketchFlows, scenarioBackboneLinks]
  );

  // Selected for inspector/details (single-click). Does not expand the board.
  const selectedSketchNode: WhiteboardSketchNode | null = useMemo(
    () => sketchNodes.find((n) => n.id === selectedNodeId) || null,
    [sketchNodes, selectedNodeId]
  );

  // Expanded into internal visual sub-board (double-click only).
  const expandedSketchNode: WhiteboardSketchNode | null = useMemo(
    () => sketchNodes.find((n) => n.id === activeSketchNodeId) || null,
    [sketchNodes, activeSketchNodeId]
  );

  const companionSketchNode: WhiteboardSketchNode | null = useMemo(() => {
    if (!expandedSketchNode?.companionHostOrProcessNodeId) return null;
    return (
      sketchNodes.find(
        (n) => n.id === expandedSketchNode.companionHostOrProcessNodeId
      ) || null
    );
  }, [expandedSketchNode, sketchNodes]);

  const rawInternalSubBoard = useMemo(() => {
    if (!expandedSketchNode) return null;
    return buildInternalNodeSubBoard(
      scenario,
      expandedSketchNode,
      sketchFlows,
      activeStageIndex
    );
  }, [scenario, expandedSketchNode, sketchFlows, activeStageIndex]);

  // Apply user-dragged offsets to internal sub-board if active
  const internalSubBoard = useMemo(() => {
    if (!rawInternalSubBoard) return null;
    const movedSubNodes = applyNodePositionOffsets(
      rawInternalSubBoard.subNodes,
      currentBoardNodeOffsets
    );
    const movedSubZones = applyZonePositionOffsets(
      rawInternalSubBoard.zones,
      currentBoardZoneOffsets
    );
    const { flows: movedSubFlows, backboneLinks: movedSubBackbone } =
      recomputeGeometryForMovedBoard(
        rawInternalSubBoard.subNodes,
        movedSubNodes,
        rawInternalSubBoard.subFlows,
        rawInternalSubBoard.backboneLinks
      );
    return {
      ...rawInternalSubBoard,
      zones: movedSubZones,
      subNodes: movedSubNodes,
      subFlows: movedSubFlows,
      backboneLinks: movedSubBackbone,
    };
  }, [
    rawInternalSubBoard,
    currentBoardNodeOffsets,
    currentBoardZoneOffsets,
  ]);

  const activeInternalSubNode = useMemo(() => {
    if (!internalSubBoard) return null;
    return (
      internalSubBoard.subNodes.find(
        (sn) => sn.id === selectedInternalSubNodeId
      ) || internalSubBoard.subNodes[0]
    );
  }, [internalSubBoard, selectedInternalSubNodeId]);

  const activeZones = useMemo(
    () =>
      internalSubBoard
        ? internalSubBoard.zones
        : applyZonePositionOffsets(scenarioZones, currentBoardZoneOffsets),
    [internalSubBoard, scenarioZones, currentBoardZoneOffsets]
  );

  const activeBackboneLinks = internalSubBoard
    ? internalSubBoard.backboneLinks
    : movedMainBackboneLinks;
  const activeNodes = internalSubBoard
    ? internalSubBoard.subNodes
    : sketchNodes;
  const activeFlows = internalSubBoard
    ? internalSubBoard.subFlows
    : sketchFlows;

  const director = useMemo(
    () =>
      computeCinematicDirectorState(
        scenario,
        activeNodes,
        activeFlows,
        activeStageIndex,
        cinematicPhase,
        autoCameraEnabled
      ),
    [
      scenario,
      activeNodes,
      activeFlows,
      activeStageIndex,
      cinematicPhase,
      autoCameraEnabled,
    ]
  );

  const effectiveScale = Number(
    Math.max(
      MIN_CANVAS_ZOOM,
      Math.min(MAX_CANVAS_ZOOM, director.camera.scale * manualZoom)
    ).toFixed(2)
  );
  const effectiveTxPct = autoCameraEnabled ? director.camera.txPct : 0;
  const effectiveTyPct = autoCameraEnabled ? director.camera.tyPct : 0;

  const activeAutoLayoutMode = autoLayoutModeByScope[boardScopeKey] || null;
  const isAutoLayoutActive = activeAutoLayoutMode !== null;

  // Sync active nodes upward to the Top Workbench Toolbar Search Bar
  useEffect(() => {
    onActiveNodesChange?.(activeNodes);
  }, [activeNodes, onActiveNodesChange]);

  const searchResult = useMemo(
    () => searchAttackGraphNodes(activeNodes, nodeSearchQuery),
    [activeNodes, nodeSearchQuery]
  );

  const matchedNodeIdSet = useMemo(
    () => new Set(searchResult.matchedNodeIds),
    [searchResult.matchedNodeIds]
  );

  const hasCustomLayoutOrView =
    manualZoom !== 1 ||
    panOffset.x !== 0 ||
    panOffset.y !== 0 ||
    isAutoLayoutActive ||
    Object.keys(currentBoardNodeOffsets).length > 0 ||
    Object.keys(currentBoardZoneOffsets).length > 0;

  const handleResetCanvasLayout = useCallback(() => {
    manualZoomRef.current = 1;
    panOffsetRef.current = { x: 0, y: 0 };
    setManualZoom(1);
    setPanOffset({ x: 0, y: 0 });
    canvasControllerRef.current?.resetTransform();
    setMultiSelectedNodeIds([]);
    hideMarqueeEl();
    setNodeOffsetsByScenario((prev) => {
      const next = { ...prev };
      delete next[boardScopeKey];
      return next;
    });
    setZoneOffsetsByScenario((prev) => {
      const next = { ...prev };
      delete next[boardScopeKey];
      return next;
    });
    setAutoLayoutModeByScope((prev) => {
      const next = { ...prev };
      delete next[boardScopeKey];
      return next;
    });
  }, [boardScopeKey, hideMarqueeEl]);

  const handleAutoLayoutNodes = useCallback(() => {
    const baseNodes = rawInternalSubBoard
      ? rawInternalSubBoard.subNodes
      : rawSketchNodes;
    const baseFlows = rawInternalSubBoard
      ? rawInternalSubBoard.subFlows
      : rawSketchFlows;
    const baseZones = rawInternalSubBoard
      ? rawInternalSubBoard.zones
      : scenarioZones;

    const currentPreset = autoLayoutModeByScope[boardScopeKey];
    const nextPreset: ForceLayoutPresetMode =
      currentPreset === 'BALANCED' ? 'SPACIOUS' : 'BALANCED';

    const layoutResult = computeForceDirectedNodeLayout({
      nodes: baseNodes,
      flows: baseFlows,
      zones: baseZones,
      mode: nextPreset,
    });

    if (autoLayoutTimerRef.current !== null) {
      window.clearTimeout(autoLayoutTimerRef.current);
    }
    setIsAutoLayoutAnimating(true);
    autoLayoutTimerRef.current = window.setTimeout(() => {
      setIsAutoLayoutAnimating(false);
      autoLayoutTimerRef.current = null;
    }, 560);

    setNodeOffsetsByScenario((prev) => ({
      ...prev,
      [boardScopeKey]: layoutResult.nodeOffsets,
    }));
    setZoneOffsetsByScenario((prev) => {
      const next = { ...prev };
      delete next[boardScopeKey];
      return next;
    });
    setAutoLayoutModeByScope((prev) => ({
      ...prev,
      [boardScopeKey]: nextPreset,
    }));

    // Frame the newly organized graph cleanly
    manualZoomRef.current = 1;
    panOffsetRef.current = { x: 0, y: 0 };
    setManualZoom(1);
    setPanOffset({ x: 0, y: 0 });
    canvasControllerRef.current?.setTransform(0, 0, 1, 220);
  }, [
    autoLayoutModeByScope,
    boardScopeKey,
    rawInternalSubBoard,
    rawSketchFlows,
    rawSketchNodes,
    scenarioZones,
  ]);

  // Center & Focus node when selected from Top Workbench Toolbar Search Bar
  const lastProcessedFocusSeqRef = useRef<number>(focusSearchSeq);
  useEffect(() => {
    if (
      focusSearchSeq > 0 &&
      focusSearchSeq !== lastProcessedFocusSeqRef.current &&
      focusedSearchNodeId
    ) {
      lastProcessedFocusSeqRef.current = focusSearchSeq;
      const targetNode = activeNodes.find((n) => n.id === focusedSearchNodeId);
      if (!targetNode) return;

      const rafId = window.requestAnimationFrame(() => {
        const rect = boardContainerRef.current?.getBoundingClientRect();
        const nextPan = computePanFromMinimapPoint({
          targetWx: targetNode.wx,
          targetWy: targetNode.wy,
          zoomScale: manualZoomRef.current,
          containerWidth: rect?.width || 1000,
          containerHeight: rect?.height || 550,
        });
        panOffsetRef.current = nextPan;
        canvasControllerRef.current?.setTransform(
          nextPan.x,
          nextPan.y,
          manualZoomRef.current,
          240
        );
        setPanOffset(nextPan);
        setMultiSelectedNodeIds([targetNode.id]);
        if (internalSubBoard) {
          setSelectedInternalSubNodeId(targetNode.id);
        }
      });
      return () => window.cancelAnimationFrame(rafId);
    }
  }, [
    activeNodes,
    focusSearchSeq,
    focusedSearchNodeId,
    internalSubBoard,
    setSelectedInternalSubNodeId,
  ]);

  // HTML5 Drag-and-Drop Handlers for Pre-Defined Attack Vector Library Injection
  const handleBoardDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (!onDropAttackVector || internalSubBoard) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (!isVectorDragOver) {
        setIsVectorDragOver(true);
      }
    },
    [internalSubBoard, isVectorDragOver, onDropAttackVector]
  );

  const handleBoardDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (
        boardContainerRef.current &&
        !boardContainerRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsVectorDragOver(false);
      }
    },
    []
  );

  const handleBoardDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (!onDropAttackVector || internalSubBoard) return;
      e.preventDefault();
      e.stopPropagation();
      setIsVectorDragOver(false);

      const vectorId =
        e.dataTransfer.getData(ATTACK_VECTOR_DRAG_MIME_TYPE) ||
        e.dataTransfer.getData('text/plain');
      if (!vectorId) return;

      const rigEl = cameraRigRef.current || boardContainerRef.current;
      const rect = rigEl?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        const relX = Math.max(0.06, Math.min(0.94, (e.clientX - rect.left) / rect.width));
        const relY = Math.max(0.14, Math.min(0.86, (e.clientY - rect.top) / rect.height));
        const wx = Math.round(relX * WHITEBOARD_WIDTH);
        const wy = Math.round(relY * WHITEBOARD_HEIGHT);
        onDropAttackVector(vectorId.trim(), { wx, wy });
      } else {
        onDropAttackVector(vectorId.trim());
      }
    },
    [internalSubBoard, onDropAttackVector]
  );

  // Mouse Wheel / Trackpad Scroll Zoom Handler synchronized with CanvasController
  useEffect(() => {
    const boardEl = boardContainerRef.current;
    if (!boardEl) return;
    let wheelRafId: number | null = null;

    const onNativeWheel = (e: WheelEvent) => {
      const targetEl = e.target instanceof Element ? e.target : null;
      if (
        targetEl?.closest(
          '[role="tooltip"], [data-scrollable-canvas-overlay="true"], .canvas-scrollable-overlay, [data-testid^="node-hover-tooltip-"], [data-testid^="workbench-tooltip-"], [data-testid="responsive-mobile-zones-view"], [data-testid="diagram-legend-panel"]'
        )
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const prevZoom = manualZoomRef.current;
      const nextZoom = computeScrollWheelZoom(prevZoom, e.deltaY);
      if (nextZoom === prevZoom) return;

      const rect = boardEl.getBoundingClientRect();
      const cursorX =
        e.clientX > 0 ? e.clientX - rect.left : (rect.width || 900) / 2;
      const cursorY =
        e.clientY > 0 ? e.clientY - rect.top : (rect.height || 500) / 2;
      const zoomRatio = nextZoom / prevZoom;
      const prevPan = panOffsetRef.current;
      const nextPanX = Math.round(cursorX - (cursorX - prevPan.x) * zoomRatio);
      const nextPanY = Math.round(cursorY - (cursorY - prevPan.y) * zoomRatio);

      manualZoomRef.current = nextZoom;
      panOffsetRef.current = { x: nextPanX, y: nextPanY };

      canvasControllerRef.current?.setTransform(
        nextPanX,
        nextPanY,
        nextZoom,
        0
      );

      boardEl.setAttribute('data-zoom-scale', String(nextZoom));
      boardEl.setAttribute('data-pan-x', String(nextPanX));
      boardEl.setAttribute('data-pan-y', String(nextPanY));

      if (wheelRafId === null) {
        wheelRafId = window.requestAnimationFrame(() => {
          wheelRafId = null;
          setManualZoom(manualZoomRef.current);
          setPanOffset({ ...panOffsetRef.current });
        });
      }
    };

    boardEl.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      if (wheelRafId !== null) {
        window.cancelAnimationFrame(wheelRafId);
      }
      boardEl.removeEventListener('wheel', onNativeWheel);
    };
  }, [internalSubBoard]);

  // Canvas Empty Space Pointer Down:
  // - Left-Click & Drag (`button === 0`) -> Pans canvas without remounting motion HUD nodes
  // - Right-Click & Drag (`button === 2`) -> Imperative marquee box + commit selection on up
  // Avoid AnimatePresence mount/unmount during the gesture (fixes removeChild crashes).
  const handleBoardPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.button !== 2) return;
      // Secondary touch fingers belong to pinch-zoom — do not start pan/select.
      if (e.pointerType === 'touch' && e.isPrimary === false) return;
      if (boardGestureActiveRef.current) return;

      const targetEl = e.target instanceof Element ? e.target : null;
      if (!targetEl) return;

      if (!targetEl.closest('[data-testid="diagram-node-context-menu"]')) {
        setNodeContextMenu(null);
      }

      if (
        targetEl.closest('[data-testid="responsive-mobile-zones-view"]') ||
        targetEl.closest('[data-testid="canvas-interaction-toolbar"]') ||
        targetEl.closest('[data-testid="diagram-legend-panel"]') ||
        targetEl.closest('[data-testid="playback-control-bar"]') ||
        targetEl.closest('[data-testid="show-playback-bar-btn"]') ||
        targetEl.closest('[data-testid="show-canvas-top-bar-btn"]') ||
        targetEl.closest('.canvas-interactive-node') ||
        targetEl.closest('.canvas-interactive-zone') ||
        targetEl.closest('.canvas-interactive-control') ||
        targetEl.closest('button') ||
        targetEl.closest('a') ||
        targetEl.closest('input') ||
        targetEl.closest('select')
      ) {
        if (e.button === 2) {
          e.preventDefault();
        }
        return;
      }

      if (e.button === 2) {
        e.preventDefault();
      }

      const currentBoardEl = e.currentTarget as HTMLElement;
      const pointerId = e.pointerId;
      // Capture before any React state update so the board node stays stable.
      try {
        currentBoardEl.setPointerCapture(pointerId);
      } catch {
        // Ignore if pointer capture is unavailable on target
      }

      boardGestureActiveRef.current = true;
      const startClientX = e.clientX;
      const startClientY = e.clientY;
      const startPanX = panOffsetRef.current.x;
      const startPanY = panOffsetRef.current.y;

      // Cache bounding rect once at pointerdown so pointermove never forces synchronous layout reflow
      const rigEl = cameraRigRef.current || boardContainerRef.current;
      const cachedRect = rigEl?.getBoundingClientRect();
      const cachedWidth = cachedRect?.width || 1000;
      const cachedHeight = cachedRect?.height || 550;
      const cachedLeft = cachedRect?.left || 0;
      const cachedTop = cachedRect?.top || 0;

      const fastClientToWb = (cx: number, cy: number) => {
        const wx = ((cx - cachedLeft) / cachedWidth) * WHITEBOARD_WIDTH;
        const wy = ((cy - cachedTop) / cachedHeight) * WHITEBOARD_HEIGHT;
        return {
          wx: Math.round(wx * 10) / 10,
          wy: Math.round(wy * 10) / 10,
        };
      };

      const startWb = fastClientToWb(startClientX, startClientY);

      const holdResolution = resolveCanvasHoldInteractionMode({
        button: e.button,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        pointerType: e.pointerType,
        toolbarMode: interactionMode,
      });

      const useMarqueeMode = holdResolution.useMarqueeSelection;
      let hasMoved = false;
      let holdActivated = false;
      let cleanedUp = false;
      let panRafId: number | null = null;
      let marqueeRafId: number | null = null;
      let latestMarquee: MarqueeBoxCoords | null = null;

      const activateHoldMode = () => {
        if (holdActivated || cleanedUp) return;
        holdActivated = true;
        setInteractionMode(holdResolution.mode);
        if (useMarqueeMode) {
          setIsBoxSelectHoldActive(true);
          setIsPanningCanvas(false);
          latestMarquee = {
            startWx: startWb.wx,
            startWy: startWb.wy,
            currentWx: startWb.wx,
            currentWy: startWb.wy,
          };
          paintMarqueeEl(latestMarquee);
        } else {
          setIsPanningCanvas(true);
          setIsBoxSelectHoldActive(false);
          hideMarqueeEl();
        }
      };

      const applyPanFrame = () => {
        panRafId = null;
        if (cleanedUp) return;
        const { x, y } = panOffsetRef.current;
        canvasControllerRef.current?.setTransform(
          x,
          y,
          manualZoomRef.current,
          0
        );
        if (boardContainerRef.current) {
          boardContainerRef.current.setAttribute('data-pan-x', String(x));
          boardContainerRef.current.setAttribute('data-pan-y', String(y));
        }
        if (panHudTextRef.current) {
          panHudTextRef.current.textContent = `Panning Canvas (${x}px, ${y}px)`;
        }
      };

      const applyMarqueeFrame = () => {
        marqueeRafId = null;
        if (cleanedUp || !latestMarquee) return;
        paintMarqueeEl(latestMarquee);
      };

      function handleWindowPointerUp() {
        if (cleanedUp) return;
        boardGestureActiveRef.current = false;

        if (panRafId !== null) {
          window.cancelAnimationFrame(panRafId);
          panRafId = null;
        }
        if (marqueeRafId !== null) {
          window.cancelAnimationFrame(marqueeRafId);
          marqueeRafId = null;
        }
        // Flush last paint before the cleanedUp latch so the final frame applies.
        if (!useMarqueeMode && hasMoved) {
          const { x, y } = panOffsetRef.current;
          canvasControllerRef.current?.setTransform(
            x,
            y,
            manualZoomRef.current,
            0
          );
        } else if (useMarqueeMode && latestMarquee) {
          paintMarqueeEl(latestMarquee);
        }
        cleanedUp = true;

        window.removeEventListener('pointermove', handleWindowPointerMove);
        window.removeEventListener('pointerup', handleWindowPointerUp);
        window.removeEventListener('pointercancel', handleWindowPointerUp);
        window.removeEventListener('blur', handleWindowPointerUp);

        try {
          if (currentBoardEl.hasPointerCapture?.(pointerId)) {
            currentBoardEl.releasePointerCapture(pointerId);
          }
        } catch {
          // Ignore release errors
        }

        if (holdActivated) {
          if (useMarqueeMode && latestMarquee && hasMoved) {
            const hitIds = computeMarqueeSelectedNodeIds(
              activeNodes,
              latestMarquee
            );
            setMultiSelectedNodeIds(hitIds);
          } else if (!useMarqueeMode && hasMoved) {
            const nextPan = panOffsetRef.current;
            setPanOffset((prev) =>
              prev.x === nextPan.x && prev.y === nextPan.y
                ? prev
                : { ...nextPan }
            );
          }
          // Defer HUD teardown one frame so Motion/React do not fight
          // pointer-capture release (avoids removeChild NotFoundError).
          window.requestAnimationFrame(() => {
            setIsPanningCanvas(false);
            setIsBoxSelectHoldActive(false);
            hideMarqueeEl();
          });
        } else {
          hideMarqueeEl();
          if (
            e.button === 0 &&
            !e.shiftKey &&
            !e.ctrlKey &&
            !e.metaKey
          ) {
            setMultiSelectedNodeIds((prev) => (prev.length === 0 ? prev : []));
          }
        }
      }

      function handleWindowPointerMove(moveEvent: PointerEvent) {
        if (cleanedUp) return;
        if (moveEvent.pointerId !== pointerId) return;
        if (moveEvent.pointerType === 'mouse' && moveEvent.buttons === 0) {
          handleWindowPointerUp();
          return;
        }
        const dx = moveEvent.clientX - startClientX;
        const dy = moveEvent.clientY - startClientY;
        const dist = Math.hypot(dx, dy);

        if (!hasMoved && dist >= 3) {
          hasMoved = true;
          activateHoldMode();
        }

        if (!useMarqueeMode && hasMoved) {
          const nextX = Math.round(startPanX + dx);
          const nextY = Math.round(startPanY + dy);
          panOffsetRef.current = { x: nextX, y: nextY };
          if (panRafId === null) {
            panRafId = window.requestAnimationFrame(applyPanFrame);
          }
        } else if (useMarqueeMode && hasMoved) {
          const curWb = fastClientToWb(moveEvent.clientX, moveEvent.clientY);
          latestMarquee = {
            startWx: startWb.wx,
            startWy: startWb.wy,
            currentWx: curWb.wx,
            currentWy: curWb.wy,
          };
          if (marqueeRafId === null) {
            marqueeRafId = window.requestAnimationFrame(applyMarqueeFrame);
          }
        }
      }

      window.addEventListener('pointermove', handleWindowPointerMove);
      window.addEventListener('pointerup', handleWindowPointerUp);
      window.addEventListener('pointercancel', handleWindowPointerUp);
      window.addEventListener('blur', handleWindowPointerUp);
    },
    [activeNodes, hideMarqueeEl, interactionMode, paintMarqueeEl]
  );

  // Dragging Single or Multiple Selected Nodes Simultaneously Across the Workspace (rAF-batched, cached rect)
  const handleNodePointerDown = useCallback(
    (node: WhiteboardSketchNode, e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      e.stopPropagation();

      const startClientX = e.clientX;
      const startClientY = e.clientY;
      let prevClientX = startClientX;
      let prevClientY = startClientY;
      let startedDrag = false;
      didDragObjectRef.current = false;

      // Cache rect once on pointerdown to eliminate layout thrashing during pointermove
      const rigEl = cameraRigRef.current || boardContainerRef.current;
      const cachedRect = rigEl?.getBoundingClientRect();
      const width = cachedRect?.width || 1000;
      const height = cachedRect?.height || 550;

      // Determine the group of nodes that will move together if dragged
      const isAlreadyMultiSelected = multiSelectedNodeIds.includes(node.id);
      const groupIdsToMove = isAlreadyMultiSelected
        ? multiSelectedNodeIds
        : e.shiftKey || e.ctrlKey || e.metaKey
        ? Array.from(new Set([...multiSelectedNodeIds, node.id]))
        : [node.id];

      let pendingDeltaWx = 0;
      let pendingDeltaWy = 0;
      let dragRafId: number | null = null;

      const flushNodeDragDelta = () => {
        dragRafId = null;
        if (pendingDeltaWx === 0 && pendingDeltaWy === 0) return;
        const applyDx = pendingDeltaWx;
        const applyDy = pendingDeltaWy;
        pendingDeltaWx = 0;
        pendingDeltaWy = 0;

        setNodeOffsetsByScenario((prev) => {
          const currentOffsets = prev[boardScopeKey] || {};
          return {
            ...prev,
            [boardScopeKey]: moveSelectedNodesByDelta(
              groupIdsToMove,
              currentOffsets,
              applyDx,
              applyDy
            ),
          };
        });
      };

      let cleanedUp = false;

      function handleWindowPointerUp() {
        if (cleanedUp) return;
        cleanedUp = true;
        if (dragRafId !== null) {
          window.cancelAnimationFrame(dragRafId);
          flushNodeDragDelta();
        }
        window.removeEventListener('pointermove', handleWindowPointerMove);
        window.removeEventListener('pointerup', handleWindowPointerUp);
        window.removeEventListener('pointercancel', handleWindowPointerUp);
        window.removeEventListener('blur', handleWindowPointerUp);
        if (startedDrag) {
          window.requestAnimationFrame(() => setIsDraggingNodes(false));
        }
      }

      function handleWindowPointerMove(moveEvent: PointerEvent) {
        if (cleanedUp) return;
        if (moveEvent.pointerType === 'mouse' && moveEvent.buttons === 0) {
          handleWindowPointerUp();
          return;
        }
        const totalDist = Math.hypot(
          moveEvent.clientX - startClientX,
          moveEvent.clientY - startClientY
        );

        if (!startedDrag && totalDist > 3) {
          startedDrag = true;
          didDragObjectRef.current = true;
          setIsDraggingNodes(true);
          setHoveredNodeId(null);
          if (!isAlreadyMultiSelected) {
            setMultiSelectedNodeIds(groupIdsToMove);
          }
        }

        if (startedDrag) {
          const stepClientDx = moveEvent.clientX - prevClientX;
          const stepClientDy = moveEvent.clientY - prevClientY;
          prevClientX = moveEvent.clientX;
          prevClientY = moveEvent.clientY;

          pendingDeltaWx += (stepClientDx / width) * WHITEBOARD_WIDTH;
          pendingDeltaWy += (stepClientDy / height) * WHITEBOARD_HEIGHT;

          if (dragRafId === null) {
            dragRafId = window.requestAnimationFrame(flushNodeDragDelta);
          }
        }
      }

      window.addEventListener('pointermove', handleWindowPointerMove);
      window.addEventListener('pointerup', handleWindowPointerUp);
      window.addEventListener('pointercancel', handleWindowPointerUp);
      window.addEventListener('blur', handleWindowPointerUp);
    },
    [boardScopeKey, multiSelectedNodeIds]
  );

  // Dragging a Network Zone Container (moves the Zone + all nodes belonging to that Zone, rAF-batched)
  const handleStartZoneDrag = useCallback(
    (
      zoneId: NetworkZoneColumn['id'],
      e: React.PointerEvent<SVGGElement>
    ) => {
      if (e.button !== 0) return;
      e.stopPropagation();

      const startClientX = e.clientX;
      const startClientY = e.clientY;
      let prevClientX = startClientX;
      let prevClientY = startClientY;
      let startedDrag = false;
      didDragObjectRef.current = false;

      // Cache rect once on pointerdown
      const rigEl = cameraRigRef.current || boardContainerRef.current;
      const cachedRect = rigEl?.getBoundingClientRect();
      const width = cachedRect?.width || 1000;
      const height = cachedRect?.height || 550;

      const targetZone = activeZones.find((z) => z.id === zoneId);
      const zoneNodeIds = activeNodes
        .filter((n) => n.zoneId === zoneId)
        .map((n) => n.id);

      let pendingDeltaWx = 0;
      let pendingDeltaWy = 0;
      let zoneDragRafId: number | null = null;

      const flushZoneDragDelta = () => {
        zoneDragRafId = null;
        if (pendingDeltaWx === 0 && pendingDeltaWy === 0) return;
        const applyDx = pendingDeltaWx;
        const applyDy = pendingDeltaWy;
        pendingDeltaWx = 0;
        pendingDeltaWy = 0;

        setZoneOffsetsByScenario((prev) => {
          const currentZoneOffsets = prev[boardScopeKey] || {};
          return {
            ...prev,
            [boardScopeKey]: moveSelectedNodesByDelta(
              [zoneId],
              currentZoneOffsets,
              applyDx,
              applyDy
            ),
          };
        });

        if (zoneNodeIds.length > 0) {
          setNodeOffsetsByScenario((prev) => {
            const currentNodeOffsets = prev[boardScopeKey] || {};
            return {
              ...prev,
              [boardScopeKey]: moveSelectedNodesByDelta(
                zoneNodeIds,
                currentNodeOffsets,
                applyDx,
                applyDy
              ),
            };
          });
        }
      };

      let cleanedUp = false;

      function handleWindowPointerUp() {
        if (cleanedUp) return;
        cleanedUp = true;
        if (zoneDragRafId !== null) {
          window.cancelAnimationFrame(zoneDragRafId);
          flushZoneDragDelta();
        }
        window.removeEventListener('pointermove', handleWindowPointerMove);
        window.removeEventListener('pointerup', handleWindowPointerUp);
        window.removeEventListener('pointercancel', handleWindowPointerUp);
        window.removeEventListener('blur', handleWindowPointerUp);
        if (startedDrag) {
          window.requestAnimationFrame(() => {
            setIsDraggingNodes(false);
            setDraggingZoneTitle(null);
          });
        }
      }

      function handleWindowPointerMove(moveEvent: PointerEvent) {
        if (cleanedUp) return;
        if (moveEvent.pointerType === 'mouse' && moveEvent.buttons === 0) {
          handleWindowPointerUp();
          return;
        }
        const totalDist = Math.hypot(
          moveEvent.clientX - startClientX,
          moveEvent.clientY - startClientY
        );

        if (!startedDrag && totalDist > 3) {
          startedDrag = true;
          didDragObjectRef.current = true;
          setIsDraggingNodes(true);
          setDraggingZoneTitle(targetZone?.code || zoneId);
          setMultiSelectedNodeIds(zoneNodeIds);
        }

        if (startedDrag) {
          const stepClientDx = moveEvent.clientX - prevClientX;
          const stepClientDy = moveEvent.clientY - prevClientY;
          prevClientX = moveEvent.clientX;
          prevClientY = moveEvent.clientY;

          pendingDeltaWx += (stepClientDx / width) * WHITEBOARD_WIDTH;
          pendingDeltaWy += (stepClientDy / height) * WHITEBOARD_HEIGHT;

          if (zoneDragRafId === null) {
            zoneDragRafId = window.requestAnimationFrame(flushZoneDragDelta);
          }
        }
      }

      window.addEventListener('pointermove', handleWindowPointerMove);
      window.addEventListener('pointerup', handleWindowPointerUp);
      window.addEventListener('pointercancel', handleWindowPointerUp);
      window.addEventListener('blur', handleWindowPointerUp);
    },
    [activeNodes, activeZones, boardScopeKey]
  );

  /** Single-click: select node for details / inspector. Does not expand. */
  const handleNodeSelect = useCallback(
    (node: WhiteboardSketchNode) => {
      setLastReturnedNodeId(null);
      onSelectNode(node.id);
      setMultiSelectedNodeIds([]);
    },
    [onSelectNode]
  );

  /** Double-click: expand into the internal visual sub-board when available. */
  const handleNodeExpand = useCallback(
    (node: WhiteboardSketchNode) => {
      const xPct = Math.round(((node.wx / 1480) * 100) * 10) / 10;
      const yPct = Math.round(((node.wy / 650) * 100) * 10) / 10;
      setPortalOrigin({ xPct, yPct });
      setPortalAnim({
        mode: 'EXPAND',
        xPct,
        yPct,
        nodeLabel: node.label,
        seqKey: Date.now(),
      });
      setLastReturnedNodeId(null);
      setActiveSketchNodeId(node.id);
      onSelectNode(node.id);
      setSelectedInternalSubNodeId(null);
      setMultiSelectedNodeIds([]);
    },
    [onSelectNode, setActiveSketchNodeId, setSelectedInternalSubNodeId]
  );

  const handleBackToMainTopology = () => {
    const returningNode = expandedSketchNode;
    const xPct = returningNode
      ? Math.round(((returningNode.wx / 1480) * 100) * 10) / 10
      : portalOrigin.xPct;
    const yPct = returningNode
      ? Math.round(((returningNode.wy / 650) * 100) * 10) / 10
      : portalOrigin.yPct;

    setPortalOrigin({ xPct, yPct });
    setPortalAnim({
      mode: 'COLLAPSE',
      xPct,
      yPct,
      nodeLabel: returningNode?.label || 'Network Topology',
      seqKey: Date.now(),
    });
    if (returningNode) {
      setLastReturnedNodeId(returningNode.id);
      onSelectNode(returningNode.id);
    } else {
      onSelectNode(null);
    }
    setActiveSketchNodeId(null);
    setSelectedInternalSubNodeId(null);
    setMultiSelectedNodeIds([]);
  };

  const toggleNodeInMultiSelection = useCallback(
    (nodeId: string, e: React.MouseEvent | React.PointerEvent) => {
      e.stopPropagation();
      setMultiSelectedNodeIds((prev) =>
        prev.includes(nodeId)
          ? prev.filter((id) => id !== nodeId)
          : [...prev, nodeId]
      );
    },
    []
  );

  const handleDiagramNodeClick = useCallback(
    (clickedNode: WhiteboardSketchNode, e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setHoveredNodeId(null);
      setNodeContextMenu(null);
      if (didDragObjectRef.current) {
        didDragObjectRef.current = false;
        return;
      }
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        toggleNodeInMultiSelection(clickedNode.id, e);
        return;
      }
      if (internalSubBoard) {
        setSelectedInternalSubNodeId(clickedNode.id);
      } else {
        handleNodeSelect(clickedNode);
      }
    },
    [
      handleNodeSelect,
      internalSubBoard,
      setSelectedInternalSubNodeId,
      toggleNodeInMultiSelection,
    ]
  );

  const handleDiagramNodeDoubleClick = useCallback(
    (clickedNode: WhiteboardSketchNode, e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setHoveredNodeId(null);
      setNodeContextMenu(null);
      if (didDragObjectRef.current) {
        didDragObjectRef.current = false;
        return;
      }
      if (internalSubBoard) return;
      handleNodeExpand(clickedNode);
    },
    [handleNodeExpand, internalSubBoard]
  );

  const handleDiagramNodeContextMenu = useCallback(
    (clickedNode: WhiteboardSketchNode, e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      clearHoverOpenTimeout();
      clearHoverTimeout();
      setHoveredNodeId(null);

      const boardRect = boardContainerRef.current?.getBoundingClientRect();
      const nodeRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const rawX =
        e.clientX > 0 && boardRect
          ? e.clientX - boardRect.left
          : boardRect
            ? nodeRect.left - boardRect.left + nodeRect.width / 2
            : 240;
      const rawY =
        e.clientY > 0 && boardRect
          ? e.clientY - boardRect.top
          : boardRect
            ? nodeRect.bottom - boardRect.top + 8
            : 180;

      const menuW = 285;
      const menuH = 148;
      const maxW = boardRect?.width || 1100;
      const maxH = boardRect?.height || 620;
      const clampedX = Math.max(12, Math.min(maxW - menuW - 12, Math.round(rawX)));
      const clampedY = Math.max(12, Math.min(maxH - menuH - 12, Math.round(rawY)));

      setNodeContextMenu({
        node: clickedNode,
        x: clampedX,
        y: clampedY,
        isSubBoard: Boolean(internalSubBoard),
      });
    },
    [clearHoverOpenTimeout, clearHoverTimeout, internalSubBoard]
  );

  const handleSelectAllNodes = useCallback(() => {
    if (multiSelectedNodeIds.length === activeNodes.length) {
      setMultiSelectedNodeIds([]);
    } else {
      setMultiSelectedNodeIds(activeNodes.map((n) => n.id));
    }
  }, [activeNodes, multiSelectedNodeIds.length]);

  const handleZoomByStep = useCallback((delta: number) => {
    setManualZoom((z) => {
      const next = Math.max(
        MIN_CANVAS_ZOOM,
        Math.min(MAX_CANVAS_ZOOM, +(z + delta).toFixed(2))
      );
      manualZoomRef.current = next;
      canvasControllerRef.current?.setTransform(
        panOffsetRef.current.x,
        panOffsetRef.current.y,
        next,
        120
      );
      return next;
    });
  }, []);

  const handleDirectionalPanNudge = useCallback((dx: number, dy: number) => {
    const nextX = panOffsetRef.current.x + dx;
    const nextY = panOffsetRef.current.y + dy;
    panOffsetRef.current = { x: nextX, y: nextY };
    canvasControllerRef.current?.setTransform(
      nextX,
      nextY,
      manualZoomRef.current,
      80
    );
    setPanOffset({ x: nextX, y: nextY });
  }, []);

  const executeShortcutCommand = useCallback(
    (commandId: ShortcutCommandId) => {
      if (commandId === 'TOOL_BOX_SELECT') {
        setInteractionMode('SELECT');
        return;
      }
      if (commandId === 'TOOL_PAN_PAGE') {
        setInteractionMode('PAN');
        return;
      }
      if (commandId === 'SELECT_ALL_NODES') {
        handleSelectAllNodes();
        return;
      }
      if (commandId === 'ESCAPE') {
        setMultiSelectedNodeIds([]);
        hideMarqueeEl();
        onCloseShortcutsModal?.();
        return;
      }
      if (commandId === 'ZOOM_IN') {
        handleZoomByStep(0.15);
        return;
      }
      if (commandId === 'ZOOM_OUT') {
        handleZoomByStep(-0.15);
        return;
      }
      if (commandId === 'RESET_CANVAS') {
        handleResetCanvasLayout();
        return;
      }
      if (commandId === 'AUTO_LAYOUT_NODES') {
        handleAutoLayoutNodes();
        return;
      }
      if (commandId === 'PAN_UP') {
        handleDirectionalPanNudge(0, KEYBOARD_PAN_STEP_PX);
        return;
      }
      if (commandId === 'PAN_DOWN') {
        handleDirectionalPanNudge(0, -KEYBOARD_PAN_STEP_PX);
        return;
      }
      if (commandId === 'PAN_LEFT') {
        handleDirectionalPanNudge(KEYBOARD_PAN_STEP_PX, 0);
        return;
      }
      if (commandId === 'PAN_RIGHT') {
        handleDirectionalPanNudge(-KEYBOARD_PAN_STEP_PX, 0);
        return;
      }
      if (commandId === 'TOGGLE_AUTOCAM') {
        setAutoCameraEnabled((v) => !v);
        return;
      }
      if (commandId === 'TOGGLE_TACTICAL') {
        onToggleTacticalMode?.();
        return;
      }
      if (commandId === 'PLAY_PAUSE_SEQUENCE') {
        if (onTogglePlay) {
          onTogglePlay();
        } else if (onStartWalkthrough) {
          onStartWalkthrough();
        }
        return;
      }
      if (commandId === 'STEP_BACKWARD') {
        onStepBackward?.();
        return;
      }
      if (commandId === 'STEP_FORWARD') {
        onStepForward?.();
        return;
      }
      if (commandId === 'TOGGLE_SHORTCUTS_HELP') {
        if (shortcutsModalOpen) {
          onCloseShortcutsModal?.();
        } else {
          onOpenShortcutsModal?.();
        }
      }
    },
    [
      handleAutoLayoutNodes,
      handleDirectionalPanNudge,
      handleResetCanvasLayout,
      handleSelectAllNodes,
      handleZoomByStep,
      hideMarqueeEl,
      onCloseShortcutsModal,
      onOpenShortcutsModal,
      onStartWalkthrough,
      onStepBackward,
      onStepForward,
      onTogglePlay,
      onToggleTacticalMode,
      shortcutsModalOpen,
    ]
  );

  // Global Keyboard Shortcut Listener for Tool Switching (B / P), Force-Directed Auto-Layout (A) & Canvas Navigation
  useEffect(() => {
    const onWindowKeyDown = (e: KeyboardEvent) => {
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

      // View mode hotkeys (1-4) and ? help toggle are handled at workbench level if registered,
      // while tool & canvas commands execute directly here.
      if (
        command === 'TOOL_BOX_SELECT' ||
        command === 'TOOL_PAN_PAGE' ||
        command === 'SELECT_ALL_NODES' ||
        command === 'ZOOM_IN' ||
        command === 'ZOOM_OUT' ||
        command === 'RESET_CANVAS' ||
        command === 'AUTO_LAYOUT_NODES' ||
        command === 'PAN_UP' ||
        command === 'PAN_DOWN' ||
        command === 'PAN_LEFT' ||
        command === 'PAN_RIGHT' ||
        command === 'TOGGLE_AUTOCAM'
      ) {
        e.preventDefault();
        executeShortcutCommand(command);
      }
    };

    window.addEventListener('keydown', onWindowKeyDown);
    return () => window.removeEventListener('keydown', onWindowKeyDown);
  }, [executeShortcutCommand]);

  const boardMotionKey =
    internalSubBoard && expandedSketchNode
      ? `expanded-subboard-${expandedSketchNode.id}-${activeEnvironment}`
      : `main-topology-${scenario.id}-${activeEnvironment}`;

  const hoveredNode = useMemo(
    () =>
      diagramTooltipsEnabled && !isDraggingNodes && !isBoxSelectHoldActive
        ? activeNodes.find((n) => n.id === hoveredNodeId) || null
        : null,
    [
      activeNodes,
      diagramTooltipsEnabled,
      hoveredNodeId,
      isBoxSelectHoldActive,
      isDraggingNodes,
    ]
  );

  return (
    <div
      className="relative flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden select-none p-2 gap-1.5"
      data-testid="attack-visualizer"
      data-inspector-scope={
        internalSubBoard
          ? selectedInternalSubNodeId
            ? 'INTERNAL_SUBNODE'
            : 'EXPANDED_NODE'
          : 'MAIN_SCENARIO'
      }
      data-active-environment={activeEnvironment}
      data-tactical-mode={tacticalMode ? 'true' : 'false'}
      data-interaction-mode={interactionMode}
      data-auto-layout-active={isAutoLayoutActive ? 'true' : 'false'}
      data-auto-layout-mode={activeAutoLayoutMode || 'NONE'}
      data-search-filtering={searchResult.isFiltering ? 'true' : 'false'}
      data-search-match-count={searchResult.matchedNodeIds.length}
      onContextMenu={(e) => e.preventDefault()}
      dir="ltr"
    >
      {/* Expandable Zone Sub-View Context Bar (Only rendered when expanded inside an internal sub-board) */}
      <AnimatePresence mode="wait" initial={false}>
        {!topBarHidden && internalSubBoard && expandedSketchNode && (
          <motion.div
            key={`subboard-header-${expandedSketchNode.id}`}
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="expanded-node-subboard-header"
            className="relative z-30 shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-2xs flex flex-col gap-1"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <motion.button
                  type="button"
                  whileHover={{ x: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  data-testid="back-to-main-topology-btn"
                  onClick={handleBackToMainTopology}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-[11px] font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Parent View</span>
                </motion.button>

                <WorkbenchIconTooltip
                  label={internalSubBoard.title}
                  badge={`NODE #${expandedSketchNode.chainOrder}`}
                  detail={internalSubBoard.environmentBreadcrumb}
                  side="bottom"
                  align="left"
                >
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10.5px] font-semibold cursor-default whitespace-nowrap">
                    <Maximize2 className="w-3 h-3 shrink-0" />
                    <span>
                      Node #{expandedSketchNode.chainOrder} ·{' '}
                      {expandedSketchNode.label}
                    </span>
                  </span>
                </WorkbenchIconTooltip>

                {companionSketchNode && (
                  <WorkbenchIconTooltip
                    label={
                      internalSubBoard.currentScopeType === 'MALWARE_ON_HOST'
                        ? `Switch to Host: ${companionSketchNode.label}`
                        : `Switch to Process: ${companionSketchNode.label}`
                    }
                    badge={companionSketchNode.sublabel}
                    detail={companionSketchNode.internalSummary}
                    side="bottom"
                  >
                    <button
                      type="button"
                      data-testid="switch-companion-host-process-btn"
                      onClick={() => handleNodeExpand(companionSketchNode)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                        internalSubBoard.currentScopeType === 'MALWARE_ON_HOST'
                          ? 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/70 dark:hover:bg-sky-900/80 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                          : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      <ArrowRightLeft className="w-3 h-3 shrink-0" />
                      <span>
                        {internalSubBoard.currentScopeType === 'MALWARE_ON_HOST'
                          ? `Host: ${companionSketchNode.label}`
                          : `Process: ${companionSketchNode.label}`}
                      </span>
                    </button>
                  </WorkbenchIconTooltip>
                )}
              </div>

              <WorkbenchIconTooltip
                label="Hide Sub-Board Header"
                badge="HIDE"
                detail="Collapse sub-board breadcrumb header to maximize diagram space"
                side="bottom"
                align="right"
              >
                <button
                  type="button"
                  data-testid="hide-canvas-top-bar-btn"
                  aria-label="Hide Top Canvas Toolbar"
                  onClick={() => setTopBarHidden(true)}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-zinc-200/80 dark:border-zinc-700 transition-colors cursor-pointer"
                >
                  <EyeOff className="w-3 h-3" />
                </button>
              </WorkbenchIconTooltip>
            </div>

            <div
              data-testid="expanded-node-environment-breadcrumb"
              className={`w-full px-2.5 py-1 rounded-lg text-[11px] font-medium border leading-snug break-words ${
                internalSubBoard.currentScopeType === 'MALWARE_ON_HOST'
                  ? 'bg-rose-50/80 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border-rose-200/80 dark:border-rose-800/70'
                  : internalSubBoard.currentScopeType === 'HOST_OS_ENVIRONMENT'
                  ? 'bg-sky-50/80 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 border-sky-200/80 dark:border-sky-800/70'
                  : 'bg-zinc-50 dark:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-700'
              }`}
            >
              {internalSubBoard.environmentBreadcrumb}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maximum-Height Center Diagram Canvas with CanvasController (react-zoom-pan-pinch), Scrollbars, Mouse Pan, Shift+Click Multi-Selection & Zone/Node Dragging */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden rounded-2xl">
        <div
          ref={boardContainerRef}
          onPointerDown={handleBoardPointerDown}
          onDragOver={handleBoardDragOver}
          onDragLeave={handleBoardDragLeave}
          onDrop={handleBoardDrop}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          data-testid={
            internalSubBoard
              ? 'expanded-node-visual-board'
              : 'main-network-topology-board'
          }
          data-active-environment={activeEnvironment}
          data-architecture-code={envProfile.architectureCode}
          data-tactical-mode={tacticalMode ? 'true' : 'false'}
          data-zoom-scale={effectiveScale}
          data-pan-x={panOffset.x}
          data-pan-y={panOffset.y}
          data-selected-count={multiSelectedNodeIds.length}
          data-vector-drop-active={isVectorDragOver ? 'true' : 'false'}
          className={`excalidraw-board-bg relative w-full h-full rounded-2xl border overflow-hidden ${
            forceDesktopCanvas ? 'touch-none' : 'touch-pan-y sm:touch-none'
          } transition-colors duration-300 ${
            isPanningCanvas
              ? 'cursor-grabbing'
              : interactionMode === 'PAN'
              ? 'cursor-grab'
              : 'cursor-crosshair'
          } ${
            isVectorDragOver
              ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-950/10'
              : tacticalMode
              ? 'bg-[#050B14] border-emerald-500/60 shadow-[inset_0_0_55px_rgba(16,185,129,0.14)]'
              : 'bg-[#FDFBF7] dark:bg-[#0D111A] border-zinc-200/90 dark:border-zinc-800 shadow-2xs'
          }`}
        >
          {/* Attack Vector Drag-and-Drop Overlay Indicator */}
          {isVectorDragOver && (
            <div
              data-testid="canvas-vector-drop-overlay"
              className="pointer-events-none absolute inset-3 z-40 rounded-xl border-2 border-dashed border-rose-500/80 bg-rose-500/10 flex items-center justify-center backdrop-blur-[1px]"
            >
              <div className="px-4 py-2 rounded-xl bg-zinc-950/90 text-white border border-rose-500/60 shadow-2xl font-mono text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Drop Attack Vector to Inject into Simulation Graph</span>
              </div>
            </div>
          )}
          {/* Floating Top-Right "Show Header" Pill when Inside SubBoard and Header is Hidden */}
          {topBarHidden && internalSubBoard && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 right-3 z-30 flex items-center gap-1.5"
            >
              <WorkbenchIconTooltip
                label="Back to Parent Topology"
                detail="Exit this node's internal pipeline and return to the parent network diagram"
                placement="bottom"
              >
                <button
                  type="button"
                  onClick={handleBackToMainTopology}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 dark:bg-zinc-100/95 text-white dark:text-zinc-900 text-[11px] font-semibold shadow-md backdrop-blur-md cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              </WorkbenchIconTooltip>
              <WorkbenchIconTooltip
                label="Show Sub-Board Header"
                detail="Restore the expanded node sub-board breadcrumb bar"
                placement="bottom"
              >
                <button
                  type="button"
                  data-testid="show-canvas-top-bar-btn"
                  onClick={() => setTopBarHidden(false)}
                  aria-label="Show Canvas Top Bar"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200/90 dark:border-zinc-700 text-[11px] font-mono font-semibold shadow-md backdrop-blur-md transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Show Header</span>
                </button>
              </WorkbenchIconTooltip>
            </div>
          )}

          {/* Tactical Mode Grid-Based Cyber Overlay */}
          <AnimatePresence>
            {tacticalMode && (
              <motion.div
                key="tactical-overlay-layer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="pointer-events-none absolute inset-0 z-10"
              >
                <TacticalGridOverlay
                  activeEnvironment={activeEnvironment}
                  scenarioCode={scenario.code}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stable HUD (no AnimatePresence) — avoids removeChild races during pan/select */}
          <div
            data-testid="canvas-panning-hud"
            aria-hidden={
              !(isPanningCanvas || isBoxSelectHoldActive || draggingZoneTitle)
            }
            className={`pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-40 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-mono font-bold shadow-lg flex items-center gap-1.5 max-w-[90%] transition-opacity duration-150 ${
              isPanningCanvas || isBoxSelectHoldActive || draggingZoneTitle
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            {draggingZoneTitle ? (
              <>
                <Move className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">
                  Moving Zone: {draggingZoneTitle}
                </span>
              </>
            ) : isBoxSelectHoldActive ? (
              <>
                <MousePointer className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Box Select</span>
              </>
            ) : (
              <>
                <Hand className="w-3.5 h-3.5 shrink-0" />
                <span ref={panHudTextRef} className="whitespace-nowrap">
                  Panning Canvas
                </span>
              </>
            )}
          </div>

          {/* 1. SCENARIO BRIEFING OVERLAY BANNER */}
          <AnimatePresence>
            {(director.phase === 'INTRO_SURVEY' ||
              director.phase === 'INTRO_FOCUS_ORIGIN') && (
              <motion.div
                key={`intro-briefing-${director.phase}`}
                data-testid="cinematic-intro-banner"
                initial={{ opacity: 0, y: -18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-xl min-w-[260px] rounded-xl bg-slate-950/92 text-white border border-rose-500/50 shadow-2xl px-4 py-2.5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-2 min-w-0 text-[10px] font-mono text-rose-400 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5 font-bold min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="leading-snug break-words">
                      {director.phase === 'INTRO_SURVEY'
                        ? 'SCENARIO BRIEFING · FULL TOPOLOGY SURVEY'
                        : 'CAMERA LOCKING ON ATTACK ORIGIN'}
                    </span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                    {scenario.code}
                  </span>
                </div>
                <div className="mt-1 text-xs sm:text-sm font-bold text-white leading-snug break-words">
                  {scenario.name}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-300 leading-snug break-words">
                  {scenario.overview}
                </div>
                {director.originNode && director.finalNode && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 min-w-0 text-[10px] font-mono text-amber-300">
                    <span className="min-w-0 leading-snug">
                      START: {director.originNode.label}
                    </span>
                    <span className="text-rose-400 shrink-0">
                      ── {scenario.stages.length} STAGES ──▶
                    </span>
                    <span className="text-emerald-400 min-w-0 leading-snug">
                      END: {director.finalNode.label}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. SCENARIO COMPLETE OUTRO SUMMARY OVERLAY */}
          <AnimatePresence>
            {director.phase === 'OUTRO_COMPLETE' && (
              <motion.div
                key="outro-complete-banner"
                data-testid="cinematic-outro-banner"
                initial={{ opacity: 0, y: 18, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-lg rounded-xl bg-slate-950/95 text-white border border-emerald-500/50 shadow-2xl px-4 py-3 backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      ATTACK SCENARIO COMPLETE
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {onStartWalkthrough && (
                      <button
                        type="button"
                        data-testid="outro-replay-btn"
                        onClick={onStartWalkthrough}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Replay</span>
                      </button>
                    )}
                    {onResetWalkthrough && (
                      <button
                        type="button"
                        onClick={onResetWalkthrough}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Overview
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">
                  {`Full attack chain traced from "${director.originNode?.label}" through ${scenario.stages.length} stages to "${director.finalNode?.label}". Camera zoomed back out to full topology view.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. Animated Portal Ripple & Action HUD when Expanding or Returning */}
          <AnimatePresence>
            {portalAnim && (
              <motion.div
                key={`portal-fx-${portalAnim.seqKey}`}
                data-testid="expand-collapse-motion-portal"
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.72, ease: 'easeOut' }}
                onAnimationComplete={() => setPortalAnim(null)}
                className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
              >
                <motion.div
                  initial={{
                    scale: portalAnim.mode === 'EXPAND' ? 0.2 : 2.2,
                    opacity: 0.85,
                  }}
                  animate={{
                    scale: portalAnim.mode === 'EXPAND' ? 2.6 : 0.25,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    left: `${portalAnim.xPct}%`,
                    top: `${portalAnim.yPct}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-2 ${
                    portalAnim.mode === 'EXPAND'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_50px_rgba(99,102,241,0.35)]'
                      : 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.35)]'
                  }`}
                />

                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.22 }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-900/90 dark:bg-zinc-100/95 text-white dark:text-zinc-900 text-[11px] font-medium shadow-lg flex items-center gap-1.5 backdrop-blur-xs"
                >
                  {portalAnim.mode === 'EXPAND' ? (
                    <>
                      <Maximize2 className="w-3 h-3 text-indigo-400 dark:text-indigo-600" />
                      <span>
                        {`Expanding Internal Pipeline: ${portalAnim.nodeLabel}`}
                      </span>
                    </>
                  ) : (
                    <>
                      <Minimize2 className="w-3 h-3 text-emerald-400 dark:text-emerald-600" />
                      <span>
                        {`Returning to Main Topology from: ${portalAnim.nodeLabel}`}
                      </span>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4A. Compact Mobile Board (Native vertical touch scroll, outside TransformWrapper) */}
          {!forceDesktopCanvas && (
            <div className="sm:hidden relative w-full h-full z-20 overflow-hidden">
              <ResponsiveMobileZonesView
                zones={activeZones}
                sketchNodes={activeNodes}
                sketchFlows={activeFlows}
                selectedSketchNode={
                  internalSubBoard
                    ? activeInternalSubNode
                    : selectedSketchNode
                }
                onSelectNode={(node) => {
                  if (internalSubBoard) {
                    setSelectedInternalSubNodeId(node.id);
                  } else {
                    handleNodeSelect(node);
                  }
                }}
                onExpandNode={
                  !internalSubBoard
                    ? (node) => handleNodeExpand(node)
                    : undefined
                }
                selectedTelemetryId={selectedTelemetryId}
                onSelectTelemetry={onSelectTelemetry}
              />
            </div>
          )}

          {/* 4B. Animated Desktop Board Switcher Wrapped in CanvasController (react-zoom-pan-pinch) */}
          <div
            className={`${
              forceDesktopCanvas ? 'block' : 'hidden sm:block'
            } relative w-full h-full z-20`}
          >
          <CanvasController
            ref={canvasControllerRef}
            panningEnabled={interactionMode === 'PAN' && !isBoxSelectHoldActive}
            wheelZoomEnabled={true}
            onTransformChange={({ scale, positionX, positionY }) => {
              // Keep refs in sync for pinch-zoom on touch / forced-desktop phones.
              const rx = Math.round(positionX);
              const ry = Math.round(positionY);
              manualZoomRef.current = scale;
              panOffsetRef.current = { x: rx, y: ry };
              setManualZoom((prev) =>
                Math.abs(prev - scale) < 0.002 ? prev : scale
              );
              setPanOffset((prev) =>
                prev.x === rx && prev.y === ry ? prev : { x: rx, y: ry }
              );
            }}
            onPanningStart={() => setIsPanningCanvas(true)}
            onPanningStop={(offset) => {
              const rx = Math.round(offset.x);
              const ry = Math.round(offset.y);
              panOffsetRef.current = { x: rx, y: ry };
              setIsPanningCanvas(false);
              setPanOffset((prev) =>
                prev.x === rx && prev.y === ry ? prev : { x: rx, y: ry }
              );
            }}
          >
            <AnimatePresence initial={false}>
            <motion.div
              key={boardMotionKey}
              style={{
                  transformOrigin: `${portalOrigin.xPct}% ${portalOrigin.yPct}%`,
                }}
              initial={
                portalAnim
                  ? internalSubBoard
                    ? { opacity: 0, scale: 0.92 }
                    : { opacity: 0, scale: 1.06 }
                  : false
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.18,
                ease: 'easeOut',
              }}
              className="relative w-full h-full overflow-visible z-20"
            >
              {/* Desktop topology board (also used on phones when Desktop layout is forced) */}
              <div
                className="flex relative w-full h-full overflow-visible items-center justify-center"
                style={{ containerType: 'size' }}
                data-testid="whiteboard-aspect-stage"
              >
              <motion.div
                  ref={cameraRigRef}
                data-testid="cinematic-camera-rig"
                data-camera-frame={director.camera.frameCode}
                data-camera-scale={effectiveScale}
                // Prefer 2D matrix (no translate3d) so zoom stays vector-sharp.
                transformTemplate={({ x, y, scale }) =>
                  `translate(${x ?? 0}, ${y ?? 0}) scale(${scale ?? 1})`
                }
                animate={{
                  x: `${effectiveTxPct}%`,
                  y: `${effectiveTyPct}%`,
                    // Avoid nested CSS scale while the user is manually zoomed —
                    // double scale layers are a common blur source.
                    scale:
                      autoCameraEnabled && Math.abs(manualZoom - 1) < 0.02
                        ? director.camera.scale
                        : 1,
                  }}
                  transition={
                    isPanningCanvas || isCanvasInteracting
                      ? { duration: 0 }
                      : {
                  type: 'spring',
                          stiffness: 210,
                  damping: 26,
                          mass: 0.8,
                        }
                  }
                style={{
                    transformOrigin: '50% 50%',
                    aspectRatio: `${WHITEBOARD_WIDTH} / ${WHITEBOARD_HEIGHT}`,
                    width: `min(100cqw, calc(100cqh * ${WHITEBOARD_WIDTH} / ${WHITEBOARD_HEIGHT}))`,
                    height: `min(100cqh, calc(100cqw * ${WHITEBOARD_HEIGHT} / ${WHITEBOARD_WIDTH}))`,
                    willChange: 'auto',
                  }}
                  className="relative overflow-visible"
              >
                <SketchWhiteboardSvg
                  zones={activeZones}
                  backboneLinks={activeBackboneLinks}
                  sketchFlows={activeFlows}
                  selectedTelemetryId={selectedTelemetryId}
                  onSelectTelemetry={onSelectTelemetry}
                    onStartZoneDrag={handleStartZoneDrag}
                    onSelectZone={
                      !internalSubBoard
                        ? (zoneId) => {
                            if (didDragObjectRef.current) {
                              didDragObjectRef.current = false;
                              return;
                            }
                            const targetNode = sketchNodes.find(
                              (n) => n.zoneId === zoneId
                            );
                            if (targetNode) {
                              handleNodeSelect(targetNode);
                            }
                          }
                        : undefined
                    }
                  activeEnvironment={activeEnvironment}
                  tacticalMode={tacticalMode}
                    isInteracting={isCanvasInteracting}
                  />

                  {/* Persistent marquee node — painted imperatively during drag */}
                  <div
                    ref={marqueeElRef}
                    hidden
                    data-testid="windows-marquee-selection-box"
                    className="pointer-events-none absolute z-40 rounded-md bg-indigo-500/18 border-2 border-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.35)]"
                    style={{ left: '0%', top: '0%', width: '0%', height: '0%' }}
                  />

                {/* Floating Speech-Bubble Callout (Intro Survey Only) */}
                <AnimatePresence mode="wait">
                  {director.activeCallout &&
                    (director.phase === 'INTRO_SURVEY' ||
                      director.phase === 'INTRO_FOCUS_ORIGIN') && (
                    <motion.div
                      key={`callout-${director.phase}-${director.activeCallout.nodeId}-${activeStageIndex}`}
                      data-testid="cinematic-node-callout"
                      initial={{ opacity: 0, scale: 0.65, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.75, y: 6 }}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 24,
                      }}
                      style={{
                        left: `${(director.activeCallout.wx / 1480) * 100}%`,
                        top: `${(director.activeCallout.wy / 650) * 100}%`,
                      }}
                      className={`pointer-events-none absolute -translate-x-1/2 z-30 w-72 min-w-[240px] max-w-[300px] rounded-xl bg-slate-950/95 text-white border border-rose-500/70 shadow-[0_10px_28px_rgba(15,23,42,0.55)] px-3 py-2 ${
                        director.activeCallout.placement === 'TOP'
                          ? '-translate-y-[calc(100%+58px)]'
                          : 'translate-y-[58px]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 min-w-0 text-[9.5px] font-mono">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-300 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                          <span className="leading-snug break-words">
                            {director.activeCallout.stepBadge}
                          </span>
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] font-extrabold text-white leading-snug break-words">
                        {director.activeCallout.headline}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-300 leading-snug break-words">
                        {director.activeCallout.detail}
                      </div>
                      <div className="mt-1.5 pt-1 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1 min-w-0 text-[9px] font-mono">
                        <span className="text-rose-400 font-bold leading-snug break-words">
                          {director.activeCallout.forwardTag}
                        </span>
                        <span className="text-emerald-400 font-bold leading-snug break-words">
                          {director.activeCallout.returnTag}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                  {/* Draggable & Multi-Selectable Schematic Nodes (framer-motion useDragControls + Shift+Click Group Selection) */}
                {activeNodes.map((node, nIdx) => {
                  const isSelected = internalSubBoard
                    ? selectedInternalSubNodeId === node.id
                    : selectedNodeId === node.id;
                    const isMultiSelected = multiSelectedNodeIds.includes(
                      node.id
                    );
                  const isRecentlyReturned =
                    !internalSubBoard && lastReturnedNodeId === node.id;

                  const cState = director.nodeStates[node.id] || {
                    opacity: 1,
                    scale: 1,
                    yOffset: 0,
                    showPulseRing: false,
                    pulseColor: '#6366F1',
                      role: 'OVERVIEW',
                    };

                  return (
                      <DraggableDiagramNode
                      key={node.id}
                        node={node}
                        nodeIndex={nIdx}
                        isSubBoard={Boolean(internalSubBoard)}
                        isSelected={isSelected}
                        isMultiSelected={isMultiSelected}
                        isRecentlyReturned={isRecentlyReturned}
                        isDraggingNodes={isDraggingNodes}
                        isInteracting={isCanvasInteracting}
                        isAutoLayoutAnimating={isAutoLayoutAnimating}
                        isSearchFiltering={searchResult.isFiltering}
                        isSearchMatch={matchedNodeIdSet.has(node.id)}
                        isSearchFocused={
                          searchResult.isFiltering &&
                          focusedSearchNodeId === node.id
                        }
                        activeStageIndex={activeStageIndex}
                        directorPhase={director.phase}
                        cState={cState}
                        tacticalMode={tacticalMode}
                        onStartNodeGroupDrag={handleNodePointerDown}
                        onToggleMultiSelect={toggleNodeInMultiSelection}
                        onHoverChange={handleNodeHoverChange}
                        onNodeClick={handleDiagramNodeClick}
                        onNodeDoubleClick={handleDiagramNodeDoubleClick}
                        onNodeContextMenu={handleDiagramNodeContextMenu}
                      />
                  );
                })}
              </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          </CanvasController>
          </div>

          {/* Right-Click Context Menu for Diagram Nodes (Expand Internal Pipeline & Detailed Drill-Down) */}
          <AnimatePresence>
            {nodeContextMenu && (
              <motion.div
                key={`node-context-menu-${nodeContextMenu.node.id}`}
                role="menu"
                aria-label={`Actions for ${nodeContextMenu.node.label}`}
                data-testid="diagram-node-context-menu"
                data-node-id={nodeContextMenu.node.id}
                initial={{ opacity: 0, scale: 0.94, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 2 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
                style={{
                  left: `${nodeContextMenu.x}px`,
                  top: `${nodeContextMenu.y}px`,
                }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="absolute z-50 w-72 rounded-xl bg-white/98 dark:bg-zinc-900/98 border border-zinc-200/90 dark:border-zinc-700/90 shadow-2xl p-2 backdrop-blur-md flex flex-col gap-1.5"
              >
                <div className="px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9.5px] font-bold">
                        #{nodeContextMenu.node.sequenceCode || nodeContextMenu.node.chainOrder}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {nodeContextMenu.isSubBoard
                          ? 'INTERNAL SUB-NODE'
                          : 'EXPANDABLE NODE'}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs font-extrabold text-zinc-900 dark:text-white leading-snug break-words">
                      {nodeContextMenu.node.label}
                    </div>
                  </div>
                </div>

                {!nodeContextMenu.isSubBoard ? (
                  <button
                    type="button"
                    role="menuitem"
                    data-testid="context-menu-expand-node-btn"
                    onClick={() => {
                      const target = nodeContextMenu.node;
                      setNodeContextMenu(null);
                      handleNodeExpand(target);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-left transition-colors cursor-pointer flex items-start gap-2.5 shadow-xs"
                  >
                    <Maximize2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold leading-snug flex items-center justify-between gap-1.5">
                        <span>Expand Inside Node</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/20 font-mono text-[9.5px]">
                          Sub-Board
                        </span>
                      </div>
                      <div className="mt-0.5 text-[10.5px] text-indigo-100 leading-snug break-words">
                        Enter inside {nodeContextMenu.node.label} to inspect internal sub-nodes &amp; telemetry in detail
                      </div>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    data-testid="context-menu-back-to-parent-btn"
                    onClick={() => {
                      setNodeContextMenu(null);
                      handleBackToMainTopology();
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-left transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                    <span>Back to Parent Topology View</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Viewport-Clamped, Collision-Aware Diagram Node Hover Tooltip (Rendered at Board Container Scope) */}
          <AnimatePresence>
            {hoveredNode && !nodeContextMenu && (
              <NodeHoverTooltip
                key={`hover-tooltip-${hoveredNode.id}`}
                node={hoveredNode}
                allNodes={activeNodes}
                isSubBoard={Boolean(internalSubBoard)}
                boardContainerRef={boardContainerRef}
                isCollapsed={diagramTooltipCollapsed}
                onToggleCollapsed={() =>
                  setDiagramTooltipCollapsed((prev) => !prev)
                }
                onTooltipMouseEnter={handleTooltipMouseEnter}
                onTooltipMouseLeave={handleTooltipMouseLeave}
              />
            )}
          </AnimatePresence>

          {/* Bottom-Left: Active Camera Status HUD (Pinned in Viewport) */}
          {(activeStageIndex > 0 || director.phase !== 'OVERVIEW') && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`${
                forceDesktopCanvas ? 'flex' : 'hidden sm:flex'
              } flex-col items-start gap-2 absolute bottom-4 left-4 z-30`}
            >
              <div
                data-testid="camera-status-hud"
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/90 dark:bg-zinc-900/95 text-white border border-zinc-700/80 text-[10.5px] font-mono shadow-md backdrop-blur-xs"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isPlaying
                      ? 'bg-rose-500 animate-ping'
                      : 'bg-emerald-400'
                  }`}
                />
                <span className="font-semibold break-words">
                  {director.camera.frameTitle}
                </span>
              </div>
            </div>
          )}

          {/* Bottom-Right: Merged Compact Floating Control Bar (Pinned in Viewport) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-none flex flex-col items-end gap-1.5 absolute bottom-2 left-12 right-2 sm:bottom-2.5 sm:right-2.5 z-30"
          >
            <PlaybackControlBar
              isPlaying={isPlaying}
              onTogglePlay={
                onTogglePlay ||
                (() => {
                  if (onStartWalkthrough) onStartWalkthrough();
                })
              }
              onStepBackward={onStepBackward}
              onStepForward={onStepForward}
              onReset={onResetWalkthrough}
              canStepBackward={canStepBackward}
              canStepForward={canStepForward}
              activeStageIndex={activeStageIndex}
              totalStages={scenario.stages.length}
              playbackSpeed={playbackSpeed}
              onSpeedChange={onSpeedChange}
              autoCameraEnabled={autoCameraEnabled}
              onToggleAutoCamera={() => setAutoCameraEnabled((v) => !v)}
              effectiveScale={effectiveScale}
              frameTitle={director.camera.frameTitle}
              onZoomOut={() => {
                setManualZoom((z) => {
                  const next = Math.max(MIN_CANVAS_ZOOM, +(z - 0.15).toFixed(2));
                  manualZoomRef.current = next;
                  canvasControllerRef.current?.setTransform(
                    panOffsetRef.current.x,
                    panOffsetRef.current.y,
                    next,
                    120
                  );
                  return next;
                });
              }}
              onZoomIn={() => {
                setManualZoom((z) => {
                  const next = Math.min(MAX_CANVAS_ZOOM, +(z + 0.15).toFixed(2));
                  manualZoomRef.current = next;
                  canvasControllerRef.current?.setTransform(
                    panOffsetRef.current.x,
                    panOffsetRef.current.y,
                    next,
                    120
                  );
                  return next;
                });
              }}
              onResetZoom={handleResetCanvasLayout}
              interactionMode={interactionMode}
              onInteractionModeChange={setInteractionMode}
              isAutoLayoutActive={isAutoLayoutActive}
              activeAutoLayoutMode={activeAutoLayoutMode}
              onAutoLayoutNodes={handleAutoLayoutNodes}
              multiSelectedCount={multiSelectedNodeIds.length}
              totalNodesCount={activeNodes.length}
              onSelectAllNodes={handleSelectAllNodes}
              diagramTooltipsEnabled={diagramTooltipsEnabled}
              onToggleDiagramTooltips={() =>
                setDiagramTooltipsEnabled((prev) => !prev)
              }
              onOpenShortcutsModal={onOpenShortcutsModal}
              hasCustomLayoutOrView={hasCustomLayoutOrView}
              isSearchFiltering={searchResult.isFiltering}
              searchQuery={searchResult.query}
              matchedNodesCount={searchResult.matchedNodeIds.length}
              onClearSearchFilter={
                onNodeSearchQueryChange
                  ? () => onNodeSearchQueryChange('')
                  : undefined
              }
              forceDesktopCanvas={forceDesktopCanvas}
            />
          </div>
        </div>
      </div>

      {/* Interactive Keyboard Shortcuts & Canvas Navigation Overlay */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => onCloseShortcutsModal?.()}
        activeToolMode={interactionMode}
        effectiveScale={effectiveScale}
        autoCameraEnabled={autoCameraEnabled}
        tacticalMode={tacticalMode}
        isPlaying={isPlaying}
        onExecuteCommand={executeShortcutCommand}
      />
    </div>
  );
}
