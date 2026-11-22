'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Tag,
} from 'lucide-react';
import { ANIME_3D_STAGE_STANDARD } from '@/lib/section-3d-registry';
import { useCanvasPlayToggle } from '@/components/three/useCanvasPlayToggle';

export type ClipBeat = {
  id: number;
  tag: string;
  title: string;
  story: string;
  technical: string;
};

export type ClipCamera = {
  id: string;
  transform: string;
};

export type ClipTimelineApi = {
  root: HTMLElement;
  q: gsap.utils.SelectorFunc;
  setBeat: (id: number) => void;
};

type AnimeClipStageProps = {
  testId: string;
  stageLabel: string;
  mitreId: string;
  beats: ClipBeat[];
  cameras: ClipCamera[];
  build: (api: ClipTimelineApi) => gsap.core.Timeline;
  children: React.ReactNode;
};

export function AnimeClipStage({
  testId,
  stageLabel,
  mitreId,
  beats,
  cameras,
  build,
  children,
}: AnimeClipStageProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const filmRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const buildRef = useRef(build);
  const beatsRef = useRef(beats);
  const userPausedRef = useRef(false);
  const speedRef = useRef(1);
  buildRef.current = build;
  beatsRef.current = beats;

  const [playing, setPlaying] = useState(true);
  const [beat, setBeat] = useState(beats[0]?.id ?? 0);
  const [progressPct, setProgressPct] = useState(0);
  const [dockOpen, setDockOpen] = useState(true);
  const [fullPage, setFullPage] = useState(false);
  const [speed, setSpeed] = useState<(typeof ANIME_3D_STAGE_STANDARD.speedMultipliers)[number]>(1);
  const [labelsOn, setLabelsOn] = useState(true);
  const [bloomOn, setBloomOn] = useState(true);
  const [cutaway, setCutaway] = useState<(typeof ANIME_3D_STAGE_STANDARD.cutawayModes)[number]>('AUTO');
  const [camera, setCamera] = useState(cameras[0]?.id ?? 'WIDE');
  speedRef.current = speed;

  const sync = useCallback((tl: gsap.core.Timeline) => {
    const time = tl.time();
    let current = beatsRef.current[0]?.id ?? 0;
    for (const item of beatsRef.current) {
      const at = tl.labels[`beat${item.id}`];
      if (typeof at === 'number' && time + 0.001 >= at) current = item.id;
    }
    setBeat((prev) => (prev === current ? prev : current));
    const next = Math.min(100, Math.round(tl.progress() * 100));
    setProgressPct((prev) => (prev === next ? prev : next));
  }, []);

  const make = useCallback(() => {
    const root = rootRef.current;
    if (!root) return null;
    const tl = buildRef.current({
      root,
      q: gsap.utils.selector(root),
      setBeat: (id) => setBeat(id),
    });
    tl.eventCallback('onUpdate', () => sync(tl));
    tl.timeScale(speedRef.current);
    return tl;
  }, [sync]);

  useEffect(() => {
    const tl = make();
    if (!tl) return;
    tlRef.current = tl;
    if (!userPausedRef.current) tl.play(0);
    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [make]);

  useEffect(() => {
    tlRef.current?.timeScale(speed);
  }, [speed]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const tl = tlRef.current;
        if (!tl || userPausedRef.current) return;
        if (entry.isIntersecting) {
          tl.play();
          setPlaying(true);
        } else {
          tl.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!fullPage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullPage(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullPage]);

  const togglePlay = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (tl.paused()) {
      userPausedRef.current = false;
      tl.play();
      setPlaying(true);
    } else {
      userPausedRef.current = true;
      tl.pause();
      setPlaying(false);
    }
  }, []);

  const toggleFullPage = useCallback(() => {
    setFullPage((value) => !value);
  }, []);

  useCanvasPlayToggle(filmRef, togglePlay, toggleFullPage);

  const replay = () => {
    tlRef.current?.kill();
    const tl = make();
    if (!tl) return;
    tlRef.current = tl;
    userPausedRef.current = false;
    tl.play(0);
    setPlaying(true);
    setBeat(beats[0]?.id ?? 0);
    setProgressPct(0);
  };

  const jumpBeat = (id: number) => {
    const tl = tlRef.current;
    if (!tl) return;
    userPausedRef.current = true;
    tl.seek(`beat${id}`);
    tl.pause();
    setPlaying(false);
    setBeat(id);
    setProgressPct(Math.min(100, Math.round(tl.progress() * 100)));
  };

  const scrub = (pct: number) => {
    const tl = tlRef.current;
    if (!tl) return;
    userPausedRef.current = true;
    tl.pause();
    tl.progress(pct / 100);
    setPlaying(false);
    sync(tl);
  };

  const cycleCutaway = () => {
    setCutaway((prev) => (prev === 'AUTO' ? 'OPEN' : prev === 'OPEN' ? 'SEALED' : 'AUTO'));
  };

  const current = beats.find((item) => item.id === beat) ?? beats[0];
  const cameraTransform = cameras.find((item) => item.id === camera)?.transform ?? 'scale(1)';

  if (!current) return null;

  return (
    <div
      data-testid={testId}
      data-is-playing={playing ? 'true' : 'false'}
      data-cutaway-mode={cutaway}
      className={
        fullPage
          ? 'fixed inset-0 z-[95] h-screen w-screen select-none bg-[#0B0F17] p-2'
          : `anime-3d-stage-frame w-full select-none ${ANIME_3D_STAGE_STANDARD.viewportHeightClasses}`
      }
    >
      <div
        ref={rootRef}
        className={`anime-3d-canvas-bezel flex h-full w-full flex-col bg-[#0B0F17] ${
          labelsOn ? '' : 'labels-off'
        } ${bloomOn ? 'bloom-on' : ''} ${cutaway === 'SEALED' ? 'cutaway-sealed' : ''} ${
          cutaway === 'OPEN' ? 'cutaway-open' : ''
        }`}
      >
        <div className="z-20 flex shrink-0 items-start justify-between gap-3 px-3 pb-2 pt-3">
          <div className="pointer-events-auto min-w-0 flex-1 space-y-1 rounded-xl border-2 border-slate-900 bg-white/95 px-3 py-2 text-left shadow-[3px_3px_0px_#0F172A] dark:border-slate-700 dark:bg-slate-950/94">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] font-bold">
              <span className="rounded bg-amber-400 px-1.5 py-0.5 font-extrabold text-slate-950">
                ACT 0{current.id + 1} / 0{beats.length}
              </span>
              <span className="text-slate-600 dark:text-slate-300">{stageLabel}</span>
              <span aria-hidden="true" className="text-slate-400">
                ·
              </span>
              <span className="text-rose-600 dark:text-rose-400">{mitreId}</span>
            </div>
            <h3 className="text-xs font-black leading-snug tracking-tight text-slate-950 dark:text-white sm:text-sm">
              {current.title}
            </h3>
            <p className="text-[11.5px] font-medium leading-snug text-slate-800 dark:text-slate-200">
              &ldquo;{current.story}&rdquo;
            </p>
            <div className="border-t border-slate-200 pt-1 font-mono text-[10.5px] leading-snug text-indigo-700 dark:border-slate-800 dark:text-sky-300">
              {current.technical}
            </div>
          </div>
          <div className="pointer-events-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={cycleCutaway}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-slate-900 px-3 py-1.5 font-mono text-[11px] font-bold shadow-[2px_2px_0px_#0F172A] dark:border-slate-600 ${
                cutaway === 'OPEN'
                  ? 'bg-rose-600 text-white'
                  : cutaway === 'SEALED'
                    ? 'bg-slate-800 text-slate-100'
                    : 'bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100'
              }`}
            >
              <Eye className="h-3.5 w-3.5 shrink-0" />
              <span>Cutaway: {cutaway}</span>
            </button>
            <button
              type="button"
              onClick={toggleFullPage}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-slate-900 bg-amber-400 px-3 py-1.5 font-mono text-[11px] font-extrabold text-slate-950 shadow-[2px_2px_0px_#0F172A] dark:border-slate-600"
            >
              {fullPage ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span>{fullPage ? 'Exit Full Page' : 'Full Page'}</span>
            </button>
          </div>
        </div>

        <div
          ref={filmRef}
          data-testid={`${testId}-film`}
          role="button"
          tabIndex={0}
          aria-label={
            playing
              ? 'Pause the film. Double-click for full page.'
              : 'Play the film. Double-click for full page.'
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              togglePlay();
            }
          }}
          className="relative min-h-0 flex-1 cursor-pointer overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              transform: cameraTransform,
              transformOrigin: 'center',
              transition: 'transform 0.45s ease',
            }}
          >
            {children}
          </div>
        </div>

        <div className="z-20 flex shrink-0 flex-col items-center px-3 pb-3 pt-1">
          <button
            type="button"
            onClick={() => setDockOpen((value) => !value)}
            className="pointer-events-auto mb-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-t-lg rounded-b-md border border-slate-700 bg-slate-950/92 px-3 py-1 font-mono text-[10.5px] font-bold text-slate-100"
          >
            {dockOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            <span>{dockOpen ? 'Hide Controls' : 'Show Controls'}</span>
          </button>
          {dockOpen && (
            <div className="pointer-events-auto w-full max-w-[960px] space-y-2 rounded-xl border-2 border-slate-900 bg-white/95 px-3.5 py-2.5 shadow-[4px_4px_0px_#0F172A] dark:border-slate-700 dark:bg-slate-950/94">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 font-mono text-[11px] font-extrabold ${
                      playing
                        ? 'border-slate-900 bg-amber-400 text-slate-950'
                        : 'border-rose-800 bg-rose-600 text-white'
                    }`}
                  >
                    {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    <span>{playing ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={replay}
                    aria-label="Restart animation from Act 1"
                    className="inline-flex cursor-pointer rounded-lg border border-slate-300 bg-slate-100 p-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Story Acts">
                  {beats.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={beat === item.id}
                      onClick={() => jumpBeat(item.id)}
                      className={`shrink-0 cursor-pointer whitespace-nowrap rounded-md px-2 py-1 font-mono text-[10.5px] font-bold ${
                        beat === item.id
                          ? 'bg-slate-950 text-white dark:bg-sky-400 dark:text-slate-950'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800/90 dark:text-slate-300'
                      }`}
                    >
                      {item.tag}
                    </button>
                  ))}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {ANIME_3D_STAGE_STANDARD.speedMultipliers.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSpeed(value)}
                      className={`cursor-pointer rounded px-1.5 py-1 font-mono text-[10px] font-bold tabular-nums ${
                        speed === value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {value}x
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-1 dark:border-slate-800">
                <div className="flex min-w-[180px] flex-1 items-center gap-2">
                  <span className="shrink-0 font-mono text-[10px] font-bold tabular-nums text-slate-500">
                    {progressPct}%
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={progressPct}
                    onChange={(event) => scrub(Number(event.target.value))}
                    aria-label="Scrub animation timeline"
                    className="h-1.5 w-full cursor-pointer accent-rose-600"
                  />
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1">
                  {cameras.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setCamera(preset.id)}
                      className={`cursor-pointer whitespace-nowrap rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                        camera === preset.id
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {preset.id}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLabelsOn((value) => !value)}
                    className={`ml-1 inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                      labelsOn
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    Labels {labelsOn ? 'ON' : 'OFF'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBloomOn((value) => !value)}
                    className={`inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                      bloomOn
                        ? 'bg-fuchsia-600 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    Bloom {bloomOn ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
