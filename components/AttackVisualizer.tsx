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
  getStageLocationContext,
  NetworkZoneColumn,
  WhiteboardSketchNode,
} from '@/lib/sketch-zones-and-drilldown';
import {
  CinematicPhase,
  computeCinematicDirectorState,
} from '@/lib/cinematic-camera-director';
import {
  applyNodePositionOffsets,
  applyZonePositionOffsets,
  computeMarqueeSelectedNodeIds,
  computeScrollWheelZoom,
  MarqueeBoxCoords,
  MAX_CANVAS_ZOOM,
  MIN_CANVAS_ZOOM,
  moveSelectedNodesByDelta,
  NodeOffsetDelta,
  Point2D,
  recomputeGeometryForMovedBoard,
  resolveCanvasHoldInteractionMode,
  WHITEBOARD_HEIGHT,
  WHITEBOARD_WIDTH,
} from '@/lib/canvas-interaction-engine';
import { SketchWhiteboardSvg } from './canvas/SketchWhiteboardSvg';
import { ResponsiveMobileZonesView } from './canvas/ResponsiveMobileZonesView';
import { TacticalGridOverlay } from './canvas/TacticalGridOverlay';
import { CanvasMinimapOverlay } from './canvas/CanvasMinimapOverlay';
import { NodeHoverTooltip } from './NodeHoverTooltip';
import { DiagramLegendPanel } from './DiagramLegendPanel';
import { PlaybackControlBar } from './PlaybackControlBar';
import {
  CanvasController,
  CanvasControllerHandle,
} from './CanvasController';
import { DraggableDiagramNode } from './DraggableDiagramNode';
import { OperationalGuideIcon } from './OperationalGuideIcon';
import { WorkbenchIconTooltip } from './WorkbenchIconTooltip';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { formatConciseInternalFlowPill } from '@/lib/ui-text-standards';
import {
  KEYBOARD_PAN_STEP_PX,
  resolveKeyboardShortcutCommand,
  ShortcutCommandId,
} from '@/lib/keyboard-shortcuts';
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  CheckSquare,
  Cloud,
  Eye,
  EyeOff,
  Hand,
  Keyboard,
  Laptop,
  Maximize2,
  Minimize2,
  MousePointer,
  Move,
  RotateCcw,
  Server,
  Sparkles,
} from 'lucide-react';

export interface AttackVisualizerProps {
  scenario: AttackScenario;
  stageView: ComputedStageView;
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onSelectStage?: (stageIndex: number) => void;
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
  onSelectEnvironment?: (env: ActiveEnvironmentId) => void;
  tacticalMode?: boolean;
  onToggleTacticalMode?: () => void;
  showLegend?: boolean;
  onToggleLegend?: () => void;
  shortcutsModalOpen?: boolean;
  onOpenShortcutsModal?: () => void;
  onCloseShortcutsModal?: () => void;
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
  showLegend = true,
  onToggleLegend,
  shortcutsModalOpen = false,
  onOpenShortcutsModal,
  onCloseShortcutsModal,
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
  const [marqueeBox, setMarqueeBox] = useState<MarqueeBoxCoords | null>(null);
  const [multiSelectedNodeIds, setMultiSelectedNodeIds] = useState<string[]>(
    []
  );

  // User-dragged position offsets for main topology nodes, sub-board nodes, and zones
  const [nodeOffsetsByScenario, setNodeOffsetsByScenario] = useState<
    Record<string, Record<string, NodeOffsetDelta>>
  >({});
  const [zoneOffsetsByScenario, setZoneOffsetsByScenario] = useState<
    Record<string, Record<string, NodeOffsetDelta>>
  >({});

  // Visibility toggles for Top Toolbar, Bottom Sub-Node Dock, and Interactive Minimap
  const [topBarHidden, setTopBarHidden] = useState<boolean>(false);
  const [bottomDockHidden, setBottomDockHidden] = useState<boolean>(false);
  const [minimapHidden, setMinimapHidden] = useState<boolean>(false);

