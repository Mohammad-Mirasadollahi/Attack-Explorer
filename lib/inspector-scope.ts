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
  WhiteboardSketchFlow,
  WhiteboardSketchNode,
} from './sketch-zones-and-drilldown';
import {
  buildDiagramStepGuideModel,
  DiagramStepGuideModel,
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
    const forwardSeq = fl.forwardSeq || `${sequenceCode}.1`;
    const returnSeq = fl.returnSeq || `${sequenceCode}.2`;

    const fromLabel = fromSubNode?.label || fl.fromNodeId;
    const toLabel = toSubNode?.label || fl.toNodeId;

    const storyAnalogy =
      `Inside ${parentNode.label}, internal component "${fromLabel}" passes control or data (${fl.label}) directly to "${toLabel}". ` +
      `In plain terms: like an internal courier handing a work order from one department desk (${fromLabel}) to the next (${toLabel}) and receiving immediate confirmation (${fl.returnLabel || 'ACK'}).`;

    const explanation =
      `${fromLabel} (${fromSubNode?.sublabel || 'Source'}) invokes ${fl.label} toward ${toLabel} (${toSubNode?.sublabel || 'Target'}) over ${fl.telemetryEvent.protocolOrEventId}. ` +
      `${taggedEv.info}`;

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
  const scopedStoryAnalogy =
    subBoardStoryAnalogy ||
    selectedMainNodeStoryAnalogy ||
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

export interface ScopedMemoryForensicsModel {
  hasDocumentedMemory: boolean;
  scopeExplanation: string;
  memoryProcesses: ScenarioProcessEntry[];
  memoryBlocks: Array<
    ScenarioMemoryBlock & {
      processId: string;
      processName: string;
      processPid: number;
    }
  >;
  relatedProcessTree: ScenarioProcessEntry[];
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
      memoryProcesses: [],
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
      memoryProcesses: [],
      memoryBlocks: [],
      relatedProcessTree: [],
    };
  }

  const memoryBlocks = allMemoryProcesses.flatMap((proc) =>
    (proc.memoryBlocks || []).map((mb) => ({
      ...mb,
      processId: String(proc.pid),
      processName: proc.name,
      processPid: proc.pid,
    }))
  );

  return {
    hasDocumentedMemory: memoryBlocks.length > 0,
    scopeExplanation,
    memoryProcesses: allMemoryProcesses,
    memoryBlocks,
    relatedProcessTree: scenario.processTree || [],
  };
}

export interface ScopedSequenceParticipant {
  id: string;
  badge: string;
  label: string;
  sublabel: string;
  zoneLabel: string;
  roleSummary: string;
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
  receiverNodeId: string;
  receiverBadge: string;
  receiverLabel: string;
  receiverSublabel: string;
  receiverZoneLabel: string;
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

        const technicalBridge =
          `Initiator "${initiatorLabel}" (${initiatorSublabel}) invokes ${st.title} (${st.protocolOrEventId}, ${st.mitreId}) toward Receiver "${receiverLabel}" (${receiverSublabel}). ` +
          `${st.telemetryEvent.info}`;

        const underTheHood =
          `Forward Request (#${st.forwardSeq} ──▶): ${initiatorLabel} dispatches ${st.title} over ${st.protocolOrEventId}. ` +
          `${st.fromSubNode?.internalSummary || ''} ` +
          `Return Channel (◀── #${st.returnSeq}): ${st.returnDescription}`;

