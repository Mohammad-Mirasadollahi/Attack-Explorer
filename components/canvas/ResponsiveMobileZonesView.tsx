'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  TelemetryEvent } from '@/lib/attack-scenarios';
import {
  NETWORK_ZONE_COLUMNS,
  NetworkZoneColumn,
  WhiteboardSketchFlow,
  WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import { SketchNodeIcon } from '../SketchNodeIcons';
import { ArrowDown, Radio } from 'lucide-react';

interface ResponsiveMobileZonesViewProps {
  zones?: NetworkZoneColumn[];
  sketchNodes: WhiteboardSketchNode[];
  sketchFlows: WhiteboardSketchFlow[];
  selectedSketchNode: WhiteboardSketchNode | null;
  onSelectNode: (node: WhiteboardSketchNode) => void;
  onExpandNode?: (node: WhiteboardSketchNode) => void;
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
}

export function ResponsiveMobileZonesView({
  zones = NETWORK_ZONE_COLUMNS,
  sketchNodes,
  sketchFlows,
  selectedSketchNode,
  onSelectNode,
  onExpandNode,
  selectedTelemetryId,
  onSelectTelemetry }: ResponsiveMobileZonesViewProps) {
  return (
    <div
      data-testid="responsive-mobile-zones-view"
      className="w-full h-full overflow-y-auto p-2 space-y-2 bg-[#FDFBF7] dark:bg-[#0D111A]"
    >
      {zones.map((zone, zIdx) => {
        const zoneNodes = sketchNodes.filter((n) => n.zoneId === zone.id);
        const zoneFlows = sketchFlows.filter(
          (f) =>
            f.isVisible &&
            (zoneNodes.some((zn) => zn.id === f.fromNodeId) ||
              (zIdx === zones.length - 1 &&
                zoneNodes.some((zn) => zn.id === f.toNodeId)))
        );

        return (
          <React.Fragment key={zone.id}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: zIdx * 0.03 }}
              style={{
                borderColor: `${zone.accentHex}55` }}
              className={`rounded-xl border border-dashed p-2 space-y-2 ${zone.bgTintClass}`}
            >
              {/* Compact Zone Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 bg-white/95 dark:bg-zinc-900/95 px-2 py-1 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                <span
                  title={zone.code}
                  style={{ backgroundColor: zone.accentHex }}
                  className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-white rounded uppercase shrink-0"
                >
                  {zone.code}
                </span>
                <span
                  title={zone.title}
                  className="text-[10px] font-bold text-zinc-800 dark:text-zinc-100 min-w-0 leading-snug break-words"
                >
                  {zone.title}
                </span>
              </div>

              {/* Zone Nodes (1 or 2 columns depending on node count) */}
              <div
                className={`grid gap-2 ${
                  zoneNodes.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {zoneNodes.map((node) => {
                  const isSelected = selectedSketchNode?.id === node.id;
                  return (
                    <motion.button
                      key={node.id}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      title={`${node.actionBadge} · ${node.label} (${node.sublabel})${
                        node.hostContext ? ` | ${node.hostContext}` : ''
                      }${node.activitySummary ? ` | ${node.activitySummary}` : ''} · Double-tap to expand`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectNode(node);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onExpandNode?.(node);
                      }}
                      className={`flex flex-col items-center text-center p-1.5 rounded-lg bg-white/95 dark:bg-zinc-900/95 border transition-all cursor-pointer min-w-0 ${
                        isSelected
                          ? 'ring-1.5 ring-indigo-500 border-indigo-500 shadow-2xs'
                          : 'border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <span
                        title={node.actionBadge}
                        className={`mb-0.5 px-1.5 py-0.2 text-[8.5px] font-medium border rounded-full leading-snug break-words max-w-full ${
                          node.iconType === 'MALWARE_PAYLOAD'
                            ? 'bg-rose-50 dark:bg-rose-950/90 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                            : node.iconType === 'VICTIM_LAPTOP'
                            ? 'bg-sky-50 dark:bg-sky-950/90 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700'
                            : node.iconType === 'LATERAL_SERVER'
                            ? 'bg-violet-50 dark:bg-violet-950/90 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-amber-50 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        }`}
                      >
                        {node.actionBadge.split('·')[0]?.trim() || node.actionBadge}
                      </span>

                      <SketchNodeIcon
                        iconType={node.iconType}
                        isActive={node.isActive}
                        isCompromised={node.isCompromised}
                      />

                      <div
                        title={node.label}
                        className="mt-0.5 text-[10px] font-semibold text-zinc-900 dark:text-white leading-snug break-words w-full"
                      >
                        {node.label}
                      </div>
                      <div
                        title={node.sublabel}
                        className="text-[8.5px] font-mono text-zinc-500 dark:text-zinc-400 leading-snug break-words w-full"
                      >
                        {node.sublabel}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Active Packet Flows originating from this zone */}
              {zoneFlows.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1 pt-0.5 min-w-0">
                  {zoneFlows.map((flow) => {
                    const isSelected =
                      selectedTelemetryId === flow.telemetryEvent.id;
                    return (
                      <button
                        key={flow.id}
                        type="button"
                        title={`#${flow.sequenceCode || flow.stepNo} [S${flow.stageIndex}] · ${flow.initiatorLabel} ⇄ ${flow.targetLabel} | ${flow.forwardSeq}→ ${flow.label} · ⇠${flow.returnSeq} ${flow.returnLabel}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTelemetry(flow.telemetryEvent);
                        }}
                        className={`inline-flex flex-col items-start gap-0.5 px-2 py-1 text-[9px] font-mono rounded-md border transition-all cursor-pointer max-w-full ${
                          flow.isCurrentStep || isSelected
                            ? 'bg-rose-600 text-white border-slate-900'
                            : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700'
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-1 font-bold min-w-0 max-w-full">
                          <Radio className="w-2.5 h-2.5 text-amber-400 animate-pulse shrink-0" />
                          <span className="leading-snug break-words">
                            #{flow.sequenceCode || flow.stepNo} [S{flow.stageIndex}] ·{' '}
                            {flow.initiatorLabel} ⇄ {flow.targetLabel}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[8px] opacity-90 min-w-0 max-w-full">
                          <span className="leading-snug break-words">
                            {flow.forwardSeq}→ {flow.label}
                          </span>
                          <span className="shrink-0">·</span>
                          <span className="leading-snug break-words">
                            ⇠{flow.returnSeq} {flow.returnLabel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Compact Bidirectional Connector Arrow Between Mobile Network Zones */}
            {zIdx < zones.length - 1 && (
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-mono text-zinc-600 dark:text-zinc-300">
                  <ArrowDown className="w-2.5 h-2.5 text-rose-500" />
                  <span>Zone {zIdx + 1} ⇄ {zIdx + 2} (Req / Resp)</span>
                </span>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
