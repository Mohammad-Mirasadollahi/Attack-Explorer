import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_PROCESS_HOLLOWING_SUBSTEPS,
  PROCESS_HOLLOWING_CINEMATIC_SPECS,
  PROCESS_HOLLOWING_SCROLL_CHAPTERS,
  computeProcessHollowingVisualState,
  getChapterByStage,
  getProcessHollowingSubStepCinematicSpec,
  getSubStepById,
} from './process-hollowing-scrollytelling';

test('PROCESS_HOLLOWING_SCROLL_CHAPTERS covers stages 0 through 5 with 24 ordered cinematic sub-steps (4 per stage)', () => {
  assert.equal(PROCESS_HOLLOWING_SCROLL_CHAPTERS.length, 6);
  assert.deepEqual(
    PROCESS_HOLLOWING_SCROLL_CHAPTERS.map((c) => c.stageNumber),
    [0, 1, 2, 3, 4, 5]
  );
  assert.equal(ALL_PROCESS_HOLLOWING_SUBSTEPS.length, 24);
  assert.deepEqual(
    ALL_PROCESS_HOLLOWING_SUBSTEPS.map((s) => s.id),
    [
      '0A',
      '0B',
      '0C',
      '0D',
      '1A',
      '1B',
      '1C',
      '1D',
      '2A',
      '2B',
      '2C',
      '2D',
      '3A',
      '3B',
      '3C',
      '3D',
      '4A',
      '4B',
      '4C',
      '4D',
      '5A',
      '5B',
      '5C',
      '5D',
    ]
  );
});

test('Step 1 (01:34-02:22) transitions cleanly from 1A (CreateProcessW) -> 1B (EPROCESS/PEB) -> 1C (CREATE_SUSPENDED) -> 1D (hProcess 0x01C4 & hThread 0x01C8)', () => {
  const state1A = computeProcessHollowingVisualState(1, 0.1);
  assert.equal(state1A.activeSubStepId, '1A');
  assert.equal(state1A.kernelEprocessCreated, false);
  assert.equal(state1A.createSuspendedFlagActive, false);
  assert.equal(state1A.svchostThreadState, 'STANDBY');
  assert.equal(state1A.hasProcessHandle, false);

  const state1B = computeProcessHollowingVisualState(1, 0.35);
  assert.equal(state1B.activeSubStepId, '1B');
  assert.equal(state1B.kernelEprocessCreated, true);
  assert.equal(state1B.createSuspendedFlagActive, false);
  assert.equal(state1B.svchostThreadState, 'STANDBY');

  const state1C = computeProcessHollowingVisualState(1, 0.6);
  assert.equal(state1C.activeSubStepId, '1C');
  assert.equal(state1C.kernelEprocessCreated, true);
  assert.equal(state1C.createSuspendedFlagActive, true);
  assert.equal(state1C.svchostThreadState, 'FROZEN');
  assert.equal(state1C.hasProcessHandle, false);

  const state1D = computeProcessHollowingVisualState(1, 0.9);
  assert.equal(state1D.activeSubStepId, '1D');
  assert.equal(state1D.createSuspendedFlagActive, true);
  assert.equal(state1D.svchostThreadState, 'FROZEN');
  assert.equal(state1D.hasProcessHandle, true);
  assert.equal(state1D.hasThreadHandle, true);
  assert.match(state1D.loaderHandlesText, /0x01C4/);
  assert.match(state1D.loaderHandlesText, /0x01C8/);
});

