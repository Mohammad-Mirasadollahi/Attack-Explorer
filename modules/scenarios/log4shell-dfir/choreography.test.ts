import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOG4SHELL_STEP_DURATION_SEC,
  LOG4SHELL_STORY_ACTS,
  LOG4SHELL_TIMELINE_DURATION_SEC,
  evaluateLog4shellChoreography,
  evaluateLog4shellMemoryDiffState,
  evaluateLog4shellStep1State,
  evaluateLog4shellStep2State,
  evaluateLog4shellStep3State,
  evaluateLog4shellStep4State,
} from './choreography';

test('Log4Shell choreography covers 5 acts across 20s timeline', () => {
  assert.equal(LOG4SHELL_TIMELINE_DURATION_SEC, 20);
  assert.equal(LOG4SHELL_STORY_ACTS.length, 5);

  const act1 = evaluateLog4shellChoreography(0.1);
  assert.equal(act1.actIndex, 0);
  assert.ok(act1.conveyorParcelProgress > 0.2);

  const act3 = evaluateLog4shellChoreography(0.58);
  assert.equal(act3.actIndex, 2);
  assert.equal(act3.cutawayOpen, 1);
  assert.ok(act3.outboundTubeProgress > 0.3);

  const act5 = evaluateLog4shellChoreography(0.95);
  assert.equal(act5.actIndex, 4);
  assert.ok(act5.egressValveClosed > 0.8);
});

test('Log4Shell cutawayMode overrides AUTO behavior cleanly', () => {
  assert.equal(evaluateLog4shellChoreography(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateLog4shellChoreography(0.6, 'SEALED').cutawayOpen, 0);
});

test('Log4Shell standalone step & memory evaluators progress deterministically across 3 phases', () => {
  assert.equal(LOG4SHELL_STEP_DURATION_SEC, 15);

  const s1Mid = evaluateLog4shellStep1State(0.55, 'AUTO');
  const s1Late = evaluateLog4shellStep1State(0.92, 'AUTO');
  assert.equal(s1Mid.phaseIndex, 1);
  assert.ok(s1Mid.cameraFlashIntensity > 0.8 && s1Late.obfuscationBypassGlow > 0.85);
  assert.equal(evaluateLog4shellStep1State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateLog4shellStep1State(0.85, 'SEALED').cutawayOpen, 0);

  const s2Mid = evaluateLog4shellStep2State(0.58, 'AUTO');
  const s2Late = evaluateLog4shellStep2State(0.92, 'AUTO');
  assert.ok(s2Mid.jndiDispatchLevel > 0.6 && s2Late.sbomScanPulse > 0.85);
  assert.equal(evaluateLog4shellStep2State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateLog4shellStep2State(0.85, 'SEALED').cutawayOpen, 0);

  const s3Mid = evaluateLog4shellStep3State(0.60, 'AUTO');
  const s3Late = evaluateLog4shellStep3State(0.92, 'AUTO');
  assert.ok(s3Mid.execveSpawnProgress > 0.6 && s3Late.dualProofAlarm > 0.85);
  assert.equal(evaluateLog4shellStep3State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateLog4shellStep3State(0.85, 'SEALED').cutawayOpen, 0);

  const s4Mid = evaluateLog4shellStep4State(0.60, 'AUTO');
  const s4Late = evaluateLog4shellStep4State(0.92, 'AUTO');
  assert.ok(s4Mid.literalPatchProgress > 0.6 && s4Late.secretRotateProgress > 0.85);
  assert.equal(evaluateLog4shellStep4State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateLog4shellStep4State(0.85, 'SEALED').cutawayOpen, 0);

  const memMid = evaluateLog4shellMemoryDiffState(0.55, 'AUTO');
  const memLate = evaluateLog4shellMemoryDiffState(0.92, 'AUTO');
  assert.equal(memMid.phaseIndex, 1);
  assert.ok(memMid.sbomBeamSweep > 0.5 && memLate.patchedShieldPulse > 0.85);
  assert.equal(evaluateLog4shellMemoryDiffState(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateLog4shellMemoryDiffState(0.85, 'SEALED').cutawayOpen, 0);
});
