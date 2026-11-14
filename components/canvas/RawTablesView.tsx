'use client';

import React, { useMemo, useState } from 'react';
import {
  AttackScenario,
  TelemetryEvent } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  ComputedStageView,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile } from '@/lib/simulation-engine';
import {
  buildEntityDrillDownData,
  buildWhiteboardSchematic,
  DrillDownArchetype } from '@/lib/sketch-zones-and-drilldown';
import { Bug, Laptop, Network, Radio, ShieldAlert } from 'lucide-react';

interface RawTablesViewProps {
  scenario: AttackScenario;
  stageView: ComputedStageView;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  activeEnvironment?: ActiveEnvironmentId;
}

export function RawTablesView({
  scenario,
  stageView,
  selectedNodeId,
  onSelectNode,
  selectedTelemetryId,
  onSelectTelemetry,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT }: RawTablesViewProps) {
  const activeStageIndex = stageView.currentStage
    ? stageView.currentStage.index
    : 0;
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  const { nodes: sketchNodes } = useMemo(
    () =>
      buildWhiteboardSchematic(scenario, activeStageIndex, activeEnvironment),
    [scenario, activeStageIndex, activeEnvironment]
  );

  const activeNode = useMemo(
    () =>
      sketchNodes.find((n) => n.id === selectedNodeId) || sketchNodes[0],
    [sketchNodes, selectedNodeId]
  );

  const [activeTab, setActiveTab] = useState<DrillDownArchetype>('PACKET_AND_GATEWAY');

  const drillDown = useMemo(
    () => buildEntityDrillDownData(scenario, activeNode),
    [scenario, activeNode]
  );

  const sectionTabs: Array<{
    id: DrillDownArchetype;
    label: string;
    icon: React.ReactNode;
    count: number;
  }> = [
    {
      id: 'PACKET_AND_GATEWAY',
      label: 'Captured Packets & SIEM',
      icon: <Radio className="w-3.5 h-3.5" />,
      count: drillDown.packets.length },
    {
      id: 'MALWARE_PROCESSES',
      label: 'Malware & Memory Table',
      icon: <Bug className="w-3.5 h-3.5" />,
      count: drillDown.malwareProcesses.length },
    {
      id: 'LAPTOP_HOST_ACTIVITY',
      label: 'Host Artifacts & Process Tree',
      icon: <Laptop className="w-3.5 h-3.5" />,
      count: drillDown.laptopHostActivities.length },
    {
      id: 'LATERAL_MOVEMENT',
      label: 'Lateral Movement Hops',
      icon: <Network className="w-3.5 h-3.5" />,
      count: drillDown.lateralMovementHops.length },
  ];

  return (
    <div
      className="relative flex-1 w-full h-full overflow-auto p-3 pb-16 sm:p-6 bg-white dark:bg-[#09090B]"
      dir="ltr"
      data-testid="raw-tables-view"
      data-active-environment={activeEnvironment}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Control Bar: Node Selector + Forensic Table Type Switcher */}
        <div className="bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <h2
                  title="Raw Forensic Tables & Captured Network Packets"
                  className="text-sm font-semibold text-zinc-900 dark:text-white min-w-0 leading-snug"
                >
                  Raw Forensic Tables & Captured Network Packets
                </h2>
                <span
                  data-testid="raw-tables-env-badge"
                  title={`${envProfile.badgeLabel} · ${envProfile.environmentTag}`}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono text-[10px] font-bold shrink-0"
                >
                  {envProfile.badgeLabel} · {envProfile.environmentTag}
                </span>
              </div>
              <p
                title={`Inspecting Node: ${drillDown.nodeLabel} (${drillDown.nodeSublabel})`}
                className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug break-words"
              >
                Inspecting Node: {drillDown.nodeLabel} ({drillDown.nodeSublabel})
              </p>
            </div>

            {/* Node Filter Strip */}
            <div
              dir="ltr"
              className="flex flex-wrap items-center gap-1.5 min-w-0"
              role="group"
              aria-label="Select Node for Raw Tables"
            >
              {sketchNodes.map((n) => {
                const isSelected = n.id === activeNode.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    data-testid={`raw-table-node-btn-${n.chainOrder}`}
                    title={`#${n.chainOrder} ${n.label} (${n.sublabel})`}
                    onClick={() => onSelectNode(n.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-2xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    #{n.chainOrder} {n.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Table Type Tabs */}
          <div
            role="tablist"
            aria-label="Forensic Table Category"
            className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-zinc-200/70 dark:border-zinc-800"
          >
            {sectionTabs.map((tab) => {
              const isTabActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isTabActive}
                  data-testid={`raw-tables-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                    isTabActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10.5px] font-mono tabular-nums ${
                      isTabActive ? 'text-indigo-100' : 'text-zinc-400'
                    }`}
                  >
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Content Area */}
        {activeTab === 'PACKET_AND_GATEWAY' && (
          <div
            className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden"
            dir="ltr"
            data-testid="raw-table-packets-section"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50/90 dark:bg-zinc-900/80 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-3 px-4 w-24">STEP</th>
                    <th className="py-3 px-4 w-28">TIME</th>
                    <th className="py-3 px-4 w-36">PROTOCOL / EID</th>
                    <th className="py-3 px-4 w-56">SOURCE → DESTINATION</th>
                    <th className="py-3 px-4 w-36">SIZE / CODE</th>
                    <th className="py-3 px-4">RAW PAYLOAD / FORENSIC SUMMARY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs font-mono">
                  {drillDown.packets.map((pkt, idx) => {
                    const isSelected = selectedTelemetryId === pkt.event.id;
                    return (
                      <tr
                        key={pkt.id}
                        onClick={() => onSelectTelemetry(pkt.event)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/40'
                            : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-white tabular-nums whitespace-nowrap">
                          #{idx + 1} · S{pkt.event.stageIndex}
                        </td>
                        <td className="py-3 px-4 text-zinc-500 tabular-nums whitespace-nowrap">
                          {pkt.timestamp}
                        </td>
                        <td className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                          {pkt.protocol}
                        </td>
                        <td className="py-3 px-4 text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                          {pkt.src} → {pkt.dst}
                        </td>
                        <td className="py-3 px-4 text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap">
                          {pkt.flagsOrSize}
                        </td>
                        <td className="py-3 px-4 text-zinc-600 dark:text-zinc-300 break-words leading-relaxed min-w-[320px]">
                          {pkt.payloadPreview}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'MALWARE_PROCESSES' && (
          <div
            className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden"
            dir="ltr"
            data-testid="raw-table-malware-section"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50/90 dark:bg-zinc-900/80 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-3 px-4 w-20">STEP</th>
                    <th className="py-3 px-4 w-64">WIN32 API / SYSCALL</th>
                    <th className="py-3 px-4 w-52">TARGET PROCESS / MODULE</th>
                    <th className="py-3 px-4 w-48">MEMORY ADDRESS / PERM</th>
                    <th className="py-3 px-4">TECHNICAL EXPLANATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                  {drillDown.malwareProcesses.map((proc) => (
                    <tr
                      key={proc.step}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-zinc-900 dark:text-white tabular-nums">
                        #{proc.step}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-rose-600 dark:text-rose-400">
                        {proc.apiOrProcess}
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                        {proc.target}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-300 tabular-nums">
                        {proc.memoryAddress}
                      </td>
                      <td
                        dir="ltr"
                        className="py-3 px-4 text-zinc-600 dark:text-zinc-300 leading-relaxed"
                      >
                        {proc.detail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'LAPTOP_HOST_ACTIVITY' && (
          <div className="space-y-6" data-testid="raw-table-host-section">
            <div
              className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden"
              dir="ltr"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-50/90 dark:bg-zinc-900/80 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                    <tr>
                      <th className="py-3 px-4 w-32">CATEGORY</th>
                      <th className="py-3 px-4 w-36">EVENT ID</th>
                      <th className="py-3 px-4 w-56">ARTIFACT TITLE</th>
                      <th className="py-3 px-4 w-64">PATH / COMMAND</th>
                      <th className="py-3 px-4">DESCRIPTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                    {drillDown.laptopHostActivities.map((act, i) => (
                      <tr
                        key={i}
                        className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40"
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                          {act.category}
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-600 dark:text-amber-400 font-semibold">
                          {act.eventIdBadge}
                        </td>
                        <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                          {act.title}
                        </td>
                        <td className="py-3 px-4 font-mono text-rose-600 dark:text-rose-400 break-all">
                          {act.artifactPath}
                        </td>
                        <td
                          dir="ltr"
                          className="py-3 px-4 text-zinc-600 dark:text-zinc-300 leading-relaxed"
                        >
                          {act.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Host Process Table */}
            <div className="bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-3 min-w-0">
              <div className="flex items-center gap-2 min-w-0 text-xs font-semibold text-zinc-900 dark:text-white">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Host Process Tree Table</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3" dir="ltr">
                {scenario.processTree.map((pt) => (
                  <div
                    key={pt.pid}
                    className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-1 min-w-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 text-xs font-mono font-semibold text-zinc-900 dark:text-white">
                      <span title={pt.name} className="min-w-0 leading-snug">
                        {pt.name}
                      </span>
                      <span
                        title={`PID ${pt.pid}`}
                        className="text-rose-600 dark:text-rose-400 tabular-nums shrink-0"
                      >
                        PID {pt.pid}
                      </span>
                    </div>
                    <div
                      title={`PPID ${pt.ppid} · ${pt.integrity}`}
                      className="text-[11px] font-mono text-zinc-400 tabular-nums leading-snug"
                    >
                      PPID {pt.ppid} · {pt.integrity}
                    </div>
                    <div
                      title={pt.commandLine}
                      className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 leading-snug pt-1 break-all"
                    >
                      {pt.commandLine}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'LATERAL_MOVEMENT' && (
          <div
            className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden"
            dir="ltr"
            data-testid="raw-table-lateral-section"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50/90 dark:bg-zinc-900/80 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-3 px-4 w-20">HOP</th>
                    <th className="py-3 px-4 w-56">SOURCE → TARGET HOST</th>
                    <th className="py-3 px-4 w-44">PROTOCOL / PORT</th>
                    <th className="py-3 px-4 w-48">TECHNIQUE / EVENT ID</th>
                    <th className="py-3 px-4">SUMMARY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                  {drillDown.lateralMovementHops.map((hop) => (
                    <tr
                      key={hop.hop}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-zinc-900 dark:text-white tabular-nums">
                        #{hop.hop}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-zinc-900 dark:text-white">
                        {hop.sourceHost} → {hop.targetHost}
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                        {hop.protocol}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-600 dark:text-amber-400">
                        {hop.technique} · {hop.eventId}
                      </td>
                      <td
                        dir="ltr"
                        className="py-3 px-4 text-zinc-600 dark:text-zinc-300 leading-relaxed"
                      >
                        {hop.summary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
