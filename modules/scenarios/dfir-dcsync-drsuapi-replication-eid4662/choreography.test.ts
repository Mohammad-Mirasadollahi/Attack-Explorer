import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DCSYNC_STEP_DURATION_SEC,
  DCSYNC_STORY_ACTS,
  DCSYNC_TIMELINE_DURATION_SEC,
  evaluateDcsyncChoreography,
  evaluateDcsyncMemoryDiffState,
  evaluateDcsyncStep1State,
  evaluateDcsyncStep2State,
  evaluateDcsyncStep3State,
  evaluateDcsyncStep4State,
} from './choreography';

test('DCSync choreography covers 5 acts across 20s timeline', () => {
  assert.equal(DCSYNC_TIMELINE_DURATION_SEC, 20);
  assert.equal(DCSYNC_STORY_ACTS.length, 5);

  const act1 = evaluateDcsyncChoreography(0.1);
  assert.equal(act1.actIndex, 0);
  assert.ok(act1.aclRibbonGlow > 0.2);

  const act3 = evaluateDcsyncChoreography(0.6);
  assert.equal(act3.actIndex, 2);
  assert.equal(act3.cutawayOpen, 1);
  assert.ok(act3.ledgerStreamProgress > 0.3);

  const act5 = evaluateDcsyncChoreography(0.95);
  assert.equal(act5.actIndex, 4);
  assert.ok(act5.peerGateShield > 0.8);
});

test('DCSync cutawayMode overrides AUTO behavior cleanly', () => {
  assert.equal(evaluateDcsyncChoreography(0.1, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncChoreography(0.6, 'SEALED').cutawayOpen, 0);
});

test('DCSync standalone step & memory evaluators progress deterministically across 3 phases', () => {
  assert.equal(DCSYNC_STEP_DURATION_SEC, 15);

  const s1Mid = evaluateDcsyncStep1State(0.6, 'AUTO');
  const s1Late = evaluateDcsyncStep1State(0.92, 'AUTO');
  assert.equal(s1Mid.phaseIndex, 1);
  assert.ok(s1Mid.badRibbonFlare > 0.7 && s1Late.eid5136AuditScan > 0.85);
  assert.equal(evaluateDcsyncStep1State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncStep1State(0.85, 'SEALED').cutawayOpen, 0);

  const s2Mid = evaluateDcsyncStep2State(0.6, 'AUTO');
  const s2Late = evaluateDcsyncStep2State(0.92, 'AUTO');
  assert.ok(s2Mid.capsuleStreamProgress > 0.6 && s2Late.zeekWireAlert > 0.85);
  assert.equal(evaluateDcsyncStep2State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncStep2State(0.85, 'SEALED').cutawayOpen, 0);

  const s3Mid = evaluateDcsyncStep3State(0.58, 'AUTO');
  const s3Late = evaluateDcsyncStep3State(0.92, 'AUTO');
  assert.ok(s3Mid.logonIdJoinBeam > 0.6 && s3Late.p1SirenFlare > 0.85);
  assert.equal(evaluateDcsyncStep3State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncStep3State(0.85, 'SEALED').cutawayOpen, 0);

  const s4Mid = evaluateDcsyncStep4State(0.58, 'AUTO');
  const s4Late = evaluateDcsyncStep4State(0.92, 'AUTO');
  assert.ok(s4Mid.doubleResetRotation > 0.6 && s4Late.peerShieldLock > 0.85);
  assert.equal(evaluateDcsyncStep4State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncStep4State(0.85, 'SEALED').cutawayOpen, 0);

  const memMid = evaluateDcsyncMemoryDiffState(0.55, 'AUTO');
  const memLate = evaluateDcsyncMemoryDiffState(0.92, 'AUTO');
  assert.equal(memMid.phaseIndex, 1);
  assert.ok(memMid.auditSweepProgress > 0.5 && memLate.hardenedDaclGlow > 0.85);
  assert.equal(evaluateDcsyncMemoryDiffState(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncMemoryDiffState(0.85, 'SEALED').cutawayOpen, 0);
});
