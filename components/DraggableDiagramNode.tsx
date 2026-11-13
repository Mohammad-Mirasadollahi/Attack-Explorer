'use client';

import React, { memo, useRef } from 'react';
import { motion } from 'framer-motion';
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
  onHoverChange: (nodeId: string | null) => void;
}

/**
 * Memoized Draggable & Multi-Selectable Diagram Node.
 * - Supports Shift+Click (or top-right checkbox) to add/remove nodes in a multi-selection group.
 * - Supports simultaneous 60/120fps group movement of all selected nodes across the workspace.
 * - Disables hover/spring recalculations during active canvas panning or node dragging.
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
  activeStageIndex,
  directorPhase,
  cState,
  tacticalMode,
  onStartNodeGroupDrag,
  onToggleMultiSelect,
  onNodeClick,
  onHoverChange,
}: DraggableDiagramNodeProps) {
  const nodeButtonRef = useRef<HTMLButtonElement | null>(null);

  const leftPct = (node.wx / 1480) * 100;
  const topPct = (node.wy / 650) * 100;
  const skipSpring = isDraggingNodes || isInteracting;

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
      data-wx={node.wx}
      data-wy={node.wy}
      initial={false}
      animate={{
        opacity: cState.opacity,
        scale: isSelected || isMultiSelected ? 1.06 : cState.scale,
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
      title={`${node.actionBadge} · ${node.label} (${node.sublabel})${
        node.hostContext ? ` — ${node.hostContext}` : ''
      }${node.activitySummary ? ` | ${node.activitySummary}` : ''}`}
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        willChange: skipSpring ? 'left, top, transform' : 'transform',
      }}
      className={`canvas-interactive-node nopan group absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center focus:outline-none ${
        isDraggingNodes ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Windows / Shift-Click Multi-Selection Checkbox Badge (Top-Right of Node) */}
      <span
        role="checkbox"
        aria-checked={isMultiSelected}
        data-testid={`node-multiselect-toggle-${node.id}`}
        title={
          isMultiSelected
            ? 'Selected in group (Shift+Click or click checkbox to deselect, or drag to move group)'
            : 'Shift+Click node or click checkbox to add to multi-selection group'
        }
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

      {cState.showPulseRing && (
        <motion.span
          initial={{ scale: 0.85, opacity: 0.85 }}
          animate={{ scale: 1.55, opacity: 0 }}
          transition={{
            duration: 1.35,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{ borderColor: cState.pulseColor }}
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
        title={node.actionBadge}
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
          isMultiSelected
            ? 'ring-2 ring-indigo-500 border-indigo-600 bg-indigo-50/95 dark:bg-indigo-950/90 shadow-[0_0_16px_rgba(99,102,241,0.35)]'
            : isSelected ||
              cState.role === 'CURRENT_TARGET' ||
              cState.role === 'CURRENT_SOURCE'
            ? 'ring-2 ring-rose-500 border-rose-600'
            : ''
        }`}
      >
        <div
          title={node.label}
          className={`text-[9.5px] font-bold leading-snug whitespace-nowrap ${
            tacticalMode
              ? 'text-emerald-100'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {node.label}
        </div>
        <div
          title={node.sublabel}
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

