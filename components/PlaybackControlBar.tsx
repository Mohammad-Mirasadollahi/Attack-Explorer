'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cyclePlaybackSpeed } from '@/lib/simulation-engine';
import { WorkbenchIconTooltip } from './WorkbenchIconTooltip';

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
}: PlaybackControlBarProps) {
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return (
      <motion.div
        key="playback-bar-collapsed"
        data-testid="playback-control-bar-collapsed"
        initial={{ opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center z-30"
      >
        <WorkbenchIconTooltip
          label="Show Playback & Zoom Bar"
          badge={`${Math.round(effectiveScale * 100)}%`}
          detail="Restore sequence player, AutoCam & zoom controls"
          side="top"
          align="right"
        >
          <button
            type="button"
            data-testid="show-playback-bar-btn"
            aria-label="Show Playback and Zoom Controls"
            onClick={() => setIsHidden(false)}
            className="h-8 px-2.5 flex items-center gap-1.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold shadow-lg backdrop-blur-md transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Show</span>
            <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
              {Math.round(effectiveScale * 100)}%
            </span>
          </button>
        </WorkbenchIconTooltip>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="playback-bar-expanded"
      data-testid="playback-control-bar"
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-lg backdrop-blur-md z-30"
    >
          {/* Step Backward */}
          <WorkbenchIconTooltip
            label="Previous Stage"
            badge={activeStageIndex > 0 ? `S${activeStageIndex - 1}` : 'START'}
            detail="Step backward in attack kill-chain"
            side="top"
            align="left"
          >
            <button
              type="button"
              data-testid="playback-bar-prev-btn"
              aria-label="Previous Attack Stage"
              disabled={!canStepBackward}
              onClick={onStepBackward}
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 disabled:opacity-35 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </WorkbenchIconTooltip>

          {/* Primary Play / Pause Animation Button (Concise "Play" / "Pause" label) */}
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
              className={`h-7 px-2.5 flex items-center gap-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-2xs ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
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
              activeStageIndex < totalStages
                ? `S${activeStageIndex + 1}`
                : 'END'
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
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 disabled:opacity-35 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
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
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
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
                className="h-7 px-2 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10.5px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums cursor-pointer"
              >
                {playbackSpeed}×
              </button>
            </WorkbenchIconTooltip>
          )}

          <div className="hidden sm:block h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Smooth Camera Focus (Icon-Only AutoCam) & Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1">
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
                className={`h-7 w-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  autoCameraEnabled
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span className="sr-only">
                  {autoCameraEnabled ? 'AutoCam' : 'Manual'}
                </span>
              </button>
            </WorkbenchIconTooltip>

            <div className="flex items-center rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <WorkbenchIconTooltip
                label="Zoom Out"
                detail="Decrease diagram zoom scale"
                side="top"
              >
                <button
                  type="button"
                  aria-label="Zoom out diagram"
                  onClick={onZoomOut}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-l-lg cursor-pointer"
                >
                  <ZoomOut className="w-3 h-3" />
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
                  className="px-2 text-[10px] font-mono font-semibold text-zinc-700 dark:text-zinc-300 border-x border-zinc-200/80 dark:border-zinc-800 cursor-pointer tabular-nums"
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
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-r-lg cursor-pointer"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </WorkbenchIconTooltip>
            </div>
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Hide / Collapse Playback Control Bar Button */}
          <WorkbenchIconTooltip
            label="Hide Controls"
            badge="HUD"
            detail="Collapse playback bar into a compact Show button"
            side="top"
            align="right"
          >
            <button
              type="button"
              data-testid="hide-playback-bar-btn"
              aria-label="Hide Playback Control Bar"
              onClick={() => setIsHidden(true)}
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </WorkbenchIconTooltip>
    </motion.div>
  );
}

