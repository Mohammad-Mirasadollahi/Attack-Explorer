import {
  AttackScenario,
  TelemetryEvent,
} from './attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
  TaggedTelemetryEvent,
  tagTelemetryEventWithEnvironment,
} from './simulation-engine';
import {
  buildInternalNodeSubBoard,
  buildWhiteboardSchematic,
  InternalSubBoardSchematic,
  NetworkZoneColumn,
  SketchIconType,
  WhiteboardSketchFlow,
  WhiteboardSketchNode,
} from './sketch-zones-and-drilldown';
import {
  buildDiagramStepGuideModel,
  DiagramStepGuideModel,
  getRawScenarioStepGuide,
  parseStructuredExplanationClauses,
  StructuredExplanationClause,
} from './scenario-step-guides';
import {
  buildCorrelatedRawLog,
  buildCorrelatedStepLogs,
  EnrichedStepLog,
  extractEventIdsFromLog,
} from './log-inspector-utils';
import { CinematicPhase } from './cinematic-camera-director';

export type InspectorScopeMode =
  | 'MAIN_SCENARIO'
  | 'EXPANDED_NODE'
  | 'INTERNAL_SUBNODE';

export interface ScopeBadgeMeta {
  mode: InspectorScopeMode;
  label: string;
  shortTag: string;
  themeColor: 'emerald' | 'amber' | 'rose';
}

export interface ScopedInternalStepGuideItem {
  stepNumber: number;
  sequenceCode: string;
  forwardSeq: string;
  returnSeq: string;
  title: string;
  mitreId: string;
  protocolOrEventId: string;
  forwardFlowBadge: string;
  returnFlowBadge: string;
  returnDescription: string;
  continuationHint?: string;
  storyAnalogy: string;
  explanation: string;
  fromSubNode: WhiteboardSketchNode | null;
  toSubNode: WhiteboardSketchNode | null;
  flow: WhiteboardSketchFlow;
  telemetryEvent: TaggedTelemetryEvent;
  isCurrentStep: boolean;
  isRelatedToSelectedSubNode: boolean;
}

export interface InspectorScopeContext {
  scenario: AttackScenario;
  activeStageIndex: number;
  activeEnvironment: ActiveEnvironmentId;
  diagramScope: InspectorScopeMode;
  effectiveScope: InspectorScopeMode;
  isScenarioOverrideActive: boolean;
  isInsideSubBoard: boolean;
  scopeBadgeText: string;
  diagramScopeBadgeText: string;
  scopeBadgeLabel: string;
  scopeTitle: string;
  scopeSubtitle: string;
  scopeBadgeMeta: ScopeBadgeMeta;
  whereAmISummary: string;
  subBoardStoryAnalogy: string | null;
  scopedStoryAnalogy: string;
  selectedMainNode: WhiteboardSketchNode | null;
  selectedMainNodeZone: NetworkZoneColumn | null;
  selectedMainNodeSubBoard: InternalSubBoardSchematic | null;
  selectedMainNodeStoryAnalogy: string | null;
  selectedMainNodeConnectedFlows: WhiteboardSketchFlow[];
  expandedNode: WhiteboardSketchNode | null;
  expandedParentNode: WhiteboardSketchNode | null;
  expandedNodeZone: NetworkZoneColumn | null;
  expandedParentNodeZone: NetworkZoneColumn | null;
  companionNode: WhiteboardSketchNode | null;
  internalSubBoard: InternalSubBoardSchematic | null;
  selectedSubNode: WhiteboardSketchNode | null;
  focusedInternalSubNode: WhiteboardSketchNode | null;
  selectedSubNodeZone: NetworkZoneColumn | null;
  focusedInternalSubNodeZone: NetworkZoneColumn | null;
  relatedMainFlows: WhiteboardSketchFlow[];
  relatedSubFlows: WhiteboardSketchFlow[];
  internalSteps: ScopedInternalStepGuideItem[];
  scopedTelemetryEvents: TaggedTelemetryEvent[];
  schematic: {
    zones: NetworkZoneColumn[];
    nodes: WhiteboardSketchNode[];
    flows: WhiteboardSketchFlow[];
  };
}

export interface ScopedStepGuideModel {
  effectiveScope: InspectorScopeMode;
  scenarioGuide: DiagramStepGuideModel;
  internalSteps: ScopedInternalStepGuideItem[];
}

export interface InspectorMiniMapConnectionArm {
  flow: WhiteboardSketchFlow;
  direction: 'INBOUND' | 'OUTBOUND' | 'ACTIVE_STAGE';
  neighborNode: WhiteboardSketchNode;
}

export interface InspectorMiniMapModel {
  mode:
    | 'INTERNAL_SUBNODE'
    | 'EXPANDED_NODE'
    | 'SELECTED_MAIN_NODE'
    | 'SELECTED_TELEMETRY'
    | 'MAIN_SCENARIO';
  boardTitle: string;
  boardSubtitle: string;
  stageBadge: string;
  activeZone: NetworkZoneColumn | null;
  primaryNode: WhiteboardSketchNode | null;
  focusedNodes: WhiteboardSketchNode[];
  focusedZones: NetworkZoneColumn[];
  connectionArms: InspectorMiniMapConnectionArm[];
  connectedNeighborNodes: WhiteboardSketchNode[];
  minimalBackgroundNodes: WhiteboardSketchNode[];
  minimalBackgroundZones: NetworkZoneColumn[];
  minimalBackgroundFlows: WhiteboardSketchFlow[];
  allZones: NetworkZoneColumn[];
  allNodes: WhiteboardSketchNode[];
  allFlows: WhiteboardSketchFlow[];
}

export function formatExpandedNodeScopeLabel(node: WhiteboardSketchNode): string {
  return `Expanded Node: #${node.chainOrder} ${node.label}`;
}

export function formatInternalSubNodeScopeLabel(
  subNode: WhiteboardSketchNode,
  parentNode: WhiteboardSketchNode
): string {
  const seq = subNode.sequenceCode
    ? `#${subNode.sequenceCode}`
    : `#${parentNode.chainOrder}.${subNode.chainOrder}`;
  return `Sub-Node: ${seq} ${subNode.label}`;
}

export function buildSubBoardStoryAnalogy(
  parentNode: WhiteboardSketchNode,
  subBoard: InternalSubBoardSchematic,
  selectedSubNode: WhiteboardSketchNode | null
): string {
  if (selectedSubNode) {
    return (
      `Inside "${parentNode.label}" (${parentNode.sublabel}), you are now inspecting internal component #${
        selectedSubNode.sequenceCode || selectedSubNode.chainOrder
      } "${selectedSubNode.label}" (${selectedSubNode.sublabel}). ` +
      `Think of "${parentNode.label}" as a secure office building on the main network map, and "${selectedSubNode.label}" as the specific internal operations room where ${selectedSubNode.internalSummary}`
    );
  }

  return (
    `Think of the main network topology as a city map showing which building was entered; this internal sub-board zooms inside "${parentNode.label}" (${parentNode.sublabel}) to reveal the room-by-room internal execution pipeline (${subBoard.subNodes.length} internal components and ${subBoard.subFlows.length} step-by-step transitions). ` +
    `${subBoard.architectureNote}`
  );
}

function buildInternalStepGuideItems(
  parentNode: WhiteboardSketchNode,
  subBoard: InternalSubBoardSchematic,
  selectedSubNode: WhiteboardSketchNode | null,
  activeEnvironment: ActiveEnvironmentId
): ScopedInternalStepGuideItem[] {
  const subNodeMap = new Map<string, WhiteboardSketchNode>(
    subBoard.subNodes.map((sn) => [sn.id, sn])
  );

  const filteredFlows = selectedSubNode
    ? subBoard.subFlows.filter(
        (fl) =>
          fl.fromNodeId === selectedSubNode.id ||
          fl.toNodeId === selectedSubNode.id
      )
    : subBoard.subFlows;

  const flowsToUse =
    filteredFlows.length > 0 ? filteredFlows : subBoard.subFlows;

  return flowsToUse.map((fl, idx) => {
    const fromSubNode = subNodeMap.get(fl.fromNodeId) || null;
    const toSubNode = subNodeMap.get(fl.toNodeId) || null;
    const taggedEv = tagTelemetryEventWithEnvironment(
      fl.telemetryEvent,
      activeEnvironment
    );

    const sequenceCode =
      fl.sequenceCode || `${parentNode.chainOrder}.${fl.stepNo}`;
    const forwardSeq = fl.forwardSeq || sequenceCode;
    const returnSeq = fl.returnSeq || sequenceCode;

    const fromLabel = fromSubNode?.label || fl.fromNodeId;
    const toLabel = toSubNode?.label || fl.toNodeId;

    const storyAnalogy =
      `Inside ${parentNode.label}, internal component "${fromLabel}" passes control or data (${fl.label}) directly to "${toLabel}". ` +
      `In plain terms: like an internal courier handing a work order from one department desk (${fromLabel}) to the next (${toLabel}) and receiving immediate confirmation (${fl.returnLabel || 'ACK'}).`;

    const returnOutcome =
      fl.traceMeta?.returnDescription ||
      `${toLabel} returns ${fl.returnLabel || 'execution status'} back to ${fromLabel}`;
    const explanation =
      `${fromLabel} (${fromSubNode?.sublabel || 'Source'}) invokes ${fl.label} toward ${toLabel} (${toSubNode?.sublabel || 'Target'}) over ${fl.telemetryEvent.protocolOrEventId} (${taggedEv.info}). ` +
      `In the return confirmation, ${toLabel} replies with ${fl.returnLabel || 'ACK'} (${returnOutcome.replace(/\.$/, '')}, allowing the next internal stage inside ${parentNode.label} to proceed).`;

    const isRelated = Boolean(
      selectedSubNode &&
        (fl.fromNodeId === selectedSubNode.id ||
          fl.toNodeId === selectedSubNode.id)
    );

    return {
      stepNumber: fl.stepNo,
      sequenceCode,
      forwardSeq,
      returnSeq,
      title: fl.label,
      mitreId: fl.telemetryEvent.mitreId,
      protocolOrEventId: fl.telemetryEvent.protocolOrEventId,
      forwardFlowBadge: `#${forwardSeq} ──▶ ${fl.label}`,
      returnFlowBadge: `◀── #${returnSeq} ${fl.returnLabel || 'Status / ACK'}`,
      returnDescription:
        fl.traceMeta?.returnDescription ||
        `${toLabel} returns execution status back to ${fromLabel}.`,
      continuationHint: fl.traceMeta?.continuationHint,
      storyAnalogy,
      explanation,
      fromSubNode,
      toSubNode,
      flow: fl,
      telemetryEvent: taggedEv,
      isCurrentStep: idx === 0 || isRelated,
      isRelatedToSelectedSubNode: isRelated,
    };
  });
}

