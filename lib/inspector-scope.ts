import { AttackScenario } from './attack-scenarios';
import { CinematicPhase } from './cinematic-camera-director';
import {
  EnrichedStepLog,
   buildCorrelatedRawLog,
  buildCorrelatedStepLogs,
  extractEventIdsFromLog,
} from './log-inspector-utils';
import {
  DiagramStepGuideModel,
  buildDiagramStepGuideModel,
} from './scenario-step-guides';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  TaggedTelemetryEvent,
  getActiveEnvironmentProfile,
  tagTelemetryEventWithEnvironment,
} from './simulation-engine';
import {
  InternalSubBoardSchematic,
  NetworkZoneColumn,
  StageLocationContext,
  WhiteboardSketchFlow,
  WhiteboardSketchNode,
  buildInternalNodeSubBoard,
  buildWhiteboardSchematic,
  getStageLocationContext,
} from './sketch-zones-and-drilldown';

export type InspectorScopeMode =
  | 'MAIN_SCENARIO'
  | 'EXPANDED_NODE'
  | 'INTERNAL_SUBNODE';

export interface ScopedInternalStepItem {
  stepNumber: number;
  sequenceCode: string;
  forwardSeq: string;
  returnSeq: string;
  title: string;
  protocolOrEventId: string;
  mitreId: string;
  fromSubNode: WhiteboardSketchNode;
  toSubNode: WhiteboardSketchNode;
  forwardFlowBadge: string;
  returnFlowBadge: string;
  explanation: string;
  returnDescription: string;
  continuationHint: string;
  isCurrentStep: boolean;
  isRelatedToSelectedSubNode: boolean;
  flow: WhiteboardSketchFlow;
  telemetryEvent: TaggedTelemetryEvent;
}

export interface InspectorScopeContext {
  scenario: AttackScenario;
  activeStageIndex: number;
  activeEnvironment: ActiveEnvironmentId;
  /** Underlying diagram scope based on canvas expansion and sub-node selection */
  diagramScope: InspectorScopeMode;
  /** Active scope displayed in the Inspector (respects temporary scenario-level jump) */
  effectiveScope: InspectorScopeMode;
  /** True when the diagram is expanded, but the user toggled Scenario view in the Inspector */
  isScenarioOverrideActive: boolean;
  /** Concise scope indicator label for the active Inspector scope ("Scenario" | "Expanded: Node #N · Label" | "Internal: #N.M · Label") */
  scopeBadgeText: string;
  /** Concise scope indicator label for the underlying diagram scope */
  diagramScopeBadgeText: string;
  /** Documented location summary answering "Where am I right now?" */
  whereAmISummary: string;
  stageLocationContext: StageLocationContext;
  selectedMainNode: WhiteboardSketchNode | null;
  expandedNode: WhiteboardSketchNode | null;
  companionNode: WhiteboardSketchNode | null;
  internalSubBoard: InternalSubBoardSchematic | null;
  selectedSubNode: WhiteboardSketchNode | null;
  selectedSubNodeZone: NetworkZoneColumn | null;
  relatedSubFlows: WhiteboardSketchFlow[];
  scopedTelemetryEvents: TaggedTelemetryEvent[];
  internalSteps: ScopedInternalStepItem[];
}

export interface ScopedStepGuideModel {
  effectiveScope: InspectorScopeMode;
  scenarioGuide: DiagramStepGuideModel;
  internalSubBoard: InternalSubBoardSchematic | null;
  selectedSubNode: WhiteboardSketchNode | null;
  internalSteps: ScopedInternalStepItem[];
}

export function formatExpandedNodeScopeLabel(
  node: Pick<WhiteboardSketchNode, 'chainOrder' | 'sequenceCode' | 'label'>
): string {
  const code = node.sequenceCode || String(node.chainOrder);
  return `Expanded: Node #${code} · ${node.label}`;
}

