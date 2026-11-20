'use client';

import React from 'react';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Tag,
} from 'lucide-react';

export interface StageDockTab {
  id: string;
  label: string;
  selected: boolean;
  testId?: string;
  onSelect: () => void;
}

export interface StageDockCameraPreset {
  id: string;
  label: string;
  active: boolean;
  testId?: string;
  onSelect: () => void;
}

export interface StagePlaybackDockProps {
  dockTestId: string;
  toggleTestId: string;
  playTestId: string;
  restartTestId: string;
  timelineTestId: string;
  timelineInputId: string;
  labelsTestId: string;
  bloomTestId: string;
  dockExpanded: boolean;
  onToggleDock: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  tabs: StageDockTab[];
  speeds?: readonly number[];
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  timelinePct: number;
  onScrub: (pct: number) => void;
  cameraPresets: StageDockCameraPreset[];
  labelsEnabled: boolean;
  onToggleLabels: () => void;
  bloomEnabled: boolean;
  onToggleBloom: () => void;
}

const DEFAULT_SPEEDS = [0.5, 1, 1.5] as const;

/** Collapsible bottom playback dock shared by all anime 3D stages. */
export function StagePlaybackDock({
  dockTestId,
  toggleTestId,
  playTestId,
  restartTestId,
  timelineTestId,
  timelineInputId,
  labelsTestId,
  bloomTestId,
  dockExpanded,
  onToggleDock,
  isPlaying,
  onTogglePlay,
  onRestart,
  tabs,
  speeds = DEFAULT_SPEEDS,
  playbackSpeed,
  onSpeedChange,
  timelinePct,
  onScrub,
  cameraPresets,
  labelsEnabled,
  onToggleLabels,
  bloomEnabled,
  onToggleBloom,
}: StagePlaybackDockProps) {
  return (
    <div
      data-testid={dockTestId}
      className="pointer-events-none absolute inset-x-0 bottom-3.5 z-20 flex flex-col items-center px-3"
    >
      <button
        type="button"
        data-testid={toggleTestId}
        onClick={onToggleDock}
        aria-expanded={dockExpanded}
        className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg rounded-b-md bg-slate-950/92 hover:bg-slate-900 text-slate-100 border border-slate-700 text-[10.5px] font-mono font-bold transition-colors cursor-pointer"
      >
        {dockExpanded ? (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Hide Controls</span>
          </>
        ) : (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Show Controls</span>
          </>
        )}
      </button>

      {dockExpanded && (
        <div className="pointer-events-auto w-full max-w-[960px] rounded-xl bg-white/95 dark:bg-slate-950/94 border-2 border-slate-900 dark:border-slate-700 shadow-[4px_4px_0px_#0F172A] px-3.5 py-2.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                data-testid={playTestId}
                onClick={onTogglePlay}
                aria-label={
                  isPlaying ? 'Pause 3D animation' : 'Play 3D animation'
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-extrabold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isPlaying
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-slate-900'
                    : 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-800'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 shrink-0" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 shrink-0" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                data-testid={restartTestId}
                onClick={onRestart}
                aria-label="Restart 3D animation from Act 1"
                className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div
              className="flex items-center gap-1 flex-wrap"
              role="tablist"
              aria-label="Story Acts"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={tab.selected}
                  data-testid={tab.testId}
                  onClick={tab.onSelect}
                  className={`px-2 py-1 rounded-md text-[10.5px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    tab.selected
                      ? 'bg-slate-950 dark:bg-sky-400 text-white dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {speeds.map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onSpeedChange(spd)}
                  className={`px-1.5 py-1 rounded text-[10px] font-mono font-bold tabular-nums transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 min-w-[180px]">
              <label
                htmlFor={timelineInputId}
                className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tabular-nums shrink-0"
              >
                {timelinePct}%
              </label>
              <input
                id={timelineInputId}
                data-testid={timelineTestId}
                type="range"
                min={0}
                max={100}
                value={timelinePct}
                onChange={(e) => onScrub(Number(e.target.value))}
                aria-label="Scrub 3D animation timeline"
                className="w-full h-1.5 accent-rose-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1 flex-wrap shrink-0">
              <Camera className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mr-0.5 shrink-0" />
              {cameraPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  data-testid={preset.testId}
                  onClick={preset.onSelect}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    preset.active
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}

              <button
                type="button"
                data-testid={labelsTestId}
                onClick={onToggleLabels}
                aria-pressed={labelsEnabled}
                aria-label={`Toggle floating 3D component labels, currently ${labelsEnabled ? 'on' : 'off'}`}
                className={`inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  labelsEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Tag className="w-3 h-3 shrink-0" />
                <span>Labels {labelsEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                data-testid={bloomTestId}
                onClick={onToggleBloom}
                aria-pressed={bloomEnabled}
                aria-label={`Toggle anime bloom post-processing, currently ${bloomEnabled ? 'on' : 'off'}`}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  bloomEnabled
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>Bloom {bloomEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
