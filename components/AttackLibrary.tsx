'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { AttackCategory } from '@/lib/attack-scenarios';
import {
  AttackLibraryItem,
  queryAttackLibrary,
} from '@/lib/attack-library-service';
import {
  ChevronDown,
  ChevronRight,
  Grid,
  LayoutGrid,
  Play,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import { AttackLibraryMatrix } from './AttackLibraryMatrix';

interface AttackLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string, stageIndex?: number) => void;
}

const LIBRARY_CATEGORY_GROUPS: Array<{
  id: Exclude<AttackCategory, 'ALL'>;
  label: string;
}> = [
  { id: 'MALWARE', label: 'Malware & Execution Techniques' },
  { id: 'LOG_ANALYSIS', label: 'DFIR, SIEM & Log Forensics' },
  { id: 'ACTIVE_DIRECTORY', label: 'Active Directory, Cloud & Network' },
];

export function AttackLibrary({
  isOpen,
  onClose,
  activeScenarioId,
  onSelectScenario,
}: AttackLibraryProps) {
  const [libraryView, setLibraryView] = useState<'CARDS' | 'MATRIX'>('CARDS');
  const [searchText, setSearchText] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const data = useMemo(
    () =>
      queryAttackLibrary({
        category: 'ALL',
        mitrePhase: 'ALL',
        severity: 'ALL',
        search: searchText,
      }),
    [searchText]
  );

  const groupedItems = useMemo(() => {
    return LIBRARY_CATEGORY_GROUPS.map((group) => ({
      ...group,
      items: data.items.filter((item) => item.category === group.id),
    })).filter((group) => group.items.length > 0);
  }, [data.items]);

  if (!isOpen) return null;

  const isSearching = searchText.trim().length > 0;

  const toggleCategoryGroup = (groupId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleLaunchScenario = (scenarioId: string, stageIndex?: number) => {
    onSelectScenario(scenarioId, stageIndex);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="MITRE ATT&CK Library"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.16 }}
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Clean Single-Row Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
              MITRE ATT&CK Library
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Select an attack scenario or inspect the MITRE tactic matrix
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              role="tablist"
              aria-label="Library display mode"
              className="flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900"
            >
              <button
                type="button"
                role="tab"
                aria-selected={libraryView === 'CARDS'}
                onClick={() => setLibraryView('CARDS')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                  libraryView === 'CARDS'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Scenarios</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={libraryView === 'MATRIX'}
                onClick={() => setLibraryView('MATRIX')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                  libraryView === 'MATRIX'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Matrix</span>
              </button>
            </div>

            <button
              type="button"
              aria-label="Close Attack Library"
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Single Clean Search Row */}
        <div className="px-6 py-3 bg-zinc-50/60 dark:bg-zinc-900/40 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {data.items.length} Documented Scenarios Across{' '}
            {groupedItems.length} Categories
          </span>

          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Filter library techniques"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search T1055, Log4Shell..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>
        </div>

        {/* Spacious Content Grid */}
        <div className="flex-1 overflow-auto p-6">
          {libraryView === 'CARDS' ? (
            <div className="space-y-3">
              {groupedItems.map((group) => {
                const isCollapsed = isSearching
                  ? false
                  : !expandedCategories[group.id];
                return (
                  <section
                    key={group.id}
                    className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 overflow-hidden"
                  >
                    <button
                      type="button"
                      aria-expanded={!isCollapsed}
                      onClick={() => toggleCategoryGroup(group.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-zinc-100/70 dark:hover:bg-zinc-900/70 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                        )}
                        <span>{group.label}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                        {group.items.length}
                      </span>
                    </button>

                    {!isCollapsed && (
                      <div className="p-4 pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.items.map((item: AttackLibraryItem) => {
                          const isCurrent =
                            item.scenarioId === activeScenarioId;
                          return (
                            <article
                              key={item.scenarioId}
                              className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all min-w-0 overflow-hidden ${
                                isCurrent
                                  ? 'border-indigo-500 bg-indigo-50/15 dark:bg-indigo-950/15'
                                  : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                              }`}
                            >
                              <div className="space-y-2.5 min-w-0">
                                <div className="flex items-center justify-between gap-2 min-w-0 text-xs font-mono text-zinc-500">
                                  <span
                                    title={`${item.code} · ${item.tacticName}`}
                                    className="break-words min-w-0"
                                  >
                                    <strong className="text-zinc-900 dark:text-white">
                                      {item.code}
                                    </strong>{' '}
                                    · {item.tacticName}
                                  </span>
                                  <span
                                    title={item.severity}
                                    className="text-rose-600 dark:text-rose-400 font-semibold shrink-0"
                                  >
                                    {item.severity}
                                  </span>
                                </div>

                                <h3
                                  title={item.name}
                                  className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug break-words"
                                >
                                  {item.name}
                                </h3>

                                <p
                                  title={item.overview}
                                  className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed break-words"
                                >
                                  {item.overview}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 min-w-0">
                                <span
                                  dir="ltr"
                                  title={`${item.stageCount} steps · ${item.logSources.join(' · ')}`}
                                  className="text-[11px] font-mono text-zinc-400 break-words min-w-0 flex-1"
                                >
                                  {item.stageCount} steps ·{' '}
                                  {item.logSources.join(' · ')}
                                </span>

                                <button
                                  type="button"
                                  title={`Open Scenario: ${item.name}`}
                                  onClick={() =>
                                    handleLaunchScenario(item.scenarioId)
                                  }
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium rounded-lg shrink-0 cursor-pointer whitespace-nowrap"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Open Scenario</span>
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <AttackLibraryMatrix
              mitreCategories={data.mitreCategories}
              items={data.items}
              onLaunchScenario={handleLaunchScenario}
            />
          )}

          {data.items.length === 0 && (
            <div className="py-12 text-center">
              <ShieldAlert className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">
                No matching attack scenarios.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
