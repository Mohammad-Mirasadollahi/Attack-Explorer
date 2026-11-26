'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Play } from 'lucide-react';
import {
  ANIME_3D_STAGE_STANDARD,
  type Section3DKey,
} from '@/lib/section-3d-registry';
import { hasTechnicalClip } from '@/lib/section-technical-clip-registry';
import { useHeavyMediaSlot } from '@/components/media/useHeavyMediaSlot';

function ClipLoading() {
  return (
    <div
      className="flex aspect-[16/10] w-full items-center justify-center rounded-xl border-2 border-indigo-900/80 bg-[#0f172a]"
      data-testid="technical-clip-loading"
    >
      <div className="font-mono text-sm text-indigo-200">Loading technical clip…</div>
    </div>
  );
}

const PROCESS_HOLLOWING_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(() => import('./clips/Step1SuspendClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'step-2': dynamic(() => import('./clips/Step2UnmapClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'step-3': dynamic(() => import('./clips/Step3AllocInjectClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'step-4': dynamic(() => import('./clips/Step4ContextClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'step-5': dynamic(() => import('./clips/Step5BeaconClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'memory-forensics': dynamic(() => import('./clips/MemoryDiffClip'), { ssr: false, loading: () => <ClipLoading /> }),
};

const AMSI_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiStep1LookupClip').then(
        (m) => m.AmsiStep1LookupClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiStep2VirtualProtectClip').then(
        (m) => m.AmsiStep2VirtualProtectClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiStep3PatchPrologueClip').then(
        (m) => m.AmsiStep3PatchPrologueClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiStep4ReflectiveLoadClip').then(
        (m) => m.AmsiStep4ReflectiveLoadClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiMemoryDiffClip').then(
        (m) => m.AmsiMemoryDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const SCENARIO_TECHNICAL_CLIPS_BY_ID: Record<
  string,
  Partial<Record<Section3DKey, React.ComponentType>>
> = {
  'process-hollowing': PROCESS_HOLLOWING_CLIP_BY_SECTION,
  'amsi-reflective-dll': AMSI_CLIP_BY_SECTION,
};

export interface TechnicalClipEmbedProps {
  scenarioId: string;
  sectionKey: Section3DKey;
  className?: string;
}

/**
 * Cinematic SVG+GSAP teaching clip surface.
 * Not the Excalidraw whiteboard — keep these products separate.
 */
export function TechnicalClipEmbed({
  scenarioId,
  sectionKey,
  className = '',
}: TechnicalClipEmbedProps) {
  const { ref, active, activate } = useHeavyMediaSlot('clip');
  if (!hasTechnicalClip(scenarioId, sectionKey)) return null;

  const ClipComponent = SCENARIO_TECHNICAL_CLIPS_BY_ID[scenarioId]?.[sectionKey];
  if (!ClipComponent) return null;

  return (
    <div
      ref={ref}
      className={className}
      data-testid={`technical-clip-embed-${sectionKey}`}
      data-clip-active={active ? 'true' : 'false'}
    >
      {active ? (
        <ClipComponent />
      ) : (
        <button
          type="button"
          onClick={activate}
          className={`anime-3d-stage-frame flex w-full cursor-pointer items-center justify-center bg-[#0B0F17] ${ANIME_3D_STAGE_STANDARD.viewportHeightClasses}`}
        >
          <span className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-700 bg-amber-400 px-4 py-2 font-mono text-xs font-extrabold text-slate-950">
            <Play className="h-3.5 w-3.5 fill-current" />
            Play technical clip
          </span>
        </button>
      )}
    </div>
  );
}
