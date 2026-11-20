export * from '@/modules/scenarios/types';

import { AttackScenario } from '@/modules/scenarios/types';
import {
  CANONICAL_ATTACK_SCENARIOS,
  LEGACY_DRAFT_SCENARIOS,
} from '@/modules/scenarios/all-scenarios';
import { normalizeLegacyDraftScenario } from '@/modules/scenarios/legacy/normalize-legacy-draft-scenario';
import { applyReadableStepGuidesToScenario } from './scenario-step-guides';
import { ensureCascadingProcessHierarchy } from './documentation-structural-diagrams';

/**
 * Preserve the historical front-of-catalog order. Several tests and the
 * workbench default selection assume these ids occupy the early indexes.
 */
const LEADING_SCENARIO_IDS = [
  'process-hollowing',
  'log4shell-dfir',
  'amsi-reflective-dll',
  'ad-kerberoasting',
  'dns-tunneling-exfil',
  'ransomware-shadow-wipe',
] as const;

const byId = new Map(
  CANONICAL_ATTACK_SCENARIOS.map((scenario) => [scenario.id, scenario])
);

const leadingScenarios: AttackScenario[] = LEADING_SCENARIO_IDS.map((id) => {
  const scenario = byId.get(id);
  if (!scenario) {
    throw new Error(`Missing required leading scenario: ${id}`);
  }
  return scenario;
});

const remainingCanonical = CANONICAL_ATTACK_SCENARIOS.filter(
  (scenario) =>
    !(LEADING_SCENARIO_IDS as readonly string[]).includes(scenario.id)
);

const RAW_ATTACK_SCENARIOS: AttackScenario[] = [
  ...leadingScenarios,
  ...remainingCanonical,
  // Drafts that overlap richer canonical scenarios are dropped by dedupe.
  ...LEGACY_DRAFT_SCENARIOS.map(normalizeLegacyDraftScenario),
];

function dedupeScenariosById(scenarios: AttackScenario[]): AttackScenario[] {
  const seen = new Set<string>();
  return scenarios.filter((scenario) => {
    if (seen.has(scenario.id)) return false;
    seen.add(scenario.id);
    return true;
  });
}

export const ATTACK_SCENARIOS: AttackScenario[] = dedupeScenariosById(
  RAW_ATTACK_SCENARIOS
)
  .map(ensureCascadingProcessHierarchy)
  .map(applyReadableStepGuidesToScenario);
