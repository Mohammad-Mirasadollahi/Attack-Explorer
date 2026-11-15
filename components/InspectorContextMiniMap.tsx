'use client';

import React from 'react';
import {
  InspectorMiniMapModel,
  InspectorScopeContext,
} from '@/lib/inspector-scope';
import { TelemetryEvent } from '@/lib/attack-scenarios';
import { WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import { SketchNodeIcon } from './SketchNodeIcons';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Compass,
  Crosshair,
  Layers,
  MapPin,
  Network,
} from 'lucide-react';

export interface InspectorContextMiniMapProps {
  miniMap: InspectorMiniMapModel;
  scopeContext: InspectorScopeContext;
  selectedTelemetry: TelemetryEvent | null;
  onSelectNode: (nodeId: string | null) => void;
  onSelectInternalSubNode?: (subNodeId: string | null) => void;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
  onReturnToDiagram: () => void;
}

function getRoleHeaderTone(node: WhiteboardSketchNode): string {
  const badgeUpper = (node.actionBadge || '').toUpperCase();
  const isOrigin =
    node.chainOrder === 1 ||
    badgeUpper.includes('INITIAL') ||
    badgeUpper.includes('ATTACKER') ||
    badgeUpper.includes('ORIGIN') ||
    node.originalNode?.role === 'attacker';
  const isImpact =
    badgeUpper.includes('IMPACT') ||
    badgeUpper.includes('EXFIL') ||
    badgeUpper.includes('RANSOM') ||
    badgeUpper.includes('WIPE') ||
    badgeUpper.includes('HIJACK') ||
    badgeUpper.includes('C2');
  const isPivot =
    badgeUpper.includes('PIVOT') ||
    badgeUpper.includes('LATERAL') ||
    badgeUpper.includes('DUMP') ||
    badgeUpper.includes('INJECT') ||
    badgeUpper.includes('HOLLOW') ||
    badgeUpper.includes('RELAY') ||
    badgeUpper.includes('KERBEROAST');

  if (isOrigin) return 'bg-red-600 text-white';
  if (isPivot) return 'bg-amber-500 text-zinc-950';
  if (isImpact) return 'bg-purple-600 text-white';
  if (node.originalNode?.role === 'victim_host') return 'bg-sky-600 text-white';
  return 'bg-indigo-600 text-white';
}

