/**
 * Pure deterministic 5-Act choreography state machine for #002
 * Fileless AMSI Memory Bypass & Reflective DLL Injection (`amsi-reflective-dll`).
 *
 * Universe: Automated X-Ray Inspection Chamber & Zero-Floor Levitation Workshop.
 * All animation values are derived deterministically from normalized time `t` in [0, 1]
 * over a 20.0-second cycle so unit tests and Three.js stay 100% synchronized.
 */

export type AmsiCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface AmsiStoryAct {
  id: number;
  label: string;
  shortTitle: string;
  storyTitle: string;
  technicalTitle: string;
  start: number;
  end: number;
  accentHex: string;
}

export const AMSI_TIMELINE_DURATION_SEC = 20;

export const AMSI_STORY_ACTS: AmsiStoryAct[] = [
  {
    id: 0,
    label: 'Act 1 · X-Ray Enforcement',
    shortTitle: 'Act 1',
    storyTitle: 'X-Ray Belt Blocks Red Contraband',
    technicalTitle: 'Normal AMSI Scan -> Defender Blocks Threat',
    start: 0.0,
    end: 0.18,
    accentHex: '#06B6D4',
  },
  {
    id: 1,
    label: 'Act 2 · Hatch Unlock',
    shortTitle: 'Act 2',
    storyTitle: 'Wrench Unbolts Side Circuit Hatch',
    technicalTitle: 'GetProcAddress + VirtualProtect (0x20 -> 0x40)',
    start: 0.18,
    end: 0.38,
    accentHex: '#F59E0B',
  },
  {
    id: 2,
    label: 'Act 3 · 6-Pin Jumper Swap',
    shortTitle: 'Act 3',
    storyTitle: '6 Copper Fuses Out, Brass Jumper In',
    technicalTitle: '6-Byte E_INVALIDARG Patch & RX Re-Lock',
    start: 0.38,
    end: 0.62,
    accentHex: '#E11D48',
  },
  {
    id: 3,
    label: 'Act 4 · Mid-Air Assembly',
    shortTitle: 'Act 4',
    storyTitle: 'Air-Tube Drop & Zero-Floor Drone Build',
    technicalTitle: 'WebClient.DownloadData + Reflective CLR Load',
    start: 0.62,
    end: 0.84,
    accentHex: '#A855F7',
  },
  {
    id: 4,
    label: 'Act 5 · Blind Watchtower',
    shortTitle: 'Act 5',
    storyTitle: 'Watchtower Reads Clean While Witnesses Glow',
    technicalTitle: 'AMSI Blinded · EID 4104 + EtwTiLogProtectVM',
    start: 0.84,
    end: 1.0,
    accentHex: '#10B981',
  },
];

