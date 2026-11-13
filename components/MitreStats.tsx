'use client';

import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AttackScenario } from '@/lib/attack-scenarios';
import {
  computeMitreTacticFrequency,
  MitreTacticFrequencyItem,
} from '@/lib/threat-intel-service';
import { BarChart3, ShieldAlert } from 'lucide-react';
import { WorkbenchIconTooltip } from './WorkbenchIconTooltip';

interface MitreStatsProps {
  scenario: AttackScenario;
  activeStageIndex?: number;
  onSelectStage?: (stageIndex: number) => void;
}

export function MitreStats({
  scenario,
  activeStageIndex = 0,
  onSelectStage,
}: MitreStatsProps) {
  const [metricMode, setMetricMode] = useState<'STAGES' | 'TELEMETRY'>(
    'STAGES'
  );

  const tacticData = useMemo(
    () => computeMitreTacticFrequency(scenario),
    [scenario]
  );

  const activeTacticsCount = useMemo(
    () => tacticData.filter((d) => d.scenarioStageCount > 0).length,
    [tacticData]
  );

  const uniqueTechniques = useMemo(() => {
    const set = new Set<string>();
    scenario.stages.forEach((s) => set.add(s.mitreTechniqueId));
    return Array.from(set);
  }, [scenario]);

  const handleBarClick = (entry: MitreTacticFrequencyItem) => {
    if (!onSelectStage) return;
    const matchingStage = scenario.stages.find(
      (s) => s.mitreTacticPhase === entry.phase
    );
    if (matchingStage) {
      onSelectStage(matchingStage.index);
    }
  };

  return (
    <section
      data-testid="mitre-stats-card"
      aria-label="MITRE ATT&CK Coverage Statistics"
      className="p-3 rounded-xl bg-zinc-50/90 dark:bg-zinc-900/75 border border-zinc-200/90 dark:border-zinc-800 space-y-2.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <WorkbenchIconTooltip
          label="MITRE ATT&CK Tactic Coverage"
          detail="Enterprise matrix tactic distribution across scenario stages and SIEM telemetry events"
          placement="top"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              MITRE Tactic Coverage
            </h4>
          </div>
        </WorkbenchIconTooltip>

        <div className="flex items-center gap-1 p-0.5 rounded-md bg-zinc-200/75 dark:bg-zinc-800 shrink-0">
          <button
            type="button"
            data-testid="mitre-stats-mode-stages"
            onClick={() => setMetricMode('STAGES')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
              metricMode === 'STAGES'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Stages
          </button>
          <button
            type="button"
            data-testid="mitre-stats-mode-telemetry"
            onClick={() => setMetricMode('TELEMETRY')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
              metricMode === 'TELEMETRY'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Events
          </button>
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
        <span>
          Active Tactics: <strong className="text-zinc-900 dark:text-zinc-100">{activeTacticsCount}/7</strong>
        </span>
        <span>·</span>
        <span>
          Techniques: <strong className="text-indigo-600 dark:text-indigo-400">{uniqueTechniques.length}</strong>
        </span>
        <span>·</span>
        <span>
          Primary: <strong className="text-rose-600 dark:text-rose-400">TA0{scenario.primaryMitrePhase}</strong>
        </span>
      </div>

      {/* Recharts BarChart of Tactic Frequency */}
      <div
        data-testid="mitre-stats-chart-container"
        className="w-full h-36 pt-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={tacticData}
            margin={{ top: 6, right: 8, left: -22, bottom: 2 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.22)"
            />
            <XAxis
              dataKey="phase"
              tickFormatter={(val: number) => `TA0${val}`}
              tick={{ fontSize: 9, fill: '#71717A', fontFamily: 'monospace' }}
              interval={0}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 9, fill: '#71717A', fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const item = payload[0].payload as MitreTacticFrequencyItem;
                return (
                  <div className="rounded-lg bg-zinc-950 text-white border border-zinc-800 px-2.5 py-2 shadow-xl text-[10px] font-mono space-y-1 max-w-[260px]">
                    <div className="font-bold text-amber-300 break-words">
                      {item.fullName}
                    </div>
                    <div className="flex items-center justify-between gap-3 text-zinc-300">
                      <span>Scenario Stages:</span>
                      <span className="font-bold text-white">
                        {item.scenarioStageCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-zinc-300">
                      <span>Telemetry Events:</span>
                      <span className="font-bold text-emerald-400">
                        {item.scenarioTelemetryCount}
                      </span>
                    </div>
                    {item.techniques.length > 0 && (
                      <div className="pt-1 border-t border-zinc-800 text-indigo-300 break-words">
                        IDs: {item.techniques.join(', ')}
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Bar
              dataKey={
                metricMode === 'STAGES'
                  ? 'scenarioStageCount'
                  : 'scenarioTelemetryCount'
              }
              radius={[4, 4, 0, 0]}
              onClick={(data) => {
                if (data?.payload) {
                  handleBarClick(data.payload as MitreTacticFrequencyItem);
                }
              }}
              className="cursor-pointer"
            >
              {tacticData.map((entry) => {
                const currentStage =
                  activeStageIndex > 0
                    ? scenario.stages.find((s) => s.index === activeStageIndex)
                    : null;
                const isCurrentStageTactic =
                  currentStage?.mitreTacticPhase === entry.phase;

                return (
                  <Cell
                    key={`cell-${entry.phase}`}
                    fill={
                      isCurrentStageTactic
                        ? '#E11D48'
                        : entry.scenarioStageCount > 0
                        ? entry.fillHex
                        : 'rgba(148, 163, 184, 0.28)'
                    }
                    stroke={isCurrentStageTactic ? '#FDE047' : 'none'}
                    strokeWidth={isCurrentStageTactic ? 1.5 : 0}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Full Tactic Names Breakdown Grid with Concise Label + Tooltip */}
      <div className="grid grid-cols-2 gap-1 text-[9.5px] font-mono">
        {tacticData.map((t) => {
          const count =
            metricMode === 'STAGES'
              ? t.scenarioStageCount
              : t.scenarioTelemetryCount;
          return (
            <div
              key={t.phase}
              title={`${t.fullName} — ${count} ${metricMode === 'STAGES' ? 'Stages' : 'Events'}`}
              className={`flex items-center justify-between gap-1 px-1.5 py-0.5 rounded border min-w-0 ${
                count > 0
                  ? 'bg-white dark:bg-zinc-950 border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold'
                  : 'bg-zinc-100/50 dark:bg-zinc-900/40 border-transparent text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <span className="min-w-0 leading-tight break-words">
                TA0{t.phase} · {t.shortName}
              </span>
              <span className="shrink-0 font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Covered Technique Links */}
      <div className="pt-1 border-t border-zinc-200/70 dark:border-zinc-800/80 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
        <ShieldAlert className="w-3 h-3 text-rose-500 shrink-0" />
        {scenario.stages.map((st) => {
          const isCurrent = activeStageIndex === st.index;
          return (
            <button
              key={st.index}
              type="button"
              data-testid={`mitre-stats-stage-chip-${st.index}`}
              onClick={() => onSelectStage?.(st.index)}
              title={`Stage ${st.index}: ${st.mitreTechniqueName}`}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
                isCurrent
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400'
              }`}
            >
              S{st.index}:{st.mitreTechniqueId}
            </button>
          );
        })}
      </div>
    </section>
  );
}
