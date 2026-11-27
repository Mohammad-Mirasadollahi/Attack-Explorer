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
  'xz-utils-cve-2024-3094-backdoor': () =>
    import('./xz-utils-cve-2024-3094-backdoor/three').then(
      (mod) => mod.buildBespokeXzSectionScene as BespokeSectionSceneFactory
    ),
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': () =>
    import('./dfir-lsass-minidump-comsvcs-sysmon-eid10/three').then(
      (mod) => mod.buildBespokeLsassSectionScene as BespokeSectionSceneFactory
    ),
  'ad-kerberoasting': () =>
    import('./ad-kerberoasting/three').then(
      (mod) => mod.buildBespokeKerbSectionScene as BespokeSectionSceneFactory
    ),
  'zerologon-netlogon-cve-2020-1472': () =>
    import('./zerologon-netlogon-cve-2020-1472/three').then(
      (mod) => mod.buildBespokeZerologonSectionScene as BespokeSectionSceneFactory
    ),
  'dfir-dcsync-drsuapi-replication-eid4662': () =>
    import('./dfir-dcsync-drsuapi-replication-eid4662/three').then(
      (mod) => mod.buildBespokeDcsyncSectionScene as BespokeSectionSceneFactory
    ),
  'log4shell-dfir': () =>
    import('./log4shell-dfir/three').then(
      (mod) => mod.buildBespokeLog4shellSectionScene as BespokeSectionSceneFactory
    ),
  'dns-tunneling-exfil': () =>
    import('./dns-tunneling-exfil/three').then(
      (mod) => mod.buildBespokeDnsTunnelSectionScene as BespokeSectionSceneFactory
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
