'use client';

import React, { useMemo, useState } from 'react';
import { AttackScenario } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  ComputedStageView,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import {
  buildEntityDrillDownData,
  buildWhiteboardSchematic,
  DrillDownArchetype,
} from '@/lib/sketch-zones-and-drilldown';
import { Bug, Laptop, Network, ShieldAlert } from 'lucide-react';

type RawTableTabId = Exclude<DrillDownArchetype, 'PACKET_AND_GATEWAY'>;

interface RawTablesViewProps {
  scenario: AttackScenario;
  stageView: ComputedStageView;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  activeEnvironment?: ActiveEnvironmentId;
}

export function RawTablesView({
  scenario,
  stageView,
  selectedNodeId,
  onSelectNode,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
}: RawTablesViewProps) {
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

  const [activeTab, setActiveTab] =
    useState<RawTableTabId>('MALWARE_PROCESSES');

  const drillDown = useMemo(
    () => buildEntityDrillDownData(scenario, activeNode),
    [scenario, activeNode]
  );

  const sectionTabs: Array<{
    id: RawTableTabId;
    label: string;
    icon: React.ReactNode;
    count: number;
  }> = [
    {
      id: 'MALWARE_PROCESSES',
      label: 'Malware & Memory Table',
      icon: <Bug className="w-3.5 h-3.5" />,
      count: drillDown.malwareProcesses.length,
    },
    {
      id: 'LAPTOP_HOST_ACTIVITY',
      label: 'Host Artifacts & Process Tree',
      icon: <Laptop className="w-3.5 h-3.5" />,
      count: drillDown.laptopHostActivities.length,
    },
    {
      id: 'LATERAL_MOVEMENT',
      label: 'Lateral Movement Hops',
      icon: <Network className="w-3.5 h-3.5" />,
      count: drillDown.lateralMovementHops.length,
    },
  ];

  return (
    <div
      className="relative flex-1 w-full h-full overflow-y-auto workbench-scrollbar px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-16 bg-white dark:bg-[#09090B] transition-all duration-200"
      dir="ltr"
      data-testid="raw-tables-view"
      data-active-environment={activeEnvironment}
    >
      <div
        data-testid="raw-tables-full-width-container"
        className="w-full space-y-5"
      >
        {/* Top Control Bar: Node Selector + Forensic Table Type Switcher */}
        <div className="bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <h2
                  title="Raw Forensic Tables & Process Artifacts"
                  className="text-sm font-semibold text-zinc-900 dark:text-white min-w-0 leading-snug"
                >
                  Raw Forensic Tables & Process Artifacts
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
        {activeTab === 'MALWARE_PROCESSES' && (
          <div
            className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden"
            dir="ltr"
            data-testid="raw-table-malware-section"
          >
            <div className="overflow-x-auto">
              <table className="w-full lg:table-fixed text-left border-collapse">
                <thead className="bg-zinc-50/90 dark:bg-zinc-900/80 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-3 px-3 w-14 lg:w-[5%] whitespace-nowrap">
                      STEP
                    </th>
                    <th className="py-3 px-3 w-44 lg:w-[16%]">
                      API / SYSCALL / LOADER
                    </th>
                    <th className="py-3 px-3 w-36 lg:w-[13%]">
                      TARGET PROCESS
                    </th>
                    <th className="py-3 px-3 w-40 lg:w-[13%]">
                      VIRTUAL MEMORY ADDRESS
                    </th>
                    <th
                      data-testid="raw-table-technical-explanation-col"
                      className="py-3 px-4 min-w-[340px] lg:w-[53%]"
                    >
                      TECHNICAL EXPLANATION
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                  {drillDown.malwareProcesses.map((proc) => (
                    <tr
                      key={proc.step}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 align-top"
                    >
                      <td className="py-3 px-3 font-mono font-semibold text-zinc-900 dark:text-white tabular-nums whitespace-nowrap">
                        #{proc.step}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-rose-600 dark:text-rose-400 break-words leading-snug">
                        {proc.apiOrProcess}
                      </td>
                      <td className="py-3 px-3 font-mono text-indigo-600 dark:text-indigo-400 break-words leading-snug">
                        {proc.target}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-600 dark:text-zinc-300 tabular-nums break-words leading-snug">
                        {proc.memoryAddress}
                      </td>
                      <td
                        dir="ltr"
                        className="py-3 px-4 text-zinc-700 dark:text-zinc-200 leading-relaxed break-words"
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
          <div className="space-y-5" data-testid="raw-table-host-section">
            <div
              className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden"
              dir="ltr"
            >
              <div className="overflow-x-auto">
                <table className="w-full lg:table-fixed text-left border-collapse">
                  <thead className="bg-zinc-50/90 dark:bg-zinc-900/80 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                    <tr>
                      <th className="py-3 px-3 w-24 lg:w-[9%] whitespace-nowrap">
                        CATEGORY
                      </th>
                      <th className="py-3 px-3 w-32 lg:w-[11%]">EVENT ID</th>
                      <th className="py-3 px-3 w-40 lg:w-[14%]">
                        ARTIFACT TITLE
                      </th>
                      <th className="py-3 px-3 w-44 lg:w-[16%]">
                        PATH / COMMAND
                      </th>
                      <th
                        data-testid="raw-table-host-description-col"
                        className="py-3 px-4 min-w-[340px] lg:w-[50%]"
                      >
                        DESCRIPTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                    {drillDown.laptopHostActivities.map((act, i) => (
                      <tr
                        key={i}
                        className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 align-top"
                      >
                        <td className="py-3 px-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400 break-words leading-snug">
                          {act.category}
                        </td>
                        <td className="py-3 px-3 font-mono text-amber-600 dark:text-amber-400 font-semibold break-words leading-snug">
                          {act.eventIdBadge}
                        </td>
                        <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-white break-words leading-snug">
                          {act.title}
                        </td>
                        <td className="py-3 px-3 font-mono text-rose-600 dark:text-rose-400 break-all leading-snug">
                          {act.artifactPath}
                        </td>
                        <td
                          dir="ltr"
                          className="py-3 px-4 text-zinc-700 dark:text-zinc-200 leading-relaxed break-words"
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
              <table className="w-full lg:table-fixed text-left border-collapse">
                <thead className="bg-zinc-50/90 dark:bg-zinc-900/80 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="py-3 px-3 w-14 lg:w-[5%] whitespace-nowrap">
                      HOP
                    </th>
                    <th className="py-3 px-3 w-44 lg:w-[16%]">
                      SOURCE → TARGET HOST
                    </th>
                    <th className="py-3 px-3 w-36 lg:w-[12%]">
                      PROTOCOL / PORT
                    </th>
                    <th className="py-3 px-3 w-40 lg:w-[14%]">
                      TECHNIQUE / EVENT ID
                    </th>
                    <th
                      data-testid="raw-table-lateral-summary-col"
                      className="py-3 px-4 min-w-[340px] lg:w-[53%]"
                    >
                      SUMMARY
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
                  {drillDown.lateralMovementHops.map((hop) => (
                    <tr
                      key={hop.hop}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 align-top"
                    >
                      <td className="py-3 px-3 font-mono font-semibold text-zinc-900 dark:text-white tabular-nums whitespace-nowrap">
                        #{hop.hop}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-zinc-900 dark:text-zinc-100 break-words leading-snug">
                        {hop.sourceHost} → {hop.targetHost}
                      </td>
                      <td className="py-3 px-3 font-mono text-indigo-600 dark:text-indigo-400 font-medium break-words leading-snug">
                        {hop.protocol}
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-600 dark:text-amber-400 break-words leading-snug">
                        {hop.technique} · {hop.eventId}
                      </td>
                      <td
                        dir="ltr"
                        className="py-3 px-4 text-zinc-700 dark:text-zinc-200 leading-relaxed break-words"
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