export function resolveInspectorScopeContext({
  scenario,
  activeStageIndex,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  selectedNodeId,
  expandedNodeId,
  selectedInternalSubNodeId,
  scopeOverride = null,
}: {
  scenario: AttackScenario;
  activeStageIndex: number;
  activeEnvironment?: ActiveEnvironmentId;
  selectedNodeId: string | null;
  expandedNodeId: string | null;
  selectedInternalSubNodeId: string | null;
  scopeOverride?: InspectorScopeMode | null;
}): InspectorScopeContext {
  const schematic = buildWhiteboardSchematic(
    scenario,
    activeStageIndex,
    activeEnvironment
  );

  const selectedMainNode =
    schematic.nodes.find((n) => n.id === selectedNodeId) || null;
  const selectedMainNodeZone = selectedMainNode
    ? schematic.zones.find((z) => z.id === selectedMainNode.zoneId) || null
    : null;
  const selectedMainNodeConnectedFlows = selectedMainNode
    ? schematic.flows.filter(
        (fl) =>
          fl.fromNodeId === selectedMainNode.id ||
          fl.toNodeId === selectedMainNode.id
      )
    : [];
  const selectedMainNodeSubBoard = selectedMainNode
    ? buildInternalNodeSubBoard(
        scenario,
        selectedMainNode,
        schematic.flows,
        activeStageIndex
      )
    : null;
  const selectedMainNodeStoryAnalogy =
    selectedMainNode && selectedMainNodeSubBoard
      ? buildSubBoardStoryAnalogy(
          selectedMainNode,
          selectedMainNodeSubBoard,
          null
        )
      : null;

  const expandedNode =
    schematic.nodes.find((n) => n.id === expandedNodeId) || null;
  const expandedNodeZone = expandedNode
    ? schematic.zones.find((z) => z.id === expandedNode.zoneId) || null
    : null;

  const companionNode = expandedNode?.companionHostOrProcessNodeId
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

  const focusedInternalSubNode =
    selectedSubNode || internalSubBoard?.subNodes[0] || null;

  const selectedSubNodeZone =
    internalSubBoard && selectedSubNode
      ? internalSubBoard.zones.find((z) => z.id === selectedSubNode.zoneId) ||
        null
      : null;

  const focusedInternalSubNodeZone =
    selectedSubNodeZone ||
    (internalSubBoard && focusedInternalSubNode
      ? internalSubBoard.zones.find(
          (z) => z.id === focusedInternalSubNode.zoneId
        ) || null
      : null);

  const diagramScope: InspectorScopeMode = internalSubBoard
    ? selectedSubNode
      ? 'INTERNAL_SUBNODE'
      : 'EXPANDED_NODE'
    : 'MAIN_SCENARIO';

  const isScenarioOverrideActive =
    scopeOverride === 'MAIN_SCENARIO' && diagramScope !== 'MAIN_SCENARIO';

  const effectiveScope: InspectorScopeMode = isScenarioOverrideActive
    ? 'MAIN_SCENARIO'
    : scopeOverride && internalSubBoard
    ? scopeOverride
    : diagramScope;

  const diagramScopeBadgeText =
    diagramScope === 'INTERNAL_SUBNODE' && selectedSubNode && expandedNode
      ? formatInternalSubNodeScopeLabel(selectedSubNode, expandedNode)
      : diagramScope === 'EXPANDED_NODE' && expandedNode
      ? formatExpandedNodeScopeLabel(expandedNode)
      : 'Scenario';

  const scopeBadgeText =
    effectiveScope === 'INTERNAL_SUBNODE' && selectedSubNode && expandedNode
      ? formatInternalSubNodeScopeLabel(selectedSubNode, expandedNode)
      : effectiveScope === 'EXPANDED_NODE' && expandedNode
      ? formatExpandedNodeScopeLabel(expandedNode)
      : 'Scenario';

  const scopeBadgeMeta: ScopeBadgeMeta =
    effectiveScope === 'INTERNAL_SUBNODE'
      ? {
          mode: 'INTERNAL_SUBNODE',
          label: scopeBadgeText,
          shortTag: 'SUB-NODE',
          themeColor: 'rose',
        }
      : effectiveScope === 'EXPANDED_NODE'
      ? {
          mode: 'EXPANDED_NODE',
          label: scopeBadgeText,
          shortTag: 'EXPANDED',
          themeColor: 'amber',
        }
      : {
          mode: 'MAIN_SCENARIO',
          label: 'Scenario',
          shortTag: 'SCENARIO',
          themeColor: 'emerald',
        };

  const relatedMainFlows = expandedNode
    ? schematic.flows.filter(
        (fl) =>
          fl.fromNodeId === expandedNode.id || fl.toNodeId === expandedNode.id
      )
    : selectedMainNodeConnectedFlows;

  const relatedSubFlows = internalSubBoard
    ? effectiveScope === 'INTERNAL_SUBNODE' && selectedSubNode
      ? internalSubBoard.subFlows.filter(
          (fl) =>
            fl.fromNodeId === selectedSubNode.id ||
            fl.toNodeId === selectedSubNode.id
        )
      : internalSubBoard.subFlows
    : [];

  const internalSteps =
    internalSubBoard && expandedNode && effectiveScope !== 'MAIN_SCENARIO'
      ? buildInternalStepGuideItems(
          expandedNode,
          internalSubBoard,
          effectiveScope === 'INTERNAL_SUBNODE' ? selectedSubNode : null,
          activeEnvironment
        )
      : [];

  const scopedTelemetryEvents: TaggedTelemetryEvent[] =
    effectiveScope !== 'MAIN_SCENARIO' && internalSubBoard
      ? relatedSubFlows.map((fl) =>
          tagTelemetryEventWithEnvironment(fl.telemetryEvent, activeEnvironment)
        )
      : scenario.telemetry.map((ev) =>
          tagTelemetryEventWithEnvironment(ev, activeEnvironment)
        );

  const subBoardStoryAnalogy =
    effectiveScope !== 'MAIN_SCENARIO' && internalSubBoard && expandedNode
      ? buildSubBoardStoryAnalogy(
          expandedNode,
          internalSubBoard,
          effectiveScope === 'INTERNAL_SUBNODE' ? selectedSubNode : null
        )
      : null;

  const whereAmISummary =
    effectiveScope !== 'MAIN_SCENARIO' && internalSubBoard
      ? internalSubBoard.environmentBreadcrumb
      : selectedMainNode
      ? `${selectedMainNode.label} (${selectedMainNode.sublabel}) · ${
          selectedMainNodeZone?.title || selectedMainNode.zoneLabel || 'Topology'
        }`
      : `${scenario.code} · Full Attack Topology (${scenario.stages.length} Stages)`;

  const scopeBadgeLabel =
    effectiveScope === 'INTERNAL_SUBNODE' && selectedSubNode
      ? `SUB-NODE · ${selectedSubNode.actionBadge}`
      : effectiveScope === 'EXPANDED_NODE' && expandedNode
      ? `NODE #${expandedNode.chainOrder} · ${expandedNode.actionBadge}`
      : selectedMainNode
      ? `NODE #${selectedMainNode.chainOrder} · ${selectedMainNode.actionBadge}`
      : `SCENARIO · ${scenario.code}`;

  const scopeTitle =
    effectiveScope === 'INTERNAL_SUBNODE' && selectedSubNode
      ? selectedSubNode.label
      : effectiveScope === 'EXPANDED_NODE' && internalSubBoard
      ? internalSubBoard.title
      : selectedMainNode
      ? selectedMainNode.label
      : scenario.name;

  const scopeSubtitle = whereAmISummary;
  const mainBriefingStoryAnalogy = getRawScenarioStepGuide(
    scenario.id
  )?.briefing.storyAnalogy;
  const scopedStoryAnalogy =
    subBoardStoryAnalogy ||
    selectedMainNodeStoryAnalogy ||
    mainBriefingStoryAnalogy ||
    scenario.overview;

  return {
    scenario,
    activeStageIndex,
    activeEnvironment,
    diagramScope,
    effectiveScope,
    isScenarioOverrideActive,
    isInsideSubBoard: Boolean(internalSubBoard),
    scopeBadgeText,
    diagramScopeBadgeText,
    scopeBadgeLabel,
    scopeTitle,
    scopeSubtitle,
    scopeBadgeMeta,
    whereAmISummary,
    subBoardStoryAnalogy,
    scopedStoryAnalogy,
    selectedMainNode,
    selectedMainNodeZone,
    selectedMainNodeSubBoard,
    selectedMainNodeStoryAnalogy,
    selectedMainNodeConnectedFlows,
    expandedNode,
    expandedParentNode: expandedNode,
    expandedNodeZone,
    expandedParentNodeZone: expandedNodeZone,
    companionNode,
    internalSubBoard,
    selectedSubNode,
    focusedInternalSubNode,
    selectedSubNodeZone,
    focusedInternalSubNodeZone,
    relatedMainFlows,
    relatedSubFlows,
    internalSteps,
    scopedTelemetryEvents,
    schematic: {
      zones: schematic.zones,
      nodes: schematic.nodes,
      flows: schematic.flows,
    },
  };
}

export function resolveScopedTelemetrySelection({
  scenario,
  selectedTelemetryId,
  internalSubBoard,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
}: {
  scenario: AttackScenario;
  selectedTelemetryId: string | null;
  internalSubBoard: InternalSubBoardSchematic | null;
  activeEnvironment?: ActiveEnvironmentId;
}): TaggedTelemetryEvent | null {
  if (!selectedTelemetryId) return null;

  if (internalSubBoard) {
    const matchedSubFlow = internalSubBoard.subFlows.find(
      (fl) =>
        fl.id === selectedTelemetryId ||
        fl.telemetryEvent.id === selectedTelemetryId
    );
    if (matchedSubFlow) {
      return tagTelemetryEventWithEnvironment(
        matchedSubFlow.telemetryEvent,
        activeEnvironment
      );
    }
  }

  const mainEv = scenario.telemetry.find((t) => t.id === selectedTelemetryId);
  if (mainEv) {
    return tagTelemetryEventWithEnvironment(mainEv, activeEnvironment);
  }

  return null;
}

export function buildScopedStepGuideModel(
  scopeContext: InspectorScopeContext,
  cinematicPhase: CinematicPhase = 'OVERVIEW'
): ScopedStepGuideModel {
  const scenarioGuide = buildDiagramStepGuideModel(
    scopeContext.scenario,
    scopeContext.activeStageIndex,
    cinematicPhase,
    scopeContext.activeEnvironment
  );

  return {
    effectiveScope: scopeContext.effectiveScope,
    scenarioGuide,
    internalSteps: scopeContext.internalSteps,
  };
}

export function buildScopedCorrelatedLogs(
  scopeContext: InspectorScopeContext
): EnrichedStepLog[] {
  if (
    scopeContext.effectiveScope === 'MAIN_SCENARIO' ||
    !scopeContext.internalSubBoard ||
    !scopeContext.expandedNode
  ) {
    return buildCorrelatedStepLogs(
      scopeContext.scenario,
      scopeContext.activeStageIndex,
      scopeContext.activeEnvironment
    );
  }

  const profile = getActiveEnvironmentProfile(scopeContext.activeEnvironment);
  const parentNode = scopeContext.expandedNode;

  return scopeContext.relatedSubFlows.map((fl) => {
    const taggedEv = tagTelemetryEventWithEnvironment(
      fl.telemetryEvent,
      scopeContext.activeEnvironment
    );
    const seqCode =
      fl.sequenceCode || `${parentNode.chainOrder}.${fl.stepNo}`;
    return {
      id: taggedEv.id,
      stageIndex: fl.stepNo,
      stageTitle: `#${seqCode} · ${fl.label}`,
      event: taggedEv,
      activeEnvironmentId: scopeContext.activeEnvironment,
      environmentProfile: profile,
      environmentBadge: profile.badgeLabel,
      environmentTag: profile.telemetryTag,
      isActiveStep: true,
      eventIds: extractEventIdsFromLog(taggedEv),
      correlatedRawLog: buildCorrelatedRawLog(
        taggedEv,
        scopeContext.activeEnvironment
      ),
    };
  });
}

/**
 * Builds the deterministic miniature topological context map model for the top-left
 * corner of the Full-Screen Inspector Page.
 * - Shows the active Zone + Focused Node(s) in full scaled-down visual detail
 * - Shows connected flows and neighbor nodes in minimal connected style
 * - Shows the rest of the board's zones/nodes/flows in minimal wireframe silhouette style
 */
