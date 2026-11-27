export type ThreeCxCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface ThreeCxStoryAct {
  id: number;
  stageTag: string;
  title: string;
  startNorm: number;
  endNorm: number;
  accentHex: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export const THREECX_TIMELINE_DURATION_SEC = 20.0;

/**
 * Pure deterministic 5-Act screenplay for #004 Lazarus 3CX Supply Chain:
 * Cleanroom Telecommunications Assembly Line, Gold Hologram Signing Press & Public Icon Gallery Wall.
 */
export const THREECX_STORY_ACTS: readonly ThreeCxStoryAct[] = [
  {
    id: 0,
    stageTag: 'ACT 1 · PRE-SIGNING CLEANROOM TAMPER',
    title: 'Covert Arm Slips Gear & Prism Into Phone',
    startNorm: 0.0,
    endNorm: 0.2,
    accentHex: '#E11D48',
    cameraPosition: [-4.2, 3.6, 8.6],
    cameraTarget: [-3.4, 2.0, 0.0],
  },
  {
    id: 1,
    stageTag: 'ACT 2 · OFFICIAL GOLD HOLOGRAM PRESS',
    title: 'Genuine Seal Stamped & Inspector Waves Through',
    startNorm: 0.2,
    endNorm: 0.38,
    accentHex: '#10B981',
    cameraPosition: [-1.8, 3.6, 8.2],
    cameraTarget: [-1.4, 2.1, 0.0],
  },
  {
    id: 2,
    stageTag: 'ACT 3 · PHONE CUTAWAY & PRISM CORE UNWIND',
    title: 'Rigged Gear Cracks Amber Core & Unspools Radio',
    startNorm: 0.38,
    endNorm: 0.62,
    accentHex: '#D97706',
    cameraPosition: [1.0, 2.9, 5.4],
    cameraTarget: [1.0, 1.9, 0.1],
  },
  {
    id: 3,
    stageTag: 'ACT 4 · PUBLIC ICON GALLERY DEAD-DROP',
    title: 'Hidden Red Border Strip Peels Off Framed Tile',
    startNorm: 0.62,
    endNorm: 0.84,
    accentHex: '#0284C7',
    cameraPosition: [3.8, 3.3, 7.6],
    cameraTarget: [3.4, 2.3, -1.4],
  },
  {
    id: 4,
    stageTag: 'ACT 5 · KEYCARD SIPHON & VIP VAULT CATCH',
    title: 'Browser Cards Pulled & Watch Monitor Alerts',
    startNorm: 0.84,
    endNorm: 1.0,
    accentHex: '#7C3AED',
    cameraPosition: [5.4, 5.4, 12.0],
    cameraTarget: [0.8, 2.4, -0.5],
  },
] as const;

export interface ThreeCxChoreographyFrame {
  normalizedTime: number;
  actIndex: number;
  actProgress: number;
  /** 0 = left cleanroom entry, 0.45 = under hologram press, 1 = seated on customer desk */
  phoneConveyorProgress: number;
  /** 0 = retracted in upstream vent, 1 = lowered inserting rigged gear & prism */
  sabotageArmExtend: number;
  /** 0 = normal stock parts, 1 = rigged audio gear + secret-core prism seated inside phone */
  riggedPartsSeated: number;
  /** 0 = press raised, 1 = press stamped onto closed phone lid */
  hologramPressDown: number;
  /** True once official press embosses the genuine emerald-gold seal (stays 100% authentic!) */
  hologramAuthentic: boolean;
  /** 0..1 quality inspector green wand scan & wave-through */
  inspectorGreenPass: number;
  /** 0 = closed white phone lid, 1 = cutaway top shell lifted open */
  cutawayOpen: number;
  /** Continuous rotation angle (radians) of rigged audio gear inside phone */
  riggedGearSpin: number;
  /** 0 = prism sealed, 1 = base seam cracked revealing glowing amber cipher capsule */
  prismCoreCracked: number;
  /** 0..1 amber cipher spool unwinding into hovering holographic radio */
  cipherSpoolUnwound: number;
  /** 0..1 cyan scan beam hitting framed icon tile #4 on public gallery wall */
  galleryScanBeam: number;
  /** 0..1 secret crimson border strip peeling cleanly off bottom edge of tile #4 */
  hiddenStripPeeled: number;
  /** 0..1 desktop browser keycards siphoning into the phone */
  keycardSiphon: number;
  /** 0..1 selective crimson tether locking onto elevated VIP vault */
  vipVaultTether: number;
  /** 0..1 violet behavioral watch monitor flashing anomaly alert */
  edrBehavioralAlert: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / Math.max(1e-6, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function getActiveThreeCxActIndex(normalizedTime: number): number {
  const t = clamp01(normalizedTime);
  for (let i = 0; i < THREECX_STORY_ACTS.length; i++) {
    const act = THREECX_STORY_ACTS[i];
    if (t >= act.startNorm && (t < act.endNorm || i === THREECX_STORY_ACTS.length - 1)) {
      return i;
    }
  }
  return 0;
}

export function evaluateThreeCxChoreography(
  normalizedTime: number,
  cutawayMode: ThreeCxCutawayMode = 'AUTO'
): ThreeCxChoreographyFrame {
  const t = clamp01(normalizedTime);
  const actIndex = getActiveThreeCxActIndex(t);
  const act = THREECX_STORY_ACTS[actIndex];
  const actProgress = clamp01((t - act.startNorm) / Math.max(1e-6, act.endNorm - act.startNorm));

  // Act 1: Covert upstream robotic arm lowers into open phone at x = left cleanroom station
  const sabotageArmExtend =
    t < 0.2
      ? smoothstep(0.02, 0.09, t) * (1 - smoothstep(0.14, 0.2, t))
      : 0;
  const riggedPartsSeated = smoothstep(0.08, 0.14, t);

  // Conveyor glides phone from tamper zone (0.0) -> hologram press (0.45) -> customer desk (1.0)
  const toPress = smoothstep(0.17, 0.24, t) * 0.45;
  const toDesk = smoothstep(0.32, 0.4, t) * 0.55;
  const phoneConveyorProgress = clamp01(toPress + toDesk);

  // Act 2: Genuine gold hologram press stamps down, inspector scans emerald green
  const hologramPressDown =
    t >= 0.23 && t <= 0.32
      ? smoothstep(0.23, 0.27, t) * (1 - smoothstep(0.28, 0.32, t))
      : 0;
  const hologramAuthentic = t >= 0.27;
  const inspectorGreenPass = smoothstep(0.29, 0.36, t);

  // Cutaway opens during Act 1 tamper & Act 3..5 phone interior activation
  let cutawayOpen = 0;
  if (cutawayMode === 'OPEN') {
    cutawayOpen = 1;
  } else if (cutawayMode === 'SEALED') {
    cutawayOpen = 0;
  } else {
    const preSignOpen = 1 - smoothstep(0.17, 0.22, t);
    const deskOpen = smoothstep(0.39, 0.45, t);
    cutawayOpen = clamp01(Math.max(preSignOpen, deskOpen));
  }

  // Act 3: Rigged audio gear spins, cracks prism base seam, unwinds amber spool into hovering radio
  const riggedGearSpin = t >= 0.4 ? (t - 0.4) * Math.PI * 12 : 0;
  const prismCoreCracked = smoothstep(0.44, 0.52, t);
  const cipherSpoolUnwound = smoothstep(0.5, 0.61, t);

  // Act 4: Radio scans framed gallery tile #4 and peels hidden crimson border strip off bottom
  const galleryScanBeam =
    t >= 0.62 ? smoothstep(0.62, 0.69, t) * (1 - smoothstep(0.84, 0.9, t) * 0.5) : 0;
  const hiddenStripPeeled = smoothstep(0.69, 0.81, t);

  // Act 5: Browser keycards siphon into phone, VIP vault locks on, behavioral monitor flares violet
  const keycardSiphon = smoothstep(0.84, 0.94, t);
  const vipVaultTether = smoothstep(0.87, 0.96, t);
  const edrBehavioralAlert = smoothstep(0.88, 0.97, t);

  return {
    normalizedTime: t,
    actIndex,
    actProgress,
    phoneConveyorProgress,
    sabotageArmExtend,
    riggedPartsSeated,
    hologramPressDown,
    hologramAuthentic,
    inspectorGreenPass,
    cutawayOpen,
    riggedGearSpin,
    prismCoreCracked,
    cipherSpoolUnwound,
    galleryScanBeam,
    hiddenStripPeeled,
    keycardSiphon,
    vipVaultTether,
    edrBehavioralAlert,
  };
}

// ---------------------------------------------------------------------------
// MOD-18 Standalone Per-Section Engines (Steps 1..4 + Memory Diff)
// ---------------------------------------------------------------------------

export interface ThreeCxStep1State {
  phase: 0 | 1 | 2;
  sabotageArmExtend: number;
  riggedPartsSeated: number;
  phoneXProgress: number;
  pressStampDown: number;
  hologramAuthentic: boolean;
  inspectorGreenPass: number;
  cutawayOpen: number;
}

export function evaluateThreeCxStep1State(
  timeSec: number,
  cutawayMode: ThreeCxCutawayMode = 'AUTO'
): ThreeCxStep1State {
  const t = clamp01((timeSec % 14) / 14);
  const phase: 0 | 1 | 2 = t < 4.8 / 14 ? 0 : t < 9.6 / 14 ? 1 : 2;
  const sabotageArmExtend =
    t < 0.36 ? smoothstep(0.04, 0.16, t) * (1 - smoothstep(0.24, 0.35, t)) : 0;
  const riggedPartsSeated = smoothstep(0.14, 0.25, t);
  const toPress = smoothstep(0.28, 0.44, t) * 0.5;
  const toGate = smoothstep(0.64, 0.84, t) * 0.5;
  const phoneXProgress = clamp01(toPress + toGate);
  const pressStampDown =
    t >= 0.44 && t <= 0.64
      ? smoothstep(0.44, 0.52, t) * (1 - smoothstep(0.55, 0.64, t))
      : 0;
  const hologramAuthentic = t >= 0.52;
  const inspectorGreenPass = smoothstep(0.72, 0.92, t);
  const autoCut = 1 - smoothstep(0.27, 0.38, t);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phase,
    sabotageArmExtend,
    riggedPartsSeated,
    phoneXProgress,
    pressStampDown,
    hologramAuthentic,
    inspectorGreenPass,
    cutawayOpen,
  };
}

export interface ThreeCxStep2State {
  phase: 0 | 1 | 2;
  cutawayOpen: number;
  gearAngle: number;
  prismCracked: number;
  rc4Unwind: number;
  hoverRadioScale: number;
  rwxAllocated: boolean;
}

export function evaluateThreeCxStep2State(
  timeSec: number,
  cutawayMode: ThreeCxCutawayMode = 'AUTO'
): ThreeCxStep2State {
  const t = clamp01((timeSec % 14) / 14);
  const phase: 0 | 1 | 2 = t < 4.5 / 14 ? 0 : t < 9.2 / 14 ? 1 : 2;
  const autoCut = smoothstep(0.05, 0.24, t);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  const gearAngle = t * Math.PI * 14;
  const prismCracked = smoothstep(0.32, 0.58, t);
  const rc4Unwind = smoothstep(0.56, 0.86, t);
  const hoverRadioScale = smoothstep(0.66, 0.92, t);
  return {
    phase,
    cutawayOpen,
    gearAngle,
    prismCracked,
    rc4Unwind,
    hoverRadioScale,
    rwxAllocated: hoverRadioScale > 0.5,
  };
}

export interface ThreeCxStep3State {
  phase: 0 | 1 | 2;
  scanBeamActive: number;
  tileTilt: number;
  stripPeeled: number;
  c2DishLocked: number;
  cutawayOpen: number;
}

export function evaluateThreeCxStep3State(
  timeSec: number,
  cutawayMode: ThreeCxCutawayMode = 'AUTO'
): ThreeCxStep3State {
  const t = clamp01((timeSec % 12) / 12);
  const phase: 0 | 1 | 2 = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const scanBeamActive = smoothstep(0.06, 0.24, t);
  const tileTilt = smoothstep(0.32, 0.52, t);
  const stripPeeled = smoothstep(0.38, 0.68, t);
  const c2DishLocked = smoothstep(0.66, 0.92, t);
  const autoCut = smoothstep(0.34, 0.52, t);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phase,
    scanBeamActive,
    tileTilt,
    stripPeeled,
    c2DishLocked,
    cutawayOpen,
  };
}

export interface ThreeCxStep4State {
  phase: 0 | 1 | 2;
  keycardSiphon: number;
  vipTetherActive: number;
  edrAlertLevel: number;
  containmentActive: boolean;
  cutawayOpen: number;
}

export function evaluateThreeCxStep4State(
  timeSec: number,
  cutawayMode: ThreeCxCutawayMode = 'AUTO'
): ThreeCxStep4State {
  const t = clamp01((timeSec % 12) / 12);
  const phase: 0 | 1 | 2 = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const keycardSiphon = smoothstep(0.05, 0.42, t);
  const vipTetherActive = smoothstep(0.34, 0.66, t);
  const edrAlertLevel = smoothstep(0.64, 0.9, t);
  const autoCut = smoothstep(0.08, 0.28, t);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phase,
    keycardSiphon,
    vipTetherActive,
    edrAlertLevel,
    containmentActive: edrAlertLevel > 0.5,
    cutawayOpen,
  };
}

export interface ThreeCxMemoryDiffState {
  phase: 0 | 1 | 2;
  laserSweepX: number;
  amberTrailerHighlight: number;
  floatingCoreLift: number;
  cutawayOpen: number;
}

export function evaluateThreeCxMemoryDiffState(
  timeSec: number,
  cutawayMode: ThreeCxCutawayMode = 'AUTO'
): ThreeCxMemoryDiffState {
  const t = clamp01((timeSec % 12) / 12);
  const phase: 0 | 1 | 2 = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const laserSweepX = -3.4 + smoothstep(0.06, 0.92, t) * 7.2;
  const amberTrailerHighlight = smoothstep(0.32, 0.6, t);
  const floatingCoreLift = smoothstep(0.62, 0.9, t);
  const autoCut = smoothstep(0.18, 0.42, t);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCut;
  return {
    phase,
    laserSweepX,
    amberTrailerHighlight,
    floatingCoreLift,
    cutawayOpen,
  };
}

