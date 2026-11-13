'use client';

import React from 'react';
import { motion } from 'motion/react';
import { WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import { Cpu, Layers, Maximize2, ShieldAlert, ShieldCheck } from 'lucide-react';

interface NodeHoverTooltipProps {
  node: WhiteboardSketchNode;
  isSubBoard?: boolean;
}

function formatRoleLabel(node: WhiteboardSketchNode): string {
  const role = node.originalNode?.role;
  if (node.isNetworkDevice) return 'Network Security / Routing Appliance';
  if (role === 'attacker') return 'External Threat Actor / Foothold Origin';
  if (role === 'victim_host') return 'Target Endpoint / Host Operating System';
  if (role === 'process') return 'In-Memory Process / Execution Thread';
  if (role === 'memory') return 'Virtual Memory Region (VAD / Heap)';
  if (role === 'domain_controller') return 'Tier-0 Active Directory KDC Server';
  if (role === 'server') return 'Enterprise Application / Storage Server';
  if (role === 'firewall_siem') return 'SOC SIEM / NDR Telemetry Sensor';
  if (role === 'dns_resolver') return 'Recursive DNS Resolver';
  return 'System Architecture Node';
}

export function NodeHoverTooltip({
  node,
  isSubBoard = false,
}: NodeHoverTooltipProps) {
  const leftPct = Math.min(80, Math.max(20, (node.wx / 1480) * 100));
  const topPct = (node.wy / 650) * 100;
  const placeBelow = topPct < 30;

  const details = node.originalNode?.details;
  const statusLabel = node.isCompromised
    ? 'COMPROMISED / TAMPERED'
    : node.isActive
    ? 'ACTIVE IN ATTACK FLOW'
    : 'MONITORING / STANDBY';

  return (
    <motion.div
      data-testid={`node-hover-tooltip-${node.id}`}
      initial={{ opacity: 0, y: placeBelow ? -6 : 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: placeBelow ? -4 : 4, scale: 0.96 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
      }}
      className={`pointer-events-none absolute -translate-x-1/2 z-50 w-80 rounded-xl bg-zinc-950/95 text-white border border-zinc-700/90 shadow-2xl p-3 space-y-2 backdrop-blur-md ${
        placeBelow
          ? 'translate-y-[58px]'
          : '-translate-y-[calc(100%+58px)]'
      }`}
    >
      {/* Header: Sequence + Role + Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-1.5">
        <span className="text-[10px] font-mono font-bold text-indigo-300 break-words">
          NODE #{node.sequenceCode || node.chainOrder} · {node.actionBadge}
        </span>
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
            node.isCompromised
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          {node.isCompromised ? (
            <ShieldAlert className="w-2.5 h-2.5" />
          ) : (
            <ShieldCheck className="w-2.5 h-2.5" />
          )}
          <span>{statusLabel}</span>
        </span>
      </div>

      {/* Title & Technical Device Role */}
      <div className="space-y-0.5 text-left">
        <div className="text-xs font-bold text-white leading-snug break-words">
          {node.label}
        </div>
        <div className="text-[10px] font-mono text-amber-300 flex items-center gap-1">
          <Cpu className="w-3 h-3 shrink-0" />
          <span className="break-words">{formatRoleLabel(node)}</span>
        </div>
      </div>

      {/* Technical Specs Grid */}
      <div className="grid grid-cols-2 gap-2 text-left text-[9.5px] font-mono bg-zinc-900/90 rounded-lg p-2 border border-zinc-800/80">
        <div className="break-words">
          <span className="text-zinc-400 block text-[8.5px]">ENDPOINT / PORT</span>
          <span className="text-zinc-100 font-semibold break-words">
            {details?.pidOrPort || node.sublabel}
          </span>
        </div>
        <div className="break-words">
          <span className="text-zinc-400 block text-[8.5px]">PRIVILEGE / OS</span>
          <span className="text-zinc-100 font-semibold break-words">
            {details?.privilege || details?.osOrType || 'System Context'}
          </span>
        </div>
      </div>

      {/* Host Context & Activity Summary */}
      <div className="text-left space-y-1 text-[10px]">
        <div className="text-sky-300 font-mono break-words leading-snug">
          {node.hostContext}
        </div>
        <p className="text-zinc-300 leading-snug break-words">
          {node.internalSummary || node.activitySummary || details?.description}
        </p>
      </div>

      {/* Action Hint Footer */}
      <div className="pt-1 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono text-indigo-300">
        <span className="inline-flex items-center gap-1">
          {isSubBoard ? (
            <>
              <Layers className="w-2.5 h-2.5" />
              <span>Click to inspect sub-process telemetry</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-2.5 h-2.5" />
              <span>Click node to expand internal zone view</span>
            </>
          )}
        </span>
      </div>
    </motion.div>
  );
}
