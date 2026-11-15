'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Hand,
  Keyboard,
  MousePointer,
  Move,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cyclePlaybackSpeed } from '@/lib/simulation-engine';
import { ForceLayoutPresetMode } from '@/lib/canvas-interaction-engine';
import { WorkbenchIconTooltip } from './WorkbenchIconTooltip';

export type ControlBarInteractionMode = 'SELECT' | 'PAN';

interface PlaybackControlBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepBackward?: () => void;
  onStepForward?: () => void;
  onReset?: () => void;
  canStepBackward: boolean;
  canStepForward: boolean;
  activeStageIndex: number;
  totalStages: number;
  playbackSpeed: number;
  onSpeedChange?: (speed: number) => void;
  autoCameraEnabled: boolean;
  onToggleAutoCamera: () => void;
  effectiveScale: number;
  frameTitle: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  /** Merged Canvas Interaction & Graph Layout Controls */
  interactionMode?: ControlBarInteractionMode;
  onInteractionModeChange?: (mode: ControlBarInteractionMode) => void;
  isAutoLayoutActive?: boolean;
  activeAutoLayoutMode?: ForceLayoutPresetMode | null;
  onAutoLayoutNodes?: () => void;
  multiSelectedCount?: number;
  totalNodesCount?: number;
  onSelectAllNodes?: () => void;
  diagramTooltipsEnabled?: boolean;
  onToggleDiagramTooltips?: () => void;
  onOpenShortcutsModal?: () => void;
  hasCustomLayoutOrView?: boolean;
  isSearchFiltering?: boolean;
  searchQuery?: string;
  matchedNodesCount?: number;
  onClearSearchFilter?: () => void;
  forceDesktopCanvas?: boolean;
  defaultHidden?: boolean;
}

