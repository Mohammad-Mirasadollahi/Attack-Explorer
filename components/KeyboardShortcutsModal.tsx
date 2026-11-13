'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Command,
  Hand,
  Keyboard,
  MousePointer,
  Navigation,
  Play,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import {
  filterKeyboardShortcuts,
  KeyboardShortcutItem,
  SHORTCUT_CATEGORIES,
  ShortcutCategoryId,
  ShortcutCommandId,
} from '@/lib/keyboard-shortcuts';
import { CanvasInteractionMode } from './AttackVisualizer';

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeToolMode?: CanvasInteractionMode;
  effectiveScale?: number;
  autoCameraEnabled?: boolean;
  tacticalMode?: boolean;
  showLegend?: boolean;
  isPlaying?: boolean;
  onExecuteCommand?: (commandId: ShortcutCommandId) => void;
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  activeToolMode = 'PAN',
  effectiveScale = 1,
  autoCameraEnabled = true,
  tacticalMode = false,
  showLegend = true,
  isPlaying = false,
  onExecuteCommand,
}: KeyboardShortcutsModalProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ShortcutCategoryId>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = useMemo(
    () => filterKeyboardShortcuts(searchQuery, selectedCategory),
    [searchQuery, selectedCategory]
  );

  const groupedSections = useMemo(() => {
    const categoriesToRender =
      selectedCategory === 'ALL'
        ? SHORTCUT_CATEGORIES.filter((c) => c.id !== 'ALL')
        : SHORTCUT_CATEGORIES.filter((c) => c.id === selectedCategory);

    return categoriesToRender
      .map((cat) => ({
        category: cat,
        items: filteredItems.filter((item) => item.category === cat.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredItems, selectedCategory]);

  const getCategoryIcon = (catId: ShortcutCategoryId) => {
    if (catId === 'TOOLS_SELECTION') {
      return <MousePointer className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
    }
    if (catId === 'CANVAS_NAVIGATION') {
      return <Navigation className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
    }
    if (catId === 'SIMULATION_VIEWS') {
      return <Play className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    }
    return <Command className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
  };

  const isShortcutCurrentlyActive = (item: KeyboardShortcutItem): boolean => {
    if (item.id === 'TOOL_BOX_SELECT') return activeToolMode === 'SELECT';
    if (item.id === 'TOOL_PAN_PAGE') return activeToolMode === 'PAN';
    if (item.id === 'TOGGLE_AUTOCAM') return autoCameraEnabled;
    if (item.id === 'TOGGLE_TACTICAL') return tacticalMode;
    if (item.id === 'TOGGLE_LEGEND') return showLegend;
    if (item.id === 'PLAY_PAUSE_SEQUENCE') return isPlaying;
    return false;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
          dir="ltr"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/65 backdrop-blur-xs"
          />

          {/* Modal Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts & Canvas Hotkeys"
            data-testid="keyboard-shortcuts-modal"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-2xl overflow-hidden"
          >
            {/* Header Bar */}
            <div className="px-5 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/70 dark:bg-zinc-950/60 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight leading-snug">
                      Keyboard Shortcuts & Canvas Navigation
                    </h2>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-300 shrink-0">
                      HOTKEYS
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                    Press any hotkey on the workspace or click a command card below to trigger it immediately
                  </p>
                </div>
              </div>

              {/* Live Canvas Mode & Zoom Status + Close Button */}
              <div className="flex items-center gap-2 shrink-0">
                <div
                  data-testid="shortcuts-modal-active-tool-pill"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-[10.5px] font-mono font-semibold text-zinc-700 dark:text-zinc-200"
                >
                  {activeToolMode === 'SELECT' ? (
                    <>
                      <MousePointer className="w-3 h-3 text-indigo-500" />
                      <span>Active Tool: Box Select (B)</span>
                    </>
                  ) : (
                    <>
                      <Hand className="w-3 h-3 text-indigo-500" />
                      <span>Active Tool: Pan / Pen (P)</span>
                    </>
                  )}
                  <span className="text-zinc-400">·</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold tabular-nums">
                    {Math.round(effectiveScale * 100)}%
                  </span>
                </div>

                <button
                  type="button"
                  data-testid="close-shortcuts-modal-btn"
                  aria-label="Close Keyboard Shortcuts Overlay"
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="px-5 py-2.5 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5 bg-white dark:bg-zinc-900 shrink-0">
              <div
                role="tablist"
                aria-label="Shortcut Categories"
                className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/70"
              >
                {SHORTCUT_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      data-testid={`shortcut-category-tab-${cat.id}`}
                      aria-selected={isSelected}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs border border-zinc-200/70 dark:border-zinc-700'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {getCategoryIcon(cat.id)}
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  data-testid="shortcuts-search-input"
                  aria-label="Search keyboard shortcuts"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by key (B, P, +, Space) or action..."
                  className="w-full h-8 pl-8 pr-7 rounded-lg bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear shortcut search"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Tool Switcher Banner (B = Box Select, P = Pan / Pen Page) */}
            <div className="px-5 py-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-200/60 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 text-xs text-indigo-950 dark:text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-semibold">Quick Tool Switching:</span>
                <span className="text-zinc-600 dark:text-zinc-300">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono text-[10px] font-bold">B</kbd> for Box Select or <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono text-[10px] font-bold">P</kbd> for Pan / Pen Page, or hold Left/Right mouse buttons directly on canvas.
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  data-testid="modal-quick-switch-box-select"
                  onClick={() => onExecuteCommand?.('TOOL_BOX_SELECT')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeToolMode === 'SELECT'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:border-indigo-400'
                  }`}
                >
                  <MousePointer className="w-3 h-3" />
                  <span>Box Select</span>
                  <kbd className="px-1 py-0.2 rounded bg-black/15 text-[9.5px]">B</kbd>
                </button>

                <button
                  type="button"
                  data-testid="modal-quick-switch-pan-page"
                  onClick={() => onExecuteCommand?.('TOOL_PAN_PAGE')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeToolMode === 'PAN'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:border-indigo-400'
                  }`}
                >
                  <Hand className="w-3 h-3" />
                  <span>Pan / Pen Page</span>
                  <kbd className="px-1 py-0.2 rounded bg-black/15 text-[9.5px]">P</kbd>
                </button>
              </div>
            </div>

            {/* Scrollable Shortcut Sections */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {groupedSections.length === 0 ? (
                <div
                  data-testid="shortcuts-empty-state"
                  className="py-12 text-center space-y-2"
                >
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    No keyboard shortcuts match &ldquo;{searchQuery}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ALL');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                groupedSections.map(({ category, items }) => (
                  <section
                    key={category.id}
                    data-testid={`shortcut-section-${category.id}`}
                    className="space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-200/70 dark:border-zinc-800 pb-1.5">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category.id)}
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                          {category.label}
                        </h3>
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                          — {category.description}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {items.length} {items.length === 1 ? 'shortcut' : 'shortcuts'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {items.map((item) => {
                        const isActive = isShortcutCurrentlyActive(item);
                        const isInteractive =
                          item.canTriggerFromOverlay && Boolean(onExecuteCommand);

                        return (
                          <div
                            key={item.id}
                            data-testid={`shortcut-card-${item.id}`}
                            onClick={() => {
                              if (isInteractive) {
                                onExecuteCommand?.(item.id);
                              }
                            }}
                            role={isInteractive ? 'button' : undefined}
                            tabIndex={isInteractive ? 0 : undefined}
                            onKeyDown={(e) => {
                              if (
                                isInteractive &&
                                (e.key === 'Enter' || e.key === ' ')
                              ) {
                                e.preventDefault();
                                onExecuteCommand?.(item.id);
                              }
                            }}
                            className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                              isActive
                                ? 'bg-indigo-50/75 dark:bg-indigo-950/45 border-indigo-400 dark:border-indigo-700 shadow-2xs'
                                : 'bg-zinc-50/70 dark:bg-zinc-800/45 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                            } ${
                              isInteractive
                                ? 'cursor-pointer hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80'
                                : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                    {item.title}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                                      isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300'
                                    }`}
                                  >
                                    {isActive ? 'ACTIVE' : item.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                                  {item.description}
                                </p>
                              </div>

                              {/* Keycaps */}
                              <div className="flex items-center gap-1 shrink-0">
                                {item.keys.map((k, idx) => (
                                  <React.Fragment key={`${item.id}-k-${idx}`}>
                                    {idx > 0 && (
                                      <span className="text-[10px] font-mono text-zinc-400">
                                        +
                                      </span>
                                    )}
                                    <kbd className="min-w-[24px] h-6 px-1.5 inline-flex items-center justify-center rounded-md bg-white dark:bg-zinc-900 border border-b-2 border-zinc-300 dark:border-zinc-700 text-[10.5px] font-mono font-bold text-zinc-800 dark:text-zinc-100 shadow-2xs whitespace-nowrap">
                                      {k}
                                    </kbd>
                                  </React.Fragment>
                                ))}

                                {item.secondaryKeys &&
                                  item.secondaryKeys.length > 0 && (
                                    <span className="inline-flex items-center gap-1 ml-1 text-[10px] font-mono text-zinc-400">
                                      <span>/</span>
                                      {item.secondaryKeys.map((sk, sIdx) => (
                                        <kbd
                                          key={`${item.id}-sk-${sIdx}`}
                                          className="min-w-[22px] h-6 px-1.5 inline-flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap"
                                        >
                                          {sk}
                                        </kbd>
                                      ))}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-5 py-2.5 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[10.5px]">
                <span>
                  <strong className="text-zinc-700 dark:text-zinc-200">Left-Click Hold:</strong> Pan Page
                </span>
                <span>·</span>
                <span>
                  <strong className="text-zinc-700 dark:text-zinc-200">Right-Click Hold:</strong> Box Select
                </span>
                <span>·</span>
                <span>
                  <strong className="text-zinc-700 dark:text-zinc-200">Scroll Wheel:</strong> Smooth 5% Zoom
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-bold">?</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-bold">Esc</kbd> to close
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
