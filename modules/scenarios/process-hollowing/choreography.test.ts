import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateHollowingSceneState,
  getActIndexForTime,
  getActMidpointTime,
  HOLLOWING_STORY_ACTS,
  TRUCK_GARAGE_X,
  TRUCK_GATE_PASS_X,
} from './choreography';

test('HOLLOWING_STORY_ACTS covers [0, 1] continuously across 6 acts', () => {
  assert.equal(HOLLOWING_STORY_ACTS.length, 6);
  assert.equal(HOLLOWING_STORY_ACTS[0].startT, 0);
  assert.equal(HOLLOWING_STORY_ACTS[HOLLOWING_STORY_ACTS.length - 1].endT, 1);

  for (let i = 1; i < HOLLOWING_STORY_ACTS.length; i += 1) {
    assert.equal(
      HOLLOWING_STORY_ACTS[i].startT,
      HOLLOWING_STORY_ACTS[i - 1].endT,
      `Act ${i} startT must match previous act endT`
    );
  }
});

test('Act 1 keeps truck parked in garage with legal cargo intact and front-door alarm contrast active', () => {
  const s = evaluateHollowingSceneState(getActMidpointTime(0));
  assert.equal(s.activeActIndex, 0);
  assert.equal(s.truckX, TRUCK_GARAGE_X);
  assert.equal(s.stasisIntensity, 0);
  assert.equal(s.legalCargoUnloaded, 0);
  assert.equal(s.covertCrewLoaded, 0);
  assert.ok(s.frontDoorRejectPulse > 0.5);
});

test('Act 2 freezes the armored truck inside the garage before route starts', () => {
  const s = evaluateHollowingSceneState(0.26);
  assert.equal(s.activeActIndex, 1);
  assert.equal(s.truckX, TRUCK_GARAGE_X);
  assert.ok(s.stasisIntensity > 0.95);
  assert.equal(s.legalCargoUnloaded, 0);
  assert.equal(s.covertCrewLoaded, 0);
});

test('Act 3 opens rear doors + auto cutaway and unloads legal bank cargo while still frozen', () => {
  const s = evaluateHollowingSceneState(0.45);
  assert.equal(s.activeActIndex, 2);
  assert.equal(s.truckX, TRUCK_GARAGE_X);
  assert.ok(s.stasisIntensity > 0.95);
  assert.ok(s.rearDoorOpen > 0.9);
  assert.ok(s.sideCutawayOpen > 0.9);
  assert.ok(s.legalCargoUnloaded > 0.7);
  assert.equal(s.covertCrewLoaded, 0);
});

test('Act 4 loads covert intruder crew inside the emptied armored truck', () => {
  const s = evaluateHollowingSceneState(0.6);
  assert.equal(s.activeActIndex, 3);
  assert.equal(s.truckX, TRUCK_GARAGE_X);
  assert.equal(s.legalCargoUnloaded, 1);
  assert.ok(s.covertCrewLoaded > 0.6);
  assert.ok(s.payloadGlow > 0.4);
});

test('Act 5 shatters stasis, closes doors, releases brake, and accelerates truck forward', () => {
  const s = evaluateHollowingSceneState(0.76);
  assert.equal(s.activeActIndex, 4);
  assert.equal(s.stasisIntensity, 0);
  assert.ok(s.stasisShatter > 0.8);
  assert.equal(s.rearDoorOpen, 0);
  assert.ok(s.truckX > TRUCK_GARAGE_X);
  assert.ok(s.wheelSpin > 0);
  assert.ok(s.brakeReleaseBoost > 0.5);
});

test('Act 6 raises security barrier, guard salutes, and CCTV locks green trusted scan as truck passes gate', () => {
  const s = evaluateHollowingSceneState(0.95);
  assert.equal(s.activeActIndex, 5);
  assert.ok(s.truckX > 8.5 && s.truckX <= TRUCK_GATE_PASS_X);
  assert.equal(s.gateBarrierLift, 1);
  assert.equal(s.guardSalute, 1);
  assert.equal(s.cameraScanLock, 1);
  assert.equal(s.covertCrewLoaded, 1);
});

test('cutawayMode overrides work deterministically', () => {
  const openInAct1 = evaluateHollowingSceneState(0.05, { cutawayMode: 'OPEN' });
  assert.equal(openInAct1.sideCutawayOpen, 1);

  const sealedInAct3 = evaluateHollowingSceneState(0.45, {
    cutawayMode: 'SEALED',
  });
  assert.equal(sealedInAct3.sideCutawayOpen, 0);
});

test('getActIndexForTime clamps out-of-range inputs safely', () => {
  assert.equal(getActIndexForTime(-0.5), 0);
  assert.equal(getActIndexForTime(1.5), 5);
  assert.equal(getActIndexForTime(Number.NaN), 0);
});

test('HOLLOWING_STORY_ACTS contains zero Japanese characters while keeping English stage tags', () => {
  const japaneseRegex = /[\u3040-\u30FF\u4E00-\u9FFF]/;
  for (const act of HOLLOWING_STORY_ACTS) {
    assert.ok(act.stageTag.length > 0, `Act ${act.id} must have stageTag`);
    assert.equal(
      japaneseRegex.test(
        `${act.shortLabel} ${act.stageTag} ${act.title} ${act.storyExcerpt} ${act.technicalParallel}`
      ),
      false,
      `Act ${act.id} must not contain Japanese text characters`
    );
  }
});

test('Anime magic dust, digital glitch, and bloom intensities peak during hollowing and injection', () => {
  const act1 = evaluateHollowingSceneState(getActMidpointTime(0));
  const act4 = evaluateHollowingSceneState(getActMidpointTime(3));
  const act6 = evaluateHollowingSceneState(getActMidpointTime(5));

  assert.ok(act1.magicDustIntensity >= 0.5 && act1.magicDustIntensity <= 1);
  assert.ok(act4.glitchIntensity > act1.glitchIntensity);
  assert.ok(act4.glitchIntensity > 0.8);
  assert.ok(act4.bloomStrength > act1.bloomStrength);
  assert.equal(act4.particlePrimaryHex, '#F43F5E');
  assert.equal(act6.particlePrimaryHex, '#10B981');
});