test('Step 2 transitions across 2A (PEB+0x10) -> 2B (Signed PE Sections) -> 2C (NtUnmapViewOfSection Syscall) -> 2D (Unmapped Memory Void)', () => {
  const state2A = computeProcessHollowingVisualState(2, 0.1);
  assert.equal(state2A.activeSubStepId, '2A');
  assert.equal(state2A.pebQueried, true);
  assert.equal(state2A.peSectionsInspected, false);
  assert.equal(state2A.memoryUnmapped, false);

  const state2B = computeProcessHollowingVisualState(2, 0.35);
  assert.equal(state2B.activeSubStepId, '2B');
  assert.equal(state2B.peSectionsInspected, true);
  assert.equal(state2B.unmapSyscallActive, false);

  const state2C = computeProcessHollowingVisualState(2, 0.6);
  assert.equal(state2C.activeSubStepId, '2C');
  assert.equal(state2C.unmapSyscallActive, true);
  assert.equal(state2C.memoryUnmapped, false);

  const state2D = computeProcessHollowingVisualState(2, 0.9);
  assert.equal(state2D.activeSubStepId, '2D');
  assert.equal(state2D.memoryUnmapped, true);
});

test('Step 3 transitions across 3A (VirtualAllocEx RWX) -> 3B (MZ/PE Headers) -> 3C (270,336 Bytes) -> 3D (Sysmon EID 10 & VAD Anomaly)', () => {
  const state3A = computeProcessHollowingVisualState(3, 0.1);
  assert.equal(state3A.activeSubStepId, '3A');
  assert.equal(state3A.rwxAllocated, true);
  assert.equal(state3A.peHeadersWritten, false);
  assert.equal(state3A.payloadBytesCommitted, 0);

  const state3B = computeProcessHollowingVisualState(3, 0.35);
  assert.equal(state3B.activeSubStepId, '3B');
  assert.equal(state3B.peHeadersWritten, true);
  assert.equal(state3B.payloadBytesCommitted, 94618);

  const state3C = computeProcessHollowingVisualState(3, 0.6);
  assert.equal(state3C.activeSubStepId, '3C');
  assert.equal(state3C.payloadWritten, true);
  assert.equal(state3C.payloadBytesCommitted, 270336);

  const state3D = computeProcessHollowingVisualState(3, 0.9);
  assert.equal(state3D.activeSubStepId, '3D');
  assert.equal(state3D.vadAnomalyFlagged, true);
  assert.equal(state3D.payloadBytesCommitted, 270336);
  assert.match(state3D.activeSysmonBadge, /SYSMON EVENT ID 10/);
});

test('Step 4 transitions across 4A (RCX = 0x00412000) -> 4B (RCX = 0x004014A0) -> 4C (ResumeThread SuspendCount = 0) -> 4D (Sysmon EID 25)', () => {
  const state4A = computeProcessHollowingVisualState(4, 0.1);
  assert.equal(state4A.activeSubStepId, '4A');
  assert.equal(state4A.rcxEntryPoint, '0x00412000');
  assert.equal(state4A.suspendCount, 1);
  assert.equal(state4A.svchostThreadState, 'FROZEN');

  const state4B = computeProcessHollowingVisualState(4, 0.35);
  assert.equal(state4B.activeSubStepId, '4B');
  assert.equal(state4B.rcxEntryPoint, '0x004014A0');
  assert.equal(state4B.suspendCount, 1);

  const state4C = computeProcessHollowingVisualState(4, 0.6);
  assert.equal(state4C.activeSubStepId, '4C');
  assert.equal(state4C.rcxEntryPoint, '0x004014A0');
  assert.equal(state4C.suspendCount, 0);
  assert.equal(state4C.svchostThreadState, 'HIJACKED_RUNNING');

  const state4D = computeProcessHollowingVisualState(4, 0.9);
  assert.equal(state4D.activeSubStepId, '4D');
  assert.equal(state4D.tamperingEventFired, true);
  assert.match(state4D.activeSysmonBadge, /SYSMON EVENT ID 25/);
});

