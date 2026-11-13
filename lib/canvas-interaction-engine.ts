import {
  CurveArrowMarker,
  NetworkBackboneLink,
  NetworkZoneColumn,
  sampleBezierPointAndAngle,
  trimPointFromNodeCenter,
  WhiteboardSketchFlow,
  WhiteboardSketchNode,
} from './sketch-zones-and-drilldown';

export interface Point2D {
  x: number;
  y: number;
}

export interface NodeOffsetDelta {
  dx: number;
  dy: number;
}

export interface MarqueeBoxCoords {
  startWx: number;
  startWy: number;
  currentWx: number;
  currentWy: number;
}

export const MIN_CANVAS_ZOOM = 0.45;
export const MAX_CANVAS_ZOOM = 2.5;
export const WHITEBOARD_WIDTH = 1480;
export const WHITEBOARD_HEIGHT = 650;

/**
 * Computes new zoom scale from mouse wheel / trackpad deltaY.
 * Negative deltaY (scroll up) zooms in; positive deltaY (scroll down) zooms out.
 */
export function computeScrollWheelZoom(
  currentZoom: number,
  deltaY: number,
  minZoom: number = MIN_CANVAS_ZOOM,
  maxZoom: number = MAX_CANVAS_ZOOM
): number {
  if (deltaY === 0 || Number.isNaN(deltaY)) return currentZoom;
  // Normalize wheel delta so both discrete mouse wheels (~100) and smooth trackpads (~10-30) feel natural
  const clampedDelta = Math.max(-160, Math.min(160, deltaY));
  const zoomFactor = Math.exp(-clampedDelta * 0.0014);
  const nextZoom = currentZoom * zoomFactor;
  return Math.round(Math.max(minZoom, Math.min(maxZoom, nextZoom)) * 100) / 100;
}

/**
 * Applies user-dragged position deltas (dx, dy) to nodes in the 1480x650 whiteboard space.
 */
export function applyNodePositionOffsets(
  nodes: WhiteboardSketchNode[],
  offsets: Record<string, NodeOffsetDelta>
): WhiteboardSketchNode[] {
  return nodes.map((node) => {
    const delta = offsets[node.id];
    if (!delta || (delta.dx === 0 && delta.dy === 0)) {
      return node;
    }
    const nextWx = Math.round(
      Math.max(55, Math.min(WHITEBOARD_WIDTH - 55, node.wx + delta.dx)) * 10
    ) / 10;
    const nextWy = Math.round(
      Math.max(45, Math.min(WHITEBOARD_HEIGHT - 45, node.wy + delta.dy)) * 10
    ) / 10;
    return {
      ...node,
      wx: nextWx,
      wy: nextWy,
    };
  });
}

/**
 * Applies user-dragged position deltas (dx, dy) to network zone containers.
 */
export function applyZonePositionOffsets(
  zones: NetworkZoneColumn[],
  zoneOffsets: Record<string, NodeOffsetDelta>
): NetworkZoneColumn[] {
  return zones.map((zone) => {
    const delta = zoneOffsets[zone.id];
    if (!delta || (delta.dx === 0 && delta.dy === 0)) {
      return zone;
    }
    const yStart = zone.yStart ?? 18;
    const yEnd = zone.yEnd ?? 632;
    return {
      ...zone,
      xStart: Math.round((zone.xStart + delta.dx) * 10) / 10,
      xEnd: Math.round((zone.xEnd + delta.dx) * 10) / 10,
      yStart: Math.round((yStart + delta.dy) * 10) / 10,
      yEnd: Math.round((yEnd + delta.dy) * 10) / 10,
    };
  });
}

/**
 * Updates offsets for all nodes in selectedNodeIds by (deltaWx, deltaWy).
 * Supports both single-node drag and Windows-style multi-selected group drag.
 */
