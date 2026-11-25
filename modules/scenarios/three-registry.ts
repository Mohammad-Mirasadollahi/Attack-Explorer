import type { ComponentType } from 'react';
import type { Anime3DSceneKind } from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './process-hollowing/three/step-scene-builders';

/**
 * Lazy 3D entry points. Overview scenes load the scenario component.
 * Section scenes lazy-load only the matching world builder group so Three.js
 * stays out of the domain barrel and bundle chunks stay small.
 */
export type BespokeSectionSceneFactory = (
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
) => BespokeSection3DScene;

export type MalwareWorldGroup =
  | 'process-hollowing'
  | 'inmemory-evasion'
  | 'supplychain-hijack'
  | 'kernel-firmware'
  | 'persistence-services'
  | 'credential-linux'
  | 'dfir-artifacts';

const SCENARIO_WORLD_GROUP_MAP: Record<string, MalwareWorldGroup> = {
  'process-hollowing': 'process-hollowing',
  'amsi-reflective-dll': 'inmemory-evasion',
  'ransomware-shadow-wipe': 'inmemory-evasion',
  'elastic-apt41-dustpan-stealthvector': 'inmemory-evasion',
  'elastic-grimresource-msc': 'inmemory-evasion',
  'elastic-lotus-blossom-chrysalis': 'inmemory-evasion',
  '3cx-desktopapp-supply-chain-lazarus': 'supplychain-hijack',
  'kaspersky-toddycat-eset-dll': 'supplychain-hijack',
  'xz-utils-cve-2024-3094-backdoor': 'supplychain-hijack',
  'macos-gatekeeper-achilles-cve-2022-42821': 'supplychain-hijack',
  'pikered-clr-profiler-trusted-binary-loader-chain': 'supplychain-hijack',
  'kaspersky-lazarus-byovd-fudmodule': 'kernel-firmware',
  'kaspersky-operation-triangulation': 'kernel-firmware',
  'ms-salt-typhoon-telecom': 'kernel-firmware',
  'talos-fortinet-coathanger-apt': 'kernel-firmware',
  'windows-clfs-ransomware-cve-2023-28252-nokoyawa': 'kernel-firmware',
  'ms-forest-blizzard-gooseegg': 'persistence-services',
  'dfir-bitsadmin-qmgr-persistence-bits-client': 'persistence-services',
  'dfir-printspooler-spl-shd-spool-file-persistence': 'persistence-services',
  'dfir-schtasks-xml-registry-taskcache-forensics': 'persistence-services',
  'dfir-wmi-event-subscription-persistence-sysmon': 'persistence-services',
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': 'credential-linux',
  'dfir-wer-silentprocessexit-localdumps-registry-hijack': 'credential-linux',
  'dfir-linux-auditd-pam-sshd-authorized-keys-persistence': 'credential-linux',
  'dfir-linux-systemd-generator-cron-udev-persistence': 'credential-linux',
  'dfir-powershell-eid4104-4103-clm-downgrade-forensics': 'credential-linux',
  'dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2': 'dfir-artifacts',
  'dfir-shimcache-amcache-execution-artifact-triage': 'dfir-artifacts',
  'dfir-vhd-iso-motw-bypass-zone-identifier-forensics': 'dfir-artifacts',
  'dfir-windows-prefetch-srum-network-execution-trace': 'dfir-artifacts',
};

export function resolveMalwareWorldGroup(
  scenarioId?: string
): MalwareWorldGroup {
  if (!scenarioId) return 'process-hollowing';
  return SCENARIO_WORLD_GROUP_MAP[scenarioId] ?? 'process-hollowing';
}

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

export function loadBespokeSectionSceneFactory(
  scenarioId?: string
): Promise<BespokeSectionSceneFactory> {
  const group = resolveMalwareWorldGroup(scenarioId);

  if (group === 'inmemory-evasion') {
    return import('@/components/three/scenes/malware-inmemory-evasion-worlds').then(
      (mod) => (sceneKind, materials) => {
        const built = mod.buildInMemoryEvasionScene(sceneKind, materials);
        if (!built) throw new Error(`Unknown in-memory evasion 3D sceneKind: ${sceneKind}`);
        return built;
      }
    );
  }
  if (group === 'supplychain-hijack') {
    return import('@/components/three/scenes/malware-supplychain-hijack-worlds').then(
      (mod) => (sceneKind, materials) => {
        const built = mod.buildSupplyChainHijackScene(sceneKind, materials);
        if (!built) throw new Error(`Unknown supply-chain 3D sceneKind: ${sceneKind}`);
        return built;
      }
    );
  }
  if (group === 'kernel-firmware') {
    return import('@/components/three/scenes/malware-kernel-firmware-worlds').then(
      (mod) => (sceneKind, materials) => {
        const built = mod.buildKernelFirmwareScene(sceneKind, materials);
        if (!built) throw new Error(`Unknown kernel/firmware 3D sceneKind: ${sceneKind}`);
        return built;
      }
    );
  }
  if (group === 'persistence-services') {
    return import('@/components/three/scenes/malware-persistence-services-worlds').then(
      (mod) => (sceneKind, materials) => {
        const built = mod.buildPersistenceServicesScene(sceneKind, materials);
        if (!built) throw new Error(`Unknown persistence 3D sceneKind: ${sceneKind}`);
        return built;
      }
    );
  }
  if (group === 'credential-linux') {
    return import('@/components/three/scenes/malware-credential-linux-worlds').then(
      (mod) => (sceneKind, materials) => {
        const built = mod.buildCredentialLinuxScene(sceneKind, materials);
        if (!built) throw new Error(`Unknown credential/linux 3D sceneKind: ${sceneKind}`);
        return built;
      }
    );
  }
  if (group === 'dfir-artifacts') {
    return import('@/components/three/scenes/malware-dfir-artifacts-worlds').then(
      (mod) => (sceneKind, materials) => {
        const built = mod.buildDfirArtifactsScene(sceneKind, materials);
        if (!built) throw new Error(`Unknown DFIR artifacts 3D sceneKind: ${sceneKind}`);
        return built;
      }
    );
  }

  return import('./process-hollowing/three/step-scene-builders').then(
    (mod) => mod.buildBespokeSectionScene as BespokeSectionSceneFactory
  );
}
