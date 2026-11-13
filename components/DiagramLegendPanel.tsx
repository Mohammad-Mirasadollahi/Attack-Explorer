'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronUp, Compass } from 'lucide-react';

interface DiagramLegendPanelProps {
  tacticalMode?: boolean;
  defaultExpanded?: boolean;
}

export function DiagramLegendPanel({
  tacticalMode = false,
  defaultExpanded = true,
}: DiagramLegendPanelProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div
      data-testid="diagram-legend-panel"
      onClick={(e) => e.stopPropagation()}
      className={`hidden sm:flex flex-col rounded-xl border backdrop-blur-md shadow-md transition-colors z-30 ${
        tacticalMode
          ? 'bg-slate-950/92 border-emerald-500/50 text-emerald-100'
          : 'bg-white/95 dark:bg-zinc-900/95 border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
      }`}
    >
      <button
        type="button"
        data-testid="diagram-legend-toggle-btn"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="px-2.5 py-1.5 flex items-center justify-between gap-3 text-[10.5px] font-mono font-bold cursor-pointer hover:opacity-85 whitespace-nowrap"
      >
        <span className="inline-flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>Diagram Visual Legend</span>
        </span>
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 opacity-70" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="overflow-hidden border-t border-zinc-200/70 dark:border-zinc-800 px-2.5 py-2 space-y-2 text-[9.5px] font-mono"
          >
            {/* Attack Phase & Node Role Color Semantics */}
            <div className="space-y-1">
              <div className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                Node & Phase Color Semantics
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 shrink-0" />
                  <span className="truncate">Origin / Foothold</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-teal-600 shrink-0" />
                  <span className="truncate">Firewall / Relay</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-600 shrink-0" />
                  <span className="truncate">Victim Host / OS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 shrink-0" />
                  <span className="truncate">Exploit / Payload</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-violet-600 shrink-0" />
                  <span className="truncate">Core Server / SIEM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-rose-500 shrink-0" />
                  <span className="truncate">Active Stage Focus</span>
                </div>
              </div>
            </div>

            {/* Traffic Direction & Connection Line Styles */}
            <div className="pt-1 border-t border-zinc-200/60 dark:border-zinc-800/80 space-y-1">
              <div className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                Bidirectional Traffic & Causality
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                    <span>━━▶</span>
                    <span>[1] #1.1→</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Outbound Attack Vector
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>◀╌╌</span>
                    <span>⇠#1.2 ACK</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Return Response / ACK
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <span>┈┈┈</span>
                    <span>L1 · Trunk</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    VLAN / Bus Backbone
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