export interface AmsiChoreographyState {
  t: number;
  actIndex: number;
  /** Normal green crate glide progress on left conveyor (0..1) */
  greenCrateX: number;
  greenCrateVisible: boolean;
  /** Red contraband canister glide progress (0..1) */
  redCanisterX: number;
  redCanisterVisible: boolean;
  /** 0 = raised open, 1 = slammed down blocking belt */
  dropGateClosed: number;
  /** 0 = calm cyan, 1 = crimson threat alarm */
  xrayAlertLevel: number;
  /** Watchtower alarm siren & overhead copper wire power (1 = live wire, 0 = cut by jumper) */
  watchtowerWireLive: number;
  watchtowerSirenPulse: number;
  /** Covert technician position inside workshop room */
  technicianX: number;
  technicianZ: number;
  technicianFacingY: number;
  /** Brass wrench engagement & rotation */
  wrenchVisible: boolean;
  wrenchTurnAngle: number;
  /** Blue glass safety hatch opening angle in radians (0 .. 1.83 rad = 105 deg) */
  hatchOpenRad: number;
  /** 0 = blue RX sealed, 1 = amber RWX unlocked */
  rwxUnlockGlow: number;
  /** Cutaway hood openness (0 = closed, 1 = cutaway open) */
  cutawayAmount: number;
  /** 0 = seated in slots, 1 = lifted out & ejected */
  copperFusesExtracted: number;
  /** 0 = hovering above, 1 = firmly snapped into slots 1..6 */
  brassJumperInserted: number;
  /** 0 = idle, 1 = bouncing amber SKIP signal off jumper */
  skipPulseActive: number;
  /** Paper-tape transcript printer unroll progress (EID 4104, 0..1) */
  paperTapeLength: number;
  /** Violet UV hinge crack sensor beacon (EtwTiLogProtectVM, 0..1) */
  uvHingeBeacon: number;
  /** Overhead pneumatic air-tube drop progress (0..1) */
  airTubeDropProgress: number;
  /** Mid-air levitation drone convergence (0 = separated pieces, 1 = assembled spinning drone) */
  droneAssemblyProgress: number;
  droneHoverY: number;
  droneSpinRad: number;
  /** Warehouse NTFS floor scale reading — MUST remain 0.0 kg throughout entire attack */
  warehouseScaleKg: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function segment(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  return clamp01((t - start) / (end - start));
}

function easeOutCubic(x: number): number {
  const c = clamp01(x);
  return 1 - Math.pow(1 - c, 3);
}

function easeInOutQuad(x: number): number {
  const c = clamp01(x);
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
}

export function getActiveAmsiActIndex(t: number): number {
  const clamped = clamp01(t);
  for (let i = AMSI_STORY_ACTS.length - 1; i >= 0; i -= 1) {
    if (clamped >= AMSI_STORY_ACTS[i].start) return i;
  }
  return 0;
}

export function evaluateAmsiChoreography(
  rawT: number,
  cutawayMode: AmsiCutawayMode = 'AUTO'
): AmsiChoreographyState {
  const t = clamp01(rawT);
  const actIndex = getActiveAmsiActIndex(t);

  // Act 1 (0.00 - 0.18): Green crate passes cleanly, then red canister triggers drop-gate
  const greenP = segment(t, 0.0, 0.085);
  const greenCrateVisible = t < 0.095;
  const greenCrateX = -6.2 + easeInOutQuad(greenP) * 5.6;

  const redApproach = segment(t, 0.08, 0.145);
  const redRetreat = segment(t, 0.175, 0.21);
  const redCanisterVisible = t >= 0.075 && t < 0.215;
  const redCanisterX = -6.0 + easeOutCubic(redApproach) * 3.1 - easeInOutQuad(redRetreat) * 2.2;

  const gateSlam = easeOutCubic(segment(t, 0.125, 0.148));
  const gateLift = easeInOutQuad(segment(t, 0.185, 0.23));
  const dropGateClosed = clamp01(gateSlam - gateLift);

  const xrayAlertLevel =
    t >= 0.115 && t <= 0.185
      ? Math.sin(segment(t, 0.115, 0.185) * Math.PI)
      : 0;

  // Watchtower wire stays live until brass jumper snaps into slots 1..6 (t = 0.52)
  const wireCutProgress = easeOutCubic(segment(t, 0.50, 0.54));
  const watchtowerWireLive = clamp01(1 - wireCutProgress);
  const watchtowerSirenPulse =
    t >= 0.12 && t <= 0.185 ? 0.5 + 0.5 * Math.sin(t * 95) : 0;

  // Act 2 (0.18 - 0.38): Technician approaches X-Ray side panel, paper tape prints, wrench unlocks hatch
  const walkToPanel = easeInOutQuad(segment(t, 0.18, 0.25));
  const stepBackToRing = easeInOutQuad(segment(t, 0.60, 0.70));
  const technicianX = -4.2 + walkToPanel * 2.1 + stepBackToRing * 4.4;
  const technicianZ = 2.4 - walkToPanel * 0.9 + stepBackToRing * 0.4;
  const technicianFacingY =
    t < 0.60 ? -Math.PI * 0.18 * walkToPanel : Math.PI * 0.35 * stepBackToRing;

  const wrenchVisible = t >= 0.24 && t <= 0.37;
  const wrenchTurnAngle = easeInOutQuad(segment(t, 0.25, 0.34)) * Math.PI * 1.5;

  // Hatch opens in Act 2 (0.29..0.37), stays open through Act 3 fuse swap, closes at 0.55..0.61
  const hatchOpen = easeOutCubic(segment(t, 0.29, 0.37));
  const hatchClose = easeInOutQuad(segment(t, 0.55, 0.61));
  const hatchOpenFactor = clamp01(hatchOpen - hatchClose);
  const hatchOpenRad = hatchOpenFactor * ((105 * Math.PI) / 180);

  // RWX amber glow active while VirtualProtect 0x40 is open, then restores to cool blue 0x20
  const rwxUnlockGlow = clamp01(
    easeOutCubic(segment(t, 0.28, 0.35)) - easeInOutQuad(segment(t, 0.56, 0.61))
  );

  // Cutaway hood override
  const autoCutaway = clamp01(
    easeOutCubic(segment(t, 0.35, 0.41)) -
      easeInOutQuad(segment(t, 0.62, 0.68)) +
      easeOutCubic(segment(t, 0.86, 0.92)) * 0.85
  );
  const cutawayAmount =
    cutawayMode === 'OPEN'
      ? 1
      : cutawayMode === 'SEALED'
        ? 0
        : autoCutaway;

  // Act 3 (0.38 - 0.62): 6 copper fuses lifted out, 6-pin brass jumper locked in
  const copperFusesExtracted = easeInOutQuad(segment(t, 0.39, 0.48));
  const brassJumperInserted = easeOutCubic(segment(t, 0.48, 0.55));

  // Paper-tape printer (EID 4104) reels out during Act 2 and remains visible as witness
  const paperTapeLength = easeOutCubic(segment(t, 0.20, 0.36));

  // Violet UV hinge sensor (EtwTiLogProtectVM) flashes when hatch unlocks and glows in Act 5 witness finale
  const unlockFlash =
    t >= 0.29 && t <= 0.44
      ? 0.65 + 0.35 * Math.sin(segment(t, 0.29, 0.44) * Math.PI * 5)
      : 0;
  const finaleWitness = easeOutCubic(segment(t, 0.84, 0.91)) * 0.92;
  const uvHingeBeacon = clamp01(Math.max(unlockFlash, finaleWitness));

  // Act 4 (0.62 - 0.84): Air-tube drops parts onto mid-air levitation ring; SKIP bounce proves AMSI is blind
  const airTubeDropProgress = easeOutCubic(segment(t, 0.62, 0.72));
  const skipPulseActive =
    t >= 0.68 && t <= 0.80
      ? Math.sin(segment(t, 0.68, 0.80) * Math.PI)
      : 0;
  const droneAssemblyProgress = easeInOutQuad(segment(t, 0.70, 0.84));
  const droneHoverY =
    2.15 + Math.sin(t * Math.PI * 10) * 0.12 * clamp01(droneAssemblyProgress + 0.2);
  const droneSpinRad =
    segment(t, 0.72, 1.0) * Math.PI * 4.5;

  return {
    t,
    actIndex,
    greenCrateX,
    greenCrateVisible,
    redCanisterX,
    redCanisterVisible,
    dropGateClosed,
    xrayAlertLevel,
    watchtowerWireLive,
    watchtowerSirenPulse,
    technicianX,
    technicianZ,
    technicianFacingY,
    wrenchVisible,
    wrenchTurnAngle,
    hatchOpenRad,
    rwxUnlockGlow,
    cutawayAmount,
    copperFusesExtracted,
    brassJumperInserted,
    skipPulseActive,
    paperTapeLength,
    uvHingeBeacon,
    airTubeDropProgress,
    droneAssemblyProgress,
    droneHoverY,
    droneSpinRad,
    // Zero-disk invariant: warehouse NTFS floor scale NEVER registers any mass
    warehouseScaleKg: 0,
  };
}
