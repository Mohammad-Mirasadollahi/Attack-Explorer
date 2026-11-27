import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LSASS_STORY_ACTS,
  LSASS_TIMELINE_DURATION_SEC,
  evaluateLsassChoreography,
  evaluateLsassMemoryPplDiffState,
  evaluateLsassStep1State,
  evaluateLsassStep2State,
  evaluateLsassStep3State,
  evaluateLsassStep4State,
} from './choreography';

test('LSASS MiniDump choreography covers full 5-act timeline contiguously from 0 to 1', () => {
  assert.equal(LSASS_TIMELINE_DURATION_SEC, 20.0);
  assert.equal(LSASS_STORY_ACTS.length, 5);
  assert.equal(LSASS_STORY_ACTS[0].start, 0.0);
  assert.equal(LSASS_STORY_ACTS[4].end, 1.0);
  for (let i = 1; i < LSASS_STORY_ACTS.length; i++) {
    assert.equal(LSASS_STORY_ACTS[i].start, LSASS_STORY_ACTS[i - 1].end);
  }
});

test('Act 1 elevates SeDebugPrivilege badge before photographer cart advances in Act 2', () => {
  const act1 = evaluateLsassChoreography(0.14);
  assert.equal(act1.actIndex, 0);
  assert.ok(act1.badgeGlow > 0.8);
  assert.equal(act1.photographerAdvance, 0);
  assert.equal(act1.xrayFlashBeam, 0);

  const act2 = evaluateLsassChoreography(0.35);
  assert.equal(act2.actIndex, 1);
  assert.ok(act2.photographerAdvance > 0.7);
  assert.equal(act2.polaroidEject, 0);
});

test('Act 3 widens 0x1010 X-ray aperture before MDMP negative ejects in Act 4 and Sysmon booth fires in Act 5', () => {
  const act3 = evaluateLsassChoreography(0.56);
  assert.equal(act3.actIndex, 2);
  assert.ok(act3.lensApertureOpen > 0.9);
  assert.ok(act3.xrayFlashBeam > 0.9);
  assert.equal(act3.polaroidEject, 0);
  assert.equal(act3.boothAlarmActive, 0);

  const act4 = evaluateLsassChoreography(0.78);
  assert.equal(act4.actIndex, 3);
  assert.ok(act4.polaroidEject > 0.9);
  assert.ok(act4.envelopeSealed > 0.5);
  assert.equal(act4.boothAlarmActive, 0);

  const act5 = evaluateLsassChoreography(0.95);
  assert.equal(act5.actIndex, 4);
  assert.ok(act5.boothAlarmActive > 0.9);
  assert.ok(act5.callTraceBeam > 0.85);
});

test('LSASS choreography respects OPEN and SEALED cutaway overrides', () => {
  const forcedOpen = evaluateLsassChoreography(0.05, 'OPEN');
  assert.equal(forcedOpen.cutawayOpen, 1);

  const forcedSealed = evaluateLsassChoreography(0.55, 'SEALED');
  assert.equal(forcedSealed.cutawayOpen, 0);
});

test('MOD-18 standalone LSASS per-section engines drive Steps 1..4 & PPL Diff deterministically', () => {
  const s1 = evaluateLsassStep1State(13.0);
  assert.equal(s1.phase, 2);
  assert.equal(s1.pidLocked, true);

  const s2 = evaluateLsassStep2State(13.5);
  assert.equal(s2.phase, 2);
  assert.ok(s2.xrayConeActive > 0.8);
  assert.equal(evaluateLsassStep2State(0.2, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateLsassStep2State(10, 'SEALED').cutawayOpen, 0);

  const s3 = evaluateLsassStep3State(13.5);
  assert.equal(s3.phase, 2);
  assert.equal(s3.mdmpStamped, true);

  const s4 = evaluateLsassStep4State(13.5);
  assert.equal(s4.phase, 2);
  assert.equal(s4.isolated, true);

  const mem = evaluateLsassMemoryPplDiffState(13.5);
  assert.equal(mem.phase, 2);
  assert.ok(mem.shieldRepelPulse > 0.8);
});
