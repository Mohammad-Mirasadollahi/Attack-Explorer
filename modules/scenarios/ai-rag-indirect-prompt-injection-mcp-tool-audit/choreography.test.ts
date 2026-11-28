import assert from 'node:assert/strict';
import test from 'node:test';
import {
  evaluateRagMcpChoreography,
  evaluateRagMcpMemoryDiffState,
  evaluateRagMcpStep1State,
  evaluateRagMcpStep2State,
  evaluateRagMcpStep3State,
  evaluateRagMcpStep4State,
  RAGMCP_BRIEFING_DURATION_SEC,
} from './choreography';

test('RAG/MCP briefing choreography progresses through all 5 acts', () => {
  const a1 = evaluateRagMcpChoreography(1.5);
  const a2 = evaluateRagMcpChoreography(6.4);
  const a3 = evaluateRagMcpChoreography(11.4);
  const a4 = evaluateRagMcpChoreography(15.2);
  const a5 = evaluateRagMcpChoreography(18.6);

  assert.equal(a1.actIndex, 1);
  assert.equal(a1.cutawayMode, 'SHELF_POISON');
  assert.equal(a1.chuteBlocked, false);

  assert.equal(a2.actIndex, 2);
  assert.equal(a2.cutawayMode, 'FLAT_TRAY');
  assert.ok(a2.trayCutawayOpen > 0.5);

  assert.equal(a3.actIndex, 3);
  assert.equal(a3.cutawayMode, 'CHUTE_EXFIL');
  assert.ok(a3.capsuleShootProgress > 0.3);

  assert.equal(a4.actIndex, 4);
  assert.equal(a4.cutawayMode, 'LEDGER_ALARM');
  assert.ok(a4.ledgerAlarmGlow > 0.3);

  assert.equal(a5.actIndex, 5);
  assert.equal(a5.cutawayMode, 'EMERALD_GLASS');
  assert.equal(a5.chuteBlocked, true);

  const wrapped = evaluateRagMcpChoreography(RAGMCP_BRIEFING_DURATION_SEC + 1.5);
  assert.equal(wrapped.actIndex, a1.actIndex);
});

test('RAG/MCP step & memory evaluators respect cutaway overrides', () => {
  assert.equal(evaluateRagMcpStep1State(0.5, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateRagMcpStep1State(0.5, 'SEALED').cutawayOpen, 0);
  assert.equal(evaluateRagMcpStep2State(0.1, 'AUTO').phaseIndex, 0);
  assert.equal(evaluateRagMcpStep2State(0.85, 'AUTO').phaseIndex, 2);
  assert.ok(evaluateRagMcpStep3State(0.9, 'AUTO').chuteLaunchProgress > 0.5);
  assert.ok(evaluateRagMcpStep4State(0.9, 'AUTO').auditBellGlow > 0.5);
  assert.ok(evaluateRagMcpMemoryDiffState(0.85, 'AUTO').rightIsolatedGlow > 0.4);
});
