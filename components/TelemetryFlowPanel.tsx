'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TelemetryEvent,
  TelemetrySourceType } from '@/lib/attack-scenarios';
import {
  ActiveEnvironmentId,
  clampPanelDimension,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
  TaggedTelemetryEvent } from '@/lib/simulation-engine';
import { GripHorizontal, Maximize2, Minimize2 } from 'lucide-react';

export const MIN_TELEMETRY_HEIGHT = 110;
export const MAX_TELEMETRY_HEIGHT = 420;
export const DEFAULT_TELEMETRY_HEIGHT = 168;
export const EXPANDED_TELEMETRY_HEIGHT = 280;

interface TelemetryFlowPanelProps {
  events: Array<TelemetryEvent | TaggedTelemetryEvent>;
  selectedTelemetryId: string | null;
  onSelectTelemetry: (event: TelemetryEvent) => void;
  telemetryFilter: TelemetrySourceType | 'ALL';
  onTelemetryFilterChange: (filter: TelemetrySourceType | 'ALL') => void;
  activeStageIndex: number;
  activeEnvironment?: ActiveEnvironmentId;
  height?: number;
  onResizeHeight?: (newHeight: number) => void;
}

const SOURCE_TYPE_BADGES: Record<
  TelemetrySourceType,
  { label: string; badgeClass: string; numberBg: string }
> = {
  SYSMON: {
    label: 'Sysmon',
    badgeClass: 'text-indigo-600 dark:text-indigo-400',
    numberBg: 'bg-indigo-600 text-white' },
  WIN32_API: {
    label: 'Win32 API',
    badgeClass: 'text-violet-600 dark:text-violet-400',
    numberBg: 'bg-violet-600 text-white' },
  WIN_EVENT: {
    label: 'WinEvent',
    badgeClass: 'text-amber-600 dark:text-amber-400',
    numberBg: 'bg-amber-600 text-white' },
  NETWORK: {
    label: 'Network',
    badgeClass: 'text-emerald-600 dark:text-emerald-400',
    numberBg: 'bg-emerald-600 text-white' },
  IDS_ALERT: {
    label: 'IDS Alert',
    badgeClass: 'text-rose-600 dark:text-rose-400',
    numberBg: 'bg-rose-600 text-white' },
  LINUX_AUDIT: {
    label: 'Auditd',
    badgeClass: 'text-sky-600 dark:text-sky-400',
    numberBg: 'bg-sky-600 text-white' },
  MEMORY_SCAN: {
    label: 'Memory Scan',
    badgeClass: 'text-rose-600 dark:text-rose-400',
    numberBg: 'bg-rose-600 text-white' } };

