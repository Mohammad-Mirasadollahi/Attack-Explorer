import type { Section3DKey } from '@/lib/section-3d-registry';
import { MALWARE_TECHNICAL_CLIP_FLAGS } from '@/lib/malware-2d-blueprints';

/**
 * SVG + GSAP teaching clips — separate from Excalidraw whiteboards.
 * Which sections qualify, and how a clip decides its drawings, is MOD-14
 * (`docs/standards/14-technical-clip-silent-lecture-standard.md`).
 * Do not register `briefing`. Register `memory-forensics` when the claim is a visual difference.
 */
const SCENARIO_TECHNICAL_CLIPS: Record<
  string,
  Partial<Record<Section3DKey, true>>
> = {
  'process-hollowing': {
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': true,
    'step-5': true,
    'memory-forensics': true,
  },
  ...MALWARE_TECHNICAL_CLIP_FLAGS,
};

export function hasTechnicalClip(
  scenarioId: string,
  sectionKey: Section3DKey
): boolean {
  return Boolean(SCENARIO_TECHNICAL_CLIPS[scenarioId]?.[sectionKey]);
}