export function buildInspectorMiniMapModel(
  scopeContext: InspectorScopeContext,
  selectedTelemetry: TelemetryEvent | null = null,
  activeStageIndex: number = scopeContext.activeStageIndex,
  totalStages: number = scopeContext.scenario.stages.length
): InspectorMiniMapModel {
  const stageBadge =
    activeStageIndex > 0
      ? `STAGE S${activeStageIndex} / ${totalStages}`
      : `FULL TOPOLOGY (${totalStages} STAGES)`;

  // Case 1: Inside an expanded node sub-board (either INTERNAL_SUBNODE or EXPANDED_NODE)
  if (
    scopeContext.effectiveScope !== 'MAIN_SCENARIO' &&
    scopeContext.internalSubBoard &&
    scopeContext.expandedNode
  ) {
    const subBoard = scopeContext.internalSubBoard;
    const allZones = subBoard.zones;
    const allNodes = subBoard.subNodes;
    const allFlows = subBoard.subFlows;
    const nodeById = new Map(allNodes.map((n) => [n.id, n]));

    if (
      scopeContext.effectiveScope === 'INTERNAL_SUBNODE' &&
      scopeContext.selectedSubNode
    ) {
      const primaryNode = scopeContext.selectedSubNode;
      const activeZone =
        allZones.find((z) => z.id === primaryNode.zoneId) ||
        allZones[0] ||
        null;
      const connectedFlows = allFlows.filter(
        (fl) => fl.fromNodeId === primaryNode.id || fl.toNodeId === primaryNode.id
      );
      const connectionArms: InspectorMiniMapConnectionArm[] = [];
      const neighborSet = new Set<string>();

      for (const fl of connectedFlows) {
        const isOutbound = fl.fromNodeId === primaryNode.id;
        const neighborId = isOutbound ? fl.toNodeId : fl.fromNodeId;
        const neighborNode = nodeById.get(neighborId);
        if (neighborNode) {
          neighborSet.add(neighborNode.id);
          connectionArms.push({
            flow: fl,
            direction: isOutbound ? 'OUTBOUND' : 'INBOUND',
            neighborNode,
          });
        }
      }

      const connectedNeighborNodes = allNodes.filter((n) =>
        neighborSet.has(n.id)
      );
      const minimalBackgroundNodes = allNodes.filter(
        (n) => n.id !== primaryNode.id && !neighborSet.has(n.id)
      );
      const minimalBackgroundZones = allZones.filter(
        (z) => z.id !== activeZone?.id
      );
      const connectedFlowIds = new Set(connectedFlows.map((f) => f.id));
      const minimalBackgroundFlows = allFlows.filter(
        (f) => !connectedFlowIds.has(f.id)
      );

      return {
        mode: 'INTERNAL_SUBNODE',
        boardTitle: `${scopeContext.expandedNode.label} · Internal Pipeline`,
        boardSubtitle: `${primaryNode.label} (${primaryNode.sublabel})`,
        stageBadge,
        activeZone,
        primaryNode,
        focusedNodes: [primaryNode],
        focusedZones: activeZone ? [activeZone] : [],
        connectionArms,
        connectedNeighborNodes,
        minimalBackgroundNodes,
        minimalBackgroundZones,
        minimalBackgroundFlows,
        allZones,
        allNodes,
        allFlows,
      };
    }

    // EXPANDED_NODE mode
    const primaryNode =
      scopeContext.focusedInternalSubNode || allNodes[0] || null;
    const activeZone =
      (primaryNode && allZones.find((z) => z.id === primaryNode.zoneId)) ||
      allZones[0] ||
      null;
    const connectionArms: InspectorMiniMapConnectionArm[] = [];
    for (const fl of allFlows) {
      const dst = nodeById.get(fl.toNodeId) || allNodes[0];
      if (dst) {
        connectionArms.push({
          flow: fl,
          direction: 'OUTBOUND',
          neighborNode: dst,
        });
      }
    }

    return {
      mode: 'EXPANDED_NODE',
      boardTitle: subBoard.title,
      boardSubtitle: subBoard.environmentBreadcrumb,
      stageBadge,
      activeZone,
      primaryNode: scopeContext.expandedNode,
      focusedNodes: primaryNode ? [primaryNode] : allNodes.slice(0, 2),
      focusedZones: activeZone ? [activeZone] : allZones.slice(0, 1),
      connectionArms,
      connectedNeighborNodes: allNodes.filter((n) => n.id !== primaryNode?.id),
      minimalBackgroundNodes: [],
      minimalBackgroundZones: allZones.filter((z) => z.id !== activeZone?.id),
      minimalBackgroundFlows: [],
      allZones,
      allNodes,
      allFlows,
    };
  }

  // Main topology board
  const { zones: allZones, nodes: allNodes, flows: allFlows } =
    scopeContext.schematic;
  const nodeById = new Map(allNodes.map((n) => [n.id, n]));

  // Case 2: A specific Main Node was clicked (`selectedMainNode`)
  if (scopeContext.selectedMainNode) {
    const primaryNode = scopeContext.selectedMainNode;
    const activeZone =
      scopeContext.selectedMainNodeZone ||
      allZones.find((z) => z.id === primaryNode.zoneId) ||
      null;

    const connectedFlows = allFlows.filter(
      (fl) => fl.fromNodeId === primaryNode.id || fl.toNodeId === primaryNode.id
    );
    const connectionArms: InspectorMiniMapConnectionArm[] = [];
    const neighborIds = new Set<string>();

    for (const fl of connectedFlows) {
      const isOutbound = fl.fromNodeId === primaryNode.id;
      const neighborId = isOutbound ? fl.toNodeId : fl.fromNodeId;
      const neighborNode = nodeById.get(neighborId);
      if (neighborNode && neighborNode.id !== primaryNode.id) {
        neighborIds.add(neighborNode.id);
        connectionArms.push({
          flow: fl,
          direction: isOutbound ? 'OUTBOUND' : 'INBOUND',
          neighborNode,
        });
      }
    }

    const connectedNeighborNodes = allNodes.filter((n) =>
      neighborIds.has(n.id)
    );
    const minimalBackgroundNodes = allNodes.filter(
      (n) => n.id !== primaryNode.id && !neighborIds.has(n.id)
    );
    const minimalBackgroundZones = allZones.filter(
      (z) => z.id !== activeZone?.id
    );
    const connectedFlowIdSet = new Set(connectedFlows.map((f) => f.id));
    const minimalBackgroundFlows = allFlows.filter(
      (f) => !connectedFlowIdSet.has(f.id)
    );

    return {
      mode: 'SELECTED_MAIN_NODE',
      boardTitle: `${primaryNode.label} (${primaryNode.sublabel})`,
      boardSubtitle: activeZone
        ? `${activeZone.code} · ${activeZone.title}`
        : primaryNode.zoneLabel || 'Network Topology',
      stageBadge,
      activeZone,
      primaryNode,
      focusedNodes: [primaryNode],
      focusedZones: activeZone ? [activeZone] : [],
      connectionArms,
      connectedNeighborNodes,
      minimalBackgroundNodes,
      minimalBackgroundZones,
      minimalBackgroundFlows,
      allZones,
      allNodes,
      allFlows,
    };
  }

  // Case 3: A specific Telemetry Packet / Flow is selected
  if (selectedTelemetry) {
    const matchedFlow = allFlows.find(
      (f) =>
        f.telemetryEvent.id === selectedTelemetry.id ||
        f.id === selectedTelemetry.id
    );
    const srcNode = matchedFlow
      ? nodeById.get(matchedFlow.fromNodeId) || null
      : allNodes.find((n) => n.id === selectedTelemetry.sourceNodeId) || null;
    const dstNode = matchedFlow
      ? nodeById.get(matchedFlow.toNodeId) || null
      : allNodes.find((n) => n.id === selectedTelemetry.targetNodeId) || null;
    const primaryNode = srcNode || dstNode || allNodes[0] || null;
    const activeZone = primaryNode
      ? allZones.find((z) => z.id === primaryNode.zoneId) || null
      : allZones[0] || null;

    const focusedIds = new Set(
      [srcNode?.id, dstNode?.id].filter((id): id is string => Boolean(id))
    );
    const connectionArms: InspectorMiniMapConnectionArm[] =
      matchedFlow && dstNode
        ? [
            {
              flow: matchedFlow,
              direction: 'OUTBOUND',
              neighborNode: dstNode,
            },
          ]
        : [];

    return {
      mode: 'SELECTED_TELEMETRY',
      boardTitle: `${selectedTelemetry.protocolOrEventId} · ${
        srcNode?.label || selectedTelemetry.sourceLabel || selectedTelemetry.sourceNodeId
      } → ${dstNode?.label || selectedTelemetry.targetLabel || selectedTelemetry.targetNodeId}`,
      boardSubtitle: selectedTelemetry.info,
      stageBadge,
      activeZone,
      primaryNode,
      focusedNodes: allNodes.filter((n) => focusedIds.has(n.id)),
      focusedZones: activeZone ? [activeZone] : [],
      connectionArms,
      connectedNeighborNodes:
        dstNode && dstNode.id !== srcNode?.id ? [dstNode] : [],
      minimalBackgroundNodes: allNodes.filter((n) => !focusedIds.has(n.id)),
      minimalBackgroundZones: allZones.filter((z) => z.id !== activeZone?.id),
      minimalBackgroundFlows: allFlows.filter((f) => f.id !== matchedFlow?.id),
      allZones,
      allNodes,
      allFlows,
    };
  }

  // Case 4: Full Main Scenario Overview (or active stage on main page)
  const activeStageFlows =
    activeStageIndex > 0
      ? allFlows.filter((f) => f.stageIndex === activeStageIndex)
      : allFlows;
  const activeNodeIds = new Set<string>();
  for (const fl of activeStageFlows) {
    activeNodeIds.add(fl.fromNodeId);
    activeNodeIds.add(fl.toNodeId);
  }
  const focusedNodes =
    activeStageIndex > 0 && activeNodeIds.size > 0
      ? allNodes.filter((n) => activeNodeIds.has(n.id))
      : allNodes.slice(0, 2);
  const primaryNode = focusedNodes[0] || allNodes[0] || null;
  const focusedZoneIds = new Set(focusedNodes.map((n) => n.zoneId));
  const focusedZones = allZones.filter((z) => focusedZoneIds.has(z.id));
  const activeZone = focusedZones[0] || allZones[0] || null;

  const focusedIdSet = new Set(focusedNodes.map((n) => n.id));
  const connectedFlows = allFlows.filter(
    (fl) => focusedIdSet.has(fl.fromNodeId) || focusedIdSet.has(fl.toNodeId)
  );
  const neighborIds = new Set<string>();
  const connectionArms: InspectorMiniMapConnectionArm[] = [];
  for (const fl of connectedFlows) {
    const dst = nodeById.get(fl.toNodeId);
    const src = nodeById.get(fl.fromNodeId);
    const neighbor =
      dst && !focusedIdSet.has(dst.id)
        ? dst
        : src && !focusedIdSet.has(src.id)
        ? src
        : dst || src;
    if (neighbor) {
      if (!focusedIdSet.has(neighbor.id)) {
        neighborIds.add(neighbor.id);
      }
      connectionArms.push({
        flow: fl,
        direction: 'ACTIVE_STAGE',
        neighborNode: neighbor,
      });
    }
  }

  return {
    mode: 'MAIN_SCENARIO',
    boardTitle: scopeContext.scopeTitle,
    boardSubtitle: scopeContext.scopeSubtitle,
    stageBadge,
    activeZone,
    primaryNode,
    focusedNodes,
    focusedZones,
    connectionArms,
    connectedNeighborNodes: allNodes.filter((n) => neighborIds.has(n.id)),
    minimalBackgroundNodes: allNodes.filter(
      (n) => !focusedIdSet.has(n.id) && !neighborIds.has(n.id)
    ),
    minimalBackgroundZones: allZones.filter((z) => !focusedZoneIds.has(z.id)),
    minimalBackgroundFlows: allFlows.filter(
      (fl) => !focusedIdSet.has(fl.fromNodeId) && !focusedIdSet.has(fl.toNodeId)
    ),
    allZones,
    allNodes,
    allFlows,
  };
}

export type ScenarioProcessEntry = AttackScenario['processTree'][number];
export type ScenarioMemoryBlock = NonNullable<
  ScenarioProcessEntry['memoryBlocks']
>[number];

export interface ScopedMemoryStepItem {
  stepNumber: number;
  stepCode: string;
  stageIndex: number;
  stageTitle: string;
  processPid: number;
  processPpid: number;
  processName: string;
  processStatus: ScenarioProcessEntry['status'];
  processIntegrity: string;
  operationOrApi: string;
  operationWhyNote: string;
  targetAddress: string;
  targetSection: string;
  permissions: string;
  regionSize: string;
  regionStatus: string;
  stepActionSummary: string;
  whyExplanation: string;
  detectionEvidence: string;
}

export type MemoryFlowchartPhaseId =
  | 'MEMORY_DUMP'
  | 'STRING_ANALYSIS'
  | 'FORENSIC_EXTRACTION';

export interface MemoryFlowchartPhaseNode {
  phaseId: MemoryFlowchartPhaseId;
  phaseOrder: 1 | 2 | 3;
  phaseCode: string;
  phaseTitle: string;
  badgeLabel: string;
  iconKind: MemoryFlowchartPhaseId;
  primaryArtifact: string;
  secondarySpec: string;
  whyAnnotation: string;
}

export interface MemoryFlowchartStepRow {
  stepNumber: number;
  stepCode: string;
  stageIndex: number;
  stageTitle: string;
  processName: string;
  processPid: number;
  targetAddress: string;
  targetSection: string;
  permissions: string;
  regionSize: string;
  regionStatus: string;
  stepHeadline: string;
  stepWhySummary: string;
  phases: [
    MemoryFlowchartPhaseNode,
    MemoryFlowchartPhaseNode,
    MemoryFlowchartPhaseNode,
  ];
}

export interface MemoryForensicsFlowchartModel {
  totalSteps: number;
  summaryPhases: Array<{
    phaseId: MemoryFlowchartPhaseId;
    phaseOrder: 1 | 2 | 3;
    title: string;
    subtitle: string;
    iconKind: MemoryFlowchartPhaseId;
    whyPhaseMatters: string;
    artifactCountLabel: string;
  }>;
  stepRows: MemoryFlowchartStepRow[];
}

export interface ScopedMemoryForensicsModel {
  hasDocumentedMemory: boolean;
  scopeExplanation: string;
  structuredScopeClauses: StructuredExplanationClause[];
  memoryProcesses: ScenarioProcessEntry[];
  memoryStepTimeline: ScopedMemoryStepItem[];
  flowchart: MemoryForensicsFlowchartModel;
  memoryBlocks: Array<
    ScenarioMemoryBlock & {
      stepNumber: number;
      stepCode: string;
      stageIndex: number;
      stageTitle: string;
      correlatedApiCall: string;
      processId: string;
      processName: string;
      processPid: number;
      addressWhyNote: string;
      permissionsWhyNote: string;
      hexWhyNote: string;
      structuredClauses: StructuredExplanationClause[];
    }
  >;
  relatedProcessTree: Array<
    ScenarioProcessEntry & {
      processStepNumber: number;
      processStepCode: string;
      statusWhyNote: string;
      commandLineWhyNote: string;
      apiCallsWithWhy: string[];
      structuredApiSteps: Array<{
        stepCode: string;
        apiSignature: string;
        whyNote: string;
        fullText: string;
      }>;
    }
  >;
}

function buildMemoryBlockAddressWhyNote(
  mb: ScenarioMemoryBlock,
  proc: ScenarioProcessEntry
): string {
  const addr = mb.address || '';
  const sec = mb.section || '';
  if (/0x00400000/i.test(addr) || /PE Header/i.test(sec)) {
    return `(why ${addr} · ${sec}: default Windows PE ImageBaseAddress recorded in PEB+0x10 — reusing this exact base address after unmapping the original binary allows the injected executable to run without recalculating internal relocation offsets)`;
  }
  if (/0x00401000/i.test(addr) || (/\.text/i.test(sec) && !/ntdll|amsi|liblzma/i.test(sec))) {
    return `(why ${addr} · ${sec}: standard RVA +0x1000 executable code section offset immediately following the 4 KB PE header, where unpacked CPU instructions are mapped in RAM)`;
  }
  if (/amsi\.dll/i.test(sec)) {
    return `(why ${addr} · ${sec}: user-mode Antimalware Scan Interface code mapped inside ${proc.name} PID ${proc.pid}’s own virtual address space, allowing the process to overwrite AmsiScanBuffer in RAM without kernel privileges)`;
  }
  if (/ntdll\.dll/i.test(sec)) {
    return `(why ${addr} · ${sec}: high 64-bit user-mode address where Windows maps ntdll.dll into every process to bridge user-mode API calls into kernel syscalls)`;
  }
  if (/^0xFFFF/i.test(addr) || /NonPagedPool|Kernel/i.test(sec)) {
    return `(why ${addr} · ${sec}: ring-0 Windows kernel NonPagedPool address space that stays permanently resident in physical RAM and never pages out to disk)`;
  }
  if (/Heap|Private|Reflective/i.test(sec)) {
    return `(why ${addr} · ${sec}: dynamically allocated private heap region [MEM_PRIVATE] in ${proc.name} PID ${proc.pid} that has no backing .dll or .exe file on the hard drive)`;
  }
  return `(why ${addr} · ${sec}: virtual memory region inside ${proc.name} [PID ${proc.pid}] targeted to hold ${mb.status} code or state data directly in volatile RAM)`;
}

function buildMemoryBlockPermissionsWhyNote(
  mb: ScenarioMemoryBlock,
  proc: ScenarioProcessEntry
): string {
  const perms = mb.permissions;
  const status = mb.status;
  if (perms === 'RWX') {
    return `(why RWX [${mb.size}] · ${status}: normal compiled binaries enforce W^X [Write XOR Execute] so memory is never writable and executable at the same time, whereas the loader in ${proc.name} requested PAGE_EXECUTE_READWRITE [0x40] so it could write ${status} bytes into RAM and immediately execute them in place)`;
  }
  if (perms === 'RW-') {
    return `(why RW- [${mb.size}] · ${status}: PAGE_READWRITE [0x04] allows ${proc.name} to overwrite or stage headers, configuration structures, or credential state in RAM without triggering executable-page alerts)`;
  }
  if (perms === 'R-X' && (status === 'patched' || status === 'injected' || status === 'shellcode')) {
    return `(why R-X [${mb.size}] · ${status}: memory protection restored to PAGE_EXECUTE_READ [0x20] after writing/patching bytes in RAM [creating a private Copy-on-Write VAD page] so CPU instructions can run while evading simple RWX scanners)`;
  }
  return `(why ${perms} [${mb.size}] · ${status}: standard image-backed Read-Execute code protection mapped from the signed system binary on disk)`;
}

