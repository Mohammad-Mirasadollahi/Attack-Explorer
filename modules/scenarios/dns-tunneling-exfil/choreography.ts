/**
 * Dedicated 5-Act Choreography Engine for Scenario #048 (`dns-tunneling-exfil`).
 * Bespoke Universe: Coastal Lighthouse Signal Tower & Carrier-Pigeon Postal Relay.
 * Pure, deterministic, side-effect-free math — unit tested via `node:test`.
 */

export const DNSTUN_BRIEFING_DURATION_SEC = 20;

export type DnsTunnelCutawayMode =
  | 'LEDGER_SLICING'
  | 'DESK_ATTRIBUTION'
  | 'LIGHTHOUSE_RELAY'
  | 'ENTROPY_ALARM'
  | 'SINKHOLE_NET';

export interface DnsTunnelChoreographyState {
  actIndex: 1 | 2 | 3 | 4 | 5;
  cutawayMode: DnsTunnelCutawayMode;
  /** 0..1 progress of ledger strips being sliced at harbor clerk desk */
  sliceProgress: number;
  /** 0..1 cutaway glass opening over indoor dispatch desk (Sysmon EID 22) */
  deskCutawayOpen: number;
  /** 0..1 carrier-pigeon flight progress from desk -> postmaster -> offshore lighthouse */
  pigeonFlightProgress: number;
  /** 0..1 offshore lighthouse lantern beacon intensity (TXT response channel) */
  lighthouseBeaconPulse: number;
  /** 0..1 coastguard Shannon-entropy alarm glow */
  entropyAlarmIntensity: number;
  /** 0..1 emerald RPZ sinkhole net drop over offshore lighthouse */
  sinkholeNetDrop: number;
  /** true once emerald egress lock & RPZ sinkhole seal the rogue domain */
  egressLocked: boolean;
}

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const seg = (t: number, start: number, end: number): number =>
  clamp01((t - start) / Math.max(0.0001, end - start));

export function evaluateDnsTunnelChoreography(
  elapsedSec: number
): DnsTunnelChoreographyState {
  const t =
    ((elapsedSec % DNSTUN_BRIEFING_DURATION_SEC) + DNSTUN_BRIEFING_DURATION_SEC) %
    DNSTUN_BRIEFING_DURATION_SEC;

  if (t < 4.2) {
    const p = seg(t, 0, 4.2);
    return {
      actIndex: 1,
      cutawayMode: 'LEDGER_SLICING',
      sliceProgress: p,
      deskCutawayOpen: 0,
      pigeonFlightProgress: 0,
      lighthouseBeaconPulse: 0.15,
      entropyAlarmIntensity: 0,
      sinkholeNetDrop: 0,
      egressLocked: false,
    };
  }

  if (t < 8.8) {
    const p = seg(t, 4.2, 8.8);
    return {
      actIndex: 2,
      cutawayMode: 'DESK_ATTRIBUTION',
      sliceProgress: 1,
      deskCutawayOpen: clamp01(p * 1.4),
      pigeonFlightProgress: p * 0.35,
      lighthouseBeaconPulse: 0.25,
      entropyAlarmIntensity: p * 0.2,
      sinkholeNetDrop: 0,
      egressLocked: false,
    };
  }

  if (t < 13.8) {
    const p = seg(t, 8.8, 13.8);
    return {
      actIndex: 3,
      cutawayMode: 'LIGHTHOUSE_RELAY',
      sliceProgress: 1,
      deskCutawayOpen: 1,
      pigeonFlightProgress: 0.35 + p * 0.65,
      lighthouseBeaconPulse: 0.4 + 0.6 * Math.abs(Math.sin(p * Math.PI * 3)),
      entropyAlarmIntensity: 0.25 + p * 0.45,
      sinkholeNetDrop: 0,
      egressLocked: false,
    };
  }

  if (t < 17.0) {
    const p = seg(t, 13.8, 17.0);
    return {
      actIndex: 4,
      cutawayMode: 'ENTROPY_ALARM',
      sliceProgress: 1,
      deskCutawayOpen: 1,
      pigeonFlightProgress: 1,
      lighthouseBeaconPulse: 0.9,
      entropyAlarmIntensity: 0.7 + p * 0.3,
      sinkholeNetDrop: p * 0.25,
      egressLocked: false,
    };
  }

  const p = seg(t, 17.0, 20.0);
  return {
    actIndex: 5,
    cutawayMode: 'SINKHOLE_NET',
    sliceProgress: 1,
    deskCutawayOpen: 1 - p * 0.35,
    pigeonFlightProgress: 1,
    lighthouseBeaconPulse: 0.12 * (1 - p),
    entropyAlarmIntensity: 1 - p * 0.6,
    sinkholeNetDrop: 0.25 + p * 0.75,
    egressLocked: p >= 0.35,
  };
}
