'use client';

import React, { useMemo } from 'react';
import {
  buildDocumentationArchitectureBlueprint,
} from '@/lib/documentation-structural-diagrams';
import type { InspectorContextMiniMapProps } from './types';
import { CascadingProcessCard } from './CascadingProcessCard';
import { CascadingProcessWaterfall } from './CascadingProcessWaterfall';
import { MiniMapHeaderBar } from './MiniMapHeaderBar';
import { StateTransformationCard } from './StateTransformationCard';
import { StructuralBlueprintSection } from './StructuralBlueprintSection';
import { TopologyLinksSection } from './TopologyLinksSection';

export type {
  InspectorContextMiniMapProps,
  InspectorContextMiniMapSections,
} from './types';

/**
 * Documentation MiniMap shell: section flags, blueprint/connection models,
 * cascade-only embedded mode, and composed documentation blocks.
 */
export const InspectorContextMiniMap: React.FC<
  InspectorContextMiniMapProps
> = ({
  miniMap,
  scopeContext,
  selectedTelemetry,
  filterStageIndex = null,
  onSelectNode,
  onSelectMainNode,
  onSelectInternalSubNode,
  onSelectInternalNode,
  onSelectTelemetry,
  onReturnToDiagram,
  includeSections,
}) => {
  const showHeader = includeSections?.header !== false;
  const showStructuralBlueprint = includeSections?.structuralBlueprint !== false;
  const showCascadingProcess = includeSections?.cascadingProcess !== false;
  const cascadingProcessEmbedded =
    includeSections?.cascadingProcessEmbedded === true;
  const showStateTransformation = includeSections?.stateTransformation !== false;
  const showTopologyLinks = includeSections?.topologyLinks !== false;

  const handleSelectNode = onSelectNode || onSelectMainNode;
  const handleSelectSubNode = onSelectInternalSubNode || onSelectInternalNode;

  const {
    schematic,
    selectedMainNode,
    expandedParentNode,
    focusedInternalSubNode,
    internalSubBoard,
    selectedMainNodeSubBoard,
    scenario,
  } = scopeContext;

  const effectiveStageFilter =
    filterStageIndex !== null
      ? filterStageIndex
      : scopeContext.activeStageIndex > 0
        ? scopeContext.activeStageIndex
        : null;

  const blueprint = useMemo(
    () =>
      buildDocumentationArchitectureBlueprint(
        scopeContext,
        effectiveStageFilter
      ),
    [scopeContext, effectiveStageFilter]
  );

  const focusedNode =
    scopeContext.effectiveScope === 'INTERNAL_SUBNODE' &&
    focusedInternalSubNode
      ? focusedInternalSubNode
      : scopeContext.effectiveScope === 'EXPANDED_NODE' && expandedParentNode
        ? expandedParentNode
        : selectedMainNode || miniMap?.primaryNode || null;

  const focusedNodeId = focusedNode?.id || null;
  const activeSubBoard = internalSubBoard || selectedMainNodeSubBoard || null;

  const activeStageObj = useMemo(() => {
    if (effectiveStageFilter === null || effectiveStageFilter === 0) {
      return null;
    }
    return (
      scenario.stages.find((s) => s.index === effectiveStageFilter) ||
      scenario.stages[effectiveStageFilter - 1] ||
      null
    );
  }, [scenario.stages, effectiveStageFilter]);

  const connectionArms = useMemo(() => {
    if (miniMap && miniMap.connectionArms.length > 0) {
      return miniMap.connectionArms;
    }
    const flows = schematic?.flows || [];
    const nodes = schematic?.nodes || [];
    const byId = new Map(nodes.map((n) => [n.id, n]));
    if (focusedNode) {
      return flows
        .filter(
          (fl) =>
            fl.fromNodeId === focusedNode.id || fl.toNodeId === focusedNode.id
        )
        .map((fl) => {
          const isOutbound = fl.fromNodeId === focusedNode.id;
          const neighbor =
            byId.get(isOutbound ? fl.toNodeId : fl.fromNodeId) || focusedNode;
          return {
            flow: fl,
            direction: (isOutbound ? 'OUTBOUND' : 'INBOUND') as
              | 'OUTBOUND'
              | 'INBOUND'
              | 'ACTIVE_STAGE',
            neighborNode: neighbor,
          };
        });
    }
    return flows.map((fl) => ({
      flow: fl,
      direction: 'ACTIVE_STAGE' as const,
      neighborNode: byId.get(fl.toNodeId) || nodes[0],
    }));
  }, [miniMap, schematic, focusedNode]);

  const cascadeColClass =
    showCascadingProcess && showStateTransformation
      ? 'xl:col-span-7'
      : 'xl:col-span-12';
  const stateColClass =
    showCascadingProcess && showStateTransformation
      ? 'xl:col-span-5'
      : 'xl:col-span-12';

  const isCascadeOnlyEmbedded =
    cascadingProcessEmbedded &&
    showCascadingProcess &&
    !showHeader &&
    !showStructuralBlueprint &&
    !showStateTransformation &&
    !showTopologyLinks;

  if (isCascadeOnlyEmbedded) {
    return (
      <div data-testid="inspector-context-minimap" className="px-5 pb-5">
        <CascadingProcessWaterfall
          nodes={blueprint.cascadingProcesses}
          scenario={scenario}
          activeStageObj={activeStageObj}
          embedded
        />
      </div>
    );
  }

  return (
    <div
      data-testid="inspector-context-minimap"
      className="rounded-2xl border border-indigo-200/80 dark:border-indigo-500/30 bg-white dark:bg-zinc-900/95 overflow-hidden shadow-sm space-y-0"
    >
      {showHeader && (
        <MiniMapHeaderBar
          blueprint={blueprint}
          scenario={scenario}
          activeStageObj={activeStageObj}
          stageBadge={miniMap?.stageBadge}
          focusedNodeId={focusedNodeId}
          onClearFocus={() => handleSelectNode?.(null)}
          onReturnToDiagram={onReturnToDiagram}
        />
      )}

      {showStructuralBlueprint && (
        <StructuralBlueprintSection
          blueprint={blueprint}
          scenario={scenario}
          onSelectNode={handleSelectNode}
        />
      )}

      {(showCascadingProcess || showStateTransformation) && (
        <div className="p-4 sm:p-5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/30 grid grid-cols-1 xl:grid-cols-12 gap-4">
          {showCascadingProcess && (
            <CascadingProcessCard
              nodes={blueprint.cascadingProcesses}
              scenario={scenario}
              activeStageObj={activeStageObj}
              className={`${cascadeColClass} rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3`}
            />
          )}

          {showStateTransformation && (
            <StateTransformationCard
              stateTransformation={blueprint.stateTransformation}
              className={`${stateColClass} rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col justify-between gap-3`}
            />
          )}
        </div>
      )}

      {showTopologyLinks && (
        <TopologyLinksSection
          schematic={schematic}
          focusedNode={focusedNode}
          focusedNodeId={focusedNodeId}
          focusedInternalSubNode={focusedInternalSubNode}
          activeSubBoard={activeSubBoard}
          connectionArms={connectionArms}
          selectedTelemetry={selectedTelemetry}
          onSelectNode={handleSelectNode}
          onSelectSubNode={handleSelectSubNode}
          onSelectTelemetry={onSelectTelemetry}
        />
      )}
    </div>
  );
};
