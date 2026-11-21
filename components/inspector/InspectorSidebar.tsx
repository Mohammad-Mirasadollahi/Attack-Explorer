'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { InspectorTab, InspectorVisibleTab } from './types';

interface InspectorSidebarProps {
  sidebarOpen: boolean;
  visibleTabs: InspectorVisibleTab[];
  resolvedActiveTab: InspectorTab;
  onSelectTab: (tab: InspectorTab) => void;
  onCloseInspectorPage?: () => void;
}

/**
 * Dedicated Left Navigation Panel (Controlled by Single Main Header Collapse Button).
 * No brand logo next to Back, no duplicate collapse button.
 */
export function InspectorSidebar({
  sidebarOpen,
  visibleTabs,
  resolvedActiveTab,
  onSelectTab,
  onCloseInspectorPage,
}: InspectorSidebarProps) {
  if (!sidebarOpen) return null;

  return (
    <nav
      aria-label="Inspector Navigation Sidebar"
      data-testid="inspector-left-nav-sidebar"
      className="shrink-0 w-[232px] sm:w-[244px] h-full p-3 bg-white/95 dark:bg-zinc-950/95 border-r border-zinc-200/90 dark:border-zinc-800/90 backdrop-blur-md flex flex-col justify-between transition-all duration-200 z-20"
    >
      <div className="flex flex-col gap-3 min-h-0 overflow-y-auto workbench-scrollbar">
        {/* Top Action Row: Back to Diagram (No Logo, No Duplicate Collapse Button) */}
        {onCloseInspectorPage && (
          <button
            type="button"
            data-testid="inspector-back-to-diagram-btn"
            title="Back to Diagram"
            onClick={onCloseInspectorPage}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Back to Diagram</span>
          </button>
        )}

        <div className="h-px w-full bg-zinc-200/80 dark:bg-zinc-800/80" />

        {/* Primary Full-Page View Tabs */}
        <div
          role="tablist"
          aria-label="Inspector View Tabs"
          className="flex flex-col gap-1"
        >
          <span className="px-2 pb-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            INSPECTOR VIEWS
          </span>
          {visibleTabs.map((tab) => {
            const isSelected = resolvedActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                data-testid={tab.testId}
                aria-selected={isSelected}
                aria-label={tab.label}
                title={tab.label}
                onClick={() => onSelectTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-left rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-2xs border border-indigo-200/80 dark:border-indigo-800/80'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 border border-transparent'
                }`}
              >
                {tab.icon}
                <span className="leading-snug break-words">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
