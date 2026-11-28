export type SunburstCutawayMode =
  | 'SUNSPOT_SWAP'
  | 'WAX_SEAL_SIGN'
  | 'DORMANT_BEACON'
  | 'GOLDEN_SAML'
  | 'BUILD_CALIPER';

export type SunburstStepCutawayInput = 'AUTO' | 'OPEN' | 'SEALED';

export interface SunburstChoreographyState {
  actIndex: 1 | 2 | 3 | 4 | 5;
  cutawayMode: SunburstCutawayMode;
  plateSwapProgress: number;
  pressStampProgress: number;
  dormantShutterOpen: number;
  beaconPulseIntensity: number;
  forgedSealGlow: number;
  caliperLockProgress: number;
  pipelineHardened: boolean;
}

export interface SunburstStep1State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  conveyorAdvance: number;
  ghostPlateSwap: number;
  cleanRestoreProgress: number;
}

export interface SunburstStep2State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  stampDescend: number;
  waxGlowIntensity: number;
  crateRollOut: number;
}

export interface SunburstStep3State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  timerTickProgress: number;
  beaconWaveExpand: number;
  cnameReplyBeam: number;
}

export interface SunburstStep4State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  keyExportProgress: number;
  forgedPassFly: number;
  auditGapAlarm: number;
}

export interface SunburstMemoryDiffState {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  cleanPlateGlow: number;
  caliperSweepProgress: number;
  injectedHookAlarm: number;
}

export const SUNBURST_BRIEFING_DURATION_SEC = 20.0;
export const SUNBURST_STEP_DURATION_SEC = 15.0;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function resolveCutaway(
  mode: SunburstStepCutawayInput,
  autoValue: number
): number {
  if (mode === 'OPEN') return 1;
  if (mode === 'SEALED') return 0;
  return clamp01(autoValue);
}

export function evaluateSunburstChoreography(
  timeSec: number
): SunburstChoreographyState {
  const wrapped =
    ((timeSec % SUNBURST_BRIEFING_DURATION_SEC) + SUNBURST_BRIEFING_DURATION_SEC) %
    SUNBURST_BRIEFING_DURATION_SEC;

  let actIndex: 1 | 2 | 3 | 4 | 5 = 1;
  let cutawayMode: SunburstCutawayMode = 'SUNSPOT_SWAP';
  if (wrapped < 4.2) {
    actIndex = 1;
    cutawayMode = 'SUNSPOT_SWAP';
  } else if (wrapped < 8.8) {
    actIndex = 2;
    cutawayMode = 'WAX_SEAL_SIGN';
  } else if (wrapped < 13.8) {
    actIndex = 3;
    cutawayMode = 'DORMANT_BEACON';
  } else if (wrapped < 17.0) {
    actIndex = 4;
    cutawayMode = 'GOLDEN_SAML';
  } else {
    actIndex = 5;
    cutawayMode = 'BUILD_CALIPER';
  }

  return {
    actIndex,
    cutawayMode,
    plateSwapProgress: smoothstep(0.4, 3.8, wrapped),
    pressStampProgress: smoothstep(4.4, 8.2, wrapped),
    dormantShutterOpen:
      smoothstep(8.8, 10.6, wrapped) * (1 - smoothstep(16.8, 17.8, wrapped)),
    beaconPulseIntensity: smoothstep(10.0, 13.4, wrapped),
    forgedSealGlow: smoothstep(13.8, 16.4, wrapped),
    caliperLockProgress: smoothstep(17.0, 19.2, wrapped),
    pipelineHardened: wrapped >= 17.6,
  };
}

export function evaluateSunburstStep1State(
  normalizedT: number,
  cutawayMode: SunburstStepCutawayInput
): SunburstStep1State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    conveyorAdvance: smoothstep(0.04, 0.34, t),
    ghostPlateSwap: smoothstep(0.35, 0.68, t),
    cleanRestoreProgress: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateSunburstStep2State(
  normalizedT: number,
  cutawayMode: SunburstStepCutawayInput
): SunburstStep2State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.26, 0.42, t)),
    stampDescend: smoothstep(0.05, 0.34, t),
    waxGlowIntensity: smoothstep(0.35, 0.68, t),
    crateRollOut: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateSunburstStep3State(
  normalizedT: number,
  cutawayMode: SunburstStepCutawayInput
): SunburstStep3State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    timerTickProgress: smoothstep(0.04, 0.34, t),
    beaconWaveExpand: smoothstep(0.35, 0.68, t),
    cnameReplyBeam: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateSunburstStep4State(
  normalizedT: number,
  cutawayMode: SunburstStepCutawayInput
): SunburstStep4State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    keyExportProgress: smoothstep(0.05, 0.34, t),
    forgedPassFly: smoothstep(0.35, 0.68, t),
    auditGapAlarm: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateSunburstMemoryDiffState(
  normalizedT: number,
  cutawayMode: SunburstStepCutawayInput
): SunburstMemoryDiffState {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.25, 0.42, t)),
    cleanPlateGlow: smoothstep(0.04, 0.34, t),
    caliperSweepProgress: smoothstep(0.34, 0.70, t),
    injectedHookAlarm: smoothstep(0.68, 0.95, t),
  };
}
