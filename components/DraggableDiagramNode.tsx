'use client';

import React, { memo, useRef } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { WhiteboardSketchNode } from '@/lib/sketch-zones-and-drilldown';
import { SketchNodeIcon } from './SketchNodeIcons';

export interface NodeCinematicRenderState {
  opacity: number;
  scale: number;
  yOffset: number;
  showPulseRing: boolean;
  pulseColor: string;
  role: string;
}

export interface DraggableDiagramNodeProps {
  node: WhiteboardSketchNode;
  nodeIndex: number;
  isSubBoard: boolean;
  isSelected: boolean;
  isMultiSelected: boolean;
  isRecentlyReturned: boolean;
  isDraggingNodes: boolean;
  isInteracting?: boolean;
  isAutoLayoutAnimating?: boolean;
  isSearchFiltering?: boolean;
  isSearchMatch?: boolean;
  isSearchFocused?: boolean;
  activeStageIndex: number;
  directorPhase: string;
  cState: NodeCinematicRenderState;
  tacticalMode: boolean;
  onStartNodeGroupDrag: (
    node: WhiteboardSketchNode,
    e: React.PointerEvent<HTMLElement>
  ) => void;
  onToggleMultiSelect: (
    nodeId: string,
    e: React.MouseEvent | React.PointerEvent
  ) => void;
  onNodeClick: (
    node: WhiteboardSketchNode,
    e: React.MouseEvent<HTMLElement>
  ) => void;
  onNodeDoubleClick?: (
    node: WhiteboardSketchNode,
    e: React.MouseEvent<HTMLElement>
  ) => void;
  onHoverChange: (nodeId: string | null) => void;
}

/**
 * Memoized Draggable & Multi-Selectable Diagram Node.
 * - Supports Shift+Click (or top-right checkbox) to add/remove nodes in a multi-selection group.
 * - Supports simultaneous 60/120fps group movement of all selected nodes across the workspace.
 * - Supports Force-Directed Auto-Layout smooth transitions and Top Toolbar Node Search highlighting.
 */
