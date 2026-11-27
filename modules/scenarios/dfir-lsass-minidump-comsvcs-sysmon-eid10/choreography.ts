export type LsassCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export const LSASS_TIMELINE_DURATION_SEC = 20.0;

export interface LsassChoreographyFrame {
  actIndex: 0 | 1 | 2 | 3 | 4;
  badgeGlow: number;
  photographerAdvance: number;
  cutawayOpen: number;
  lensApertureOpen: number;
  xrayFlashBeam: number;
  polaroidEject: number;
  envelopeSealed: number;
  boothAlarmActive: number;
  callTraceBeam: number;
  vaultWheelAngle: number;
}

export const LSASS_STORY_ACTS = [
  { index: 0, start: 0.0, end: 0.2, label: '1. Badge & PID' },
  { index: 1, start: 0.2, end: 0.4, label: '2. Vault Cart' },
  { index: 2, start: 0.4, end: 0.64, label: '3. X-Ray 0x1010' },
  { index: 3, start: 0.64, end: 0.84, label: '4. MDMP Negative' },
  { index: 4, start: 0.84, end: 1.0, label: '5. Booth EID 10' },
] as const;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(x: number): number {
  const c = clamp01(x);
  return 1 - Math.pow(1 - c, 3);
}

function segment(t: number, start: number, end: number): number {
  if (t <= start) return 0;
  if (t >= end) return 1;
  return easeOutCubic((t - start) / (end - start));
}

/**
 * Pure deterministic 5-act choreography evaluator for Scenario #020
 * (Bank Safe-Deposit Vault Hall + Brass X-Ray Photographer Cart + Glass Sysmon Booth).
 */
export function evaluateLsassChoreography(
  tNormRaw: number,
  cutawayMode: LsassCutawayMode = 'AUTO'
): LsassChoreographyFrame {
  const t = clamp01(tNormRaw);

  let actIndex: 0 | 1 | 2 | 3 | 4 = 0;
  if (t >= 0.84) actIndex = 4;
  else if (t >= 0.64) actIndex = 3;
  else if (t >= 0.4) actIndex = 2;
  else if (t >= 0.2) actIndex = 1;

  // Act 1 (0.00–0.20): Golden Inspector Badge glows & pins PID 684 plaque
  const badgeGlow = segment(t, 0.02, 0.16);

  // Act 2 (0.20–0.40): Certified photographer cart (rundll32 + comsvcs.dll) glides to vault
  const photographerAdvance = segment(t, 0.2, 0.38);

  // Act 3 (0.40–0.64): Vault cutaway glass lifts, X-ray lens widens (0x1010), crimson scan cone fires
  const autoCutaway = segment(t, 0.38, 0.46);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  const lensApertureOpen = segment(t, 0.42, 0.52);
  const xrayFlashBeam =
    t < 0.48
      ? 0
      : t < 0.64
        ? segment(t, 0.48, 0.56)
        : Math.max(0.2, 1 - segment(t, 0.66, 0.78) * 0.8);

  // Act 4 (0.64–0.84): Instant MDMP Polaroid negative ejects onto packing table & slips into sleeve
  const polaroidEject = segment(t, 0.64, 0.74);
  const envelopeSealed = segment(t, 0.74, 0.83);

  // Act 5 (0.84–1.00): Elevated glass guard booth triggers Sysmon EID 10 alert & CallTrace beam
  const boothAlarmActive = segment(t, 0.84, 0.9);
  const callTraceBeam = segment(t, 0.86, 0.96);

  const vaultWheelAngle = t * Math.PI * 1.4;

  return {
    actIndex,
    badgeGlow,
    photographerAdvance,
    cutawayOpen,
    lensApertureOpen,
    xrayFlashBeam,
    polaroidEject,
    envelopeSealed,
    boothAlarmActive,
    callTraceBeam,
    vaultWheelAngle,
  };
}

// ---------------------------------------------------------------------------
// MOD-18 Standalone Per-Section Engines (Steps 1..4 + Memory Diff)
// ---------------------------------------------------------------------------

export interface LsassStep1State {
  phase: 0 | 1 | 2;
  badgeRise: number;
  directoryScan: number;
  pidLocked: boolean;
  cutawayOpen: number;
}

