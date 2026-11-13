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

export interface CanvasHoldInteractionResult {
  mode: 'SELECT' | 'PAN';
  useMarqueeSelection: boolean;
  useCanvasPan: boolean;
}

/**
 * Resolves the active pointer hold interaction mode on the workspace canvas:
 * - Right-click & hold (`button === 2`) -> switches to `'SELECT'` (Box Select / Marquee mode)
 * - Left-click & hold (`button === 0` without modifier keys) -> switches to `'PAN'` (Pan Page mode)
 * - Left-click & hold with Shift/Ctrl/Meta modifier -> `'SELECT'` (Box Select / Marquee mode)
 */
export function resolveCanvasHoldInteractionMode(params: {
  button: number;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
}): CanvasHoldInteractionResult {
  const { button, shiftKey = false, ctrlKey = false, metaKey = false } = params;

  if (button === 2 || shiftKey || ctrlKey || metaKey) {
    return {
      mode: 'SELECT',
      useMarqueeSelection: true,
      useCanvasPan: false,
    };
  }

  return {
    mode: 'PAN',
    useMarqueeSelection: false,
    useCanvasPan: true,
  };
}

/**
 * Computes new zoom scale from mouse wheel / trackpad deltaY.
 * Negative deltaY (scroll up) zooms in gradually (~5% per notch);
 * positive deltaY (scroll down) zooms out gradually (~5% per notch).
 */
