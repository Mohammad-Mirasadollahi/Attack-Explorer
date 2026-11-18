'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  AttackScenario,
  TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  ComputedStageView,
  DEFAULT_ACTIVE_ENVIRONMENT } from '@/lib/simulation-engine';
import {
  WhiteboardSketchFlow,
  WhiteboardSketchNode,
} from '@/lib/sketch-zones-and-drilldown';
import { CinematicPhase } from '@/lib/cinematic-camera-director';
import { AttackVisualizer } from './AttackVisualizer';
import { RawTablesView } from './canvas/RawTablesView';
import { StepByStepGuidePanel } from './StepByStepGuidePanel';
import { PROCESS_HOLLOWING_SCENARIO_ID } from '@/lib/process-hollowing-scrollytelling';
import { ArrowLeft, Sparkles } from 'lucide-react';

export type CanvasViewMode =
  | 'TOPOLOGY'
  | 'SEQUENCE'
  | 'PROCESS_MEMORY'
  | 'RAW_TABLES'
  | 'SCROLLYTELLING';

interface DiagramCanvasProps {
  scenario: AttackScenario;
  stageView: ComputedStageView;
  activeEnvironment?: ActiveEnvironmentId;
  tacticalMode?: boolean;
  onToggleTacticalMode?: () => void;
  viewMode: CanvasViewMode;
  onViewModeChange?: (mode: CanvasViewMode) => void;
  onSelectStage?: (stageIndex: number) => void;
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  expandedNodeId?: string | null;
  onExpandedNodeChange?: (nodeId: string | null) => void;
  selectedInternalSubNodeId?: string | null;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  cinematicPhase?: CinematicPhase | null;
  isPlaying?: boolean;
  onStartWalkthrough?: () => void;
  onResetWalkthrough?: () => void;
  onTogglePlay?: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  canStepBackward?: boolean;
  canStepForward?: boolean;
  playbackSpeed?: number;
  onSpeedChange?: (speed: number) => void;
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
  forceDesktopCanvas?: boolean;
}

export function DiagramCanvas({
  scenario,
  stageView,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  tacticalMode = false,
  onToggleTacticalMode,
  viewMode,
  onViewModeChange,
  onSelectStage,
  selectedTelemetryId,
  onSelectTelemetry,
  selectedNodeId,
  onSelectNode,
  expandedNodeId,
  onExpandedNodeChange,
  selectedInternalSubNodeId,
  onSelectInternalSubNode,
  cinematicPhase = null,
  isPlaying = false,
  onStartWalkthrough,
  onResetWalkthrough,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  canStepBackward = false,
  canStepForward = true,
  playbackSpeed = 0.5,
  onSpeedChange,
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
  forceDesktopCanvas = false,
}: DiagramCanvasProps) {
  const isProcessHollowing = scenario.id === PROCESS_HOLLOWING_SCENARIO_ID;
  const effectiveViewMode: CanvasViewMode =
    viewMode === 'SCROLLYTELLING' && !isProcessHollowing ? 'TOPOLOGY' : viewMode;

  return (
    <motion.div
      layout
      onContextMenu={(e) => e.preventDefault()}
      className="relative flex-1 flex flex-col bg-[#F4F4F5]/60 dark:bg-[#09090B] min-w-0 min-h-0 overflow-hidden select-none"
      data-testid="diagram-canvas"
      data-active-environment={activeEnvironment}
      data-tactical-mode={tacticalMode ? 'true' : 'false'}
    >
      {/* Prominent Quick-Switch Pill on Topology Canvas for Process Hollowing */}
      {isProcessHollowing && effectiveViewMode === 'TOPOLOGY' && onViewModeChange && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            type="button"
            data-testid="launch-scroll-walkthrough-banner"
            onClick={() => onViewModeChange('SCROLLYTELLING')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-indigo-600 to-indigo-700 hover:from-rose-500 hover:to-indigo-600 text-white text-xs font-mono font-bold shadow-lg shadow-indigo-950/50 border border-white/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
            <span>Interactive Scroll-Driven Breakdown (Step-by-Step Animation)</span>
          </button>
        </div>
      )}

      {effectiveViewMode !== 'RAW_TABLES' &&
        effectiveViewMode !== 'SCROLLYTELLING' && (
          <AttackVisualizer
            scenario={scenario}
            stageView={stageView}
            activeEnvironment={activeEnvironment}
            tacticalMode={tacticalMode}
            onToggleTacticalMode={onToggleTacticalMode}
            selectedTelemetryId={selectedTelemetryId}
            onSelectTelemetry={onSelectTelemetry}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            expandedNodeId={expandedNodeId}
            onExpandedNodeChange={onExpandedNodeChange}
            selectedInternalSubNodeId={selectedInternalSubNodeId}
            onSelectInternalSubNode={onSelectInternalSubNode}
            cinematicPhase={cinematicPhase}
            isPlaying={isPlaying}
            onStartWalkthrough={onStartWalkthrough}
            onResetWalkthrough={onResetWalkthrough}
            onTogglePlay={onTogglePlay}
            onStepForward={onStepForward}
            onStepBackward={onStepBackward}
            canStepBackward={canStepBackward}
            canStepForward={canStepForward}
            playbackSpeed={playbackSpeed}
            onSpeedChange={onSpeedChange}
            shortcutsModalOpen={shortcutsModalOpen}
            onOpenShortcutsModal={onOpenShortcutsModal}
            onCloseShortcutsModal={onCloseShortcutsModal}
            nodeSearchQuery={nodeSearchQuery}
            onNodeSearchQueryChange={onNodeSearchQueryChange}
            focusedSearchNodeId={focusedSearchNodeId}
            focusSearchSeq={focusSearchSeq}
            onActiveNodesChange={onActiveNodesChange}
            customInjectedNodes={customInjectedNodes}
            customInjectedFlows={customInjectedFlows}
            onDropAttackVector={onDropAttackVector}
            forceDesktopCanvas={forceDesktopCanvas}
          />
        )}

      {effectiveViewMode === 'RAW_TABLES' && (
        <RawTablesView
          scenario={scenario}
          stageView={stageView}
          activeEnvironment={activeEnvironment}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      )}

      {effectiveViewMode === 'SCROLLYTELLING' && isProcessHollowing && (
        <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden select-text bg-[#F4F4F5]/60 dark:bg-[#09090B]">
          {onViewModeChange && (
            <div className="shrink-0 px-4 py-2.5 bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-zinc-900 dark:text-white">
                  Process Hollowing &amp; Cobalt Strike Beacon Loader
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                  — Scroll-Driven Step-by-Step Breakdown
                </span>
              </div>
              <button
                type="button"
                data-testid="exit-scroll-walkthrough-btn"
                onClick={() => onViewModeChange('TOPOLOGY')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-semibold border border-zinc-200/80 dark:border-zinc-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Topology Board</span>
              </button>
            </div>
          )}
          <div
            data-testid="scrollytelling-canvas-scroller"
            className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4"
          >
            <div className="max-w-[1600px] mx-auto">
              <StepByStepGuidePanel
                scenario={scenario}
                activeStageIndex={stageView.currentStage?.index ?? 0}
                cinematicPhase={cinematicPhase}
                isPlaying={isPlaying}
                activeEnvironment={activeEnvironment}
                selectedTelemetryId={selectedTelemetryId}
                onSelectStage={onSelectStage}
                onSelectTelemetry={onSelectTelemetry}
                onSelectInternalSubNode={onSelectInternalSubNode}
                onStartWalkthrough={onStartWalkthrough}
                onTogglePlay={onTogglePlay}
                onResetWalkthrough={onResetWalkthrough}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