export function formatInternalSubNodeScopeLabel(
  subNode: Pick<WhiteboardSketchNode, 'chainOrder' | 'sequenceCode' | 'label'>,
  parentNode?: Pick<WhiteboardSketchNode, 'chainOrder' | 'sequenceCode'> | null
): string {
  const parentCode = parentNode
    ? parentNode.sequenceCode || String(parentNode.chainOrder)
    : '';
  const subCode =
    subNode.sequenceCode ||
    (parentCode
      ? `${parentCode}.${subNode.chainOrder}`
      : String(subNode.chainOrder));
  return `Internal: #${subCode} · ${subNode.label}`;
}

/**
 * Resolves the complete, deterministic Inspector scope context from the current
 * scenario, active stage, active environment, expanded node, and selected sub-node.
 * Uses strictly existing scenario, node, and sub-board data with zero invented prose.
 */
export function resolveInspectorScopeContext(params: {
  scenario: AttackScenario;
  activeStageIndex: number;
  activeEnvironment?: ActiveEnvironmentId;
  selectedNodeId?: string | null;
  expandedNodeId?: string | null;
  selectedInternalSubNodeId?: string | null;
  scopeOverride?: InspectorScopeMode | null;
}): InspectorScopeContext {
  const {
    scenario,
    activeStageIndex,
    activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
    selectedNodeId = null,
    expandedNodeId = null,
    selectedInternalSubNodeId = null,
    scopeOverride = null,
  } = params;

  const schematic = buildWhiteboardSchematic(
    scenario,
    activeStageIndex,
    activeEnvironment
  );

  const stageLocationContext = getStageLocationContext(
    scenario,
    schematic.nodes,
    schematic.flows,
    activeStageIndex,
    activeEnvironment
  );

  const selectedMainNode = selectedNodeId
    ? schematic.nodes.find((n) => n.id === selectedNodeId) || null
    : null;

  const expandedNode = expandedNodeId
    ? schematic.nodes.find((n) => n.id === expandedNodeId) || null
    : null;

  const companionNode =
    expandedNode?.companionHostOrProcessNodeId
      ? schematic.nodes.find(
          (n) => n.id === expandedNode.companionHostOrProcessNodeId
        ) || null
      : null;

  const internalSubBoard = expandedNode
    ? buildInternalNodeSubBoard(
        scenario,
        expandedNode,
        schematic.flows,
        activeStageIndex
      )
    : null;

  const selectedSubNode =
    internalSubBoard && selectedInternalSubNodeId
      ? internalSubBoard.subNodes.find(
          (sn) => sn.id === selectedInternalSubNodeId
        ) || null
      : null;

  const selectedSubNodeZone =
    internalSubBoard && selectedSubNode
      ? internalSubBoard.zones.find((z) => z.id === selectedSubNode.zoneId) ||
        null
      : null;

  const diagramScope: InspectorScopeMode = !internalSubBoard
    ? 'MAIN_SCENARIO'
    : selectedSubNode
    ? 'INTERNAL_SUBNODE'
    : 'EXPANDED_NODE';

  const isScenarioOverrideActive =
    diagramScope !== 'MAIN_SCENARIO' && scopeOverride === 'MAIN_SCENARIO';

  const effectiveScope: InspectorScopeMode = isScenarioOverrideActive
    ? 'MAIN_SCENARIO'
    : diagramScope;

  const diagramScopeBadgeText =
    diagramScope === 'INTERNAL_SUBNODE' && selectedSubNode
      ? formatInternalSubNodeScopeLabel(selectedSubNode, expandedNode)
      : diagramScope === 'EXPANDED_NODE' && expandedNode
      ? formatExpandedNodeScopeLabel(expandedNode)
      : 'Scenario';

  const scopeBadgeText =
    effectiveScope === 'MAIN_SCENARIO' ? 'Scenario' : diagramScopeBadgeText;

  const whereAmISummary =
    effectiveScope === 'INTERNAL_SUBNODE' &&
    selectedSubNode &&
    internalSubBoard
      ? `${selectedSubNode.hostContext} ▸ ${selectedSubNode.actionBadge} · ${selectedSubNode.label} (${selectedSubNode.sublabel})`
      : effectiveScope === 'EXPANDED_NODE' && internalSubBoard
      ? internalSubBoard.environmentBreadcrumb
      : stageLocationContext.whereWeAreSummary;

  const relatedSubFlows: WhiteboardSketchFlow[] = !internalSubBoard
    ? []
    : effectiveScope === 'INTERNAL_SUBNODE' && selectedSubNode
    ? internalSubBoard.subFlows.filter(
        (fl) =>
          fl.fromNodeId === selectedSubNode.id ||
          fl.toNodeId === selectedSubNode.id
      )
    : internalSubBoard.subFlows;

  const internalSteps: ScopedInternalStepItem[] = internalSubBoard
    ? internalSubBoard.subFlows.map((flow, idx) => {
        const fromSubNode =
          internalSubBoard.subNodes.find((sn) => sn.id === flow.fromNodeId) ||
          internalSubBoard.subNodes[0];
        const toSubNode =
          internalSubBoard.subNodes.find((sn) => sn.id === flow.toNodeId) ||
          internalSubBoard.subNodes[
            Math.min(1, internalSubBoard.subNodes.length - 1)
          ];
        const taggedEv = tagTelemetryEventWithEnvironment(
          flow.telemetryEvent,
          activeEnvironment
        );
        const isRelatedToSelectedSubNode = selectedSubNode
          ? flow.fromNodeId === selectedSubNode.id ||
            flow.toNodeId === selectedSubNode.id
          : true;

        return {
          stepNumber: idx + 1,
          sequenceCode: flow.sequenceCode,
          forwardSeq: flow.forwardSeq,
          returnSeq: flow.returnSeq,
          title: flow.label,
          protocolOrEventId: flow.protocolBadge,
          mitreId: flow.telemetryEvent.mitreId,
          fromSubNode,
          toSubNode,
          forwardFlowBadge: `#${flow.forwardSeq}→ ${flow.label}`,
          returnFlowBadge: `⇠#${flow.returnSeq} ${flow.returnLabel}`,
          explanation: flow.telemetryEvent.explanation,
          returnDescription: flow.traceMeta.returnDescription,
          continuationHint: flow.traceMeta.continuationHint,
          isCurrentStep: flow.isCurrentStep,
          isRelatedToSelectedSubNode,
          flow,
          telemetryEvent: taggedEv,
        };
      })
    : [];

  const scopedTelemetryEvents: TaggedTelemetryEvent[] =
    effectiveScope === 'MAIN_SCENARIO' || !internalSubBoard
      ? scenario.telemetry.map((ev) =>
          tagTelemetryEventWithEnvironment(ev, activeEnvironment)
        )
      : effectiveScope === 'INTERNAL_SUBNODE' && relatedSubFlows.length > 0
      ? relatedSubFlows.map((fl) =>
          tagTelemetryEventWithEnvironment(fl.telemetryEvent, activeEnvironment)
        )
      : internalSubBoard.subFlows.map((fl) =>
          tagTelemetryEventWithEnvironment(fl.telemetryEvent, activeEnvironment)
        );

  return {
    scenario,
    activeStageIndex,
    activeEnvironment,
    diagramScope,
    effectiveScope,
    isScenarioOverrideActive,
    scopeBadgeText,
    diagramScopeBadgeText,
    whereAmISummary,
    stageLocationContext,
    selectedMainNode,
    expandedNode,
    companionNode,
    internalSubBoard,
    selectedSubNode,
    selectedSubNodeZone,
    relatedSubFlows,
    scopedTelemetryEvents,
    internalSteps,
  };
}

