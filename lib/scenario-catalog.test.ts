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

  assert.ok(
    ATTACK_SCENARIOS.some((item) => item.id === 'process-hollowing'),
    'Golden Benchmark process-hollowing must exist in ATTACK_SCENARIOS'
  );

  const dataDir = path.join(process.cwd(), 'public', 'scenario-data');
  const jsonFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith('.json'))
    .sort();
  assert.deepEqual(
    jsonFiles,
    ATTACK_SCENARIOS.map((scenario) => `${scenario.id}.json`).sort(),
    'public/scenario-data JSON files must match live ATTACK_SCENARIOS with zero stale files'
  );

  for (const scenario of ATTACK_SCENARIOS) {
    const payload = JSON.parse(
      fs.readFileSync(path.join(dataDir, `${scenario.id}.json`), 'utf8')
    );
    assert.equal(JSON.stringify(payload.scenario), JSON.stringify(scenario));
    assert.equal(
      JSON.stringify(payload.guide),
      JSON.stringify(getRawScenarioStepGuide(scenario.id))
    );
    const catalogEntry = SCENARIO_CATALOG.find((entry) => entry.id === scenario.id);
    assert.equal(catalogEntry?.stageCount, scenario.stages.length);
    assert.ok(catalogEntry?.searchText.includes(scenario.code.toLowerCase()));
  }
});
