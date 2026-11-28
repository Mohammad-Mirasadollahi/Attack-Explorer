export type RagMcpCutawayMode =
  | 'SHELF_POISON'
  | 'FLAT_TRAY'
  | 'CHUTE_EXFIL'
  | 'LEDGER_ALARM'
  | 'EMERALD_GLASS';

export type RagMcpStepCutawayInput = 'AUTO' | 'OPEN' | 'SEALED';

export interface RagMcpChoreographyState {
  actIndex: 1 | 2 | 3 | 4 | 5;
  cutawayMode: RagMcpCutawayMode;
  pamphletShelveProgress: number;
  trayCutawayOpen: number;
  trayBlendProgress: number;
  capsuleShootProgress: number;
  ledgerAlarmGlow: number;
  emeraldPartitionDrop: number;
  chuteBlocked: boolean;
}

export interface RagMcpStep1State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  mailDropProgress: number;
  hiddenInkReveal: number;
  stackIndexProgress: number;
}

export interface RagMcpStep2State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  cartFetchProgress: number;
  trayMergeProgress: number;
  hijackGlowIntensity: number;
}

export interface RagMcpStep3State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  cabinetUnlockProgress: number;
  canisterLoadProgress: number;
  chuteLaunchProgress: number;
}

export interface RagMcpStep4State {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  glassDropProgress: number;
  valveClampProgress: number;
  auditBellGlow: number;
}

export interface RagMcpMemoryDiffState {
  phaseIndex: 0 | 1 | 2;
  cutawayOpen: number;
  leftFlatGlow: number;
  forensicSweepProgress: number;
  rightIsolatedGlow: number;
}

export const RAGMCP_BRIEFING_DURATION_SEC = 20.0;
export const RAGMCP_STEP_DURATION_SEC = 15.0;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function resolveCutaway(
  mode: RagMcpStepCutawayInput,
  autoValue: number
): number {
  if (mode === 'OPEN') return 1;
  if (mode === 'SEALED') return 0;
  return clamp01(autoValue);
}

export function evaluateRagMcpChoreography(
  timeSec: number
): RagMcpChoreographyState {
  const wrapped =
    ((timeSec % RAGMCP_BRIEFING_DURATION_SEC) + RAGMCP_BRIEFING_DURATION_SEC) %
    RAGMCP_BRIEFING_DURATION_SEC;

  let actIndex: 1 | 2 | 3 | 4 | 5 = 1;
  let cutawayMode: RagMcpCutawayMode = 'SHELF_POISON';
  if (wrapped < 4.2) {
    actIndex = 1;
    cutawayMode = 'SHELF_POISON';
  } else if (wrapped < 8.8) {
    actIndex = 2;
    cutawayMode = 'FLAT_TRAY';
  } else if (wrapped < 13.8) {
    actIndex = 3;
    cutawayMode = 'CHUTE_EXFIL';
  } else if (wrapped < 17.0) {
    actIndex = 4;
    cutawayMode = 'LEDGER_ALARM';
  } else {
    actIndex = 5;
    cutawayMode = 'EMERALD_GLASS';
  }

  return {
    actIndex,
    cutawayMode,
    pamphletShelveProgress: smoothstep(0.3, 3.8, wrapped),
    trayCutawayOpen:
      smoothstep(4.2, 5.4, wrapped) * (1 - smoothstep(16.8, 17.8, wrapped)),
    trayBlendProgress: smoothstep(4.6, 8.4, wrapped),
    capsuleShootProgress: smoothstep(9.0, 13.4, wrapped),
    ledgerAlarmGlow: smoothstep(13.8, 16.4, wrapped),
    emeraldPartitionDrop: smoothstep(17.0, 19.2, wrapped),
    chuteBlocked: wrapped >= 17.6,
  };
}

export function evaluateRagMcpStep1State(
  normalizedT: number,
  cutawayMode: RagMcpStepCutawayInput
): RagMcpStep1State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    mailDropProgress: smoothstep(0.04, 0.34, t),
    hiddenInkReveal: smoothstep(0.35, 0.68, t),
    stackIndexProgress: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateRagMcpStep2State(
  normalizedT: number,
  cutawayMode: RagMcpStepCutawayInput
): RagMcpStep2State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.26, 0.42, t)),
    cartFetchProgress: smoothstep(0.04, 0.34, t),
    trayMergeProgress: smoothstep(0.35, 0.68, t),
    hijackGlowIntensity: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateRagMcpStep3State(
  normalizedT: number,
  cutawayMode: RagMcpStepCutawayInput
): RagMcpStep3State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    cabinetUnlockProgress: smoothstep(0.05, 0.34, t),
    canisterLoadProgress: smoothstep(0.35, 0.68, t),
    chuteLaunchProgress: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateRagMcpStep4State(
  normalizedT: number,
  cutawayMode: RagMcpStepCutawayInput
): RagMcpStep4State {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.28, 0.44, t)),
    glassDropProgress: smoothstep(0.05, 0.34, t),
    valveClampProgress: smoothstep(0.35, 0.68, t),
    auditBellGlow: smoothstep(0.68, 0.95, t),
  };
}

export function evaluateRagMcpMemoryDiffState(
  normalizedT: number,
  cutawayMode: RagMcpStepCutawayInput
): RagMcpMemoryDiffState {
  const t = clamp01(normalizedT);
  const phaseIndex: 0 | 1 | 2 = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return {
    phaseIndex,
    cutawayOpen: resolveCutaway(cutawayMode, smoothstep(0.25, 0.42, t)),
    leftFlatGlow: smoothstep(0.04, 0.34, t),
    forensicSweepProgress: smoothstep(0.34, 0.70, t),
    rightIsolatedGlow: smoothstep(0.68, 0.95, t),
  };
}
