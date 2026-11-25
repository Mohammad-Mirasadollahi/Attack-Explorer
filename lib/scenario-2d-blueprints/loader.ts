import type { Section3DKey } from '@/lib/section-3d-registry';
import type { TechnicalBoardDescriptor } from '@/lib/excalidraw-boards/board-primitives';
import type { MalwareTechnicalClipSpec } from '@/components/technical-clip/malware-clips/types';
import {
  compileBoardForSection,
  compileClipForSection,
} from '@/lib/malware-2d-blueprints/compiler';
import {
  loadMalwareTechnicalClipSpec,
  loadMalwareTechnicalWhiteboard,
} from '@/lib/malware-2d-blueprints/loader';
import { getMalware2DGroupKey } from '@/lib/malware-2d-blueprints/manifest';
import type { MalwareScenario2DProfile } from '@/lib/malware-2d-blueprints/types';
import {
  getScenario2DCategoryKey,
  type Scenario2DCategoryKey,
} from './manifest';

const categoryCache = new Map<
  Scenario2DCategoryKey,
  Promise<MalwareScenario2DProfile[]>
>();
const boardCache = new Map<string, TechnicalBoardDescriptor | null>();
const clipCache = new Map<string, MalwareTechnicalClipSpec | null>();

function loadCategoryProfiles(
  category: Scenario2DCategoryKey
): Promise<MalwareScenario2DProfile[]> {
  const cached = categoryCache.get(category);
  if (cached) return cached;

  const promise = (async () => {
    switch (category) {
      case 'network-web':
        return (await import('./network-web')).NETWORK_WEB_2D_PROFILES;
      case 'active-directory':
        return (await import('./active-directory')).ACTIVE_DIRECTORY_2D_PROFILES;
      case 'cloud-saas':
        return (await import('./cloud-saas')).CLOUD_SAAS_2D_PROFILES;
      case 'ransomware-extortion':
        return (await import('./ransomware-extortion'))
          .RANSOMWARE_EXTORTION_2D_PROFILES;
      case 'ai-mlops':
        return (await import('./ai-mlops')).AI_MLOPS_2D_PROFILES;
      case 'zero-day-appliances':
        return (await import('./zero-day-appliances'))
          .ZERO_DAY_APPLIANCES_2D_PROFILES;
      case 'kernel-firmware-byovd':
        return (await import('./kernel-firmware-byovd'))
          .KERNEL_FIRMWARE_2D_PROFILES;
      case 'supply-chain-cicd':
        return (await import('./supply-chain-cicd'))
          .SUPPLY_CHAIN_CICD_2D_PROFILES;
      case 'containers-kubernetes':
        return (await import('./containers-kubernetes'))
          .CONTAINERS_KUBERNETES_2D_PROFILES;
      case 'database-platforms':
        return (await import('./database-platforms'))
          .DATABASE_PLATFORMS_2D_PROFILES;
      case 'ics-ot-scada':
        return (await import('./ics-ot-scada')).ICS_OT_SCADA_2D_PROFILES;
      case 'mobile-telecom':
        return (await import('./mobile-telecom')).MOBILE_TELECOM_2D_PROFILES;
    }
  })();

  const wrapped = promise.catch((err) => {
    categoryCache.delete(category);
    throw err;
  });

  categoryCache.set(category, wrapped);
  return wrapped;
}

export async function loadScenario2DWhiteboard(
  scenarioId: string,
  sectionKey: Section3DKey
): Promise<TechnicalBoardDescriptor | null> {
  const cacheKey = `${scenarioId}:${sectionKey}`;
  if (boardCache.has(cacheKey)) {
    return boardCache.get(cacheKey) ?? null;
  }

  const category = getScenario2DCategoryKey(scenarioId);
  if (!category) return null;

  const profiles = await loadCategoryProfiles(category);
  const profile = profiles.find((p) => p.scenarioId === scenarioId);
  const sec = profile?.sections.find((s) => s.sectionKey === sectionKey);
  const board = sec ? compileBoardForSection(scenarioId, sec) : null;
  boardCache.set(cacheKey, board);
  return board;
}

export async function loadScenario2DClipSpec(
  scenarioId: string,
  sectionKey: Section3DKey
): Promise<MalwareTechnicalClipSpec | null> {
  if (sectionKey === 'briefing') return null;

  const cacheKey = `${scenarioId}:${sectionKey}`;
  if (clipCache.has(cacheKey)) {
    return clipCache.get(cacheKey) ?? null;
  }

  const category = getScenario2DCategoryKey(scenarioId);
  if (!category) return null;

  const profiles = await loadCategoryProfiles(category);
  const profile = profiles.find((p) => p.scenarioId === scenarioId);
  const sec = profile?.sections.find((s) => s.sectionKey === sectionKey);
  const clip = sec ? compileClipForSection(scenarioId, sec) : null;
  clipCache.set(cacheKey, clip);
  return clip;
}

/**
 * Unified lazy loader for all 187 non-process-hollowing scenarios (29 MALWARE
 * scenarios + 158 scenarios across the other 12 categories).
 */
export async function loadAnyTechnicalWhiteboard(
  scenarioId: string,
  sectionKey: Section3DKey
): Promise<TechnicalBoardDescriptor | null> {
  if (getMalware2DGroupKey(scenarioId)) {
    return loadMalwareTechnicalWhiteboard(scenarioId, sectionKey);
  }
  return loadScenario2DWhiteboard(scenarioId, sectionKey);
}

export async function loadAnyTechnicalClipSpec(
  scenarioId: string,
  sectionKey: Section3DKey
): Promise<MalwareTechnicalClipSpec | null> {
  if (sectionKey === 'briefing') return null;
  if (getMalware2DGroupKey(scenarioId)) {
    return loadMalwareTechnicalClipSpec(scenarioId, sectionKey);
  }
  return loadScenario2DClipSpec(scenarioId, sectionKey);
}
