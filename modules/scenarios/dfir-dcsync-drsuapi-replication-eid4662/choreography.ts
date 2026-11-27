export type DcsyncCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface DcsyncStoryAct {
  id: number;
  startNorm: number;
  endNorm: number;
  label: string;
}

export const DCSYNC_TIMELINE_DURATION_SEC = 20;

export const DCSYNC_STORY_ACTS: readonly DcsyncStoryAct[] = [
  { id: 1, startNorm: 0.0, endNorm: 0.22, label: 'Act 1 · Over-Privileged Bridge Ribbon' },
  { id: 2, startNorm: 0.22, endNorm: 0.46, label: 'Act 2 · Rogue Courier Connects to Bridge' },
  { id: 3, startNorm: 0.46, endNorm: 0.7, label: 'Act 3 · Crown Ledger Replication Flow' },
  { id: 4, startNorm: 0.7, endNorm: 0.86, label: 'Act 4 · Non-Mint Audit Correlation' },
  { id: 5, startNorm: 0.86, endNorm: 1.0, label: 'Act 5 · Peer-Only Gate & Double Seal' },
];

export interface DcsyncChoreographyFrame {
  actIndex: number;
  aclRibbonGlow: number;
  courierAdvance: number;
  cutawayOpen: number;
  ledgerStreamProgress: number;
  auditAlarmLevel: number;
  peerGateShield: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smooth(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  const x = clamp01((t - start) / (end - start));
  return x * x * (3 - 2 * x);
}

export function evaluateDcsyncChoreography(
  tNormRaw: number,
  cutawayMode: DcsyncCutawayMode = 'AUTO'
): DcsyncChoreographyFrame {
  const t = clamp01(tNormRaw);
  const actIndex = DCSYNC_STORY_ACTS.findIndex((a) => t >= a.startNorm && t < a.endNorm);
  const resolvedAct = actIndex === -1 ? DCSYNC_STORY_ACTS.length - 1 : actIndex;

  const aclRibbonGlow = smooth(t, 0.03, 0.2);
  const courierAdvance = smooth(t, 0.22, 0.46);
  const autoCutaway = smooth(t, 0.44, 0.52);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  const ledgerStreamProgress = smooth(t, 0.48, 0.72);
  const auditAlarmLevel = smooth(t, 0.7, 0.86);
  const peerGateShield = smooth(t, 0.85, 0.96);

  return {
    actIndex: resolvedAct,
    aclRibbonGlow,
    courierAdvance,
    cutawayOpen,
    ledgerStreamProgress,
    auditAlarmLevel,
    peerGateShield,
  };
}

export const DCSYNC_STEP_DURATION_SEC = 15;

export interface DcsyncStep1Frame {
  phaseIndex: number;
  crownSpinBoost: number;
  badRibbonFlare: number;
  eid5136AuditScan: number;
  cutawayOpen: number;
}

export function evaluateDcsyncStep1State(
  tNormRaw: number,
  cutawayMode: DcsyncCutawayMode = 'AUTO'
): DcsyncStep1Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const crownSpinBoost = smooth(t, 0.04, 0.32);
  const badRibbonFlare = smooth(t, 0.34, 0.66);
  const eid5136AuditScan = smooth(t, 0.66, 0.94);
  const autoCut = smooth(t, 0.24, 0.38);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    crownSpinBoost,
    badRibbonFlare,
    eid5136AuditScan,
    cutawayOpen,
  };
}

export interface DcsyncStep2Frame {
  phaseIndex: number;
  vanDockProgress: number;
  capsuleStreamProgress: number;
  zeekWireAlert: number;
  cutawayOpen: number;
}

export function evaluateDcsyncStep2State(
  tNormRaw: number,
  cutawayMode: DcsyncCutawayMode = 'AUTO'
): DcsyncStep2Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const vanDockProgress = smooth(t, 0.04, 0.34);
  const capsuleStreamProgress = smooth(t, 0.32, 0.72);
  const zeekWireAlert = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.26, 0.40);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    vanDockProgress,
    capsuleStreamProgress,
    zeekWireAlert,
    cutawayOpen,
  };
}

export interface DcsyncStep3Frame {
  phaseIndex: number;
  eid4662Flash: number;
  logonIdJoinBeam: number;
  p1SirenFlare: number;
  cutawayOpen: number;
}

export function evaluateDcsyncStep3State(
  tNormRaw: number,
  cutawayMode: DcsyncCutawayMode = 'AUTO'
): DcsyncStep3Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const eid4662Flash = smooth(t, 0.04, 0.34);
  const logonIdJoinBeam = smooth(t, 0.34, 0.68);
  const p1SirenFlare = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.16, 0.32);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    eid4662Flash,
    logonIdJoinBeam,
    p1SirenFlare,
    cutawayOpen,
  };
}

export interface DcsyncStep4Frame {
  phaseIndex: number;
  ribbonStripProgress: number;
  doubleResetRotation: number;
  peerShieldLock: number;
  cutawayOpen: number;
}

export function evaluateDcsyncStep4State(
  tNormRaw: number,
  cutawayMode: DcsyncCutawayMode = 'AUTO'
): DcsyncStep4Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const ribbonStripProgress = smooth(t, 0.04, 0.34);
  const doubleResetRotation = smooth(t, 0.34, 0.68);
  const peerShieldLock = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.14, 0.28);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    ribbonStripProgress,
    doubleResetRotation,
    peerShieldLock,
    cutawayOpen,
  };
}

export interface DcsyncMemoryDiffFrame {
  phaseIndex: number;
  exposedRibbonPulse: number;
  auditSweepProgress: number;
  hardenedDaclGlow: number;
  cutawayOpen: number;
}

export function evaluateDcsyncMemoryDiffState(
  tNormRaw: number,
  cutawayMode: DcsyncCutawayMode = 'AUTO'
): DcsyncMemoryDiffFrame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const exposedRibbonPulse = smooth(t, 0.04, 0.34);
  const auditSweepProgress = smooth(t, 0.30, 0.72);
  const hardenedDaclGlow = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.12, 0.26);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    exposedRibbonPulse,
    auditSweepProgress,
    hardenedDaclGlow,
    cutawayOpen,
  };
}