function clampPct(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function InspectorContextMiniMap({
  miniMap,
  scopeContext,
  selectedTelemetry,
  onSelectNode,
  onSelectInternalSubNode,
  onSelectTelemetry,
  onReturnToDiagram,
}: InspectorContextMiniMapProps) {
  const focusedIdSet = new Set(miniMap.focusedNodes.map((n) => n.id));
  const neighborIdSet = new Set(
    miniMap.connectedNeighborNodes.map((n) => n.id)
  );
  const focusedZoneIdSet = new Set(miniMap.focusedZones.map((z) => z.id));

  const handleMiniMapNodeClick = (node: WhiteboardSketchNode) => {
    if (scopeContext.isInsideSubBoard && onSelectInternalSubNode) {
      onSelectInternalSubNode(node.id);
    } else {
      onSelectNode(node.id);
    }
  };

  return (
    <section
      data-testid="inspector-context-minimap"
      data-minimap-mode={miniMap.mode}
      className="rounded-2xl bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Top Location & Stage Header Bar */}
      <div className="px-3.5 py-2.5 bg-zinc-50/90 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                TOPOLOGY LOCATION MAP
              </span>
              <span
                data-testid="minimap-stage-badge"
                className="px-1.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-[9px] font-bold"
              >
                {miniMap.stageBadge}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 leading-snug break-words">
              {miniMap.activeZone
                ? `${miniMap.activeZone.code} · ${miniMap.activeZone.title}`
                : miniMap.boardSubtitle}
            </div>
          </div>
        </div>

        <button
          type="button"
          data-testid="minimap-return-to-diagram-btn"
          onClick={onReturnToDiagram}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10.5px] font-mono font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <Crosshair className="w-3 h-3" />
          <span>View in Diagram</span>
        </button>
      </div>

      {/* Miniature Interactive Schematic Canvas (1480x650 logical coordinate projection) */}
      <div
        data-testid="inspector-minimap-schematic"
        className="relative w-full h-56 sm:h-60 bg-[#FDFBF7] dark:bg-[#0B0F17] overflow-hidden select-none border-b border-zinc-200/80 dark:border-zinc-800"
      >
        {/* Subtle Tactical Dot Grid Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-35 dark:opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(rgba(99, 102, 241, 0.35) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />

        {/* SVG Layer: Zones (Focused Zone full detail + Other Zones minimal) & Flows (Connected Arms + Minimal Background Flows) */}
        <svg
          viewBox="0 0 1480 650"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <marker
              id="minimap-arrow-active"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#6366f1" />
            </marker>
            <marker
              id="minimap-arrow-inbound"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>
            <marker
              id="minimap-arrow-outbound"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#e11d48" />
            </marker>
          </defs>

          {/* 1. Minimal Background Zones */}
          {miniMap.allZones.map((zone) => {
            const isFocusedZone = focusedZoneIdSet.has(zone.id);
            if (isFocusedZone) return null;
            const zx = zone.xStart;
            const zy = zone.yStart ?? 14;
            const zw = Math.max(80, zone.xEnd - zone.xStart);
            const zh = Math.max(80, (zone.yEnd ?? 636) - zy);
            return (
              <g key={`minimap-bg-zone-${zone.id}`} opacity={0.38}>
                <rect
                  x={zx}
                  y={zy}
                  width={zw}
                  height={zh}
                  rx={16}
                  fill="none"
                  stroke="#71717a"
                  strokeWidth={2}
                  strokeDasharray="8 6"
                />
                <text
                  x={zx + 18}
                  y={zy + 28}
                  fill="#71717a"
                  fontSize="20"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  {zone.code} · {zone.title}
                </text>
              </g>
            );
          })}

          {/* 2. Focused Active Zone(s) — Full Scaled-Down Container Detail */}
          {miniMap.focusedZones.map((zone) => {
            const zx = zone.xStart;
            const zy = zone.yStart ?? 14;
            const zw = Math.max(80, zone.xEnd - zone.xStart);
            const zh = Math.max(80, (zone.yEnd ?? 636) - zy);
            return (
              <g
                key={`minimap-focused-zone-${zone.id}`}
                data-testid={`minimap-focused-zone-${zone.id}`}
              >
                <rect
                  x={zx}
                  y={zy}
                  width={zw}
                  height={zh}
                  rx={18}
                  fill="rgba(99, 102, 241, 0.06)"
                  stroke={zone.accentHex || '#6366f1'}
                  strokeWidth={4}
                  strokeDasharray="10 5"
                />
                <rect
                  x={zx + 12}
                  y={zy + 10}
                  width={Math.min(zw - 24, 390)}
                  height={34}
                  rx={9}
                  fill="rgba(79, 70, 229, 0.14)"
                  stroke="rgba(99, 102, 241, 0.45)"
                  strokeWidth={1.5}
                />
                <text
                  x={zx + 24}
                  y={zy + 33}
                  fill="#4f46e5"
                  fontSize="21"
                  fontFamily="monospace"
                  fontWeight="800"
                >
                  {zone.code} · {zone.title}
                </text>
              </g>
            );
          })}

          {/* 3. Minimal Background Flows (Non-connected flows) */}
          {miniMap.minimalBackgroundFlows.map((fl) => (
            <path
              key={`minimap-bg-flow-${fl.id}`}
              d={fl.pathD}
              fill="none"
              stroke="#a1a1aa"
              strokeWidth={2}
              strokeDasharray="5 6"
              opacity={0.25}
            />
          ))}

          {/* 4. Connected Arms ("دست‌هایی که بهش وصل هستن") with Directional Arrows & Step Number Badges */}
          {miniMap.connectionArms.map((arm) => {
            const { flow, direction } = arm;
            const strokeColor =
              direction === 'INBOUND'
                ? '#f59e0b'
                : direction === 'OUTBOUND'
                ? '#e11d48'
                : '#6366f1';
            const markerId =
              direction === 'INBOUND'
                ? 'url(#minimap-arrow-inbound)'
                : direction === 'OUTBOUND'
                ? 'url(#minimap-arrow-outbound)'
                : 'url(#minimap-arrow-active)';

            return (
              <g
                key={`minimap-arm-${flow.id}`}
                data-testid={`minimap-connected-arm-${flow.stepNo}`}
              >
                <path
                  d={flow.pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={4.5}
                  markerEnd={markerId}
                  opacity={0.92}
                />
                <circle
                  cx={flow.controlX}
                  cy={flow.controlY}
                  r={18}
                  fill={strokeColor}
                  stroke="#ffffff"
                  strokeWidth={2.5}
                />
                <text
                  x={flow.controlX}
                  y={flow.controlY + 6}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="18"
                  fontFamily="monospace"
                  fontWeight="800"
                >
                  #{flow.stepNo}
                </text>
              </g>
            );
          })}
        </svg>

        {/* HTML Overlay 1: Minimal Background Nodes ("و بقیه موارد رو Minimal نشون بده") */}
        {miniMap.minimalBackgroundNodes.map((node) => {
          const leftPct = clampPct((node.wx / 1480) * 100, 14, 86);
          const topPct = clampPct((node.wy / 650) * 100, 14, 86);
          return (
            <button
              key={`minimap-bg-node-${node.id}`}
              type="button"
              data-testid={`minimap-minimal-node-${node.id}`}
              onClick={() => handleMiniMapNodeClick(node)}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
              }}
              title={`Switch Inspector to #${node.chainOrder} ${node.label}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 max-w-[110px] px-1.5 py-0.5 rounded-md bg-zinc-200/85 dark:bg-zinc-800/85 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-300/80 dark:border-zinc-700 text-[8px] font-mono font-semibold flex items-center gap-1 opacity-70 hover:opacity-100 transition-all cursor-pointer leading-tight text-left"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 shrink-0" />
              <span className="font-bold shrink-0">#{node.chainOrder}</span>
              <span className="break-words">{node.label}</span>
            </button>
          );
        })}

        {/* HTML Overlay 2: Connected Neighbor Nodes ("دست‌هایی که بهش وصل هستن رو مثل ی نقشه Minimal نشون بده") */}
        {miniMap.connectedNeighborNodes.map((node) => {
          const leftPct = clampPct((node.wx / 1480) * 100, 16, 84);
          const topPct = clampPct((node.wy / 650) * 100, 15, 85);
          const matchingArm = miniMap.connectionArms.find(
            (a) => a.neighborNode.id === node.id
          );
          const isInbound = matchingArm?.direction === 'INBOUND';
          return (
            <button
              key={`minimap-neighbor-node-${node.id}`}
              type="button"
              data-testid={`minimap-connected-neighbor-${node.id}`}
              onClick={() => handleMiniMapNodeClick(node)}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
              }}
              title={`Connected Node: #${node.chainOrder} ${node.label} — Click to inspect`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 max-w-[145px] px-2 py-0.5 rounded-lg border shadow-sm text-[8.5px] font-mono font-bold flex items-center gap-1 transition-transform hover:scale-105 cursor-pointer leading-tight text-left ${
                isInbound
                  ? 'bg-amber-50/95 dark:bg-amber-950/90 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700'
                  : 'bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-200 border-rose-400 dark:border-rose-700'
              }`}
            >
              {isInbound ? (
                <ArrowDownLeft className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 shrink-0" />
              ) : (
                <ArrowUpRight className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span className="px-1 py-0.2 rounded bg-zinc-900/10 dark:bg-white/10 shrink-0">
                #{node.chainOrder}
              </span>
              <span className="break-words">{node.label}</span>
            </button>
          );
        })}

        {/* HTML Overlay 3: Primary Focused Node(s) — Full Scaled-Down Visual Card with SketchNodeIcon & Role Header ("خودش رو کامل ولی کوچیک شده نشون بده") */}
        {miniMap.focusedNodes.map((node, idx) => {
          const leftPct = clampPct((node.wx / 1480) * 100, 20, 80);
          const topPct = clampPct((node.wy / 650) * 100, 24, 74);
          const roleTone = getRoleHeaderTone(node);
          const isPrimary = idx === 0;

          return (
            <div
              key={`minimap-focused-node-${node.id}`}
              data-testid={
                isPrimary
                  ? 'minimap-focused-node-card'
                  : `minimap-focused-node-${node.id}`
              }
              onClick={() => handleMiniMapNodeClick(node)}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 w-32 sm:w-36 rounded-xl bg-white dark:bg-zinc-900 border-2 border-indigo-600 dark:border-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.2),0_8px_20px_-4px_rgba(0,0,0,0.28)] p-1.5 flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105"
            >
              {/* Colored Analytical Role Header Pill */}
              <div
                className={`w-full px-1 py-0.5 rounded-md text-[7.5px] font-mono font-extrabold uppercase tracking-wider leading-tight break-words ${roleTone}`}
              >
                #{node.sequenceCode || node.chainOrder} · {node.actionBadge}
              </div>

              {/* Authentic Hand-Drawn SketchNodeIcon (Scaled Down) */}
              <div className="w-12 h-8 my-0.5 flex items-center justify-center scale-90">
                <SketchNodeIcon
                  iconType={node.iconType}
                  isActive={node.isActive}
                  isCompromised={node.isCompromised}
                />
              </div>

              {/* Full Node Title & Sublabel */}
              <div className="text-[9.5px] font-bold text-zinc-950 dark:text-white leading-tight break-words">
                {node.label}
              </div>
              <div className="text-[8px] font-mono text-zinc-500 dark:text-zinc-400 leading-tight break-words max-w-full">
                {node.sublabel}
              </div>
            </div>
          );
        })}

        {/* Bottom-Left Legend Pill inside Mini-Map */}
        <div className="pointer-events-none absolute bottom-2 left-2 z-30 px-2 py-0.5 rounded-md bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-[9px] font-mono text-zinc-600 dark:text-zinc-300 flex items-center gap-2 shadow-2xs">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-indigo-600 inline-block" />
            <span className="font-semibold">Focused</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            <span>Connected ({miniMap.connectionArms.length})</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zinc-400 inline-block" />
            <span>Minimal ({miniMap.minimalBackgroundNodes.length})</span>
          </span>
        </div>
      </div>

      {/* Connected Arms & Neighbors Quick-Switch Footer ("دست‌هایی که بهش وصل هستن") */}
      <div className="px-3.5 py-2.5 bg-zinc-50/60 dark:bg-zinc-950/50 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Network className="w-3 h-3 text-indigo-500" />
            <span>
              Connected Links & Neighbors ({miniMap.connectionArms.length})
            </span>
          </span>
          <span className="text-[9.5px] text-indigo-600 dark:text-indigo-400">
            Click to Inspect
          </span>
        </div>

        {miniMap.connectionArms.length === 0 ? (
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono py-1">
            Full scenario overview active — click any node above to isolate its
            connections.
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {miniMap.connectionArms.map((arm) => {
              const isSelectedFlow =
                selectedTelemetry?.id === arm.flow.telemetryEvent.id ||
                selectedTelemetry?.id === arm.flow.id;
              return (
                <button
                  key={`arm-chip-${arm.flow.id}`}
                  type="button"
                  data-testid={`minimap-arm-chip-${arm.flow.stepNo}`}
                  onClick={() => {
                    if (onSelectTelemetry) {
                      onSelectTelemetry(arm.flow.telemetryEvent);
                    } else {
                      handleMiniMapNodeClick(arm.neighborNode);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-mono border transition-colors cursor-pointer ${
                    isSelectedFlow
                      ? 'bg-rose-600 text-white border-rose-600 font-bold'
                      : arm.direction === 'INBOUND'
                      ? 'bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300/80 dark:border-amber-800/70 hover:bg-amber-100 dark:hover:bg-amber-950/70'
                      : 'bg-rose-50/90 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300/80 dark:border-rose-800/70 hover:bg-rose-100 dark:hover:bg-rose-950/70'
                  }`}
                >
                  <span className="font-extrabold">#{arm.flow.stepNo}</span>
                  <span>
                    {arm.direction === 'INBOUND' ? '◀──' : '──▶'}
                  </span>
                  <span className="font-semibold">
                    {arm.neighborNode.label}
                  </span>
                  <span className="opacity-75">({arm.flow.protocolBadge})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Quick Node Switcher for all nodes on the current board */}
        <div className="pt-1.5 border-t border-zinc-200/70 dark:border-zinc-800/80 flex flex-wrap items-center gap-1">
          <span className="text-[9.5px] font-mono font-bold text-zinc-400 dark:text-zinc-500 mr-1 flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />
            <span>All Sections:</span>
          </span>
          {miniMap.allNodes.map((n) => {
            const isFocused = focusedIdSet.has(n.id);
            const isNeighbor = neighborIdSet.has(n.id);
            return (
              <button
                key={`minimap-switch-${n.id}`}
                type="button"
                data-testid={`minimap-switch-node-${n.id}`}
                onClick={() => handleMiniMapNodeClick(n)}
                className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono transition-colors cursor-pointer ${
                  isFocused
                    ? 'bg-indigo-600 text-white font-bold'
                    : isNeighbor
                    ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-950/60'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                #{n.chainOrder} {n.label}
              </button>
            );
          })}
          {(scopeContext.selectedMainNode || selectedTelemetry) && (
            <button
              type="button"
              data-testid="minimap-reset-to-main-scenario-btn"
              onClick={() => onSelectNode(null)}
              className="ml-auto px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9.5px] font-mono font-semibold cursor-pointer"
            >
              <Layers className="w-2.5 h-2.5 inline mr-1" />
              Main Scenario Page
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
