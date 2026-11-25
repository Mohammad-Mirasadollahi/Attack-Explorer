import type { Section3DKey } from '@/lib/section-3d-registry';
import type { TechnicalBoardDescriptor } from '@/lib/excalidraw-boards/board-primitives';
import type { MalwareTechnicalClipSpec } from '@/components/technical-clip/malware-clips/types';
import { compileProfileGroup } from '@/lib/malware-2d-blueprints/compiler';
import { NETWORK_WEB_2D_PROFILES } from './network-web';
import { ACTIVE_DIRECTORY_2D_PROFILES } from './active-directory';
import { CLOUD_SAAS_2D_PROFILES } from './cloud-saas';
import { RANSOMWARE_EXTORTION_2D_PROFILES } from './ransomware-extortion';
import { AI_MLOPS_2D_PROFILES } from './ai-mlops';
import { ZERO_DAY_APPLIANCES_2D_PROFILES } from './zero-day-appliances';
import { KERNEL_FIRMWARE_2D_PROFILES } from './kernel-firmware-byovd';
import { SUPPLY_CHAIN_CICD_2D_PROFILES } from './supply-chain-cicd';
import { CONTAINERS_KUBERNETES_2D_PROFILES } from './containers-kubernetes';
import { DATABASE_PLATFORMS_2D_PROFILES } from './database-platforms';
import { ICS_OT_SCADA_2D_PROFILES } from './ics-ot-scada';
import { MOBILE_TELECOM_2D_PROFILES } from './mobile-telecom';

export const ALL_NON_MALWARE_2D_PROFILES = [
  ...NETWORK_WEB_2D_PROFILES,
  ...ACTIVE_DIRECTORY_2D_PROFILES,
  ...CLOUD_SAAS_2D_PROFILES,
  ...RANSOMWARE_EXTORTION_2D_PROFILES,
  ...AI_MLOPS_2D_PROFILES,
  ...ZERO_DAY_APPLIANCES_2D_PROFILES,
  ...KERNEL_FIRMWARE_2D_PROFILES,
  ...SUPPLY_CHAIN_CICD_2D_PROFILES,
  ...CONTAINERS_KUBERNETES_2D_PROFILES,
  ...DATABASE_PLATFORMS_2D_PROFILES,
  ...ICS_OT_SCADA_2D_PROFILES,
  ...MOBILE_TELECOM_2D_PROFILES,
];

const compiled = compileProfileGroup(ALL_NON_MALWARE_2D_PROFILES);

export const SCENARIO_2D_EXCALIDRAW_BOARDS: Record<
  string,
  Partial<Record<Section3DKey, TechnicalBoardDescriptor>>
> = compiled.boardsByScenario;

export const SCENARIO_2D_CLIP_SPECS: Record<
  string,
  Partial<Record<Exclude<Section3DKey, 'briefing'>, MalwareTechnicalClipSpec>>
> = compiled.clipsByScenario;

export function getNonMalwareTechnicalClipSpec(
  scenarioId: string,
  sectionKey: Section3DKey
): MalwareTechnicalClipSpec | null {
  if (sectionKey === 'briefing') return null;
  return SCENARIO_2D_CLIP_SPECS[scenarioId]?.[sectionKey] ?? null;
}

export function listAllNonMalware2DScenarioIds(): string[] {
  return ALL_NON_MALWARE_2D_PROFILES.map((p) => p.scenarioId);
}