        const envProfile = getActiveEnvironmentProfile(activeEnvironment);
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
          receiverNodeId: st.toSubNode?.id || st.flow.toNodeId,
          receiverBadge: st.toSubNode
            ? `#${st.toSubNode.sequenceCode || st.sequenceCode} · ${st.toSubNode.actionBadge}`
            : `#${st.sequenceCode} · DST`,
          receiverLabel,
          receiverSublabel,
          receiverZoneLabel: toZone
            ? `${toZone.code} · ${toZone.title}`
            : st.toSubNode?.zoneLabel || 'Internal Pipeline',
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
          storyAnalogy: st.storyAnalogy,
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
  const scenarioGuide = buildDiagramStepGuideModel(
    scenario,
    activeStageIndex,
    'OVERVIEW',
    activeEnvironment
  );
  const stepCardByNumber = new Map(
    scenarioGuide.steps.map((s) => [s.stepNumber, s])
  );

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
      };
    });

  const exchanges: ScopedSequenceExchangeItem[] = scopedFlows.map((fl, idx) => {
    const srcNode = nodeById.get(fl.fromNodeId) || null;
    const dstNode = nodeById.get(fl.toNodeId) || null;
    const srcZone = srcNode ? zoneById.get(srcNode.zoneId) : null;
    const dstZone = dstNode ? zoneById.get(dstNode.zoneId) : null;
    const stepCard = stepCardByNumber.get(fl.stepNo) || null;
    const stageObj =
      scenario.stages[(fl.stageIndex || fl.stepNo) - 1] || scenario.stages[0];
    const taggedEv = tagTelemetryEventWithEnvironment(
      fl.telemetryEvent,
      activeEnvironment
    );

    const sequenceCode = fl.sequenceCode || `${fl.stepNo}`;
    const forwardSeq = fl.forwardSeq || `${sequenceCode}.1`;
    const returnSeq = fl.returnSeq || `${sequenceCode}.2`;

    const initiatorLabel =
      srcNode?.label || fl.telemetryEvent.sourceLabel || fl.fromNodeId;
    const receiverLabel =
      dstNode?.label || fl.telemetryEvent.targetLabel || fl.toNodeId;
    const initiatorSublabel = srcNode?.sublabel || 'Initiator Node';
    const receiverSublabel = dstNode?.sublabel || 'Receiver Node';

    const returnLabel = fl.returnLabel || 'ACK / Status Response';
    const returnDescription =
      fl.traceMeta?.returnDescription ||
      `${receiverLabel} returns ${returnLabel} back to ${initiatorLabel}.`;
    const continuationHint =
      fl.traceMeta?.continuationHint ||
      (idx < scopedFlows.length - 1
        ? `Next in kill-chain: advances to Sequence #${scopedFlows[idx + 1].stepNo} (${scopedFlows[idx + 1].label}).`
        : `Final sequence step in this scope.`);

    const plainTitle = stepCard
      ? `Seq #${sequenceCode} · ${stepCard.plainTitle}`
      : `Seq #${sequenceCode} · ${initiatorLabel} ──▶ ${receiverLabel}`;

    const storyAnalogy =
      stepCard?.storyAnalogy ||
      `Think of ${initiatorLabel} sending a direct operational command (${fl.label}) to ${receiverLabel} and waiting for confirmation (${returnLabel}) before the next stage can proceed.`;

    const technicalBridge =
      stepCard?.simpleExplanation ||
      `Initiator "${initiatorLabel}" (${initiatorSublabel}) transmits ${fl.label} (${taggedEv.protocolOrEventId}, ${taggedEv.mitreId}) to Receiver "${receiverLabel}" (${receiverSublabel}). ${taggedEv.info}`;

    const underTheHood =
      stepCard?.howItWorksInPractice ||
      `Forward Request (#${forwardSeq} ──▶): ${initiatorLabel} executes ${fl.label} toward ${receiverLabel}. Return Response (◀── #${returnSeq}): ${returnDescription}`;

    const detectionAndEvidence =
      stepCard?.detectionAndEvidence ||
      `Captured by ${taggedEv.sourceType} (${taggedEv.protocolOrEventId} · ${taggedEv.mitreId}). Raw Evidence: ${taggedEv.rawLog}`;

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
      receiverNodeId: dstNode?.id || fl.toNodeId,
      receiverBadge: dstNode
        ? `#${dstNode.chainOrder} · ${dstNode.actionBadge}`
        : `#${fl.stepNo} · DST`,
      receiverLabel,
      receiverSublabel,
      receiverZoneLabel: dstZone
        ? `${dstZone.code} · ${dstZone.title}`
        : dstNode?.zoneLabel || 'Network Zone',
      forwardFlowBadge: `#${forwardSeq} ──▶ ${fl.label}`,
      forwardPayloadSummary: taggedEv.info,
      returnFlowBadge: `◀── #${returnSeq} ${returnLabel}`,
      returnLabel,
      returnDescription,
      continuationHint,
      storyAnalogy,
      technicalBridge,
      underTheHood,
      detectionAndEvidence,
      keySpecs:
        stageSpecs.length > 0
          ? stageSpecs
          : [
              `Seq #${sequenceCode} (#${forwardSeq} / #${returnSeq})`,
              taggedEv.protocolOrEventId,
              taggedEv.mitreId,
              taggedEv.sourceType,
            ],
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

