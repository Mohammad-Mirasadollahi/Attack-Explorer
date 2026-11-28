export type AukillCutawayMode =
  | 'WRENCH_DROP'
  | 'BREAKER_DIAL'
  | 'TOWERS_DARK'
  | 'VAULT_SURGE'
  | 'RECALL_SHUTTER';

export type AukillStepCutawayInput = 'AUTO' | 'OPEN' | 'SEALED';

export interface AukillChoreographyState {
  actIndex: 1 | 2 | 3 | 4 | 5;
  cutawayMode: AukillCutawayMode;
  wrenchDropProgress: number;
  pitDomeOpen: number;
  dialTurnProgress: number;
  towerShutdownProgress: number;
  surgePulseIntensity: number;
  recallShutterDrop: number;
  hvciBlocked: boolean;
}

export interface AukillStep1State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  wrenchCarryProgress: number;
  stampScanGlow: number;
  pitEntryProgress: number;
}

export interface AukillStep2State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  socketConnectProgress: number;
  dialRotation: number;
  handleGrantGlow: number;
}

export interface AukillStep3State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  breakerFlip1: number;
  breakerFlip2: number;
  breakerFlip3: number;
}

export interface AukillStep4State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  hashCheckProgress: number;
  shutterSlamDrop: number;
  watchtowerSafeGlow: number;
}

export interface AukillMemoryDiffState {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  leftBypassGlow: number;
  forensicSweepProgress: number;
  rightBlockGlow: number;
}

export const AUKILL_BRIEFING_DURATION_SEC = 20.0;
export const AUKILL_STEP_DURATION_SEC = 15.0;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function resolveCutaway(
  mode: AukillStepCutawayInput,
  autoValue: number
): number {
  if (mode === 'OPEN') return 1;
  if (mode === 'SEALED') return 0;
  return clamp01(autoValue);
}

export function evaluateAukillChoreography(
  timeSec: number
): AukillChoreographyState {
  const wrapped =
    ((timeSec % AUKILL_BRIEFING_DURATION_SEC) + AUKILL_BRIEFING_DURATION_SEC) %
    AUKILL_BRIEFING_DURATION_SEC;

  let actIndex: 1 | 2 | 3 | 4 | 5 = 1;
  let cutawayMode: AukillCutawayMode = 'WRENCH_DROP';
  if (wrapped < 4.2) {
    actIndex = 1;
    cutawayMode = 'WRENCH_DROP';
  } else if (wrapped < 8.8) {
    actIndex = 2;
    cutawayMode = 'BREAKER_DIAL';
  } else if (wrapped < 13.8) {
    actIndex = 3;
    cutawayMode = 'TOWERS_DARK';
  } else if (wrapped < 17.0) {
    actIndex = 4;
    cutawayMode = 'VAULT_SURGE';
  } else {
    actIndex = 5;
    cutawayMode = 'RECALL_SHUTTER';
  }

  return {
    actIndex,
    cutawayMode,
    wrenchDropProgress: smoothstep(0.3, 3.8, wrapped),
    pitDomeOpen:
      smoothstep(4.2, 5.4, wrapped) * (1 - smoothstep(16.8, 17.8, wrapped)),
    dialTurnProgress: smoothstep(4.8, 8.4, wrapped),
    towerShutdownProgress: smoothstep(9.0, 13.4, wrapped),
    surgePulseIntensity: smoothstep(13.8, 16.4, wrapped),
    recallShutterDrop: smoothstep(17.0, 19.2, wrapped),
    hvciBlocked: wrapped >= 17.6,
  };
}

export function evaluateAukillStep1State(
  normalizedT: number,
  cutawayMode: AukillStepCutawayInput
): AukillStep1State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    wrenchCarryProgress: smoothstep(0.04, 0.34, t),
    stampScanGlow: smoothstep(0.35, 0.68, t),
    pitEntryProgress: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateAukillStep2State(
  normalizedT: number,
  cutawayMode: AukillStepCutawayInput
): AukillStep2State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.26, 0.42, t)),
    socketConnectProgress: smoothstep(0.04, 0.34, t),
    dialRotation: smoothstep(0.35, 0.68, t),
    handleGrantGlow: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateAukillStep3State(
  normalizedT: number,
  cutawayMode: AukillStepCutawayInput
): AukillStep3State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    breakerFlip1: smoothstep(0.05, 0.34, t),
    breakerFlip2: smoothstep(0.35, 0.68, t),
    breakerFlip3: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateAukillStep4State(
  normalizedT: number,
  cutawayMode: AukillStepCutawayInput
): AukillStep4State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    hashCheckProgress: smoothstep(0.05, 0.34, t),
    shutterSlamDrop: smoothstep(0.35, 0.68, t),
    watchtowerSafeGlow: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateAukillMemoryDiffState(
  normalizedT: number,
  cutawayMode: AukillStepCutawayInput
): AukillMemoryDiffState {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.25, 0.42, t)),
    leftBypassGlow: smoothstep(0.04, 0.34, t),
    forensicSweepProgress: smoothstep(0.34, 0.70, t),
    rightBlockGlow: smoothstep(0.68, 0.95, t),
  };
}
