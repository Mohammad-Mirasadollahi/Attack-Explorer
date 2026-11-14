'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import {
  computeSmartViewportTooltipPosition,
  formatWorkbenchTooltipCopyText,
} from '@/lib/tooltip-positioning';

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
  /** Explicit flag for Diagram scope; auto-detected when inside [data-testid="attack-visualizer"] */
  isDiagramTooltip?: boolean;
  children: React.ReactNode;
}

/**
 * Custom application-styled tooltip wrapper for icon-only and concise workbench controls.
 * - Renders via a viewport-clamped portal so it never overflows the screen or gets clipped by overflow containers.
 * - Keeps the tooltip open when the user moves the mouse onto the tooltip card (hover-bridge) so text can be selected or copied.
 * - Includes a 1-click Copy button on all tooltips.
 * - Includes a Hide / Show detail toggle exclusively on Diagram tooltips.
 * - Strips native HTML `title` attributes from trigger descendants so the default browser tooltip never duplicates the custom tooltip.
 */
export function WorkbenchIconTooltip({
  label,
  detail,
  badge,
  align = 'center',
  side = 'bottom',
  placement,
  isDiagramTooltip,
  children,
}: WorkbenchIconTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInsideDiagram, setIsInsideDiagram] = useState(false);
  const [isDetailCollapsed, setIsDetailCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const preferredSide = placement || side;
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const copyResetTimerRef = useRef<number | null>(null);

  const [coords, setCoords] = useState<{
    leftPx: number;
    topPx: number;
    effectiveSide: 'top' | 'bottom';
  }>({
    leftPx: 12,
    topPx: 12,
    effectiveSide: preferredSide,
  });

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 170);
  }, [clearCloseTimer]);

  // Strip any native HTML `title` attributes on trigger children so native OS tooltips never appear alongside custom tooltips
  const stripNativeTitlesInTrigger = useCallback(() => {
    const root = triggerRef.current;
    if (!root) return;
    if (root.hasAttribute('title')) {
      root.removeAttribute('title');
    }
    const titledNodes = root.querySelectorAll('[title]');
    titledNodes.forEach((el) => {
      el.removeAttribute('title');
    });
  }, []);

  useEffect(() => {
    stripNativeTitlesInTrigger();
    if (triggerRef.current) {
      setIsInsideDiagram(
        Boolean(triggerRef.current.closest('[data-testid="attack-visualizer"]'))
      );
    }
  }, [children, stripNativeTitlesInTrigger]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (copyResetTimerRef.current !== null) {
        window.clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  const updateViewportPosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl || typeof window === 'undefined') return;
    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    const tooltipWidth = Math.max(180, Math.round(tooltipRect?.width || 250));
    const tooltipHeight = Math.max(44, Math.round(tooltipRect?.height || 68));

    const next = computeSmartViewportTooltipPosition({
      triggerRect: {
        left: triggerRect.left,
        top: triggerRect.top,
        width: triggerRect.width,
        height: triggerRect.height,
      },
      tooltipWidth,
      tooltipHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      preferredSide,
      preferredAlign: align,
      offsetPx: 8,
      edgePadding: 10,
    });

    setCoords((prev) =>
      prev.leftPx === next.leftPx &&
      prev.topPx === next.topPx &&
      prev.effectiveSide === next.effectiveSide
        ? prev
        : next
    );
  }, [align, preferredSide]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateViewportPosition();
    const rafId = window.requestAnimationFrame(updateViewportPosition);
    window.addEventListener('resize', updateViewportPosition);
    window.addEventListener('scroll', updateViewportPosition, true);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateViewportPosition);
      window.removeEventListener('scroll', updateViewportPosition, true);
    };
  }, [isOpen, isDetailCollapsed, label, detail, badge, updateViewportPosition]);

  const handleTriggerMouseEnter = () => {
    clearCloseTimer();
    stripNativeTitlesInTrigger();
    if (triggerRef.current) {
      setIsInsideDiagram(
        Boolean(triggerRef.current.closest('[data-testid="attack-visualizer"]'))
      );
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const initial = computeSmartViewportTooltipPosition({
        triggerRect: {
          left: triggerRect.left,
          top: triggerRect.top,
          width: triggerRect.width,
          height: triggerRect.height,
        },
        tooltipWidth: 250,
        tooltipHeight: 68,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        preferredSide,
        preferredAlign: align,
        offsetPx: 8,
        edgePadding: 10,
      });
      setCoords(initial);
    }
    setIsOpen(true);
  };

  const handleCopyText = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const text = formatWorkbenchTooltipCopyText(label, badge, detail);
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        setCopied(true);
        if (copyResetTimerRef.current !== null) {
          window.clearTimeout(copyResetTimerRef.current);
        }
        copyResetTimerRef.current = window.setTimeout(() => {
          setCopied(false);
        }, 1600);
      } catch {
        // Ignore clipboard permission errors
      }
    },
    [badge, detail, label]
  );

  const effectiveIsDiagram =
    isDiagramTooltip !== undefined ? isDiagramTooltip : isInsideDiagram;

  const tooltipTestId = `workbench-tooltip-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;

  const tooltipNode = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          role="tooltip"
          data-testid={tooltipTestId}
          data-diagram-tooltip={effectiveIsDiagram ? 'true' : 'false'}
          data-tooltip-collapsed={isDetailCollapsed ? 'true' : 'false'}
          data-effective-side={coords.effectiveSide}
          initial={{
            opacity: 0,
            y: coords.effectiveSide === 'top' ? 4 : -4,
            scale: 0.97,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{
            opacity: 0,
            y: coords.effectiveSide === 'top' ? 3 : -3,
            scale: 0.97,
          }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            left: `${coords.leftPx}px`,
            top: `${coords.topPx}px`,
          }}
          className="pointer-events-auto select-text cursor-auto z-[9999] min-w-[200px] max-w-[min(340px,calc(100vw-20px))] rounded-xl bg-zinc-950/96 dark:bg-zinc-900/98 text-white border border-zinc-700/85 dark:border-zinc-700 shadow-[0_12px_32px_rgba(9,9,11,0.55)] backdrop-blur-md px-2.5 py-2"
        >
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span className="text-[11px] font-semibold tracking-tight text-white leading-snug break-words">
                {label}
              </span>
              {badge && (
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 border border-indigo-400/30 text-[9px] font-mono font-bold text-indigo-300 uppercase shrink-0">
                  {badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                data-testid="workbench-tooltip-copy-btn"
                aria-label="Copy tooltip text"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800/90 hover:bg-zinc-700 text-[9px] font-mono font-semibold text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5 text-zinc-300 shrink-0" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {effectiveIsDiagram && detail && (
                <button
                  type="button"
                  data-testid="workbench-diagram-tooltip-collapse-toggle"
                  aria-label={
                    isDetailCollapsed
                      ? 'Show diagram tooltip details'
                      : 'Hide diagram tooltip details'
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsDetailCollapsed((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/35 text-[9px] font-mono font-semibold text-indigo-200 border border-indigo-400/35 transition-colors cursor-pointer"
                >
                  {isDetailCollapsed ? (
                    <>
                      <Eye className="w-2.5 h-2.5 shrink-0" />
                      <span>Show</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-2.5 h-2.5 shrink-0" />
                      <span>Hide</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {detail && !isDetailCollapsed && (
            <div
              data-testid="workbench-tooltip-detail"
              className="relative z-10 mt-1 pt-1 border-t border-zinc-800/90 text-[10px] font-mono text-zinc-300 leading-snug break-words whitespace-normal"
            >
              {detail}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex items-center justify-center"
      onMouseEnter={handleTriggerMouseEnter}
      onMouseLeave={scheduleClose}
      onFocus={handleTriggerMouseEnter}
      onBlur={scheduleClose}
    >
      {children}
      {typeof document !== 'undefined'
        ? createPortal(tooltipNode, document.body)
        : tooltipNode}
    </div>
  );
}
