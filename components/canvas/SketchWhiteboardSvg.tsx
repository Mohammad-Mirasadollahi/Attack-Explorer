'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile } from '@/lib/simulation-engine';
import {
  NETWORK_ZONE_COLUMNS,
  NetworkBackboneLink,
  NetworkZoneColumn,
  WhiteboardSketchFlow } from '@/lib/sketch-zones-and-drilldown';

interface SketchWhiteboardSvgProps {
  zones?: NetworkZoneColumn[];
  backboneLinks?: NetworkBackboneLink[];
  sketchFlows: WhiteboardSketchFlow[];
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  activeEnvironment?: ActiveEnvironmentId;
  tacticalMode?: boolean;
}

export function SketchWhiteboardSvg({
  zones = NETWORK_ZONE_COLUMNS,
  backboneLinks = [],
  sketchFlows,
  selectedTelemetryId,
  onSelectTelemetry,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  tacticalMode = false }: SketchWhiteboardSvgProps) {
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);
  return (
    <svg
      viewBox="0 0 1480 650"
      preserveAspectRatio="none"
      className="w-full h-full"
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

        {/* Crisp Minimal Arrowhead Markers (Forward & Return) */}
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

      {/* Subtle Dot Background */}
      <rect width="1480" height="650" fill="url(#excalidraw-dot-grid)" />

      {/* Active Architecture Blueprint Watermark Stamp */}
      <g
        transform="translate(740, 626)"
        data-testid="svg-architecture-stamp"
        data-environment-id={activeEnvironment}
      >
        <rect
          x={-245}
          y={-14}
          width={490}
          height={20}
          rx={6}
          fill="#0F172A"
          fillOpacity={0.94}
          stroke={tacticalMode ? '#10B981' : envProfile.accentHex}
          strokeWidth="1.4"
        />
        <text
          x={0}
          y={-1}
          textAnchor="middle"
          fill={tacticalMode ? '#6EE7B7' : '#F8FAFC'}
          fontSize="8.2"
          fontFamily="monospace"
          fontWeight="800"
        >
          {`${envProfile.architectureCode} · ${envProfile.badgeLabel.toUpperCase()} · ${envProfile.primaryHostname} (${envProfile.subnetBadge})`}
        </text>
      </g>

      {/* 2D Staggered Network Architecture Zone Boxes (Non-Collinear Topology Islands) */}
      {zones.map((zone) => {
        const width = zone.xEnd - zone.xStart;
        const yTop = zone.yStart ?? 14;
        const yBottom = zone.yEnd ?? 636;
        const height = Math.max(180, yBottom - yTop);
        return (
          <g key={zone.id} data-testid={`network-zone-${zone.id}`}>
            {/* Architectural 2D Zone Box */}
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
            />

            {/* Clean Zone Header Bar Along Top of Zone */}
            <g transform={`translate(${zone.xStart + 12}, ${yTop + 8})`}>
              <rect
                x={0}
                y={0}
                width={width - 24}
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
                width={92}
                height={18}
                rx={4.5}
                fill={zone.accentHex}
              />
              <text
                x={50}
                y={16.2}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="8.2"
                fontFamily="monospace"
                fontWeight="800"
              >
                {zone.code}
              </text>
              <text
                x={104}
                y={16.8}
                fill={tacticalMode ? '#E2E8F0' : '#0F172A'}
                fontSize="9.8"
                fontWeight="800"
                fontFamily="sans-serif"
              >
                {zone.title}
              </text>
            </g>

            {/* Subnet / VLAN Architectural Badge at Bottom-Left of Zone */}
            {zone.subnetBadge && (
              <g transform={`translate(${zone.xStart + 14}, ${yTop + height - 24})`}>
                <rect
                  x={0}
                  y={0}
                  width={148}
                  height={16}
                  rx={4.5}
                  fill="#0F172A"
                  fillOpacity={0.86}
                  stroke={zone.accentHex}
                  strokeWidth="1"
                />
                <text
                  x={74}
                  y={11}
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="7.6"
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
        return (
          <g
            key={link.id}
            data-testid={`backbone-link-${link.id}`}
          >
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
            {/* Subtle Numbered Trunk Link Badge (Preserves Hierarchical L{parent}.{idx} in Nested Views) */}
            <g
              transform={`translate(${midX}, ${midY})`}
              opacity={0.78}
              data-testid={`backbone-badge-${bIdx + 1}`}
            >
              <rect
                x={-48}
                y={-7.5}
                width={96}
                height={15}
                rx={4}
                fill="#F8FAFC"
                stroke={strokeColor}
                strokeOpacity={0.55}
                strokeWidth="1"
              />
              <text
                x={0}
                y={2.5}
                textAnchor="middle"
                fill="#334155"
                fontSize="6.8"
                fontFamily="monospace"
                fontWeight="700"
              >
                {`${linkSeq} · ${link.label.slice(0, 11)}`}
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
              <motion.circle
                cx={fl.fromX}
                cy={fl.fromY}
                fill="none"
                stroke="#E11D48"
                strokeWidth="2.4"
                initial={{ r: 16, opacity: 0.75 }}
                animate={{ r: 62, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut' }}
              />
              {/* Destination Arrival Impact Ring */}
              <motion.circle
                cx={fl.toX}
                cy={fl.toY}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.6"
                initial={{ r: 16, opacity: 0.8 }}
                animate={{ r: 68, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.55 }}
              />
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
          angleDeg: 0 };
        const seqCode = flow.sequenceCode || String(flow.stepNo);
        const isHierarchicalSeq = seqCode.includes('.');
        const stepBadgeW = isHierarchicalSeq ? 26 : 19;

        return (
          <g key={flow.id} data-testid={`sketch-flow-${flow.stepNo}`}>
            {/* 1. OUTBOUND / FORWARD PATH (#N.1 →) */}
            <path
              d={flow.pathD}
              fill="none"
              stroke={strokeHex}
              strokeOpacity={flow.isVisible ? (isHighlighted ? 0.22 : 0.1) : 0.04}
              strokeWidth={isHighlighted ? 5 : 2.2}
              strokeLinecap="round"
            />

            {flow.isVisible && (
              <>
                <motion.path
                  d={flow.pathD}
                  fill="none"
                  stroke={strokeHex}
                  strokeWidth={isHighlighted ? 2.8 : 1.8}
                  strokeDasharray={isHighlighted ? '8 5' : '5 5'}
                  initial={{ pathLength: 0, opacity: 0.4 }}
                  animate={{ pathLength: 1, opacity: 0.95 }}
                  transition={{
                    duration: 0.55,
                    ease: 'easeOut',
                    delay: idx * 0.05 }}
                  markerEnd={
                    isHighlighted
                      ? 'url(#sketch-arrow-crimson)'
                      : 'url(#sketch-arrow-ink)'
                  }
                />
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
                <motion.path
                  d={flow.returnPathD}
                  fill="none"
                  stroke={returnHex}
                  strokeWidth={isHighlighted ? 2.1 : 1.4}
                  strokeDasharray="4 5"
                  initial={{ pathLength: 0, opacity: 0.35 }}
                  animate={{
                    pathLength: 1,
                    opacity: isHighlighted ? 0.94 : 0.68 }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                    delay: idx * 0.05 + 0.12 }}
                  markerEnd={
                    isHighlighted
                      ? 'url(#sketch-arrow-return-active)'
                      : 'url(#sketch-arrow-return-muted)'
                  }
                />
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

            {/* 3. Protocol-Explorer Style Comet Trail + Traveling Outbound Packet Card (#N.1 →) */}
            {flow.isVisible && (
              <>
                {/* 3 Trailing Comet Dots when Highlighted */}
                {isHighlighted &&
                  [0.06, 0.12, 0.18].map((lagSec, tIdx) => (
                    <motion.circle
                      key={`comet-trail-${flow.id}-${tIdx}`}
                      cx={0}
                      cy={0}
                      r={4.2 - tIdx * 1.1}
                      fill="#E11D48"
                      opacity={0.48 - tIdx * 0.13}
                      initial={{
                        x: flow.xKeyframes[0],
                        y: flow.yKeyframes[0] }}
                      animate={{
                        x: flow.xKeyframes,
                        y: flow.yKeyframes }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: lagSec }}
                    />
                  ))}

                {/* Main Traveling Outbound Packet Group + Floating Live Packet Tag when Current Step */}
                <motion.g
                  initial={{
                    x: flow.xKeyframes[0],
                    y: flow.yKeyframes[0] }}
                  animate={{
                    x: flow.xKeyframes,
                    y: flow.yKeyframes }}
                  transition={{
                    duration: isHighlighted ? 2.2 : 3.4,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: isHighlighted ? 0 : idx * 0.25 }}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={isHighlighted ? 11 : 5.5}
                    fill={isHighlighted ? '#E11D48' : '#475569'}
                    fillOpacity={0.22}
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={isHighlighted ? 5.2 : 3.2}
                    fill={isHighlighted ? '#E11D48' : '#1E293B'}
                    stroke="#FFFFFF"
                    strokeWidth="1.6"
                  />

                  {/* Protocol-Explorer Style Floating Packet Tag Card riding on the active packet */}
                  {isHighlighted && (
                    <g
                      transform="translate(0, -24)"
                      data-testid={`active-flying-packet-tag-${flow.stepNo}`}
                    >
                      <rect
                        x={-58}
                        y={-18}
                        width={116}
                        height={18}
                        rx={4}
                        fill="#0F172A"
                        stroke="#E11D48"
                        strokeWidth="1.4"
                      />
                      <text
                        x={0}
                        y={-6.5}
                        textAnchor="middle"
                        fill="#FDE047"
                        fontSize="7.4"
                        fontFamily="monospace"
                        fontWeight="900"
                      >
                        {`PKT #${flow.forwardSeq} · ${flow.label.slice(0, 10)}`}
                      </text>
                    </g>
                  )}
                </motion.g>
              </>
            )}

            {/* 4. Sleek Traveling Return / ACK Packet Pulse (#N.2 ⇠) */}
            {flow.isBidirectional && flow.isVisible && (
              <motion.g
                initial={{
                  x: flow.returnXKeyframes[0],
                  y: flow.returnYKeyframes[0] }}
                animate={{
                  x: flow.returnXKeyframes,
                  y: flow.returnYKeyframes }}
                transition={{
                  duration: isHighlighted ? 2.4 : 3.8,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: isHighlighted ? 0.9 : idx * 0.25 + 1.1 }}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={isHighlighted ? 8.5 : 4}
                  fill="#059669"
                  fillOpacity={0.2}
                />
                <circle
                  cx={0}
                  cy={0}
                  r={isHighlighted ? 4.4 : 2.8}
                  fill="#059669"
                  stroke="#FFFFFF"
                  strokeWidth="1.3"
                />
              </motion.g>
            )}

            {/* 5. Prominent Link Start Step Number Badge (1..5 on main board, P.1..P.4 in expanded view) */}
            {flow.isVisible && (
              <g
                transform={`translate(${startAnchor.x}, ${startAnchor.y - 12})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTelemetry(flow.telemetryEvent);
                }}
                data-testid={`flow-step-circle-${flow.stepNo}`}
                className="cursor-pointer"
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

            {/* 6. Forward Communication Link Badge (#N.1 → or #P.N.1 → Action) — Always Numbered & Legible */}
            {flow.isVisible && (
              <g
                transform={`translate(${flow.controlX}, ${flow.controlY})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTelemetry(flow.telemetryEvent);
                }}
                data-testid={`flow-forward-badge-${flow.stepNo}`}
                className="cursor-pointer"
              >
                <rect
                  x={-70}
                  y={-10}
                  width={140}
                  height={20}
                  rx={6}
                  fill={isHighlighted ? '#E11D48' : '#FFFFFF'}
                  stroke={isHighlighted ? '#0F172A' : '#334155'}
                  strokeWidth="1.35"
                />
                <rect
                  x={-67}
                  y={-7}
                  width={isHierarchicalSeq ? 44 : 35}
                  height={14}
                  rx={4}
                  fill={isHighlighted ? '#9F1239' : '#0F172A'}
                />
                <text
                  x={isHierarchicalSeq ? -45 : -49.5}
                  y={2.8}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="7.3"
                  fontFamily="monospace"
                  fontWeight="900"
                >
                  {`#${flow.forwardSeq}→`}
                </text>
                <text
                  x={isHierarchicalSeq ? 23 : 18}
                  y={2.8}
                  textAnchor="middle"
                  fill={isHighlighted ? '#FFFFFF' : '#0F172A'}
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="800"
                >
                  {flow.label.slice(0, 12)}
                </text>
              </g>
            )}

            {/* 7. Return / Response Communication Link Badge (⇠ #N.2 or ⇠ #P.N.2 Response) — Always Numbered */}
            {flow.isBidirectional && flow.isVisible && (
              <g
                transform={`translate(${flow.returnControlX}, ${flow.returnControlY})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTelemetry(flow.telemetryEvent);
                }}
                data-testid={`flow-return-badge-${flow.stepNo}`}
                className="cursor-pointer"
              >
                <rect
                  x={-60}
                  y={-9}
                  width={120}
                  height={18}
                  rx={5.5}
                  fill={isHighlighted ? '#059669' : '#ECFDF5'}
                  stroke="#065F46"
                  strokeWidth="1.2"
                />
                <rect
                  x={-57}
                  y={-6.5}
                  width={isHierarchicalSeq ? 42 : 33}
                  height={13}
                  rx={3.5}
                  fill={isHighlighted ? '#064E3B' : '#059669'}
                />
                <text
                  x={isHierarchicalSeq ? -36 : -40.5}
                  y={2.4}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="7.1"
                  fontFamily="monospace"
                  fontWeight="900"
                >
                  {`⇠#${flow.returnSeq}`}
                </text>
                <text
                  x={isHierarchicalSeq ? 23 : 18}
                  y={2.4}
                  textAnchor="middle"
                  fill={isHighlighted ? '#FFFFFF' : '#065F46'}
                  fontSize="7.2"
                  fontFamily="monospace"
                  fontWeight="800"
                >
                  {flow.returnLabel.slice(0, 10)}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
