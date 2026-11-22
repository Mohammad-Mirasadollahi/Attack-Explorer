import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';
import type { AttackScenario } from '@/modules/scenarios/types';
import { SCENARIO_DATA_REVISION } from './scenario-catalog';
import { cacheScenarioGuide } from './scenario-step-guides';

interface PreparedScenarioFile {
  scenario: AttackScenario;
  guide: RawScenarioStepGuideData | null;
}

const preparedCache = new Map<string, PreparedScenarioFile>();
const inflight = new Map<string, Promise<AttackScenario>>();

/**
 * Loads one prepared scenario JSON from Workers Static Assets.
 * These files live under /public/scenario-data and are free/unlimited on the
 * Cloudflare Free plan — they must not be computed inside the Worker isolate.
 */
async function fetchPreparedScenario(scenarioId: string): Promise<AttackScenario> {
  const cached = preparedCache.get(scenarioId);
  if (cached) {
    cacheScenarioGuide(scenarioId, cached.guide);
    return cached.scenario;
  }

  const response = await fetch(
    `/scenario-data/${encodeURIComponent(scenarioId)}.json?v=${SCENARIO_DATA_REVISION}`
  );
  if (!response.ok) {
    throw new Error(`Could not load scenario ${scenarioId}`);
  }
  const payload = (await response.json()) as PreparedScenarioFile;
  preparedCache.set(scenarioId, payload);
  cacheScenarioGuide(scenarioId, payload.guide);
  return payload.scenario;
}

/** Loads one prepared scenario and caches its step guide for the inspector. */
export function loadPreparedScenario(scenarioId: string): Promise<AttackScenario> {
  const pending = inflight.get(scenarioId);
  if (pending) return pending;

  const request = fetchPreparedScenario(scenarioId).catch((error) => {
    inflight.delete(scenarioId);
    throw error;
  });
  inflight.set(scenarioId, request);
  return request;
}
