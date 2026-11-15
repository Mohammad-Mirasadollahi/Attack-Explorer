import { AttackScenario, TelemetryEvent } from './attack-scenarios';
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
 * - Shows connected flows ("دست‌هایی که بهش وصل هستن") and neighbor nodes in minimal connected style
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