test('Step 5 transitions across 5A (Edge Firewall PASS) -> 5B (Malleable Profile) -> 5C (60s Heartbeat) -> 5D (SIEM FFT Spectrum Lock)', () => {
  const state5A = computeProcessHollowingVisualState(5, 0.1);
  assert.equal(state5A.activeSubStepId, '5A');
  assert.equal(state5A.firewallPassed, true);
  assert.equal(state5A.malleableProfileActive, false);

  const state5B = computeProcessHollowingVisualState(5, 0.35);
  assert.equal(state5B.activeSubStepId, '5B');
  assert.equal(state5B.malleableProfileActive, true);
  assert.equal(state5B.c2BeaconActive, false);

  const state5C = computeProcessHollowingVisualState(5, 0.6);
  assert.equal(state5C.activeSubStepId, '5C');
  assert.equal(state5C.c2BeaconActive, true);
  assert.equal(state5C.fftSpectrumLocked, false);

  const state5D = computeProcessHollowingVisualState(5, 0.9);
  assert.equal(state5D.activeSubStepId, '5D');
  assert.equal(state5D.c2BeaconActive, true);
  assert.equal(state5D.fftSpectrumLocked, true);
  assert.match(state5D.activeSysmonBadge, /FFT PERIODICITY MATCH/);
});

test('Every sub-step 0A..5D defines 3 micro-beats (72 total beats), extracted tokens bound to anatomical shapes, and deterministic intra-step beat progression', () => {
  const allSpecs = Object.values(PROCESS_HOLLOWING_CINEMATIC_SPECS);
  assert.equal(allSpecs.length, 24);

  const persianRegex = /[\u0600-\u06FF]/;
  for (const spec of allSpecs) {
    assert.equal(spec.microBeats.length, 3);
    assert.deepEqual(
      spec.microBeats.map((b) => b.code),
      ['MOTION ①', 'MOTION ②', 'MOTION ③']
    );
    assert.ok(spec.extractedTokens.length >= 3);
    for (const token of spec.extractedTokens) {
      assert.equal(persianRegex.test(token.token), false);
      assert.equal(persianRegex.test(token.motionCue), false);
    }
    for (const beat of spec.microBeats) {
      assert.equal(persianRegex.test(beat.title), false);
      assert.equal(persianRegex.test(beat.mutationSummary), false);
    }
  }

  // Verify intra-substep micro-beat progression within sub-step 4B (0.25 .. 0.50 of Stage 4)
  const beat0 = computeProcessHollowingVisualState(4, 0.27);
  assert.equal(beat0.activeSubStepId, '4B');
  assert.equal(beat0.activeMicroBeatIndex, 0);
  assert.equal(beat0.activeMicroBeat.code, 'MOTION ①');

  const beat1 = computeProcessHollowingVisualState(4, 0.36);
  assert.equal(beat1.activeSubStepId, '4B');
  assert.equal(beat1.activeMicroBeatIndex, 1);
  assert.equal(beat1.activeMicroBeat.code, 'MOTION ②');

  const beat2 = computeProcessHollowingVisualState(4, 0.47);
  assert.equal(beat2.activeSubStepId, '4B');
  assert.equal(beat2.activeMicroBeatIndex, 2);
  assert.equal(beat2.activeMicroBeat.code, 'MOTION ③');

  assert.equal(
    getProcessHollowingSubStepCinematicSpec('3B').primaryShapeId,
    'shape-ram-0x00400000'
  );
});

test('All chapter and sub-step strings are strictly English with zero Persian characters', () => {
  const persianRegex = /[\u0600-\u06FF]/;
  for (const chapter of PROCESS_HOLLOWING_SCROLL_CHAPTERS) {
    assert.equal(persianRegex.test(chapter.title), false);
    assert.equal(persianRegex.test(chapter.storyAnalogy), false);
    for (const sub of chapter.subSteps) {
      assert.equal(persianRegex.test(sub.headline), false);
      assert.equal(persianRegex.test(sub.narrativeSummary), false);
      assert.equal(persianRegex.test(sub.technicalMechanism), false);
    }
  }
  assert.equal(getChapterByStage(99).stageNumber, 0);
  assert.equal(getSubStepById('1D').stageNumber, 1);
});