export function TelemetryFlowPanel({
  events,
  selectedTelemetryId,
  onSelectTelemetry,
  telemetryFilter,
  onTelemetryFilterChange,
  activeStageIndex,
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  height = DEFAULT_TELEMETRY_HEIGHT,
  onResizeHeight }: TelemetryFlowPanelProps) {
  const [internalHeight, setInternalHeight] = useState(height);
  const [isDragging, setIsDragging] = useState(false);
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  const effectiveHeight = onResizeHeight ? height : internalHeight;
  const setHeightValue = (next: number) => {
    const clamped = clampPanelDimension(
      next,
      MIN_TELEMETRY_HEIGHT,
      MAX_TELEMETRY_HEIGHT
    );
    if (onResizeHeight) {
      onResizeHeight(clamped);
    } else {
      setInternalHeight(clamped);
    }
  };

  const isTall = effectiveHeight >= 230;

  const handlePointerDownResize = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = effectiveHeight;
    setIsDragging(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = startY - moveEvent.clientY;
      setHeightValue(startHeight + deltaY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleKeyDownResize = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHeightValue(effectiveHeight + 24);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHeightValue(effectiveHeight - 24);
    } else if (e.key === 'Home' || e.key === 'Enter') {
      e.preventDefault();
      setHeightValue(DEFAULT_TELEMETRY_HEIGHT);
    }
  };

  const filterOptions: Array<{
    value: TelemetrySourceType | 'ALL';
    label: string;
  }> = [
    { value: 'ALL', label: 'All' },
    { value: 'SYSMON', label: 'Sysmon' },
    { value: 'WIN_EVENT', label: 'WinEvent' },
    { value: 'WIN32_API', label: 'Win32' },
    { value: 'NETWORK', label: 'Network' },
    { value: 'IDS_ALERT', label: 'IDS' },
  ];

  return (
    <motion.section
      data-testid="telemetry-flow-panel"
      data-panel-height={effectiveHeight}
      aria-label="Telemetry and Log Flow"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: effectiveHeight, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={
        isDragging
          ? { duration: 0 }
          : { duration: 0.14, ease: 'easeOut' }
      }
      style={{ height: effectiveHeight }}
      className="relative shrink-0 bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col overflow-hidden z-20"
    >
      {/* Top Horizontal Drag Resize Handle */}
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize bottom telemetry panel"
        aria-valuemin={MIN_TELEMETRY_HEIGHT}
        aria-valuemax={MAX_TELEMETRY_HEIGHT}
        aria-valuenow={effectiveHeight}
        tabIndex={0}
        data-testid="telemetry-resize-handle"
        title="Drag to resize telemetry panel height (double-click to reset)"
        onPointerDown={handlePointerDownResize}
        onKeyDown={handleKeyDownResize}
        onDoubleClick={() => setHeightValue(DEFAULT_TELEMETRY_HEIGHT)}
        className={`group/handle absolute inset-x-0 top-0 h-2.5 -mt-1 z-30 cursor-row-resize flex items-center justify-center select-none touch-none focus:outline-none ${
          isDragging ? 'bg-indigo-500/20' : 'hover:bg-indigo-500/10'
        }`}
      >
        <div
          className={`h-[2px] w-full transition-colors ${
            isDragging
              ? 'bg-indigo-500'
              : 'bg-transparent group-hover/handle:bg-indigo-500/70 group-focus-visible/handle:bg-indigo-500'
          }`}
        />
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-7 h-3 rounded-full bg-zinc-200/90 dark:bg-zinc-800/90 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center opacity-70 group-hover/handle:opacity-100 group-hover/handle:border-indigo-500 transition-opacity shadow-2xs">
          <GripHorizontal className="w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400 group-hover/handle:text-indigo-500" />
        </div>
      </div>

      {/* Compact 32px Source Filter Bar */}
      <div className="h-8 shrink-0 flex items-center justify-between gap-2 px-2.5 bg-zinc-50/90 dark:bg-zinc-900/70 border-b border-zinc-200/60 dark:border-zinc-800/80">
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-tight text-zinc-800 dark:text-zinc-200 whitespace-nowrap shrink-0">
            <span>Telemetry Stream</span>
            <span className="px-1.5 py-0 text-[9.5px] font-mono bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
              {events.length}
            </span>
            <span
              data-testid="telemetry-stream-env-badge"
              data-environment-id={activeEnvironment}
              className="px-1.5 py-0 text-[9.5px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/75 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded"
            >
              {envProfile.badgeLabel} · {envProfile.environmentTag}
            </span>
          </div>

          <div
            role="group"
            aria-label="Filter telemetry source"
            className="flex items-center gap-0.5 p-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shrink-0"
          >
            {filterOptions.map((opt) => {
              const isSelected = telemetryFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onTelemetryFilterChange(opt.value)}
                  className="relative px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isSelected && (
                    <motion.span
                      layoutId="telemetryFilterActivePill"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30 }}
                      className="absolute inset-0 rounded bg-white dark:bg-zinc-800 shadow-2xs"
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isSelected
                        ? 'text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          data-testid="telemetry-toggle-tall-btn"
          onClick={() =>
            setHeightValue(
              isTall ? DEFAULT_TELEMETRY_HEIGHT : EXPANDED_TELEMETRY_HEIGHT
            )
          }
          title={isTall ? 'Standard height' : 'Expand table height'}
          className="h-6 w-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded cursor-pointer shrink-0"
        >
          {isTall ? (
            <Minimize2 className="w-3 h-3" />
          ) : (
            <Maximize2 className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* IDE-Dense Telemetry Stream Table */}
      <div className="flex-1 overflow-auto" dir="ltr">
        <table className="w-full min-w-[740px] text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200/70 dark:border-zinc-800/80 text-[9.5px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400">
            <tr>
              <th className="py-1 px-2.5 w-20">TRACE #</th>
              <th className="py-1 px-2.5 w-20">TIME</th>
              <th className="py-1 px-2.5 w-36">INITIATOR (FROM)</th>
              <th className="py-1 px-1.5 w-16 text-center">DIR</th>
              <th className="py-1 px-2.5 w-36">TARGET (TO)</th>
              <th className="py-1 px-2.5 w-28">CHANNEL</th>
              <th className="py-1 px-2.5">REQ (#N.1→) & RESP (⇠#N.2)</th>
              <th className="py-1 px-2.5 w-20 text-right">MITRE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-[11px] font-mono">
            {events.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-5 text-center text-[11px] font-mono text-zinc-400"
                >
                  No matching telemetry events.
                </td>
              </tr>
            ) : (
              events.map((ev) => {
                const isSelected = selectedTelemetryId === ev.id;
                const isCurrentStageRow =
                  activeStageIndex > 0 && ev.stageIndex === activeStageIndex;
                const meta = SOURCE_TYPE_BADGES[ev.sourceType];

                return (
                  <tr
                    key={ev.id}
                    onClick={() => onSelectTelemetry(ev)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/50'
                        : isCurrentStageRow
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                        : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40'
                    }`}
                  >
                    <td className="py-1 px-2.5 tabular-nums whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <span
                          className={`inline-flex items-center justify-center px-1.5 h-4 text-[9px] font-bold rounded ${meta.numberBg}`}
                        >
                          #{ev.no}·S{ev.stageIndex}
                        </span>
                        <span
                          data-testid={`telemetry-row-env-tag-${ev.no}`}
                          className="inline-flex items-center px-1 h-4 text-[8.5px] font-mono font-bold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700"
                        >
                          {'activeEnvironmentTag' in ev
                            ? ev.activeEnvironmentTag
                            : envProfile.environmentTag}
                        </span>
                      </div>
                    </td>
                    <td className="py-1 px-2.5 tabular-nums text-zinc-500 whitespace-nowrap">
                      {ev.timestamp}
                    </td>
                    <td className="py-1 px-2.5 font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[140px]">
                      {ev.sourceLabel}
                    </td>
                    <td className="py-1 px-1.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-0.5 px-1 py-0 text-[9px] font-bold rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
                        {ev.no}.1⇄{ev.no}.2
                      </span>
                    </td>
                    <td className="py-1 px-2.5 font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[140px]">
                      {ev.targetLabel}
                    </td>
                    <td
                      className={`py-1 px-2.5 font-semibold whitespace-nowrap ${meta.badgeClass}`}
                    >
                      {ev.protocolOrEventId}
                    </td>
                    <td className="py-1 px-2.5 text-zinc-600 dark:text-zinc-300 truncate max-w-md">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        #{ev.no}.1→ {ev.shortAction}
                      </span>{' '}
                      <span className="text-zinc-400">·</span>{' '}
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        ⇠#{ev.no}.2 [{ev.sizeOrCode}]
                      </span>{' '}
                      <span className="opacity-80">— {ev.info}</span>
                    </td>
                    <td className="py-1 px-2.5 text-right tabular-nums whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          ev.severity === 'CRITICAL'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {ev.mitreId}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
