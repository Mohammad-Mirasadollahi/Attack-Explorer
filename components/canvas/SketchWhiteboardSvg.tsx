'use client';

import React, { memo } from 'react';
import { TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import {
  NETWORK_ZONE_COLUMNS,
  NetworkBackboneLink,
  NetworkZoneColumn,
  sampleBezierPointAndAngle,
  WhiteboardSketchFlow,
} from '@/lib/sketch-zones-and-drilldown';

interface SketchWhiteboardSvgProps {
  zones?: NetworkZoneColumn[];
  backboneLinks?: NetworkBackboneLink[];
  sketchFlows: WhiteboardSketchFlow[];
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  onSelectZone?: (zoneId: NetworkZoneColumn['id']) => void;
  onStartZoneDrag?: (
    zoneId: NetworkZoneColumn['id'],
    e: React.PointerEvent<SVGGElement>
  ) => void;
  activeEnvironment?: ActiveEnvironmentId;
  tacticalMode?: boolean;
  isInteracting?: boolean;
}

export const SketchWhiteboardSvg = memo(function SketchWhiteboardSvg({
  zones = NETWORK_ZONE_COLUMNS,
  sketchFlows,
  selectedTelemetryId,
  onSelectTelemetry,
  onSelectZone,
  onStartZoneDrag,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  tacticalMode = false,
}: SketchWhiteboardSvgProps) {
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);
  const stampText = `${envProfile.architectureCode} · ${envProfile.badgeLabel.toUpperCase()} · ${envProfile.primaryHostname} (${envProfile.subnetBadge})`;
  const stampWidth = Math.max(490, Math.round(stampText.length * 5.4 + 34));

  return (
    <svg
      viewBox="0 0 1480 650"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      style={{ overflow: 'visible' }}
      className="w-full h-full pointer-events-auto overflow-visible"
    >
      <defs>
        {/* Minimal Dot Grid Pattern */}
        <pattern
          id="excalidraw-dot-grid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="2"
            cy="2"
            r="1.1"
            fill={tacticalMode ? '#10B981' : '#94A3B8'}
            opacity={tacticalMode ? '0.45' : '0.35'}
          />
        </pattern>

        {/* Crisp Two-Way (Bidirectional) Arrowhead Markers */}
        <marker
          id="sketch-arrow-crimson"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M 1 1.5 L 9 5 L 1 8.5 L 2.5 5 Z" fill="#E11D48" />
        </marker>
        <marker
          id="sketch-arrow-ink"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path
            d="M 1 1.5 L 9 5 L 1 8.5 L 2.5 5 Z"
            fill={tacticalMode ? '#38BDF8' : '#334155'}
          />
        </marker>
      </defs>

      {/* Infinite Dot Background across all 4 directions (no 1480x650 seam) */}
      <rect
        x="-8000"
        y="-8000"
        width="17480"
        height="16650"
        fill="url(#excalidraw-dot-grid)"
        className="pointer-events-none"
      />

      {/* Active Architecture Blueprint Watermark Stamp (Top-Left Margin, Clear of Bottom HUDs) */}
      <g
        transform="translate(215, 13)"
        data-testid="svg-architecture-stamp"
        data-environment-id={activeEnvironment}
      >
        <rect
          x={-stampWidth / 2}
          y={-10}
          width={stampWidth}
          height={18}
          rx={5}
          fill="#0F172A"
          fillOpacity={0.94}
          stroke={tacticalMode ? '#10B981' : envProfile.accentHex}
          strokeWidth="1.2"
        />
        <text
          x={0}
          y={1.5}
          textAnchor="middle"
          fill={tacticalMode ? '#6EE7B7' : '#F8FAFC'}
          fontSize="7.6"
          fontFamily="monospace"
          fontWeight="800"
        >
          {stampText}
        </text>
      </g>

      {/* 2D Staggered Network Architecture Zone Boxes (Non-Collinear Topology Islands) */}
      {zones.map((zone) => {
        const width = zone.xEnd - zone.xStart;
        const yTop = zone.yStart ?? 14;
        const yBottom = zone.yEnd ?? 636;
        const height = Math.max(180, yBottom - yTop);
        const codePillW = Math.max(88, Math.round(zone.code.length * 5.2 + 14));
        const headerBarW = Math.max(
          width - 24,
          Math.round(codePillW + zone.title.length * 5.4 + 22)
        );
        const subnetW = zone.subnetBadge
          ? Math.max(148, Math.round(zone.subnetBadge.length * 5.0 + 20))
          : 148;

        const headerTotalW = Math.min(width - 16, Math.max(headerBarW, width - 20));

        return (
          <g key={zone.id} data-testid={`network-zone-${zone.id}`}>
            {/* Architectural 2D Zone Box (Interior lets empty-space drag pan the canvas; border is draggable) */}
            <rect
              x={zone.xStart + 4}
              y={yTop}
              width={width - 8}
              height={height}
              rx={16}
              fill={zone.accentHex}
              fillOpacity={tacticalMode ? 0.08 : 0.04}
              stroke={zone.accentHex}
              strokeOpacity={tacticalMode ? 0.75 : 0.48}
              strokeWidth={tacticalMode ? '2' : '1.7'}
              strokeDasharray="8 5"
              className="pointer-events-none"
            />

            {/* Clean Clickable & Draggable Zone Header Bar Along Top of Zone */}
            <g
              transform={`translate(${zone.xStart + 10}, ${yTop + 8})`}
              data-testid={`zone-header-${zone.id}`}
              onPointerDown={(e) => {
                if (onStartZoneDrag) {
                  e.stopPropagation();
                  onStartZoneDrag(zone.id, e);
                }
              }}
              onClick={(e) => {
                if (onSelectZone) {
                  e.stopPropagation();
                  onSelectZone(zone.id);
                }
              }}
              className="canvas-interactive-zone nopan cursor-grab active:cursor-grabbing"
            >
              <rect
                x={0}
                y={0}
                width={headerTotalW}
                height={26}
                rx={7}
                fill={tacticalMode ? '#071324' : '#FFFFFF'}
                fillOpacity={0.96}
                stroke={zone.accentHex}
                strokeOpacity={tacticalMode ? 0.85 : 0.55}
                strokeWidth="1.3"
              />
              <rect
                x={4}
                y={4}
                width={codePillW}
                height={18}
                rx={4.5}
                fill={zone.accentHex}
              />
              <text
                x={4 + codePillW / 2}
                y={16.2}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="7.8"
                fontFamily="monospace"
                fontWeight="800"
              >
                {zone.code}
              </text>
              <text
                x={codePillW + 10}
                y={16.5}
                fill={tacticalMode ? '#E2E8F0' : '#0F172A'}
                fontSize="8.6"
                fontWeight="800"
                fontFamily="sans-serif"
              >
                {zone.title}
              </text>

              {/* 6-Dot Drag Handle Indicator on Right End of Zone Header */}
              <g
                transform={`translate(${headerTotalW - 14}, 7)`}
                opacity={0.65}
                data-testid={`zone-drag-grip-${zone.id}`}
              >
                <circle cx={2} cy={2} r={1.2} fill={zone.accentHex} />
                <circle cx={6} cy={2} r={1.2} fill={zone.accentHex} />
                <circle cx={2} cy={6} r={1.2} fill={zone.accentHex} />
                <circle cx={6} cy={6} r={1.2} fill={zone.accentHex} />
                <circle cx={2} cy={10} r={1.2} fill={zone.accentHex} />
                <circle cx={6} cy={10} r={1.2} fill={zone.accentHex} />
              </g>
            </g>

            {/* Subnet / VLAN Architectural Badge at Bottom-Left of Zone (Also Draggable to Move Zone) */}
            {zone.subnetBadge && (
              <g
                transform={`translate(${zone.xStart + 14}, ${
                  yTop + height - 24
                })`}
                data-testid={`zone-subnet-handle-${zone.id}`}
                onPointerDown={(e) => {
                  if (onStartZoneDrag) {
                    e.stopPropagation();
                    onStartZoneDrag(zone.id, e);
                  }
                }}
                className="canvas-interactive-zone nopan cursor-grab active:cursor-grabbing"
              >
                <rect
                  x={0}
                  y={0}
                  width={subnetW}
                  height={16}
                  rx={4.5}
                  fill="#0F172A"
                  fillOpacity={0.88}
                  stroke={zone.accentHex}
                  strokeWidth="1"
                />
                <text
                  x={subnetW / 2}
                  y={11}
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  {zone.subnetBadge}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* PULSE LAYER (Protocol-Explorer style expanding radar rings on active step source & target endpoints) */}
      <g className="pulse-layer" data-testid="svg-pulse-layer">
        {sketchFlows
          .filter((fl) => fl.isCurrentStep && fl.isVisible)
          .map((fl) => (
            <g key={`pulse-pair-${fl.id}`}>
              {/* Source Launch Pulse Ring */}
              <circle
                cx={fl.fromX}
                cy={fl.fromY}
                r={14}
                fill="none"
                stroke="#E11D48"
                strokeWidth="2.2"
              >
                <animate
                  attributeName="r"
                  values="14;52"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.72;0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Destination Arrival Impact Ring */}
              <circle
                cx={fl.toX}
                cy={fl.toY}
                r={14}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.2"
              >
                <animate
                  attributeName="r"
                  values="14;56"
                  dur="1.5s"
                  begin="0.55s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.75;0"
                  dur="1.5s"
                  begin="0.55s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
      </g>

      {/* Single-Line Bidirectional Communication Links with Number-Only Badge */}
      {sketchFlows.map((flow, idx) => {
        const isSelected = selectedTelemetryId === flow.id;
        const isHighlighted = flow.isCurrentStep || isSelected;
        const strokeHex = isHighlighted
          ? '#E11D48'
          : tacticalMode
          ? '#38BDF8'
          : '#334155';

        // Exact midpoint B(0.5) on the quadratic Bezier curve M from Q control to
        const midCurveX =
          Math.round(
            (0.25 * flow.fromX + 0.5 * flow.controlX + 0.25 * flow.toX) * 10
          ) / 10;
        const midCurveY =
          Math.round(
            (0.25 * flow.fromY + 0.5 * flow.controlY + 0.25 * flow.toY) * 10
          ) / 10;

        // Compute start & end arrow tips so the single line has two-way (<--->) arrowheads
        const startArrowTip = sampleBezierPointAndAngle(
          flow.fromX,
          flow.fromY,
          flow.controlX,
          flow.controlY,
          flow.toX,
          flow.toY,
          0.02
        );
        const endArrowTip =
          flow.forwardArrows[flow.forwardArrows.length - 1] ||
          sampleBezierPointAndAngle(
            flow.fromX,
            flow.fromY,
            flow.controlX,
            flow.controlY,
            flow.toX,
            flow.toY,
            0.98
          );
        const arrowTipScale = isHighlighted ? 1.24 : 1.04;

        const seqCode = flow.sequenceCode || String(flow.stepNo);
        const isHierarchicalSeq = seqCode.includes('.');
        const stepBadgeW = Math.max(
          isHierarchicalSeq ? 28 : 22,
          Math.round(seqCode.length * 6.2 + 12)
        );
        const fwdDurSec = isHighlighted ? '2.2s' : '3.4s';

        return (
          <g key={flow.id} data-testid={`sketch-flow-${flow.stepNo}`}>
            {/* Subtle Halo Along the Single Bidirectional Communication Path */}
            <path
              d={flow.pathD}
              fill="none"
              stroke={strokeHex}
              strokeOpacity={
                flow.isVisible ? (isHighlighted ? 0.2 : 0.08) : 0.03
              }
              strokeWidth={isHighlighted ? 4.8 : 2}
              strokeLinecap="round"
            />

            {flow.isVisible && (
              <>
                {/* Single Two-Way Communication Line */}
                <path
                  d={flow.pathD}
                  fill="none"
                  stroke={strokeHex}
                  strokeOpacity={isHighlighted ? 0.96 : 0.82}
                  strokeWidth={isHighlighted ? 2.6 : 1.75}
                  strokeDasharray={isHighlighted ? '8 5' : '6 5'}
                  markerStart={
                    isHighlighted
                      ? 'url(#sketch-arrow-crimson)'
                      : 'url(#sketch-arrow-ink)'
                  }
                  markerEnd={
                    isHighlighted
                      ? 'url(#sketch-arrow-crimson)'
                      : 'url(#sketch-arrow-ink)'
                  }
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTelemetry(flow.telemetryEvent);
                  }}
                  className="canvas-interactive-control nopan cursor-pointer"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values={isHighlighted ? '26;0' : '22;0'}
                    dur={isHighlighted ? '0.9s' : '1.5s'}
                    repeatCount="indefinite"
                  />
                </path>

                {/* Start Arrowhead Tip Pointing to Source Node (Two-Way Left/Start End) */}
                <g
                  data-testid={`backward-arrow-tip-${flow.stepNo}`}
                  transform={`translate(${startArrowTip.x}, ${startArrowTip.y}) rotate(${
                    startArrowTip.angleDeg + 180
                  }) scale(${arrowTipScale})`}
                >
                  <path
                    d="M -7 -5.5 L 6.5 0 L -7 5.5 L -3.8 0 Z"
                    fill={strokeHex}
                    stroke="#FFFFFF"
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                  />
                </g>

                {/* End Arrowhead Tip Pointing to Target Node (Two-Way Right/End End) */}
                <g
                  data-testid={`forward-arrow-tip-${flow.stepNo}`}
                  transform={`translate(${endArrowTip.x}, ${endArrowTip.y}) rotate(${endArrowTip.angleDeg}) scale(${arrowTipScale})`}
                >
                  <path
                    d="M -7 -5.5 L 6.5 0 L -7 5.5 L -3.8 0 Z"
                    fill={strokeHex}
                    stroke="#FFFFFF"
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Traveling Packet Pulse on the Single Line */}
                <g data-testid={`traveling-outbound-packet-${flow.stepNo}`}>
                  <animateMotion
                    path={flow.pathD}
                    dur={fwdDurSec}
                    begin={isHighlighted ? '0s' : `${idx * 0.25}s`}
                    repeatCount="indefinite"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={isHighlighted ? 9.5 : 5}
                    fill={isHighlighted ? '#E11D48' : '#475569'}
                    fillOpacity={0.22}
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={isHighlighted ? 4.8 : 3.2}
                    fill={isHighlighted ? '#E11D48' : '#1E293B'}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  {isHighlighted && (
                    <g data-testid={`active-flying-packet-tag-${flow.stepNo}`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={13}
                        fill="none"
                        stroke="#FDE047"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    </g>
                  )}
                </g>

                {/* Number-Only Badge Centered on the Single Communication Link */}
                <g
                  transform={`translate(${midCurveX}, ${midCurveY})`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTelemetry(flow.telemetryEvent);
                  }}
                  data-testid={`flow-step-circle-${flow.stepNo}`}
                  className="canvas-interactive-control nopan cursor-pointer"
                >
                  <title>{`#${seqCode} · ${flow.initiatorLabel} ⇄ ${flow.targetLabel}`}</title>
                  <rect
                    x={-stepBadgeW / 2}
                    y={-11}
                    width={stepBadgeW}
                    height={22}
                    rx={11}
                    fill={isHighlighted ? '#E11D48' : '#0F172A'}
                    stroke={tacticalMode && !isHighlighted ? '#38BDF8' : '#FFFFFF'}
                    strokeWidth="1.8"
                  />
                  <text
                    x={0}
                    y={3.4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize={isHierarchicalSeq ? '8.5' : '9.5'}
                    fontFamily="monospace"
                    fontWeight="900"
                  >
                    {seqCode}
                  </text>
                </g>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
});
