export * from '@/modules/scenarios/types';

import { AttackScenario } from '@/modules/scenarios/types';
import { CANONICAL_ATTACK_SCENARIOS } from '@/modules/scenarios/all-scenarios';
import { applyReadableStepGuidesToScenario } from './scenario-step-guides';
import './scenario-step-guide-index';
import { ensureCascadingProcessHierarchy } from './documentation-structural-diagrams';

/**
 * Preserve the Golden Benchmark (`process-hollowing`) at index 0.
 * New bespoke scenarios added in Phase 2 append cleanly after it in canonical order.
 */
const LEADING_SCENARIO_IDS = [
  'process-hollowing',
  'amsi-reflective-dll',
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
