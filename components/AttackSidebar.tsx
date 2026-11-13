'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ATTACK_SCENARIOS,
  AttackCategory,
  AttackScenario,
} from '@/lib/attack-scenarios';
import {
  categorizeScenarios,
  ScenarioGroupByMode,
  ScenarioSortOption,
  sortScenarios,
} from '@/lib/simulation-engine';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  FolderTree,
  Search,
} from 'lucide-react';
import { OperationalGuideIcon } from './OperationalGuideIcon';
import { WorkbenchIconTooltip } from './WorkbenchIconTooltip';

interface AttackSidebarProps {
  category: AttackCategory;
  onSelectCategory: (cat: AttackCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  displayedScenarios: AttackScenario[];
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  sortBy?: ScenarioSortOption;
  onSortChange?: (sort: ScenarioSortOption) => void;
  groupBy?: ScenarioGroupByMode;
  onGroupByChange?: (group: ScenarioGroupByMode) => void;
}

export function AttackSidebar({
  category,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  displayedScenarios,
  activeScenarioId,
  onSelectScenario,
  sortBy: externalSortBy,
  onSortChange,
  groupBy: externalGroupBy,
  onGroupByChange,
}: AttackSidebarProps) {
  const [internalSortBy, setInternalSortBy] =
    useState<ScenarioSortOption>('DEFAULT');
  const [internalGroupBy, setInternalGroupBy] =
    useState<ScenarioGroupByMode>('CATEGORY');
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  const sortBy = externalSortBy ?? internalSortBy;
  const groupBy = externalGroupBy ?? internalGroupBy;

  const handleSortChange = (next: ScenarioSortOption) => {
    if (onSortChange) {
      onSortChange(next);
    } else {
      setInternalSortBy(next);
    }
  };

  const handleGroupByChange = (next: ScenarioGroupByMode) => {
    if (onGroupByChange) {
      onGroupByChange(next);
    } else {
      setInternalGroupBy(next);
    }
  };

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const categories: Array<{
    id: AttackCategory;
    label: string;
    tooltip: string;
    count: number;
  }> = [
    {
      id: 'ALL',
      label: 'All',
      tooltip: 'All Attack Scenarios',
      count: ATTACK_SCENARIOS.length,
    },
    {
      id: 'MALWARE',
      label: 'Malware',
      tooltip: 'Malware & Process Execution Scenarios',
      count: ATTACK_SCENARIOS.filter((s) => s.category === 'MALWARE').length,
    },
    {
      id: 'LOG_ANALYSIS',
      label: 'DFIR',
      tooltip: 'DFIR & Log Forensics Scenarios',
      count: ATTACK_SCENARIOS.filter((s) => s.category === 'LOG_ANALYSIS')
        .length,
    },
    {
      id: 'ACTIVE_DIRECTORY',
      label: 'AD/Net',
      tooltip: 'Active Directory, Identity & Network Exfiltration Scenarios',
      count: ATTACK_SCENARIOS.filter(
        (s) =>
          s.category === 'ACTIVE_DIRECTORY' || s.category === 'NETWORK_WEB'
      ).length,
    },
  ];

  const sortedScenarios = useMemo(
    () => sortScenarios(displayedScenarios, sortBy),
    [displayedScenarios, sortBy]
  );

  const categorizedGroups = useMemo(
    () => categorizeScenarios(sortedScenarios, groupBy),
    [sortedScenarios, groupBy]
  );

  const renderScenarioItem = (sc: AttackScenario) => {
    const isSelectedScenario = sc.id === activeScenarioId;

    return (
      <li key={sc.id} className="min-w-0">
        <button
          type="button"
          data-testid={`scenario-item-${sc.id}`}
          title={`${sc.code} (${sc.stages.length} steps) — ${sc.name}: ${sc.shortSubtitle}`}
          onClick={() => onSelectScenario(sc.id)}
          className={`w-full min-w-0 flex flex-col gap-1 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
            isSelectedScenario
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
              : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/70'
          }`}
        >
          <div
            className={`flex flex-wrap items-center gap-1.5 text-[10.5px] font-mono tabular-nums min-w-0 w-full ${
              isSelectedScenario
                ? 'text-zinc-300 dark:text-zinc-600'
                : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            <span className="font-semibold">{sc.code}</span>
            <span aria-hidden="true" className="shrink-0">
              ·
            </span>
            <span className="shrink-0">{sc.stages.length} steps</span>
          </div>

          <div className="text-xs font-medium leading-snug break-words w-full">
            {sc.name}
          </div>
        </button>
      </li>
    );
  };

  return (
    <motion.aside
      data-testid="attack-sidebar-panel"
      initial={{ width: 0, opacity: 0, x: -20 }}
      animate={{ width: 268, opacity: 1, x: 0 }}
      exit={{ width: 0, opacity: 0, x: -20 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      dir="ltr"
      className="absolute lg:static inset-y-0 left-0 z-50 lg:z-20 w-[268px] shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200/80 dark:border-zinc-800/80 flex flex-col h-full shadow-2xl lg:shadow-none overflow-hidden"
    >
      {/* Header: Restored Operational Guide Identity + Contextual Search + Category Filter + Sort & Categorize Controls */}
      <div className="p-3 border-b border-zinc-200/70 dark:border-zinc-800/80 space-y-2.5 shrink-0">
        {/* Restored Operational Guide Header Banner integrated into Sidebar Navigation */}
        <div
          data-testid="sidebar-operational-guide-header"
          title="Operational Guide — Select an attack scenario to inspect its live topology, telemetry, and forensic stages"
          className="px-2.5 py-1.5 rounded-lg bg-indigo-50/85 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between gap-2 min-w-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <OperationalGuideIcon size="sm" />
            <div className="min-w-0">
              <div className="text-[10.5px] font-mono font-bold text-indigo-950 dark:text-indigo-200">
                Operational Guide
              </div>
              <div className="text-[9.5px] font-mono text-indigo-700/80 dark:text-indigo-300/80">
                Attack Scenarios & Playbooks
              </div>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9.5px] font-mono font-bold tabular-nums shrink-0">
            {sortedScenarios.length}
          </span>
        </div>

        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            aria-label="Search attack scenarios, MITRE ID, or Event ID"
            title="Search attack scenarios by name, MITRE technique ID (e.g., T1055), or Event ID"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search scenarios, T1055..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:bg-white dark:focus:bg-zinc-900 transition-all"
          />
        </div>

        {/* Clean Segmented Category Filter (Zero Truncation + Rich Tooltips) */}
        <div
          role="tablist"
          aria-label="Attack categories"
          className="flex items-center justify-between gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900"
        >
          {categories.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <WorkbenchIconTooltip
                key={cat.id}
                label={cat.tooltip}
                badge={`${cat.count} SCENARIOS`}
                side="bottom"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onSelectCategory(cat.id)}
                  className="relative py-1 px-2 text-[11px] font-medium rounded-md text-center transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isSelected && (
                    <motion.span
                      layoutId="sidebarCategoryActivePill"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-2xs"
                    />
                  )}
                  <span
                    className={`relative z-10 block whitespace-nowrap ${
                      isSelected
                        ? 'text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              </WorkbenchIconTooltip>
            );
          })}
        </div>

        {/* Sort & Categorize Controls */}
        <div className="grid grid-cols-1 gap-1.5 pt-0.5">
          {/* Sort Selector */}
          <div className="relative flex items-center min-w-0">
            <ArrowUpDown className="w-3 h-3 text-zinc-400 absolute left-2.5 pointer-events-none" />
            <select
              aria-label="Sort scenarios"
              title="Sort attack scenarios"
              data-testid="sidebar-sort-select"
              value={sortBy}
              onChange={(e) =>
                handleSortChange(e.target.value as ScenarioSortOption)
              }
              className="w-full h-7 pl-7 pr-2 text-[11px] font-medium bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-md text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="DEFAULT">Sort: Default Order</option>
              <option value="NAME_ASC">Sort: Name (A–Z)</option>
              <option value="STAGES_DESC">Sort: Most Steps</option>
              <option value="STAGES_ASC">Sort: Fewest Steps</option>
              <option value="MITRE_CODE">Sort: MITRE Technique ID</option>
            </select>
          </div>

          {/* Categorize / Group-By Selector */}
          <div className="relative flex items-center min-w-0">
            <FolderTree className="w-3 h-3 text-zinc-400 absolute left-2.5 pointer-events-none" />
            <select
              aria-label="Categorize scenarios"
              title="Group attack scenarios by category or MITRE tactic"
              data-testid="sidebar-group-select"
              value={groupBy}
              onChange={(e) =>
                handleGroupByChange(e.target.value as ScenarioGroupByMode)
              }
              className="w-full h-7 pl-7 pr-2 text-[11px] font-medium bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-md text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="CATEGORY">Group: Attack Category</option>
              <option value="MITRE_PHASE">Group: MITRE Tactic</option>
              <option value="FLAT">Group: Flat List</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categorized & Sorted Scenario List */}
      <div className="flex-1 overflow-auto p-3 pb-14 space-y-3">
        {sortedScenarios.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            No matching attack scenarios.
          </div>
        ) : groupBy === 'FLAT' ? (
          <ul className="space-y-1.5">
            {sortedScenarios.map((sc) => renderScenarioItem(sc))}
          </ul>
        ) : (
          categorizedGroups.map((group) => {
            const isCollapsed = !!collapsedGroups[group.groupKey];
            return (
              <div
                key={group.groupKey}
                data-testid={`sidebar-category-group-${group.groupKey}`}
                className="space-y-1 min-w-0"
              >
                <button
                  type="button"
                  data-testid={`sidebar-group-header-${group.groupKey}`}
                  aria-expanded={!isCollapsed}
                  title={`${group.label} (${group.scenarios.length} scenarios)`}
                  onClick={() => toggleGroupCollapse(group.groupKey)}
                  className="w-full min-w-0 flex items-center justify-between gap-1.5 px-1.5 py-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-1 min-w-0">
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3 h-3 shrink-0" />
                    )}
                    <span className="leading-snug">{group.label}</span>
                  </span>
                  <span className="text-[10.5px] font-mono tabular-nums text-zinc-400 dark:text-zinc-500 shrink-0">
                    {group.scenarios.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <ul className="space-y-1">
                    {group.scenarios.map((sc) => renderScenarioItem(sc))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.aside>
  );
}
