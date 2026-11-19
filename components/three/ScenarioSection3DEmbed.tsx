'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Play, Sparkles } from 'lucide-react';
import {
  ANIME_3D_STAGE_STANDARD,
  getSection3DDescriptor,
  type Section3DDescriptor,
  type Section3DKey,
} from '@/lib/section-3d-registry';
import {
  registerWebGLStage,
  reportWebGLStageVisibility,
  requestActivateWebGLStage,
  subscribeActiveWebGLStage,
} from '@/lib/webgl-stage-coordinator';

const ProcessHollowingBankScene = dynamic(
  () =>
    import('./ProcessHollowingBankScene').then(
      (mod) => mod.ProcessHollowingBankScene
    ),
  {
    ssr: false,
    loading: () => (
      <SceneLoadingPlaceholder label="Armored Bank Truck — Process Hollowing 3D Scene" />
    ),
  }
);

const AnimeSection3DStage = dynamic(
  () =>
    import('./AnimeSection3DStage').then((mod) => mod.AnimeSection3DStage),
  {
    ssr: false,
    loading: () => (
      <SceneLoadingPlaceholder label="Interactive Cel-Shaded Anime 3D Stage" />
    ),
  }
);

function SceneLoadingPlaceholder({ label }: { label: string }) {
  return (
    <div
      className={`anime-3d-stage-frame w-full ${ANIME_3D_STAGE_STANDARD.viewportHeightClasses}`}
    >
      <div className="anime-3d-canvas-bezel w-full h-full bg-[#0B0F17] flex flex-col items-center justify-center gap-3 text-slate-200 p-6">
        <div className="px-3 py-1 rounded-md bg-sky-400 text-slate-950 font-mono text-xs font-extrabold">
          THREE.JS · ANIME 3D STAGE
        </div>
        <div className="text-sm font-bold text-white text-center">
          Loading {label}...
        </div>
      </div>
    </div>
  );
}

function StandbyAnimePreviewCard({
  descriptor,
  onActivate,
}: {
  descriptor: Section3DDescriptor;
  onActivate: () => void;
}) {
  const firstPhase = descriptor.phases[0];
  return (
    <div
      data-testid={`section-3d-standby-${descriptor.sectionKey}`}
      className={`anime-3d-stage-frame w-full ${ANIME_3D_STAGE_STANDARD.viewportHeightClasses} select-none`}
    >
      <div className="anime-3d-canvas-bezel relative w-full h-full bg-gradient-to-br from-sky-100 via-sky-200/80 to-indigo-100 dark:from-[#0B1024] dark:via-[#111827] dark:to-[#1E1B4B] p-6 flex flex-col items-center justify-center text-center gap-5">
        {/* Overview-Standard Manga Preview Card (Story first, Technical right below) */}
        <div className="max-w-xl w-full rounded-xl bg-white/95 dark:bg-slate-950/94 border-2 border-slate-900 dark:border-slate-700 shadow-[4px_4px_0px_#0F172A] px-5 py-4 text-left space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono font-bold">
            <span
              style={{ backgroundColor: descriptor.accentHex }}
              className="px-2 py-0.5 rounded text-slate-950 font-extrabold"
            >
              {descriptor.stageBadge}
            </span>
            <span className="text-rose-600 dark:text-rose-400">
              {descriptor.mitreId}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-black tracking-tight text-slate-950 dark:text-white leading-snug">
            {descriptor.title}
          </h4>

          {/* Story FIRST */}
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            &ldquo;{firstPhase?.storyExcerpt || descriptor.storyCue}&rdquo;
          </p>

          {/* Technical RIGHT BELOW */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-indigo-700 dark:text-sky-300 leading-relaxed">
            {firstPhase?.technicalParallel || descriptor.technicalCue}
          </div>
        </div>

        {/* Component Labels Preview */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10.5px] font-mono">
          {descriptor.callouts.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/88 border border-sky-400/50 text-white shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-sky-300" />
              <span className="font-bold">{c.title}</span>
              <span className="text-sky-200/90">· {c.subtitle}</span>
            </span>
          ))}
        </div>

        {/* Overview-Standard Neo-Brutalist Amber Launch Button */}
        <button
          type="button"
          data-testid={`activate-3d-stage-${descriptor.sectionKey}`}
          onClick={(e) => {
            e.stopPropagation();
            onActivate();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-extrabold shadow-[3px_3px_0px_#0F172A] transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Interactive Three.js 3D Scene</span>
          <Box className="w-3.5 h-3.5" />
        </button>

        <div className="text-[10.5px] font-mono text-slate-600 dark:text-slate-400">
          Auto-activates when scrolled into view · Cutaway · 4 Camera Angles ·
          Timeline Scrubber · Bloom &amp; Labels
        </div>
      </div>
    </div>
  );
}

interface ScenarioSection3DEmbedProps {
  scenarioId: string;
  sectionKey: Section3DKey;
  className?: string;
}

export function ScenarioSection3DEmbed({
  scenarioId,
  sectionKey,
  className = '',
}: ScenarioSection3DEmbedProps) {
  const descriptor = getSection3DDescriptor(scenarioId, sectionKey);
  const instanceId = useId();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!descriptor) return;
    const unregister = registerWebGLStage(instanceId);
    const unsubscribe = subscribeActiveWebGLStage(setActiveId);

    const el = wrapperRef.current;
    let observer: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            reportWebGLStageVisibility(
              instanceId,
              entry.isIntersecting ? entry.intersectionRatio : 0
            );
          }
        },
        {
          threshold: [0, 0.1, 0.25, 0.45, 0.65, 0.85, 1],
        }
      );
      observer.observe(el);
    } else {
      reportWebGLStageVisibility(instanceId, 0.5);
    }

    return () => {
      observer?.disconnect();
      unsubscribe();
      unregister();
    };
  }, [descriptor, instanceId]);

  if (!descriptor) return null;

  const isActive = activeId === instanceId;

  return (
    <div
      ref={wrapperRef}
      data-testid={`scenario-section-3d-embed-${sectionKey}`}
      data-webgl-active={isActive ? 'true' : 'false'}
      onClick={(e) => e.stopPropagation()}
      className={`w-full ${className}`}
    >
      {isActive ? (
        descriptor.sceneKind === 'bank-truck-briefing' ? (
          <ProcessHollowingBankScene />
        ) : (
          <AnimeSection3DStage descriptor={descriptor} />
        )
      ) : (
        <StandbyAnimePreviewCard
          descriptor={descriptor}
          onActivate={() => requestActivateWebGLStage(instanceId)}
        />
      )}
    </div>
  );
}
