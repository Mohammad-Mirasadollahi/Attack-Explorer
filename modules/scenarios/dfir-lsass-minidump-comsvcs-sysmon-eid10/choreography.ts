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