  const [autoCameraEnabled, setAutoCameraEnabled] = useState<boolean>(true);
  const [activeSketchNodeId, setActiveSketchNodeId] = useState<string | null>(
    null
  );
  const [selectedInternalSubNodeId, setSelectedInternalSubNodeId] = useState<
    string | null
  >(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
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
  const didDragObjectRef = useRef<boolean>(false);
  const spacePressedRef = useRef<boolean>(false);

  const isCanvasInteracting =
    isPanningCanvas || isDraggingNodes || isBoxSelectHoldActive;

  // Track Spacebar for quick pan anywhere
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        spacePressedRef.current = true;
      } else if (e.key === 'Escape') {
        setMultiSelectedNodeIds([]);
        setMarqueeBox(null);
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
  }, []);

  const {
    zones: scenarioZones,
    backboneLinks: scenarioBackboneLinks,
    nodes: rawSketchNodes,
    flows: rawSketchFlows,
  } = useMemo(
    () =>
      buildWhiteboardSchematic(scenario, activeStageIndex, activeEnvironment),
    [scenario, activeStageIndex, activeEnvironment]
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

  const stageLocationContext = useMemo(
    () =>
      getStageLocationContext(
        scenario,
        sketchNodes,
        sketchFlows,
        activeStageIndex,
        activeEnvironment
      ),
    [scenario, sketchNodes, sketchFlows, activeStageIndex, activeEnvironment]
  );

  const selectedSketchNode: WhiteboardSketchNode | null = useMemo(
    () =>
      sketchNodes.find(
        (n) => n.id === activeSketchNodeId || n.id === selectedNodeId
      ) || null,
    [sketchNodes, activeSketchNodeId, selectedNodeId]
  );

  const companionSketchNode: WhiteboardSketchNode | null = useMemo(() => {
    if (!selectedSketchNode?.companionHostOrProcessNodeId) return null;
    return (
      sketchNodes.find(
        (n) => n.id === selectedSketchNode.companionHostOrProcessNodeId
      ) || null
    );
  }, [selectedSketchNode, sketchNodes]);

  const rawInternalSubBoard = useMemo(() => {
    if (!selectedSketchNode) return null;
    return buildInternalNodeSubBoard(
      scenario,
      selectedSketchNode,
      sketchFlows,
      activeStageIndex
    );
  }, [scenario, selectedSketchNode, sketchFlows, activeStageIndex]);

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

  const hasCustomLayoutOrView =
    manualZoom !== 1 ||
    panOffset.x !== 0 ||
    panOffset.y !== 0 ||
    Object.keys(currentBoardNodeOffsets).length > 0 ||
    Object.keys(currentBoardZoneOffsets).length > 0;

  const handleResetCanvasLayout = useCallback(() => {
    manualZoomRef.current = 1;
    panOffsetRef.current = { x: 0, y: 0 };
    setManualZoom(1);
    setPanOffset({ x: 0, y: 0 });
    canvasControllerRef.current?.resetTransform();
    setMultiSelectedNodeIds([]);
    setMarqueeBox(null);
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
  }, [boardScopeKey]);

  // Mouse Wheel / Trackpad Scroll Zoom Handler synchronized with CanvasController
  useEffect(() => {
    const boardEl = boardContainerRef.current;
    if (!boardEl) return;
    let wheelRafId: number | null = null;

    const onNativeWheel = (e: WheelEvent) => {
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
  // - Left-Click & Hold (`button === 0`) -> Switches to Pan Page ('PAN') mode and pans canvas at 60/120fps without React re-renders
  // - Right-Click & Hold (`button === 2`) -> Switches to Box Select ('SELECT') mode and draws marquee selection box
  const handleBoardPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.button !== 2) return;

      const targetEl = e.target as HTMLElement;
      if (
        targetEl.closest('[data-testid="canvas-interaction-toolbar"]') ||
        targetEl.closest('[data-testid="diagram-legend-panel"]') ||
        targetEl.closest('[data-testid="playback-control-bar"]') ||
        targetEl.closest('[data-testid="show-playback-bar-btn"]') ||
        targetEl.closest('[data-testid="canvas-minimap-overlay"]') ||
        targetEl.closest('[data-testid="canvas-minimap-collapsed"]') ||
        targetEl.closest('[data-testid="show-canvas-top-bar-btn"]') ||
        targetEl.closest('[data-testid="show-bottom-dock-btn"]')
      ) {
        return;
      }

      if (
        e.button === 0 &&
        (targetEl.closest('.canvas-interactive-node') ||
          targetEl.closest('.canvas-interactive-zone') ||
          targetEl.closest('.canvas-interactive-control') ||
          targetEl.closest('button'))
      ) {
        return;
      }

      if (e.button === 2) {
        e.preventDefault();
      }

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
      });

      const useMarqueeMode = holdResolution.useMarqueeSelection;
      let hasMoved = false;
      let holdActivated = false;
      let panRafId: number | null = null;
      let marqueeRafId: number | null = null;
      let latestMarquee: MarqueeBoxCoords | null = null;

      const activateHoldMode = () => {
        if (holdActivated) return;
        holdActivated = true;
        setInteractionMode(holdResolution.mode);
        if (useMarqueeMode) {
          setIsBoxSelectHoldActive(true);
          setIsPanningCanvas(false);
          setMarqueeBox((prev) =>
            prev ?? {
              startWx: startWb.wx,
              startWy: startWb.wy,
              currentWx: startWb.wx,
              currentWy: startWb.wy,
            }
          );
        } else {
          setIsPanningCanvas(true);
          setIsBoxSelectHoldActive(false);
        }
      };

      // Trigger mode switch when mouse button is held down
      const holdTimer = window.setTimeout(activateHoldMode, 110);

      const applyPanFrame = () => {
        panRafId = null;
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
        if (!latestMarquee) return;
        setMarqueeBox(latestMarquee);
        if (hasMoved) {
          const hitIds = computeMarqueeSelectedNodeIds(
            activeNodes,
            latestMarquee
          );
          setMultiSelectedNodeIds(hitIds);
        }
      };

      const handleWindowPointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startClientX;
        const dy = moveEvent.clientY - startClientY;
        const dist = Math.hypot(dx, dy);

        if (!hasMoved && dist >= 2) {
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
        } else if (useMarqueeMode && (hasMoved || holdActivated)) {
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
      };

      const handleWindowPointerUp = () => {
        window.clearTimeout(holdTimer);
        if (panRafId !== null) {
          window.cancelAnimationFrame(panRafId);
          applyPanFrame();
        }
        if (marqueeRafId !== null) {
          window.cancelAnimationFrame(marqueeRafId);
          applyMarqueeFrame();
        }
        window.removeEventListener('pointermove', handleWindowPointerMove);
        window.removeEventListener('pointerup', handleWindowPointerUp);
        window.removeEventListener('pointercancel', handleWindowPointerUp);

        if (!useMarqueeMode && hasMoved) {
          setPanOffset({ ...panOffsetRef.current });
        }
        setIsPanningCanvas(false);
        setIsBoxSelectHoldActive(false);
        setMarqueeBox(null);

        if (
          e.button === 0 &&
          !hasMoved &&
          !e.shiftKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          setMultiSelectedNodeIds([]);
        }
      };

      window.addEventListener('pointermove', handleWindowPointerMove);
      window.addEventListener('pointerup', handleWindowPointerUp);
      window.addEventListener('pointercancel', handleWindowPointerUp);
    },
    [activeNodes]
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

      const handleWindowPointerMove = (moveEvent: PointerEvent) => {
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
      };

      const handleWindowPointerUp = () => {
        if (dragRafId !== null) {
          window.cancelAnimationFrame(dragRafId);
          flushNodeDragDelta();
        }
        window.removeEventListener('pointermove', handleWindowPointerMove);
        window.removeEventListener('pointerup', handleWindowPointerUp);
        setIsDraggingNodes(false);
      };

      window.addEventListener('pointermove', handleWindowPointerMove);
      window.addEventListener('pointerup', handleWindowPointerUp);
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

      const handleWindowPointerMove = (moveEvent: PointerEvent) => {
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
      };

      const handleWindowPointerUp = () => {
        if (zoneDragRafId !== null) {
          window.cancelAnimationFrame(zoneDragRafId);
          flushZoneDragDelta();
        }
        window.removeEventListener('pointermove', handleWindowPointerMove);
        window.removeEventListener('pointerup', handleWindowPointerUp);
        setIsDraggingNodes(false);
        setDraggingZoneTitle(null);
      };

      window.addEventListener('pointermove', handleWindowPointerMove);
      window.addEventListener('pointerup', handleWindowPointerUp);
    },
    [activeNodes, activeZones, boardScopeKey]
  );

  const handleNodeClick = useCallback(
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
    [onSelectNode]
  );

  const handleBackToMainTopology = () => {
    const returningNode = selectedSketchNode;
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
    }
    setActiveSketchNodeId(null);
    onSelectNode(null);
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
        const relatedFlow = internalSubBoard.subFlows.find(
          (f) => f.fromNodeId === clickedNode.id || f.toNodeId === clickedNode.id
        );
        if (relatedFlow) {
          onSelectTelemetry(relatedFlow.telemetryEvent);
        }
      } else {
        handleNodeClick(clickedNode);
      }
    },
    [
      handleNodeClick,
      internalSubBoard,
      onSelectTelemetry,
      toggleNodeInMultiSelection,
    ]
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
        setMarqueeBox(null);
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
      if (commandId === 'TOGGLE_LEGEND') {
        onToggleLegend?.();
        return;
      }
      if (commandId === 'TOGGLE_MINIMAP') {
        setMinimapHidden((v) => !v);
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
      handleDirectionalPanNudge,
      handleResetCanvasLayout,
      handleSelectAllNodes,
      handleZoomByStep,
      onCloseShortcutsModal,
      onOpenShortcutsModal,
      onStartWalkthrough,
      onStepBackward,
      onStepForward,
      onToggleLegend,
      onTogglePlay,
      onToggleTacticalMode,
      shortcutsModalOpen,
    ]
  );

  // Global Keyboard Shortcut Listener for Tool Switching (B / P) & Canvas Navigation
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
        command === 'PAN_UP' ||
        command === 'PAN_DOWN' ||
        command === 'PAN_LEFT' ||
        command === 'PAN_RIGHT' ||
        command === 'TOGGLE_AUTOCAM' ||
        command === 'TOGGLE_MINIMAP'
      ) {
        e.preventDefault();
        executeShortcutCommand(command);
      }
    };

    window.addEventListener('keydown', onWindowKeyDown);
    return () => window.removeEventListener('keydown', onWindowKeyDown);
  }, [executeShortcutCommand]);

  const boardMotionKey =
    internalSubBoard && selectedSketchNode
      ? `expanded-subboard-${selectedSketchNode.id}-${activeEnvironment}`
      : `main-topology-${scenario.id}-${activeEnvironment}`;

  const hoveredNode = useMemo(
    () =>
      !isDraggingNodes && !marqueeBox
        ? activeNodes.find((n) => n.id === hoveredNodeId) || null
        : null,
    [activeNodes, hoveredNodeId, isDraggingNodes, marqueeBox]
  );

  const envBadgeColorClass =
    activeEnvironment === 'SERVER'
      ? 'bg-violet-50 dark:bg-violet-950/75 text-violet-800 dark:text-violet-200 border-violet-300 dark:border-violet-800'
      : activeEnvironment === 'CLOUD'
      ? 'bg-emerald-50 dark:bg-emerald-950/75 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
      : 'bg-sky-50 dark:bg-sky-950/75 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-800';

  const envIconNode =
    activeEnvironment === 'SERVER' ? (
      <Server className="w-3 h-3 shrink-0" />
    ) : activeEnvironment === 'CLOUD' ? (
      <Cloud className="w-3 h-3 shrink-0" />
    ) : (
      <Laptop className="w-3 h-3 shrink-0" />
    );

  // Interactive Mode & Multi-Select Controls Strip (rendered in top bar of canvas, zero truncation)
  const interactionToolbarNode = (
    <div
      data-testid="canvas-interaction-toolbar"
      onClick={(e) => e.stopPropagation()}
      className="flex flex-wrap items-center gap-1.5 shrink-0"
    >
      {/* Multi-Selected Nodes Count Pill (Concise Label + Rich Tooltip) */}
      {multiSelectedNodeIds.length > 0 && (
        <WorkbenchIconTooltip
          label={`${multiSelectedNodeIds.length} Nodes Selected`}
          badge="GROUP DRAG"
          detail="Drag any selected node to reposition the group together"
          side="bottom"
        >
          <span
            data-testid="multi-selection-count-badge"
            data-selected-count={multiSelectedNodeIds.length}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono text-[10px] font-bold shadow-2xs whitespace-nowrap cursor-default"
          >
            <Move className="w-3 h-3 shrink-0" />
            <span>{multiSelectedNodeIds.length} Selected</span>
          </span>
        </WorkbenchIconTooltip>
      )}

      {/* Segmented Tool Switcher: Box Select (B) vs Pan Page (P) */}
      <div
        role="group"
        aria-label="Canvas Pointer Interaction Mode"
        className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700"
      >
        <WorkbenchIconTooltip
          label="Box Select Tool"
          badge="B"
          detail="Rubber-band marquee selection (or Right-Click + Hold)"
          side="bottom"
        >
          <button
            type="button"
            data-testid="canvas-mode-select-btn"
            aria-pressed={interactionMode === 'SELECT'}
            onClick={() => setInteractionMode('SELECT')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              interactionMode === 'SELECT'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MousePointer className="w-3 h-3 shrink-0" />
            <span>Box Select</span>
            <kbd className="hidden sm:inline-block px-1 py-0.1 rounded bg-black/15 dark:bg-white/15 text-[8.5px] font-mono">
              B
            </kbd>
          </button>
        </WorkbenchIconTooltip>

        <WorkbenchIconTooltip
          label="Pan / Pen Page Tool"
          badge="P"
          detail="Smooth 60/120fps canvas pan (or Left-Click + Hold)"
          side="bottom"
        >
          <button
            type="button"
            data-testid="canvas-mode-pan-btn"
            aria-pressed={interactionMode === 'PAN'}
            onClick={() => setInteractionMode('PAN')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              interactionMode === 'PAN'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Hand className="w-3 h-3 shrink-0" />
            <span>Pan Page</span>
            <kbd className="hidden sm:inline-block px-1 py-0.1 rounded bg-black/15 dark:bg-white/15 text-[8.5px] font-mono">
              P
            </kbd>
          </button>
        </WorkbenchIconTooltip>
      </div>

      {/* Select All / Deselect All Objects Button */}
      <WorkbenchIconTooltip
        label={
          multiSelectedNodeIds.length === activeNodes.length
            ? 'Deselect All Nodes'
            : 'Select All Nodes'
        }
        badge="CTRL+A"
        detail="Select all hosts & appliances to move together"
        side="bottom"
      >
        <button
          type="button"
          data-testid="canvas-select-all-btn"
          onClick={handleSelectAllNodes}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            multiSelectedNodeIds.length === activeNodes.length &&
            activeNodes.length > 0
              ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-400 dark:border-indigo-700'
              : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700 hover:bg-zinc-100'
          }`}
        >
          <CheckSquare className="w-3 h-3 shrink-0" />
          <span className="hidden 2xl:inline">
            {multiSelectedNodeIds.length === activeNodes.length
              ? 'Deselect All'
              : 'Select All'}
          </span>
        </button>
      </WorkbenchIconTooltip>

      {/* Keyboard Shortcuts Overlay Trigger Button */}
      {onOpenShortcutsModal && (
        <WorkbenchIconTooltip
          label="Keyboard Shortcuts"
          badge="?"
          detail="Hotkeys for Tools (B/P) & Canvas Navigation"
          side="bottom"
          align="right"
        >
          <button
            type="button"
            data-testid="canvas-shortcuts-btn"
            aria-label="Open Keyboard Shortcuts Overlay"
            onClick={onOpenShortcutsModal}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700 text-[10px] font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Keyboard className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="hidden 2xl:inline">Hotkeys</span>
          </button>
        </WorkbenchIconTooltip>
      )}

      {/* Reset Layout / Positions / Pan & Zoom Button */}
      {hasCustomLayoutOrView && (
        <WorkbenchIconTooltip
          label="Reset Canvas Layout"
          badge="0 / R"
          detail="Restore default node/zone positions, 100% zoom, and (0,0) pan"
          side="bottom"
          align="right"
        >
          <button
            type="button"
            data-testid="canvas-reset-layout-btn"
            onClick={handleResetCanvasLayout}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/70 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-2.5 h-2.5 shrink-0" />
            <span>Reset</span>
          </button>
        </WorkbenchIconTooltip>
      )}

      {/* Hide Top Canvas Bar Button */}
      <WorkbenchIconTooltip
        label="Hide Top Toolbar"
        badge="HIDE"
        detail="Collapse top canvas bar to maximize diagram space"
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
  );

  return (
    <div
      className="relative flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden select-none p-2.5 gap-2"
      data-testid="attack-visualizer"
      data-active-environment={activeEnvironment}
      data-tactical-mode={tacticalMode ? 'true' : 'false'}
      data-interaction-mode={interactionMode}
      onContextMenu={(e) => e.preventDefault()}
      dir="ltr"
    >
      {/* Persistent Environment & Expandable Zone Sub-View Context Bar (Collapsible via topBarHidden) */}
      <AnimatePresence mode="wait" initial={false}>
        {!topBarHidden &&
          (internalSubBoard && selectedSketchNode ? (
            <motion.div
              key={`subboard-header-${selectedSketchNode.id}`}
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
                    badge={`NODE #${selectedSketchNode.chainOrder}`}
                    detail={internalSubBoard.environmentBreadcrumb}
                    side="bottom"
                    align="left"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10.5px] font-semibold cursor-default whitespace-nowrap">
                      <Maximize2 className="w-3 h-3 shrink-0" />
                      <span>
                        Node #{selectedSketchNode.chainOrder} ·{' '}
                        {selectedSketchNode.label}
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
                        onClick={() => handleNodeClick(companionSketchNode)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                          internalSubBoard.currentScopeType ===
                          'MALWARE_ON_HOST'
                            ? 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/70 dark:hover:bg-sky-900/80 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                            : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                        }`}
                      >
                        <ArrowRightLeft className="w-3 h-3 shrink-0" />
                        <span>
                          {internalSubBoard.currentScopeType ===
                          'MALWARE_ON_HOST'
                            ? `Host: ${companionSketchNode.label}`
                            : `Process: ${companionSketchNode.label}`}
                        </span>
                      </button>
                    </WorkbenchIconTooltip>
                  )}
                </div>

                {interactionToolbarNode}
              </div>

              <div
                data-testid="expanded-node-environment-breadcrumb"
                className={`w-full px-2.5 py-1 rounded-lg text-[11px] font-medium border leading-snug break-words ${
                  internalSubBoard.currentScopeType === 'MALWARE_ON_HOST'
                    ? 'bg-rose-50/80 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border-rose-200/80 dark:border-rose-800/70'
                    : internalSubBoard.currentScopeType ===
                      'HOST_OS_ENVIRONMENT'
                    ? 'bg-sky-50/80 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 border-sky-200/80 dark:border-sky-800/70'
                    : 'bg-zinc-50 dark:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-700'
                }`}
              >
                {internalSubBoard.environmentBreadcrumb}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`main-context-bar-${scenario.id}-${activeStageIndex}-${activeEnvironment}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="current-environment-context-bar"
              className="relative z-30 shrink-0 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-2xs flex flex-wrap items-center justify-between gap-2"
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <OperationalGuideIcon tacticalMode={tacticalMode} size="sm" />

                <WorkbenchIconTooltip
                  label={envProfile.badgeLabel}
                  badge={envProfile.environmentTag}
                  detail={`${envProfile.primaryHostname} · ${envProfile.osSummary} (${envProfile.subnetBadge})`}
                  side="bottom"
                  align="left"
                >
                  <span
                    data-testid="canvas-active-environment-pill"
                    data-environment-id={activeEnvironment}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border font-mono text-[10px] font-bold whitespace-nowrap cursor-default ${envBadgeColorClass}`}
                  >
                    {envIconNode}
                    <span>{envProfile.badgeLabel}</span>
                    <span className="hidden xl:inline opacity-75">
                      · {envProfile.environmentTag}
                    </span>
                  </span>
                </WorkbenchIconTooltip>

                <WorkbenchIconTooltip
                  label={
                    activeStageIndex > 0
                      ? `Stage #${activeStageIndex} Focus`
                      : `Full Topology (${scenario.stages.length} Steps)`
                  }
                  badge={scenario.code}
                  detail={stageLocationContext.whereWeAreSummary}
                  side="bottom"
                >
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold whitespace-nowrap cursor-default">
                    {activeStageIndex > 0
                      ? `STAGE #${activeStageIndex} FOCUS`
                      : `TOPOLOGY (${scenario.stages.length} STEPS)`}
                  </span>
                </WorkbenchIconTooltip>
              </div>

              {interactionToolbarNode}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Maximum-Height Center Diagram Canvas with CanvasController (react-zoom-pan-pinch), Scrollbars, Mouse Pan, Shift+Click Multi-Selection & Zone/Node Dragging */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden rounded-2xl">
        <div
          ref={boardContainerRef}
          onPointerDown={handleBoardPointerDown}
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
          className={`excalidraw-board-bg relative w-full h-full rounded-2xl border overflow-hidden touch-none transition-colors duration-300 ${
            isPanningCanvas
              ? 'cursor-grabbing'
              : interactionMode === 'PAN'
              ? 'cursor-grab'
              : 'cursor-crosshair'
          } ${
            tacticalMode
              ? 'bg-[#050B14] border-emerald-500/60 shadow-[inset_0_0_55px_rgba(16,185,129,0.14)]'
              : 'bg-[#FDFBF7] dark:bg-[#0D111A] border-zinc-200/90 dark:border-zinc-800 shadow-2xs'
          }`}
        >
          {/* Floating Top-Right "Show Toolbar" Pill when Top Bar is Hidden */}
          {topBarHidden && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 right-3 z-30 flex items-center gap-1.5"
            >
              {internalSubBoard && (
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
              )}
              <WorkbenchIconTooltip
                label="Show Canvas Top Bar"
                detail="Restore the environment context bar and canvas interaction tools"
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
                  <span>Show Toolbar</span>
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

          {/* Panning, Box Selecting, or Zone Moving Active Indicator Pill */}
          <AnimatePresence>
            {(isPanningCanvas || isBoxSelectHoldActive || draggingZoneTitle) && (
              <motion.div
                key="panning-active-hud"
                data-testid="canvas-panning-hud"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-40 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-mono font-bold shadow-lg flex items-center gap-1.5 max-w-[90%]"
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
                    <span className="whitespace-nowrap">
                      Box Select ({multiSelectedNodeIds.length} selected)
                    </span>
                  </>
                ) : (
                  <>
                    <Hand className="w-3.5 h-3.5 shrink-0" />
                    <span ref={panHudTextRef} className="whitespace-nowrap">
                      Panning Canvas ({panOffset.x}px, {panOffset.y}px)
                    </span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

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
                  <span
                    title={
                      director.phase === 'INTRO_SURVEY'
                        ? 'SCENARIO BRIEFING · FULL TOPOLOGY SURVEY'
                        : 'CAMERA LOCKING ON ATTACK ORIGIN'
                    }
                    className="inline-flex items-center gap-1.5 font-bold min-w-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="leading-snug break-words">
                      {director.phase === 'INTRO_SURVEY'
                        ? 'SCENARIO BRIEFING · FULL TOPOLOGY SURVEY'
                        : 'CAMERA LOCKING ON ATTACK ORIGIN'}
                    </span>
                  </span>
                  <span
                    title={scenario.code}
                    className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0"
                  >
                    {scenario.code}
                  </span>
                </div>
                <div
                  title={scenario.name}
                  className="mt-1 text-xs sm:text-sm font-bold text-white leading-snug break-words"
                >
                  {scenario.name}
                </div>
                <div
                  title={scenario.overview}
                  className="mt-0.5 text-[11px] text-slate-300 leading-snug break-words"
                >
                  {scenario.overview}
                </div>
                {director.originNode && director.finalNode && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 min-w-0 text-[10px] font-mono text-amber-300">
                    <span
                      title={`START: ${director.originNode.label}`}
                      className="min-w-0 leading-snug"
                    >
                      START: {director.originNode.label}
                    </span>
                    <span className="text-rose-400 shrink-0">
                      ── {scenario.stages.length} STAGES ──▶
                    </span>
                    <span
                      title={`END: ${director.finalNode.label}`}
                      className="text-emerald-400 min-w-0 leading-snug"
                    >
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

          {/* 4. Animated Board Switcher Wrapped in CanvasController (react-zoom-pan-pinch) */}
          <CanvasController
            ref={canvasControllerRef}
            panningEnabled={interactionMode === 'PAN' && !isBoxSelectHoldActive}
            wheelZoomEnabled={true}
            onTransformChange={({ scale, positionX, positionY }) => {
              setManualZoom(scale);
              setPanOffset({ x: positionX, y: positionY });
            }}
            onPanningStart={() => setIsPanningCanvas(true)}
            onPanningStop={(offset) => {
              setIsPanningCanvas(false);
              setPanOffset(offset);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={boardMotionKey}
                style={{
                  transformOrigin: `${portalOrigin.xPct}% ${portalOrigin.yPct}%`,
                }}
                initial={
                  portalAnim
                    ? internalSubBoard
                      ? { opacity: 0, scale: 0.74, filter: 'blur(6px)' }
                      : { opacity: 0, scale: 1.32, filter: 'blur(5px)' }
                    : { opacity: 0.92, scale: 0.995, filter: 'blur(0px)' }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                exit={
                  portalAnim
                    ? internalSubBoard
                      ? { opacity: 0, scale: 0.7, filter: 'blur(5px)' }
                      : { opacity: 0, scale: 1.42, filter: 'blur(6px)' }
                    : { opacity: 0.85, scale: 0.99, filter: 'blur(0px)' }
                }
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 26,
                  mass: 0.8,
                }}
                className="relative w-full h-full overflow-visible z-20"
              >
                {/* Mobile (< 640px) */}
                <div className="sm:hidden w-full h-full">
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
                        handleNodeClick(node);
                      }
                    }}
                    selectedTelemetryId={selectedTelemetryId}
                    onSelectTelemetry={onSelectTelemetry}
                  />
                </div>

                {/* Tablet & Desktop (>= 640px): Animated Cinematic Camera Rig */}
                <motion.div
                  ref={cameraRigRef}
                  data-testid="cinematic-camera-rig"
                  data-camera-frame={director.camera.frameCode}
                  data-camera-scale={effectiveScale}
                  animate={{
                    x: `${effectiveTxPct}%`,
                    y: `${effectiveTyPct}%`,
                    scale: autoCameraEnabled ? director.camera.scale : 1,
                  }}
                  transition={
                    isPanningCanvas
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
                  }}
                  className="hidden sm:block relative w-full h-full overflow-visible"
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
                              handleNodeClick(targetNode);
                            }
                          }
                        : undefined
                    }
                    activeEnvironment={activeEnvironment}
                    tacticalMode={tacticalMode}
                    isInteracting={isCanvasInteracting}
                  />

                  {/* Windows-Style Marquee Rubber-Band Selection Box */}
                  {marqueeBox && (
                    <div
                      data-testid="windows-marquee-selection-box"
                      style={{
                        left: `${
                          (Math.min(marqueeBox.startWx, marqueeBox.currentWx) /
                            WHITEBOARD_WIDTH) *
                          100
                        }%`,
                        top: `${
                          (Math.min(marqueeBox.startWy, marqueeBox.currentWy) /
                            WHITEBOARD_HEIGHT) *
                          100
                        }%`,
                        width: `${
                          (Math.abs(marqueeBox.currentWx - marqueeBox.startWx) /
                            WHITEBOARD_WIDTH) *
                          100
                        }%`,
                        height: `${
                          (Math.abs(marqueeBox.currentWy - marqueeBox.startWy) /
                            WHITEBOARD_HEIGHT) *
                          100
                        }%`,
                      }}
                      className="pointer-events-none absolute z-40 rounded-md bg-indigo-500/18 border-2 border-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.35)]"
                    />
                  )}

                  {/* Hover-Based Technical Summary Tooltip for Network Nodes */}
                  <AnimatePresence>
                    {hoveredNode && (
                      <NodeHoverTooltip
                        key={`hover-tooltip-${hoveredNode.id}`}
                        node={hoveredNode}
                        isSubBoard={Boolean(internalSubBoard)}
                      />
                    )}
                  </AnimatePresence>

                  {/* Floating Speech-Bubble Callout */}
                  <AnimatePresence mode="wait">
                    {director.activeCallout && (
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
                          <span
                            title={director.activeCallout.stepBadge}
                            className="inline-flex items-center gap-1 font-bold text-amber-300 min-w-0"
                          >
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                            <span className="leading-snug break-words">
                              {director.activeCallout.stepBadge}
                            </span>
                          </span>
                        </div>
                        <div
                          title={director.activeCallout.headline}
                          className="mt-0.5 text-[11px] font-extrabold text-white leading-snug break-words"
                        >
                          {director.activeCallout.headline}
                        </div>
                        <div
                          title={director.activeCallout.detail}
                          className="mt-0.5 text-[10px] text-slate-300 leading-snug break-words"
                        >
                          {director.activeCallout.detail}
                        </div>
                        <div className="mt-1.5 pt-1 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1 min-w-0 text-[9px] font-mono">
                          <span
                            title={director.activeCallout.forwardTag}
                            className="text-rose-400 font-bold leading-snug break-words"
                          >
                            {director.activeCallout.forwardTag}
                          </span>
                          <span
                            title={director.activeCallout.returnTag}
                            className="text-emerald-400 font-bold leading-snug break-words"
                          >
                            {director.activeCallout.returnTag}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Draggable & Multi-Selectable Schematic Nodes (framer-motion useDragControls + Shift+Click Group Selection) */}
                  {activeNodes.map((node, nIdx) => {
                    const isSelected = internalSubBoard
                      ? activeInternalSubNode?.id === node.id
                      : selectedSketchNode?.id === node.id;
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
                        activeStageIndex={activeStageIndex}
                        directorPhase={director.phase}
                        cState={cState}
                        tacticalMode={tacticalMode}
                        onStartNodeGroupDrag={handleNodePointerDown}
                        onToggleMultiSelect={toggleNodeInMultiSelection}
                        onHoverChange={setHoveredNodeId}
                        onNodeClick={handleDiagramNodeClick}
                      />
                    );
                  })}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </CanvasController>

          {/* Bottom-Center Floating "Show Details" Pill when Inside SubBoard and Bottom Dock is Hidden */}
          {internalSubBoard && activeInternalSubNode && bottomDockHidden && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30"
            >
              <WorkbenchIconTooltip
                label="Show Internal Node Details Bar"
                detail={`Restore the bottom inspection bar for ${activeInternalSubNode.label}`}
                placement="top"
              >
                <button
                  type="button"
                  data-testid="show-bottom-dock-btn"
                  onClick={() => setBottomDockHidden(false)}
                  aria-label="Show Internal Node Details Bar"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/95 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200/90 dark:border-zinc-700 text-[11px] font-mono font-semibold shadow-md backdrop-blur-md transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Show Details</span>
                </button>
              </WorkbenchIconTooltip>
            </div>
          )}

          {/* Bottom-Left: Persistent Visual Semantics Legend Panel + Camera Status (Pinned in Viewport) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:flex flex-col items-start gap-2 absolute bottom-4 left-4 z-30"
          >
            {showLegend && (
              <DiagramLegendPanel
                tacticalMode={tacticalMode}
                defaultExpanded={false}
              />
            )}

            {(activeStageIndex > 0 || director.phase !== 'OVERVIEW') && (
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
            )}
          </div>

          {/* Bottom-Right: Interactive Minimap Overlay + Play/Pause Sequence Control Bar (Pinned in Viewport) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-end gap-2 absolute bottom-4 right-4 z-30"
          >
            <div className="hidden sm:block">
              <CanvasMinimapOverlay
                zones={activeZones}
                backboneLinks={activeBackboneLinks}
                nodes={activeNodes}
                flows={activeFlows}
                selectedNodeId={
                  internalSubBoard
                    ? activeInternalSubNode?.id || null
                    : selectedSketchNode?.id || null
                }
                multiSelectedNodeIds={multiSelectedNodeIds}
                panOffset={panOffset}
                effectiveScale={effectiveScale}
                tacticalMode={tacticalMode}
                isHidden={minimapHidden}
                onToggleHidden={() => setMinimapHidden((v) => !v)}
                onResetView={handleResetCanvasLayout}
                onPanToOffset={(nextPan) => {
                  panOffsetRef.current = nextPan;
                  canvasControllerRef.current?.setTransform(
                    nextPan.x,
                    nextPan.y,
                    manualZoomRef.current,
                    60
                  );
                  setPanOffset(nextPan);
                }}
              />
            </div>

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
            />
          </div>
        </div>
      </div>

      {/* Bottom Dock when expanded inside a node (with Hide toggle & zero-truncation pills) */}
      <AnimatePresence initial={false}>
        {internalSubBoard && activeInternalSubNode && !bottomDockHidden && (
          <motion.div
            key={`subboard-dock-${selectedSketchNode?.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="internal-subnode-inspector-bar"
            className="relative z-20 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-2xs flex flex-col gap-1.5 shrink-0 min-w-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 min-w-0 text-xs text-zinc-500 dark:text-zinc-400">
                <WorkbenchIconTooltip
                  label={activeInternalSubNode.actionBadge}
                  detail={`Internal Stage Role · ${activeInternalSubNode.label}`}
                  placement="top"
                >
                  <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                    {activeInternalSubNode.actionBadge.split('·')[0]?.trim() ||
                      activeInternalSubNode.actionBadge}
                  </span>
                </WorkbenchIconTooltip>
                <span aria-hidden="true">·</span>
                <WorkbenchIconTooltip
                  label={activeInternalSubNode.label}
                  detail={activeInternalSubNode.sublabel}
                  placement="top"
                >
                  <span className="font-semibold text-zinc-900 dark:text-white whitespace-nowrap">
                    {activeInternalSubNode.label}
                  </span>
                </WorkbenchIconTooltip>
                <span aria-hidden="true">·</span>
                <WorkbenchIconTooltip
                  label="Service Endpoint & Process Context"
                  detail={activeInternalSubNode.sublabel}
                  placement="top"
                >
                  <span className="font-mono text-[11px] whitespace-nowrap">
                    {activeInternalSubNode.sublabel.split('·')[0]?.trim() ||
                      activeInternalSubNode.sublabel}
                  </span>
                </WorkbenchIconTooltip>
                {activeInternalSubNode.hostContext && (
                  <WorkbenchIconTooltip
                    label="Parent Host System"
                    detail={activeInternalSubNode.hostContext}
                    placement="top"
                  >
                    <span
                      data-testid="internal-dock-host-context"
                      className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10.5px] font-medium border border-indigo-200/80 dark:border-indigo-800/70 whitespace-nowrap"
                    >
                      {activeInternalSubNode.hostContext}
                    </span>
                  </WorkbenchIconTooltip>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <div
                  className="flex flex-wrap items-center gap-1 min-w-0"
                  role="group"
                  aria-label="Internal Communication Links"
                >
                  {internalSubBoard.subFlows.map((fl) => {
                    const isFlowSelected = selectedTelemetryId === fl.id;
                    const conciseFlowPill = formatConciseInternalFlowPill(fl);
                    return (
                      <WorkbenchIconTooltip
                        key={fl.id}
                        label={conciseFlowPill.tooltipTitle}
                        detail={conciseFlowPill.tooltipDetail}
                        placement="top"
                      >
                        <button
                          type="button"
                          data-testid={`internal-link-pill-${fl.stepNo}`}
                          onClick={() => {
                            setSelectedInternalSubNodeId(fl.toNodeId);
                            onSelectTelemetry(fl.telemetryEvent);
                          }}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-mono border transition-colors cursor-pointer whitespace-nowrap ${
                            isFlowSelected
                              ? 'bg-rose-600 text-white border-rose-600 font-semibold'
                              : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <span className="font-bold shrink-0">
                            {conciseFlowPill.codeBadge}
                          </span>
                          <span>{conciseFlowPill.shortRoute}</span>
                        </button>
                      </WorkbenchIconTooltip>
                    );
                  })}
                </div>

                {/* Hide Bottom Dock Button so user can maximize diagram space */}
                <WorkbenchIconTooltip
                  label="Hide Bottom Details Bar"
                  detail="Collapse this bottom bar to maximize vertical diagram space"
                  placement="top"
                >
                  <button
                    type="button"
                    data-testid="hide-bottom-dock-btn"
                    onClick={() => setBottomDockHidden(true)}
                    aria-label="Hide Bottom Details Bar"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200/80 dark:border-zinc-700 transition-colors cursor-pointer shrink-0"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>Hide</span>
                  </button>
                </WorkbenchIconTooltip>
              </div>
            </div>

            <p
              title={activeInternalSubNode.internalSummary}
              className="w-full text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed break-words"
            >
              {activeInternalSubNode.internalSummary}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Keyboard Shortcuts & Canvas Navigation Overlay */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => onCloseShortcutsModal?.()}
        activeToolMode={interactionMode}
        effectiveScale={effectiveScale}
        autoCameraEnabled={autoCameraEnabled}
        tacticalMode={tacticalMode}
        showLegend={showLegend}
        isPlaying={isPlaying}
        onExecuteCommand={executeShortcutCommand}
      />
    </div>
  );
}