function buildMemoryBlockHexWhyNote(
  mb: ScenarioMemoryBlock,
  proc: ScenarioProcessEntry
): string {
  const hex = mb.hexPreview || '';
  if (/4D 5A/i.test(hex)) {
    return `(why these hex bytes: "4D 5A" is the ASCII "MZ" DOS/PE executable header — finding "MZ" inside private or hollowed memory in ${proc.name} [PID ${proc.pid}] proves a full Windows PE binary was injected directly into RAM without using the OS file loader)`;
  }
  if (/FC 48 83 E4 F0/i.test(hex)) {
    return `(why these hex bytes: "FC 48 83 E4 F0 E8 C0 00 00 00" is the x64 position-independent shellcode prologue [cld; and rsp, -16; call +0xC0] that aligns the 64-bit stack frame and locates exported APIs in RAM)`;
  }
  if (/B8 57 00 07 80 C3/i.test(hex)) {
    return `(why these hex bytes: "B8 57 00 07 80 C3" disassembles to "mov eax, 0x80070057; ret" — forcing AmsiScanBuffer to immediately return E_INVALIDARG so Windows Defender never scans the in-memory payload)`;
  }
  if (/4C 8B D1 B8/i.test(hex)) {
    return `(why these hex bytes: "4C 8B D1 B8..." disassembles to "mov r10, rcx; mov eax, <SSN>" — the standard x64 Windows ntdll.dll syscall stub that transitions execution from user mode into the kernel)`;
  }
  if (/7F 45 4C 46/i.test(hex)) {
    return `(why these hex bytes: "7F 45 4C 46" is the "\\x7fELF" 64-bit Linux/ESXi executable header mapped directly into memory)`;
  }
  if (/CF FA ED FE/i.test(hex)) {
    return `(why these hex bytes: "CF FA ED FE" is the 64-bit Mach-O executable magic header loaded directly into memory without an on-disk application bundle)`;
  }
  return `(why these hex bytes: raw in-memory byte signature captured from ${mb.address} [${mb.section}] confirming ${mb.status} state inside ${proc.name} PID ${proc.pid})`;
}

