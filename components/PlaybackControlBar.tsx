'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cyclePlaybackSpeed } from '@/lib/simulation-engine';

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
  return (
    <motion.div
      layout
      data-testid="playback-control-bar"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      onClick={(e) => e.stopPropagation()}
      className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-lg backdrop-blur-md z-30"
    >
      {/* Step Backward */}
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

      {/* Primary Play / Pause Animation Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        data-testid="playback-bar-play-pause-btn"
        aria-label={
          isPlaying ? 'Pause Attack Sequence' : 'Play Attack Sequence'
        }
        onClick={onTogglePlay}
        className={`h-7 px-3 flex items-center gap-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-2xs ${
          isPlaying
            ? 'bg-rose-600 hover:bg-rose-500 text-white'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause Sequence</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {activeStageIndex === 0 || activeStageIndex >= totalStages
                ? 'Play Sequence'
                : 'Resume'}
            </span>
          </>
        )}
      </motion.button>

      {/* Step Forward */}
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

      {/* Reset to Overview */}
      {activeStageIndex > 0 && onReset && (
        <button
          type="button"
          data-testid="playback-bar-reset-btn"
          aria-label="Reset Attack Sequence to Overview"
          onClick={onReset}
          title="Reset to Overview"
          className="h-7 w-7 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}

      {/* Speed Cycler */}
      {onSpeedChange && (
        <button
          type="button"
          data-testid="playback-bar-speed-btn"
          onClick={() => onSpeedChange(cyclePlaybackSpeed(playbackSpeed))}
          title={`Playback Speed: ${playbackSpeed}×`}
          className="h-7 px-2 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10.5px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums cursor-pointer"
        >
          {playbackSpeed}×
        </button>
      )}

      <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

      {/* Smooth Camera Focus & Zoom Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          data-testid="toggle-auto-camera-btn"
          onClick={onToggleAutoCamera}
          title={
            autoCameraEnabled
              ? 'Smooth Auto-Camera Focus Enabled'
              : 'Auto-Camera Focus Disabled'
          }
          className={`h-7 px-2 flex items-center gap-1 rounded-lg text-[10px] font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            autoCameraEnabled
              ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <Camera className="w-3 h-3 shrink-0" />
          <span>{autoCameraEnabled ? 'AutoCam' : 'Manual'}</span>
        </button>

        <div className="flex items-center rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
          <button
            type="button"
            aria-label="Zoom out diagram"
            onClick={onZoomOut}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onResetZoom}
            title={`Focus: ${frameTitle} (Click to reset zoom)`}
            className="px-2 text-[10px] font-mono font-semibold text-zinc-700 dark:text-zinc-300 border-x border-zinc-200/80 dark:border-zinc-800 cursor-pointer tabular-nums"
          >
            {Math.round(effectiveScale * 100)}%
          </button>
          <button
            type="button"
            aria-label="Zoom in diagram"
            onClick={onZoomIn}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
