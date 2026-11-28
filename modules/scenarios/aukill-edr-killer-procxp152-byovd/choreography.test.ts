import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUKILL_BRIEFING_DURATION_SEC,
  AUKILL_STEP_DURATION_SEC,
  evaluateAukillChoreography,
  evaluateAukillMemoryDiffState,
  evaluateAukillStep1State,
  evaluateAukillStep2State,
  evaluateAukillStep3State,
  evaluateAukillStep4State,
} from './choreography';

test('aukill choreography progresses cleanly through all 5 acts', () => {
  const a1 = evaluateAukillChoreography(1.6);
  assert.equal(a1.actIndex, 1);
  assert.equal(a1.cutawayMode, 'WRENCH_DROP');
  assert.ok(a1.wrenchDropProgress > 0 && a1.wrenchDropProgress < 1);
  assert.equal(a1.hvciBlocked, false);

  const a2 = evaluateAukillChoreography(6.5);
  assert.equal(a2.actIndex, 2);
  assert.equal(a2.cutawayMode, 'BREAKER_DIAL');
  assert.ok(a2.pitDomeOpen > 0.5 && a2.dialTurnProgress > 0.3);

  const a3 = evaluateAukillChoreography(11.4);
  assert.equal(a3.actIndex, 3);
  assert.equal(a3.cutawayMode, 'TOWERS_DARK');
  assert.ok(a3.towerShutdownProgress > 0.4);

  const a4 = evaluateAukillChoreography(15.5);
  assert.equal(a4.actIndex, 4);
  assert.equal(a4.cutawayMode, 'VAULT_SURGE');
  assert.ok(a4.surgePulseIntensity > 0.5);

  const a5 = evaluateAukillChoreography(19.0);
  assert.equal(a5.actIndex, 5);
  assert.equal(a5.cutawayMode, 'RECALL_SHUTTER');
  assert.ok(a5.recallShutterDrop > 0.8);
  assert.equal(a5.hvciBlocked, true);
});

test('aukill choreography wraps cleanly at 20s and negative timestamps', () => {
  const start = evaluateAukillChoreography(0.5);
  const wrapped = evaluateAukillChoreography(AUKILL_BRIEFING_DURATION_SEC + 0.5);
  assert.deepEqual(start, wrapped);
  assert.equal(evaluateAukillChoreography(-1.0).actIndex, 5);
});

test('aukill standalone step & memory evaluators honor phases and cutaway modes', () => {
  assert.equal(AUKILL_STEP_DURATION_SEC, 15);

  const s1Mid = evaluateAukillStep1State(0.55, 'AUTO');
  const s1Late = evaluateAukillStep1State(0.92, 'AUTO');
  assert.equal(s1Mid.phaseIndex, 1);
  assert.ok(s1Mid.stampScanGlow > 0.5 && s1Late.pitEntryProgress > 0.85);
  assert.equal(evaluateAukillStep1State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateAukillStep1State(0.88, 'SEALED').cutawayOpen, 0);

  const s2Mid = evaluateAukillStep2State(0.55, 'AUTO');
  const s2Late = evaluateAukillStep2State(0.92, 'AUTO');
  assert.ok(s2Mid.dialRotation > 0.5 && s2Late.handleGrantGlow > 0.85);
  assert.equal(evaluateAukillStep2State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateAukillStep2State(0.88, 'SEALED').cutawayOpen, 0);

  const s3Mid = evaluateAukillStep3State(0.55, 'AUTO');
  const s3Late = evaluateAukillStep3State(0.92, 'AUTO');
  assert.ok(s3Mid.breakerFlip2 > 0.5 && s3Late.breakerFlip3 > 0.85);
  assert.equal(evaluateAukillStep3State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateAukillStep3State(0.88, 'SEALED').cutawayOpen, 0);

  const s4Mid = evaluateAukillStep4State(0.55, 'AUTO');
  const s4Late = evaluateAukillStep4State(0.92, 'AUTO');
  assert.ok(s4Mid.shutterSlamDrop > 0.5 && s4Late.watchtowerSafeGlow > 0.85);
  assert.equal(evaluateAukillStep4State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateAukillStep4State(0.88, 'SEALED').cutawayOpen, 0);

  const memMid = evaluateAukillMemoryDiffState(0.55, 'AUTO');
  const memLate = evaluateAukillMemoryDiffState(0.92, 'AUTO');
  assert.equal(memMid.phaseIndex, 1);
  assert.ok(memMid.forensicSweepProgress > 0.5 && memLate.rightBlockGlow > 0.85);
  assert.equal(evaluateAukillMemoryDiffState(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateAukillMemoryDiffState(0.88, 'SEALED').cutawayOpen, 0);
});
