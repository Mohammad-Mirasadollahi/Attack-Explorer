import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  THREECX_STORY_ACTS,
  evaluateThreeCxChoreography,
  getActiveThreeCxActIndex,
} from './choreography';

describe('3cx-desktopapp-supply-chain-lazarus choreography state machine', () => {
  it('covers 0.0 to 1.0 continuously across all 5 acts', () => {
    assert.equal(THREECX_STORY_ACTS.length, 5);
    assert.equal(THREECX_STORY_ACTS[0].startNorm, 0);
    assert.equal(THREECX_STORY_ACTS[THREECX_STORY_ACTS.length - 1].endNorm, 1);
    for (let i = 1; i < THREECX_STORY_ACTS.length; i++) {
      assert.equal(
        THREECX_STORY_ACTS[i].startNorm,
        THREECX_STORY_ACTS[i - 1].endNorm
      );
    }
    assert.equal(getActiveThreeCxActIndex(-0.5), 0);
    assert.equal(getActiveThreeCxActIndex(1.5), 4);
  });

  it('Act 1 inserts rigged audio gear and prism core BEFORE official hologram signing', () => {
    const mid = evaluateThreeCxChoreography(0.11);
    assert.equal(mid.actIndex, 0);
    assert.ok(mid.sabotageArmExtend > 0.7);
    assert.ok(mid.riggedPartsSeated > 0.4);
    assert.equal(mid.hologramAuthentic, false);
  });

  it('Act 2 closes phone lid, stamps genuine gold hologram seal, and inspector waves it through', () => {
    const stamp = evaluateThreeCxChoreography(0.27);
    assert.equal(stamp.actIndex, 1);
    assert.ok(stamp.hologramPressDown > 0.7);
    assert.equal(stamp.hologramAuthentic, true);

    const wave = evaluateThreeCxChoreography(0.36);
    assert.equal(wave.hologramAuthentic, true);
    assert.equal(wave.inspectorGreenPass, 1);
  });

  it('Act 3 opens customer desk phone cutaway, cracks prism core, and unwinds cipher spool', () => {
    const f = evaluateThreeCxChoreography(0.58);
    assert.equal(f.actIndex, 2);
    assert.equal(f.phoneConveyorProgress, 1);
    assert.equal(f.cutawayOpen, 1);
    assert.ok(f.riggedGearSpin > 5);
    assert.equal(f.prismCoreCracked, 1);
    assert.ok(f.cipherSpoolUnwound > 0.7);
  });

  it('Act 4 scans framed icon tile #4 and peels the hidden crimson border strip', () => {
    const f = evaluateThreeCxChoreography(0.78);
    assert.equal(f.actIndex, 3);
    assert.ok(f.galleryScanBeam > 0.8);
    assert.ok(f.hiddenStripPeeled > 0.75);
  });

  it('Act 5 siphons browser keycards, engages selective VIP vault, triggers EDR watch, and respects cutaway overrides', () => {
    const f = evaluateThreeCxChoreography(0.96);
    assert.equal(f.actIndex, 4);
    assert.equal(f.hologramAuthentic, true);
    assert.equal(f.keycardSiphon, 1);
    assert.equal(f.vipVaultTether, 1);
    assert.ok(f.edrBehavioralAlert > 0.9);

    assert.equal(evaluateThreeCxChoreography(0.27, 'OPEN').cutawayOpen, 1);
    assert.equal(evaluateThreeCxChoreography(0.55, 'SEALED').cutawayOpen, 0);
  });
});
