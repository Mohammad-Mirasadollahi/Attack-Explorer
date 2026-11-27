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

export const DNSTUN_STEP_DURATION_SEC = 15;
export type DnsTunnelStepCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

function smooth(t: number, start: number, end: number): number {
  const x = seg(t, start, end);
  return x * x * (3 - 2 * x);
}

export interface DnstunStep1Frame {
  phaseIndex: number;
  guillotineSlice: number;
  stripLiftProgress: number;
  skylightLockBeam: number;
  cutawayOpen: number;
}

export function evaluateDnstunStep1State(
  tNormRaw: number,
  cutawayMode: DnsTunnelStepCutawayMode = 'AUTO'
): DnstunStep1Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const guillotineSlice = smooth(t, 0.04, 0.34);
  const stripLiftProgress = smooth(t, 0.24, 0.66);
  const skylightLockBeam = smooth(t, 0.64, 0.94);
  const autoCut = smooth(t, 0.28, 0.42);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    guillotineSlice,
    stripLiftProgress,
    skylightLockBeam,
    cutawayOpen,
  };
}

export interface DnstunStep2Frame {
  phaseIndex: number;
  pigeonArcProgress: number;
  lanternReplyPulse: number;
  zeekHubMonitor: number;
  cutawayOpen: number;
}

export function evaluateDnstunStep2State(
  tNormRaw: number,
  cutawayMode: DnsTunnelStepCutawayMode = 'AUTO'
): DnstunStep2Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const pigeonArcProgress = smooth(t, 0.04, 0.56);
  const lanternReplyPulse = smooth(t, 0.38, 0.74);
  const zeekHubMonitor = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.16, 0.30);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    pigeonArcProgress,
    lanternReplyPulse,
    zeekHubMonitor,
    cutawayOpen,
  };
}

export interface DnstunStep3Frame {
  phaseIndex: number;
  baselineCalmLevel: number;
  entropySpikeHeight: number;
  nodAlarmFlare: number;
  cutawayOpen: number;
}

export function evaluateDnstunStep3State(
  tNormRaw: number,
  cutawayMode: DnsTunnelStepCutawayMode = 'AUTO'
): DnstunStep3Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const baselineCalmLevel = smooth(t, 0.04, 0.32);
  const entropySpikeHeight = smooth(t, 0.32, 0.68);
  const nodAlarmFlare = smooth(t, 0.66, 0.94);
  const autoCut = smooth(t, 0.16, 0.30);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    baselineCalmLevel,
    entropySpikeHeight,
    nodAlarmFlare,
    cutawayOpen,
  };
}

export interface DnstunStep4Frame {
  phaseIndex: number;
  rpzNetDrop: number;
  seawallShutterRaise: number;
  workstationQuarantine: number;
  cutawayOpen: number;
}

export function evaluateDnstunStep4State(
  tNormRaw: number,
  cutawayMode: DnsTunnelStepCutawayMode = 'AUTO'
): DnstunStep4Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const rpzNetDrop = smooth(t, 0.04, 0.35);
  const seawallShutterRaise = smooth(t, 0.35, 0.68);
  const workstationQuarantine = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.14, 0.28);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    rpzNetDrop,
    seawallShutterRaise,
    workstationQuarantine,
    cutawayOpen,
  };
}

export interface DnstunMemoryDiffFrame {
  phaseIndex: number;
  stagingChurnPulse: number;
  forensicBeamSweep: number;
  rpzSinkholeGlow: number;
  cutawayOpen: number;
}

export function evaluateDnstunMemoryDiffState(
  tNormRaw: number,
  cutawayMode: DnsTunnelStepCutawayMode = 'AUTO'
): DnstunMemoryDiffFrame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const stagingChurnPulse = smooth(t, 0.04, 0.34);
  const forensicBeamSweep = smooth(t, 0.30, 0.72);
  const rpzSinkholeGlow = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.12, 0.26);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    stagingChurnPulse,
    forensicBeamSweep,
    rpzSinkholeGlow,
    cutawayOpen,
  };
}