function enrichMemoryBlockDescriptionWithWhy(
  mb: ScenarioMemoryBlock,
  proc: ScenarioProcessEntry
): string {
  const desc = mb.description || '';
  if (/\(why\b/i.test(desc)) {
    return desc;
  }
  if (mb.permissions === 'RWX') {
    return `${desc} (why this region became RWX & ${mb.status}: ${proc.name} [PID ${proc.pid}] allocated or modified ${mb.size} at ${mb.address} with simultaneous Read-Write-Execute permissions so unpacked code could be written and executed directly in RAM without dropping a binary to disk, leaving an unbacked private VAD entry that PE-sieve and EDR memory scanners flag).`;
  }
  if (mb.status === 'patched') {
    return `${desc} (why this region became patched in RAM: modifying code or state bytes inside ${mb.section} at ${mb.address} alters runtime behavior inside ${proc.name} [PID ${proc.pid}] while leaving the original file on disk untouched, triggering a Copy-on-Write private page split in the process VAD tree).`;
  }
  if (mb.status === 'injected' || mb.status === 'shellcode' || mb.status === 'unmapped') {
    return `${desc} (why this region became ${mb.status} at ${mb.address}: staging ${mb.section} [${mb.size}, ${mb.permissions}] directly inside ${proc.name} [PID ${proc.pid}] lets the payload execute under a trusted process identity in RAM while bypassing on-disk file signature checks).`;
  }
  return `${desc} (why this region is tracked in memory forensics: ${mb.section} at ${mb.address} [${mb.permissions}, ${mb.size}] provides the runtime system or syscall context inside ${proc.name} [PID ${proc.pid}]).`;
}

export function buildProcessStatusWhyNote(proc: ScenarioProcessEntry): string {
  if (proc.status === 'hollowed') {
    return `(why hollowed · ${proc.integrity}: ${proc.name} [PID ${proc.pid}] was spawned from a genuine signed binary in a suspended state and its original code pages were unmapped and replaced in RAM so the implant inherits a trusted process identity)`;
  }
  if (proc.status === 'injected') {
    return `(why injected · ${proc.integrity}: legitimate host process ${proc.name} [PID ${proc.pid}] had foreign code or patched bytes written into its virtual memory space so the attacker can run code under ${proc.integrity} integrity without launching an untrusted .exe)`;
  }
  if (proc.status === 'malicious') {
    return `(why malicious · ${proc.integrity}: stage-1 loader or exploit process [PID ${proc.pid}, PPID ${proc.ppid}] that initiates the memory allocation, unhooking, or cross-process injection chain)`;
  }
  return `(why normal · ${proc.integrity}: baseline host or service process [PID ${proc.pid}] providing the parent execution context)`;
}

export function buildProcessCommandLineWhyNote(
  proc: ScenarioProcessEntry
): string {
  const cmd = proc.commandLine || '';
  if (/svchost\.exe$/i.test(cmd.trim())) {
    return `(why this command line is suspicious: legitimate svchost.exe instances are always spawned by services.exe with a "-k <ServiceGroup>" flag — a bare svchost.exe path with PPID ${proc.ppid} proves a user-mode loader launched it as a hollow container)`;
  }
  if (/-w\s+hidden|-nop|-enc|-exec\s+bypass/i.test(cmd)) {
    return `(why these flags are used: "-NoP -W Hidden -Exec Bypass" suppresses the PowerShell console window, skips profile scripts, and bypasses execution policy so the in-memory stager runs silently)`;
  }
  if (/Downloads|Temp|Public|AppData/i.test(cmd)) {
    return `(why this path matters: executing a binary from a user-writable directory [${cmd}] instead of System32 or Program Files indicates an initial stage-1 dropper or sideloaded launcher)`;
  }
  return `(why this command line matters: process invocation parameters recorded in Sysmon Event ID 1 / auditd for ${proc.name} [PID ${proc.pid}, PPID ${proc.ppid}] establishing the execution lineage)`;
}

export function formatApiCallWithWhy(
  apiCall: string,
  proc: ScenarioProcessEntry
): string {
  if (/\(why:/i.test(apiCall)) return apiCall;
  if (/CreateProcess.*SUSPENDED/i.test(apiCall)) {
    return `${apiCall} (why: spawns the legitimate target binary frozen at thread creation [0x4] before its first instruction runs so its memory can be hollowed out safely)`;
  }
  if (/NtUnmapViewOfSection/i.test(apiCall)) {
    return `${apiCall} (why: unmaps the original signed Microsoft code from the PEB ImageBaseAddress [0x00400000] to leave an empty virtual memory slot for the implant)`;
  }
  if (/VirtualAllocEx/i.test(apiCall)) {
    return `${apiCall} (why: reserves cross-process private RAM with RWX [0x40] permissions inside the target process so unpacked payload sections can be written and executed)`;
  }
  if (/WriteProcessMemory/i.test(apiCall)) {
    return `${apiCall} (why: copies the injected MZ/PE headers and .text shellcode bytes across process boundaries directly into the target’s newly allocated virtual memory)`;
  }
  if (/SetThreadContext/i.test(apiCall)) {
    return `${apiCall} (why: overwrites the suspended thread’s CPU entry register [RCX / RIP] so execution jumps straight to the injected payload entry point)`;
  }
  if (/ResumeThread/i.test(apiCall)) {
    return `${apiCall} (why: decrements the thread suspend counter from 1 to 0, waking up the hollowed process so it executes the injected code)`;
  }
  if (/VirtualProtect/i.test(apiCall)) {
    return `${apiCall} (why: flips memory page permissions in place [e.g. R-X → RWX → R-X] so read-only code pages like amsi.dll or ntdll.dll can be overwritten in RAM)`;
  }
  if (/GetProcAddress|LoadLibrary/i.test(apiCall)) {
    return `${apiCall} (why: dynamically resolves the exact in-memory virtual address of the target DLL export at runtime so the loader knows which byte offset to patch or call)`;
  }
  if (/Marshal\.Copy|RtlMoveMemory|memcpy/i.test(apiCall)) {
    return `${apiCall} (why: writes raw patch or shellcode bytes directly into the target virtual memory address inside the current process)`;
  }
  if (/Assembly.*Load|ReflectiveLoader/i.test(apiCall)) {
    return `${apiCall} (why: maps and executes a compiled DLL/assembly directly from a byte array in RAM without ever creating a file on disk)`;
  }
  if (/WinHttp|WSA|connect|socket|curl/i.test(apiCall)) {
    return `${apiCall} (why: opens the outbound network/C2 channel from inside ${proc.name} [PID ${proc.pid}] so perimeter and host firewalls see traffic coming from a trusted process)`;
  }
  return `${apiCall} (why: invoked by ${proc.name} [PID ${proc.pid}] to advance in-memory execution or state manipulation without dropping extra tools to disk)`;
}

function splitApiCallAndWhy(formattedApi: string): {
  apiSignature: string;
  whyNote: string;
} {
  const idx = formattedApi.indexOf('(why:');
  if (idx === -1) {
    return {
      apiSignature: formattedApi.trim(),
      whyNote: '(why: invoked to execute in-memory state transition)',
    };
  }
  return {
    apiSignature: formattedApi.slice(0, idx).trim(),
    whyNote: formattedApi.slice(idx).trim(),
  };
}

const MEMORY_DOC_REGEX =
  /\b(memory|ram|vad|rwx|page_execute|peb|unmap|ntunmapviewofsection|virtualalloc|virtualprotect|writeprocessmemory|0x[0-9a-f]{4,}|heap|buffer|section|shellcode|inject|hollow|amsi|pe header|mz header|image is replaced|processtampering|etwti)\b/i;

function isNonMemoryInfrastructureNode(
  node: WhiteboardSketchNode | null | undefined
): boolean {
  if (!node) return false;
  if (
    node.id === 'malware_sandbox_node' ||
    node.archetype === 'MALWARE_PROCESSES' ||
    node.iconType === 'MALWARE_PAYLOAD' ||
    node.iconType === 'KERNEL_MEMORY' ||
    node.iconType === 'PROCESS_THREAD' ||
    node.originalNode?.role === 'process' ||
    node.originalNode?.role === 'memory'
  ) {
    return false;
  }
  if (node.isNetworkDevice) return true;
  if (
    node.iconType === 'SIEM_SENSOR' ||
    node.iconType === 'FIREWALL_ROUTER' ||
    node.iconType === 'CORE_SWITCH' ||
    node.iconType === 'WAF_REVERSE_PROXY' ||
    node.iconType === 'DNS_RESOLVER' ||
    node.iconType === 'PHISHING_GATEWAY' ||
    node.iconType === 'ATTACKER'
  ) {
    return true;
  }
  const origRole = node.originalNode?.role;
  if (
    origRole === 'attacker' ||
    origRole === 'firewall_siem' ||
    origRole === 'dns_resolver' ||
    origRole === 'domain_controller'
  ) {
    return true;
  }
  return false;
}

/**
 * Determines whether the currently active Inspector target/scope has documented
 * virtual memory forensics (`memoryBlocks`) in the scenario specification AND
 * whether the current section/node/stage's documented explanation actually involves memory.
 * Never fabricates or invents memory blocks when none exist in the scenario documentation.
 */
const EMPTY_MEMORY_FLOWCHART: MemoryForensicsFlowchartModel = {
  totalSteps: 0,
  summaryPhases: [],
  stepRows: [],
};

export function resolveScopedMemoryForensics(
  scopeContext: InspectorScopeContext,
  selectedTelemetry: TelemetryEvent | null = null
): ScopedMemoryForensicsModel {
  const { scenario, effectiveScope, activeStageIndex } = scopeContext;
  const allMemoryProcesses = (scenario.processTree || []).filter(
    (proc) => Array.isArray(proc.memoryBlocks) && proc.memoryBlocks.length > 0
  );

  // Rule 1: If the scenario itself has no documented memoryBlocks, never invent any.
  if (allMemoryProcesses.length === 0) {
    return {
      hasDocumentedMemory: false,
      scopeExplanation: '',
      structuredScopeClauses: [],
      memoryProcesses: [],
      memoryStepTimeline: [],
      flowchart: EMPTY_MEMORY_FLOWCHART,
      memoryBlocks: [],
      relatedProcessTree: [],
    };
  }

  let isMemoryRelevantInCurrentSection = false;
  let scopeExplanation = '';

  // Case A: A specific telemetry packet/event is selected
  if (selectedTelemetry) {
    const telemetryText = [
      selectedTelemetry.sourceType,
      selectedTelemetry.protocolOrEventId,
      selectedTelemetry.shortAction || '',
      selectedTelemetry.info,
      selectedTelemetry.explanation || '',
      selectedTelemetry.rawLog || '',
    ].join(' ');
    isMemoryRelevantInCurrentSection =
      selectedTelemetry.sourceType === 'MEMORY_SCAN' ||
      MEMORY_DOC_REGEX.test(telemetryText);
    if (isMemoryRelevantInCurrentSection) {
      scopeExplanation = `Documented virtual memory regions (VAD) correlated with selected telemetry event ${selectedTelemetry.protocolOrEventId} (${selectedTelemetry.shortAction || selectedTelemetry.info}).`;
    }
  }
  // Case B: Inside an expanded node's internal sub-node
  else if (
    effectiveScope === 'INTERNAL_SUBNODE' &&
    scopeContext.selectedSubNode &&
    scopeContext.expandedNode
  ) {
    const parentNode = scopeContext.expandedNode;
    const subNode = scopeContext.selectedSubNode;
    if (
      !isNonMemoryInfrastructureNode(parentNode) &&
      !isNonMemoryInfrastructureNode(subNode) &&
      subNode.iconType !== 'PACKET_ENGINE'
    ) {
      const subNodeDocText = [
        subNode.label,
        subNode.sublabel,
        subNode.internalSummary,
        subNode.activitySummary,
        ...scopeContext.relatedSubFlows.map(
          (f) =>
            `${f.label} ${f.telemetryEvent.protocolOrEventId} ${f.telemetryEvent.info}`
        ),
      ].join(' ');
      isMemoryRelevantInCurrentSection =
        subNode.iconType === 'KERNEL_MEMORY' ||
        MEMORY_DOC_REGEX.test(subNodeDocText);
      if (isMemoryRelevantInCurrentSection) {
        scopeExplanation = `Documented virtual memory layout (VAD) for internal component "${subNode.label}" (${subNode.sublabel}) inside ${parentNode.label}.`;
      }
    }
  }
  // Case C: Inside an expanded node sub-board
  else if (effectiveScope === 'EXPANDED_NODE' && scopeContext.expandedNode) {
    const expNode = scopeContext.expandedNode;
    if (!isNonMemoryInfrastructureNode(expNode)) {
      const expDocText = [
        expNode.label,
        expNode.sublabel,
        expNode.activitySummary,
        expNode.internalSummary,
        expNode.originalNode?.details?.description || '',
        ...(expNode.originalNode?.details?.artifacts || []),
        ...(scopeContext.internalSubBoard?.subNodes || []).map(
          (sn) => `${sn.label} ${sn.internalSummary}`
        ),
      ].join(' ');
      isMemoryRelevantInCurrentSection =
        expNode.iconType === 'KERNEL_MEMORY' ||
        expNode.originalNode?.role === 'memory' ||
        MEMORY_DOC_REGEX.test(expDocText);
      if (isMemoryRelevantInCurrentSection) {
        scopeExplanation = `Documented process virtual memory layout (VAD) inside expanded node "${expNode.label}" (${expNode.sublabel}).`;
      }
    }
  }
  // Case D: Main Scenario with a specific main node selected
  else if (
    effectiveScope === 'MAIN_SCENARIO' &&
    scopeContext.selectedMainNode
  ) {
    const mainNode = scopeContext.selectedMainNode;
    if (!isNonMemoryInfrastructureNode(mainNode)) {
      const mainDocText = [
        mainNode.label,
        mainNode.sublabel,
        mainNode.activitySummary,
        mainNode.internalSummary,
        mainNode.originalNode?.details?.description || '',
        ...(mainNode.originalNode?.details?.artifacts || []),
      ].join(' ');
      isMemoryRelevantInCurrentSection =
        mainNode.iconType === 'KERNEL_MEMORY' ||
        mainNode.originalNode?.role === 'memory' ||
        MEMORY_DOC_REGEX.test(mainDocText);
      if (isMemoryRelevantInCurrentSection) {
        scopeExplanation = `Documented virtual memory regions (VAD) associated with node "${mainNode.label}" (${mainNode.sublabel}).`;
      }
    }
  }
  // Case E: Main Scenario (Overview or Stage selected, no node selected)
  else {
    if (activeStageIndex === 0) {
      isMemoryRelevantInCurrentSection = true;
      scopeExplanation = `Documented virtual memory layout (VAD) and process hollowing / injection forensics for scenario ${scenario.code} (${scenario.name}).`;
    } else {
      const stageObj =
        scenario.stages[activeStageIndex - 1] || scenario.stages[0];
      const stageTelemetry = scenario.telemetry.filter(
        (t) => t.stageIndex === activeStageIndex
      );
      const stageDocText = [
        stageObj?.title || '',
        stageObj?.subtitle || '',
        stageObj?.description || '',
        ...(stageObj?.keySpecs || []).map((ks) => `${ks.term} ${ks.value}`),
        ...stageTelemetry.map(
          (t) =>
            `${t.sourceType} ${t.protocolOrEventId} ${t.shortAction || ''} ${t.info} ${t.explanation || ''}`
        ),
      ].join(' ');
      isMemoryRelevantInCurrentSection = MEMORY_DOC_REGEX.test(stageDocText);
      if (isMemoryRelevantInCurrentSection && stageObj) {
        scopeExplanation = `Documented virtual memory regions (VAD) active during Stage ${activeStageIndex}: ${stageObj.title}.`;
      }
    }
  }

  if (!isMemoryRelevantInCurrentSection) {
    return {
      hasDocumentedMemory: false,
      scopeExplanation: '',
      structuredScopeClauses: [],
      memoryProcesses: [],
      memoryStepTimeline: [],
      flowchart: EMPTY_MEMORY_FLOWCHART,
      memoryBlocks: [],
      relatedProcessTree: [],
    };
  }

  const stages = scenario.stages || [];
  let runningBlockIndex = 0;

  const memoryBlocks = allMemoryProcesses.flatMap((proc) => {
    const procApis = proc.apiCalls || [];
    return (proc.memoryBlocks || []).map((mb, bIdx) => {
      runningBlockIndex += 1;
      const stepNumber = runningBlockIndex;
      const stepCode = `M.${stepNumber}`;
      const matchedStageIdx = Math.min(
        stages.length,
        Math.max(1, (proc.activeFromStage || 1) + bIdx)
      );
      const stageObj =
        stages.find((s) => s.index === matchedStageIdx) ||
        stages[Math.min(stages.length - 1, stepNumber - 1)] ||
        stages[0];

      const rawApi =
        procApis[Math.min(procApis.length - 1, bIdx)] ||
        procApis[0] ||
        stageObj?.mitreTechniqueId ||
        'VirtualAllocEx / WriteProcessMemory';
      const correlatedApiCall = formatApiCallWithWhy(rawApi, proc);

      const enrichedDesc = enrichMemoryBlockDescriptionWithWhy(mb, proc);
      const addressWhyNote = buildMemoryBlockAddressWhyNote(mb, proc);
      const permissionsWhyNote = buildMemoryBlockPermissionsWhyNote(mb, proc);
      const hexWhyNote = buildMemoryBlockHexWhyNote(mb, proc);

      const parsedClauses = parseStructuredExplanationClauses(
        enrichedDesc,
        stepCode
      ).map((clause) => {
        const normalizedReasons = clause.parentheticalReasons.map((r) =>
          /^why\b/i.test(r.trim()) ? r.trim() : `why: ${r.trim()}`
        );
        if (normalizedReasons.length > 0) {
          return {
            ...clause,
            parentheticalReasons: normalizedReasons,
          };
        }
        const fallbackWhy = permissionsWhyNote.replace(/^\(|\)$/g, '');
        return {
          ...clause,
          parentheticalReasons: [fallbackWhy],
        };
      });

      return {
        ...mb,
        stepNumber,
        stepCode,
        stageIndex: stageObj?.index || matchedStageIdx,
        stageTitle: stageObj?.title || `Stage ${matchedStageIdx}`,
        correlatedApiCall,
        description: enrichedDesc,
        processId: String(proc.pid),
        processName: proc.name,
        processPid: proc.pid,
        addressWhyNote,
        permissionsWhyNote,
        hexWhyNote,
        structuredClauses: parsedClauses,
      };
    });
  });

  const memoryStepTimeline: ScopedMemoryStepItem[] = memoryBlocks.map((mb) => {
    const proc =
      allMemoryProcesses.find((p) => p.pid === mb.processPid) ||
      allMemoryProcesses[0];
    const { apiSignature, whyNote } = splitApiCallAndWhy(mb.correlatedApiCall);
    const stageTelemetry = (scenario.telemetry || []).find(
      (t) => t.stageIndex === mb.stageIndex
    );
    const primaryClause = mb.structuredClauses[0];
    const allWhyReasons = mb.structuredClauses.flatMap(
      (c) => c.parentheticalReasons
    );
    const primaryWhy =
      allWhyReasons.find((r) => /^why\b/i.test(r)) ||
      mb.permissionsWhyNote.replace(/^\(|\)$/g, '');

    const detectionEvidence = stageTelemetry
      ? `${stageTelemetry.sourceType} · ${stageTelemetry.protocolOrEventId}: ${stageTelemetry.shortAction || stageTelemetry.info} (why detected: memory scanner / kernel sensor correlates ${mb.address} [${mb.permissions}] in ${mb.processName} PID ${mb.processPid} with ${stageTelemetry.protocolOrEventId})`
      : `PE-sieve / Sysmon VAD Scan on ${mb.processName} PID ${mb.processPid} (why detected: private ${mb.permissions} page at ${mb.address} [${mb.section}] diverges from the clean on-disk image)`;

    return {
      stepNumber: mb.stepNumber,
      stepCode: mb.stepCode,
      stageIndex: mb.stageIndex,
      stageTitle: mb.stageTitle,
      processPid: mb.processPid,
      processPpid: proc?.ppid || 0,
      processName: mb.processName,
      processStatus: proc?.status || 'injected',
      processIntegrity: proc?.integrity || 'High',
      operationOrApi: apiSignature,
      operationWhyNote: whyNote,
      targetAddress: mb.address,
      targetSection: mb.section,
      permissions: mb.permissions,
      regionSize: mb.size,
      regionStatus: mb.status,
      stepActionSummary:
        primaryClause?.coreStatement || mb.description.split('(why')[0].trim(),
      whyExplanation: primaryWhy.startsWith('(')
        ? primaryWhy
        : `(${primaryWhy})`,
      detectionEvidence,
    };
  });

  const flowchartStepRows: MemoryFlowchartStepRow[] = memoryBlocks.map(
    (mb, idx) => {
      const stepItem = memoryStepTimeline[idx];
      const dumpPhaseNode: MemoryFlowchartPhaseNode = {
        phaseId: 'MEMORY_DUMP',
        phaseOrder: 1,
        phaseCode: `${mb.stepCode}.1`,
        phaseTitle: 'Memory Dump & VAD Capture',
        badgeLabel: `${mb.permissions} · ${mb.size}`,
        iconKind: 'MEMORY_DUMP',
        primaryArtifact: `${mb.address} · ${mb.section}`,
        secondarySpec: `${mb.processName} (PID ${mb.processPid}) · Status: ${mb.status.toUpperCase()}`,
        whyAnnotation: `${mb.addressWhyNote} ${mb.permissionsWhyNote}`,
      };

      const stringPhaseNode: MemoryFlowchartPhaseNode = {
        phaseId: 'STRING_ANALYSIS',
        phaseOrder: 2,
        phaseCode: `${mb.stepCode}.2`,
        phaseTitle: 'String, Byte & API Analysis',
        badgeLabel: stepItem.operationOrApi,
        iconKind: 'STRING_ANALYSIS',
        primaryArtifact: mb.hexPreview,
        secondarySpec: `API / Syscall: ${stepItem.operationOrApi}`,
        whyAnnotation: `${mb.hexWhyNote} ${stepItem.operationWhyNote}`,
      };

      const extractionPhaseNode: MemoryFlowchartPhaseNode = {
        phaseId: 'FORENSIC_EXTRACTION',
        phaseOrder: 3,
        phaseCode: `${mb.stepCode}.3`,
        phaseTitle: 'Forensic Extraction & Verdict',
        badgeLabel: `Stage S${mb.stageIndex} Catch`,
        iconKind: 'FORENSIC_EXTRACTION',
        primaryArtifact: stepItem.stepActionSummary,
        secondarySpec: stepItem.detectionEvidence.split('(why')[0].trim(),
        whyAnnotation: stepItem.whyExplanation,
      };

      return {
        stepNumber: mb.stepNumber,
        stepCode: mb.stepCode,
        stageIndex: mb.stageIndex,
        stageTitle: mb.stageTitle,
        processName: mb.processName,
        processPid: mb.processPid,
        targetAddress: mb.address,
        targetSection: mb.section,
        permissions: mb.permissions,
        regionSize: mb.size,
        regionStatus: mb.status,
        stepHeadline: stepItem.stepActionSummary,
        stepWhySummary: stepItem.whyExplanation,
        phases: [dumpPhaseNode, stringPhaseNode, extractionPhaseNode],
      };
    }
  );

  const flowchart: MemoryForensicsFlowchartModel = {
    totalSteps: flowchartStepRows.length,
    summaryPhases: [
      {
        phaseId: 'MEMORY_DUMP',
        phaseOrder: 1,
        title: 'Phase 1 · Memory Dump & VAD Snapshot',
        subtitle: 'Volatile RAM Region & Page Protection Acquisition',
        iconKind: 'MEMORY_DUMP',
        whyPhaseMatters:
          '(why Phase 1 — Memory Dump: captures volatile RAM pages and Virtual Address Descriptor [VAD] permissions [RWX / Copy-on-Write] before process termination or system reboot erases fileless evidence)',
        artifactCountLabel: `${flowchartStepRows.length} Dumped VAD Region${flowchartStepRows.length === 1 ? '' : 's'}`,
      },
      {
        phaseId: 'STRING_ANALYSIS',
        phaseOrder: 2,
        title: 'Phase 2 · String, Byte & API Analysis',
        subtitle: 'Hex Header Signatures, Syscalls & Unpacked Strings',
        iconKind: 'STRING_ANALYSIS',
        whyPhaseMatters:
          '(why Phase 2 — String & Byte Analysis: inspects raw hex signatures [MZ 4D 5A headers, ELF magic bytes, shellcode prologues] and resolved API/syscall strings inside dumped memory)',
        artifactCountLabel: `${flowchartStepRows.length} Hex & API Signature${flowchartStepRows.length === 1 ? '' : 's'}`,
      },
      {
        phaseId: 'FORENSIC_EXTRACTION',
        phaseOrder: 3,
        title: 'Phase 3 · Forensic Extraction & EDR Catch',
        subtitle: 'PE-Sieve / Volatility Carving & SIEM Correlation',
        iconKind: 'FORENSIC_EXTRACTION',
        whyPhaseMatters:
          '(why Phase 3 — Forensic Extraction: carves injected or hollowed modules out of RAM via PE-sieve/Volatility and correlates each memory mutation with kernel/SIEM detection telemetry)',
        artifactCountLabel: `${flowchartStepRows.length} Extracted Forensic Proof${flowchartStepRows.length === 1 ? '' : 's'}`,
      },
    ],
    stepRows: flowchartStepRows,
  };

  const enrichedScopeExplanation =
    scopeExplanation && !/\(why\b/i.test(scopeExplanation)
      ? `${scopeExplanation} (why memory forensics is decisive here: fileless and hollowing loaders unpack or patch executable code directly inside volatile RAM so on-disk files still appear clean and signed, leaving Virtual Address Descriptor [VAD] permission anomalies, unbacked RWX pages, and Copy-on-Write page splits as the primary forensic proof).`
      : scopeExplanation;

  const structuredScopeClauses = parseStructuredExplanationClauses(
    enrichedScopeExplanation,
    'M0'
  );

  const relatedProcessTree = (scenario.processTree || []).map((proc, pIdx) => {
    const processStepNumber = pIdx + 1;
    const processStepCode = `P.${processStepNumber}`;
    const apiCallsWithWhy = (proc.apiCalls || []).map((api) =>
      formatApiCallWithWhy(api, proc)
    );
    const structuredApiSteps = apiCallsWithWhy.map((fullText, aIdx) => {
      const { apiSignature, whyNote } = splitApiCallAndWhy(fullText);
      return {
        stepCode: `${processStepCode}.${aIdx + 1}`,
        apiSignature,
        whyNote,
        fullText,
      };
    });

    return {
      ...proc,
      processStepNumber,
      processStepCode,
      statusWhyNote: buildProcessStatusWhyNote(proc),
      commandLineWhyNote: buildProcessCommandLineWhyNote(proc),
      apiCallsWithWhy,
      structuredApiSteps,
    };
  });

  return {
    hasDocumentedMemory: memoryBlocks.length > 0,
    scopeExplanation: enrichedScopeExplanation,
    structuredScopeClauses,
    memoryProcesses: allMemoryProcesses,
    memoryStepTimeline,
    flowchart,
    memoryBlocks,
    relatedProcessTree,
  };
}

export function isSeparatedStepsAndSequenceScenario(
  scenarioId: string
): boolean {
  return Boolean(scenarioId);
}

export interface ScopedSequenceParticipant {
  id: string;
  badge: string;
  label: string;
  sublabel: string;
  zoneLabel: string;
  roleSummary: string;
  iconType?: SketchIconType;
  isCompromised?: boolean;
}

export interface ScopedSequenceExchangeItem {
  id: string;
  stepNumber: number;
  stageIndex: number;
  sequenceCode: string;
  forwardSeq: string;
  returnSeq: string;
  plainTitle: string;
  actionTitle: string;
  mitreId: string;
  protocolOrEventId: string;
  timestamp: string;
  severity: TelemetryEvent['severity'];
  initiatorNodeId: string;
  initiatorBadge: string;
  initiatorLabel: string;
  initiatorSublabel: string;
  initiatorZoneLabel: string;
  initiatorIconType?: SketchIconType;
  receiverNodeId: string;
  receiverBadge: string;
  receiverLabel: string;
  receiverSublabel: string;
  receiverZoneLabel: string;
  receiverIconType?: SketchIconType;
  forwardFlowBadge: string;
  forwardPayloadSummary: string;
  returnFlowBadge: string;
  returnLabel: string;
  returnDescription: string;
  continuationHint: string;
  storyAnalogy: string;
  technicalBridge: string;
  underTheHood: string;
  detectionAndEvidence: string;
  keySpecs: string[];
  telemetryEvent: TaggedTelemetryEvent;
  isActiveExchange: boolean;
  isSelectedPacket: boolean;
}

export interface ScopedSequenceModel {
  hasDocumentedSequence: boolean;
  effectiveScope: InspectorScopeMode;
  scopeTitle: string;
  scopeBriefing: string;
  participants: ScopedSequenceParticipant[];
  exchanges: ScopedSequenceExchangeItem[];
}

interface DedicatedSequenceExchangeContent {
  plainTitle: string;
  forwardPayloadSummary: string;
  returnLabel: string;
  returnDescription: string;
  continuationHint: string;
  storyAnalogy: string;
  technicalBridge: string;
  underTheHood: string;
  detectionAndEvidence: string;
  keySpecs: string[];
}

const PROCESS_HOLLOWING_SEQUENCE_EXCHANGE_SPECS: Record<
  number,
  DedicatedSequenceExchangeContent
> = {
  1: {
    plainTitle:
      'Spawning a Genuine svchost.exe Container in a Paused State & Receiving Its Control Handles',
    forwardPayloadSummary:
      'CreateProcessW("C:\\Windows\\System32\\svchost.exe", CREATE_SUSPENDED = 0x00000004, asking Windows to create the trusted process in RAM while freezing its main thread before any code runs).',
    returnLabel: 'RET PID 4892 / hProcess 0x01C4',
    returnDescription:
      'The Windows kernel creates the paused svchost.exe process (PID 4892) and returns PROCESS_INFORMATION containing two master key handles: hProcess = 0x01C4 (the Process Master Key handle granting permission to inspect, empty, and rewrite svchost.exe’s RAM in Sequences #2 and #3) and hThread = 0x01C8 (the Thread Master Key handle granting permission to change the paused thread’s CPU registers and wake it up in Sequence #4).',
    continuationHint:
      'Next in Sequence (#1 ──▶ #2): Invoice_Q4.exe (PID 3104) passes the returned Process Master Key handle (hProcess = 0x01C4) directly into Sequence #2 to locate and unmap svchost.exe’s original code.',
    storyAnalogy:
      'Think of this first exchange as a two-way dispatch order at a bank depot: the disguised courier sends a request (#1→) asking the depot controller to roll out an official armored bank truck with its parking brake locked, and the controller replies (⇠#1) by handing back the truck’s registration number and two golden master keys: the first master key unlocks the cargo doors so the courier can swap the bank load inside, and the second master key unlocks the driver cab so they can change the GPS route and release the brake later.',
    technicalBridge:
      'In the forward request (#1→), the stage-1 dropper Invoice_Q4.exe (PID 3104, the initial loader launched on Victim Laptop WKS-04, 10.10.4.15) calls CreateProcessW (Windows’ standard API for starting a new program) targeting C:\\Windows\\System32\\svchost.exe (chosen because svchost.exe carries a valid Microsoft digital signature, allowing it to blend in with dozens of legitimate background services) with the creation flag CREATE_SUSPENDED = 0x00000004 (which tells the kernel to build the process container in RAM while halting its primary thread at the starting line before a single instruction executes). In the return response (⇠#1), the Windows kernel initializes the suspended process and replies to PID 3104 with a populated PROCESS_INFORMATION structure (Windows’ startup receipt) containing PID 4892, Process Master Key handle hProcess = 0x01C4 (used to read, unmap, and overwrite svchost.exe’s virtual memory in Sequences #2 and #3), and Thread Master Key handle hThread = 0x01C8 (used to modify CPU registers and resume the frozen thread in Sequence #4).',
    underTheHood:
      'During the #1→ / ⇠#1 kernel transition, ntdll!NtCreateUserProcess (the low-level Windows syscall inside ntdll.dll that builds new processes inside the OS kernel) allocates the executive process object EPROCESS for PID 4892 (the kernel’s master tracking record holding the trusted svchost.exe identity, security token, and memory map), maps ntdll.dll (Windows’ mandatory system bridge library needed by every process to call kernel routines) alongside the signed svchost.exe image at base address 0x00400000 (the standard starting address in virtual RAM where Windows aligns executable code), and parks the main thread TID 4896 (the execution worker assigned to run program instructions) at ntdll!RtlUserThreadStart (Windows’ built-in thread launchpad waiting just before the program’s own entry point) with SuspendCount = 1 (a kernel pause counter set to 1 so the CPU scheduler keeps the process completely inert in RAM). Simultaneously, the kernel grants the parent dropper PROCESS_ALL_ACCESS = 0x1FFFFF (the highest Windows permission mask allowing full memory and thread tampering) via Process Master Key handle hProcess = 0x01C4 (a numeric permission token unlocking svchost.exe’s virtual memory so the loader can inspect, empty, and inject code in Sequences #2 and #3) and Thread Master Key handle hThread = 0x01C8 (a separate permission token unlocking the paused thread’s CPU registers so the loader can redirect its entry point and wake it up in Sequence #4).',
    detectionAndEvidence:
      'Documented in Sysmon EventID 1 (ProcessCreate, the Windows log capturing every new process launch and its parent) during the #1→ / ⇠#1 transition: non-service parent C:\\Users\\Public\\Downloads\\Invoice_Q4.exe (PID 3104) spawning C:\\Windows\\System32\\svchost.exe (PID 4892, whereas legitimate svchost.exe instances are always spawned by services.exe with a -k service group flag).',
    keySpecs: [
      'Seq #1 (#1→ Request / ⇠#1 Response)',
      'CreateProcessW (CREATE_SUSPENDED = 0x00000004)',
      'Parent PID 3104 ──▶ Child PID 4892',
      'Master Key Handles: hProcess = 0x01C4 (Edit RAM) / hThread = 0x01C8 (Wake CPU)',
    ],
  },
  2: {
    plainTitle:
      'Querying the PEB Base Address & Unmapping the Legitimate svchost.exe Code From RAM',
    forwardPayloadSummary:
      'ReadProcessMemory(PEB+0x10 ──▶ ImageBaseAddress = 0x00400000, reading the process table to locate where svchost.exe sits in RAM) followed by ntdll!NtUnmapViewOfSection(hProcess = 0x01C4, BaseAddr = 0x00400000, ordering the kernel to strip the original Microsoft code out of memory).',
    returnLabel: 'RET STATUS_SUCCESS (0x00400000 Free)',
    returnDescription:
      'The Windows Memory Manager detaches the original svchost.exe image section from address 0x00400000 and returns NTSTATUS = 0x00000000 (STATUS_SUCCESS, confirming that the 0x00400000 memory slot inside PID 4892 is now completely empty and ready to receive the attacker’s payload).',
    continuationHint:
      'Next in Sequence (#2 ──▶ #3): The newly vacated base address (0x00400000) inside svchost.exe (PID 4892) is passed directly to VirtualAllocEx and WriteProcessMemory in Sequence #3.',
    storyAnalogy:
      'While the armored truck remains frozen in the bay, the intruder uses the first golden master key (the cargo-door key from Exchange #1) to send a second order (#2→) scanning the truck’s cargo manifest and hoisting out every crate of genuine bank bullion; the bay controller sends back an empty-bay confirmation (⇠#2), proving the interior is now a hollow shell that still wears the bank’s trusted license plate on the outside.',
    technicalBridge:
      'In the forward request (#2→), Invoice_Q4.exe (PID 3104) uses Process Master Key handle hProcess = 0x01C4 (received in Sequence #1 specifically for cross-process memory operations) to read the frozen child process’s Process Environment Block at offset PEB+0x10 (Windows’ internal process data table, locating the exact memory address where Windows loaded svchost.exe: ImageBaseAddress = 0x00400000) and then invokes ntdll!NtUnmapViewOfSection(hProcess = 0x01C4, BaseAddr = 0x00400000) (an undocumented native syscall that tells the kernel to unmap the legitimate Microsoft code section from RAM). In the return response (⇠#2), the kernel’s Virtual Memory Manager releases the file-backed section at 0x00400000 and returns STATUS_SUCCESS = 0x00000000 (confirming that address 0x00400000 is now free so the replacement malware image can be written at its preferred base address without needing complex pointer relocations).',
    underTheHood:
      'When NtUnmapViewOfSection (the native user-mode API in ntdll.dll for unmapping memory views) executes across the #2→ / ⇠#2 boundary, nt!MiUnmapViewOfSection (the internal kernel routine that tears down mapped executable sections) removes the SEC_IMAGE Virtual Address Descriptor (VAD, the kernel’s memory-inventory tree node linking address 0x00400000 to the signed file C:\\Windows\\System32\\svchost.exe on disk). This leaves PID 4892 alive in the kernel process table (preserving its trusted Microsoft-signed identity and metadata) even though its primary executable code region at 0x00400000 is now completely unallocated.',
    detectionAndEvidence:
      'Documented in Win32 API / Kernel Memory ETW (Event Tracing for Windows monitoring MiUnmapViewOfSection) & Sysmon EventID 10 / 25: detects non-system process Invoice_Q4.exe (PID 3104) unmapping the primary executable image section (0x00400000) of a suspended Windows system binary (svchost.exe, PID 4892).',
    keySpecs: [
      'Seq #2 (#2→ Request / ⇠#2 Response)',
      'ntdll!NtUnmapViewOfSection (hProcess = 0x01C4)',
      'PEB+0x10 ImageBaseAddress = 0x00400000',
      'Return Status: STATUS_SUCCESS (0x00000000)',
    ],
  },
  3: {
    plainTitle:
      'Reserving 264 KB of RWX Memory at 0x00400000 & Streaming the Cobalt Strike PE Payload',
    forwardPayloadSummary:
      'VirtualAllocEx(0x00400000, 264 KB, PAGE_EXECUTE_READWRITE = 0x40, reserving writable-and-executable RAM) + WriteProcessMemory (streaming 270,336 bytes of the unpacked Cobalt Strike Beacon PE image directly into svchost.exe’s hollowed RAM).',
    returnLabel: 'RET 0x00400000 (264 KB Written)',
    returnDescription:
      'The kernel commits the private RWX memory block at 0x00400000 inside PID 4892 and returns NumberOfBytesWritten = 270,336 (confirming that the MZ/PE headers and executable .text section are now resident in svchost.exe’s memory with entry point 0x004014A0).',
    continuationHint:
      'Next in Sequence (#3 ──▶ #4): Now that the Beacon entry point sits at 0x004014A0 inside svchost.exe (PID 4892), Sequence #4 uses Thread Master Key handle hThread = 0x01C8 to point the frozen CPU thread at 0x004014A0.',
    storyAnalogy:
      'In the third exchange, keeping the cargo bay unlocked with the first golden master key, the intruder sends a cargo-transfer order (#3→) that opens an unrestricted secret compartment inside the emptied armored truck and marches their covert crew and mission crate inside; the truck’s internal load sensor replies with a weight receipt (⇠#3), confirming every piece of equipment is bolted in place before the driver wakes up.',
    technicalBridge:
      'In the forward request (#3→), Invoice_Q4.exe (PID 3104) calls VirtualAllocEx (Windows’ cross-process memory allocator) using Process Master Key handle hProcess = 0x01C4 (with GrantedAccess = 0x1FFFFF, granting full read, write, and allocation rights) to reserve 264 KB at the vacated address 0x00400000 with PAGE_EXECUTE_READWRITE = 0x40 permissions (making the memory region simultaneously writable right now and executable as CPU instructions a moment later), and then calls WriteProcessMemory (Windows’ cross-process byte-copy API) to write the Cobalt Strike Beacon PE headers ("MZ" / 4D 5A, the Windows executable header signature) and sections (.text for machine code, .rdata for read-only tables, and .data for variables) into PID 4892 (loading the entire implant strictly in RAM so no unpacked malware file ever touches the hard drive). In the return response (⇠#3), the kernel confirms the allocation at base 0x00400000 and returns lpNumberOfBytesWritten = 270,336 (verifying that the Beacon’s executable entry point is now mapped at 0x004014A0).',
    underTheHood:
      'Across the #3→ / ⇠#3 kernel syscall pair, NtAllocateVirtualMemory (which reserves virtual memory pages in a remote process) followed by NtWriteVirtualMemory (which transfers raw payload bytes across process memory spaces), Windows creates an unbacked private region marked MEM_PRIVATE (anonymous RAM not backed by any signed executable on disk) with PAGE_EXECUTE_READWRITE = 0x40 permissions at 0x00400000 (unlike genuine DLLs and EXEs, which use file-backed SEC_IMAGE sections that strictly separate Read-Execute code from Read-Write data) holding a raw executable PE image inside svchost.exe (PID 4892).',
    detectionAndEvidence:
      'Documented in Sysmon EventID 10 (ProcessAccess logging full-control handle GrantedAccess = 0x1FFFFF from Invoice_Q4.exe PID 3104 to svchost.exe PID 4892) and Kernel ETW Threat-Intelligence (EtwTiLogAllocVMRemote, a Microsoft kernel sensor alerting on cross-process allocation of executable RWX = 0x40 memory containing an unbacked MZ header).',
    keySpecs: [
      'Seq #3 (#3→ Request / ⇠#3 Response)',
      'VirtualAllocEx: 0x00400000 (264 KB RWX = 0x40)',
      'GrantedAccess: 0x1FFFFF (PROCESS_ALL_ACCESS)',
      'WriteProcessMemory: 270,336 Bytes (MZ 4D 5A)',
    ],
  },
  4: {
    plainTitle:
      'Repointing the Frozen Thread’s RCX Register to 0x004014A0 & Resuming Execution',
    forwardPayloadSummary:
      'SetThreadContext(hThread = 0x01C8, RCX = 0x004014A0, using the Thread Master Key to redirect the frozen thread’s starting pointer to the injected Beacon) followed by ResumeThread(hThread = 0x01C8, unfreezing svchost.exe).',
    returnLabel: 'RET SuspendCount 1→0 / EID 25',
    returnDescription:
      'The kernel updates the thread context register RCX to 0x004014A0, decrements SuspendCount from 1 to 0 (waking TID 4896 so the Cobalt Strike Beacon begins executing inside svchost.exe PID 4892), and emits Sysmon EventID 25 (ProcessTampering: "Image is replaced").',
    continuationHint:
      'Next in Sequence (#4 ──▶ #5): Running actively inside svchost.exe (PID 4892), the awakened Beacon thread initiates its outbound HTTPS Command-and-Control handshake in Sequence #5.',
    storyAnalogy:
      'In the fourth exchange, the intruder pulls out the second golden master key (the cab-and-ignition key from Exchange #1) to unlock the refitted armored truck’s front cab (#4→), resets the driver’s dashboard GPS coordinate to their secret destination, and releases the parking brake; the truck’s dashboard replies with an active engine-running signal (⇠#4) as the vehicle roars onto the road under its trusted bank license plate.',
    technicalBridge:
      'In the forward request (#4→), Invoice_Q4.exe (PID 3104) uses Thread Master Key handle hThread = 0x01C8 (obtained in Sequence #1 specifically to control the frozen thread) to call SetThreadContext (Windows’ API for modifying a paused thread’s CPU registers) and overwrite the thread’s RCX register with 0x004014A0 (Base 0x00400000 + EntryPoint RVA 0x14A0, because on 64-bit Windows, a newly created suspended thread holds its upcoming program entry point in RCX, so changing RCX aims the thread straight at the injected Beacon without calling CreateRemoteThread), and then calls ResumeThread (telling the kernel to drop the pause counter and start execution). In the return response (⇠#4), the kernel commits the modified CPU context, decrements the thread’s suspend counter from 1 to 0 (returning PreviousSuspendCount = 1 as TID 4896 begins executing the Beacon), and fires the kernel image-tampering notification captured as Sysmon EventID 25.',
    underTheHood:
      'When NtSetContextThread (the kernel syscall that saves modified register values into a paused thread) and NtResumeThread (the kernel syscall that lowers SuspendCount so the CPU scheduler runs the thread) complete their #4→ / ⇠#4 transition, the kernel updates the thread’s trap frame at KTRAP_FRAME.Rcx = 0x004014A0 (the saved CPU register snapshot restored onto the processor when the thread wakes) and releases TID 4896 from ntdll!RtlUserThreadStart (Windows’ thread launchpad that jumps straight to the address inside RCX) into user-mode execution (allowing the original dropper Invoice_Q4.exe PID 3104 to exit while the Cobalt Strike payload continues running inside svchost.exe PID 4892).',
    detectionAndEvidence:
      'Documented in Sysmon EventID 25 (ProcessTampering, Type: "Image is replaced" on C:\\Windows\\System32\\svchost.exe, PID 4892, triggered when the resumed thread’s mapped image at 0x00400000 no longer matches the signed on-disk binary).',
    keySpecs: [
      'Seq #4 (#4→ Request / ⇠#4 Response)',
      'SetThreadContext (hThread = 0x01C8 / TID 4896)',
      'Register Hijack: RCX = 0x004014A0 (EntryPoint)',
      'Sysmon EventID 25 (Image is replaced)',
    ],
  },
  5: {
    plainTitle:
      'Outbound TLS 1.3 HTTPS Malleable C2 Check-In & Encrypted Tasking Handshake',
    forwardPayloadSummary:
      'WinHttpConnect + TLS 1.3 ClientHello (JA3: 72a589da586844d7f0818ce684948eea, Cobalt Strike’s TLS client fingerprint) + HTTP GET /jquery-3.3.1.min.js to 185.220.101.42:443 (carrying encrypted victim metadata inside the HTTP Cookie header).',
    returnLabel: 'RESP HTTP 200 OK (60s / 20% Jitter)',
    returnDescription:
      'Attacker C2 Server (185.220.101.42:443) replies with TLS 1.3 ServerHello and HTTP 200 OK (disguised as an application/javascript response carrying AES-encrypted Cobalt Strike operator commands and a 60s / 20% jitter sleep schedule).',
    continuationHint:
      'Sequence Complete (⇠#5): Hollowed svchost.exe (PID 4892) maintains an asynchronous 60s (±20% jitter) polling loop with 185.220.101.42:443 while Node ⑥ (SIEM & EDR) correlates the host and network trail.',
    storyAnalogy:
      'In the final exchange, the disguised armored truck rolls past the perimeter checkpoint guard and opens a coded courier line (#5→) disguised as a routine supply check-in to the intruder’s external warehouse; the warehouse replies (⇠#5) with encrypted mission orders tucked inside a normal-looking delivery slip.',
    technicalBridge:
      'In the forward request (#5→), the Cobalt Strike Beacon running inside C:\\Windows\\System32\\svchost.exe (PID 4892, using the trusted Windows binary path so host-based firewall rules allow the outbound socket) initiates an encrypted TLS 1.3 connection over TCP port 443 to 185.220.101.42:443 (blending in with standard HTTPS web traffic) and sends an HTTP GET request for /jquery-3.3.1.min.js (a Malleable C2 profile that hides RSA-encrypted victim host metadata inside the Cookie header to mimic a normal CDN script fetch). In the return response (⇠#5), the external C2 server (185.220.101.42:443) returns an HTTP 200 OK response containing AES-encrypted tasking instructions and sleep settings (60-second callback interval with 20% random jitter, spacing out future check-ins to evade simple fixed-timer network beacon detectors).',
    underTheHood:
      'Across the #5→ / ⇠#5 network exchange, svchost.exe (PID 4892) loads winhttp.dll (Windows’ built-in HTTP client DLL, avoiding custom network code) in user mode to negotiate TLS 1.3 (modern transport encryption that produces client TLS fingerprint JA3 = 72a589da586844d7f0818ce684948eea, a hash of TLS handshake fields uniquely identifying Cobalt Strike) through the perimeter firewall NAT (gateway translating corporate IPs to the internet) toward 185.220.101.42:443, receiving encrypted command blocks that are decrypted directly inside the private heap (runtime data memory) of PID 4892.',
    detectionAndEvidence:
      'Documented in Sysmon EventID 3 (NetworkConnect logging C:\\Windows\\System32\\svchost.exe PID 4892 connecting to 185.220.101.42:443 without a -k service group flag) correlated with Suricata IDS (network sensor alerting on the Cobalt Strike Malleable C2 jQuery URI and TLS JA3 fingerprint 72a589da586844d7f0818ce684948eea).',
    keySpecs: [
      'Seq #5 (#5→ Request / ⇠#5 Response)',
      'Outbound TLS 1.3: PID 4892 ──▶ 185.220.101.42:443',
      'TLS Fingerprint: JA3 72a589da586844d7f0818ce684948eea',
      'Malleable C2: GET /jquery-3.3.1.min.js (60s / 20% Jitter)',
    ],
  },
};

/**
 * Builds a structured, Story-to-Spec Sequence Model (`ScopedSequenceModel`)
 * scoped to the active Inspector target (Main Scenario, Selected Node, Expanded Node,
 * or Internal Sub-Node). Never fabricates sequences if none exist in the documentation.
 */
export function buildScopedSequenceModel(
  scopeContext: InspectorScopeContext,
  selectedTelemetry: TelemetryEvent | null = null
): ScopedSequenceModel {
  const { scenario, effectiveScope, activeStageIndex, activeEnvironment } =
    scopeContext;
  const isSeparatedScenario = isSeparatedStepsAndSequenceScenario(scenario.id);

  // Case 1: Inside an Expanded Node or Internal Sub-Node
  if (
    effectiveScope !== 'MAIN_SCENARIO' &&
    scopeContext.internalSubBoard &&
    scopeContext.expandedNode
  ) {
    const parentNode = scopeContext.expandedNode;
    const subBoard = scopeContext.internalSubBoard;
    const subZoneById = new Map(subBoard.zones.map((z) => [z.id, z]));
    const internalSteps = scopeContext.internalSteps;

    if (internalSteps.length === 0) {
      return {
        hasDocumentedSequence: false,
        effectiveScope,
        scopeTitle: scopeContext.scopeTitle,
        scopeBriefing: '',
        participants: [],
        exchanges: [],
      };
    }

    const participantIds = new Set<string>();
    for (const st of internalSteps) {
      if (st.fromSubNode) participantIds.add(st.fromSubNode.id);
      if (st.toSubNode) participantIds.add(st.toSubNode.id);
    }

    const participants: ScopedSequenceParticipant[] = subBoard.subNodes
      .filter((sn) => participantIds.has(sn.id))
      .map((sn) => {
        const zone = subZoneById.get(sn.zoneId);
        return {
          id: sn.id,
          badge: `#${sn.sequenceCode || `${parentNode.chainOrder}.${sn.chainOrder}`} · ${sn.actionBadge}`,
          label: sn.label,
          sublabel: sn.sublabel,
          zoneLabel: zone ? `${zone.code} · ${zone.title}` : sn.zoneLabel || 'Internal Zone',
          roleSummary: sn.internalSummary || sn.activitySummary || '',
          iconType: sn.iconType,
          isCompromised: sn.isCompromised,
        };
      });

    const exchanges: ScopedSequenceExchangeItem[] = internalSteps.map(
      (st, idx) => {
        const fromZone = st.fromSubNode
          ? subZoneById.get(st.fromSubNode.zoneId)
          : null;
        const toZone = st.toSubNode
          ? subZoneById.get(st.toSubNode.zoneId)
          : null;
        const initiatorLabel = st.fromSubNode?.label || st.flow.fromNodeId;
        const receiverLabel = st.toSubNode?.label || st.flow.toNodeId;
        const initiatorSublabel =
          st.fromSubNode?.sublabel || parentNode.sublabel;
        const receiverSublabel = st.toSubNode?.sublabel || parentNode.sublabel;

        const envProfile = getActiveEnvironmentProfile(activeEnvironment);
        const storyAnalogy = isSeparatedScenario
          ? `In this internal request/response exchange (#${st.sequenceCode}), sub-component "${initiatorLabel}" sends a direct operational request (#${st.forwardSeq}→ ${st.title}) to "${receiverLabel}" and waits for the return confirmation channel (⇠#${st.returnSeq} ${st.flow.returnLabel || 'ACK'}, verifying that the operation succeeded before the next internal component in ${parentNode.label} runs).`
          : st.storyAnalogy;

        const technicalBridge = isSeparatedScenario
          ? `In the forward request (#${st.forwardSeq}→), "${initiatorLabel}" (${initiatorSublabel}) invokes ${st.title} (${st.protocolOrEventId}, ${st.mitreId}, passing the active execution parameters across the internal pipeline of ${parentNode.label}) toward "${receiverLabel}" (${receiverSublabel}). In the return response (⇠#${st.returnSeq}), ${st.returnDescription} (confirming that "${receiverLabel}" has updated its state so the next sub-step in ${subBoard.boardCode} can proceed).`
          : `Initiator "${initiatorLabel}" (${initiatorSublabel}) invokes ${st.title} (${st.protocolOrEventId}, ${st.mitreId}) toward Receiver "${receiverLabel}" (${receiverSublabel}). ` +
            `${st.telemetryEvent.info}`;

        const underTheHood =
          `Forward Request (#${st.forwardSeq} ──▶): ${initiatorLabel} dispatches ${st.title} over ${st.protocolOrEventId}. ` +
          `${st.fromSubNode?.internalSummary || ''} ` +
          `Return Channel (◀── #${st.returnSeq}): ${st.returnDescription}`;

        const detectionAndEvidence =
          `Captured via ${st.telemetryEvent.sourceType} (${st.protocolOrEventId} · ${st.mitreId} · ${envProfile.telemetryTag}). ` +
          `Raw Telemetry Indicator: ${st.telemetryEvent.rawLog}`;

        return {
          id: st.flow.id,
          stepNumber: idx + 1,
          stageIndex: st.flow.stageIndex || activeStageIndex || 1,
          sequenceCode: st.sequenceCode,
          forwardSeq: st.forwardSeq,
          returnSeq: st.returnSeq,
          plainTitle: `Internal Sequence #${st.sequenceCode}: ${initiatorLabel} ──▶ ${receiverLabel}`,
          actionTitle: st.title,
          mitreId: st.mitreId,
          protocolOrEventId: st.protocolOrEventId,
          timestamp: st.telemetryEvent.timestamp,
          severity: st.telemetryEvent.severity,
          initiatorNodeId: st.fromSubNode?.id || st.flow.fromNodeId,
          initiatorBadge: st.fromSubNode
            ? `#${st.fromSubNode.sequenceCode || st.sequenceCode} · ${st.fromSubNode.actionBadge}`
            : `#${st.sequenceCode} · SRC`,
          initiatorLabel,
          initiatorSublabel,
          initiatorZoneLabel: fromZone
            ? `${fromZone.code} · ${fromZone.title}`
            : st.fromSubNode?.zoneLabel || 'Internal Pipeline',
          initiatorIconType: st.fromSubNode?.iconType,
          receiverNodeId: st.toSubNode?.id || st.flow.toNodeId,
          receiverBadge: st.toSubNode
            ? `#${st.toSubNode.sequenceCode || st.sequenceCode} · ${st.toSubNode.actionBadge}`
            : `#${st.sequenceCode} · DST`,
          receiverLabel,
          receiverSublabel,
          receiverZoneLabel: toZone
            ? `${toZone.code} · ${toZone.title}`
            : st.toSubNode?.zoneLabel || 'Internal Pipeline',
          receiverIconType: st.toSubNode?.iconType,
          forwardFlowBadge: st.forwardFlowBadge,
          forwardPayloadSummary: st.telemetryEvent.info,
          returnFlowBadge: st.returnFlowBadge,
          returnLabel: st.flow.returnLabel || 'Execution Status / ACK',
          returnDescription: st.returnDescription,
          continuationHint:
            st.continuationHint ||
            (idx < internalSteps.length - 1
              ? `Next in pipeline: proceeds to #${internalSteps[idx + 1].sequenceCode} (${internalSteps[idx + 1].title}).`
              : `Completes internal pipeline inside ${parentNode.label}.`),
          storyAnalogy,
          technicalBridge,
          underTheHood,
          detectionAndEvidence,
          keySpecs: [
            `Seq #${st.sequenceCode} (#${st.forwardSeq} / #${st.returnSeq})`,
            st.protocolOrEventId,
            st.mitreId,
            st.telemetryEvent.sourceType,
          ],
          telemetryEvent: st.telemetryEvent,
          isActiveExchange: st.isCurrentStep,
          isSelectedPacket: Boolean(
            selectedTelemetry &&
              (selectedTelemetry.id === st.telemetryEvent.id ||
                selectedTelemetry.id === st.flow.id)
          ),
        };
      }
    );

    const scopeBriefing =
      effectiveScope === 'INTERNAL_SUBNODE' && scopeContext.selectedSubNode
        ? `Showing ${exchanges.length} documented internal request/response sequence exchange(s) directly connected to sub-node "${scopeContext.selectedSubNode.label}" inside "${parentNode.label}".`
        : `Showing all ${exchanges.length} documented internal request/response sequence exchanges inside expanded node "${parentNode.label}" (${parentNode.sublabel}).`;

    return {
      hasDocumentedSequence: exchanges.length > 0,
      effectiveScope,
      scopeTitle: scopeContext.scopeTitle,
      scopeBriefing,
      participants,
      exchanges,
    };
  }

  // Case 2: Main Scenario Topology (Full Scenario or Selected Main Node)
  const { zones, nodes, flows } = scopeContext.schematic;
  if (flows.length === 0) {
    return {
      hasDocumentedSequence: false,
      effectiveScope,
      scopeTitle: scopeContext.scopeTitle,
      scopeBriefing: '',
      participants: [],
      exchanges: [],
    };
  }

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const zoneById = new Map(zones.map((z) => [z.id, z]));

  const selectedMainNode = scopeContext.selectedMainNode;
  const scopedFlows = selectedMainNode
    ? flows.filter(
        (fl) =>
          fl.fromNodeId === selectedMainNode.id ||
          fl.toNodeId === selectedMainNode.id
      )
    : flows;

  if (scopedFlows.length === 0) {
    return {
      hasDocumentedSequence: false,
      effectiveScope,
      scopeTitle: scopeContext.scopeTitle,
      scopeBriefing: '',
      participants: [],
      exchanges: [],
    };
  }

  const participantIds = new Set<string>();
  for (const fl of scopedFlows) {
    participantIds.add(fl.fromNodeId);
    participantIds.add(fl.toNodeId);
  }

  const participants: ScopedSequenceParticipant[] = nodes
    .filter((n) => participantIds.has(n.id))
    .map((n) => {
      const z = zoneById.get(n.zoneId);
      return {
        id: n.id,
        badge: `#${n.chainOrder} · ${n.actionBadge}`,
        label: n.label,
        sublabel: n.sublabel,
        zoneLabel: z ? `${z.code} · ${z.title}` : n.zoneLabel || 'Network Zone',
        roleSummary: n.activitySummary || n.internalSummary || '',
        iconType: n.iconType,
        isCompromised: n.isCompromised,
      };
    });

  const exchanges: ScopedSequenceExchangeItem[] = scopedFlows.map((fl, idx) => {
    const srcNode = nodeById.get(fl.fromNodeId) || null;
    const dstNode = nodeById.get(fl.toNodeId) || null;
    const srcZone = srcNode ? zoneById.get(srcNode.zoneId) : null;
    const dstZone = dstNode ? zoneById.get(dstNode.zoneId) : null;
    const stageObj =
      scenario.stages[(fl.stageIndex || fl.stepNo) - 1] || scenario.stages[0];
    const taggedEv = tagTelemetryEventWithEnvironment(
      fl.telemetryEvent,
      activeEnvironment
    );

    const sequenceCode = fl.sequenceCode || `${fl.stepNo}`;
    const forwardSeq = fl.forwardSeq || sequenceCode;
    const returnSeq = fl.returnSeq || sequenceCode;

    const initiatorLabel =
      srcNode?.label || fl.telemetryEvent.sourceLabel || fl.fromNodeId;
    const receiverLabel =
      dstNode?.label || fl.telemetryEvent.targetLabel || fl.toNodeId;
    const initiatorSublabel = srcNode?.sublabel || 'Initiator Node';
    const receiverSublabel = dstNode?.sublabel || 'Receiver Node';

    const dedicatedSpec =
      scenario.id === 'process-hollowing'
        ? PROCESS_HOLLOWING_SEQUENCE_EXCHANGE_SPECS[fl.stepNo]
        : undefined;

    const returnLabel =
      dedicatedSpec?.returnLabel || fl.returnLabel || 'ACK / Status Response';
    const returnDescription =
      dedicatedSpec?.returnDescription ||
      fl.traceMeta?.returnDescription ||
      `${receiverLabel} returns ${returnLabel} back to ${initiatorLabel} (confirming completion of ${fl.label} over ${taggedEv.protocolOrEventId}).`;
    const continuationHint =
      dedicatedSpec?.continuationHint ||
      fl.traceMeta?.continuationHint ||
      (idx < scopedFlows.length - 1
        ? `Next in kill-chain: advances to Sequence #${scopedFlows[idx + 1].stepNo} (${scopedFlows[idx + 1].label}).`
        : `Final sequence step in this scope.`);

    const plainTitle =
      dedicatedSpec?.plainTitle ||
      `Exchange #${sequenceCode}: ${initiatorLabel} ──▶ ${receiverLabel} (${fl.label})`;

    const storyAnalogy =
      dedicatedSpec?.storyAnalogy ||
      `In this protocol exchange (#${sequenceCode}), ${initiatorLabel} dispatches ${fl.label} (#${forwardSeq}→) to ${receiverLabel} and receives ${returnLabel} (⇠#${returnSeq}, confirming the state transition before the next stage proceeds).`;

    const technicalBridge =
      dedicatedSpec?.technicalBridge ||
      `In the forward request (#${forwardSeq}→), ${initiatorLabel} (${initiatorSublabel}) transmits ${fl.label} over ${taggedEv.protocolOrEventId} (${taggedEv.mitreId}, delivering ${taggedEv.info}) to ${receiverLabel} (${receiverSublabel}). In the return response (⇠#${returnSeq}), ${receiverLabel} replies with ${returnLabel} (confirming execution status and state handoff back to ${initiatorLabel}).`;

    const underTheHood =
      dedicatedSpec?.underTheHood ||
      `Forward Request (#${forwardSeq} ──▶): ${initiatorLabel} executes ${fl.label} toward ${receiverLabel} (${taggedEv.info}). Return Response (◀── #${returnSeq}): ${returnDescription}`;

    const detectionAndEvidence =
      dedicatedSpec?.detectionAndEvidence ||
      `Captured by ${taggedEv.sourceType} (${taggedEv.protocolOrEventId} · ${taggedEv.mitreId}, recording the bidirectional exchange between ${initiatorLabel} and ${receiverLabel}). Raw Evidence: ${taggedEv.rawLog}`;

    const forwardPayloadSummary =
      dedicatedSpec?.forwardPayloadSummary ||
      `${taggedEv.info} (transmitted over ${taggedEv.protocolOrEventId} from ${initiatorLabel} to ${receiverLabel}).`;

    const isActiveExchange =
      activeStageIndex === 0 || fl.stageIndex === activeStageIndex;

    const stageSpecs = (stageObj?.keySpecs || []).map(
      (ks) => `${ks.term}: ${ks.value}`
    );

    return {
      id: fl.id,
      stepNumber: fl.stepNo,
      stageIndex: fl.stageIndex,
      sequenceCode,
      forwardSeq,
      returnSeq,
      plainTitle,
      actionTitle: fl.label,
      mitreId: taggedEv.mitreId,
      protocolOrEventId: taggedEv.protocolOrEventId,
      timestamp: taggedEv.timestamp,
      severity: taggedEv.severity,
      initiatorNodeId: srcNode?.id || fl.fromNodeId,
      initiatorBadge: srcNode
        ? `#${srcNode.chainOrder} · ${srcNode.actionBadge}`
        : `#${fl.stepNo} · SRC`,
      initiatorLabel,
      initiatorSublabel,
      initiatorZoneLabel: srcZone
        ? `${srcZone.code} · ${srcZone.title}`
        : srcNode?.zoneLabel || 'Network Zone',
      initiatorIconType: srcNode?.iconType,
      receiverNodeId: dstNode?.id || fl.toNodeId,
      receiverBadge: dstNode
        ? `#${dstNode.chainOrder} · ${dstNode.actionBadge}`
        : `#${fl.stepNo} · DST`,
      receiverLabel,
      receiverSublabel,
      receiverZoneLabel: dstZone
        ? `${dstZone.code} · ${dstZone.title}`
        : dstNode?.zoneLabel || 'Network Zone',
      receiverIconType: dstNode?.iconType,
      forwardFlowBadge: `#${forwardSeq} ──▶ ${fl.label}`,
      forwardPayloadSummary,
      returnFlowBadge: `◀── #${returnSeq} ${returnLabel}`,
      returnLabel,
      returnDescription,
      continuationHint,
      storyAnalogy,
      technicalBridge,
      underTheHood,
      detectionAndEvidence,
      keySpecs:
        dedicatedSpec?.keySpecs ||
        (stageSpecs.length > 0
          ? stageSpecs
          : [
              `Seq #${sequenceCode} (#${forwardSeq} / #${returnSeq})`,
              taggedEv.protocolOrEventId,
              taggedEv.mitreId,
              taggedEv.sourceType,
            ]),
      telemetryEvent: taggedEv,
      isActiveExchange,
      isSelectedPacket: Boolean(
        selectedTelemetry &&
          (selectedTelemetry.id === taggedEv.id ||
            selectedTelemetry.id === fl.id)
      ),
    };
  });

  const scopeBriefing = selectedMainNode
    ? `Showing ${exchanges.length} documented request/response sequence exchange(s) directly involving Node #${selectedMainNode.chainOrder} "${selectedMainNode.label}" (${selectedMainNode.sublabel}).`
    : isSeparatedScenario
    ? `Dedicated Bidirectional Request/Response Sequence Trace for ${scenario.code}: ${scenario.name}. Unlike the Step-by-Step Guide (which explains architectural concepts and host process waterfalls), this Sequence view traces the exact chronological protocol/syscall handshakes (#1→ Request and ⇠#1 Response), kernel handles, register values, and state handoffs across ${participants.length} participating nodes.`
    : `Showing all ${exchanges.length} documented end-to-end sequence exchanges across ${participants.length} participating nodes for ${scenario.code}: ${scenario.name}.`;

  return {
    hasDocumentedSequence: exchanges.length > 0,
    effectiveScope,
    scopeTitle: scopeContext.scopeTitle,
    scopeBriefing,
    participants,
    exchanges,
  };
}


