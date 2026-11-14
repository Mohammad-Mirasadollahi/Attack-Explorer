import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  computeOverlapArea,
  computeSmartDiagramTooltipPlacement,
  computeSmartViewportTooltipPosition,
  formatNodeTooltipCopyText,
  formatWorkbenchTooltipCopyText,
  RectBox,
} from './tooltip-positioning';
import { WhiteboardSketchNode } from './sketch-zones-and-drilldown';

describe('tooltip-positioning', () => {
  it('keeps diagram node tooltips strictly inside container bounds and off the hovered node (Victim Laptop WKS-04 case)', () => {
    const containerWidth = 920;
    const containerHeight = 460;
    const tooltipWidth = 310;
    const tooltipHeight = 250;

    // Simulates Victim Laptop (WKS-04) near the center-top of the topology board
    const nodeRect: RectBox = {
      left: 390,
      top: 165,
      width: 195,
      height: 110,
    };

    const otherNodeRects: RectBox[] = [
      // Attacker node on left
      { left: 65, top: 220, width: 210, height: 110 },
      // Firewall node on lower-left
      { left: 240, top: 310, width: 205, height: 105 },
      // DC01 node on right
      { left: 615, top: 185, width: 210, height: 110 },
    ];

    const placement = computeSmartDiagramTooltipPlacement({
      containerWidth,
      containerHeight,
      nodeRect,
      tooltipWidth,
      tooltipHeight,
      otherNodeRects,
      edgePadding: 12,
      topSafeInset: 12,
      bottomSafeInset: 58,
    });

    // Must never clip outside the container
    assert.ok(
      placement.leftPx >= 12,
      `Expected leftPx >= 12, got ${placement.leftPx}`
    );
    assert.ok(
      placement.leftPx + tooltipWidth <= containerWidth - 12,
      `Expected right edge <= ${containerWidth - 12}, got ${
        placement.leftPx + tooltipWidth
      }`
    );
    assert.ok(
      placement.topPx >= 12,
      `Expected topPx >= 12 (never clipped at top), got ${placement.topPx}`
    );
    assert.ok(
      placement.topPx + tooltipHeight <= containerHeight - 58,
      `Expected bottom edge <= ${containerHeight - 58}, got ${
        placement.topPx + tooltipHeight
      }`
    );

    const tooltipRect: RectBox = {
      left: placement.leftPx,
      top: placement.topPx,
      width: tooltipWidth,
      height: tooltipHeight,
    };

    // Must not cover the hovered node itself
    const hoveredOverlap = computeOverlapArea(tooltipRect, nodeRect);
    assert.equal(
      hoveredOverlap,
      0,
      `Expected 0 overlap with hovered node, got ${hoveredOverlap}`
    );
  });

  it('clamps viewport tooltips inside screen bounds and flips side when needed', () => {
    const posNearBottom = computeSmartViewportTooltipPosition({
      triggerRect: { left: 850, top: 760, width: 80, height: 32 },
      tooltipWidth: 280,
      tooltipHeight: 80,
      viewportWidth: 960,
      viewportHeight: 800,
      preferredSide: 'bottom',
      preferredAlign: 'center',
      offsetPx: 8,
      edgePadding: 10,
    });

    assert.equal(posNearBottom.effectiveSide, 'top');
    assert.ok(posNearBottom.leftPx >= 10);
    assert.ok(posNearBottom.leftPx + 280 <= 950);
    assert.ok(posNearBottom.topPx >= 10);
    assert.ok(posNearBottom.topPx + 80 <= 790);
  });

  it('formats copyable text cleanly for both diagram and workbench tooltips', () => {
    const sampleNode = {
      id: 'victim-wks-04',
      chainOrder: 3,
      label: 'Victim Laptop (WKS-04)',
      sublabel: '10.10.4.15 · Windows 11 Endpoint',
      actionBadge: 'HOST · Target Endpoint',
      zoneLabel: 'ZONE 2 · CORP WORKSTATION VLAN',
      hostContext: 'Running on Host: WKS-04',
      activitySummary: 'Executes suspicious loader in memory.',
      internalSummary: 'Spawns suspended svchost.exe and unmaps NTDLL.',
    } as unknown as WhiteboardSketchNode;

    const nodeText = formatNodeTooltipCopyText(sampleNode);

    assert.ok(nodeText.includes('NODE #3 · HOST · Target Endpoint'));
    assert.ok(nodeText.includes('Title: Victim Laptop (WKS-04)'));
    assert.ok(nodeText.includes('10.10.4.15 · Windows 11 Endpoint'));
    assert.ok(nodeText.includes('Spawns suspended svchost.exe'));

    const wbText = formatWorkbenchTooltipCopyText(
      'Force-Directed Auto-Layout',
      'HOTKEY A',
      'Automatically organize attack graph nodes'
    );
    assert.equal(
      wbText,
      'Force-Directed Auto-Layout [HOTKEY A]\nAutomatically organize attack graph nodes'
    );
  });
});