export function moveSelectedNodesByDelta(
  selectedNodeIds: Iterable<string>,
  currentOffsets: Record<string, NodeOffsetDelta>,
  deltaWx: number,
  deltaWy: number
): Record<string, NodeOffsetDelta> {
  const next: Record<string, NodeOffsetDelta> = { ...currentOffsets };
  for (const id of selectedNodeIds) {
    const prev = next[id] || { dx: 0, dy: 0 };
    next[id] = {
      dx: Math.round((prev.dx + deltaWx) * 10) / 10,
      dy: Math.round((prev.dy + deltaWy) * 10) / 10,
    };
  }
  return next;
}

/**
 * Windows-style Marquee Box Selection:
 * Finds all nodes whose bounding card intersects the marquee selection rectangle
 * in whiteboard coordinates (1480 x 650).
 */
export function computeMarqueeSelectedNodeIds(
  nodes: WhiteboardSketchNode[],
  marquee: MarqueeBoxCoords,
  nodeHalfWidth: number = 88,
  nodeHalfHeight: number = 52
): string[] {
  const minX = Math.min(marquee.startWx, marquee.currentWx);
  const maxX = Math.max(marquee.startWx, marquee.currentWx);
  const minY = Math.min(marquee.startWy, marquee.currentWy);
  const maxY = Math.max(marquee.startWy, marquee.currentWy);

  // Require at least a small drag threshold to count as a box selection
  if (maxX - minX < 6 && maxY - minY < 6) {
    return [];
  }

  return nodes
    .filter((node) => {
      const nodeLeft = node.wx - nodeHalfWidth;
      const nodeRight = node.wx + nodeHalfWidth;
      const nodeTop = node.wy - nodeHalfHeight;
      const nodeBottom = node.wy + nodeHalfHeight;

      const overlapsX = nodeRight >= minX && nodeLeft <= maxX;
      const overlapsY = nodeBottom >= minY && nodeTop <= maxY;
      return overlapsX && overlapsY;
    })
    .map((n) => n.id);
}

/**
 * Dynamically recomputes all attack flow Bezier paths, arrowheads, packet keyframes,
 * and backbone link endpoints when one or more nodes have been dragged to new positions.
 */
