import type {
  Anime3DSceneKind,
} from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { buildDcsyncBriefingMintScene } from './briefing-mint-scene';
import { buildDcsyncStep1Scene } from './step-1-scene';
import { buildDcsyncStep2Scene } from './step-2-scene';
import { buildDcsyncStep3Scene } from './step-3-scene';
import { buildDcsyncStep4Scene } from './step-4-scene';
import { buildDcsyncMemoryDiffScene } from './memory-diff-scene';

export function buildBespokeDcsyncSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'dcsync-mint-briefing':
      return buildDcsyncBriefingMintScene(isSoftwareGl);
    case 'dcsync-step1-acl':
      return buildDcsyncStep1Scene(materials, isSoftwareGl);
    case 'dcsync-step2-drsr':
      return buildDcsyncStep2Scene(materials, isSoftwareGl);
    case 'dcsync-step3-eid4662':
      return buildDcsyncStep3Scene(materials, isSoftwareGl);
    case 'dcsync-step4-krbtgt':
      return buildDcsyncStep4Scene(materials, isSoftwareGl);
    case 'dcsync-memory-acldiff':
      return buildDcsyncMemoryDiffScene(materials, isSoftwareGl);
    default:
      return buildDcsyncBriefingMintScene(isSoftwareGl);
  }
}
