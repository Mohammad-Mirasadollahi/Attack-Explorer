'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Play, Sparkles } from 'lucide-react';
import {
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
    loading: () => <SceneLoadingPlaceholder label="Armored Bank Truck — Process Hollowing 3D Scene" />,
  }
);

const AnimeSection3DStage = dynamic(
  () =>
    import('./AnimeSection3DStage').then((mod) => mod.AnimeSection3DStage),
  {
    ssr: false,
    loading: () => <SceneLoadingPlaceholder label="Interactive Cel-Shaded Anime 3D Diorama" />,
  }
);

function SceneLoadingPlaceholder({ label }: { label: string }) {
  return (
    <div className="anime-3d-stage-frame w-full h-[520px] sm:h-[580px]">
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
  const isBriefing = descriptor.sceneKind === 'bank-truck-briefing';
  return (
    <div
      data-testid={`section-3d-standby-${descriptor.sectionKey}`}
      className={`anime-3d-stage-frame w-full ${
        isBriefing
          ? 'h-[calc(100vh-110px)] min-h-[600px] max-h-[860px]'
          : 'h-[520px] sm:h-[580px]'
      }`}
    >
      <div className="anime-3d-canvas-bezel relative w-full h-full bg-gradient-to-br from-[#0B1024] via-[#111827] to-[#1E1B4B] p-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-sky-400 text-slate-950 font-mono text-[10.5px] font-extrabold">
            {descriptor.mitreId}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-sky-400/40 text-sky-300 font-mono text-[10.5px] font-bold">
            {descriptor.stageBadge}
          </span>
        </div>

        <div className="max-w-xl space-y-2">
          <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug">
            {descriptor.title}
          </h4>
          <p className="text-xs text-amber-200/95 leading-relaxed">
            <strong className="font-mono text-amber-400">STORY:</strong>{' '}
            {descriptor.storyCue}
          </p>
          <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
            <strong className="text-sky-400">TECH:</strong>{' '}
            {descriptor.technicalCue}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[10.5px] font-mono text-slate-300">
          {descriptor.callouts.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-slate-700"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span className="font-bold text-white">{c.title}</span>
              <span className="text-slate-400">· {c.subtitle}</span>
            </span>
          ))}
        </div>

        <button
          type="button"
          data-testid={`activate-3d-stage-${descriptor.sectionKey}`}
          onClick={(e) => {
            e.stopPropagation();
            onActivate();
          }}
          className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-mono text-xs font-extrabold shadow-lg transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Interactive Three.js 3D Scene</span>
          <Box className="w-3.5 h-3.5" />
        </button>

        <div className="text-[10px] font-mono text-slate-400">
          Auto-activates when scrolled into view · Single active WebGL slot protects GPU memory
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
      // Fallback if IntersectionObserver unavailable
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