export function recomputeGeometryForMovedBoard(
  originalNodes: WhiteboardSketchNode[],
  movedNodes: WhiteboardSketchNode[],
  originalFlows: WhiteboardSketchFlow[],
  originalBackboneLinks: NetworkBackboneLink[]
): {
  flows: WhiteboardSketchFlow[];
  backboneLinks: NetworkBackboneLink[];
} {
  const movedMap = new Map<string, WhiteboardSketchNode>();
  for (const n of movedNodes) {
    movedMap.set(n.id, n);
  }

  // Recompute bidirectional flow curves between moved nodes
  const flows = originalFlows.map((flow) => {
    const fromNode = movedMap.get(flow.fromNodeId);
    const toNode = movedMap.get(flow.toNodeId);
    if (!fromNode || !toNode) return flow;

    const origFrom = originalNodes.find((n) => n.id === flow.fromNodeId);
    const origTo = originalNodes.find((n) => n.id === flow.toNodeId);
    if (
      origFrom &&
      origTo &&
      origFrom.wx === fromNode.wx &&
      origFrom.wy === fromNode.wy &&
      origTo.wx === toNode.wx &&
      origTo.wy === toNode.wy
    ) {
      return flow;
    }

    const rawFromX = fromNode.wx;
    const rawFromY = fromNode.wy;
    const rawToX = toNode.wx;
    const rawToY = toNode.wy;

    const dx = rawToX - rawFromX;
    const dy = rawToY - rawFromY;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    const midX = (rawFromX + rawToX) / 2;
    const midY = (rawFromY + rawToY) / 2;

    const curveOffset = -38;
    const returnOffset = 38;

    const controlX = Math.round((midX + nx * curveOffset) * 10) / 10;
    const controlY = Math.round((midY + ny * curveOffset) * 10) / 10;

    const trimmedFrom = trimPointFromNodeCenter(
      rawFromX,
      rawFromY,
      controlX,
      controlY,
      52
    );
    const trimmedTo = trimPointFromNodeCenter(
      rawToX,
      rawToY,
      controlX,
      controlY,
      56
    );
    const fromX = trimmedFrom.x;
    const fromY = trimmedFrom.y;
    const toX = trimmedTo.x;
    const toY = trimmedTo.y;

    const pathD = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

    const returnControlX = Math.round((midX + nx * returnOffset) * 10) / 10;
    const returnControlY = Math.round((midY + ny * returnOffset) * 10) / 10;

    const trimmedRetFrom = trimPointFromNodeCenter(
      rawToX,
      rawToY,
      returnControlX,
      returnControlY,
      52
    );
    const trimmedRetTo = trimPointFromNodeCenter(
      rawFromX,
      rawFromY,
      returnControlX,
      returnControlY,
      56
    );

    const returnPathD = `M ${trimmedRetFrom.x} ${trimmedRetFrom.y} Q ${returnControlX} ${returnControlY} ${trimmedRetTo.x} ${trimmedRetTo.y}`;

    const forwardArrows: CurveArrowMarker[] = [0.22, 0.78, 0.98].map((t) =>
      sampleBezierPointAndAngle(fromX, fromY, controlX, controlY, toX, toY, t)
    );
    const returnArrows: CurveArrowMarker[] = [0.22, 0.78, 0.98].map((t) =>
      sampleBezierPointAndAngle(
        trimmedRetFrom.x,
        trimmedRetFrom.y,
        returnControlX,
        returnControlY,
        trimmedRetTo.x,
        trimmedRetTo.y,
        t
      )
    );

    const xKeyframes: number[] = [];
    const yKeyframes: number[] = [];
    const returnXKeyframes: number[] = [];
    const returnYKeyframes: number[] = [];
    const steps = 8;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const inv = 1 - t;
      xKeyframes.push(
        Math.round(
          (inv * inv * fromX + 2 * inv * t * controlX + t * t * toX) * 10
        ) / 10
      );
      yKeyframes.push(
        Math.round(
          (inv * inv * fromY + 2 * inv * t * controlY + t * t * toY) * 10
        ) / 10
      );
      returnXKeyframes.push(
        Math.round(
          (inv * inv * trimmedRetFrom.x +
            2 * inv * t * returnControlX +
            t * t * trimmedRetTo.x) *
            10
        ) / 10
      );
      returnYKeyframes.push(
        Math.round(
          (inv * inv * trimmedRetFrom.y +
            2 * inv * t * returnControlY +
            t * t * trimmedRetTo.y) *
            10
        ) / 10
      );
    }

    return {
      ...flow,
      fromX,
      fromY,
      toX,
      toY,
      controlX,
      controlY,
      pathD,
      xKeyframes,
      yKeyframes,
      forwardArrows,
      returnControlX,
      returnControlY,
      returnPathD,
      returnXKeyframes,
      returnYKeyframes,
      returnArrows,
    };
  });

  // Recompute backbone link endpoints that correspond to moved nodes
  const backboneLinks = originalBackboneLinks.map((link) => {
    let nextX1 = link.x1;
    let nextY1 = link.y1;
    let nextX2 = link.x2;
    let nextY2 = link.y2;

    for (let i = 0; i < originalNodes.length; i++) {
      const orig = originalNodes[i];
      const moved = movedNodes[i];
      if (!orig || !moved) continue;
      if (Math.hypot(link.x1 - orig.wx, link.y1 - orig.wy) <= 4) {
        nextX1 = moved.wx;
        nextY1 = moved.wy;
      }
      if (Math.hypot(link.x2 - orig.wx, link.y2 - orig.wy) <= 4) {
        nextX2 = moved.wx;
        nextY2 = moved.wy;
      }
    }

    if (
      nextX1 === link.x1 &&
      nextY1 === link.y1 &&
      nextX2 === link.x2 &&
      nextY2 === link.y2
    ) {
      return link;
    }

    return {
      ...link,
      x1: nextX1,
      y1: nextY1,
      x2: nextX2,
      y2: nextY2,
    };
  });

  return { flows, backboneLinks };
}
