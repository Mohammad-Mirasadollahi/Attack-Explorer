'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export interface WorkbenchIconTooltipProps {
  /** Primary tooltip title (e.g. "Diagram", "MITRE Library") */
  label: string;
  /** Optional secondary technical detail or shortcut hint */
  detail?: string;
  /** Optional accent badge text (e.g. "ACTIVE", "VIEW", "ENV") */
  badge?: string;
  /** Horizontal alignment relative to the icon button to prevent viewport clipping */
  align?: 'left' | 'center' | 'right';
  /** Placement above or below the trigger icon */
  side?: 'bottom' | 'top';
  /** Alias for side ('bottom' | 'top') */
  placement?: 'bottom' | 'top';
  children: React.ReactNode;
}

/**
 * Custom application-styled tooltip wrapper for icon-only and concise workbench controls.
 * Renders a crisp tactical/IDE floating tooltip card matching the Attack Explorer
 * design language on hover or keyboard focus.
 */
export function WorkbenchIconTooltip({
  label,
  detail,
  badge,
  align = 'center',
  side = 'bottom',
  placement,
  children,
}: WorkbenchIconTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const effectiveSide = placement || side;

  const alignClasses =
    align === 'left'
      ? 'left-0'
      : align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2';

  const caretAlignClasses =
    align === 'left'
      ? 'left-3'
      : align === 'right'
      ? 'right-3'
      : 'left-1/2 -translate-x-1/2';

  const sideClasses =
    effectiveSide === 'top'
      ? 'bottom-[calc(100%+7px)]'
      : 'top-[calc(100%+7px)]';

  return (
    <div
      className="relative inline-flex items-center justify-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="tooltip"
            data-testid={`workbench-tooltip-${label
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')}`}
            initial={{
              opacity: 0,
              y: effectiveSide === 'top' ? 4 : -4,
              scale: 0.96,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: effectiveSide === 'top' ? 3 : -3,
              scale: 0.96,
            }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={`pointer-events-none absolute ${sideClasses} ${alignClasses} z-50 min-w-max max-w-[320px] rounded-xl bg-zinc-950/95 dark:bg-zinc-900/98 text-white border border-zinc-700/80 dark:border-zinc-700 shadow-[0_10px_28px_rgba(9,9,11,0.45)] backdrop-blur-md px-2.5 py-1.5`}
          >
            {/* Diamond Caret */}
            <span
              aria-hidden="true"
              className={`absolute ${caretAlignClasses} w-2 h-2 rotate-45 bg-zinc-950 dark:bg-zinc-900 ${
                effectiveSide === 'top'
                  ? '-bottom-1 border-r border-b border-zinc-700/80'
                  : '-top-1 border-l border-t border-zinc-700/80'
              }`}
            />

            <div className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span className="text-[11px] font-semibold tracking-tight text-white">
                {label}
              </span>
              {badge && (
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 border border-indigo-400/30 text-[9px] font-mono font-bold text-indigo-300 uppercase">
                  {badge}
                </span>
              )}
            </div>

            {detail && (
              <div className="relative z-10 mt-0.5 text-[10px] font-mono text-zinc-300 leading-snug break-words whitespace-normal max-w-[290px]">
                {detail}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
