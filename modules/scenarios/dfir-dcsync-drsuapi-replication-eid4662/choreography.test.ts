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

test('DCSync overview choreography covers 5 acts across >= 40s (45s) timeline with complete physical interactions', () => {
  assert.ok(
    DCSYNC_TIMELINE_DURATION_SEC >= 40,
    `Overview duration must be >= 40s, got ${DCSYNC_TIMELINE_DURATION_SEC}s`
  );
  assert.equal(DCSYNC_TIMELINE_DURATION_SEC, 45);
  assert.equal(DCSYNC_STORY_ACTS.length, 5);

  const act1 = evaluateDcsyncChoreography(0.1);
  assert.equal(act1.actIndex, 0);
  assert.ok(act1.aclRibbonGlow > 0.4);

  const act2Flash = evaluateDcsyncChoreography(0.365);
  assert.equal(act2Flash.actIndex, 1);
  assert.ok(act2Flash.courierAdvance > 0.95);
  assert.ok(act2Flash.hatchOpen > 0.95);
  assert.ok(act2Flash.ribbonFlash > 0.85);

  const act3 = evaluateDcsyncChoreography(0.54);
  assert.equal(act3.actIndex, 2);
  assert.equal(act3.cutawayOpen, 1);
  assert.ok(act3.ledgerStreamProgress > 0.95);
  assert.ok(act3.duplicateDropProgress > 0.45);

  const act4 = evaluateDcsyncChoreography(0.72);
  assert.equal(act4.actIndex, 3);
  assert.ok(act4.plateScanProgress > 0.95);
  assert.ok(act4.auditAlarmLevel > 0.45);

  const act5Pass1 = evaluateDcsyncChoreography(0.865);
  const act5Pass2 = evaluateDcsyncChoreography(0.945);
  assert.equal(act5Pass1.actIndex, 4);
  assert.ok(act5Pass1.ribbonDropProgress > 0.95);
  assert.ok(act5Pass1.recastPass1 > 0.85 && act5Pass1.recastPass2 === 0);
  assert.ok(act5Pass2.recastPass2 > 0.85 && act5Pass2.recastPass1 === 0);
  assert.ok(act5Pass2.peerGateShield > 0.95 && act5Pass2.stolenSealVoided > 0.95);
});

test('DCSync cutawayMode overrides AUTO behavior cleanly', () => {
  assert.equal(evaluateDcsyncChoreography(0.1, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncChoreography(0.55, 'SEALED').cutawayOpen, 0);
});

test('DCSync standalone step & memory evaluators progress deterministically across 24s (3 phases)', () => {
  assert.equal(DCSYNC_STEP_DURATION_SEC, 24);

  const s1Mid = evaluateDcsyncStep1State(0.6, 'AUTO');
  const s1Late = evaluateDcsyncStep1State(0.92, 'AUTO');
  assert.equal(s1Mid.phaseIndex, 1);
  assert.ok(s1Mid.badRibbonFlare > 0.7 && s1Late.eid5136AuditScan > 0.85);
  assert.equal(evaluateDcsyncStep1State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncStep1State(0.85, 'SEALED').cutawayOpen, 0);

  const s2Early = evaluateDcsyncStep2State(0.3, 'AUTO');
  const s2Mid = evaluateDcsyncStep2State(0.6, 'AUTO');
  const s2Late = evaluateDcsyncStep2State(0.92, 'AUTO');
  assert.ok(s2Early.vanDockProgress > 0.95 && s2Early.ribbonBindFlash > 0.85);
  assert.ok(s2Mid.capsuleStreamProgress > 0.6 && s2Late.zeekWireAlert > 0.85);
  assert.equal(evaluateDcsyncStep2State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncStep2State(0.85, 'SEALED').cutawayOpen, 0);

  const s3Mid = evaluateDcsyncStep3State(0.58, 'AUTO');
  const s3Late = evaluateDcsyncStep3State(0.92, 'AUTO');
  assert.ok(s3Mid.logonIdJoinBeam > 0.6 && s3Late.p1SirenFlare > 0.85);
  assert.equal(evaluateDcsyncStep3State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncStep3State(0.85, 'SEALED').cutawayOpen, 0);

  const s4Pass1 = evaluateDcsyncStep4State(0.43, 'AUTO');
  const s4Pass2 = evaluateDcsyncStep4State(0.6, 'AUTO');
  const s4Late = evaluateDcsyncStep4State(0.92, 'AUTO');
  assert.ok(s4Pass1.recastPass1 > 0.85 && s4Pass1.recastPass2 === 0);
  assert.ok(s4Pass2.recastPass2 > 0.85 && s4Pass2.recastPass1 === 0);
  assert.ok(s4Pass2.doubleResetRotation > 0.6 && s4Late.peerShieldLock > 0.85);
  assert.equal(evaluateDcsyncStep4State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncStep4State(0.85, 'SEALED').cutawayOpen, 0);

  const memMid = evaluateDcsyncMemoryDiffState(0.55, 'AUTO');
  const memLate = evaluateDcsyncMemoryDiffState(0.92, 'AUTO');
  assert.equal(memMid.phaseIndex, 1);
  assert.ok(memMid.auditSweepProgress > 0.5 && memLate.hardenedDaclGlow > 0.85);
  assert.equal(evaluateDcsyncMemoryDiffState(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDcsyncMemoryDiffState(0.85, 'SEALED').cutawayOpen, 0);
});
