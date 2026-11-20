'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  evaluateHollowingSceneState,
  getActMidpointTime,
  HOLLOWING_STORY_ACTS,
  type HollowingCameraPreset,
  type HollowingCutawayMode,
} from '../choreography';
import { FloatingStoryCallout } from '@/components/three/FloatingStoryCallout';
import { StagePlaybackDock } from '@/components/three/StagePlaybackDock';
import { StageStoryCaption } from '@/components/three/StageStoryCaption';
import { StageTopActions } from '@/components/three/StageTopActions';
import { StageWebGLFallback } from '@/components/three/StageWebGLFallback';
import { useCanvasPlayToggle } from '@/components/three/useCanvasPlayToggle';
import { ShieldAlert, Truck } from 'lucide-react';
import {
  BANK_CAMERA_PRESET_OPTIONS,
  BANK_SCENE_FALLBACK_HINT,
} from './bankSceneConstants';
import {
  useBankSceneEngine,
  type BankSceneSimState,
} from './useBankSceneEngine';

export interface ProcessHollowingBankSceneProps {
  /** Optional class override for outer frame */
  className?: string;
}

export function ProcessHollowingBankScene({
  className = '',
}: ProcessHollowingBankSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const bankTruckLabelRef = useRef<HTMLDivElement | null>(null);
  const hiddenIntruderLabelRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [timelinePct, setTimelinePct] = useState(6);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [cutawayMode, setCutawayMode] = useState<HollowingCutawayMode>('AUTO');
  const [cameraPreset, setCameraPreset] =
    useState<HollowingCameraPreset>('DIRECTOR');
  const [dockExpanded, setDockExpanded] = useState(true);
  const [isFullPage, setIsFullPage] = useState(false);
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [labelsEnabled, setLabelsEnabled] = useState(true);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [manualOrbitActive, setManualOrbitActive] = useState(false);

  const simRef = useRef<BankSceneSimState>({
    normalizedTime: 0.04,
    isPlaying: false,
    playbackSpeed: 1,
    cutawayMode: 'AUTO',
    cameraPreset: 'DIRECTOR',
    bloomEnabled: true,
    labelsEnabled: true,
    viewportWidth: 1200,
    viewportHeight: 640,
    manualOrbit: false,
    snapCamera: true,
    isDark: false,
    elapsed: 0,
    lastUiSyncMs: 0,
    lastActIndex: 0,
    requestRender: () => {},
  });

  useEffect(() => {
    simRef.current.isPlaying = isPlaying;
    simRef.current.requestRender();
  }, [isPlaying]);

  useEffect(() => {
    simRef.current.playbackSpeed = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    simRef.current.cutawayMode = cutawayMode;
    simRef.current.requestRender();
  }, [cutawayMode]);

  useEffect(() => {
    simRef.current.bloomEnabled = bloomEnabled;
    simRef.current.requestRender();
  }, [bloomEnabled]);

  useEffect(() => {
    simRef.current.labelsEnabled = labelsEnabled;
    simRef.current.requestRender();
  }, [labelsEnabled]);

  useEffect(() => {
    simRef.current.cameraPreset = cameraPreset;
    simRef.current.manualOrbit = false;
    simRef.current.snapCamera = true;
    simRef.current.requestRender();
  }, [cameraPreset]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullPage) {
        e.preventDefault();
        setIsFullPage(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (isFullPage && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setDockExpanded((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullPage]);

  useBankSceneEngine({
    canvasMountRef,
    bankTruckLabelRef,
    hiddenIntruderLabelRef,
    simRef,
    setIsPlaying,
    setTimelinePct,
    setActiveActIndex,
    setManualOrbitActive,
    setWebglError,
  });

  const handleSelectAct = useCallback((actIdx: number) => {
    const targetT = getActMidpointTime(actIdx);
    simRef.current.normalizedTime = targetT;
    simRef.current.manualOrbit = false;
    simRef.current.cameraPreset = 'DIRECTOR';
    simRef.current.snapCamera = true;
    setCameraPreset('DIRECTOR');
    setManualOrbitActive(false);
    setActiveActIndex(actIdx);
    setTimelinePct(Math.round(targetT * 100));
    simRef.current.requestRender();
  }, []);

  const handleScrub = useCallback((pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    const t = clamped / 100;
    simRef.current.normalizedTime = t;
    simRef.current.snapCamera = true;
    const st = evaluateHollowingSceneState(t);
    setTimelinePct(clamped);
    setActiveActIndex(st.activeActIndex);
    simRef.current.requestRender();
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (prev) return false;
      if (simRef.current.normalizedTime >= 0.999) {
        simRef.current.normalizedTime = 0.01;
        simRef.current.snapCamera = true;
        setActiveActIndex(0);
        setTimelinePct(1);
      }
      return true;
    });
  }, []);

  const handleToggleFullPage = useCallback(() => {
    setIsFullPage((prev) => !prev);
  }, []);

  useCanvasPlayToggle(canvasMountRef, handleTogglePlay, handleToggleFullPage);

  const handleRestart = useCallback(() => {
    simRef.current.normalizedTime = 0.01;
    simRef.current.manualOrbit = false;
    simRef.current.cameraPreset = 'DIRECTOR';
    simRef.current.snapCamera = true;
    setCameraPreset('DIRECTOR');
    setManualOrbitActive(false);
    setActiveActIndex(0);
    setTimelinePct(1);
    setIsPlaying(false);
    simRef.current.requestRender();
  }, []);

  const cycleCutawayMode = useCallback(() => {
    setCutawayMode((prev) =>
      prev === 'AUTO' ? 'OPEN' : prev === 'OPEN' ? 'SEALED' : 'AUTO'
    );
  }, []);

  const activeAct = HOLLOWING_STORY_ACTS[activeActIndex] || HOLLOWING_STORY_ACTS[0];

  return (
    <div
      ref={containerRef}
      data-testid="process-hollowing-3d-stage"
      data-active-act={activeAct.id}
      data-active-act-index={activeAct.index}
      data-is-playing={isPlaying ? 'true' : 'false'}
      data-cutaway-mode={cutawayMode}
      data-camera-preset={cameraPreset}
      data-is-fullpage={isFullPage ? 'true' : 'false'}
      data-bloom-enabled={bloomEnabled ? 'true' : 'false'}
      data-labels-enabled={labelsEnabled ? 'true' : 'false'}
      data-vfx-particles="302"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={
        isFullPage
          ? 'fixed inset-0 z-[95] w-screen h-screen p-2 bg-[#0B0F17] select-none'
          : `anime-3d-stage-frame w-full h-[calc(100vh-110px)] min-h-[600px] max-h-[860px] select-none ${className}`
      }
    >
      <div className="anime-3d-canvas-bezel relative w-full h-full bg-[#0B0F17]">
        <div
          ref={canvasMountRef}
          data-testid="hollowing-3d-canvas-toggle"
          aria-label={
            isPlaying
              ? 'Pause 3D animation. Double-click for full page.'
              : 'Play 3D animation. Double-click for full page.'
          }
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        <FloatingStoryCallout
          labelRef={bankTruckLabelRef}
          testId="hollowing-3d-label-bank-truck"
          title="Bank Truck"
          subtitle="Trusted Host · svchost.exe"
          tone="sky"
          icon={<Truck className="w-3.5 h-3.5" />}
          visible={labelsEnabled}
        />
        <FloatingStoryCallout
          labelRef={hiddenIntruderLabelRef}
          testId="hollowing-3d-label-hidden-intruder"
          title="Hidden Intruder"
          subtitle="Covert Payload · Beacon PE"
          tone="rose"
          icon={<ShieldAlert className="w-3.5 h-3.5" />}
          visible={labelsEnabled}
        />

        {webglError && (
          <StageWebGLFallback error={webglError} hint={BANK_SCENE_FALLBACK_HINT} />
        )}

        <StageStoryCaption
          testId="hollowing-3d-story-caption"
          accentHex={activeAct.accentHex}
          actLabel={`ACT 0${activeAct.index + 1} / 06`}
          stageTag={activeAct.stageTag}
          mitreCode={activeAct.mitreCode}
          title={activeAct.title}
          storyExcerpt={activeAct.storyExcerpt}
          technicalParallel={activeAct.technicalParallel}
        />

        <StageTopActions
          cutawayTestId="hollowing-3d-cutaway-btn"
          fullPageTestId="hollowing-3d-fullpage-btn"
          cutawayMode={cutawayMode}
          isFullPage={isFullPage}
          onCycleCutaway={cycleCutawayMode}
          onToggleFullPage={handleToggleFullPage}
        />

        <StagePlaybackDock
          dockTestId="hollowing-3d-bottom-dock"
          toggleTestId="hollowing-3d-dock-toggle-btn"
          playTestId="hollowing-3d-play-btn"
          restartTestId="hollowing-3d-restart-btn"
          timelineTestId="hollowing-3d-timeline-slider"
          timelineInputId="hollowing-3d-timeline-range"
          labelsTestId="hollowing-3d-labels-btn"
          bloomTestId="hollowing-3d-bloom-btn"
          dockExpanded={dockExpanded}
          onToggleDock={() => setDockExpanded((prev) => !prev)}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onRestart={handleRestart}
          tabs={HOLLOWING_STORY_ACTS.map((act) => ({
            id: act.id,
            label: act.shortLabel,
            selected: act.index === activeActIndex,
            testId: `hollowing-3d-act-btn-${act.index + 1}`,
            onSelect: () => handleSelectAct(act.index),
          }))}
          playbackSpeed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          timelinePct={timelinePct}
          onScrub={handleScrub}
          cameraPresets={BANK_CAMERA_PRESET_OPTIONS.map((preset) => ({
            id: preset.id,
            label:
              preset.id === 'DIRECTOR' && manualOrbitActive
                ? preset.reCenterLabel || 'Re-Center'
                : preset.label,
            active: cameraPreset === preset.id && !manualOrbitActive,
            testId: `hollowing-3d-cam-${preset.id.toLowerCase()}`,
            onSelect: () => {
              setCameraPreset(preset.id);
              simRef.current.cameraPreset = preset.id;
              simRef.current.manualOrbit = false;
              simRef.current.snapCamera = true;
              setManualOrbitActive(false);
              simRef.current.requestRender();
            },
          }))}
          labelsEnabled={labelsEnabled}
          onToggleLabels={() => setLabelsEnabled((prev) => !prev)}
          bloomEnabled={bloomEnabled}
          onToggleBloom={() => setBloomEnabled((prev) => !prev)}
        />
      </div>
    </div>
  );
}
