import { AttackScenario} from './attack-scenarios';
import {
  WhiteboardSketchFlow,
  WhiteboardSketchNode } from './sketch-zones-and-drilldown';

export type CinematicPhase =
  | 'OVERVIEW'
  | 'INTRO_SURVEY'
  | 'INTRO_FOCUS_ORIGIN'
  | 'STAGE_ACTIVE'
  | 'OUTRO_COMPLETE';

export interface CameraFrame {
  scale: number;
  txPct: number;
  tyPct: number;
  focusCenterX: number;
  focusCenterY: number;
  frameCode: string;
  frameTitle: string;
}

export interface NodeCinematicState {
  nodeId: string;
  role:
    | 'CURRENT_SOURCE'
    | 'CURRENT_TARGET'
    | 'ORIGIN_FOCUS'
    | 'VISITED'
    | 'FUTURE'
    | 'OVERVIEW';
  opacity: number;
  scale: number;
  yOffset: number;
  showPulseRing: boolean;
  pulseColor: string;
}

export interface FloatingNodeCallout {
  nodeId: string;
  nodeLabel: string;
  wx: number;
  wy: number;
  placement: 'TOP' | 'BOTTOM';
  stepBadge: string;
  headline: string;
  detail: string;
  forwardTag: string;
  returnTag: string;
  tone: 'crimson' | 'emerald' | 'indigo' | 'amber';
}

export interface CinematicDirectorOutput {
  phase: CinematicPhase;
  camera: CameraFrame;
  nodeStates: Record<string, NodeCinematicState>;
  activeCallout: FloatingNodeCallout | null;
  activeFlow: WhiteboardSketchFlow | null;
  originNode: WhiteboardSketchNode | null;
  finalNode: WhiteboardSketchNode | null;
  progressPct: number;
}

const BOARD_W = 1480;
const BOARD_H = 650;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function computeCameraFrameForBounds(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  targetScale: number,
  frameCode: string,
  frameTitle: string
): CameraFrame {
  const scale = clamp(Number(targetScale.toFixed(2)), 1, 1.65);
  if (scale <= 1.01) {
    return {
      scale: 1,
      txPct: 0,
      tyPct: 0,
      focusCenterX: BOARD_W / 2,
      focusCenterY: BOARD_H / 2,
      frameCode,
      frameTitle };
  }

  const focusCenterX = clamp((minX + maxX) / 2, 140, BOARD_W - 140);
  const focusCenterY = clamp((minY + maxY) / 2, 110, BOARD_H - 110);

  const px = (focusCenterX / BOARD_W) * 100;
  const py = (focusCenterY / BOARD_H) * 100;

  const maxPanX = (scale - 1) * 50;
  const maxPanY = (scale - 1) * 50;

  const rawTxPct = (50 - px) * scale;
  const rawTyPct = (50 - py) * scale;

  const txPct = Number(clamp(rawTxPct, -maxPanX, maxPanX).toFixed(2));
  const tyPct = Number(clamp(rawTyPct, -maxPanY, maxPanY).toFixed(2));

  return {
    scale,
    txPct,
    tyPct,
    focusCenterX: Math.round(focusCenterX),
    focusCenterY: Math.round(focusCenterY),
    frameCode,
    frameTitle };
}

