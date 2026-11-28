import test from 'node:test';
import assert from 'node:assert/strict';
import {
  IMDS_BRIEFING_DURATION_SEC,
  IMDS_STEP_DURATION_SEC,
  evaluateImdsChoreography,
  evaluateImdsMemoryDiffState,
  evaluateImdsStep1State,
  evaluateImdsStep2State,
  evaluateImdsStep3State,
  evaluateImdsStep4State,
} from './choreography';

test('aws-imdsv1-ssrf choreography progresses cleanly through all 5 acts', () => {
  const a1 = evaluateImdsChoreography(1.6);
  assert.equal(a1.actIndex, 1);
  assert.equal(a1.cutawayMode, 'DESK_SSRF');
  assert.ok(a1.slipSlideProgress > 0 && a1.slipSlideProgress < 1);
  assert.equal(a1.imdsLocked, false);

  const a2 = evaluateImdsChoreography(6.5);
  assert.equal(a2.actIndex, 2);
  assert.equal(a2.cutawayMode, 'KEYCARD_DISPENSE');
  assert.ok(a2.kioskCutawayOpen > 0.5 && a2.keycardDispenseProgress > 0.3);

  const a3 = evaluateImdsChoreography(11.4);
  assert.equal(a3.actIndex, 3);
  assert.equal(a3.cutawayMode, 'VAULT_DRAIN');
  assert.ok(a3.vaultDrainProgress > 0.4);

  const a4 = evaluateImdsChoreography(15.5);
  assert.equal(a4.actIndex, 4);
  assert.equal(a4.cutawayMode, 'OUTSIDE_ALARM');
  assert.ok(a4.outsideAlarmIntensity > 0.8);

  const a5 = evaluateImdsChoreography(19.0);
  assert.equal(a5.actIndex, 5);
  assert.equal(a5.cutawayMode, 'IMDSV2_TURNSTILE');
  assert.ok(a5.turnstileLockDrop > 0.8);
  assert.equal(a5.imdsLocked, true);
});

test('aws-imdsv1-ssrf choreography wraps seamlessly at 20s and negative timestamps', () => {
  const start = evaluateImdsChoreography(0.6);
  const wrapped = evaluateImdsChoreography(IMDS_BRIEFING_DURATION_SEC + 0.6);
  assert.deepEqual(start, wrapped);
  assert.equal(evaluateImdsChoreography(-1.0).actIndex, 5);
});

test('aws-imdsv1-ssrf standalone step and memory evaluators honor phases and cutaway modes', () => {
  assert.equal(IMDS_STEP_DURATION_SEC, 15);

  const s1Mid = evaluateImdsStep1State(0.55, 'AUTO');
  const s1Late = evaluateImdsStep1State(0.92, 'AUTO');
  assert.equal(s1Mid.phaseIndex, 1);
  assert.ok(s1Mid.proxyRedirectPulse > 0.5 && s1Late.roleNameEchoGlow > 0.85);
  assert.equal(evaluateImdsStep1State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateImdsStep1State(0.88, 'SEALED').cutawayOpen, 0);

  const s2Mid = evaluateImdsStep2State(0.56, 'AUTO');
  const s2Late = evaluateImdsStep2State(0.92, 'AUTO');
  assert.ok(s2Mid.keycardEjectHeight > 0.5 && s2Late.tokenEnvelopeGlow > 0.85);
  assert.equal(evaluateImdsStep2State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateImdsStep2State(0.88, 'SEALED').cutawayOpen, 0);

  const s3Mid = evaluateImdsStep3State(0.56, 'AUTO');
  const s3Late = evaluateImdsStep3State(0.92, 'AUTO');
  assert.ok(s3Mid.drawerPullOut > 0.5 && s3Late.exfilCrateLift > 0.85);
  assert.equal(evaluateImdsStep3State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateImdsStep3State(0.88, 'SEALED').cutawayOpen, 0);

  const s4Mid = evaluateImdsStep4State(0.56, 'AUTO');
  const s4Late = evaluateImdsStep4State(0.92, 'AUTO');
  assert.ok(s4Mid.turnstileBarrierDrop > 0.5 && s4Late.hopLimitShieldGlow > 0.85);
  assert.equal(evaluateImdsStep4State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateImdsStep4State(0.88, 'SEALED').cutawayOpen, 0);

  const memMid = evaluateImdsMemoryDiffState(0.55, 'AUTO');
  const memLate = evaluateImdsMemoryDiffState(0.92, 'AUTO');
  assert.equal(memMid.phaseIndex, 1);
  assert.ok(memMid.forensicSweepProgress > 0.5 && memLate.rightTurnstileLockGlow > 0.85);
  assert.equal(evaluateImdsMemoryDiffState(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateImdsMemoryDiffState(0.88, 'SEALED').cutawayOpen, 0);
});
