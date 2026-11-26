import type { ComponentType } from 'react';
import type { Anime3DSceneKind } from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './process-hollowing/three/step-scene-builders';

/**
 * Lazy 3D entry points for bespoke scenario packages (MOD-17).
 * Overview scenes load the scenario's bespoke Overview component.
 * Section scenes lazy-load the scenario's own bespoke step-scene-builders module
 * so Three.js stays out of the domain barrel and bundle chunks stay small.
 */
export type BespokeSectionSceneFactory = (
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
) => BespokeSection3DScene;

export const SCENARIO_OVERVIEW_SCENE_KINDS: Record<string, string> = {
  'process-hollowing': 'bank-truck-briefing',
};

export const SCENARIO_OVERVIEW_3D_LOADERS: Record<
  string,
  () => Promise<ComponentType>
> = {
  'process-hollowing': () =>
    import('./process-hollowing/three/BankScene').then(
      (mod) => mod.ProcessHollowingBankScene
    ),
};

const BESPOKE_SECTION_SCENE_LOADERS: Record<
  string,
  () => Promise<BespokeSectionSceneFactory>
> = {
  'process-hollowing': () =>
    import('./process-hollowing/three/step-scene-builders').then(
      (mod) => mod.buildBespokeSectionScene as BespokeSectionSceneFactory
    ),
  'amsi-reflective-dll': () =>
    import('./amsi-reflective-dll/three').then(
      (mod) => mod.buildBespokeAmsiSectionScene as BespokeSectionSceneFactory
    ),
  'ransomware-shadow-wipe': () =>
    import('./ransomware-shadow-wipe/three').then(
      (mod) => mod.buildBespokeLockbitSectionScene as BespokeSectionSceneFactory
    ),
  '3cx-desktopapp-supply-chain-lazarus': () =>
    import('./3cx-desktopapp-supply-chain-lazarus/three').then(
      (mod) => mod.buildBespokeThreeCxSectionScene as BespokeSectionSceneFactory
    ),
};

export function loadBespokeSectionSceneFactory(
  scenarioId?: string
): Promise<BespokeSectionSceneFactory> {
  const loader =
    (scenarioId && BESPOKE_SECTION_SCENE_LOADERS[scenarioId]) ||
    BESPOKE_SECTION_SCENE_LOADERS['process-hollowing'];
  return loader();
}
