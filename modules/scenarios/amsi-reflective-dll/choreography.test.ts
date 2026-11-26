import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AMSI_STORY_ACTS,
  AMSI_TIMELINE_DURATION_SEC,
  evaluateAmsiChoreography,
  getActiveAmsiActIndex,
} from './choreography';

describe('amsi-reflective-dll choreography state machine', () => {
  it('covers 0.0 to 1.0 seamlessly across all 5 continuous acts', () => {
    assert.equal(AMSI_STORY_ACTS.length, 5);
    assert.equal(AMSI_TIMELINE_DURATION_SEC, 20);
    assert.equal(AMSI_STORY_ACTS[0].start, 0);
    assert.equal(AMSI_STORY_ACTS[AMSI_STORY_ACTS.length - 1].end, 1);
    for (let i = 1; i < AMSI_STORY_ACTS.length; i += 1) {
      assert.equal(AMSI_STORY_ACTS[i].start, AMSI_STORY_ACTS[i - 1].end);
    }
    assert.equal(getActiveAmsiActIndex(0.05), 0);
    assert.equal(getActiveAmsiActIndex(0.28), 1);
    assert.equal(getActiveAmsiActIndex(0.50), 2);
    assert.equal(getActiveAmsiActIndex(0.75), 3);
    assert.equal(getActiveAmsiActIndex(0.95), 4);
  });

  it('Act 1 demonstrates live X-Ray enforcement blocking the red canister with live Watchtower wire', () => {
    const midAlert = evaluateAmsiChoreography(0.15, 'AUTO');
    assert.equal(midAlert.actIndex, 0);
    assert.equal(midAlert.redCanisterVisible, true);
    assert.ok(midAlert.dropGateClosed > 0.9, 'drop-gate must slam closed on red canister');
    assert.ok(midAlert.xrayAlertLevel > 0.5, 'X-Ray alert beam must flare crimson');
    assert.equal(midAlert.watchtowerWireLive, 1, 'Watchtower wire must be live before patch');
    assert.equal(midAlert.brassJumperInserted, 0);
  });

  it('Act 2 unlocks the glass hatch (VirtualProtect 0x40), reels EID 4104 tape, and fires UV sensor', () => {
    const unlock = evaluateAmsiChoreography(0.35, 'AUTO');
    assert.equal(unlock.actIndex, 1);
    assert.equal(unlock.wrenchVisible, true);
    assert.ok(unlock.hatchOpenRad > 1.2, 'Glass safety hatch must swing open');
    assert.ok(unlock.rwxUnlockGlow > 0.8, 'Amber RWX unlock glow must illuminate chamber');
    assert.ok(unlock.paperTapeLength > 0.8, 'Paper-tape EID 4104 transcript must reel out before patch');
    assert.ok(unlock.uvHingeBeacon > 0.4, 'Violet UV hinge sensor (EtwTiLogProtectVM) must fire');
  });

  it('Act 3 pulls 6 copper fuses, seats the 6-pin brass jumper, cuts Watchtower wire, and re-locks hatch', () => {
    const swapMid = evaluateAmsiChoreography(0.51, 'AUTO');
    assert.equal(swapMid.actIndex, 2);
    assert.equal(swapMid.copperFusesExtracted, 1, 'All 6 copper fuses must be extracted');
    assert.ok(swapMid.brassJumperInserted > 0.4, 'Brass jumper must be seating into slots 1..6');
    assert.ok(swapMid.cutawayAmount > 0.9, 'AUTO cutaway must expose interior fuse cavity in Act 3');

    const postRelock = evaluateAmsiChoreography(0.615, 'AUTO');
    assert.equal(postRelock.brassJumperInserted, 1);
    assert.equal(postRelock.watchtowerWireLive, 0, 'Watchtower copper cable must be dead after jumper seats');
    assert.equal(postRelock.hatchOpenRad, 0, 'Glass hatch must re-lock back to cool blue RX 0x20');
    assert.equal(postRelock.rwxUnlockGlow, 0, 'RWX unlock glow must clear upon VirtualProtect restore');
  });

  it('Act 4 & Act 5 assemble the hovering drone mid-air while keeping the NTFS floor scale at 0.0 kg', () => {
    for (const sampleT of [0.0, 0.15, 0.35, 0.55, 0.72, 0.82, 0.95, 1.0]) {
      const s = evaluateAmsiChoreography(sampleT, 'AUTO');
      assert.equal(
        s.warehouseScaleKg,
        0,
        `NTFS floor scale must remain 0.0 kg at t=${sampleT}`
      );
    }

    const assembly = evaluateAmsiChoreography(0.75, 'AUTO');
    assert.equal(assembly.actIndex, 3);
    assert.equal(assembly.airTubeDropProgress, 1);
    assert.ok(assembly.skipPulseActive > 0.5, 'Rigged jumper must bounce SKIP pulse during Act 4');
    assert.equal(assembly.dropGateClosed, 0, 'Drop-gate must stay open because Watchtower is blind');
    assert.ok(assembly.droneHoverY > 1.8, 'Reflective drone must levitate cleanly off the floor');

    const finale = evaluateAmsiChoreography(0.94, 'AUTO');
    assert.equal(finale.actIndex, 4);
    assert.equal(finale.droneAssemblyProgress, 1);
    assert.equal(finale.watchtowerWireLive, 0);
    assert.ok(finale.paperTapeLength > 0.95);
    assert.ok(finale.uvHingeBeacon > 0.8, 'Forensic UV witness must remain visible in finale');
  });

  it('respects explicit OPEN and SEALED cutaway overrides', () => {
    assert.equal(evaluateAmsiChoreography(0.1, 'OPEN').cutawayAmount, 1);
    assert.equal(evaluateAmsiChoreography(0.5, 'SEALED').cutawayAmount, 0);
  });
});
