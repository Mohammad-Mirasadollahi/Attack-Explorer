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
import { CinematicPhase } from '@/lib/cinematic-camera-director';
import { AttackVisualizer } from './AttackVisualizer';
import { SequenceView } from './canvas/SequenceView';
import { ProcessMemoryView } from './canvas/ProcessMemoryView';
import { RawTablesView } from './canvas/RawTablesView';

export type CanvasViewMode =
  | 'TOPOLOGY'
  | 'SEQUENCE'
  | 'PROCESS_MEMORY'
  | 'RAW_TABLES';

interface DiagramCanvasProps {
  scenario: AttackScenario;
  stageView: ComputedStageView;
  activeEnvironment?: ActiveEnvironmentId;
  onSelectEnvironment?: (env: ActiveEnvironmentId) => void;
  tacticalMode?: boolean;
  onToggleTacticalMode?: () => void;
  viewMode: CanvasViewMode;
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onSelectStage: (stageIndex: number) => void;
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
  showLegend?: boolean;
  onToggleLegend?: () => void;
  shortcutsModalOpen?: boolean;
  onOpenShortcutsModal?: () => void;
  onCloseShortcutsModal?: () => void;
}

export function DiagramCanvas({
  scenario,
  stageView,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  onSelectEnvironment,
  tacticalMode = false,
  onToggleTacticalMode,
  viewMode,
  selectedTelemetryId,
  onSelectTelemetry,
  selectedNodeId,
  onSelectNode,
  onSelectStage,
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
  showLegend = true,
  onToggleLegend,
  shortcutsModalOpen = false,
  onOpenShortcutsModal,
  onCloseShortcutsModal,
}: DiagramCanvasProps) {
  return (
    <motion.div
      layout
      onContextMenu={(e) => e.preventDefault()}
      className="relative flex-1 flex flex-col bg-[#F4F4F5]/60 dark:bg-[#09090B] min-w-0 min-h-0 overflow-hidden select-none"
      data-testid="diagram-canvas"
      data-active-environment={activeEnvironment}
      data-tactical-mode={tacticalMode ? 'true' : 'false'}
    >
      {viewMode === 'TOPOLOGY' && (
        <AttackVisualizer
          scenario={scenario}
          stageView={stageView}
          activeEnvironment={activeEnvironment}
          onSelectEnvironment={onSelectEnvironment}
          tacticalMode={tacticalMode}
          onToggleTacticalMode={onToggleTacticalMode}
          selectedTelemetryId={selectedTelemetryId}
          onSelectTelemetry={onSelectTelemetry}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          onSelectStage={onSelectStage}
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
          showLegend={showLegend}
          onToggleLegend={onToggleLegend}
          shortcutsModalOpen={shortcutsModalOpen}
          onOpenShortcutsModal={onOpenShortcutsModal}
          onCloseShortcutsModal={onCloseShortcutsModal}
        />
      )}

      {viewMode === 'SEQUENCE' && (
        <SequenceView
          scenario={scenario}
          stageView={stageView}
          activeEnvironment={activeEnvironment}
          selectedTelemetryId={selectedTelemetryId}
          onSelectTelemetry={onSelectTelemetry}
        />
      )}

      {viewMode === 'PROCESS_MEMORY' && (
        <ProcessMemoryView
          scenario={scenario}
          activeEnvironment={activeEnvironment}
        />
      )}

      {viewMode === 'RAW_TABLES' && (
        <RawTablesView
          scenario={scenario}
          stageView={stageView}
          activeEnvironment={activeEnvironment}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          selectedTelemetryId={selectedTelemetryId}
          onSelectTelemetry={onSelectTelemetry}
        />
      )}
    </motion.div>
  );
}
