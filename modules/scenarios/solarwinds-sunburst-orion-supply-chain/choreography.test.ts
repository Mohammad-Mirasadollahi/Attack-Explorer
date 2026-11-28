import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUNBURST_BRIEFING_DURATION_SEC,
  SUNBURST_STEP_DURATION_SEC,
  evaluateSunburstChoreography,
  evaluateSunburstMemoryDiffState,
  evaluateSunburstStep1State,
  evaluateSunburstStep2State,
  evaluateSunburstStep3State,
  evaluateSunburstStep4State,
} from './choreography';

test('solarwinds-sunburst choreography progresses cleanly through all 5 acts', () => {
  const a1 = evaluateSunburstChoreography(1.6);
  assert.equal(a1.actIndex, 1);
  assert.equal(a1.cutawayMode, 'SUNSPOT_SWAP');
  assert.ok(a1.plateSwapProgress > 0 && a1.plateSwapProgress < 1);
  assert.equal(a1.pipelineHardened, false);

  const a2 = evaluateSunburstChoreography(6.5);
  assert.equal(a2.actIndex, 2);
  assert.equal(a2.cutawayMode, 'WAX_SEAL_SIGN');
  assert.ok(a2.pressStampProgress > 0.4);

  const a3 = evaluateSunburstChoreography(11.6);
  assert.equal(a3.actIndex, 3);
  assert.equal(a3.cutawayMode, 'DORMANT_BEACON');
  assert.ok(a3.dormantShutterOpen > 0.5 && a3.beaconPulseIntensity > 0.3);

  const a4 = evaluateSunburstChoreography(15.5);
  assert.equal(a4.actIndex, 4);
  assert.equal(a4.cutawayMode, 'GOLDEN_SAML');
  assert.ok(a4.forgedSealGlow > 0.5);

  const a5 = evaluateSunburstChoreography(19.0);
  assert.equal(a5.actIndex, 5);
  assert.equal(a5.cutawayMode, 'BUILD_CALIPER');
  assert.ok(a5.caliperLockProgress > 0.8);
  assert.equal(a5.pipelineHardened, true);
});

test('solarwinds-sunburst choreography wraps cleanly at 20s and negative timestamps', () => {
  const start = evaluateSunburstChoreography(0.4);
  const wrapped = evaluateSunburstChoreography(SUNBURST_BRIEFING_DURATION_SEC + 0.4);
  assert.deepEqual(start, wrapped);
  assert.equal(evaluateSunburstChoreography(-1.2).actIndex, 5);
});

test('solarwinds-sunburst standalone step & memory evaluators honor phases and cutaway modes', () => {
  assert.equal(SUNBURST_STEP_DURATION_SEC, 15);

  const s1Mid = evaluateSunburstStep1State(0.55, 'AUTO');
  const s1Late = evaluateSunburstStep1State(0.92, 'AUTO');
  assert.equal(s1Mid.phaseIndex, 1);
  assert.ok(s1Mid.ghostPlateSwap > 0.5 && s1Late.cleanRestoreProgress > 0.85);
  assert.equal(evaluateSunburstStep1State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateSunburstStep1State(0.88, 'SEALED').cutawayOpen, 0);

  const s2Mid = evaluateSunburstStep2State(0.55, 'AUTO');
  const s2Late = evaluateSunburstStep2State(0.92, 'AUTO');
  assert.ok(s2Mid.waxGlowIntensity > 0.5 && s2Late.crateRollOut > 0.85);
  assert.equal(evaluateSunburstStep2State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateSunburstStep2State(0.88, 'SEALED').cutawayOpen, 0);

  const s3Mid = evaluateSunburstStep3State(0.55, 'AUTO');
  const s3Late = evaluateSunburstStep3State(0.92, 'AUTO');
  assert.ok(s3Mid.beaconWaveExpand > 0.5 && s3Late.cnameReplyBeam > 0.85);
  assert.equal(evaluateSunburstStep3State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateSunburstStep3State(0.88, 'SEALED').cutawayOpen, 0);

  const s4Mid = evaluateSunburstStep4State(0.55, 'AUTO');
  const s4Late = evaluateSunburstStep4State(0.92, 'AUTO');
  assert.ok(s4Mid.forgedPassFly > 0.5 && s4Late.auditGapAlarm > 0.85);
  assert.equal(evaluateSunburstStep4State(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateSunburstStep4State(0.88, 'SEALED').cutawayOpen, 0);

  const memMid = evaluateSunburstMemoryDiffState(0.55, 'AUTO');
  const memLate = evaluateSunburstMemoryDiffState(0.92, 'AUTO');
  assert.equal(memMid.phaseIndex, 1);
  assert.ok(memMid.caliperSweepProgress > 0.5 && memLate.injectedHookAlarm > 0.85);
  assert.equal(evaluateSunburstMemoryDiffState(0.05, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateSunburstMemoryDiffState(0.88, 'SEALED').cutawayOpen, 0);
});