/**
 * Resolves a selected telemetry event by ID across both scenario-level telemetry
 * and the currently expanded internal sub-board flows.
 */
export function resolveScopedTelemetrySelection(params: {
  scenario: AttackScenario;
  selectedTelemetryId: string | null;
  internalSubBoard: InternalSubBoardSchematic | null;
  activeEnvironment?: ActiveEnvironmentId;
}): TaggedTelemetryEvent | null {
  const {
    scenario,
    selectedTelemetryId,
    internalSubBoard,
    activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  } = params;

  if (!selectedTelemetryId) return null;

  if (internalSubBoard) {
    const subFlowMatch = internalSubBoard.subFlows.find(
      (fl) =>
        fl.id === selectedTelemetryId ||
        fl.telemetryEvent.id === selectedTelemetryId
    );
    if (subFlowMatch) {
      return tagTelemetryEventWithEnvironment(
        subFlowMatch.telemetryEvent,
        activeEnvironment
      );
    }
  }

  const scenarioMatch =
    scenario.telemetry.find((t) => t.id === selectedTelemetryId) || null;
  return scenarioMatch
    ? tagTelemetryEventWithEnvironment(scenarioMatch, activeEnvironment)
    : null;
}

/**
 * Builds the step-by-step guide model for the active Inspector scope.
 */