export function PlaybackControlBar({
  isPlaying,
  onTogglePlay,
  onStepBackward,
  onStepForward,
  onReset,
  canStepBackward,
  canStepForward,
  activeStageIndex,
  totalStages,
  playbackSpeed,
  onSpeedChange,
  autoCameraEnabled,
  onToggleAutoCamera,
  effectiveScale,
  frameTitle,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  interactionMode = 'PAN',
  onInteractionModeChange,
  isAutoLayoutActive = false,
  activeAutoLayoutMode = null,
  onAutoLayoutNodes,
  multiSelectedCount = 0,
  totalNodesCount = 0,
  onSelectAllNodes,
  diagramTooltipsEnabled = true,
  onToggleDiagramTooltips,
  onOpenShortcutsModal,
  hasCustomLayoutOrView = false,
  isSearchFiltering = false,
  searchQuery = '',
  matchedNodesCount = 0,
  onClearSearchFilter,
  forceDesktopCanvas = false,
  defaultHidden = true,
}: PlaybackControlBarProps) {
  const [isHidden, setIsHidden] = useState(defaultHidden);

  if (isHidden) {
    return (
      <motion.div
        key="playback-bar-collapsed"
        data-testid="playback-control-bar-collapsed"
        initial={{ opacity: 0, y: 4, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="pointer-events-auto flex items-center z-30"
      >
        <WorkbenchIconTooltip
          label="Show Control Panel"
          badge={`${Math.round(effectiveScale * 100)}%`}
          detail="Restore compact floating playback, canvas tools, AutoCam & zoom controls"
          side="top"
          align="right"
        >
          <button
            type="button"
            data-testid="show-playback-bar-btn"
            aria-label="Show Playback and Canvas Controls"
            onClick={() => setIsHidden(false)}
            className="h-6 px-2 flex items-center gap-1 rounded-lg bg-white/95 dark:bg-zinc-900/95 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 text-[10px] font-semibold shadow-md backdrop-blur-md transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Controls</span>
            <span className="px-1 py-0.1 rounded bg-zinc-100 dark:bg-zinc-800 text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
              {Math.round(effectiveScale * 100)}%
            </span>
          </button>
        </WorkbenchIconTooltip>
      </motion.div>
    );
  }

  const allNodesSelected =
    totalNodesCount > 0 && multiSelectedCount === totalNodesCount;

  return (
    <motion.div
      key="playback-bar-expanded"
      data-testid="playback-control-bar"
      initial={{ opacity: 0, y: 4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      onClick={(e) => e.stopPropagation()}
      className="pointer-events-auto flex flex-wrap items-center justify-end gap-0.5 px-1.5 py-1 max-w-full rounded-lg bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-md backdrop-blur-md z-30"
    >
      {/* 1. Playback Sequence Controls */}
      <div className="flex items-center gap-0.5 shrink-0">
        {/* Step Backward */}
        <WorkbenchIconTooltip
          label="Previous Stage"
          badge={activeStageIndex > 0 ? `S${activeStageIndex - 1}` : 'START'}
          detail="Step backward in attack kill-chain (Hotkey: [)"
          side="top"
          align="left"
        >
          <button
            type="button"
            data-testid="playback-bar-prev-btn"
            aria-label="Previous Attack Stage"
            disabled={!canStepBackward}
            onClick={onStepBackward}
            className="h-6 w-6 flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 disabled:opacity-35 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
        </WorkbenchIconTooltip>

        {/* Primary Play / Pause Animation Button */}
        <WorkbenchIconTooltip
          label={isPlaying ? 'Pause Walkthrough' : 'Play Walkthrough'}
          badge="SPACE"
          detail={
            isPlaying
              ? 'Pause step-by-step animated attack sequence'
              : 'Run step-by-step animated attack sequence'
          }
          side="top"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            data-testid="playback-bar-play-pause-btn"
            aria-label={
              isPlaying ? 'Pause Attack Sequence' : 'Play Attack Sequence'
            }
            onClick={onTogglePlay}
            className={`h-6 px-2 flex items-center gap-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-2xs ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-2.5 h-2.5 fill-current shrink-0" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5 fill-current shrink-0" />
                <span>
                  {activeStageIndex === 0 || activeStageIndex >= totalStages
                    ? 'Play'
                    : 'Resume'}
                </span>
              </>
            )}
          </motion.button>
        </WorkbenchIconTooltip>

        {/* Step Forward */}
        <WorkbenchIconTooltip
          label="Next Stage"
          badge={
            activeStageIndex < totalStages ? `S${activeStageIndex + 1}` : 'END'
          }
          detail="Advance to next attack stage (Hotkey: ])"
          side="top"
        >
          <button
            type="button"
            data-testid="playback-bar-next-btn"
            aria-label="Next Attack Stage"
            disabled={!canStepForward && activeStageIndex !== 0}
            onClick={onStepForward}
            className="h-6 w-6 flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 disabled:opacity-35 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </WorkbenchIconTooltip>

        {/* Reset to Overview */}
        {activeStageIndex > 0 && onReset && (
          <WorkbenchIconTooltip
            label="Reset Sequence"
            badge="OVERVIEW"
            detail="Return to full topology overview"
            side="top"
          >
            <button
              type="button"
              data-testid="playback-bar-reset-btn"
              aria-label="Reset Attack Sequence to Overview"
              onClick={onReset}
              className="h-6 w-6 flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          </WorkbenchIconTooltip>
        )}

        {/* Speed Cycler */}
        {onSpeedChange && (
          <WorkbenchIconTooltip
            label="Playback Speed"
            badge={`${playbackSpeed}×`}
            detail="Click to cycle walkthrough speed (0.5× / 1× / 2×)"
            side="top"
          >
            <button
              type="button"
              data-testid="playback-bar-speed-btn"
              onClick={() => onSpeedChange(cyclePlaybackSpeed(playbackSpeed))}
              className="h-6 px-1.5 flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[9.5px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums cursor-pointer"
            >
              {playbackSpeed}×
            </button>
          </WorkbenchIconTooltip>
        )}
      </div>

      {/* 2. Merged Canvas Interaction & Layout Tools */}
      <div
        data-testid="canvas-interaction-toolbar"
        className="flex flex-wrap items-center gap-1 shrink-0"
      >
        {/* Active Node Search Filter Status Pill */}
        {isSearchFiltering && (
          <WorkbenchIconTooltip
            label={`Search Filter: "${searchQuery}"`}
            badge={`${matchedNodesCount}/${totalNodesCount}`}
            detail="Matching attack nodes are highlighted on the graph; click X to clear filter"
            side="top"
          >
            <span
              data-testid="canvas-search-filter-pill"
              className="inline-flex items-center gap-1 h-6 px-1.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-400 dark:border-amber-700 font-mono text-[9.5px] font-bold whitespace-nowrap"
            >
              <Search className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                {matchedNodesCount}/{totalNodesCount}
              </span>
              {onClearSearchFilter && (
                <button
                  type="button"
                  aria-label="Clear canvas node search filter"
                  onClick={onClearSearchFilter}
                  className="rounded-full p-0.5 hover:bg-amber-200/80 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </span>
          </WorkbenchIconTooltip>
        )}

        {/* Multi-Selected Nodes Count Pill */}
        {multiSelectedCount > 0 && (
          <WorkbenchIconTooltip
            label={`${multiSelectedCount} Nodes Selected`}
            badge="GROUP DRAG"
            detail="Drag any selected node to reposition the group together"
            side="top"
          >
            <span
              data-testid="multi-selection-count-badge"
              data-selected-count={multiSelectedCount}
              className="inline-flex items-center gap-1 h-6 px-1.5 rounded-md bg-indigo-600 text-white font-mono text-[9.5px] font-bold shadow-2xs whitespace-nowrap cursor-default"
            >
              <Move className="w-2.5 h-2.5 shrink-0" />
              <span>{multiSelectedCount}</span>
            </span>
          </WorkbenchIconTooltip>
        )}

        {/* Desktop Whiteboard Pointer, Layout & Shortcut Controls */}
        <div
          className={`${
            forceDesktopCanvas ? 'flex' : 'hidden md:flex'
          } items-center gap-0.5`}
        >
          <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Segmented Tool Switcher: Box Select (B) vs Pan Page (P) */}
          <div
            role="group"
            aria-label="Canvas Pointer Interaction Mode"
            className="inline-flex items-center p-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700"
          >
            <WorkbenchIconTooltip
              label="Box Select Tool"
              badge="B"
              detail="Rubber-band marquee selection (or Right-Click + Hold)"
              side="top"
            >
              <button
                type="button"
                data-testid="canvas-mode-select-btn"
                aria-label="Box Select Tool"
                aria-pressed={interactionMode === 'SELECT'}
                onClick={() => onInteractionModeChange?.('SELECT')}
                className={`h-5 px-1.5 inline-flex items-center justify-center gap-1 rounded text-[9.5px] font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  interactionMode === 'SELECT'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <MousePointer className="w-2.5 h-2.5 shrink-0" />
                <span className="hidden 2xl:inline">Select</span>
              </button>
            </WorkbenchIconTooltip>

            <WorkbenchIconTooltip
              label="Pan / Pen Page Tool"
              badge="P"
              detail="Smooth 60/120fps canvas pan (or Left-Click + Hold)"
              side="top"
            >
              <button
                type="button"
                data-testid="canvas-mode-pan-btn"
                aria-label="Pan Page Tool"
                aria-pressed={interactionMode === 'PAN'}
                onClick={() => onInteractionModeChange?.('PAN')}
                className={`h-5 px-1.5 inline-flex items-center justify-center gap-1 rounded text-[9.5px] font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  interactionMode === 'PAN'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Hand className="w-2.5 h-2.5 shrink-0" />
                <span className="hidden 2xl:inline">Pan</span>
              </button>
            </WorkbenchIconTooltip>
          </div>

          {/* Force-Directed Auto-Layout Button */}
          {onAutoLayoutNodes && (
            <WorkbenchIconTooltip
              label="Force-Directed Auto-Layout"
              badge={
                activeAutoLayoutMode
                  ? `FORCE · ${activeAutoLayoutMode}`
                  : 'HOTKEY A'
              }
              detail="Automatically organize attack graph nodes using Coulomb repulsion and Hooke spring forces"
              side="top"
            >
              <button
                type="button"
                data-testid="canvas-auto-layout-btn"
                data-auto-layout-mode={activeAutoLayoutMode || 'NONE'}
                aria-label="Force-Directed Auto-Layout"
                aria-pressed={isAutoLayoutActive}
                onClick={onAutoLayoutNodes}
                className={`h-6 w-6 inline-flex items-center justify-center rounded-md border text-[9.5px] font-mono font-semibold transition-colors cursor-pointer ${
                  isAutoLayoutActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/80'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              </button>
            </WorkbenchIconTooltip>
          )}

          {/* Select All / Deselect All Objects Button */}
          {onSelectAllNodes && (
            <WorkbenchIconTooltip
              label={allNodesSelected ? 'Deselect All Nodes' : 'Select All Nodes'}
              badge="CTRL+A"
              detail="Select all hosts & appliances to move together"
              side="top"
            >
              <button
                type="button"
                data-testid="canvas-select-all-btn"
                aria-label={
                  allNodesSelected ? 'Deselect All Nodes' : 'Select All Nodes'
                }
                aria-pressed={allNodesSelected}
                onClick={onSelectAllNodes}
                className={`h-6 w-6 inline-flex items-center justify-center rounded-md border text-[9.5px] font-mono font-semibold transition-colors cursor-pointer ${
                  allNodesSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-400 dark:border-indigo-700'
                    : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                <CheckSquare className="w-3 h-3 shrink-0" />
              </button>
            </WorkbenchIconTooltip>
          )}

          {/* Diagram Node Tooltips Show / Hide Toggle Button */}
          {onToggleDiagramTooltips && (
            <WorkbenchIconTooltip
              label={
                diagramTooltipsEnabled
                  ? 'Diagram Tooltips: Shown'
                  : 'Diagram Tooltips: Hidden'
              }
              badge={diagramTooltipsEnabled ? 'SHOW' : 'HIDE'}
              detail="Toggle hover inspection tooltips on diagram nodes"
              side="top"
              isDiagramTooltip={true}
            >
              <button
                type="button"
                data-testid="canvas-toggle-diagram-tooltips-btn"
                aria-label={
                  diagramTooltipsEnabled
                    ? 'Diagram Tooltips: Shown'
                    : 'Diagram Tooltips: Hidden'
                }
                aria-pressed={diagramTooltipsEnabled}
                onClick={onToggleDiagramTooltips}
                className={`h-6 w-6 inline-flex items-center justify-center rounded-md border text-[9.5px] font-mono font-semibold transition-colors cursor-pointer ${
                  diagramTooltipsEnabled
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                    : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {diagramTooltipsEnabled ? (
                  <Eye className="w-3 h-3 text-emerald-500 shrink-0" />
                ) : (
                  <EyeOff className="w-3 h-3 shrink-0" />
                )}
              </button>
            </WorkbenchIconTooltip>
          )}

          {/* Keyboard Shortcuts Overlay Trigger Button */}
          {onOpenShortcutsModal && (
            <WorkbenchIconTooltip
              label="Keyboard Shortcuts"
              badge="?"
              detail="Hotkeys for Tools (B/P) & Canvas Navigation"
              side="top"
              align="right"
            >
              <button
                type="button"
                data-testid="canvas-shortcuts-btn"
                aria-label="Open Keyboard Shortcuts Overlay"
                onClick={onOpenShortcutsModal}
                className="h-6 w-6 inline-flex items-center justify-center rounded-md bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700 transition-colors cursor-pointer"
              >
                <Keyboard className="w-3 h-3 text-indigo-500 shrink-0" />
              </button>
            </WorkbenchIconTooltip>
          )}

          {/* Reset Layout / Positions / Pan & Zoom Button */}
          {hasCustomLayoutOrView && (
            <WorkbenchIconTooltip
              label="Reset Canvas Layout"
              badge="0 / R"
              detail="Restore default node/zone positions, 100% zoom, and (0,0) pan"
              side="top"
              align="right"
            >
              <button
                type="button"
                data-testid="canvas-reset-layout-btn"
                aria-label="Reset Canvas Layout"
                onClick={onResetZoom}
                className="h-6 px-1.5 inline-flex items-center gap-1 rounded-md bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/70 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[9.5px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-2.5 h-2.5 shrink-0" />
                <span className="hidden xl:inline">Reset</span>
              </button>
            </WorkbenchIconTooltip>
          )}
        </div>
      </div>

      {/* 3. Smooth Camera Focus (AutoCam) & Compact Zoom Strip */}
      <div
        className={`${
          forceDesktopCanvas ? 'flex' : 'hidden sm:flex'
        } items-center gap-0.5 shrink-0`}
      >
        <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

        <WorkbenchIconTooltip
          label={autoCameraEnabled ? 'AutoCam Enabled' : 'Manual Camera'}
          badge={autoCameraEnabled ? 'ON · C' : 'OFF · C'}
          detail="Toggle automatic stage camera tracking (Hotkey: C)"
          side="top"
        >
          <button
            type="button"
            data-testid="toggle-auto-camera-btn"
            aria-label={autoCameraEnabled ? 'AutoCam Enabled' : 'Manual Camera'}
            aria-pressed={autoCameraEnabled}
            onClick={onToggleAutoCamera}
            className={`h-6 w-6 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
              autoCameraEnabled
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Camera className="w-3 h-3 shrink-0" />
            <span className="sr-only">
              {autoCameraEnabled ? 'AutoCam' : 'Manual'}
            </span>
          </button>
        </WorkbenchIconTooltip>

        <div className="h-6 flex items-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <WorkbenchIconTooltip
            label="Zoom Out"
            detail="Decrease diagram zoom scale"
            side="top"
          >
            <button
              type="button"
              aria-label="Zoom out diagram"
              onClick={onZoomOut}
              className="h-full w-5 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-l-md cursor-pointer"
            >
              <ZoomOut className="w-2.5 h-2.5" />
            </button>
          </WorkbenchIconTooltip>

          <WorkbenchIconTooltip
            label="Reset Zoom & Pan"
            badge={`${Math.round(effectiveScale * 100)}%`}
            detail={`Focus: ${frameTitle} (Click to reset 100%)`}
            side="top"
          >
            <button
              type="button"
              onClick={onResetZoom}
              className="h-full px-1.5 text-[9.5px] font-mono font-semibold text-zinc-700 dark:text-zinc-300 border-x border-zinc-200/80 dark:border-zinc-800 cursor-pointer tabular-nums"
            >
              {Math.round(effectiveScale * 100)}%
            </button>
          </WorkbenchIconTooltip>

          <WorkbenchIconTooltip
            label="Zoom In"
            detail="Increase diagram zoom scale"
            side="top"
            align="right"
          >
            <button
              type="button"
              aria-label="Zoom in diagram"
              onClick={onZoomIn}
              className="h-full w-5 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-r-md cursor-pointer"
            >
              <ZoomIn className="w-2.5 h-2.5" />
            </button>
          </WorkbenchIconTooltip>
        </div>
      </div>

      <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

      {/* 4. Hide / Collapse Control Bar Button */}
      <WorkbenchIconTooltip
        label="Hide Controls"
        badge="HUD"
        detail="Collapse control panel into a compact pill"
        side="top"
        align="right"
      >
        <button
          type="button"
          data-testid="hide-playback-bar-btn"
          aria-label="Hide Playback Control Bar"
          onClick={() => setIsHidden(true)}
          className="h-6 w-6 flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <EyeOff className="w-3 h-3" />
        </button>
      </WorkbenchIconTooltip>
    </motion.div>
  );
}