export function computeCinematicDirectorState(
  scenario: AttackScenario,
  nodes: WhiteboardSketchNode[],
  flows: WhiteboardSketchFlow[],
  activeStageIndex: number,
  phaseOverride: CinematicPhase | null,
  autoCameraEnabled: boolean = true
): CinematicDirectorOutput {
  const originNode = nodes[0] || null;
  const finalFlow = flows[flows.length - 1] || null;
  const finalNode =
    (finalFlow && nodes.find((n) => n.id === finalFlow.toNodeId)) ||
    nodes[nodes.length - 1] ||
    null;

  const phase: CinematicPhase =
    phaseOverride || (activeStageIndex > 0 ? 'STAGE_ACTIVE' : 'OVERVIEW');

  const nodeStates: Record<string, NodeCinematicState> = {};

  if (phase === 'OVERVIEW' || phase === 'OUTRO_COMPLETE') {
    nodes.forEach((n) => {
      const isStartOrEnd =
        phase === 'OUTRO_COMPLETE' &&
        (n.id === originNode?.id || n.id === finalNode?.id);
      nodeStates[n.id] = {
        nodeId: n.id,
        role: 'OVERVIEW',
        opacity: 1,
        scale: isStartOrEnd ? 1.04 : 1,
        yOffset: 0,
        showPulseRing: isStartOrEnd,
        pulseColor: n.id === originNode?.id ? '#F59E0B' : '#10B981' };
    });

    return {
      phase,
      camera: {
        scale: 1,
        txPct: 0,
        tyPct: 0,
        focusCenterX: BOARD_W / 2,
        focusCenterY: BOARD_H / 2,
        frameCode: phase === 'OUTRO_COMPLETE' ? 'OUTRO_FULL' : 'FULL_TOPOLOGY',
        frameTitle:
          phase === 'OUTRO_COMPLETE'
            ? 'Attack Chain Complete · Full Map View'
            : 'Full Network Overview' },
      nodeStates,
      activeCallout: null,
      activeFlow: null,
      originNode,
      finalNode,
      progressPct: phase === 'OUTRO_COMPLETE' ? 100 : 0 };
  }

  if (phase === 'INTRO_SURVEY') {
    nodes.forEach((n) => {
      const isEndpoint = n.id === originNode?.id || n.id === finalNode?.id;
      nodeStates[n.id] = {
        nodeId: n.id,
        role: isEndpoint ? 'ORIGIN_FOCUS' : 'OVERVIEW',
        opacity: isEndpoint ? 1 : 0.78,
        scale: isEndpoint ? 1.06 : 0.98,
        yOffset: 0,
        showPulseRing: isEndpoint,
        pulseColor: n.id === originNode?.id ? '#E11D48' : '#6366F1' };
    });

    const titleText = `Scenario Briefing · ${originNode?.label || 'Start'} → ${finalNode?.label || 'Target'}`;
    const camera = autoCameraEnabled
      ? computeCameraFrameForBounds(160, 1320, 90, 560, 1.06, 'INTRO_SURVEY', titleText)
      : {
          scale: 1,
          txPct: 0,
          tyPct: 0,
          focusCenterX: BOARD_W / 2,
          focusCenterY: BOARD_H / 2,
          frameCode: 'INTRO_SURVEY',
          frameTitle: 'Scenario Briefing' };

    return {
      phase,
      camera,
      nodeStates,
      activeCallout: originNode
        ? {
            nodeId: originNode.id,
            nodeLabel: originNode.label,
            wx: originNode.wx,
            wy: originNode.wy,
            placement: originNode.wy < 230 ? 'BOTTOM' : 'TOP',
            stepBadge: 'ATTACK ORIGIN',
            headline: scenario.name,
            detail: scenario.shortSubtitle,
            forwardTag: '#1.1→',
            returnTag: '⇠#1.2',
            tone: 'amber' }
        : null,
      activeFlow: null,
      originNode,
      finalNode,
      progressPct: 8 };
  }

  if (phase === 'INTRO_FOCUS_ORIGIN' && originNode) {
    nodes.forEach((n) => {
      const isOrigin = n.id === originNode.id;
      nodeStates[n.id] = {
        nodeId: n.id,
        role: isOrigin ? 'ORIGIN_FOCUS' : 'FUTURE',
        opacity: isOrigin ? 1 : 0.18,
        scale: isOrigin ? 1.08 : 0.92,
        yOffset: isOrigin ? 0 : -14,
        showPulseRing: isOrigin,
        pulseColor: '#E11D48' };
    });

    const originTitle = `Origin Focus · ${originNode.label}`;
    const camera = autoCameraEnabled
      ? computeCameraFrameForBounds(
          originNode.wx - 160,
          originNode.wx + 160,
          originNode.wy - 120,
          originNode.wy + 120,
          1.45,
          'FOCUS_ORIGIN',
          originTitle
        )
      : {
          scale: 1,
          txPct: 0,
          tyPct: 0,
          focusCenterX: originNode.wx,
          focusCenterY: originNode.wy,
          frameCode: 'FOCUS_ORIGIN',
          frameTitle: `Origin · ${originNode.label}` };

    return {
      phase,
      camera,
      nodeStates,
      activeCallout: {
        nodeId: originNode.id,
        nodeLabel: originNode.label,
        wx: originNode.wx,
        wy: originNode.wy,
        placement: originNode.wy < 230 ? 'BOTTOM' : 'TOP',
        stepBadge: 'ORIGIN LOCKED',
        headline: `Initiating Attack from ${originNode.label}`,
        detail: originNode.sublabel,
        forwardTag: '#1.1→',
        returnTag: '⇠#1.2',
        tone: 'crimson' },
      activeFlow: null,
      originNode,
      finalNode,
      progressPct: 15 };
  }

  const activeFlow =
    flows.find((f) => f.isCurrentStep) ||
    flows[Math.min(Math.max(0, activeStageIndex - 1), flows.length - 1)] ||
    flows[0] ||
    null;

  const currentStageObj =
    scenario.stages.find((s) => s.index === activeStageIndex) ||
    scenario.stages[0] ||
    null;

  const visitedNodeIds = new Set<string>();
  flows.forEach((fl) => {
    if (fl.isVisible) {
      visitedNodeIds.add(fl.fromNodeId);
      visitedNodeIds.add(fl.toNodeId);
    }
  });
  if (originNode) visitedNodeIds.add(originNode.id);

  const sourceNode =
    (activeFlow && nodes.find((n) => n.id === activeFlow.fromNodeId)) ||
    originNode;
  const targetNode =
    (activeFlow && nodes.find((n) => n.id === activeFlow.toNodeId)) ||
    originNode;

  nodes.forEach((n) => {
    if (sourceNode && n.id === sourceNode.id) {
      nodeStates[n.id] = {
        nodeId: n.id,
        role: 'CURRENT_SOURCE',
        opacity: 1,
        scale: 1.05,
        yOffset: 0,
        showPulseRing: true,
        pulseColor: '#E11D48' };
    } else if (targetNode && n.id === targetNode.id) {
      nodeStates[n.id] = {
        nodeId: n.id,
        role: 'CURRENT_TARGET',
        opacity: 1,
        scale: 1.07,
        yOffset: 0,
        showPulseRing: true,
        pulseColor: '#10B981' };
    } else if (visitedNodeIds.has(n.id)) {
      nodeStates[n.id] = {
        nodeId: n.id,
        role: 'VISITED',
        opacity: 0.78,
        scale: 0.98,
        yOffset: 0,
        showPulseRing: false,
        pulseColor: '#6366F1' };
    } else {
      nodeStates[n.id] = {
        nodeId: n.id,
        role: 'FUTURE',
        opacity: 0.22,
        scale: 0.92,
        yOffset: -12,
        showPulseRing: false,
        pulseColor: '#94A3B8' };
    }
  });

  let camera: CameraFrame = {
    scale: 1,
    txPct: 0,
    tyPct: 0,
    focusCenterX: BOARD_W / 2,
    focusCenterY: BOARD_H / 2,
    frameCode: `STAGE_${activeStageIndex}`,
    frameTitle: `Stage ${activeStageIndex}` };

  if (autoCameraEnabled && sourceNode && targetNode && activeFlow) {
    const minX = Math.min(sourceNode.wx, targetNode.wx, activeFlow.controlX);
    const maxX = Math.max(sourceNode.wx, targetNode.wx, activeFlow.controlX);
    const minY = Math.min(sourceNode.wy, targetNode.wy, activeFlow.controlY);
    const maxY = Math.max(sourceNode.wy, targetNode.wy, activeFlow.controlY);

    const spanX = maxX - minX;
    const spanY = maxY - minY;

    const dynamicScale =
      spanX < 420 && spanY < 260
        ? 1.42
        : spanX < 760 && spanY < 380
        ? 1.28
        : 1.15;

    const stageFrameTitle = `Stage ${activeStageIndex}/${scenario.stages.length} · ${sourceNode.label} → ${targetNode.label}`;
    camera = computeCameraFrameForBounds(
      minX,
      maxX,
      minY,
      maxY,
      dynamicScale,
      `STAGE_${activeStageIndex}`,
      stageFrameTitle
    );
  }

  const calloutNode = targetNode || sourceNode;
  const activeCallout: FloatingNodeCallout | null =
    calloutNode && activeFlow
      ? {
          nodeId: calloutNode.id,
          nodeLabel: calloutNode.label,
          wx: calloutNode.wx,
          wy: calloutNode.wy,
          placement: calloutNode.wy < 220 ? 'BOTTOM' : 'TOP',
          stepBadge: `STEP ${activeStageIndex} OF ${scenario.stages.length} · #${activeFlow.sequenceCode}`,
          headline: currentStageObj
            ? currentStageObj.title
            : activeFlow.label,
          detail: currentStageObj
            ? currentStageObj.subtitle
            : activeFlow.telemetryEvent.explanation,
          forwardTag: `#${activeFlow.forwardSeq}→ ${activeFlow.label}`,
          returnTag: `⇠#${activeFlow.returnSeq} ${activeFlow.returnLabel}`,
          tone: 'crimson' }
      : null;

  const totalStages = Math.max(1, scenario.stages.length);
  const progressPct = Math.round(
    clamp((activeStageIndex / totalStages) * 100, 10, 100)
  );

  return {
    phase: 'STAGE_ACTIVE',
    camera,
    nodeStates,
    activeCallout,
    activeFlow,
    originNode,
    finalNode,
    progressPct };
}
