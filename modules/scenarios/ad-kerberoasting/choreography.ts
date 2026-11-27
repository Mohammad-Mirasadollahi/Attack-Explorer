export type KerbCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface KerbStoryAct {
  id: number;
  startNorm: number;
  endNorm: number;
  label: string;
}

export const KERB_TIMELINE_DURATION_SEC = 20;

export const KERB_STORY_ACTS: readonly KerbStoryAct[] = [
  { id: 1, startNorm: 0.0, endNorm: 0.2, label: 'Act 1 · Bellboard SPN Scan' },
  { id: 2, startNorm: 0.2, endNorm: 0.42, label: 'Act 2 · Bronze RC4 Voucher' },
  { id: 3, startNorm: 0.42, endNorm: 0.65, label: 'Act 3 · Basement Safecracker' },
  { id: 4, startNorm: 0.65, endNorm: 0.84, label: 'Act 4 · Master Keycard Pivot' },
  { id: 5, startNorm: 0.84, endNorm: 1.0, label: 'Act 5 · Lobby Audit & AES Shield' },
];

export interface KerbChoreographyFrame {
  actIndex: number;
  bellboardGlow: number;
  tubePacketProgress: number;
  voucherIssued: number;
  cutawayOpen: number;
  tumblerSpin: number;
  keycardPivot: number;
  auditLanternBeam: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smooth(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  const x = clamp01((t - start) / (end - start));
  return x * x * (3 - 2 * x);
}

export function evaluateKerbChoreography(
  tNormRaw: number,
  cutawayMode: KerbCutawayMode = 'AUTO'
): KerbChoreographyFrame {
  const t = clamp01(tNormRaw);
  const actIndex = KERB_STORY_ACTS.findIndex((a) => t >= a.startNorm && t < a.endNorm);
  const resolvedAct = actIndex === -1 ? KERB_STORY_ACTS.length - 1 : actIndex;

  const bellboardGlow = smooth(t, 0.02, 0.18);
  const tubePacketProgress = smooth(t, 0.2, 0.36);
  const voucherIssued = smooth(t, 0.32, 0.42);
  const autoCutaway = smooth(t, 0.41, 0.49);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  const tumblerSpin = smooth(t, 0.44, 0.64);
  const keycardPivot = smooth(t, 0.65, 0.83);
  const auditLanternBeam = smooth(t, 0.84, 0.96);

  return {
    actIndex: resolvedAct,
    bellboardGlow,
    tubePacketProgress,
    voucherIssued,
    cutawayOpen,
    tumblerSpin,
    keycardPivot,
    auditLanternBeam,
  };
}

export const KERB_STEP_DURATION_SEC = 15;

export interface KerbStep1Frame {
  phaseIndex: number;
  badgeApproach: number;
  ldapScanSweep: number;
  targetHighlight: number;
  canaryAuditPulse: number;
  cutawayOpen: number;
}

export function evaluateKerbStep1State(
  tNormRaw: number,
  cutawayMode: KerbCutawayMode = 'AUTO'
): KerbStep1Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const badgeApproach = smooth(t, 0.03, 0.30);
  const ldapScanSweep = smooth(t, 0.25, 0.68);
  const targetHighlight = smooth(t, 0.38, 0.66);
  const canaryAuditPulse = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.28, 0.42);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    badgeApproach,
    ldapScanSweep,
    targetHighlight,
    canaryAuditPulse,
    cutawayOpen,
  };
}

export interface KerbStep2Frame {
  phaseIndex: number;
  capsuleTravel: number;
  stampStrike: number;
  voucherSlide: number;
  eid4769Flash: number;
  cutawayOpen: number;
}

export function evaluateKerbStep2State(
  tNormRaw: number,
  cutawayMode: KerbCutawayMode = 'AUTO'
): KerbStep2Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const capsuleTravel = smooth(t, 0.04, 0.34);
  const stampDown = smooth(t, 0.36, 0.50);
  const stampUp = smooth(t, 0.54, 0.66);
  const stampStrike = clamp01(stampDown - stampUp * 0.85);
  const voucherSlide = smooth(t, 0.48, 0.78);
  const eid4769Flash = smooth(t, 0.66, 0.94);
  const autoCut = smooth(t, 0.32, 0.46);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    capsuleTravel,
    stampStrike,
    voucherSlide,
    eid4769Flash,
    cutawayOpen,
  };
}

export interface KerbStep3Frame {
  phaseIndex: number;
  voucherLoad: number;
  tumblerRpm: number;
  sealFracture: number;
  keycardRise: number;
  cutawayOpen: number;
}

export function evaluateKerbStep3State(
  tNormRaw: number,
  cutawayMode: KerbCutawayMode = 'AUTO'
): KerbStep3Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const voucherLoad = smooth(t, 0.04, 0.30);
  const tumblerRpm = smooth(t, 0.28, 0.66);
  const sealFracture = smooth(t, 0.54, 0.74);
  const keycardRise = smooth(t, 0.66, 0.94);
  const autoCut = smooth(t, 0.14, 0.28);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    voucherLoad,
    tumblerRpm,
    sealFracture,
    keycardRise,
    cutawayOpen,
  };
}

export interface KerbStep4Frame {
  phaseIndex: number;
  keycardGlide: number;
  doorBreach: number;
  serviceInstall: number;
  emeraldShieldDrop: number;
  cutawayOpen: number;
}

export function evaluateKerbStep4State(
  tNormRaw: number,
  cutawayMode: KerbCutawayMode = 'AUTO'
): KerbStep4Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const keycardGlide = smooth(t, 0.04, 0.35);
  const doorBreach = smooth(t, 0.34, 0.62);
  const serviceInstall = smooth(t, 0.48, 0.68);
  const emeraldShieldDrop = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.30, 0.44);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    keycardGlide,
    doorBreach,
    serviceInstall,
    emeraldShieldDrop,
    cutawayOpen,
  };
}

export interface KerbMemoryDiffFrame {
  phaseIndex: number;
  rc4CrackIntensity: number;
  auditSweepProgress: number;
  aesVaultPulse: number;
  cutawayOpen: number;
}

export function evaluateKerbMemoryDiffState(
  tNormRaw: number,
  cutawayMode: KerbCutawayMode = 'AUTO'
): KerbMemoryDiffFrame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const rc4CrackIntensity = smooth(t, 0.04, 0.34);
  const auditSweepProgress = smooth(t, 0.30, 0.72);
  const aesVaultPulse = smooth(t, 0.66, 0.95);
  const autoCut = smooth(t, 0.12, 0.26);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    rc4CrackIntensity,
    auditSweepProgress,
    aesVaultPulse,
    cutawayOpen,
  };
}

