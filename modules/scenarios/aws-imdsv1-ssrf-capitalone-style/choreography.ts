export type ImdsCutawayMode =
  | 'DESK_SSRF'
  | 'KEYCARD_DISPENSE'
  | 'VAULT_DRAIN'
  | 'OUTSIDE_ALARM'
  | 'IMDSV2_TURNSTILE';

export type ImdsStepCutawayInput = 'AUTO' | 'OPEN' | 'SEALED';

export interface ImdsChoreographyState {
  actIndex: 1 | 2 | 3 | 4 | 5;
  cutawayMode: ImdsCutawayMode;
  slipSlideProgress: number;
  kioskCutawayOpen: number;
  keycardDispenseProgress: number;
  vaultDrainProgress: number;
  outsideAlarmIntensity: number;
  turnstileLockDrop: number;
  imdsLocked: boolean;
}

export interface ImdsStep1State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  slipForwardProgress: number;
  proxyRedirectPulse: number;
  roleNameEchoGlow: number;
}

export interface ImdsStep2State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  kioskRequestProgress: number;
  keycardEjectHeight: number;
  tokenEnvelopeGlow: number;
}

export interface ImdsStep3State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  offPropertySwipeProgress: number;
  drawerPullOut: number;
  exfilCrateLift: number;
}

export interface ImdsStep4State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  radarAlertPulse: number;
  turnstileBarrierDrop: number;
  hopLimitShieldGlow: number;
}

export interface ImdsMemoryDiffState {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  leftCardLeakGlow: number;
  forensicSweepProgress: number;
  rightTurnstileLockGlow: number;
}

export const IMDS_BRIEFING_DURATION_SEC = 20.0;
export const IMDS_STEP_DURATION_SEC = 15.0;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function resolveCutaway(
  mode: ImdsStepCutawayInput,
  autoValue: number
): number {
  if (mode === 'OPEN') return 1;
  if (mode === 'SEALED') return 0;
  return clamp01(autoValue);
}

export function evaluateImdsChoreography(
  timeSec: number
): ImdsChoreographyState {
  const wrapped =
    ((timeSec % IMDS_BRIEFING_DURATION_SEC) + IMDS_BRIEFING_DURATION_SEC) %
    IMDS_BRIEFING_DURATION_SEC;

  let actIndex: 1 | 2 | 3 | 4 | 5 = 1;
  let cutawayMode: ImdsCutawayMode = 'DESK_SSRF';
  if (wrapped < 4.2) {
    actIndex = 1;
    cutawayMode = 'DESK_SSRF';
  } else if (wrapped < 8.8) {
    actIndex = 2;
    cutawayMode = 'KEYCARD_DISPENSE';
  } else if (wrapped < 13.8) {
    actIndex = 3;
    cutawayMode = 'VAULT_DRAIN';
  } else if (wrapped < 17.0) {
    actIndex = 4;
    cutawayMode = 'OUTSIDE_ALARM';
  } else {
    actIndex = 5;
    cutawayMode = 'IMDSV2_TURNSTILE';
  }

  return {
    actIndex,
    cutawayMode,
    slipSlideProgress: smoothstep(0.3, 3.8, wrapped),
    kioskCutawayOpen:
      smoothstep(4.2, 5.4, wrapped) * (1 - smoothstep(16.8, 17.8, wrapped)),
    keycardDispenseProgress: smoothstep(4.8, 8.4, wrapped),
    vaultDrainProgress: smoothstep(9.0, 13.4, wrapped),
    outsideAlarmIntensity: smoothstep(13.8, 15.2, wrapped),
    turnstileLockDrop: smoothstep(17.0, 19.2, wrapped),
    imdsLocked: wrapped >= 17.6,
  };
}

export function evaluateImdsStep1State(
  normalizedT: number,
  cutawayMode: ImdsStepCutawayInput
): ImdsStep1State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    slipForwardProgress: smoothstep(0.04, 0.34, t),
    proxyRedirectPulse: smoothstep(0.34, 0.66, t),
    roleNameEchoGlow: smoothstep(0.68, 0.94, t),
  };
}

export function evaluateImdsStep2State(
  normalizedT: number,
  cutawayMode: ImdsStepCutawayInput
): ImdsStep2State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.26, 0.42, t)),
    kioskRequestProgress: smoothstep(0.05, 0.34, t),
    keycardEjectHeight: smoothstep(0.36, 0.68, t),
    tokenEnvelopeGlow: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateImdsStep3State(
  normalizedT: number,
  cutawayMode: ImdsStepCutawayInput
): ImdsStep3State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.30, 0.46, t)),
    offPropertySwipeProgress: smoothstep(0.05, 0.34, t),
    drawerPullOut: smoothstep(0.35, 0.68, t),
    exfilCrateLift: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateImdsStep4State(
  normalizedT: number,
  cutawayMode: ImdsStepCutawayInput
): ImdsStep4State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    radarAlertPulse: smoothstep(0.05, 0.34, t),
    turnstileBarrierDrop: smoothstep(0.36, 0.68, t),
    hopLimitShieldGlow: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateImdsMemoryDiffState(
  normalizedT: number,
  cutawayMode: ImdsStepCutawayInput
): ImdsMemoryDiffState {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.24, 0.42, t)),
    leftCardLeakGlow: smoothstep(0.04, 0.34, t),
    forensicSweepProgress: smoothstep(0.34, 0.70, t),
    rightTurnstileLockGlow: smoothstep(0.68, 0.95, t),
  };
}
