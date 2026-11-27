import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DNSTUN_BRIEFING_DURATION_SEC,
  DNSTUN_STEP_DURATION_SEC,
  evaluateDnsTunnelChoreography,
  evaluateDnstunMemoryDiffState,
  evaluateDnstunStep1State,
  evaluateDnstunStep2State,
  evaluateDnstunStep3State,
  evaluateDnstunStep4State,
} from './choreography';

test('dns-tunneling choreography progresses cleanly through all 5 acts', () => {
  const a1 = evaluateDnsTunnelChoreography(1.5);
  assert.equal(a1.actIndex, 1);
  assert.equal(a1.cutawayMode, 'LEDGER_SLICING');
  assert.ok(a1.sliceProgress > 0 && a1.sliceProgress < 1);
  assert.equal(a1.egressLocked, false);

  const a2 = evaluateDnsTunnelChoreography(6.4);
  assert.equal(a2.actIndex, 2);
  assert.equal(a2.cutawayMode, 'DESK_ATTRIBUTION');
  assert.ok(a2.deskCutawayOpen > 0.5);

  const a3 = evaluateDnsTunnelChoreography(11.5);
  assert.equal(a3.actIndex, 3);
  assert.equal(a3.cutawayMode, 'LIGHTHOUSE_RELAY');
  assert.ok(a3.pigeonFlightProgress > 0.5);
  assert.ok(a3.lighthouseBeaconPulse > 0.3);

  const a4 = evaluateDnsTunnelChoreography(15.4);
  assert.equal(a4.actIndex, 4);
  assert.equal(a4.cutawayMode, 'ENTROPY_ALARM');
  assert.ok(a4.entropyAlarmIntensity > 0.8);

  const a5 = evaluateDnsTunnelChoreography(19.2);
  assert.equal(a5.actIndex, 5);
  assert.equal(a5.cutawayMode, 'SINKHOLE_NET');
  assert.ok(a5.sinkholeNetDrop > 0.75);
  assert.equal(a5.egressLocked, true);
});

test('dns-tunneling choreography wraps seamlessly at 20s and negative timestamps', () => {
  const start = evaluateDnsTunnelChoreography(0.5);
  const wrapped = evaluateDnsTunnelChoreography(DNSTUN_BRIEFING_DURATION_SEC + 0.5);
  assert.deepEqual(start, wrapped);

  const neg = evaluateDnsTunnelChoreography(-1.0);
  assert.equal(neg.actIndex, 5);
  assert.equal(neg.egressLocked, true);
});

test('dns-tunneling standalone step & memory evaluators progress deterministically across 3 phases', () => {
  assert.equal(DNSTUN_STEP_DURATION_SEC, 15);

  const s1Mid = evaluateDnstunStep1State(0.55, 'AUTO');
  const s1Late = evaluateDnstunStep1State(0.92, 'AUTO');
  assert.equal(s1Mid.phaseIndex, 1);
  assert.ok(s1Mid.stripLiftProgress > 0.6 && s1Late.skylightLockBeam > 0.85);
  assert.equal(evaluateDnstunStep1State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDnstunStep1State(0.85, 'SEALED').cutawayOpen, 0);

  const s2Mid = evaluateDnstunStep2State(0.58, 'AUTO');
  const s2Late = evaluateDnstunStep2State(0.92, 'AUTO');
  assert.ok(s2Mid.pigeonArcProgress > 0.9 && s2Late.zeekHubMonitor > 0.85);
  assert.equal(evaluateDnstunStep2State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDnstunStep2State(0.85, 'SEALED').cutawayOpen, 0);

  const s3Mid = evaluateDnstunStep3State(0.60, 'AUTO');
  const s3Late = evaluateDnstunStep3State(0.92, 'AUTO');
  assert.ok(s3Mid.entropySpikeHeight > 0.7 && s3Late.nodAlarmFlare > 0.85);
  assert.equal(evaluateDnstunStep3State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDnstunStep3State(0.85, 'SEALED').cutawayOpen, 0);

  const s4Mid = evaluateDnstunStep4State(0.60, 'AUTO');
  const s4Late = evaluateDnstunStep4State(0.92, 'AUTO');
  assert.ok(s4Mid.seawallShutterRaise > 0.6 && s4Late.workstationQuarantine > 0.85);
  assert.equal(evaluateDnstunStep4State(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDnstunStep4State(0.85, 'SEALED').cutawayOpen, 0);

  const memMid = evaluateDnstunMemoryDiffState(0.55, 'AUTO');
  const memLate = evaluateDnstunMemoryDiffState(0.92, 'AUTO');
  assert.equal(memMid.phaseIndex, 1);
  assert.ok(memMid.forensicBeamSweep > 0.5 && memLate.rpzSinkholeGlow > 0.85);
  assert.equal(evaluateDnstunMemoryDiffState(0.02, 'OPEN').cutawayOpen, 1);
  assert.equal(evaluateDnstunMemoryDiffState(0.85, 'SEALED').cutawayOpen, 0);
});