export const DraggableDiagramNode = memo(function DraggableDiagramNode({
  node,
  nodeIndex,
  isSubBoard,
  isSelected,
  isMultiSelected,
  isRecentlyReturned,
  isDraggingNodes,
  isInteracting = false,
  isAutoLayoutAnimating = false,
  isSearchFiltering = false,
  isSearchMatch = true,
  isSearchFocused = false,
  activeStageIndex,
  directorPhase,
  cState,
  tacticalMode,
  onStartNodeGroupDrag,
  onToggleMultiSelect,
  onNodeClick,
  onNodeDoubleClick,
  onHoverChange,
}: DraggableDiagramNodeProps) {
  const nodeButtonRef = useRef<HTMLButtonElement | null>(null);

  const leftPct = (node.wx / 1480) * 100;
  const topPct = (node.wy / 650) * 100;
  const skipSpring = isDraggingNodes || isInteracting;

  const effectiveOpacity = isSearchFiltering
    ? isSearchMatch
      ? 1
      : 0.22
    : cState.opacity;

  const effectiveScale = isSearchFiltering
    ? isSearchFocused
      ? 1.1
      : isSearchMatch
      ? 1.05
      : 0.96
    : isSelected || isMultiSelected
    ? 1.06
    : cState.scale;

  return (
    <motion.button
      ref={nodeButtonRef}
      type="button"
      data-testid={
        isSubBoard
          ? `internal-subnode-${node.chainOrder}`
          : `sketch-node-${node.id}`
      }
      data-node-id={node.id}
      data-node-role={cState.role}
      data-multi-selected={isMultiSelected ? 'true' : 'false'}
      data-search-match={
        isSearchFiltering ? (isSearchMatch ? 'true' : 'false') : 'all'
      }
      data-search-focused={isSearchFocused ? 'true' : 'false'}
      data-wx={node.wx}
      data-wy={node.wy}
      initial={false}
      // 2D transforms only — translate3d compositor tiles blur under parent zoom.
      transformTemplate={({ x, y, scale }) =>
        `translate(-50%, calc(-50% + ${y ?? 0}px)) scale(${scale ?? 1})`
      }
      animate={{
        opacity: effectiveOpacity,
        scale: effectiveScale,
        y: cState.yOffset,
      }}
      whileHover={
        skipSpring ? undefined : { y: -3, scale: 1.06, opacity: 1 }
      }
      transition={
        skipSpring
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 320,
              damping: 24,
              delay:
                activeStageIndex === 0 && directorPhase === 'OVERVIEW'
                  ? nodeIndex * 0.02
                  : 0,
            }
      }
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        onStartNodeGroupDrag(node, e);
      }}
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={() => {
        if (!skipSpring) onHoverChange(node.id);
      }}
      onMouseLeave={() => {
        if (!skipSpring) onHoverChange(null);
      }}
      onFocus={() => {
        if (!skipSpring) onHoverChange(node.id);
      }}
      onBlur={() => onHoverChange(null)}
      onClick={(e) => onNodeClick(node, e)}
      onDoubleClick={(e) => onNodeDoubleClick?.(node, e)}
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        // Only promote a layer while actively dragging — permanent
        // will-change makes zoomed-in node text/icons blurry.
        willChange: isDraggingNodes ? 'left, top, transform' : 'auto',
      }}
      className={`canvas-interactive-node nopan group absolute flex flex-col items-center text-center focus:outline-none ${
        isSearchFiltering && isSearchMatch ? 'z-30' : 'z-20'
      } ${
        isAutoLayoutAnimating && !skipSpring
          ? 'transition-[left,top] duration-500 ease-out'
          : ''
      } ${
        isSearchFiltering && !isSearchMatch ? 'grayscale-[45%]' : ''
      } ${isDraggingNodes ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {/* Top-Left Search Match Badge when Top Toolbar Node Search is Active */}
      {isSearchFiltering && isSearchMatch && (
        <span
          data-testid={`node-search-match-badge-${node.id}`}
          className={`pointer-events-none absolute -top-2.5 -left-2 z-30 px-1.5 py-0.5 rounded-md text-[7.5px] font-mono font-extrabold tracking-wider uppercase shadow-md border ${
            isSearchFocused
              ? 'bg-amber-500 text-slate-950 border-amber-300'
              : 'bg-indigo-600 text-white border-indigo-400'
          }`}
        >
          {isSearchFocused ? 'FOCUSED' : 'MATCH'}
        </span>
      )}

      {/* Windows / Shift-Click Multi-Selection Checkbox Badge (Top-Right of Node) */}
      <span
        role="checkbox"
        aria-checked={isMultiSelected}
        aria-label={
          isMultiSelected
            ? 'Selected in group (Shift+Click or click checkbox to deselect, or drag to move group)'
            : 'Shift+Click node or click checkbox to add to multi-selection group'
        }
        data-testid={`node-multiselect-toggle-${node.id}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => onToggleMultiSelect(node.id, e)}
        className={`canvas-interactive-control nopan absolute -top-2 -right-2 z-30 w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
          isMultiSelected
            ? 'bg-indigo-600 border-indigo-400 text-white opacity-100 scale-105 shadow-md'
            : 'bg-white/95 dark:bg-zinc-900/95 border-zinc-400 dark:border-zinc-600 text-transparent opacity-0 group-hover:opacity-100 hover:border-indigo-500'
        }`}
      >
        <Check className="w-2.5 h-2.5 stroke-[3]" />
      </span>

      {(cState.showPulseRing || (isSearchFiltering && isSearchMatch)) && (
        <motion.span
          initial={{ scale: 0.85, opacity: 0.85 }}
          animate={{ scale: 1.55, opacity: 0 }}
          transition={{
            duration: 1.35,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            borderColor:
              isSearchFiltering && isSearchMatch
                ? '#F59E0B'
                : cState.pulseColor,
          }}
          className="pointer-events-none absolute inset-0 rounded-2xl border-2"
        />
      )}

      {isRecentlyReturned && (
        <motion.span
          initial={{ scale: 0.85, opacity: 0.9 }}
          animate={{ scale: 1.65, opacity: 0 }}
          transition={{
            duration: 1.1,
            repeat: 2,
            ease: 'easeOut',
          }}
          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-indigo-500"
        />
      )}

      <span
        className={`mb-0.5 px-2 py-0.5 text-[7.5px] font-mono font-bold border rounded-full shadow-2xs transition-transform group-hover:scale-105 whitespace-nowrap ${
          node.isNetworkDevice
            ? 'bg-teal-600 text-white border-teal-800'
            : node.iconType === 'MALWARE_PAYLOAD' ||
              node.iconType === 'KERNEL_MEMORY'
            ? 'bg-rose-600 text-white border-rose-800'
            : node.iconType === 'VICTIM_LAPTOP' ||
              node.iconType === 'PROCESS_THREAD'
            ? 'bg-sky-600 text-white border-sky-800'
            : node.iconType === 'LATERAL_SERVER' ||
              node.iconType === 'CREDENTIAL_VAULT'
            ? 'bg-violet-600 text-white border-violet-800'
            : 'bg-amber-500 text-slate-950 border-amber-700'
        }`}
      >
        {node.actionBadge}
      </span>

      <SketchNodeIcon
        iconType={node.iconType}
        isActive={
          node.isActive ||
          (isSearchFiltering && isSearchMatch) ||
          cState.role === 'CURRENT_SOURCE' ||
          cState.role === 'CURRENT_TARGET'
        }
        isCompromised={node.isCompromised}
      />

      <div
        className={`mt-0.5 px-3 py-1.5 border rounded-xl shadow-xs transition-all min-w-[172px] w-max max-w-[260px] ${
          tacticalMode
            ? 'bg-slate-950/95 text-white border-emerald-500/60 group-hover:border-emerald-400'
            : 'bg-white/95 dark:bg-zinc-900/95 border-slate-800/80 dark:border-zinc-700 group-hover:border-indigo-500'
        } ${
          isSearchFiltering && isSearchMatch
            ? 'ring-2 ring-amber-400 border-amber-500 bg-amber-50/95 dark:bg-amber-950/85 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
            : isMultiSelected
            ? 'ring-2 ring-indigo-500 border-indigo-600 bg-indigo-50/95 dark:bg-indigo-950/90 shadow-[0_0_16px_rgba(99,102,241,0.35)]'
            : isSelected ||
              cState.role === 'CURRENT_TARGET' ||
              cState.role === 'CURRENT_SOURCE'
            ? 'ring-2 ring-rose-500 border-rose-600'
            : ''
        }`}
      >
        <div
          className={`text-[9.5px] font-bold leading-snug whitespace-nowrap ${
            tacticalMode
              ? 'text-emerald-100'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {node.label}
        </div>
        <div
          className={`text-[8px] font-mono leading-snug whitespace-nowrap ${
            tacticalMode
              ? 'text-emerald-400/85'
              : 'text-slate-500 dark:text-zinc-400'
          }`}
        >
          {node.sublabel}
        </div>
      </div>
    </motion.button>
  );
});

