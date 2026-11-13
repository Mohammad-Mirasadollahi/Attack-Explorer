'use client';

import React, { useCallback, useMemo, useRef } from 'react';
import {
  computeMinimapViewportRect,
  computePanFromMinimapPoint,
  Point2D,
  WHITEBOARD_HEIGHT,
  WHITEBOARD_WIDTH,
} from '@/lib/canvas-interaction-engine';
import {
  NetworkBackboneLink,
  NetworkZoneColumn,
  WhiteboardSketchFlow,
  WhiteboardSketchNode,
} from '@/lib/sketch-zones-and-drilldown';
import { WorkbenchIconTooltip } from '../WorkbenchIconTooltip';
import { Crosshair, Eye, EyeOff, Map } from 'lucide-react';

export interface CanvasMinimapOverlayProps {
  zones: NetworkZoneColumn[];
  backboneLinks?: NetworkBackboneLink[];
  nodes: WhiteboardSketchNode[];
  flows: WhiteboardSketchFlow[];
  selectedNodeId: string | null;
  multiSelectedNodeIds: string[];
  searchMatchedNodeIds?: string[];
  isSearchFiltering?: boolean;
  panOffset: Point2D;
  effectiveScale: number;
  tacticalMode?: boolean;
  isHidden?: boolean;
  onToggleHidden?: () => void;
  onPanToOffset: (nextPan: Point2D) => void;
  onResetView?: () => void;
  containerWidth?: number;
  containerHeight?: number;
}

