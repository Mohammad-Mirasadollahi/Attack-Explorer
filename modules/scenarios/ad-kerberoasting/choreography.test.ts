import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KERB_STEP_DURATION_SEC,
  KERB_STORY_ACTS,
  KERB_TIMELINE_DURATION_SEC,
  evaluateKerbChoreography,
  evaluateKerbMemoryDiffState,
  evaluateKerbStep1State,
  evaluateKerbStep2State,
  evaluateKerbStep3State,
  evaluateKerbStep4State,
} from './choreography';

test('Kerberoasting choreography covers 5 acts across 20s timeline', () => {
  assert.equal(KERB_TIMELINE_DURATION_SEC, 20);
  assert.equal(KERB_STORY_ACTS.length, 5);

  const act1 = evaluateKerbChoreography(0.1);
  assert.equal(act1.actIndex, 0);
  assert.ok(act1.bellboardGlow > 0.3);

  const act3 = evaluateKerbChoreography(0.55);
  assert.equal(act3.actIndex, 2);
  assert.equal(act3.cutawayOpen, 1);
  assert.ok(act3.tumblerSpin > 0.4);

  const act5 = evaluateKerbChoreography(0.95);
  assert.equal(act5.actIndex, 4);
  assert.ok(act5.auditLanternBeam > 0.8);
});

test('Kerberoasting cutawayMode overrides AUTO behavior cleanly', () => {
  assert.equal(evaluateKerbChoreography(0.1, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateKerbChoreography(0.6, 'SEALED').cutawayOpen, 0);
});

test('Kerberoasting standalone step & memory evaluators progress deterministically across 3 phases', () => {
  assert.equal(KERB_STEP_DURATION_SEC, 15);

  const s1Early = evaluateKerbStep1State(0.12, 'AUTO');
  const s1Late = evaluateKerbStep1State(0.88, 'AUTO');
  assert.equal(s1Early.phaseIndex, 0);
  assert.equal(s1Late.phaseIndex, 2);
  assert.ok(s1Late.targetHighlight > 0.9 && s1Late.canaryAuditPulse > 0.7);
  assert.equal(evaluateKerbStep1State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateKerbStep1State(0.8, 'SEALED').cutawayOpen, 0);

  const s2Mid = evaluateKerbStep2State(0.5, 'AUTO');
  const s2Late = evaluateKerbStep2State(0.9, 'AUTO');
  assert.equal(s2Mid.phaseIndex, 1);
  assert.ok(s2Mid.stampStrike > 0.7);
  assert.ok(s2Late.voucherSlide > 0.9 && s2Late.eid4769Flash > 0.8);
  assert.equal(evaluateKerbStep2State(0.1, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateKerbStep2State(0.8, 'SEALED').cutawayOpen, 0);

  const s3Mid = evaluateKerbStep3State(0.62, 'AUTO');
  const s3Late = evaluateKerbStep3State(0.92, 'AUTO');
  assert.equal(s3Mid.phaseIndex, 1);
  assert.ok(s3Mid.tumblerRpm > 0.8);
  assert.ok(s3Late.keycardRise > 0.9 && s3Late.sealFracture > 0.9);
  assert.equal(evaluateKerbStep3State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateKerbStep3State(0.9, 'SEALED').cutawayOpen, 0);

  const s4Mid = evaluateKerbStep4State(0.55, 'AUTO');
  const s4Late = evaluateKerbStep4State(0.92, 'AUTO');
  assert.equal(s4Mid.phaseIndex, 1);
  assert.ok(s4Mid.doorBreach > 0.7);
  assert.ok(s4Late.emeraldShieldDrop > 0.85);
  assert.equal(evaluateKerbStep4State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateKerbStep4State(0.9, 'SEALED').cutawayOpen, 0);

  const memEarly = evaluateKerbMemoryDiffState(0.15, 'AUTO');
  const memMid = evaluateKerbMemoryDiffState(0.55, 'AUTO');
  const memLate = evaluateKerbMemoryDiffState(0.92, 'AUTO');
  assert.equal(memEarly.phaseIndex, 0);
  assert.equal(memMid.phaseIndex, 1);
  assert.equal(memLate.phaseIndex, 2);
  assert.ok(memMid.auditSweepProgress > 0.5 && memLate.aesVaultPulse > 0.8);
  assert.equal(evaluateKerbMemoryDiffState(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateKerbMemoryDiffState(0.9, 'SEALED').cutawayOpen, 0);
});
