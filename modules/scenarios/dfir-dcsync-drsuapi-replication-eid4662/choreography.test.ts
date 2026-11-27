import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DCSYNC_STORY_ACTS,
  DCSYNC_TIMELINE_DURATION_SEC,
  evaluateDcsyncChoreography,
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