export function CanvasMinimapOverlay({
  zones,
  backboneLinks = [],
  nodes,
  flows,
  selectedNodeId,
  multiSelectedNodeIds,
  searchMatchedNodeIds = [],
  isSearchFiltering = false,
  panOffset,
  effectiveScale,
  tacticalMode = false,
  isHidden = false,
  onToggleHidden,
  onPanToOffset,
  onResetView,
  containerWidth = 1000,
  containerHeight = 550,
}: CanvasMinimapOverlayProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const viewportRect = useMemo(
    () =>
      computeMinimapViewportRect({
        panX: panOffset.x,
        panY: panOffset.y,
        zoomScale: effectiveScale,
        containerWidth,
        containerHeight,
      }),
    [
      panOffset.x,
      panOffset.y,
      effectiveScale,
      containerWidth,
      containerHeight,
    ]
  );

  const navigateFromClientPointer = useCallback(
    (clientX: number, clientY: number) => {
      const svgEl = svgRef.current;
      if (!svgEl) return;
      const rect = svgEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const relX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const relY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

      const targetWx = Math.round(relX * WHITEBOARD_WIDTH * 10) / 10;
      const targetWy = Math.round(relY * WHITEBOARD_HEIGHT * 10) / 10;

      const nextPan = computePanFromMinimapPoint({
        targetWx,
        targetWy,
        zoomScale: effectiveScale,
        containerWidth,
        containerHeight,
      });

      onPanToOffset(nextPan);
    },
    [effectiveScale, containerWidth, containerHeight, onPanToOffset]
  );

  const handleMinimapPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      navigateFromClientPointer(e.clientX, e.clientY);

      let rafId: number | null = null;
      let latestX = e.clientX;
      let latestY = e.clientY;

      const onMove = (moveEvent: PointerEvent) => {
        latestX = moveEvent.clientX;
        latestY = moveEvent.clientY;
        if (rafId === null) {
          rafId = window.requestAnimationFrame(() => {
            rafId = null;
            navigateFromClientPointer(latestX, latestY);
          });
        }
      };

      const onUp = () => {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
        }
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    },
    [navigateFromClientPointer]
  );

  // Collapsed State: Compact "Show Map" Pill Button
  if (isHidden) {
    return (
      <div
        dir="ltr"
        data-testid="canvas-minimap-collapsed"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="inline-flex items-center"
      >
        <WorkbenchIconTooltip
          label="Show Interactive Minimap"
          badge="MAP · M"
          detail="Restore bottom-right topology minimap"
          side="top"
          align="right"
        >
          <button
            type="button"
            data-testid="show-minimap-btn"
            aria-label="Show Minimap"
            onClick={onToggleHidden}
            className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl border shadow-[0_6px_20px_rgba(15,23,42,0.12)] backdrop-blur-md text-[11px] font-medium transition-colors cursor-pointer ${
              tacticalMode
                ? 'bg-slate-950/92 hover:bg-slate-900 text-emerald-300 border-emerald-500/50'
                : 'bg-white/95 dark:bg-zinc-900/95 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200/90 dark:border-zinc-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <Map className="w-3.5 h-3.5 shrink-0" />
            <span>Show Map</span>
          </button>
        </WorkbenchIconTooltip>
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      data-testid="canvas-minimap-overlay"
      data-zoom-scale={effectiveScale}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={`w-[216px] rounded-xl border shadow-[0_10px_28px_rgba(15,23,42,0.16)] backdrop-blur-md p-1.5 flex flex-col gap-1 transition-colors select-none ${
        tacticalMode
          ? 'bg-slate-950/92 border-emerald-500/50 text-emerald-100'
          : 'bg-white/95 dark:bg-zinc-900/95 border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100'
      }`}
    >
      {/* Minimap Top Header Strip */}
      <div className="flex items-center justify-between gap-1 px-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <Map
            className={`w-3 h-3 shrink-0 ${
              tacticalMode
                ? 'text-emerald-400'
                : 'text-indigo-600 dark:text-indigo-400'
            }`}
          />
          <span className="text-[10px] font-mono font-bold tracking-tight whitespace-nowrap">
            Minimap
          </span>
          <span className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0">
            · {Math.round(effectiveScale * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {onResetView && (
            <WorkbenchIconTooltip
              label="Recenter View"
              badge="0 / R"
              detail="Reset zoom & pan to center"
              side="top"
              align="right"
            >
              <button
                type="button"
                data-testid="minimap-recenter-btn"
                aria-label="Recenter Canvas View"
                onClick={onResetView}
                className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Crosshair className="w-3 h-3" />
              </button>
            </WorkbenchIconTooltip>
          )}

          {onToggleHidden && (
            <WorkbenchIconTooltip
              label="Hide Minimap"
              badge="M"
              detail="Collapse minimap into a compact Show Map button"
              side="top"
              align="right"
            >
              <button
                type="button"
                data-testid="hide-minimap-btn"
                aria-label="Hide Minimap"
                onClick={onToggleHidden}
                className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <EyeOff className="w-3 h-3" />
              </button>
            </WorkbenchIconTooltip>
          )}
        </div>
      </div>

      {/* Interactive Miniature Schematic SVG */}
      <div
        className={`relative w-full h-[92px] rounded-lg border overflow-hidden ${
          tacticalMode
            ? 'bg-[#050B14] border-emerald-500/40'
            : 'bg-[#FDFBF7] dark:bg-[#0B0F17] border-zinc-200/80 dark:border-zinc-800'
        }`}
      >
        <svg
          ref={svgRef}
          data-testid="canvas-minimap-svg"
          viewBox={`0 0 ${WHITEBOARD_WIDTH} ${WHITEBOARD_HEIGHT}`}
          preserveAspectRatio="none"
          onPointerDown={handleMinimapPointerDown}
          className="w-full h-full cursor-crosshair touch-none block"
        >
          {/* Miniature Network Zones */}
          {zones.map((zone) => {
            const zWidth = Math.max(40, zone.xEnd - zone.xStart);
            const zTop = zone.yStart ?? 14;
            const zBottom = zone.yEnd ?? 636;
            const zHeight = Math.max(80, zBottom - zTop);
            return (
              <rect
                key={`mini-zone-${zone.id}`}
                x={zone.xStart + 4}
                y={zTop}
                width={zWidth - 8}
                height={zHeight}
                rx={18}
                fill={zone.accentHex}
                fillOpacity={tacticalMode ? 0.14 : 0.09}
                stroke={zone.accentHex}
                strokeOpacity={0.65}
                strokeWidth="8"
                strokeDasharray="24 14"
              />
            );
          })}

          {/* Miniature Backbone Links */}
          {backboneLinks.map((link) => (
            <line
              key={`mini-bb-${link.id}`}
              x1={link.x1}
              y1={link.y1}
              x2={link.x2}
              y2={link.y2}
              stroke="#94A3B8"
              strokeOpacity={0.45}
              strokeWidth="6"
              strokeDasharray="16 12"
            />
          ))}

          {/* Miniature Attack Flows */}
          {flows.map((flow) => (
            <path
              key={`mini-flow-${flow.id}`}
              d={flow.pathD}
              fill="none"
              stroke={
                flow.isCurrentStep
                  ? '#E11D48'
                  : flow.isVisible
                  ? '#6366F1'
                  : '#94A3B8'
              }
              strokeOpacity={flow.isCurrentStep ? 0.95 : 0.5}
              strokeWidth={flow.isCurrentStep ? '11' : '6'}
            />
          ))}

          {/* Miniature Schematic Nodes */}
          {nodes.map((node) => {
            const isSelected =
              selectedNodeId === node.id ||
              multiSelectedNodeIds.includes(node.id);
            const isSearchMatch =
              isSearchFiltering && searchMatchedNodeIds.includes(node.id);
            const fillHex = isSearchMatch
              ? '#F59E0B'
              : isSelected
              ? '#4F46E5'
              : node.isActive || node.isCompromised
              ? '#E11D48'
              : '#475569';
            const fillOpacity =
              isSearchFiltering && !isSearchMatch ? 0.25 : 0.92;
            return (
              <g key={`mini-node-${node.id}`}>
                <rect
                  x={node.wx - 68}
                  y={node.wy - 32}
                  width={136}
                  height={64}
                  rx={14}
                  fill={fillHex}
                  fillOpacity={fillOpacity}
                  stroke="#FFFFFF"
                  strokeWidth={
                    isSearchMatch || isSelected || node.isActive ? '8' : '4'
                  }
                />
              </g>
            );
          })}

          {/* Live Viewport Indicator Rectangle */}
          <rect
            data-testid="minimap-viewport-rect"
            x={viewportRect.x}
            y={viewportRect.y}
            width={viewportRect.width}
            height={viewportRect.height}
            rx={16}
            fill={tacticalMode ? '#10B981' : '#4F46E5'}
            fillOpacity={0.12}
            stroke={tacticalMode ? '#34D399' : '#4F46E5'}
            strokeWidth="12"
          />
        </svg>
      </div>
    </div>
  );
}
