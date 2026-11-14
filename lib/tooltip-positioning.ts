import { WhiteboardSketchNode } from './sketch-zones-and-drilldown';

export interface RectBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type DiagramTooltipPlacementSide =
  | 'RIGHT'
  | 'LEFT'
  | 'BOTTOM'
  | 'TOP'
  | 'TOP_RIGHT_DOCK'
  | 'TOP_LEFT_DOCK'
  | 'BOTTOM_LEFT_DOCK'
  | 'BOTTOM_RIGHT_DOCK';

export interface DiagramTooltipPlacementResult {
  leftPx: number;
  topPx: number;
  placement: DiagramTooltipPlacementSide;
  maxHeightPx: number;
}

export interface ComputeDiagramTooltipPlacementInput {
  containerWidth: number;
  containerHeight: number;
  nodeRect: RectBox;
  tooltipWidth: number;
  tooltipHeight: number;
  otherNodeRects?: RectBox[];
  edgePadding?: number;
  topSafeInset?: number;
  bottomSafeInset?: number;
}

function clamp(val: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(max, Math.max(min, val));
}

export function computeOverlapArea(a: RectBox, b: RectBox): number {
  const xOverlap = Math.max(
    0,
    Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left)
  );
  const yOverlap = Math.max(
    0,
    Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top)
  );
  return xOverlap * yOverlap;
}

/**
 * Computes a container-clamped, collision-avoiding position for a Diagram Node Tooltip.
 * Guarantees:
 * 1. The tooltip never overflows or clips outside [edgePadding .. containerWidth - edgePadding]
 *    or [topSafeInset .. containerHeight - bottomSafeInset].
 * 2. Avoids covering the hovered node itself and minimizes overlap with neighboring diagram nodes.
 */
