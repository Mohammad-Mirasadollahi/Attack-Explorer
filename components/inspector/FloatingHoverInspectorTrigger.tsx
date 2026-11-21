'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, BookOpen } from 'lucide-react';
import { SketchNodeIcon } from '../SketchNodeIcons';
import type { FloatingHoverInspectorTriggerProps } from './types';

/**
 * Floating Hover Inspector Option rendered on the active diagram/workbench page.
 * - Shows a compact floating pill in its resting state.
 * - Expands smoothly on hover (`onMouseEnter`) up to a bounded viewport height
 *   with an internal vertical scrollbar for long descriptions so the bottom
 *   action button ("Open Main Scenario Page" / "Open Dedicated Section Page")
 *   is always visible.
 * - Never renders a redundant "Main Page" button on the hover card (users return
 *   to the main topology via the diagram's Back button).
 */
export function FloatingHoverInspectorTrigger({
  scenario,
  currentStage,
  scopeContext,
  selectedTelemetry,
  onOpenInspectorPage,
}: FloatingHoverInspectorTriggerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const activeStageIndex = currentStage ? currentStage.index : 0;
  const activeTargetNode =
    scopeContext.diagramScope === 'INTERNAL_SUBNODE' &&
    (scopeContext.selectedSubNode || scopeContext.focusedInternalSubNode)
      ? scopeContext.selectedSubNode || scopeContext.focusedInternalSubNode
      : scopeContext.diagramScope === 'EXPANDED_NODE' &&
        scopeContext.expandedParentNode
      ? scopeContext.expandedParentNode
      : null;

  const targetTypeBadge = selectedTelemetry
    ? `PACKET · ${selectedTelemetry.protocolOrEventId}`
    : scopeContext.diagramScope === 'INTERNAL_SUBNODE' &&
      (scopeContext.selectedSubNode || scopeContext.focusedInternalSubNode)
    ? `SUB-NODE · #${
        (scopeContext.selectedSubNode || scopeContext.focusedInternalSubNode)!
          .chainOrder
      }`
    : scopeContext.diagramScope === 'EXPANDED_NODE' &&
      scopeContext.expandedParentNode
    ? `PIPELINE · #${scopeContext.expandedParentNode.chainOrder}`
    : activeStageIndex > 0
    ? `STAGE S${activeStageIndex} · ${scenario.code}`
    : `SCENARIO · ${scenario.code}`;

  const targetHeadline = selectedTelemetry
    ? `${selectedTelemetry.sourceLabel || selectedTelemetry.sourceNodeId} → ${selectedTelemetry.targetLabel || selectedTelemetry.targetNodeId}`
    : activeTargetNode
    ? activeTargetNode.label
    : currentStage
    ? `Stage ${currentStage.index}: ${currentStage.title}`
    : scenario.name;

  const targetSummary = selectedTelemetry
    ? selectedTelemetry.info
    : activeTargetNode
    ? activeTargetNode.activitySummary ||
      activeTargetNode.internalSummary ||
      scopeContext.scopedStoryAnalogy
    : currentStage
    ? currentStage.description
    : scenario.overview;

  const activeZoneLabel =
    scopeContext.selectedSubNodeZone?.title ||
    scopeContext.focusedInternalSubNodeZone?.title ||
    scopeContext.expandedParentNodeZone?.title ||
    activeTargetNode?.zoneLabel ||
    'Full Attack Topology';

  return (
    <div
      data-testid="floating-hover-inspector-trigger"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      className="fixed top-14 right-3.5 z-50 flex flex-col items-end pointer-events-auto"
    >
      {/* Compact Hover Trigger Pill */}
      <motion.button
        type="button"
        data-testid="open-full-inspector-page-btn"
        onClick={onOpenInspectorPage}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-lg backdrop-blur-md transition-all cursor-pointer ${
          activeTargetNode || selectedTelemetry
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/80 shadow-indigo-500/25'
            : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 border-zinc-700/80 dark:border-zinc-300'
        }`}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              activeTargetNode || selectedTelemetry
                ? 'bg-amber-300'
                : 'bg-indigo-400 dark:bg-indigo-600'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              activeTargetNode || selectedTelemetry
                ? 'bg-amber-300'
                : 'bg-indigo-400 dark:bg-indigo-600'
            }`}
          />
        </span>

        <BookOpen className="w-3.5 h-3.5 shrink-0" />

        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/20 dark:bg-black/15">
          {targetTypeBadge}
        </span>

        <span className="text-[11px] font-bold leading-snug break-words">
          {targetHeadline}
        </span>

        <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
      </motion.button>

      {/* Expandable Hover Preview Card (Bounded Height + Scrollable Summary + Pinned Footer CTA) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            data-testid="floating-hover-inspector-preview-card"
            className="mt-2 w-80 sm:w-96 max-h-[min(60vh,380px)] rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-3.5 text-left flex flex-col gap-2.5 overflow-hidden z-50"
          >
            <div className="shrink-0 flex items-start justify-between gap-2.5 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {activeTargetNode && (
                  <div className="w-11 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center shrink-0 p-1">
                    <SketchNodeIcon
                      iconType={activeTargetNode.iconType}
                      isActive={activeTargetNode.isActive}
                      isCompromised={activeTargetNode.isCompromised}
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {activeTargetNode || selectedTelemetry
                      ? `EXPANDED SECTION · ${activeZoneLabel}`
                      : `SCENARIO INSPECTOR · ${scenario.stages.length} STAGES`}
                  </div>
                  <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-snug break-words">
                    {targetHeadline}
                  </div>
                  {activeTargetNode && (
                    <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      {activeTargetNode.sublabel} · {activeTargetNode.actionBadge}
                    </div>
                  )}
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[9px] font-bold shrink-0">
                FULL PAGE
              </span>
            </div>

            <div
              data-testid="hover-card-scrollable-summary"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 min-h-0 max-h-[min(34vh,210px)] overflow-y-auto overscroll-contain pr-1.5 space-y-2"
            >
              {!activeTargetNode && !selectedTelemetry && scenario.stages.length > 0 && (
                <div
                  data-testid="hover-card-main-stages-list"
                  className="pb-2 border-b border-zinc-100 dark:border-zinc-800 space-y-1"
                >
                  <div className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Attack Stages ({scenario.stages.length})
                  </div>
                  {scenario.stages.map((st) => (
                    <div
                      key={st.index}
                      className={`flex items-start gap-1.5 text-[10.5px] leading-snug rounded px-1.5 py-0.5 ${
                        activeStageIndex === st.index
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span className="font-mono font-bold text-[9.5px] text-indigo-600 dark:text-indigo-400 shrink-0">
                        S{st.index}
                      </span>
                      <span className="break-words flex-1">{st.title}</span>
                      <span className="font-mono text-[9px] text-zinc-400 shrink-0">
                        {st.mitreTechniqueId}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
                {targetSummary}
              </p>
            </div>

            <div className="shrink-0 flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                data-testid="hover-card-open-dedicated-page-btn"
                onClick={onOpenInspectorPage}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {activeTargetNode || selectedTelemetry
                    ? 'Open Dedicated Section Page'
                    : 'Open Main Scenario Page'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