export function buildScopedStepGuideModel(
  scopeCtx: InspectorScopeContext,
  cinematicPhase: CinematicPhase = 'OVERVIEW'
): ScopedStepGuideModel {
  const scenarioGuide = buildDiagramStepGuideModel(
    scopeCtx.scenario,
    scopeCtx.activeStageIndex,
    cinematicPhase,
    scopeCtx.activeEnvironment
  );

  const filteredInternalSteps =
    scopeCtx.effectiveScope === 'INTERNAL_SUBNODE' && scopeCtx.selectedSubNode
      ? scopeCtx.internalSteps.filter((st) => st.isRelatedToSelectedSubNode)
      : scopeCtx.internalSteps;

  return {
    effectiveScope: scopeCtx.effectiveScope,
    scenarioGuide,
    internalSubBoard: scopeCtx.internalSubBoard,
    selectedSubNode: scopeCtx.selectedSubNode,
    internalSteps: filteredInternalSteps,
  };
}

/**
 * Builds the correlated SIEM / Sysmon log entries for the active Inspector scope.
 * When on the main scenario topology, returns the scenario's stage logs.
 * When inside an expanded node or selected internal sub-node, returns the
 * documented internal sub-board flow logs for that scope.
 */
export function buildScopedCorrelatedLogs(
  scopeCtx: InspectorScopeContext
): EnrichedStepLog[] {
  if (
    scopeCtx.effectiveScope === 'MAIN_SCENARIO' ||
    !scopeCtx.internalSubBoard
  ) {
    return buildCorrelatedStepLogs(
      scopeCtx.scenario,
      scopeCtx.activeStageIndex,
      scopeCtx.activeEnvironment
    );
  }

  const profile = getActiveEnvironmentProfile(scopeCtx.activeEnvironment);
  const targetFlows =
    scopeCtx.effectiveScope === 'INTERNAL_SUBNODE' &&
    scopeCtx.relatedSubFlows.length > 0
      ? scopeCtx.relatedSubFlows
      : scopeCtx.internalSubBoard.subFlows;

  return targetFlows.map((flow) => {
    const event = tagTelemetryEventWithEnvironment(
      flow.telemetryEvent,
      scopeCtx.activeEnvironment
    );
    const stageTitle = `#${flow.sequenceCode} · ${flow.label} (${flow.initiatorLabel} → ${flow.targetLabel})`;

    return {
      id: event.id,
      stageIndex: flow.stepNo,
      stageTitle,
      event,
      activeEnvironmentId: scopeCtx.activeEnvironment,
      environmentProfile: profile,
      environmentBadge: profile.badgeLabel,
      environmentTag: profile.telemetryTag,
      isActiveStep: flow.isCurrentStep,
      eventIds: extractEventIdsFromLog(event),
      correlatedRawLog: buildCorrelatedRawLog(event, scopeCtx.activeEnvironment),
    };
  });
}
