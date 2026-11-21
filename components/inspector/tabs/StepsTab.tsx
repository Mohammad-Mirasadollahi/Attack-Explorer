'use client';

import React from 'react';
import type { AttackScenario, TelemetryEvent } from '@/lib/attack-scenarios';
import type { ActiveEnvironmentId } from '@/lib/simulation-engine';
import type { CinematicPhase } from '@/lib/cinematic-camera-director';
import type { InspectorScopeContext } from '@/lib/inspector-scope';
import { StepByStepGuidePanel } from '../../StepByStepGuidePanel';

export interface StepsTabProps {
  scenario: AttackScenario;
  activeStageIndex: number;
  cinematicPhase?: CinematicPhase | null;
  activeEnvironment: ActiveEnvironmentId;
  effectiveScopeContext: InspectorScopeContext;
  selectedTelemetry: TelemetryEvent | null;
  onSelectStage: (stageIndex: number) => void;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onStartWalkthrough?: () => void;
  onResetWalkthrough?: () => void;
  onOpenProcessHierarchy: () => void;
}

export function StepsTab({
  scenario,
  activeStageIndex,
  cinematicPhase,
  activeEnvironment,
  effectiveScopeContext,
  selectedTelemetry,
  onSelectStage,
  onSelectTelemetry,
  onSelectInternalSubNode,
  onStartWalkthrough,
  onResetWalkthrough,
  onOpenProcessHierarchy,
}: StepsTabProps) {
  return (
    <div
      data-testid="inspector-steps-merged-shell"
      className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-sm overflow-hidden"
    >
      <StepByStepGuidePanel
        scenario={scenario}
        activeStageIndex={activeStageIndex}
        cinematicPhase={cinematicPhase}
        activeEnvironment={activeEnvironment}
        scopeContext={effectiveScopeContext}
        selectedTelemetryId={selectedTelemetry?.id || null}
        onSelectStage={onSelectStage}
        onSelectTelemetry={onSelectTelemetry}
        onSelectInternalSubNode={onSelectInternalSubNode}
        onStartWalkthrough={onStartWalkthrough}
        onResetWalkthrough={onResetWalkthrough}
        onOpenProcessHierarchy={onOpenProcessHierarchy}
      />
    </div>
  );
}