export function computeSmartDiagramTooltipPlacement(
  input: ComputeDiagramTooltipPlacementInput
): DiagramTooltipPlacementResult {
  const {
    containerWidth,
    containerHeight,
    nodeRect,
    tooltipWidth,
    tooltipHeight,
    otherNodeRects = [],
    edgePadding = 12,
    topSafeInset = 12,
    bottomSafeInset = 56,
  } = input;

  const safeW = Math.max(320, containerWidth);
  const safeH = Math.max(240, containerHeight);
  const maxHeightPx = Math.max(
    160,
    safeH - topSafeInset - Math.max(12, bottomSafeInset)
  );
  const effectiveTooltipH = Math.min(tooltipHeight, maxHeightPx);
  const effectiveTooltipW = Math.min(tooltipWidth, safeW - edgePadding * 2);

  const minLeft = edgePadding;
  const maxLeft = Math.max(minLeft, safeW - effectiveTooltipW - edgePadding);
  const minTop = topSafeInset;
  const maxTop = Math.max(
    minTop,
    safeH - effectiveTooltipH - Math.max(edgePadding, bottomSafeInset)
  );

  const gap = 14;
  const nodeCenterX = nodeRect.left + nodeRect.width / 2;
  const nodeCenterY = nodeRect.top + nodeRect.height / 2;

  const rawCandidates: Array<{
    placement: DiagramTooltipPlacementSide;
    rawLeft: number;
    rawTop: number;
    preferencePenalty: number;
  }> = [
    {
      placement: 'RIGHT',
      rawLeft: nodeRect.left + nodeRect.width + gap,
      rawTop: nodeCenterY - effectiveTooltipH / 2,
      preferencePenalty: 0,
    },
    {
      placement: 'LEFT',
      rawLeft: nodeRect.left - effectiveTooltipW - gap,
      rawTop: nodeCenterY - effectiveTooltipH / 2,
      preferencePenalty: 10,
    },
    {
      placement: 'BOTTOM',
      rawLeft: nodeCenterX - effectiveTooltipW / 2,
      rawTop: nodeRect.top + nodeRect.height + gap,
      preferencePenalty: 25,
    },
    {
      placement: 'TOP',
      rawLeft: nodeCenterX - effectiveTooltipW - gap / 2,
      rawTop: nodeRect.top - effectiveTooltipH - gap,
      preferencePenalty: 30,
    },
    {
      placement: 'TOP_RIGHT_DOCK',
      rawLeft: maxLeft,
      rawTop: minTop,
      preferencePenalty: 60,
    },
    {
      placement: 'TOP_LEFT_DOCK',
      rawLeft: minLeft,
      rawTop: minTop,
      preferencePenalty: 65,
    },
    {
      placement: 'BOTTOM_LEFT_DOCK',
      rawLeft: minLeft,
      rawTop: maxTop,
      preferencePenalty: 70,
    },
    {
      placement: 'BOTTOM_RIGHT_DOCK',
      rawLeft: maxLeft,
      rawTop: maxTop,
      preferencePenalty: 75,
    },
  ];

  // Expand hovered node box slightly so tooltip leaves breathing room around the hovered node
  const paddedHoveredNode: RectBox = {
    left: nodeRect.left - 8,
    top: nodeRect.top - 8,
    width: nodeRect.width + 16,
    height: nodeRect.height + 16,
  };

  let bestCandidate = {
    leftPx: clamp(rawCandidates[0].rawLeft, minLeft, maxLeft),
    topPx: clamp(rawCandidates[0].rawTop, minTop, maxTop),
    placement: rawCandidates[0].placement,
    score: Number.POSITIVE_INFINITY,
  };

  for (const cand of rawCandidates) {
    const clampedLeft = clamp(cand.rawLeft, minLeft, maxLeft);
    const clampedTop = clamp(cand.rawTop, minTop, maxTop);

    const candidateBox: RectBox = {
      left: clampedLeft,
      top: clampedTop,
      width: effectiveTooltipW,
      height: effectiveTooltipH,
    };

    // How much did clamping shift the candidate? (Indicates out-of-bounds pressure)
    const clampShiftPenalty =
      (Math.abs(clampedLeft - cand.rawLeft) +
        Math.abs(clampedTop - cand.rawTop)) *
      3.5;

    // Overlap with the hovered node itself is heavily penalized so we never obscure the inspected node
    const hoveredNodeOverlap =
      computeOverlapArea(candidateBox, paddedHoveredNode) * 80;

    // Overlap with other diagram nodes is also strongly penalized so neighboring shapes remain visible
    let otherNodesOverlap = 0;
    for (const other of otherNodeRects) {
      otherNodesOverlap += computeOverlapArea(candidateBox, other) * 32;
    }

    const totalScore =
      hoveredNodeOverlap +
      otherNodesOverlap +
      clampShiftPenalty +
      cand.preferencePenalty;

    if (totalScore < bestCandidate.score) {
      bestCandidate = {
        leftPx: Math.round(clampedLeft),
        topPx: Math.round(clampedTop),
        placement: cand.placement,
        score: totalScore,
      };
    }
  }

  return {
    leftPx: bestCandidate.leftPx,
    topPx: bestCandidate.topPx,
    placement: bestCandidate.placement,
    maxHeightPx: Math.round(maxHeightPx),
  };
}

export interface ViewportTooltipPositionInput {
  triggerRect: RectBox;
  tooltipWidth: number;
  tooltipHeight: number;
  preferredSide: 'top' | 'bottom';
  preferredAlign: 'left' | 'center' | 'right';
  viewportWidth: number;
  viewportHeight: number;
  offsetPx?: number;
  edgePadding?: number;
}

export interface ViewportTooltipPositionResult {
  leftPx: number;
  topPx: number;
  effectiveSide: 'top' | 'bottom';
}

/**
 * Computes fixed viewport coordinates for WorkbenchIconTooltip so it never overflows
 * the browser viewport on the left, right, top, or bottom.
 */
