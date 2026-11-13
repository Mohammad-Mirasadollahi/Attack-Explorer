import { AttackScenario } from './attack-scenarios';
import {
  WhiteboardSketchFlow,
  WhiteboardSketchNode } from './sketch-zones-and-drilldown';

export type WalkthroughPhase =
  | 'IDLE_OVERVIEW'
  | 'INTRO_BRIEFING'
  | 'START_NODE_FOCUS'
  | 'STAGE_ACTIVE'
  | 'OUTRO_COMPLETE';

export interface CameraTargetFrame {
  scale: number;
  txPct: number;
  tyPct: number;
  frameId: string;
  focusTitle: string;
  focusSubtitle: string;
  activeNodeIds: string[];
  newlyRevealedNodeIds: string[];
  visibleNodeIds: string[];
  futureNodeIds: string[];
}

export interface FloatingNodeCallout {
  id: string;
  nodeId: string;
  x: number;
  y: number;
  placement: 'ABOVE' | 'BELOW';
  stepBadge: string;
  title: string;
  detail: string;
  tone: 'crimson' | 'sky' | 'emerald' | 'amber' | 'violet';
}

export interface CometPacketCapsule {
  flowId: string;
  stepCode: string;
  forwardHeader: string;
  forwardPayloadLines: [string, string];
  returnHeader: string;
  returnPayloadLine: string;
  sourceNodeX: number;
  sourceNodeY: number;
  targetNodeX: number;
  targetNodeY: number;
}

