import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  LOCKBIT_STORY_ACTS,
  evaluateLockbitChoreography,
  evaluateLockbitStep1State,
  evaluateLockbitStep2State,
  evaluateLockbitStep3State,
  evaluateLockbitStep4State,
  getActiveLockbitActIndex,
} from './choreography';

describe('ransomware-shadow-wipe choreography state machine', () => {
  it('covers 0.0 to 1.0 continuously across all 5 acts', () => {
    assert.equal(LOCKBIT_STORY_ACTS.length, 5);
    assert.equal(LOCKBIT_STORY_ACTS[0].startNorm, 0);
    assert.equal(LOCKBIT_STORY_ACTS[LOCKBIT_STORY_ACTS.length - 1].endNorm, 1);
    for (let i = 1; i < LOCKBIT_STORY_ACTS.length; i++) {
      assert.equal(
        LOCKBIT_STORY_ACTS[i].startNorm,
        LOCKBIT_STORY_ACTS[i - 1].endNorm
      );
    }
    assert.equal(getActiveLockbitActIndex(-0.2), 0);
    assert.equal(getActiveLockbitActIndex(1.4), 4);
  });

  it('Act 1 keeps all 4 backup reels intact, recovery lever upright, and filing vaults unlocked', () => {
    const f = evaluateLockbitChoreography(0.08);
    assert.equal(f.actIndex, 0);
    assert.equal(f.capsuleProgress, 0);
    assert.deepEqual(f.reelShredProgress, [0, 0, 0, 0]);
    assert.equal(f.recoveryLeverSnapped, 0);
    assert.deepEqual(f.padlockShut, [0, 0, 0, 0]);
    assert.equal(f.ransomPlacardBolted, 0);
  });

  it('Act 2 dispatches the remote service capsule and throws the master breaker', () => {
    const f = evaluateLockbitChoreography(0.34);
    assert.equal(f.actIndex, 1);
    assert.equal(f.capsuleProgress, 1);
    assert.ok(f.breakerDown > 0.8);
    assert.ok(f.auditBeaconLevel > 0.3);
  });

  it('Act 3 feeds all 4 silver backup reels into the shredder and snaps the green recovery lever', () => {
    const mid = evaluateLockbitChoreography(0.49);
    assert.equal(mid.actIndex, 2);
    assert.ok(mid.shredderSpin > 0.8);
    assert.ok(mid.reelShredProgress[0] === 1);
    assert.ok(mid.ribbonHeapLevel > 0.4);
    assert.ok(mid.cutawayOpen > 0.9);

    const end = evaluateLockbitChoreography(0.595);
    assert.deepEqual(end.reelShredProgress, [1, 1, 1, 1]);
    assert.equal(end.recoveryLeverSnapped, 1);
  });

  it('Act 4 triggers 4 parallel gantry arms locking only the top ledger header while leaving 85% body untouched', () => {
    const peak = evaluateLockbitChoreography(0.69);
    assert.equal(peak.actIndex, 3);
    assert.ok(peak.gantryArmPlunge.some((v) => v > 0.6));
    assert.equal(peak.bodyUntouchedRatio, 0.85);

    const locked = evaluateLockbitChoreography(0.835);
    assert.deepEqual(locked.ledgerHeaderLocked, [1, 1, 1, 1]);
    assert.deepEqual(locked.padlockShut, [1, 1, 1, 1]);
  });

  it('Act 5 bolts the extortion placard, flips wallpaper crimson, activates EID 1102 alarm, and honors cutaway overrides', () => {
    const finale = evaluateLockbitChoreography(0.95);
    assert.equal(finale.actIndex, 4);
    assert.equal(finale.ransomPlacardBolted, 1);
    assert.equal(finale.wallpaperCrimson, 1);
    assert.equal(finale.auditWipeAlarmActive, true);

    assert.equal(evaluateLockbitChoreography(0.1, 'OPEN').cutawayOpen, 1);
    assert.equal(evaluateLockbitChoreography(0.5, 'SEALED').cutawayOpen, 0);
  });

  it('MOD-18 standalone per-section engines drive Steps 1..4 deterministically with cutaway overrides', () => {
    const s1Late = evaluateLockbitStep1State(10.5);
    assert.equal(s1Late.phase, 2);
    assert.equal(s1Late.alarmAmber, true);
    assert.ok(s1Late.auditTickerExtend > 0.7);
    assert.equal(evaluateLockbitStep1State(1, 'OPEN').cutawayOpen, 1);
    assert.equal(evaluateLockbitStep1State(8, 'SEALED').cutawayOpen, 0);

    const s2Late = evaluateLockbitStep2State(12.2);
    assert.equal(s2Late.phase, 2);
    assert.equal(s2Late.leverSnapped, true);
    assert.equal(s2Late.vssStopped, true);

    const s3Late = evaluateLockbitStep3State(12.8);
    assert.equal(s3Late.phase, 2);
    assert.equal(s3Late.bodyUntouchedRatio, 0.85);
    assert.equal(s3Late.lockedFileCount, 4820);

    const s4Late = evaluateLockbitStep4State(10.8);
    assert.equal(s4Late.phase, 2);
    assert.equal(s4Late.wallpaperFlipped, true);
    assert.equal(s4Late.eid1102Active, true);
  });
});
