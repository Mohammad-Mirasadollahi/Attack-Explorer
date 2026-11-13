import { DiagramNode, NodeRole, TelemetryEvent } from './attack-scenarios';

export type CanonicalFlowZone =
  | 'ATTACKER'
  | 'GATEWAY'
  | 'RELAY_KERNEL'
  | 'TARGET';

export interface VisualizerPacketRoute {
  id: string;
  event: TelemetryEvent;
  fromNode: DiagramNode;
  toNode: DiagramNode;
  pathD: string;
  xKeyframes: number[];
  yKeyframes: number[];
  midX: number;
  midY: number;
  isCurrentStep: boolean;
  isPastOrOverview: boolean;
  isCritical: boolean;
  pairIndex: number;
}

/**
 * Maps a scenario NodeRole to a canonical attack-flow archetype
 * ('Attacker', 'Gateway', 'Relay/Kernel', 'Target') for clear visual grouping.
 */
export function getCanonicalFlowZone(role: NodeRole): {
  zone: CanonicalFlowZone;
  badge: string;
} {
  switch (role) {
    case 'attacker':
      return {
        zone: 'ATTACKER',
        badge: 'ATTACKER / C2' };
    case 'firewall_siem':
    case 'dns_resolver':
      return {
        zone: 'GATEWAY',
        badge: 'GATEWAY / SENSOR' };
    case 'memory':
      return {
        zone: 'RELAY_KERNEL',
        badge: 'KERNEL / MEMORY' };
    case 'victim_host':
    case 'server':
    case 'domain_controller':
    case 'process':
    default:
      return {
        zone: 'TARGET',
        badge: 'TARGET SYSTEM' };
  }
}

/**
 * Samples N points along a quadratic Bezier curve B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
 * in SVG viewBox coordinates (1000 x 600) for smooth motion keyframe animations.
 */
export function sampleQuadraticBezier(
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
  steps: number = 9
): { xKeyframes: number[]; yKeyframes: number[] } {
  const xKeyframes: number[] = [];
  const yKeyframes: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const inv = 1 - t;
    const bx = inv * inv * x1 + 2 * inv * t * cx + t * t * x2;
    const by = inv * inv * y1 + 2 * inv * t * cy + t * t * y2;
    xKeyframes.push(Math.round(bx * 10) / 10);
    yKeyframes.push(Math.round(by * 10) / 10);
  }

  return { xKeyframes, yKeyframes };
}

/**
 * Builds SVG packet routes and Bezier motion keyframes for all telemetry events.
 */
export function buildVisualizerPacketRoutes(
  nodes: DiagramNode[],
  telemetry: TelemetryEvent[],
  currentStageIndex: number | null,
  selectedTelemetryId: string | null
): VisualizerPacketRoute[] {
  const routes: VisualizerPacketRoute[] = [];

  telemetry.forEach((ev, idx) => {
    const fromNode = nodes.find((n) => n.id === ev.sourceNodeId);
    const toNode = nodes.find((n) => n.id === ev.targetNodeId);
    if (!fromNode || !toNode) return;

    // Count prior edges between the same node pair to stagger curves & badges
    const pairIndex = routes.filter(
      (r) =>
        (r.fromNode.id === fromNode.id && r.toNode.id === toNode.id) ||
        (r.fromNode.id === toNode.id && r.toNode.id === fromNode.id)
    ).length;

    const x1 = fromNode.x * 10;
    const y1 = fromNode.y * 6;
    const x2 = toNode.x * 10;
    const y2 = toNode.y * 6;

    const directionSign = idx % 2 === 0 ? 1 : -1;
    const curveOffset = directionSign * (20 + pairIndex * 14);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 + curveOffset;

    const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    const { xKeyframes, yKeyframes } = sampleQuadraticBezier(
      x1,
      y1,
      cx,
      cy,
      x2,
      y2,
      8
    );

    const isCurrentStep =
      currentStageIndex !== null && currentStageIndex > 0
        ? ev.stageIndex === currentStageIndex
        : selectedTelemetryId === ev.id;

    const isPastOrOverview =
      currentStageIndex === null ||
      currentStageIndex === 0 ||
      ev.stageIndex <= currentStageIndex;

    const isCritical = ev.severity === 'CRITICAL' || ev.severity === 'HIGH';

    routes.push({
      id: ev.id,
      event: ev,
      fromNode,
      toNode,
      pathD,
      xKeyframes,
      yKeyframes,
      midX: cx / 10,
      midY: cy / 6,
      isCurrentStep,
      isPastOrOverview,
      isCritical,
      pairIndex });
  });

  return routes;
}
