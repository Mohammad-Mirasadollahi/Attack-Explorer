'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AttackScenario,
  TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  ComputedStageView,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile } from '@/lib/simulation-engine';
import {
  buildInternalNodeSubBoard,
  buildWhiteboardSchematic,
  getStageLocationContext,
  WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import {
  CinematicPhase,
  computeCinematicDirectorState } from '@/lib/cinematic-camera-director';
import { SketchNodeIcon } from './SketchNodeIcons';
import { SketchWhiteboardSvg } from './canvas/SketchWhiteboardSvg';
import { ResponsiveMobileZonesView } from './canvas/ResponsiveMobileZonesView';
import { TacticalGridOverlay } from './canvas/TacticalGridOverlay';
import { NodeHoverTooltip } from './NodeHoverTooltip';
import { DiagramLegendPanel } from './DiagramLegendPanel';
import { PlaybackControlBar } from './PlaybackControlBar';
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  Cloud,
  Laptop,
  Maximize2,
  Minimize2,
  RotateCcw,
  Server,
  Sparkles } from 'lucide-react';

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
}

interface PortalAnimationState {
  mode: 'EXPAND' | 'COLLAPSE';
  xPct: number;
  yPct: number;
  nodeLabel: string;
  seqKey: number;
}

export function AttackVisualizer({
  scenario,
  stageView,
  selectedTelemetryId,
  onSelectTelemetry,
  selectedNodeId,
  onSelectNode,
  onSelectStage,
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
  showLegend = true,
}: AttackVisualizerProps) {
  const { currentStage } = stageView;
  const activeStageIndex = currentStage ? currentStage.index : 0;
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);
  const [manualZoom, setManualZoom] = useState<number>(1);
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

  const {
    zones: scenarioZones,
    backboneLinks: scenarioBackboneLinks,
    nodes: sketchNodes,
    flows: sketchFlows } = useMemo(
    () =>
      buildWhiteboardSchematic(scenario, activeStageIndex, activeEnvironment),
    [scenario, activeStageIndex, activeEnvironment]
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

  const internalSubBoard = useMemo(() => {
    if (!selectedSketchNode) return null;
    return buildInternalNodeSubBoard(
      scenario,
      selectedSketchNode,
      sketchFlows,
      activeStageIndex
    );
  }, [scenario, selectedSketchNode, sketchFlows, activeStageIndex]);

  const activeInternalSubNode = useMemo(() => {
    if (!internalSubBoard) return null;
    return (
      internalSubBoard.subNodes.find(
        (sn) => sn.id === selectedInternalSubNodeId
      ) || internalSubBoard.subNodes[0]
    );
  }, [internalSubBoard, selectedInternalSubNodeId]);

  const activeZones = internalSubBoard ? internalSubBoard.zones : scenarioZones;
  const activeBackboneLinks = internalSubBoard
    ? internalSubBoard.backboneLinks
    : scenarioBackboneLinks;
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
    (director.camera.scale * manualZoom).toFixed(2)
  );
  const effectiveTxPct = autoCameraEnabled ? director.camera.txPct : 0;
  const effectiveTyPct = autoCameraEnabled ? director.camera.tyPct : 0;

  const handleNodeClick = (node: WhiteboardSketchNode) => {
    const xPct = Math.round(((node.wx / 1480) * 100) * 10) / 10;
    const yPct = Math.round(((node.wy / 650) * 100) * 10) / 10;
    setPortalOrigin({ xPct, yPct });
    setPortalAnim({
      mode: 'EXPAND',
      xPct,
      yPct,
      nodeLabel: node.label,
      seqKey: Date.now() });
    setLastReturnedNodeId(null);
    setActiveSketchNodeId(node.id);
    onSelectNode(node.id);
    setSelectedInternalSubNodeId(null);
  };

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
      seqKey: Date.now() });
    if (returningNode) {
      setLastReturnedNodeId(returningNode.id);
    }
    setActiveSketchNodeId(null);
    onSelectNode(null);
    setSelectedInternalSubNodeId(null);
  };

  const boardMotionKey =
    internalSubBoard && selectedSketchNode
      ? `expanded-subboard-${selectedSketchNode.id}-${activeEnvironment}`
      : `main-topology-${scenario.id}-${activeEnvironment}`;

  const hoveredNode = useMemo(
    () => activeNodes.find((n) => n.id === hoveredNodeId) || null,
    [activeNodes, hoveredNodeId]
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

  return (
    <div
      className="relative flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden select-none p-2.5 gap-2"
      data-testid="attack-visualizer"
      data-active-environment={activeEnvironment}
      data-tactical-mode={tacticalMode ? 'true' : 'false'}
      dir="ltr"
    >
      {/* Persistent Environment & Expandable Zone Sub-View Context Bar */}
      <AnimatePresence mode="wait" initial={false}>
        {internalSubBoard && selectedSketchNode ? (
          <motion.div
            key={`subboard-header-${selectedSketchNode.id}`}
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="expanded-node-subboard-header"
            className="relative z-30 shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-2xs flex flex-col gap-1 overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
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

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-semibold shrink-0">
                  <Maximize2 className="w-3 h-3" />
                  <span>EXPANDED ZONE · NODE #{selectedSketchNode.chainOrder}</span>
                </span>

                <span className="font-semibold text-xs text-zinc-900 dark:text-white truncate">
                  {internalSubBoard.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {companionSketchNode && (
                  <button
                    type="button"
                    data-testid="switch-companion-host-process-btn"
                    onClick={() => handleNodeClick(companionSketchNode)}
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
                )}

                <span
                  data-testid="expanded-sequence-lineage-badge"
                  className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-mono text-[10px] font-medium truncate max-w-[280px]"
                >
                  {internalSubBoard.sequenceLineage.lineageBadgeText}
                </span>
              </div>
            </div>

            <div
              data-testid="expanded-node-environment-breadcrumb"
              className={`w-full px-2.5 py-1 rounded-lg text-[11px] font-medium border truncate ${
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
              <span
                data-testid="canvas-active-environment-pill"
                data-environment-id={activeEnvironment}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold shrink-0 ${envBadgeColorClass}`}
              >
                {envIconNode}
                <span>{envProfile.badgeLabel}</span>
                <span className="opacity-75">· {envProfile.environmentTag}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold shrink-0">
                {activeStageIndex > 0
                  ? `STAGE #${activeStageIndex} FOCUS`
                  : `TOPOLOGY (${scenario.stages.length} STEPS)`}
              </span>

              <span className="text-[11px] text-zinc-600 dark:text-zinc-300 truncate max-w-[560px]">
                {stageLocationContext.whereWeAreSummary}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0">
              <span>Click any node or zone to expand internal sub-view</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maximum-Height Center Diagram Canvas with Tactical Grid Overlay, Spatial Portal Zoom + Cinematic Camera Rig */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
        <div
          data-testid={
            internalSubBoard
              ? 'expanded-node-visual-board'
              : 'main-network-topology-board'
          }
          data-active-environment={activeEnvironment}
          data-architecture-code={envProfile.architectureCode}
          data-tactical-mode={tacticalMode ? 'true' : 'false'}
          className={`relative w-full h-full rounded-2xl border overflow-hidden transition-colors duration-300 ${
            tacticalMode
              ? 'bg-[#050B14] border-emerald-500/60 shadow-[inset_0_0_55px_rgba(16,185,129,0.14)]'
              : 'bg-[#FDFBF7] dark:bg-[#0D111A] border-zinc-200/90 dark:border-zinc-800 shadow-2xs'
          }`}
        >
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
                className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-xl rounded-xl bg-slate-950/92 text-white border border-rose-500/50 shadow-2xl px-4 py-2.5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-rose-400 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {director.phase === 'INTRO_SURVEY'
                        ? 'SCENARIO BRIEFING · FULL TOPOLOGY SURVEY'
                        : 'CAMERA LOCKING ON ATTACK ORIGIN'}
                    </span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {scenario.code}
                  </span>
                </div>
                <div className="mt-1 text-xs sm:text-sm font-bold text-white truncate">
                  {scenario.name}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-300 line-clamp-2 leading-snug">
                  {scenario.overview}
                </div>
                {director.originNode && director.finalNode && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-amber-300">
                    <span>START: {director.originNode.label}</span>
                    <span className="text-rose-400">
                      ── {scenario.stages.length} STAGES ──▶
                    </span>
                    <span className="text-emerald-400">
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
                    opacity: 0.85 }}
                  animate={{
                    scale: portalAnim.mode === 'EXPAND' ? 2.6 : 0.25,
                    opacity: 0 }}
                  transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    left: `${portalAnim.xPct}%`,
                    top: `${portalAnim.yPct}%` }}
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

          {/* 4. Animated Board Switcher */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={boardMotionKey}
              style={{
                transformOrigin: `${portalOrigin.xPct}% ${portalOrigin.yPct}%` }}
              initial={
                portalAnim
                  ? internalSubBoard
                    ? { opacity: 0, scale: 0.74, filter: 'blur(6px)' }
                    : { opacity: 0, scale: 1.32, filter: 'blur(5px)' }
                  : { opacity: 0.75, scale: 0.985, filter: 'blur(0px)' }
              }
              animate={{
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)' }}
              exit={
                portalAnim
                  ? internalSubBoard
                    ? { opacity: 0, scale: 0.7, filter: 'blur(5px)' }
                    : { opacity: 0, scale: 1.42, filter: 'blur(6px)' }
                  : { opacity: 0.75, scale: 0.99, filter: 'blur(0px)' }
              }
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 26,
                mass: 0.8 }}
              className="relative w-full h-full z-20"
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
                data-testid="cinematic-camera-rig"
                data-camera-frame={director.camera.frameCode}
                data-camera-scale={effectiveScale}
                animate={{
                  x: `${effectiveTxPct}%`,
                  y: `${effectiveTyPct}%`,
                  scale: effectiveScale }}
                transition={{
                  type: 'spring',
                  stiffness: 170,
                  damping: 26,
                  mass: 0.9 }}
                style={{
                  transformOrigin: '50% 50%' }}
                className="hidden sm:block relative w-full h-full"
              >
                <SketchWhiteboardSvg
                  zones={activeZones}
                  backboneLinks={activeBackboneLinks}
                  sketchFlows={activeFlows}
                  selectedTelemetryId={selectedTelemetryId}
                  onSelectTelemetry={onSelectTelemetry}
                  onSelectZone={
                    !internalSubBoard
                      ? (zoneId) => {
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
                />

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
                        damping: 24 }}
                      style={{
                        left: `${(director.activeCallout.wx / 1480) * 100}%`,
                        top: `${(director.activeCallout.wy / 650) * 100}%` }}
                      className={`pointer-events-none absolute -translate-x-1/2 z-30 w-56 rounded-xl bg-slate-950/95 text-white border border-rose-500/70 shadow-[0_10px_28px_rgba(15,23,42,0.55)] px-3 py-2 ${
                        director.activeCallout.placement === 'TOP'
                          ? '-translate-y-[calc(100%+58px)]'
                          : 'translate-y-[58px]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 text-[9.5px] font-mono">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-300">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          <span>{director.activeCallout.stepBadge}</span>
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] font-extrabold text-white leading-snug truncate">
                        {director.activeCallout.headline}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-300 leading-snug line-clamp-2">
                        {director.activeCallout.detail}
                      </div>
                      <div className="mt-1.5 pt-1 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono">
                        <span className="text-rose-400 font-bold truncate max-w-[105px]">
                          {director.activeCallout.forwardTag}
                        </span>
                        <span className="text-emerald-400 font-bold truncate max-w-[95px]">
                          {director.activeCallout.returnTag}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sleek Schematic Nodes */}
                {activeNodes.map((node, nIdx) => {
                  const isSelected = internalSubBoard
                    ? activeInternalSubNode?.id === node.id
                    : selectedSketchNode?.id === node.id;
                  const isRecentlyReturned =
                    !internalSubBoard && lastReturnedNodeId === node.id;
                  const leftPct = (node.wx / 1480) * 100;
                  const topPct = (node.wy / 650) * 100;

                  const cState = director.nodeStates[node.id] || {
                    opacity: 1,
                    scale: 1,
                    yOffset: 0,
                    showPulseRing: false,
                    pulseColor: '#6366F1',
                    role: 'OVERVIEW' };

                  return (
                    <motion.button
                      key={node.id}
                      type="button"
                      data-testid={
                        internalSubBoard
                          ? `internal-subnode-${node.chainOrder}`
                          : `sketch-node-${node.id}`
                      }
                      data-node-role={cState.role}
                      initial={{ opacity: 0, scale: 0.78, y: -24 }}
                      animate={{
                        opacity: cState.opacity,
                        scale: isSelected ? 1.08 : cState.scale,
                        y: cState.yOffset }}
                      whileHover={{ y: -4, scale: 1.07, opacity: 1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 320,
                        damping: 22,
                        delay:
                          activeStageIndex === 0 && director.phase === 'OVERVIEW'
                            ? nIdx * 0.04
                            : 0 }}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() =>
                        setHoveredNodeId((prev) =>
                          prev === node.id ? null : prev
                        )
                      }
                      onFocus={() => setHoveredNodeId(node.id)}
                      onBlur={() =>
                        setHoveredNodeId((prev) =>
                          prev === node.id ? null : prev
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredNodeId(null);
                        if (internalSubBoard) {
                          setSelectedInternalSubNodeId(node.id);
                          const relatedFlow = internalSubBoard.subFlows.find(
                            (f) =>
                              f.fromNodeId === node.id || f.toNodeId === node.id
                          );
                          if (relatedFlow) {
                            onSelectTelemetry(relatedFlow.telemetryEvent);
                          }
                        } else {
                          handleNodeClick(node);
                        }
                      }}
                      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center cursor-pointer focus:outline-none"
                    >
                      {cState.showPulseRing && (
                        <motion.span
                          initial={{ scale: 0.85, opacity: 0.85 }}
                          animate={{ scale: 1.55, opacity: 0 }}
                          transition={{
                            duration: 1.35,
                            repeat: Infinity,
                            ease: 'easeOut' }}
                          style={{ borderColor: cState.pulseColor }}
                          className="pointer-events-none absolute inset-0 rounded-2xl border-2"
                        />
                      )}

                      {isRecentlyReturned && (
                        <motion.span
                          initial={{ scale: 0.85, opacity: 0.9 }}
                          animate={{ scale: 1.65, opacity: 0 }}
                          transition={{
                            duration: 1.1,
                            repeat: 2,
                            ease: 'easeOut' }}
                          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-indigo-500"
                        />
                      )}

                      <span
                        className={`mb-0.5 px-1.5 py-0 text-[7.5px] font-mono font-bold border rounded-full shadow-2xs transition-transform group-hover:scale-105 whitespace-nowrap ${
                          node.isNetworkDevice
                            ? 'bg-teal-600 text-white border-teal-800'
                            : node.iconType === 'MALWARE_PAYLOAD' ||
                              node.iconType === 'KERNEL_MEMORY'
                            ? 'bg-rose-600 text-white border-rose-800'
                            : node.iconType === 'VICTIM_LAPTOP' ||
                              node.iconType === 'PROCESS_THREAD'
                            ? 'bg-sky-600 text-white border-sky-800'
                            : node.iconType === 'LATERAL_SERVER' ||
                              node.iconType === 'CREDENTIAL_VAULT'
                            ? 'bg-violet-600 text-white border-violet-800'
                            : 'bg-amber-500 text-slate-950 border-amber-700'
                        }`}
                      >
                        {node.actionBadge}
                      </span>

                      <SketchNodeIcon
                        iconType={node.iconType}
                        isActive={
                          node.isActive ||
                          cState.role === 'CURRENT_SOURCE' ||
                          cState.role === 'CURRENT_TARGET'
                        }
                        isCompromised={node.isCompromised}
                      />

                      <div
                        className={`mt-0.5 px-2 py-1 border rounded-md shadow-xs transition-all max-w-[205px] ${
                          tacticalMode
                            ? 'bg-slate-950/95 text-white border-emerald-500/60 group-hover:border-emerald-400'
                            : 'bg-white/95 dark:bg-zinc-900/95 border-slate-800/80 dark:border-zinc-700 group-hover:border-indigo-500'
                        } ${
                          isSelected ||
                          cState.role === 'CURRENT_TARGET' ||
                          cState.role === 'CURRENT_SOURCE'
                            ? 'ring-2 ring-rose-500 border-rose-600'
                            : ''
                        }`}
                      >
                        <div
                          className={`text-[9.5px] font-bold leading-tight truncate ${
                            tacticalMode
                              ? 'text-emerald-100'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {node.label}
                        </div>
                        <div
                          className={`text-[7.6px] font-mono leading-tight truncate ${
                            tacticalMode
                              ? 'text-emerald-400/85'
                              : 'text-slate-500 dark:text-zinc-400'
                          }`}
                        >
                          {node.sublabel}
                        </div>
                        {node.hostContext && (
                          <div
                            data-testid={
                              internalSubBoard
                                ? `subnode-host-context-${node.chainOrder}`
                                : `node-host-context-${node.id}`
                            }
                            title={node.hostContext}
                            className={`mt-0.5 px-1.5 py-0.2 rounded text-[7.3px] font-medium leading-tight truncate border ${
                              node.iconType === 'MALWARE_PAYLOAD' ||
                              node.iconType === 'KERNEL_MEMORY'
                                ? 'bg-rose-50/90 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/70'
                                : node.iconType === 'VICTIM_LAPTOP' ||
                                  node.iconType === 'PROCESS_THREAD'
                                ? 'bg-sky-50/90 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/70'
                                : 'bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700'
                            }`}
                          >
                            {node.hostContext}
                          </div>
                        )}
                        {node.activitySummary && (
                          <div
                            data-testid={
                              internalSubBoard
                                ? `subnode-activity-summary-${node.chainOrder}`
                                : `node-activity-summary-${node.id}`
                            }
                            title={node.activitySummary}
                            className={`mt-0.5 text-[7px] leading-tight truncate max-w-[190px] ${
                              tacticalMode
                                ? 'text-slate-300'
                                : 'text-slate-500 dark:text-zinc-400'
                            }`}
                          >
                            {node.activitySummary}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom-Left: Persistent Visual Semantics Legend Panel + Camera Status */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:flex flex-col items-start gap-2 absolute bottom-3 left-3 z-30"
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
                  className={`w-2 h-2 rounded-full ${
                    isPlaying
                      ? 'bg-rose-500 animate-ping'
                      : 'bg-emerald-400'
                  }`}
                />
                <span className="font-semibold truncate max-w-[260px]">
                  {director.camera.frameTitle}
                </span>
              </div>
            )}
          </div>

          {/* Bottom-Right: Play/Pause Sequence Control Bar with Framer Motion Camera Zoom & Focus */}
          <div className="absolute bottom-3 right-3 z-30">
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
              onZoomOut={() =>
                setManualZoom((z) => Math.max(0.75, +(z - 0.1).toFixed(2)))
              }
              onZoomIn={() =>
                setManualZoom((z) => Math.min(1.25, +(z + 0.1).toFixed(2)))
              }
              onResetZoom={() => setManualZoom(1)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Dock when expanded inside a node */}
      <AnimatePresence initial={false}>
        {internalSubBoard && activeInternalSubNode && (
          <motion.div
            key={`subboard-dock-${selectedSketchNode?.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="internal-subnode-inspector-bar"
            className="relative z-20 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-2xs flex flex-col gap-1.5 shrink-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {activeInternalSubNode.actionBadge}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {activeInternalSubNode.label}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px]">
                  {activeInternalSubNode.sublabel}
                </span>
                {activeInternalSubNode.hostContext && (
                  <span
                    data-testid="internal-dock-host-context"
                    className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10.5px] font-medium border border-indigo-200/80 dark:border-indigo-800/70"
                  >
                    {activeInternalSubNode.hostContext}
                  </span>
                )}
              </div>

              <div
                className="flex flex-wrap items-center gap-1"
                role="group"
                aria-label="Internal Communication Links"
              >
                {internalSubBoard.subFlows.map((fl) => {
                  const isFlowSelected = selectedTelemetryId === fl.id;
                  return (
                    <button
                      key={fl.id}
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
                      <span className="font-bold">#{fl.sequenceCode}</span>
                      <span>
                        ({fl.forwardSeq}→ {fl.label.slice(0, 14)} · ⇠
                        {fl.returnSeq})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="w-full text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {activeInternalSubNode.internalSummary}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
