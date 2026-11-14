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
  backboneLinks = [],
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

        {/* Crisp Bidirectional Arrowhead Markers (Start & End for Forward & Return) */}
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
        <marker
          id="sketch-arrow-return-active"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M 1 1.5 L 9 5 L 1 8.5 L 2.5 5 Z" fill="#059669" />
        </marker>
        <marker
          id="sketch-arrow-return-muted"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4.8"
          markerHeight="4.8"
          orient="auto-start-reverse"
        >
          <path d="M 1 1.5 L 9 5 L 1 8.5 L 2.5 5 Z" fill="#0D9488" />
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
              <title>{`Drag "${zone.title}" to reposition this Network Zone`}</title>
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

      {/* Numbered Physical / VLAN / Internal Bus Backbone Trunk Links Behind Attack Flows */}
      {backboneLinks.map((link, bIdx) => {
        const strokeColor =
          link.linkType === 'SPAN_MIRROR'
            ? '#7C3AED'
            : link.linkType === 'WAN_TRUNK'
            ? '#D97706'
            : '#64748B';
        const midX = (link.x1 + link.x2) / 2;
        const midY = (link.y1 + link.y2) / 2;
        const linkSeq = link.sequenceCode || `L${bIdx + 1}`;
        const fullLinkText = `${linkSeq} · ${link.label}`;
        const linkPillW = Math.max(
          98,
          Math.round(fullLinkText.length * 4.4 + 16)
        );

        return (
          <g key={link.id} data-testid={`backbone-link-${link.id}`}>
            <line
              x1={link.x1}
              y1={link.y1}
              x2={link.x2}
              y2={link.y2}
              stroke={strokeColor}
              strokeOpacity={0.28}
              strokeWidth="2"
              strokeDasharray="4 6"
            />
            {/* Full-Text Numbered Trunk Link Badge (Zero Text Truncation) */}
            <g
              transform={`translate(${midX}, ${midY})`}
              opacity={0.85}
              data-testid={`backbone-badge-${bIdx + 1}`}
            >
              <rect
                x={-linkPillW / 2}
                y={-8}
                width={linkPillW}
                height={16}
                rx={4}
                fill="#F8FAFC"
                stroke={strokeColor}
                strokeOpacity={0.65}
                strokeWidth="1"
              />
              <text
                x={0}
                y={2.5}
                textAnchor="middle"
                fill="#334155"
                fontSize="6.9"
                fontFamily="monospace"
                fontWeight="700"
              >
                {fullLinkText}
              </text>
            </g>
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
                r={16}
                fill="none"
                stroke="#E11D48"
                strokeWidth="2.4"
              >
                <animate
                  attributeName="r"
                  values="16;62"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.78;0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Destination Arrival Impact Ring */}
              <circle
                cx={fl.toX}
                cy={fl.toY}
                r={16}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.6"
              >
                <animate
                  attributeName="r"
                  values="16;68"
                  dur="1.5s"
                  begin="0.55s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.82;0"
                  dur="1.5s"
                  begin="0.55s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
      </g>

      {/* Bidirectional Numbered Sketch Flow Paths: Step Circle + Forward (#N.1 →) & Return (⇠ #N.2) */}
      {sketchFlows.map((flow, idx) => {
        const isSelected = selectedTelemetryId === flow.id;
        const isHighlighted = flow.isCurrentStep || isSelected;
        const strokeHex = isHighlighted ? '#E11D48' : '#334155';
        const returnHex = isHighlighted ? '#059669' : '#0D9488';
        const startAnchor = flow.forwardArrows[0] || {
          x: (flow.fromX + flow.controlX) / 2,
          y: (flow.fromY + flow.controlY) / 2,
          angleDeg: 0,
        };
        const seqCode = flow.sequenceCode || String(flow.stepNo);
        const isHierarchicalSeq = seqCode.includes('.');
        const stepBadgeW = Math.max(
          isHierarchicalSeq ? 26 : 20,
          Math.round(seqCode.length * 5.8 + 10)
        );

        // Dynamic widths for Forward Flow Badge and Return Flow Badge so text is NEVER cut off
        const fwdSeqText = `#${flow.forwardSeq}→`;
        const fwdSeqPillW = Math.max(
          isHierarchicalSeq ? 44 : 36,
          Math.round(fwdSeqText.length * 4.8 + 10)
        );
        const fwdLabelText = flow.label;
        const fwdLabelW = Math.max(
          86,
          Math.round(fwdLabelText.length * 4.6 + 18)
        );
        const fwdTotalW = fwdSeqPillW + fwdLabelW + 8;

        const retSeqText = `⇠#${flow.returnSeq}`;
        const retSeqPillW = Math.max(
          isHierarchicalSeq ? 42 : 34,
          Math.round(retSeqText.length * 4.8 + 10)
        );
        const retLabelText = flow.returnLabel;
        const retLabelW = Math.max(
          78,
          Math.round(retLabelText.length * 4.5 + 18)
        );
        const retTotalW = retSeqPillW + retLabelW + 8;

        const fwdDurSec = isHighlighted ? '2.2s' : '3.4s';
        const retDurSec = isHighlighted ? '2.4s' : '3.8s';

        return (
          <g key={flow.id} data-testid={`sketch-flow-${flow.stepNo}`}>
            {/* 1. OUTBOUND / FORWARD PATH (#N.1 →) */}
            <path
              d={flow.pathD}
              fill="none"
              stroke={strokeHex}
              strokeOpacity={
                flow.isVisible ? (isHighlighted ? 0.22 : 0.1) : 0.04
              }
              strokeWidth={isHighlighted ? 5 : 2.2}
              strokeLinecap="round"
            />

            {flow.isVisible && (
              <>
                <path
                  d={flow.pathD}
                  fill="none"
                  stroke={strokeHex}
                  strokeOpacity={0.95}
                  strokeWidth={isHighlighted ? 2.8 : 1.8}
                  strokeDasharray={isHighlighted ? '8 5' : '5 5'}
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
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values={isHighlighted ? '26;0' : '20;0'}
                    dur={isHighlighted ? '0.9s' : '1.4s'}
                    repeatCount="indefinite"
                  />
                </path>

                {/* Explicit Directional Arrowheads Along the Outbound Curve (#N.1 →) */}
                {flow.forwardArrows.map((arr, aIdx) => {
                  const isTip = aIdx === flow.forwardArrows.length - 1;
                  const scale = isTip
                    ? isHighlighted
                      ? 1.28
                      : 1.05
                    : isHighlighted
                    ? 1.08
                    : 0.88;
                  return (
                    <g
                      key={`fwd-arr-${flow.id}-${aIdx}`}
                      data-testid={
                        isTip ? `forward-arrow-tip-${flow.stepNo}` : undefined
                      }
                      transform={`translate(${arr.x}, ${arr.y}) rotate(${arr.angleDeg}) scale(${scale})`}
                    >
                      <path
                        d="M -7 -5.5 L 6.5 0 L -7 5.5 L -3.8 0 Z"
                        fill={strokeHex}
                        stroke="#FFFFFF"
                        strokeWidth="1.1"
                        strokeLinejoin="round"
                      />
                    </g>
                  );
                })}
              </>
            )}

            {/* 2. BIDIRECTIONAL RETURN / RESPONSE PATH (#N.2 ⇠) */}
            {flow.isBidirectional && flow.isVisible && (
              <>
                <path
                  d={flow.returnPathD}
                  fill="none"
                  stroke={returnHex}
                  strokeOpacity={isHighlighted ? 0.18 : 0.08}
                  strokeWidth={isHighlighted ? 3.4 : 1.6}
                  strokeLinecap="round"
                />
                <path
                  d={flow.returnPathD}
                  fill="none"
                  stroke={returnHex}
                  strokeOpacity={isHighlighted ? 0.94 : 0.68}
                  strokeWidth={isHighlighted ? 2.1 : 1.4}
                  strokeDasharray="4 5"
                  markerEnd={
                    isHighlighted
                      ? 'url(#sketch-arrow-return-active)'
                      : 'url(#sketch-arrow-return-muted)'
                  }
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="18;0"
                    dur={isHighlighted ? '1.0s' : '1.6s'}
                    repeatCount="indefinite"
                  />
                </path>

                {/* Explicit Directional Arrowheads Along the Return Curve (#N.2 ⇠) */}
                {flow.returnArrows.map((arr, aIdx) => {
                  const isTip = aIdx === flow.returnArrows.length - 1;
                  const scale = isTip
                    ? isHighlighted
                      ? 1.22
                      : 1.0
                    : isHighlighted
                    ? 1.02
                    : 0.85;
                  return (
                    <g
                      key={`ret-arr-${flow.id}-${aIdx}`}
                      data-testid={
                        isTip ? `return-arrow-tip-${flow.stepNo}` : undefined
                      }
                      transform={`translate(${arr.x}, ${arr.y}) rotate(${arr.angleDeg}) scale(${scale})`}
                    >
                      <path
                        d="M -6.5 -5 L 6 0 L -6.5 5 L -3.5 0 Z"
                        fill={returnHex}
                        stroke="#FFFFFF"
                        strokeWidth="1.1"
                        strokeLinejoin="round"
                      />
                    </g>
                  );
                })}
              </>
            )}

            {/* 3. Continuous Traveling Outbound Packet + Comet Trail (#N.1 →) */}
            {flow.isVisible && (
              <>
                {/* 3 Trailing Comet Dots when Highlighted */}
                {isHighlighted &&
                  [0.08, 0.16, 0.24].map((lagSec, tIdx) => (
                    <circle
                      key={`comet-trail-${flow.id}-${tIdx}`}
                      cx={0}
                      cy={0}
                      r={4.2 - tIdx * 1.1}
                      fill="#E11D48"
                      opacity={0.5 - tIdx * 0.13}
                    >
                      <animateMotion
                        path={flow.pathD}
                        dur="2.2s"
                        begin={`${lagSec}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}

                {/* Main Traveling Outbound Packet Group */}
                <g data-testid={`traveling-outbound-packet-${flow.stepNo}`}>
                  <animateMotion
                    path={flow.pathD}
                    dur={fwdDurSec}
                    begin={isHighlighted ? '0s' : `${idx * 0.22}s`}
                    repeatCount="indefinite"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={isHighlighted ? 11 : 6}
                    fill={isHighlighted ? '#E11D48' : '#475569'}
                    fillOpacity={0.24}
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={isHighlighted ? 5.2 : 3.5}
                    fill={isHighlighted ? '#E11D48' : '#1E293B'}
                    stroke="#FFFFFF"
                    strokeWidth="1.6"
                  />

                  {/* Glowing Active Packet Pulse Halo */}
                  {isHighlighted && (
                    <g data-testid={`active-flying-packet-tag-${flow.stepNo}`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={14}
                        fill="none"
                        stroke="#FDE047"
                        strokeWidth="1.6"
                        strokeDasharray="3 3"
                      />
                    </g>
                  )}
                </g>
              </>
            )}

            {/* 4. Continuous Traveling Return / ACK Packet Pulse (#N.2 ⇠) */}
            {flow.isBidirectional && flow.isVisible && (
              <g data-testid={`traveling-return-packet-${flow.stepNo}`}>
                <animateMotion
                  path={flow.returnPathD}
                  dur={retDurSec}
                  begin={isHighlighted ? '0.6s' : `${idx * 0.25 + 0.7}s`}
                  repeatCount="indefinite"
                />
                <circle
                  cx={0}
                  cy={0}
                  r={isHighlighted ? 8.5 : 4.5}
                  fill="#059669"
                  fillOpacity={0.22}
                />
                <circle
                  cx={0}
                  cy={0}
                  r={isHighlighted ? 4.4 : 3.0}
                  fill="#059669"
                  stroke="#FFFFFF"
                  strokeWidth="1.3"
                />
              </g>
            )}

            {/* 5. Prominent Link Start Step Number Badge (1..5 on main board, P.1..P.4 in expanded view) */}
            {flow.isVisible && (
              <g
                transform={`translate(${startAnchor.x}, ${startAnchor.y - 12})`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTelemetry(flow.telemetryEvent);
                }}
                data-testid={`flow-step-circle-${flow.stepNo}`}
                className="canvas-interactive-control nopan cursor-pointer"
              >
                <rect
                  x={-stepBadgeW / 2}
                  y={-9.5}
                  width={stepBadgeW}
                  height={19}
                  rx={9.5}
                  fill={isHighlighted ? '#E11D48' : '#0F172A'}
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                />
                <text
                  x={0}
                  y={3}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={isHierarchicalSeq ? '7.8' : '8.5'}
                  fontFamily="monospace"
                  fontWeight="900"
                >
                  {seqCode}
                </text>
              </g>
            )}

            {/* 6. Forward Communication Link Badge (#N.1 → Full Action Label) — Dynamic Width, Zero Cutoffs */}
            {flow.isVisible && (
              <g
                transform={`translate(${flow.controlX}, ${flow.controlY})`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTelemetry(flow.telemetryEvent);
                }}
                data-testid={`flow-forward-badge-${flow.stepNo}`}
                className="canvas-interactive-control nopan cursor-pointer"
              >
                <rect
                  x={-fwdTotalW / 2}
                  y={-10}
                  width={fwdTotalW}
                  height={20}
                  rx={6}
                  fill={isHighlighted ? '#E11D48' : '#FFFFFF'}
                  stroke={isHighlighted ? '#0F172A' : '#334155'}
                  strokeWidth="1.35"
                />
                <rect
                  x={-fwdTotalW / 2 + 3}
                  y={-7}
                  width={fwdSeqPillW}
                  height={14}
                  rx={4}
                  fill={isHighlighted ? '#9F1239' : '#0F172A'}
                />
                <text
                  x={-fwdTotalW / 2 + 3 + fwdSeqPillW / 2}
                  y={2.8}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="7.2"
                  fontFamily="monospace"
                  fontWeight="900"
                >
                  {fwdSeqText}
                </text>
                <text
                  x={-fwdTotalW / 2 + 3 + fwdSeqPillW + fwdLabelW / 2 + 2}
                  y={2.8}
                  textAnchor="middle"
                  fill={isHighlighted ? '#FFFFFF' : '#0F172A'}
                  fontSize="7.3"
                  fontFamily="monospace"
                  fontWeight="800"
                >
                  {fwdLabelText}
                </text>
              </g>
            )}

            {/* 7. Return / Response Communication Link Badge (⇠ #N.2 Full Return Label) — Dynamic Width, Zero Cutoffs */}
            {flow.isBidirectional && flow.isVisible && (
              <g
                transform={`translate(${flow.returnControlX}, ${flow.returnControlY})`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTelemetry(flow.telemetryEvent);
                }}
                data-testid={`flow-return-badge-${flow.stepNo}`}
                className="canvas-interactive-control nopan cursor-pointer"
              >
                <rect
                  x={-retTotalW / 2}
                  y={-9}
                  width={retTotalW}
                  height={18}
                  rx={5.5}
                  fill={isHighlighted ? '#059669' : '#ECFDF5'}
                  stroke="#065F46"
                  strokeWidth="1.2"
                />
                <rect
                  x={-retTotalW / 2 + 3}
                  y={-6.5}
                  width={retSeqPillW}
                  height={13}
                  rx={3.5}
                  fill={isHighlighted ? '#064E3B' : '#059669'}
                />
                <text
                  x={-retTotalW / 2 + 3 + retSeqPillW / 2}
                  y={2.4}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="7.0"
                  fontFamily="monospace"
                  fontWeight="900"
                >
                  {retSeqText}
                </text>
                <text
                  x={-retTotalW / 2 + 3 + retSeqPillW + retLabelW / 2 + 2}
                  y={2.4}
                  textAnchor="middle"
                  fill={isHighlighted ? '#FFFFFF' : '#065F46'}
                  fontSize="7.1"
                  fontFamily="monospace"
                  fontWeight="800"
                >
                  {retLabelText}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
});
