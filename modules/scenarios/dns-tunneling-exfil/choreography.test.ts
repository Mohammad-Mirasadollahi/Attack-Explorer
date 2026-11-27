import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DNSTUN_BRIEFING_DURATION_SEC,
  evaluateDnsTunnelChoreography,
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
