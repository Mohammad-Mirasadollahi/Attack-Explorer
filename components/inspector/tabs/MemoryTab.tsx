'use client';

import React from 'react';
import type { AttackScenario, TelemetryEvent } from '@/lib/attack-scenarios';
import type { ActiveEnvironmentId } from '@/lib/simulation-engine';
import type {
  InspectorMiniMapModel,
  InspectorScopeContext,
  ScopedMemoryForensicsModel,
} from '@/lib/inspector-scope';
import { InspectorContextMiniMap } from '../../InspectorContextMiniMap';
import { ProcessMemoryView } from '../../canvas/ProcessMemoryView';

export interface MemoryTabProps {
  scenario: AttackScenario;
  activeEnvironment: ActiveEnvironmentId;
  miniMapModel: InspectorMiniMapModel | null;
  effectiveScopeContext: InspectorScopeContext;
  selectedTelemetry: TelemetryEvent | null;
  activeStageIndex: number;
  scopedMemory: ScopedMemoryForensicsModel;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  onClearTelemetrySelection: () => void;
  onSelectNode?: (nodeId: string | null) => void;
  onExpandedNodeChange?: (nodeId: string | null) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onCloseInspectorPage?: () => void;
}

/** Documented Virtual Memory Forensics (VAD / PE-SIEVE) — Memory-owned. */
export function MemoryTab({
  scenario,
  activeEnvironment,
  miniMapModel,
  effectiveScopeContext,
  selectedTelemetry,
  activeStageIndex,
  scopedMemory,
  onSelectTelemetry,
  onClearTelemetrySelection,
  onSelectNode,
  onExpandedNodeChange,
  onSelectInternalSubNode,
  onCloseInspectorPage,
}: MemoryTabProps) {
  if (!scopedMemory.hasDocumentedMemory) return null;

  return (
    <div className="flex flex-col gap-5">
      {miniMapModel && (
        <InspectorContextMiniMap
          miniMap={miniMapModel}
          scopeContext={effectiveScopeContext}
          selectedTelemetry={selectedTelemetry}
          filterStageIndex={activeStageIndex > 0 ? activeStageIndex : null}
          includeSections={{
            header: false,
            structuralBlueprint: false,
            cascadingProcess: false,
            stateTransformation: true,
            topologyLinks: false,
          }}
          onSelectNode={(nodeId) => {
            onClearTelemetrySelection();
            onExpandedNodeChange?.(nodeId);
            onSelectNode?.(nodeId);
          }}
          onSelectInternalSubNode={(subNodeId) => {
            onClearTelemetrySelection();
            onSelectInternalSubNode?.(subNodeId);
          }}
          onSelectTelemetry={(ev) => {
            onSelectTelemetry(ev);
          }}
          onReturnToDiagram={() => onCloseInspectorPage?.()}
        />
      )}
      <div className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 overflow-hidden shadow-sm">
        <ProcessMemoryView
          scenario={scenario}
          activeEnvironment={activeEnvironment}
          scopeContext={effectiveScopeContext}
          selectedTelemetry={selectedTelemetry}
        />
      </div>
    </div>
  );
}
