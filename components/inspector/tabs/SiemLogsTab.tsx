'use client';

import React from 'react';
import type { AttackScenario, TelemetryEvent } from '@/lib/attack-scenarios';
import type { ActiveEnvironmentId } from '@/lib/simulation-engine';
import type { InspectorScopeContext } from '@/lib/inspector-scope';
import { LogInspector } from '../../LogInspector';

export interface SiemLogsTabProps {
  scenario: AttackScenario;
  activeStageIndex: number;
  selectedTelemetry: TelemetryEvent | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  onSelectStage: (stageIndex: number) => void;
  activeEnvironment: ActiveEnvironmentId;
  effectiveScopeContext: InspectorScopeContext;
}

export function SiemLogsTab({
  scenario,
  activeStageIndex,
  selectedTelemetry,
  onSelectTelemetry,
  onSelectStage,
  activeEnvironment,
  effectiveScopeContext,
}: SiemLogsTabProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm">
      <LogInspector
        scenario={scenario}
        activeStageIndex={activeStageIndex}
        selectedTelemetryId={selectedTelemetry?.id || null}
        onSelectTelemetry={onSelectTelemetry}
        onSelectStage={onSelectStage}
        activeEnvironment={activeEnvironment}
        scopeContext={effectiveScopeContext}
      />
    </div>
  );
}
