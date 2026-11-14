'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import {
  computeSmartDiagramTooltipPlacement,
  DiagramTooltipPlacementResult,
  formatNodeTooltipCopyText,
  RectBox,
} from '@/lib/tooltip-positioning';
import {
  Check,
  Copy,
  Cpu,
  Eye,
  EyeOff,
  Layers,
  Maximize2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

export interface NodeHoverTooltipProps {
  node: WhiteboardSketchNode;
  allNodes?: WhiteboardSketchNode[];
  boardContainerRef?: React.RefObject<HTMLDivElement | null>;
  isSubBoard?: boolean;
  /** Controlled collapsed/minimized state for diagram tooltips ("Show / Hide" on diagram tooltips) */
  isCollapsed?: boolean;
  onToggleCollapsed?: () => void;
  /** Keep tooltip open when pointer enters the tooltip card */
  onTooltipMouseEnter?: () => void;
  onTooltipMouseLeave?: () => void;
}

function formatRoleLabel(node: WhiteboardSketchNode): string {
  const role = node.originalNode?.role;
  if (node.isNetworkDevice) return 'Network Security / Routing Appliance';
  if (role === 'attacker') return 'External Threat Actor / Foothold Origin';
  if (role === 'victim_host') return 'Target Endpoint / Host Operating System';
  if (role === 'process') return 'In-Memory Process / Execution Thread';
  if (role === 'memory') return 'Virtual Memory Region (VAD / Heap)';
  if (role === 'domain_controller') return 'Tier-0 Active Directory KDC Server';
  if (role === 'server') return 'Enterprise Application / Storage Server';
  if (role === 'firewall_siem') return 'SOC SIEM / NDR Telemetry Sensor';
  if (role === 'dns_resolver') return 'Recursive DNS Resolver';
  return 'System Architecture Node';
}

export function NodeHoverTooltip({
  node,
  allNodes = [],
  boardContainerRef,
  isSubBoard = false,
  isCollapsed: controlledCollapsed,
  onToggleCollapsed,
  onTooltipMouseEnter,
  onTooltipMouseLeave,
}: NodeHoverTooltipProps) {
  const tooltipElRef = useRef<HTMLDivElement | null>(null);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggleCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onToggleCollapsed) {
        onToggleCollapsed();
      } else {
        setInternalCollapsed((prev) => !prev);
      }
    },
    [onToggleCollapsed]
  );

  const handleCopyText = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const textToCopy = formatNodeTooltipCopyText(node);
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        }
      } catch {
        // Fallback if clipboard API is restricted
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    },
    [node]
  );

  // Compute initial fallback placement from node logical coordinates (1480x650)
  const [placementState, setPlacementState] =
    useState<DiagramTooltipPlacementResult>(() => {
      const approxContainerW = 920;
      const approxContainerH = 520;
      const approxNodeW = 180;
      const approxNodeH = 92;
      const nodeLeft = (node.wx / 1480) * approxContainerW - approxNodeW / 2;
      const nodeTop = (node.wy / 650) * approxContainerH - approxNodeH / 2;

      return computeSmartDiagramTooltipPlacement({
        containerWidth: approxContainerW,
        containerHeight: approxContainerH,
        nodeRect: {
          left: nodeLeft,
          top: nodeTop,
          width: approxNodeW,
          height: approxNodeH,
        },
        tooltipWidth: 320,
        tooltipHeight: isCollapsed ? 52 : 240,
      });
    });

  // Measure real DOM bounding boxes of boardContainer, hovered node, other nodes, and tooltip card
  useEffect(() => {
    const updatePosition = () => {
      const containerEl = boardContainerRef?.current;
      const tooltipEl = tooltipElRef.current;
      if (!containerEl) return;

      const cRect = containerEl.getBoundingClientRect();
      if (cRect.width <= 0 || cRect.height <= 0) return;

      const hoveredNodeEl = containerEl.querySelector(
        `[data-node-id="${CSS.escape(node.id)}"]`
      ) as HTMLElement | null;

      let nodeRect: RectBox;
      if (hoveredNodeEl) {
        const nRect = hoveredNodeEl.getBoundingClientRect();
        nodeRect = {
          left: nRect.left - cRect.left,
          top: nRect.top - cRect.top,
          width: nRect.width || 180,
          height: nRect.height || 92,
        };
      } else {
        const approxW = 180;
        const approxH = 92;
        nodeRect = {
          left: (node.wx / 1480) * cRect.width - approxW / 2,
          top: (node.wy / 650) * cRect.height - approxH / 2,
          width: approxW,
          height: approxH,
        };
      }

      const otherNodeRects: RectBox[] = [];
      const allNodeDomEls = containerEl.querySelectorAll('[data-node-id]');
      allNodeDomEls.forEach((el) => {
        const idAttr = el.getAttribute('data-node-id');
        if (!idAttr || idAttr === node.id) return;
        const r = el.getBoundingClientRect();
        otherNodeRects.push({
          left: r.left - cRect.left,
          top: r.top - cRect.top,
          width: r.width,
          height: r.height,
        });
      });

      const tWidth = tooltipEl?.offsetWidth || 320;
      const tHeight = tooltipEl?.offsetHeight || (isCollapsed ? 52 : 240);

      const nextPlacement = computeSmartDiagramTooltipPlacement({
        containerWidth: cRect.width,
        containerHeight: cRect.height,
        nodeRect,
        tooltipWidth: tWidth,
        tooltipHeight: tHeight,
        otherNodeRects,
        edgePadding: 12,
        topSafeInset: 12,
        bottomSafeInset: 58,
      });

      setPlacementState((prev) =>
        prev.leftPx === nextPlacement.leftPx &&
        prev.topPx === nextPlacement.topPx &&
        prev.placement === nextPlacement.placement &&
        prev.maxHeightPx === nextPlacement.maxHeightPx
          ? prev
          : nextPlacement
      );
    };

    updatePosition();
    const rafId = window.requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
    };
  }, [node, allNodes, boardContainerRef, isCollapsed]);

  const details = node.originalNode?.details;
  const statusLabel = node.isCompromised
    ? 'COMPROMISED'
    : node.isActive
    ? 'ACTIVE FLOW'
    : 'STANDBY';

  return (
    <motion.div
      ref={tooltipElRef}
      role="tooltip"
      data-testid={`node-hover-tooltip-${node.id}`}
      data-tooltip-placement={placementState.placement}
      data-tooltip-collapsed={isCollapsed ? 'true' : 'false'}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      onMouseEnter={onTooltipMouseEnter}
      onMouseLeave={onTooltipMouseLeave}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        left: `${placementState.leftPx}px`,
        top: `${placementState.topPx}px`,
        maxHeight: `${placementState.maxHeightPx}px`,
      }}
      className="pointer-events-auto select-text cursor-auto absolute z-50 w-80 max-w-[calc(100%-24px)] overflow-y-auto workbench-scrollbar rounded-xl bg-zinc-950/96 text-white border border-zinc-700/90 shadow-[0_14px_34px_rgba(9,9,11,0.65)] p-2.5 space-y-2 backdrop-blur-md"
    >
      {/* Header: Sequence + Status + Diagram-Only Show/Hide & Copy Controls */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-zinc-800 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] font-mono font-bold text-indigo-300 break-words">
            NODE #{node.sequenceCode || node.chainOrder} · {node.actionBadge}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold shrink-0 ${
              node.isCompromised
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {node.isCompromised ? (
              <ShieldAlert className="w-2.5 h-2.5" />
            ) : (
              <ShieldCheck className="w-2.5 h-2.5" />
            )}
            <span>{statusLabel}</span>
          </span>
        </div>

        {/* Interactive Diagram-Only Show/Hide & Copy Toolbar */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            data-testid="diagram-tooltip-copy-btn"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[9px] font-mono font-semibold transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            data-testid="diagram-tooltip-collapse-toggle"
            onClick={handleToggleCollapse}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-200 border border-indigo-500/40 text-[9px] font-mono font-semibold transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <>
                <Eye className="w-2.5 h-2.5 text-indigo-300" />
                <span>Show</span>
              </>
            ) : (
              <>
                <EyeOff className="w-2.5 h-2.5 text-indigo-300" />
                <span>Hide</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Title & Technical Device Role (Always visible even when collapsed) */}
      <div className="space-y-0.5 text-left">
        <div className="text-xs font-bold text-white leading-snug break-words">
          {node.label}
        </div>
        {!isCollapsed && (
          <div className="text-[10px] font-mono text-amber-300 flex items-center gap-1">
            <Cpu className="w-3 h-3 shrink-0" />
            <span className="break-words">{formatRoleLabel(node)}</span>
          </div>
        )}
      </div>

      {/* Collapsible Detailed Body */}
      {!isCollapsed && (
        <>
          {/* Technical Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-left text-[9.5px] font-mono bg-zinc-900/90 rounded-lg p-2 border border-zinc-800/80">
            <div className="break-words">
              <span className="text-zinc-400 block text-[8.5px]">
                ENDPOINT / PORT
              </span>
              <span className="text-zinc-100 font-semibold break-words">
                {details?.pidOrPort || node.sublabel}
              </span>
            </div>
            <div className="break-words">
              <span className="text-zinc-400 block text-[8.5px]">
                PRIVILEGE / OS
              </span>
              <span className="text-zinc-100 font-semibold break-words">
                {details?.privilege || details?.osOrType || 'System Context'}
              </span>
            </div>
          </div>

          {/* Complete Untruncated Host Context, Activities & Internal Summary */}
          <div className="text-left space-y-1.5 text-[10px]">
            {node.hostContext && (
              <div
                data-testid={`tooltip-host-context-${node.id}`}
                className="px-2 py-1 rounded-md bg-sky-950/60 border border-sky-800/70 text-sky-200 font-mono break-words leading-snug"
              >
                {node.hostContext}
              </div>
            )}
            {node.activitySummary && (
              <div
                data-testid={`tooltip-activity-summary-${node.id}`}
                className="text-zinc-200 font-medium leading-snug break-words"
              >
                {node.activitySummary}
              </div>
            )}
            {(node.internalSummary || details?.description) &&
              node.internalSummary !== node.activitySummary && (
                <p className="text-zinc-400 leading-snug break-words">
                  {node.internalSummary || details?.description}
                </p>
              )}
          </div>

          {/* Action Hint Footer */}
          <div className="pt-1 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono text-indigo-300">
            <span className="inline-flex items-center gap-1">
              {isSubBoard ? (
                <>
                  <Layers className="w-2.5 h-2.5" />
                  <span>Click to inspect sub-process telemetry</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-2.5 h-2.5" />
                  <span>Double-click node to expand internal zone view</span>
                </>
              )}
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}
