import type { ComponentType } from 'react';

/**
 * Lazy 3D entry points. Add a scenario here only when it has a `three/` package.
 * Overview scenes load the scenario component. Section scenes share one factory.
 * Importers must use these loaders so Three.js stays out of the domain barrel.
 */
export type BespokeSectionSceneFactory =
  typeof import('./process-hollowing/three/step-scene-builders').buildBespokeSectionScene;

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

export function loadBespokeSectionSceneFactory(): Promise<BespokeSectionSceneFactory> {
  return import('./process-hollowing/three/step-scene-builders').then(
    (mod) => mod.buildBespokeSectionScene
  );
}