export function computeSmartViewportTooltipPosition(
  input: ViewportTooltipPositionInput
): ViewportTooltipPositionResult {
  const {
    triggerRect,
    tooltipWidth,
    tooltipHeight,
    preferredSide,
    preferredAlign,
    viewportWidth,
    viewportHeight,
    offsetPx = 8,
    edgePadding = 8,
  } = input;

  const gap = offsetPx;
  let effectiveSide = preferredSide;

  const roomBelow =
    viewportHeight - (triggerRect.top + triggerRect.height) - edgePadding;
  const roomAbove = triggerRect.top - edgePadding;

  if (
    preferredSide === 'bottom' &&
    roomBelow < tooltipHeight + gap &&
    roomAbove > roomBelow
  ) {
    effectiveSide = 'top';
  } else if (
    preferredSide === 'top' &&
    roomAbove < tooltipHeight + gap &&
    roomBelow > roomAbove
  ) {
    effectiveSide = 'bottom';
  }

  const rawTop =
    effectiveSide === 'top'
      ? triggerRect.top - tooltipHeight - gap
      : triggerRect.top + triggerRect.height + gap;

  let rawLeft = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
  if (preferredAlign === 'left') {
    rawLeft = triggerRect.left;
  } else if (preferredAlign === 'right') {
    rawLeft = triggerRect.left + triggerRect.width - tooltipWidth;
  }

  const minLeft = edgePadding;
  const maxLeft = Math.max(minLeft, viewportWidth - tooltipWidth - edgePadding);
  const minTop = edgePadding;
  const maxTop = Math.max(minTop, viewportHeight - tooltipHeight - edgePadding);

  return {
    leftPx: Math.round(clamp(rawLeft, minLeft, maxLeft)),
    topPx: Math.round(clamp(rawTop, minTop, maxTop)),
    effectiveSide,
  };
}

/**
 * Builds clean, structured plain text for copying a Diagram Node Tooltip's contents.
 */
export function formatNodeTooltipCopyText(node: WhiteboardSketchNode): string {
  const details = node.originalNode?.details;
  const lines: string[] = [
    `NODE #${node.sequenceCode || node.chainOrder} · ${node.actionBadge}`,
    `Title: ${node.label}`,
    `Endpoint / Port: ${details?.pidOrPort || node.sublabel}`,
    `Privilege / OS: ${details?.privilege || details?.osOrType || 'System Context'}`,
  ];
  if (node.hostContext) {
    lines.push(`Host Context: ${node.hostContext}`);
  }
  if (node.activitySummary) {
    lines.push(`Activity: ${node.activitySummary}`);
  }
  const extraDesc = node.internalSummary || details?.description;
  if (extraDesc && extraDesc !== node.activitySummary) {
    lines.push(`Details: ${extraDesc}`);
  }
  return lines.join('\n');
}

/**
 * Builds clean plain text for copying a WorkbenchIconTooltip's contents.
 */
export function formatWorkbenchTooltipCopyText(
  label: string,
  badge?: string,
  detail?: string
): string {
  const header = badge ? `${label} [${badge}]` : label;
  return detail ? `${header}\n${detail}` : header;
}

export interface TooltipWheelScrollInput {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  deltaY: number;
  deltaMode?: number;
}

export interface TooltipWheelScrollResult {
  /** Whether the tooltip container has vertical overflow (scrollHeight > clientHeight) */
  isScrollable: boolean;
  /** Clamped next scrollTop value inside [0 .. scrollHeight - clientHeight] */
  nextScrollTop: number;
  /** Whether scrollTop changed on this wheel step */
  didScroll: boolean;
  /** Always true inside a tooltip so the parent diagram canvas never zooms while hovering a tooltip */
  shouldConsumeWheelEvent: boolean;
}

/**
 * Computes isolated vertical scroll progression for an active tooltip when the user
 * scrolls the mouse wheel inside the tooltip card, preventing the underlying diagram
 * canvas from zooming in or out.
 */
export function computeTooltipWheelScrollStep(
  input: TooltipWheelScrollInput
): TooltipWheelScrollResult {
  const {
    scrollTop,
    scrollHeight,
    clientHeight,
    deltaY,
    deltaMode = 0,
  } = input;

  const pixelDeltaY =
    deltaMode === 1
      ? deltaY * 18
      : deltaMode === 2
      ? deltaY * Math.max(120, clientHeight * 0.85)
      : deltaY;

  const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
  const isScrollable = maxScrollTop > 1;
  const nextScrollTop = isScrollable
    ? clamp(scrollTop + pixelDeltaY, 0, maxScrollTop)
    : 0;

  return {
    isScrollable,
    nextScrollTop: Math.round(nextScrollTop),
    didScroll: Math.abs(nextScrollTop - scrollTop) >= 0.5,
    shouldConsumeWheelEvent: true,
  };
}

