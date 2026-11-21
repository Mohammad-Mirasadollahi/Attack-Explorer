'use client';

import React from 'react';
import { GitBranch, Network } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TelemetryEvent } from '@/lib/attack-scenarios';
import type {
  InspectorMiniMapConnectionArm,
  InspectorScopeContext,
} from '@/lib/inspector-scope';
import type { WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import { SketchNodeIcon } from '../SketchNodeIcons';

export interface TopologyLinksSectionProps {
  schematic: InspectorScopeContext['schematic'];
  focusedNode: WhiteboardSketchNode | null;
  focusedNodeId: string | null;
  focusedInternalSubNode: InspectorScopeContext['focusedInternalSubNode'];
  activeSubBoard: InspectorScopeContext['internalSubBoard'];
  connectionArms: InspectorMiniMapConnectionArm[];
  selectedTelemetry?: TelemetryEvent | null;
  onSelectNode?: (nodeId: string | null) => void;
  onSelectSubNode?: (subNodeId: string | null) => void;
  onSelectTelemetry?: (event: TelemetryEvent) => void;
}

export function TopologyLinksSection({
  schematic,
  focusedNode,
  focusedNodeId,
  focusedInternalSubNode,
  activeSubBoard,
  connectionArms,
  selectedTelemetry,
  onSelectNode,
  onSelectSubNode,
  onSelectTelemetry,
}: TopologyLinksSectionProps) {
  return (
    <div className="p-4 sm:p-5 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Network className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
            {focusedNode
              ? `Focused Section & Neighbor Links — #${focusedNode.chainOrder} ${focusedNode.label}`
              : `Interactive Topology Sections & Connected Links (${schematic.nodes.length} Sections)`}
          </span>
        </div>
        <span className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400">
          Click any section or link to scope all explanations & telemetry
        </span>
      </div>

      {focusedNode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          <div
            data-testid="minimap-focused-node-card"
            className="lg:col-span-5 rounded-xl border-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-zinc-900 p-3.5 shadow-sm flex flex-col justify-between gap-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-mono font-extrabold uppercase tracking-wider leading-snug break-words">
                ACTIVE FOCUS · #
                {focusedNode.sequenceCode || focusedNode.chainOrder} ·{' '}
                {focusedNode.actionBadge}
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                {focusedNode.zoneLabel || focusedNode.zoneId}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-12 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 p-1">
                <SketchNodeIcon
                  iconType={focusedNode.iconType}
                  isActive={focusedNode.isActive}
                  isCompromised={focusedNode.isCompromised}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                  {focusedNode.label}
                </div>
                <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 leading-snug break-words mt-0.5">
                  {focusedNode.sublabel}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug break-words pt-1 border-t border-zinc-100 dark:border-zinc-800">
              {focusedNode.activitySummary || focusedNode.internalSummary}
            </p>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-3.5 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-rose-500" />
                Connected Links & Neighbors ({connectionArms.length})
              </span>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                Click to Inspect Neighbor or Packet
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {connectionArms.slice(0, 6).map((arm) => {
                const isInbound = arm.direction === 'INBOUND';
                const isSelected =
                  selectedTelemetry?.id === arm.flow.telemetryEvent.id;
                return (
                  <button
                    key={arm.flow.id}
                    type="button"
                    onClick={() => {
                      if (onSelectTelemetry) {
                        onSelectTelemetry(arm.flow.telemetryEvent);
                      } else {
                        onSelectNode?.(arm.neighborNode.id);
                      }
                    }}
                    data-testid={`minimap-arm-chip-${arm.flow.id}`}
                    className={cn(
                      'text-left p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1',
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500/40'
                        : isInbound
                          ? 'bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-300 dark:bg-emerald-950/25 dark:hover:bg-emerald-950/45 dark:border-emerald-500/40'
                          : 'bg-rose-50/60 hover:bg-rose-100/70 border-rose-300 dark:bg-rose-950/25 dark:hover:bg-rose-950/45 dark:border-rose-500/40'
                    )}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold',
                          isInbound
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        )}
                      >
                        #{arm.flow.sequenceCode} · STAGE S{arm.flow.stageIndex}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                        {isInbound ? '⇠ INBOUND' : '──▶ OUTBOUND'}
                      </span>
                    </div>
                    <div className="text-[12px] font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                      #{arm.neighborNode.chainOrder} {arm.neighborNode.label}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 leading-snug break-words">
                      {arm.flow.label} ({arm.flow.protocolBadge})
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {connectionArms.slice(0, 6).map((arm) => (
            <button
              key={arm.flow.id}
              type="button"
              onClick={() => onSelectNode?.(arm.neighborNode.id)}
              data-testid={`minimap-arm-chip-${arm.flow.id}`}
              className="text-left p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 transition-all cursor-pointer flex flex-col gap-1"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono font-extrabold">
                  #{arm.flow.sequenceCode} ──▶ #{arm.neighborNode.chainOrder}{' '}
                  {arm.neighborNode.label}
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-500">
                  S{arm.flow.stageIndex}
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 leading-snug break-words">
                {arm.flow.label} ({arm.flow.protocolBadge})
              </div>
            </button>
          ))}
        </div>
      )}

      {activeSubBoard && activeSubBoard.subNodes.length > 0 && (
        <div
          data-testid="minimap-internal-subnode-strip"
          className="pt-2.5 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              INTERNAL SUB-COMPONENTS INSIDE {focusedNode?.label || 'HOST'} (
              {activeSubBoard.subNodes.length})
            </span>
            {focusedInternalSubNode && (
              <button
                type="button"
                onClick={() => onSelectSubNode?.(null)}
                className="text-[10px] font-mono font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
              >
                Reset to Whole Host
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {activeSubBoard.subNodes.map((sn, idx) => {
              const isSelectedSub = focusedInternalSubNode?.id === sn.id;
              return (
                <button
                  key={sn.id}
                  type="button"
                  onClick={() =>
                    onSelectSubNode?.(isSelectedSub ? null : sn.id)
                  }
                  data-testid={`minimap-subnode-pill-${sn.id}`}
                  className={cn(
                    'text-left p-2 rounded-lg border transition-all cursor-pointer',
                    isSelectedSub
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : 'bg-white hover:bg-indigo-50/60 dark:bg-zinc-900 dark:hover:bg-indigo-950/30 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
                  )}
                >
                  <div className="text-[10px] font-mono font-extrabold uppercase opacity-80">
                    SUB-NODE {idx + 1} · {sn.actionBadge}
                  </div>
                  <div className="text-[11.5px] font-bold leading-snug break-words mt-0.5">
                    {sn.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mr-1">
          All Sections:
        </span>
        {schematic.nodes.map((node) => {
          const isFocused = node.id === focusedNodeId;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode?.(node.id)}
              data-testid={`minimap-switch-node-${node.id}`}
              className={cn(
                'px-2 py-0.5 rounded text-[10.5px] font-mono font-bold transition-all cursor-pointer leading-snug break-words',
                isFocused
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-800'
              )}
            >
              #{node.chainOrder} {node.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
