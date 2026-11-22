import '@/lib/scenario-step-guide-index';
import { mapScenarioToLibraryItem } from '@/lib/attack-library-service';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import { getRawScenarioStepGuide } from '@/lib/scenario-step-guides';
import {
  VULNCHECK_CWP_AND_DFIR_ATTRIBUTIONS,
  VULNCHECK_CWP_AND_DFIR_CURATED_INTEL,
} from '@/lib/vulncheck-cwp-and-dfir-attributions-intel';
import type { AttackScenario } from '@/modules/scenarios/types';

function buildSearchText(scenario: AttackScenario): string {
  return [
    scenario.id,
    scenario.code,
    scenario.name,
    scenario.shortSubtitle,
    scenario.overview,
    ...scenario.specs.map((spec) => spec.value),
    ...scenario.stages.map(
      (stage) =>
        `${stage.mitreTechniqueId} ${stage.mitreTechniqueName} ${stage.title}`
    ),
    ...scenario.telemetry.map(
      (event) => `${event.protocolOrEventId} ${event.info} ${event.mitreId}`
    ),
  ]
    .join(' ')
    .toLowerCase();
}

export function collectDfirRecords() {
  return {
    attributions: VULNCHECK_CWP_AND_DFIR_ATTRIBUTIONS,
    intel: VULNCHECK_CWP_AND_DFIR_CURATED_INTEL,
  };
}

export function collectScenarioData() {
  return ATTACK_SCENARIOS.map((scenario) => ({
    scenario,
    guide: getRawScenarioStepGuide(scenario.id),
    catalog: {
      id: scenario.id,
      code: scenario.code,
      name: scenario.name,
      shortSubtitle: scenario.shortSubtitle,
      category: scenario.category,
      severity: scenario.severity,
      primaryMitrePhase: scenario.primaryMitrePhase,
      stageCount: scenario.stages.length,
      mitreIds: Array.from(
        new Set(scenario.stages.map((stage) => stage.mitreTechniqueId))
      ),
      searchText: buildSearchText(scenario),
      library: mapScenarioToLibraryItem(scenario),
    },
  }));
}
