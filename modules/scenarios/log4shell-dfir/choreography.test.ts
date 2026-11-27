import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOG4SHELL_STORY_ACTS,
  LOG4SHELL_TIMELINE_DURATION_SEC,
  evaluateLog4shellChoreography,
} from './choreography';

test('Log4Shell choreography covers 5 acts across 20s timeline', () => {
  assert.equal(LOG4SHELL_TIMELINE_DURATION_SEC, 20);
  assert.equal(LOG4SHELL_STORY_ACTS.length, 5);

  const act1 = evaluateLog4shellChoreography(0.1);
  assert.equal(act1.actIndex, 0);
  assert.ok(act1.conveyorParcelProgress > 0.2);

  const act3 = evaluateLog4shellChoreography(0.6);
  assert.equal(act3.actIndex, 2);
  assert.equal(act3.cutawayOpen, 1);
  assert.ok(act3.outboundTubeProgress > 0.4);

  const act5 = evaluateLog4shellChoreography(0.95);
  assert.equal(act5.actIndex, 4);
  assert.ok(act5.egressValveClosed > 0.8);
});

test('Log4Shell cutawayMode overrides AUTO cleanly', () => {
  assert.equal(evaluateLog4shellChoreography(0.1, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateLog4shellChoreography(0.6, 'SEALED').cutawayOpen, 0);
});
