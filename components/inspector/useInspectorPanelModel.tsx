'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Cpu,
  GitBranch,
  ListChecks,
  Scale,
  Terminal,
} from 'lucide-react';
import type { AttackScenario, AttackStage, TelemetryEvent } from '@/lib/attack-scenarios';
import type { ActiveEnvironmentId } from '@/lib/simulation-engine';
import {
  buildInspectorMiniMapModel,
  type InspectorScopeContext,
  type InspectorScopeMode,
  isSeparatedStepsAndSequenceScenario,
  resolveInspectorScopeContext,
  resolveScopedMemoryForensics,
} from '@/lib/inspector-scope';
import type { InspectorTab, InspectorVisibleTab } from './types';

export interface UseInspectorPanelModelArgs {
  scenario: AttackScenario;
  currentStage: AttackStage | null;
  activeEnvironment: ActiveEnvironmentId;
  selectedTelemetry: TelemetryEvent | null;
  scopeContext?: InspectorScopeContext;
  controlledActiveTab?: InspectorTab;
  onTabChange?: (tab: InspectorTab) => void;
  onSelectStage: (stageIndex: number) => void;
}

export function useInspectorPanelModel({
  scenario,
  currentStage,
  activeEnvironment,
  selectedTelemetry,
  scopeContext,
  controlledActiveTab,
  onTabChange,
  onSelectStage,
}: UseInspectorPanelModelArgs) {
  const [internalActiveTab, setInternalActiveTab] =
    useState<InspectorTab>('OVERVIEW');

  const rawActiveTab = controlledActiveTab ?? internalActiveTab;
  const activeStageIndex = currentStage ? currentStage.index : 0;

  const handleSelectTab = (nextTab: InspectorTab) => {
    setInternalActiveTab(nextTab);
    onTabChange?.(nextTab);
    // Overview is whole-scenario only — clear any stage filter selection
    if (nextTab === 'OVERVIEW' && activeStageIndex > 0) {
      onSelectStage(0);
    }
  };

  const effectiveScope: InspectorScopeMode =
    scopeContext?.effectiveScope || 'MAIN_SCENARIO';

  const effectiveScopeContext = useMemo<InspectorScopeContext>(() => {
    const base =
      scopeContext ||
      resolveInspectorScopeContext({
        scenario,
        activeStageIndex,
        activeEnvironment,
        selectedNodeId: null,
        expandedNodeId: null,
        selectedInternalSubNodeId: null,
      });
    // When on the Main Topology Diagram (MAIN_SCENARIO), always present the full Main Scenario
    // and all its stages rather than locking onto a single unexpanded node section.
    if (base.effectiveScope === 'MAIN_SCENARIO' && base.selectedMainNode) {
      return resolveInspectorScopeContext({
        scenario,
        activeStageIndex,
        activeEnvironment,
        selectedNodeId: null,
        expandedNodeId: null,
        selectedInternalSubNodeId: null,
      });
    }
    return base;
  }, [scopeContext, scenario, activeStageIndex, activeEnvironment]);

  const scopedMemory = useMemo(
    () =>
      resolveScopedMemoryForensics(effectiveScopeContext, selectedTelemetry),
    [effectiveScopeContext, selectedTelemetry]
  );

  const isStreamlinedStepGuideScenario = isSeparatedStepsAndSequenceScenario(
    scenario.id
  );

  const resolvedActiveTab: InspectorTab =
    rawActiveTab === 'MEMORY' && !scopedMemory.hasDocumentedMemory
      ? 'OVERVIEW'
      : rawActiveTab === 'SEQUENCE'
        ? 'STEP_GUIDE'
        : rawActiveTab;

  const isInspectingSpecificMainNode = Boolean(
    effectiveScope === 'MAIN_SCENARIO' && effectiveScopeContext.selectedMainNode
  );

  const miniMapModel = useMemo(() => {
    return buildInspectorMiniMapModel(
      effectiveScopeContext,
      selectedTelemetry,
      activeStageIndex,
      scenario.stages.length
    );
  }, [
    effectiveScopeContext,
    selectedTelemetry,
    activeStageIndex,
    scenario.stages.length,
  ]);

  const activeInspectNode =
    effectiveScopeContext.effectiveScope === 'INTERNAL_SUBNODE' &&
    effectiveScopeContext.focusedInternalSubNode
      ? effectiveScopeContext.focusedInternalSubNode
      : effectiveScopeContext.effectiveScope === 'EXPANDED_NODE' &&
          effectiveScopeContext.expandedParentNode
        ? effectiveScopeContext.expandedParentNode
        : null;

  const activeInspectZone =
    effectiveScopeContext.effectiveScope !== 'MAIN_SCENARIO'
      ? effectiveScopeContext.focusedInternalSubNodeZone ||
        effectiveScopeContext.expandedParentNodeZone
      : null;

  const pageTitle = selectedTelemetry
    ? `Packet Telemetry: ${selectedTelemetry.protocolOrEventId} (${selectedTelemetry.sourceLabel || selectedTelemetry.sourceNodeId} → ${selectedTelemetry.targetLabel || selectedTelemetry.targetNodeId})`
    : activeInspectNode
      ? `${activeInspectNode.label} (${activeInspectNode.sublabel})`
      : resolvedActiveTab === 'OVERVIEW'
        ? scenario.name
        : currentStage
          ? `Stage ${currentStage.index}: ${currentStage.title}`
          : scenario.name;

  const visibleTabs = useMemo(() => {
    const tabs: InspectorVisibleTab[] = [
      {
        id: 'OVERVIEW',
        label: 'Overview',
        testId: 'inspector-tab-overview',
        icon: <BookOpen className="w-3.5 h-3.5 shrink-0" />,
      },
      {
        id: 'STEP_GUIDE',
        label: isStreamlinedStepGuideScenario
          ? 'Step-by-Step Guide'
          : 'Steps & Sequence',
        testId: 'inspector-tab-steps',
        icon: <ListChecks className="w-3.5 h-3.5 shrink-0" />,
      },
      {
        id: 'PROCESS_HIERARCHY',
        label: 'Process Hierarchy',
        testId: 'inspector-tab-process-hierarchy',
        icon: <GitBranch className="w-3.5 h-3.5 shrink-0" />,
      },
    ];

    if (scopedMemory.hasDocumentedMemory) {
      tabs.push({
        id: 'MEMORY',
        label: 'Memory',
        testId: 'inspector-tab-memory',
        icon: <Cpu className="w-3.5 h-3.5 shrink-0" />,
      });
    }

    tabs.push(
      {
        id: 'SIEM_LOGS',
        label: 'SIEM Logs',
        testId: 'inspector-tab-logs',
        icon: <Terminal className="w-3.5 h-3.5 shrink-0" />,
      },
      {
        id: 'SOURCES',
        label: 'Sources & Intel',
        testId: 'inspector-tab-sources',
        icon: <Scale className="w-3.5 h-3.5 shrink-0" />,
      }
    );

    return tabs;
  }, [isStreamlinedStepGuideScenario, scopedMemory.hasDocumentedMemory]);

  return {
    activeStageIndex,
    handleSelectTab,
    effectiveScope,
    effectiveScopeContext,
    scopedMemory,
    resolvedActiveTab,
    isInspectingSpecificMainNode,
    miniMapModel,
    activeInspectNode,
    activeInspectZone,
    pageTitle,
    visibleTabs,
  };
}
