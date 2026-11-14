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
  ATTACK_VECTOR_DRAG_MIME_TYPE,
  AttackVectorCategory,
  AttackVectorTemplate,
  filterAttackVectorLibrary,
  PREDEFINED_ATTACK_VECTOR_LIBRARY,
} from '@/lib/canvas-interaction-engine';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  FolderTree,
  GripVertical,
  Layers,
  Plus,
  Search,
  Sparkles,
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
  onInjectAttackVector?: (
    vectorId: string,
    dropCoords?: { wx: number; wy: number }
  ) => void;
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
  onInjectAttackVector,
}: AttackSidebarProps) {
  const [sidebarMode, setSidebarMode] = useState<'SCENARIOS' | 'VECTORS'>(
    'SCENARIOS'
  );
  const [vectorSearchQuery, setVectorSearchQuery] = useState<string>('');
  const [vectorCategory, setVectorCategory] =
    useState<AttackVectorCategory>('ALL');

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

  const filteredVectors = useMemo(
    () => filterAttackVectorLibrary(vectorSearchQuery, vectorCategory),
    [vectorSearchQuery, vectorCategory]
  );

  const vectorCategories: Array<{
    id: AttackVectorCategory;
    label: string;
    tooltip: string;
  }> = [
    { id: 'ALL', label: 'All', tooltip: 'All Pre-Defined Attack Vectors' },
    {
      id: 'INITIAL_ACCESS',
      label: 'Initial',
      tooltip: 'Initial Access & Perimeter Delivery Vectors',
    },
    {
      id: 'EXECUTION_EVASION',
      label: 'Evasion',
      tooltip: 'Process Execution, Memory Injection & Kernel Evasion Vectors',
    },
    {
      id: 'CREDENTIAL_LATERAL',
      label: 'Lateral',
      tooltip: 'Credential Access & Lateral Movement Vectors',
    },
    {
      id: 'C2_IMPACT',
      label: 'C2/Impact',
      tooltip: 'Command & Control and Ransomware Impact Vectors',
    },
  ];

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

  const handleVectorDragStart = (
    vec: AttackVectorTemplate,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(ATTACK_VECTOR_DRAG_MIME_TYPE, vec.id);
    e.dataTransfer.setData('text/plain', vec.id);
  };

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
      animate={{ width: 280, opacity: 1, x: 0 }}
      exit={{ width: 0, opacity: 0, x: -20 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      dir="ltr"
      className="absolute lg:static inset-y-0 left-0 z-50 lg:z-20 w-[280px] shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200/80 dark:border-zinc-800/80 flex flex-col h-full shadow-2xl lg:shadow-none overflow-hidden"
    >
      {/* Header: Operational Guide Identity + Scenarios vs Drag-and-Drop Attack Vectors Switcher */}
      <div className="p-3 border-b border-zinc-200/70 dark:border-zinc-800/80 space-y-2.5 shrink-0">
        <div
          data-testid="sidebar-operational-guide-header"
          title="Operational Guide — Select an attack scenario or drag-and-drop attack vectors onto the simulation canvas"
          className="px-2.5 py-1.5 rounded-lg bg-indigo-50/85 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between gap-2 min-w-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <OperationalGuideIcon size="sm" />
            <div className="min-w-0">
              <div className="text-[10.5px] font-mono font-bold text-indigo-950 dark:text-indigo-200">
                Operational Guide
              </div>
              <div className="text-[9.5px] font-mono text-indigo-700/80 dark:text-indigo-300/80">
                Scenarios & Vector Palette
              </div>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9.5px] font-mono font-bold tabular-nums shrink-0">
            {sidebarMode === 'SCENARIOS'
              ? sortedScenarios.length
              : filteredVectors.length}
          </span>
        </div>

        {/* Mode Switcher: Scenarios vs Attack Vectors (Drag & Drop) */}
        <div
          role="tablist"
          aria-label="Sidebar Library Mode"
          className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800"
        >
          <button
            type="button"
            role="tab"
            data-testid="sidebar-mode-scenarios-tab"
            aria-selected={sidebarMode === 'SCENARIOS'}
            onClick={() => setSidebarMode('SCENARIOS')}
            className={`py-1 px-2 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sidebarMode === 'SCENARIOS'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3 h-3 text-indigo-500 shrink-0" />
            <span>Scenarios ({ATTACK_SCENARIOS.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            data-testid="sidebar-mode-vectors-tab"
            aria-selected={sidebarMode === 'VECTORS'}
            onClick={() => setSidebarMode('VECTORS')}
            className={`py-1 px-2 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sidebarMode === 'VECTORS'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Vectors ({PREDEFINED_ATTACK_VECTOR_LIBRARY.length})</span>
          </button>
        </div>

        {sidebarMode === 'SCENARIOS' ? (
          <>
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                data-testid="sidebar-scenario-search-input"
                aria-label="Search attack scenarios, MITRE ID, or Event ID"
                title="Search attack scenarios by name, MITRE technique ID (e.g., T1055), or Event ID"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search scenarios, T1055..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:bg-white dark:focus:bg-zinc-900 transition-all"
              />
            </div>

            {/* Clean Segmented Category Filter */}
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
          </>
        ) : (
          <>
            {/* Attack Vector Search & Drag-and-Drop Filter Header */}
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                data-testid="sidebar-vector-search-input"
                aria-label="Search attack vectors to drag and drop onto canvas"
                value={vectorSearchQuery}
                onChange={(e) => setVectorSearchQuery(e.target.value)}
                placeholder="Search attack vectors, T1055, SMB..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
              />
            </div>

            <div
              role="tablist"
              aria-label="Attack vector tactic filter"
              className="flex flex-wrap items-center justify-between gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900"
            >
              {vectorCategories.map((vc) => {
                const isSelected = vectorCategory === vc.id;
                return (
                  <button
                    key={vc.id}
                    type="button"
                    role="tab"
                    data-testid={`vector-category-tab-${vc.id}`}
                    aria-selected={isSelected}
                    onClick={() => setVectorCategory(vc.id)}
                    className={`py-1 px-1.5 text-[10px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-300 font-semibold shadow-2xs'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {vc.label}
                  </button>
                );
              })}
            </div>

            <div className="px-2 py-1 rounded-md bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/70 text-[10px] font-mono text-amber-800 dark:text-amber-200 leading-snug">
              Drag any attack vector onto the canvas or click{' '}
              <span className="font-bold">+ Canvas</span> to inject it into the
              graph.
            </div>
          </>
        )}
      </div>

      {/* Body: Categorized Scenario List OR Draggable Attack Vector Library */}
      <div className="flex-1 overflow-y-auto p-3 pb-14 space-y-3">
        {sidebarMode === 'SCENARIOS' ? (
          sortedScenarios.length === 0 ? (
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
          )
        ) : filteredVectors.length === 0 ? (
          <div
            data-testid="sidebar-vectors-empty"
            className="py-8 text-center text-xs text-zinc-400"
          >
            No matching attack vectors.
          </div>
        ) : (
          <div
            data-testid="sidebar-attack-vectors-list"
            className="space-y-2"
          >
            {filteredVectors.map((vec) => (
              <div
                key={vec.id}
                draggable={true}
                onDragStart={(e) => handleVectorDragStart(vec, e)}
                data-testid={`draggable-attack-vector-${vec.id}`}
                data-vector-id={vec.id}
                className="group relative rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 p-2.5 transition-all cursor-grab active:cursor-grabbing space-y-1.5"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <GripVertical className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 shrink-0" />
                    <span className="px-1.5 py-0.5 rounded bg-indigo-600/15 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-[9.5px] font-bold shrink-0">
                      {vec.mitreId}
                    </span>
                    <span className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
                      {vec.tacticLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    data-testid={`inject-attack-vector-btn-${vec.id}`}
                    aria-label={`Inject ${vec.name} into canvas`}
                    onClick={() => onInjectAttackVector?.(vec.id)}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9.5px] font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Canvas</span>
                  </button>
                </div>

                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                  {vec.name}
                </div>

                <div className="text-[10.5px] text-zinc-600 dark:text-zinc-400 leading-snug break-words">
                  {vec.activitySummary}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5 text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400">
                  <span>{vec.actionBadge}</span>
                  <span>{vec.protocolBadge}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  );
}

