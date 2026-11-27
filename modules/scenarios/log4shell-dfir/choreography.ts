export type Log4shellCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface Log4shellStoryAct {
  id: number;
  startNorm: number;
  endNorm: number;
  label: string;
}

export const LOG4SHELL_TIMELINE_DURATION_SEC = 20;

export const LOG4SHELL_STORY_ACTS: readonly Log4shellStoryAct[] = [
  { id: 1, startNorm: 0.0, endNorm: 0.22, label: 'Act 1 · Inbound Labeled Parcel' },
  { id: 2, startNorm: 0.22, endNorm: 0.46, label: 'Act 2 · Logging Press Evaluates Token' },
  { id: 3, startNorm: 0.46, endNorm: 0.7, label: 'Act 3 · Outbound Pneumatic Tube Lookup' },
  { id: 4, startNorm: 0.7, endNorm: 0.86, label: 'Act 4 · Unexpected Child Tool Alarm' },
  { id: 5, startNorm: 0.86, endNorm: 1.0, label: 'Act 5 · Egress Airlock & Literal Press' },
];

export interface Log4shellChoreographyFrame {
  actIndex: number;
  conveyorParcelProgress: number;
  cutawayOpen: number;
  outboundTubeProgress: number;
  auditAlarmLevel: number;
  egressValveClosed: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smooth(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  const x = clamp01((t - start) / (end - start));
  return x * x * (3 - 2 * x);
}

export function evaluateLog4shellChoreography(
  tNormRaw: number,
  cutawayMode: Log4shellCutawayMode = 'AUTO'
): Log4shellChoreographyFrame {
  const t = clamp01(tNormRaw);
  const actIndex = LOG4SHELL_STORY_ACTS.findIndex((a) => t >= a.startNorm && t < a.endNorm);
  const resolvedAct = actIndex === -1 ? LOG4SHELL_STORY_ACTS.length - 1 : actIndex;

  const conveyorParcelProgress = smooth(t, 0.02, 0.24);
  const autoCutaway = smooth(t, 0.22, 0.3);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  const outboundTubeProgress = smooth(t, 0.46, 0.7);
  const auditAlarmLevel = smooth(t, 0.7, 0.86);
  const egressValveClosed = smooth(t, 0.85, 0.96);

  return {
    actIndex: resolvedAct,
    conveyorParcelProgress,
    cutawayOpen,
    outboundTubeProgress,
    auditAlarmLevel,
    egressValveClosed,
  };
}

export const LOG4SHELL_STEP_DURATION_SEC = 15;

export interface Log4shellStep1Frame {
  phaseIndex: number;
  parcelRollProgress: number;
  cameraFlashIntensity: number;
  obfuscationBypassGlow: number;
  cutawayOpen: number;
}

export function evaluateLog4shellStep1State(
  tNormRaw: number,
  cutawayMode: Log4shellCutawayMode = 'AUTO'
): Log4shellStep1Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const parcelRollProgress = smooth(t, 0.04, 0.88);
  const cameraFlashIntensity = smooth(t, 0.30, 0.62);
  const obfuscationBypassGlow = smooth(t, 0.66, 0.94);
  const autoCut = smooth(t, 0.22, 0.36);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    parcelRollProgress,
    cameraFlashIntensity,
    obfuscationBypassGlow,
    cutawayOpen,
  };
}

export interface Log4shellStep2Frame {
  phaseIndex: number;
  gearSpinBoost: number;
  jndiDispatchLevel: number;
  sbomScanPulse: number;
  cutawayOpen: number;
}

export function evaluateLog4shellStep2State(
  tNormRaw: number,
  cutawayMode: Log4shellCutawayMode = 'AUTO'
): Log4shellStep2Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const gearSpinBoost = smooth(t, 0.04, 0.34);
  const jndiDispatchLevel = smooth(t, 0.34, 0.68);
  const sbomScanPulse = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.14, 0.28);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    gearSpinBoost,
    jndiDispatchLevel,
    sbomScanPulse,
    cutawayOpen,
  };
}

export interface Log4shellStep3Frame {
  phaseIndex: number;
  canisterTravel: number;
  execveSpawnProgress: number;
  dualProofAlarm: number;
  cutawayOpen: number;
}

export function evaluateLog4shellStep3State(
  tNormRaw: number,
  cutawayMode: Log4shellCutawayMode = 'AUTO'
): Log4shellStep3Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const canisterTravel = smooth(t, 0.04, 0.42);
  const execveSpawnProgress = smooth(t, 0.36, 0.70);
  const dualProofAlarm = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.24, 0.38);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    canisterTravel,
    execveSpawnProgress,
    dualProofAlarm,
    cutawayOpen,
  };
}

export interface Log4shellStep4Frame {
  phaseIndex: number;
  airlockDropProgress: number;
  literalPatchProgress: number;
  secretRotateProgress: number;
  cutawayOpen: number;
}

export function evaluateLog4shellStep4State(
  tNormRaw: number,
  cutawayMode: Log4shellCutawayMode = 'AUTO'
): Log4shellStep4Frame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const airlockDropProgress = smooth(t, 0.04, 0.35);
  const literalPatchProgress = smooth(t, 0.35, 0.68);
  const secretRotateProgress = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.14, 0.28);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    airlockDropProgress,
    literalPatchProgress,
    secretRotateProgress,
    cutawayOpen,
  };
}

export interface Log4shellMemoryDiffFrame {
  phaseIndex: number;
  vulnLookupSpin: number;
  sbomBeamSweep: number;
  patchedShieldPulse: number;
  cutawayOpen: number;
}

export function evaluateLog4shellMemoryDiffState(
  tNormRaw: number,
  cutawayMode: Log4shellCutawayMode = 'AUTO'
): Log4shellMemoryDiffFrame {
  const t = clamp01(tNormRaw);
  const phaseIndex = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const vulnLookupSpin = smooth(t, 0.04, 0.34);
  const sbomBeamSweep = smooth(t, 0.30, 0.72);
  const patchedShieldPulse = smooth(t, 0.68, 0.94);
  const autoCut = smooth(t, 0.12, 0.26);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phaseIndex,
    vulnLookupSpin,
    sbomBeamSweep,
    patchedShieldPulse,
    cutawayOpen,
  };
}