export function computeScrollWheelZoom(
  currentZoom: number,
  deltaY: number,
  minZoom: number = MIN_CANVAS_ZOOM,
  maxZoom: number = MAX_CANVAS_ZOOM
): number {
  if (deltaY === 0 || Number.isNaN(deltaY)) return currentZoom;
  // Normalize wheel delta so discrete mouse wheel notches (~100-120) change zoom by ~5% per step
  // and smooth trackpad gestures (~4-25) change zoom proportionally by ~0.4%-2% per tick.
  const clampedDelta = Math.max(-60, Math.min(60, deltaY));
  const zoomFactor = Math.exp(-clampedDelta * 0.00085);
  const nextZoom = currentZoom * zoomFactor;
  return (
    Math.round(Math.max(minZoom, Math.min(maxZoom, nextZoom)) * 1000) / 1000
  );
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
    const nextWx =
      Math.round(
        Math.max(-4000, Math.min(WHITEBOARD_WIDTH + 4000, node.wx + delta.dx)) *
          10
      ) / 10;
    const nextWy =
      Math.round(
        Math.max(
          -4000,
          Math.min(WHITEBOARD_HEIGHT + 4000, node.wy + delta.dy)
        ) * 10
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

export interface MinimapViewportRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Computes the visible viewport indicator rectangle in whiteboard coordinates (1480x650)
 * from the current panOffset (px), effectiveScale, and container dimensions.
 */
export function computeMinimapViewportRect(params: {
  panX: number;
  panY: number;
  zoomScale: number;
  containerWidth?: number;
  containerHeight?: number;
}): MinimapViewportRect {
  const safeScale = Math.max(
    MIN_CANVAS_ZOOM,
    Math.min(MAX_CANVAS_ZOOM, Number.isFinite(params.zoomScale) ? params.zoomScale : 1)
  );
  const cWidth = Math.max(320, params.containerWidth || 1000);
  const cHeight = Math.max(220, params.containerHeight || 550);

  const viewWidth = Math.round((WHITEBOARD_WIDTH / safeScale) * 10) / 10;
  const viewHeight = Math.round((WHITEBOARD_HEIGHT / safeScale) * 10) / 10;

  // Convert pixel pan offset into whiteboard coordinate offset
  const rawX =
    ((-params.panX / cWidth) * WHITEBOARD_WIDTH) / safeScale;
  const rawY =
    ((-params.panY / cHeight) * WHITEBOARD_HEIGHT) / safeScale;

  // Clamp so the viewport frame remains discoverable within the minimap
  const minX = -WHITEBOARD_WIDTH * 0.35;
  const maxX = WHITEBOARD_WIDTH * 0.85;
  const minY = -WHITEBOARD_HEIGHT * 0.35;
  const maxY = WHITEBOARD_HEIGHT * 0.85;

  const clampedX = Math.round(Math.max(minX, Math.min(maxX, rawX)) * 10) / 10;
  const clampedY = Math.round(Math.max(minY, Math.min(maxY, rawY)) * 10) / 10;

  return {
    x: Object.is(clampedX, -0) ? 0 : clampedX,
    y: Object.is(clampedY, -0) ? 0 : clampedY,
    width: viewWidth,
    height: viewHeight,
  };
}

/**
 * Converts a target whiteboard point (wx, wy) clicked or dragged on the minimap
 * into the corresponding main-canvas pixel panOffset { x, y } so that (wx, wy)
 * is centered in the user's viewport.
 */
export function computePanFromMinimapPoint(params: {
  targetWx: number;
  targetWy: number;
  zoomScale: number;
  containerWidth?: number;
  containerHeight?: number;
}): Point2D {
  const safeScale = Math.max(
    MIN_CANVAS_ZOOM,
    Math.min(MAX_CANVAS_ZOOM, Number.isFinite(params.zoomScale) ? params.zoomScale : 1)
  );
  const cWidth = Math.max(320, params.containerWidth || 1000);
  const cHeight = Math.max(220, params.containerHeight || 550);

  const viewWidth = WHITEBOARD_WIDTH / safeScale;
  const viewHeight = WHITEBOARD_HEIGHT / safeScale;

  const desiredTopLeftWx = params.targetWx - viewWidth / 2;
  const desiredTopLeftWy = params.targetWy - viewHeight / 2;

  const panX = Math.round(
    (-desiredTopLeftWx * safeScale * cWidth) / WHITEBOARD_WIDTH
  );
  const panY = Math.round(
    (-desiredTopLeftWy * safeScale * cHeight) / WHITEBOARD_HEIGHT
  );

  return {
    x: Object.is(panX, -0) ? 0 : panX,
    y: Object.is(panY, -0) ? 0 : panY,
  };
}

export type ForceLayoutPresetMode = 'BALANCED' | 'SPACIOUS';

export interface ForceDirectedLayoutResult {
  nodeOffsets: Record<string, NodeOffsetDelta>;
  zoneOffsets: Record<string, NodeOffsetDelta>;
  laidOutNodes: WhiteboardSketchNode[];
  minPairwiseDistance: number;
  overlapCount: number;
  iterations: number;
  mode: ForceLayoutPresetMode;
}

/**
 * Computes a deterministic Force-Directed Auto-Layout for the attack graph nodes.
 * Combines:
 * 1. Elliptical Coulomb repulsion between all node pairs (card-dimension aware so wide node cards never overlap).
 * 2. Hooke spring attraction along attack flows & sequential kill-chain edges toward an optimal readable length.
 * 3. Edge-to-node clearance repulsion so non-incident nodes are pushed off flow paths.
 * 4. Topological Zone-Column & vertical tier balancing forces so left-to-right kill-chain flow remains clear.
 */
export function computeForceDirectedNodeLayout(params: {
  nodes: WhiteboardSketchNode[];
  flows: WhiteboardSketchFlow[];
  zones?: NetworkZoneColumn[];
  mode?: ForceLayoutPresetMode;
  iterations?: number;
}): ForceDirectedLayoutResult {
  const {
    nodes,
    flows,
    zones = [],
    mode = 'BALANCED',
    iterations = 95,
  } = params;

  if (nodes.length === 0) {
    return {
      nodeOffsets: {},
      zoneOffsets: {},
      laidOutNodes: [],
      minPairwiseDistance: 0,
      overlapCount: 0,
      iterations: 0,
      mode,
    };
  }

  const nCount = nodes.length;
  const isSpacious = mode === 'SPACIOUS';

  // Zone horizontal centers & vertical targets
  const zoneMap = new Map<string, NetworkZoneColumn>();
  for (const z of zones) {
    zoneMap.set(z.id, z);
  }

  // Group nodes by zone to assign distinct vertical initial bands so same-zone nodes never collide
  const zoneGroups = new Map<string, WhiteboardSketchNode[]>();
  for (const node of nodes) {
    const list = zoneGroups.get(node.zoneId) || [];
    list.push(node);
    zoneGroups.set(node.zoneId, list);
  }
  for (const list of zoneGroups.values()) {
    list.sort((a, b) => a.chainOrder - b.chainOrder);
  }

  // Build initial seed positions with deterministic harmonic staggering
  const posX = new Float64Array(nCount);
  const posY = new Float64Array(nCount);
  const targetAnchorX = new Float64Array(nCount);
  const targetAnchorY = new Float64Array(nCount);

  for (let i = 0; i < nCount; i++) {
    const node = nodes[i];
    const zone = zoneMap.get(node.zoneId);
    const sameZoneList = zoneGroups.get(node.zoneId) || [node];
    const rankInZone = sameZoneList.findIndex((item) => item.id === node.id);
    const countInZone = sameZoneList.length;

    const zStart = zone ? zone.xStart : Math.max(40, node.wx - 150);
    const zEnd = zone ? zone.xEnd : Math.min(WHITEBOARD_WIDTH - 40, node.wx + 150);
    const zCenter = (zStart + zEnd) / 2;

    // Horizontal offset within the zone when multiple nodes share a zone
    const intraZoneXSpread =
      countInZone > 1
        ? (rankInZone - (countInZone - 1) / 2) * (isSpacious ? 44 : 28)
        : 0;
    const anchorX = Math.max(
      125,
      Math.min(WHITEBOARD_WIDTH - 125, zCenter + intraZoneXSpread)
    );

    // Vertical band distribution with alternating wave across chainOrder so cross-zone Bezier flows arch cleanly
    let anchorY: number;
    if (countInZone === 1) {
      const wavePattern = [185, 455, 225, 435, 195, 465];
      const spPattern = [145, 495, 195, 465, 165, 505];
      const pattern = isSpacious ? spPattern : wavePattern;
      anchorY = pattern[(node.chainOrder - 1) % pattern.length] ?? 325;
    } else {
      const topBound = isSpacious ? 145 : 175;
      const bottomBound = isSpacious ? 515 : 485;
      const frac = rankInZone / Math.max(1, countInZone - 1);
      anchorY = topBound + frac * (bottomBound - topBound);
    }

    targetAnchorX[i] = anchorX;
    targetAnchorY[i] = anchorY;

    // Seed simulation midway between current position and ideal harmonic anchor
    posX[i] = node.wx * 0.35 + anchorX * 0.65;
    posY[i] = node.wy * 0.35 + anchorY * 0.65;
  }

  // Build adjacency list from flows + sequential chainOrder edges
  const nodeIndexById = new Map<string, number>();
  nodes.forEach((n, idx) => nodeIndexById.set(n.id, idx));

  const edges: Array<{ u: number; v: number; idealLength: number; strength: number }> = [];
  const seenPairs = new Set<string>();

  for (const flow of flows) {
    const u = nodeIndexById.get(flow.fromNodeId);
    const v = nodeIndexById.get(flow.toNodeId);
    if (u === undefined || v === undefined || u === v) continue;
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    if (seenPairs.has(key)) continue;
    seenPairs.add(key);

    const sameZone = nodes[u].zoneId === nodes[v].zoneId;
    edges.push({
      u,
      v,
      idealLength: sameZone
        ? isSpacious
          ? 275
          : 245
        : isSpacious
        ? 360
        : 325,
      strength: 0.14,
    });
  }

  // Ensure sequential chainOrder connectivity
  for (let i = 0; i < nCount - 1; i++) {
    const key = `${i}-${i + 1}`;
    if (!seenPairs.has(key)) {
      seenPairs.add(key);
      const sameZone = nodes[i].zoneId === nodes[i + 1].zoneId;
      edges.push({
        u: i,
        v: i + 1,
        idealLength: sameZone ? 250 : 330,
        strength: 0.1,
      });
    }
  }

  // Minimum card bounding box clearances (cards are ~210px wide x 105px tall in 1480x650 whiteboard coords)
  const minClearanceX = isSpacious ? 245 : 225;
  const minClearanceY = isSpacious ? 165 : 145;
  const repulsionConstant = isSpacious ? 52000 : 42000;

  const forceX = new Float64Array(nCount);
  const forceY = new Float64Array(nCount);

  for (let iter = 0; iter < iterations; iter++) {
    forceX.fill(0);
    forceY.fill(0);

    // Cooling schedule (simulated annealing)
    const cooling = 1 - (iter / iterations) * 0.72;
    const maxStep = 26 * cooling;

    // 1. All-pairs Coulomb repulsion + hard elliptical card anti-overlap push
    for (let i = 0; i < nCount; i++) {
      for (let j = i + 1; j < nCount; j++) {
        let dx = posX[j] - posX[i];
        let dy = posY[j] - posY[i];
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          dx = (j - i) * 4;
          dy = (j - i) * 6;
        }

        const distSq = dx * dx + dy * dy + 60;
        const dist = Math.sqrt(distSq);
        const ux = dx / dist;
        const uy = dy / dist;

        // Standard inverse-square repulsion
        const fMag = repulsionConstant / distSq;
        forceX[i] -= ux * fMag;
        forceY[i] -= uy * fMag;
        forceX[j] += ux * fMag;
        forceY[j] += uy * fMag;

        // Elliptical card overlap avoidance (nodes sharing similar X must separate strongly in Y, and vice versa)
        const normX = Math.abs(dx) / minClearanceX;
        const normY = Math.abs(dy) / minClearanceY;
        if (normX < 1.05 && normY < 1.05) {
          const sameZone = nodes[i].zoneId === nodes[j].zoneId;
          if (sameZone || normX < 0.65) {
            // Push apart primarily along Y so cards within a column stack cleanly
            const signY =
              dy >= 0
                ? nodes[j].chainOrder >= nodes[i].chainOrder
                  ? 1
                  : -1
                : -1;
            const pushY = (1.15 - normY) * 28;
            forceY[i] -= signY * pushY;
            forceY[j] += signY * pushY;
          } else {
            const signX = dx >= 0 ? 1 : -1;
            const pushX = (1.15 - normX) * 22;
            forceX[i] -= signX * pushX;
            forceX[j] += signX * pushX;
          }
        }
      }
    }

    // 2. Hooke spring forces along connected edges
    for (const edge of edges) {
      const dx = posX[edge.v] - posX[edge.u];
      const dy = posY[edge.v] - posY[edge.u];
      const dist = Math.hypot(dx, dy) || 1;
      const displacement = dist - edge.idealLength;
      const fSpring = displacement * edge.strength;
      const ux = dx / dist;
      const uy = dy / dist;

      forceX[edge.u] += ux * fSpring;
      forceY[edge.u] += uy * fSpring;
      forceX[edge.v] -= ux * fSpring;
      forceY[edge.v] -= uy * fSpring;
    }

    // 3. Edge-to-Node clearance force: push third-party nodes away from straight segments between connected endpoints
    for (const edge of edges) {
      const ax = posX[edge.u];
      const ay = posY[edge.u];
      const bx = posX[edge.v];
      const by = posY[edge.v];
      const abx = bx - ax;
      const aby = by - ay;
      const abLenSq = abx * abx + aby * aby;
      if (abLenSq < 100) continue;

      for (let k = 0; k < nCount; k++) {
        if (k === edge.u || k === edge.v) continue;
        const apx = posX[k] - ax;
        const apy = posY[k] - ay;
        const t = Math.max(0.12, Math.min(0.88, (apx * abx + apy * aby) / abLenSq));
        const closestX = ax + t * abx;
        const closestY = ay + t * aby;
        const rx = posX[k] - closestX;
        const ry = posY[k] - closestY;
        const rDist = Math.hypot(rx, ry) || 1;
        if (rDist < 95) {
          const push = ((95 - rDist) / 95) * 14;
          forceX[k] += (rx / rDist) * push;
          forceY[k] += (ry / rDist) * push;
        }
      }
    }

    // 4. Topological Zone-Column X anchor & harmonic Y balance
    for (let i = 0; i < nCount; i++) {
      const node = nodes[i];
      const zone = zoneMap.get(node.zoneId);

      // Keep node centered cleanly inside its network security zone horizontally
      forceX[i] += (targetAnchorX[i] - posX[i]) * 0.24;
      forceY[i] += (targetAnchorY[i] - posY[i]) * 0.16;

      // Apply clamped force step
      const stepMag = Math.hypot(forceX[i], forceY[i]) || 1;
      const scale = stepMag > maxStep ? maxStep / stepMag : 1;
      posX[i] += forceX[i] * scale;
      posY[i] += forceY[i] * scale;

      // Constrain within zone horizontal bounds (with inner margin) or global canvas bounds
      if (zone) {
        const zMargin = Math.min(54, Math.max(24, (zone.xEnd - zone.xStart) * 0.18));
        const minZx = Math.max(105, zone.xStart + zMargin);
        const maxZx = Math.min(WHITEBOARD_WIDTH - 105, zone.xEnd - zMargin);
        if (minZx <= maxZx) {
          posX[i] = Math.max(minZx, Math.min(maxZx, posX[i]));
        }
      } else {
        posX[i] = Math.max(110, Math.min(WHITEBOARD_WIDTH - 110, posX[i]));
      }

      posY[i] = Math.max(105, Math.min(WHITEBOARD_HEIGHT - 95, posY[i]));
    }
  }

  // Build final nodeOffsets and laidOutNodes
  const nodeOffsets: Record<string, NodeOffsetDelta> = {};
  const laidOutNodes: WhiteboardSketchNode[] = nodes.map((node, i) => {
    const finalWx = Math.round(posX[i] * 10) / 10;
    const finalWy = Math.round(posY[i] * 10) / 10;
    const dx = Math.round((finalWx - node.wx) * 10) / 10;
    const dy = Math.round((finalWy - node.wy) * 10) / 10;
    nodeOffsets[node.id] = {
      dx: Object.is(dx, -0) ? 0 : dx,
      dy: Object.is(dy, -0) ? 0 : dy,
    };
    return {
      ...node,
      wx: finalWx,
      wy: finalWy,
    };
  });

  // Compute pairwise distance and card-overlap metrics
  let minPairwiseDistance = Infinity;
  let overlapCount = 0;
  for (let i = 0; i < nCount; i++) {
    for (let j = i + 1; j < nCount; j++) {
      const dx = Math.abs(laidOutNodes[j].wx - laidOutNodes[i].wx);
      const dy = Math.abs(laidOutNodes[j].wy - laidOutNodes[i].wy);
      const d = Math.hypot(dx, dy);
      if (d < minPairwiseDistance) {
        minPairwiseDistance = d;
      }
      if (dx < 155 && dy < 90) {
        overlapCount++;
      }
    }
  }

  if (!Number.isFinite(minPairwiseDistance)) {
    minPairwiseDistance = 0;
  } else {
    minPairwiseDistance = Math.round(minPairwiseDistance * 10) / 10;
  }

  return {
    nodeOffsets,
    zoneOffsets: {},
    laidOutNodes,
    minPairwiseDistance,
    overlapCount,
    iterations,
    mode,
  };
}

export interface AttackGraphNodeSearchResult {
  query: string;
  isFiltering: boolean;
  matchedNodeIds: string[];
  matchedNodes: WhiteboardSketchNode[];
  totalNodes: number;
}

/**
 * Checks whether a single attack graph node matches the user's search query.
 * Supports multi-term search across label, IP/sublabel, actionBadge, hostContext,
 * activitySummary, internalSummary, zoneLabel, and chainOrder (#1, #2, etc.).
 */
export function matchesAttackGraphNode(
  node: WhiteboardSketchNode,
  rawQuery: string
): boolean {
  const normalized = rawQuery.trim().toLowerCase();
  if (!normalized) return true;

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const searchableText = [
    node.id,
    `#${node.chainOrder}`,
    `node ${node.chainOrder}`,
    node.label,
    node.sublabel,
    node.actionBadge,
    node.hostContext,
    node.activitySummary,
    node.internalSummary,
    node.zoneLabel,
    node.zoneId,
    node.iconType,
  ]
    .join(' ')
    .toLowerCase();

  return tokens.every((tok) => searchableText.includes(tok));
}

/**
 * Filters and ranks attack graph nodes for the Top Workbench Toolbar search bar.
 */
export function searchAttackGraphNodes(
  nodes: WhiteboardSketchNode[],
  rawQuery: string
): AttackGraphNodeSearchResult {
  const query = rawQuery.trim();
  if (!query) {
    return {
      query: '',
      isFiltering: false,
      matchedNodeIds: nodes.map((n) => n.id),
      matchedNodes: [],
      totalNodes: nodes.length,
    };
  }

  const lower = query.toLowerCase();
  const matched = nodes.filter((n) => matchesAttackGraphNode(n, query));

  // Sort by relevance: exact/prefix match on label, sublabel, or #chainOrder first
  const ranked = [...matched].sort((a, b) => {
    const scoreNode = (n: WhiteboardSketchNode) => {
      let score = 0;
      const lbl = n.label.toLowerCase();
      const sub = n.sublabel.toLowerCase();
      const badge = n.actionBadge.toLowerCase();
      if (`#${n.chainOrder}` === lower || String(n.chainOrder) === lower) {
        score += 100;
      }
      if (lbl.startsWith(lower)) score += 60;
      else if (lbl.includes(lower)) score += 40;
      if (sub.includes(lower)) score += 30;
      if (badge.includes(lower)) score += 20;
      return score;
    };
    const diff = scoreNode(b) - scoreNode(a);
    return diff !== 0 ? diff : a.chainOrder - b.chainOrder;
  });

  return {
    query,
    isFiltering: true,
    matchedNodeIds: ranked.map((n) => n.id),
    matchedNodes: ranked,
    totalNodes: nodes.length,
  };
}