export function evaluateLsassStep1State(
  timeSec: number,
  cutawayMode: LsassCutawayMode = 'AUTO'
): LsassStep1State {
  const t = clamp01((((timeSec % 15) + 15) % 15) / 15);
  const phase: 0 | 1 | 2 = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const badgeRise = segment(t, 0.04, 0.34);
  const directoryScan = segment(t, 0.34, 0.68);
  const pidLocked = t >= 0.64;
  const autoCut = segment(t, 0.08, 0.28);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return { phase, badgeRise, directoryScan, pidLocked, cutawayOpen };
}

export interface LsassStep2State {
  phase: 0 | 1 | 2;
  cartRoll: number;
  apertureOpen: number;
  xrayConeActive: number;
  cutawayOpen: number;
}

export function evaluateLsassStep2State(
  timeSec: number,
  cutawayMode: LsassCutawayMode = 'AUTO'
): LsassStep2State {
  const t = clamp01((((timeSec % 15) + 15) % 15) / 15);
  const phase: 0 | 1 | 2 = t < 4.8 / 15 ? 0 : t < 9.8 / 15 ? 1 : 2;
  const cartRoll = segment(t, 0.04, 0.32);
  const apertureOpen = segment(t, 0.32, 0.62);
  const xrayConeActive = segment(t, 0.62, 0.92);
  const autoCut = segment(t, 0.3, 0.5);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return { phase, cartRoll, apertureOpen, xrayConeActive, cutawayOpen };
}

export interface LsassStep3State {
  phase: 0 | 1 | 2;
  flashIntensity: number;
  negativeEject: number;
  sleeveInsert: number;
  mdmpStamped: boolean;
  cutawayOpen: number;
}

export function evaluateLsassStep3State(
  timeSec: number,
  cutawayMode: LsassCutawayMode = 'AUTO'
): LsassStep3State {
  const t = clamp01((((timeSec % 15) + 15) % 15) / 15);
  const phase: 0 | 1 | 2 = t < 4.5 / 15 ? 0 : t < 9.8 / 15 ? 1 : 2;
  const flashIntensity =
    t < 0.36 ? segment(t, 0.04, 0.2) * (1 - segment(t, 0.24, 0.36) * 0.6) : 0.2;
  const negativeEject = segment(t, 0.3, 0.66);
  const sleeveInsert = segment(t, 0.66, 0.94);
  const autoCut = segment(t, 0.14, 0.34);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phase,
    flashIntensity,
    negativeEject,
    sleeveInsert,
    mdmpStamped: negativeEject > 0.45,
    cutawayOpen,
  };
}

export interface LsassStep4State {
  phase: 0 | 1 | 2;
  boothAlarm: number;
  callTraceBeam: number;
  pplShieldDrop: number;
  isolated: boolean;
  cutawayOpen: number;
}

export function evaluateLsassStep4State(
  timeSec: number,
  cutawayMode: LsassCutawayMode = 'AUTO'
): LsassStep4State {
  const t = clamp01((((timeSec % 15) + 15) % 15) / 15);
  const phase: 0 | 1 | 2 = t < 4.8 / 15 ? 0 : t < 10 / 15 ? 1 : 2;
  const boothAlarm = segment(t, 0.04, 0.3);
  const callTraceBeam = segment(t, 0.32, 0.65);
  const pplShieldDrop = segment(t, 0.66, 0.94);
  const autoCut = segment(t, 0.24, 0.45);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phase,
    boothAlarm,
    callTraceBeam,
    pplShieldDrop,
    isolated: pplShieldDrop > 0.5,
    cutawayOpen,
  };
}

export interface LsassMemoryPplDiffState {
  phase: 0 | 1 | 2;
  auditSweepX: number;
  shieldRepelPulse: number;
  cutawayOpen: number;
}

export function evaluateLsassMemoryPplDiffState(
  timeSec: number,
  cutawayMode: LsassCutawayMode = 'AUTO'
): LsassMemoryPplDiffState {
  const t = clamp01((((timeSec % 15) + 15) % 15) / 15);
  const phase: 0 | 1 | 2 = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const auditSweepX = -4.2 + segment(t, 0.06, 0.92) * 8.4;
  const shieldRepelPulse = segment(t, 0.64, 0.94);
  const autoCut = segment(t, 0.16, 0.38);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return { phase, auditSweepX, shieldRepelPulse, cutawayOpen };
}

