import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import { SCENARIO_CATALOG } from './scenario-catalog';
import { getRawScenarioStepGuide } from './scenario-step-guides';

test('prepared scenario files stay aligned with the server catalog', () => {
  assert.equal(SCENARIO_CATALOG.length, ATTACK_SCENARIOS.length);
  assert.deepEqual(
    SCENARIO_CATALOG.map((entry) => entry.id),
    ATTACK_SCENARIOS.map((scenario) => scenario.id)
  );

  for (const scenarioId of [
    'process-hollowing',
    'ai-rag-indirect-prompt-injection-mcp-tool-audit',
  ]) {
    const scenario = ATTACK_SCENARIOS.find((item) => item.id === scenarioId);
    assert.ok(scenario, scenarioId);
    const payload = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'public', 'scenario-data', `${scenarioId}.json`),
        'utf8'
      )
    );
    assert.equal(JSON.stringify(payload.scenario), JSON.stringify(scenario));
    assert.equal(
      JSON.stringify(payload.guide),
      JSON.stringify(getRawScenarioStepGuide(scenarioId))
    );
    const catalogEntry = SCENARIO_CATALOG.find((entry) => entry.id === scenarioId);
    assert.equal(catalogEntry?.stageCount, scenario.stages.length);
    assert.ok(catalogEntry?.searchText.includes(scenario.code.toLowerCase()));
  }
});
