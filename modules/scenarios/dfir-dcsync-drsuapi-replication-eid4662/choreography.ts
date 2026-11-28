export type DcsyncCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface DcsyncStoryAct {
  id: number;
  startNorm: number;
  endNorm: number;
  label: string;
}

/** Overview 3D duration is >= 40 seconds (45s across 5 rich 9-second acts) so users can read
 *  every card comfortably and observe full multi-element physical interactions. */
export const DCSYNC_TIMELINE_DURATION_SEC = 45;

export const DCSYNC_STORY_ACTS: readonly DcsyncStoryAct[] = [
  { id: 1, startNorm: 0.0, endNorm: 0.2, label: 'Act 1 · Over-Privileged Bridge Ribbon' },
  { id: 2, startNorm: 0.2, endNorm: 0.4, label: 'Act 2 · Rogue Courier Connects to Bridge' },
  { id: 3, startNorm: 0.4, endNorm: 0.62, label: 'Act 3 · Crown Ledger Replication Flow' },
  { id: 4, startNorm: 0.62, endNorm: 0.8, label: 'Act 4 · Non-Mint Audit Correlation' },
  { id: 5, startNorm: 0.8, endNorm: 1.0, label: 'Act 5 · Peer-Only Gate & Double Seal' },
];

export interface DcsyncChoreographyFrame {
  actIndex: number;
  aclRibbonGlow: number;
  /** Back-and-forth peer carriage sync motion in Act 1 & restored Act 5. */
  peerSyncOscillation: number;
  courierAdvance: number;
  hatchOpen: number;
  cutawayOpen: number;
  ledgerStreamProgress: number;
  auditAlarmLevel: number;
  peerGateShield: number;
  ribbonFlash: number;
  duplicateDropProgress: number;
  plateScanProgress: number;
  recastPass1: number;
  recastPass2: number;
  stolenSealVoided: number;
  ribbonDropProgress: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smooth(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  const x = clamp01((t - start) / (end - start));
  return x * x * (3 - 2 * x);
}

function pulseBell(t: number, start: number, peak: number, end: number): number {
  if (t <= start || t >= end) return 0;
  if (t <= peak) return smooth(t, start, peak);
  return 1 - smooth(t, peak, end);
}

export function evaluateDcsyncChoreography(
  tNormRaw: number,
  cutawayMode: DcsyncCutawayMode = 'AUTO'
): DcsyncChoreographyFrame {
  const t = clamp01(tNormRaw);
  const actIndex = DCSYNC_STORY_ACTS.findIndex((a) => t >= a.startNorm && t < a.endNorm);
  const resolvedAct = actIndex === -1 ? DCSYNC_STORY_ACTS.length - 1 : actIndex;

  // Act 1 (0.00 - 0.20): Legitimate peer mints sync across bridge while forgotten gatehouse ribbon glints
  const aclRibbonGlow = smooth(t, 0.02, 0.16);
  const peerSyncOscillation = Math.sin(t * Math.PI * 10);

  // Act 2 (0.20 - 0.40): Side-street van rolls cleanly under archway (0.20..0.32), opens roof hatch, flashes ribbon (0.31..0.41)
  const courierAdvance = smooth(t, 0.2, 0.32);
  const hatchOpen = smooth(t, 0.3, 0.35);
  const ribbonFlash = pulseBell(t, 0.31, 0.365, 0.43);

  // Act 3 (0.40 - 0.62): Bridge cutaway opens, carriage rolls to mid-archway, exact duplicate crown seal descends into van
  const autoCutaway = smooth(t, 0.4, 0.46);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  const ledgerStreamProgress = smooth(t, 0.42, 0.52);
  const duplicateDropProgress = smooth(t, 0.48, 0.6);

  // Act 4 (0.62 - 0.80): Bridge Audit Tower scans 482-VAN license plate against official mint roster & sounds alarm
  const plateScanProgress = smooth(t, 0.63, 0.72);
  const auditAlarmLevel = smooth(t, 0.65, 0.79);

  // Act 5 (0.80 - 1.00): Ribbon stripped & dropped, peer-only blast gates slam closed, BOTH towers recast crown seals TWICE
  const ribbonDropProgress = smooth(t, 0.8, 0.86);
  const peerGateShield = smooth(t, 0.81, 0.91);
  const recastPass1 = pulseBell(t, 0.83, 0.865, 0.9);
  const recastPass2 = pulseBell(t, 0.9, 0.945, 0.99);
  const stolenSealVoided = smooth(t, 0.85, 0.95);

  return {
    actIndex: resolvedAct,
    aclRibbonGlow,
    peerSyncOscillation,
    courierAdvance,
    hatchOpen,
    cutawayOpen,
    ledgerStreamProgress,
    auditAlarmLevel,
    peerGateShield,
    ribbonFlash,
    duplicateDropProgress,
    plateScanProgress,
    recastPass1,
    recastPass2,
    stolenSealVoided,
    ribbonDropProgress,
  };
}

/** Step-by-step & Memory Forensics standalone 3D animations run 24 seconds (8s per phase across 3 phases)
 *  so learners have ample time to read each card and observe full mechanical interactions. */
export const DCSYNC_STEP_DURATION_SEC = 24;

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
  ribbonBindFlash: number;
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
  const vanDockProgress = smooth(t, 0.03, 0.26);
  const ribbonBindFlash = pulseBell(t, 0.22, 0.3, 0.42);
  const capsuleStreamProgress = smooth(t, 0.34, 0.72);
  const zeekWireAlert = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.28, 0.4);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    vanDockProgress,
    ribbonBindFlash,
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
  const autoCut = smooth(t, 0.12, 0.28);
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
  recastPass1: number;
  recastPass2: number;
  peerShieldLock: number;
  cutawayOpen: number;
}

export function evaluateDcsyncStep4State(
  tNormRaw: number,
  cutawayMode: DcsyncCutawayMode = 'AUTO'
): DcsyncStep4Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const ribbonStripProgress = smooth(t, 0.04, 0.32);
  const doubleResetRotation = smooth(t, 0.34, 0.68);
  const recastPass1 = pulseBell(t, 0.34, 0.43, 0.51);
  const recastPass2 = pulseBell(t, 0.51, 0.6, 0.69);
  const peerShieldLock = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.1, 0.24);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    ribbonStripProgress,
    doubleResetRotation,
    recastPass1,
    recastPass2,
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
  const auditSweepProgress = smooth(t, 0.3, 0.72);
  const hardenedDaclGlow = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.1, 0.24);
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
