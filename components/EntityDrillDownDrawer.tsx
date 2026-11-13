'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AttackScenario,
  TelemetryEvent } from '@/lib/attack-scenarios';
import {
  buildEntityDrillDownData,
  DrillDownArchetype,
  WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import { Bug, Laptop, Network, Radio, X } from 'lucide-react';

interface EntityDrillDownDrawerProps {
  scenario: AttackScenario;
  selectedSketchNode: WhiteboardSketchNode | null;
  onClose: () => void;
  onSelectTelemetry: (event: TelemetryEvent) => void;
}

export function EntityDrillDownDrawer({
  scenario,
  selectedSketchNode,
  onClose,
  onSelectTelemetry }: EntityDrillDownDrawerProps) {
  const [tabOverride, setTabOverride] = useState<{
    nodeId: string;
    tab: DrillDownArchetype;
  } | null>(null);

  if (!selectedSketchNode) return null;

  const activeTab: DrillDownArchetype =
    tabOverride && tabOverride.nodeId === selectedSketchNode.id
      ? tabOverride.tab
      : selectedSketchNode.archetype;

  const drillDown = buildEntityDrillDownData(scenario, selectedSketchNode);

  const tabs: {
    id: DrillDownArchetype;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'MALWARE_PROCESSES',
      label: 'Processes & Memory',
      icon: <Bug className="w-3.5 h-3.5" /> },
    {
      id: 'LAPTOP_HOST_ACTIVITY',
      label: 'Host Artifacts',
      icon: <Laptop className="w-3.5 h-3.5" /> },
    {
      id: 'LATERAL_MOVEMENT',
      label: 'Lateral Hops',
      icon: <Network className="w-3.5 h-3.5" /> },
    {
      id: 'PACKET_AND_GATEWAY',
      label: 'Packets & SIEM',
      icon: <Radio className="w-3.5 h-3.5" /> },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key={selectedSketchNode.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.16 }}
        onClick={(e) => e.stopPropagation()}
        data-testid="entity-drilldown-drawer"
        dir="ltr"
        className="absolute inset-3 z-40 flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Clean Header + Tab Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {drillDown.nodeLabel}
            </h3>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {drillDown.nodeSublabel}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 overflow-x-auto">
              {tabs.map((tab) => {
                const isTabActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setTabOverride({
                        nodeId: selectedSketchNode.id,
                        tab: tab.id })
                    }
                    data-testid={`drilldown-tab-${tab.id}`}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      isTabActive
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs font-semibold'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onClose}
              data-testid="close-drilldown-btn"
              className="h-8 px-3 flex items-center gap-1.5 text-xs font-medium bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-lg cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Spacious Tab Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'MALWARE_PROCESSES' && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-testid="drilldown-content-malware"
            >
              {drillDown.malwareProcesses.map((proc) => (
                <div
                  key={proc.step}
                  className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 tabular-nums">
                    <span>Step {proc.step}</span>
                    <span>{proc.memoryAddress}</span>
                  </div>
                  <div
                    dir="ltr"
                    className="font-mono text-xs font-semibold text-zinc-900 dark:text-white"
                  >
                    {proc.apiOrProcess}
                  </div>
                  <div
                    dir="ltr"
                    className="text-xs font-mono text-indigo-600 dark:text-indigo-400"
                  >
                    Target: {proc.target}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {proc.detail}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'LAPTOP_HOST_ACTIVITY' && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-testid="drilldown-content-laptop"
            >
              {drillDown.laptopHostActivities.map((act, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>{act.category}</span>
                    <span>{act.eventIdBadge}</span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                    {act.title}
                  </div>
                  <div
                    dir="ltr"
                    className="font-mono text-[11px] text-rose-600 dark:text-rose-400 break-all"
                  >
                    {act.artifactPath}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'LATERAL_MOVEMENT' && (
            <div
              className="space-y-3"
              data-testid="drilldown-content-lateral"
            >
              {drillDown.lateralMovementHops.map((hop) => (
                <div
                  key={hop.hop}
                  className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <span>Hop {hop.hop}</span>
                      <span>·</span>
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        {hop.sourceHost} → {hop.targetHost}
                      </span>
                      <span>·</span>
                      <span>{hop.eventId}</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {hop.summary}
                    </p>
                  </div>

                  <div
                    dir="ltr"
                    className="shrink-0 text-right font-mono text-xs text-indigo-600 dark:text-indigo-400"
                  >
                    <div className="font-semibold">{hop.protocol}</div>
                    <div className="text-[11px] text-zinc-400">
                      {hop.technique}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'PACKET_AND_GATEWAY' && (
            <div
              className="space-y-2.5"
              data-testid="drilldown-content-packets"
              dir="ltr"
            >
              {drillDown.packets.map((pkt) => (
                <button
                  key={pkt.id}
                  type="button"
                  onClick={() => {
                    onSelectTelemetry(pkt.event);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {pkt.protocol}
                      </span>
                      <span className="text-zinc-900 dark:text-white font-semibold">
                        {pkt.src} → {pkt.dst}
                      </span>
                    </div>
                    <span className="text-zinc-400 tabular-nums">
                      {pkt.flagsOrSize} · {pkt.timestamp}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-zinc-600 dark:text-zinc-300 truncate">
                    {pkt.payloadPreview}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
