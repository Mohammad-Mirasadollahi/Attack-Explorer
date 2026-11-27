import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KERB_STORY_ACTS,
  evaluateKerbChoreography,
} from './choreography';

test('Kerberoasting choreography covers full 5-act timeline contiguously from 0 to 1', () => {
  assert.equal(KERB_STORY_ACTS.length, 5);
  assert.equal(KERB_STORY_ACTS[0].startNorm, 0);
  assert.equal(KERB_STORY_ACTS[KERB_STORY_ACTS.length - 1].endNorm, 1);
  for (let i = 1; i < KERB_STORY_ACTS.length; i++) {
    assert.equal(KERB_STORY_ACTS[i].startNorm, KERB_STORY_ACTS[i - 1].endNorm);
  }
});

test('Kerberoasting choreography sequences SPN bellboard -> RC4 voucher -> offline crack -> PTH pivot -> audit beam', () => {
  const act1 = evaluateKerbChoreography(0.14);
  assert.equal(act1.actIndex, 0);
  assert.ok(act1.bellboardGlow > 0.7);
  assert.equal(act1.voucherIssued, 0);

  const act2 = evaluateKerbChoreography(0.38);
  assert.equal(act2.actIndex, 1);
  assert.ok(act2.tubePacketProgress > 0.9);
  assert.ok(act2.voucherIssued > 0.5);

  const act3 = evaluateKerbChoreography(0.56);
  assert.equal(act3.actIndex, 2);
  assert.ok(act3.cutawayOpen > 0.9);
  assert.ok(act3.tumblerSpin > 0.5);
  assert.equal(act3.keycardPivot, 0);

  const act4 = evaluateKerbChoreography(0.76);
  assert.equal(act4.actIndex, 3);
  assert.ok(act4.keycardPivot > 0.5);

  const act5 = evaluateKerbChoreography(0.94);
  assert.equal(act5.actIndex, 4);
  assert.ok(act5.auditLanternBeam > 0.8);
});

test('Kerberoasting choreography honors OPEN and SEALED cutaway overrides', () => {
  assert.equal(evaluateKerbChoreography(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateKerbChoreography(0.6, 'SEALED').cutawayOpen, 0);
});