const BOARD_W = 1480;
const BOARD_H = 650;
const CENTER_X = BOARD_W / 2;
const CENTER_Y = BOARD_H / 2;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function computeBoundingBoxCamera(
  points: Array<{ x: number; y: number }>,
  desiredMinScale = 1.22,
  desiredMaxScale = 1.62
): { scale: number; txPct: number; tyPct: number } {
  if (points.length === 0) {
    return { scale: 1, txPct: 0, tyPct: 0 };
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const bboxW = Math.max(280, maxX - minX + 340);
  const bboxH = Math.max(220, maxY - minY + 250);

  const rawScale = Math.min(BOARD_W / bboxW, BOARD_H / bboxH);
  const scale = Number(
    clamp(rawScale, desiredMinScale, desiredMaxScale).toFixed(3)
  );

  const targetCx = (minX + maxX) / 2;
  const targetCy = (minY + maxY) / 2;

  const rawTxPct = ((-scale * (targetCx - CENTER_X)) / BOARD_W) * 100;
  const rawTyPct = ((-scale * (targetCy - CENTER_Y)) / BOARD_H) * 100;

  const maxPanX = Math.max(0, (scale - 1) * 46);
  const maxPanY = Math.max(0, (scale - 1) * 44);

  return {
    scale,
    txPct: Number(clamp(rawTxPct, -maxPanX, maxPanX).toFixed(2)),
    tyPct: Number(clamp(rawTyPct, -maxPanY, maxPanY).toFixed(2)) };
}

export function computeScenarioChoreography(
  scenario: AttackScenario,
  nodes: WhiteboardSketchNode[],
  flows: WhiteboardSketchFlow[],
  activeStageIndex: number,
  walkthroughPhase: WalkthroughPhase,
  autoCameraEnabled = true
): {
  camera: CameraTargetFrame;
  callout: FloatingNodeCallout | null;
  activePacket: CometPacketCapsule | null;
} {
  const allNodeIds = nodes.map((n) => n.id);
  const firstNode = nodes[0] || null;
  const lastNode = nodes[nodes.length - 1] || firstNode;

  if (
    walkthroughPhase === 'IDLE_OVERVIEW' ||
    walkthroughPhase === 'OUTRO_COMPLETE' ||
    (activeStageIndex === 0 &&
      walkthroughPhase !== 'INTRO_BRIEFING' &&
      walkthroughPhase !== 'START_NODE_FOCUS')
  ) {
    const titleEn =
      walkthroughPhase === 'OUTRO_COMPLETE'
        ? `Attack Chain Complete · ${scenario.stages.length} Stages Executed`
        : `Full Topology Overview · ${scenario.name}`;
    const subEn =
      walkthroughPhase === 'OUTRO_COMPLETE'
        ? `From ${firstNode?.label || 'Entry'} to ${
            lastNode?.label || 'Target'
          } — Press Replay to watch again`
        : scenario.shortSubtitle;
    return {
      camera: {
        scale: 1,
        txPct: 0,
        tyPct: 0,
        frameId: walkthroughPhase === 'OUTRO_COMPLETE' ? 'outro-full' : 'full',
        focusTitle: titleEn,
        focusSubtitle: subEn,
        activeNodeIds: allNodeIds,
        newlyRevealedNodeIds: [],
        visibleNodeIds: allNodeIds,
        futureNodeIds: [] },
      callout: null,
      activePacket: null };
  }

  if (walkthroughPhase === 'INTRO_BRIEFING') {
    const titleEn = `Mission Briefing: ${scenario.name}`;
    const subEn = `Origin: ${firstNode?.label || 'Attacker'} → Objective: ${
      lastNode?.label || 'Target'
    }`;
    const calloutTitle = firstNode ? `Entry Point: ${firstNode.label}` : '';
    const calloutDetail = firstNode
      ? `Attack initiates from ${firstNode.label} (${firstNode.sublabel})`
      : '';
    return {
      camera: {
        scale: 1.04,
        txPct: 0,
        tyPct: 0,
        frameId: 'intro-briefing',
        focusTitle: titleEn,
        focusSubtitle: subEn,
        activeNodeIds: firstNode ? [firstNode.id] : allNodeIds,
        newlyRevealedNodeIds: firstNode ? [firstNode.id] : [],
        visibleNodeIds: allNodeIds,
        futureNodeIds: [] },
      callout: firstNode
        ? {
            id: `callout-intro-${firstNode.id}`,
            nodeId: firstNode.id,
            x: firstNode.wx,
            y: firstNode.wy,
            placement: firstNode.wy > 220 ? 'ABOVE' : 'BELOW',
            stepBadge: 'START',
            title: calloutTitle,
            detail: calloutDetail,
            tone: 'amber' }
        : null,
      activePacket: null };
  }

  if (walkthroughPhase === 'START_NODE_FOCUS' && firstNode) {
    const cam = autoCameraEnabled
      ? computeBoundingBoxCamera(
          [{ x: firstNode.wx, y: firstNode.wy }],
          1.45,
          1.62
        )
      : { scale: 1, txPct: 0, tyPct: 0 };

    const titleEn = `Origin Point · ${firstNode.label}`;
    const subEn = `Preparing Stage 1 payload on ${firstNode.sublabel}`;
    const calloutTitle = `Stage 0 · Initial Staging at ${firstNode.label}`;
    const calloutDetail = `${firstNode.label} initializes the attack vector (${scenario.code})`;

    return {
      camera: {
        ...cam,
        frameId: `start-node-${firstNode.id}`,
        focusTitle: titleEn,
        focusSubtitle: subEn,
        activeNodeIds: [firstNode.id],
        newlyRevealedNodeIds: [firstNode.id],
        visibleNodeIds: [firstNode.id],
        futureNodeIds: allNodeIds.filter((id) => id !== firstNode.id) },
      callout: {
        id: `callout-start-${firstNode.id}`,
        nodeId: firstNode.id,
        x: firstNode.wx,
        y: firstNode.wy,
        placement: firstNode.wy > 210 ? 'ABOVE' : 'BELOW',
        stepBadge: `#${firstNode.sequenceCode || '1'}`,
        title: calloutTitle,
        detail: calloutDetail,
        tone: 'crimson' },
      activePacket: null };
  }

  const currentFlows = flows.filter((f) => f.isCurrentStep);
  const primaryFlow =
    currentFlows[0] ||
    flows[Math.min(Math.max(0, activeStageIndex - 1), flows.length - 1)] ||
    null;

  const reachedNodeIds = new Set<string>();
  const priorNodeIds = new Set<string>();
  if (firstNode) {
    reachedNodeIds.add(firstNode.id);
    if (activeStageIndex > 1) priorNodeIds.add(firstNode.id);
  }

  flows.forEach((f, idx) => {
    const flowStage = f.telemetryEvent?.stageIndex || idx + 1;
    if (flowStage <= activeStageIndex || f.isCurrentStep) {
      reachedNodeIds.add(f.fromNodeId);
      reachedNodeIds.add(f.toNodeId);
    }
    if (flowStage < activeStageIndex && !f.isCurrentStep) {
      priorNodeIds.add(f.fromNodeId);
      priorNodeIds.add(f.toNodeId);
    }
  });

  const activeStageNodeIds = new Set<string>();
  if (primaryFlow) {
    activeStageNodeIds.add(primaryFlow.fromNodeId);
    activeStageNodeIds.add(primaryFlow.toNodeId);
  }
  currentFlows.forEach((cf) => {
    activeStageNodeIds.add(cf.fromNodeId);
    activeStageNodeIds.add(cf.toNodeId);
  });

  nodes.forEach((n) => {
    if (n.isActive) {
      activeStageNodeIds.add(n.id);
      reachedNodeIds.add(n.id);
    }
  });

  if (reachedNodeIds.size === 0) {
    allNodeIds.forEach((id) => reachedNodeIds.add(id));
  }

  const newlyRevealedNodeIds = Array.from(activeStageNodeIds).filter(
    (id) => !priorNodeIds.has(id)
  );
  const visibleNodeIds = Array.from(reachedNodeIds);
  const futureNodeIds = allNodeIds.filter((id) => !reachedNodeIds.has(id));

  const focusPoints: Array<{ x: number; y: number }> = [];
  nodes.forEach((n) => {
    if (activeStageNodeIds.has(n.id)) {
      focusPoints.push({ x: n.wx, y: n.wy });
    }
  });
  if (primaryFlow) {
    focusPoints.push({ x: primaryFlow.fromX, y: primaryFlow.fromY });
    focusPoints.push({ x: primaryFlow.toX, y: primaryFlow.toY });
    focusPoints.push({ x: primaryFlow.controlX, y: primaryFlow.controlY });
  }

  const cam = autoCameraEnabled
    ? computeBoundingBoxCamera(focusPoints, 1.24, 1.54)
    : { scale: 1, txPct: 0, tyPct: 0 };

  const stageObj =
    scenario.stages.find((s) => s.index === activeStageIndex) ||
    scenario.stages[0];

  const targetNode =
    nodes.find((n) => n.id === primaryFlow?.toNodeId) ||
    nodes.find((n) => activeStageNodeIds.has(n.id)) ||
    firstNode;
  const sourceNode =
    nodes.find((n) => n.id === primaryFlow?.fromNodeId) || firstNode;

  const calloutTitleEn = stageObj
    ? stageObj.title
    : targetNode?.label || '';
  const calloutDetailEn =
    primaryFlow && targetNode
      ? `${sourceNode?.label || 'Source'} → ${targetNode.label}: ${
          primaryFlow.traceMeta?.forwardAction || primaryFlow.label
        }`
      : stageObj?.subtitle || '';

  const callout: FloatingNodeCallout | null = targetNode
    ? {
        id: `callout-stage-${activeStageIndex}-${targetNode.id}`,
        nodeId: targetNode.id,
        x: targetNode.wx,
        y: targetNode.wy,
        placement: targetNode.wy > 220 ? 'ABOVE' : 'BELOW',
        stepBadge: primaryFlow
          ? `#${primaryFlow.sequenceCode}`
          : `S${activeStageIndex}`,
        title: calloutTitleEn,
        detail: calloutDetailEn,
        tone: targetNode.isCompromised
          ? 'crimson'
          : targetNode.isNetworkDevice
          ? 'amber'
          : 'sky' }
    : null;

  const activePacket: CometPacketCapsule | null = primaryFlow
    ? {
        flowId: primaryFlow.id,
        stepCode: primaryFlow.sequenceCode,
        forwardHeader: `#${primaryFlow.forwardSeq}→ ${primaryFlow.label}`,
        forwardPayloadLines: [
          `${primaryFlow.telemetryEvent.sourceType} · ${primaryFlow.telemetryEvent.protocolOrEventId}`,
          `${sourceNode?.label || 'SRC'} → ${targetNode?.label || 'DST'}`,
        ],
        returnHeader: `⇠#${primaryFlow.returnSeq} ${primaryFlow.returnLabel}`,
        returnPayloadLine:
          primaryFlow.traceMeta?.returnDescription || primaryFlow.returnLabel,
        sourceNodeX: primaryFlow.fromX,
        sourceNodeY: primaryFlow.fromY,
        targetNodeX: primaryFlow.toX,
        targetNodeY: primaryFlow.toY }
    : null;

  const focusTitleEn = `Step ${activeStageIndex}/${scenario.stages.length} · ${
    stageObj?.title || ''
  }`;
  const focusSubEn = `${sourceNode?.label || 'Source'} → ${
    targetNode?.label || 'Target'
  } (${stageObj?.mitreTechniqueId || scenario.code})`;

  return {
    camera: {
      ...cam,
      frameId: `stage-${activeStageIndex}-${primaryFlow?.id || 'main'}`,
      focusTitle: focusTitleEn,
      focusSubtitle: focusSubEn,
      activeNodeIds: Array.from(activeStageNodeIds),
      newlyRevealedNodeIds,
      visibleNodeIds,
      futureNodeIds },
    callout,
    activePacket };
}

export function getToneColors(tone: FloatingNodeCallout['tone']): {
  bg: string;
  border: string;
  dot: string;
  badgeBg: string;
} {
  switch (tone) {
    case 'crimson':
      return {
        bg: '#0F172A',
        border: '#E11D48',
        dot: '#FB7185',
        badgeBg: '#E11D48' };
    case 'amber':
      return {
        bg: '#0F172A',
        border: '#F59E0B',
        dot: '#FBBF24',
        badgeBg: '#D97706' };
    case 'emerald':
      return {
        bg: '#0F172A',
        border: '#10B981',
        dot: '#34D399',
        badgeBg: '#059669' };
    case 'violet':
      return {
        bg: '#0F172A',
        border: '#8B5CF6',
        dot: '#A78BFA',
        badgeBg: '#7C3AED' };
    default:
      return {
        bg: '#0F172A',
        border: '#0284C7',
        dot: '#38BDF8',
        badgeBg: '#0284C7' };
  }
}
