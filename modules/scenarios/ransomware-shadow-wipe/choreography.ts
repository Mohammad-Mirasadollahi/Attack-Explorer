export type LockbitCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface LockbitStoryAct {
  id: number;
  stageTag: string;
  title: string;
  startNorm: number;
  endNorm: number;
  accentHex: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export const LOCKBIT_TIMELINE_DURATION_SEC = 20.0;

/**
 * Pure deterministic 5-Act screenplay for #003 LockBit Ransomware:
 * The Municipal Records Vault & Archival Backup Reel Room.
 */
export const LOCKBIT_STORY_ACTS: readonly LockbitStoryAct[] = [
  {
    id: 0,
    stageTag: 'ACT 1 · ARCHIVE BASELINE',
    title: 'Backup Reels Spinning & Unlocked Ledgers',
    startNorm: 0.0,
    endNorm: 0.18,
    accentHex: '#10B981',
    cameraPosition: [0.2, 5.4, 14.2],
    cameraTarget: [0.0, 2.2, 0.0],
  },
  {
    id: 1,
    stageTag: 'ACT 2 · REMOTE SERVICE DISPATCH',
    title: 'Armored Capsule Trips Master Switch',
    startNorm: 0.18,
    endNorm: 0.36,
    accentHex: '#F59E0B',
    cameraPosition: [-4.6, 3.3, 7.0],
    cameraTarget: [-3.4, 2.0, -0.2],
  },
  {
    id: 2,
    stageTag: 'ACT 3 · BACKUP SHREDDER & LEVER SNAP',
    title: 'Backup Reels Shredded & Recovery Snapped',
    startNorm: 0.36,
    endNorm: 0.6,
    accentHex: '#EA580C',
    cameraPosition: [-3.6, 3.0, 6.2],
    cameraTarget: [-2.8, 1.9, 0.1],
  },
  {
    id: 3,
    stageTag: 'ACT 4 · PARALLEL HEADER LOCKING',
    title: 'Four Arms Stamp Top Band & Snap Padlocks',
    startNorm: 0.6,
    endNorm: 0.84,
    accentHex: '#DC2626',
    cameraPosition: [1.8, 3.1, 6.4],
    cameraTarget: [1.5, 1.9, 0.1],
  },
  {
    id: 4,
    stageTag: 'ACT 5 · EXTORTION PLACARD & AUDIT BEACON',
    title: 'Notice Bolted on Glass & Audit Lamp Flashing',
    startNorm: 0.84,
    endNorm: 1.0,
    accentHex: '#7C3AED',
    cameraPosition: [5.4, 5.4, 11.8],
    cameraTarget: [0.4, 2.3, -0.4],
  },
] as const;

export interface LockbitChoreographyFrame {
  normalizedTime: number;
  actIndex: number;
  actProgress: number;
  /** 0 = parked left conduit, 1 = latched in service hatch */
  capsuleProgress: number;
  /** 0 = off, 1 = SYSTEM breaker pulled down */
  breakerDown: number;
  /** 0..1 per reel (0 = intact spinning on spindle, 1 = completely shredded) */
  reelShredProgress: [number, number, number, number];
  /** Shredder roller angular velocity factor (0..1) */
  shredderSpin: number;
  /** 0 = empty bin, 1 = overflowing with silver shredded strips */
  ribbonHeapLevel: number;
  /** 0 = intact green recovery lever, 1 = snapped cleanly off hinge */
  recoveryLeverSnapped: number;
  /** Cutaway visibility on shredder hood & glass vault fronts (0..1) */
  cutawayOpen: number;
  /** 0..1 stamp plunge per overhead gantry arm (4 parallel IOCP workers) */
  gantryArmPlunge: [number, number, number, number];
  /** 0..1 crimson head-only top band scorched on each ledger stack (lower 85% stays white!) */
  ledgerHeaderLocked: [number, number, number, number];
  /** Fixed structural ratio proving intermittent head-only encryption (85% body untouched) */
  bodyUntouchedRatio: number;
  /** 0..1 heavy crimson cast-iron padlock closed on vaults 1..4 */
  padlockShut: [number, number, number, number];
  /** 0..1 extortion notice placard bolted onto front glass door */
  ransomPlacardBolted: number;
  /** 0..1 lobby wall display flipped to crimson lock screen */
  wallpaperCrimson: number;
  /** 0..1 ceiling SIEM audit beacon intensity (EID 7045 -> EID 1/7036 -> EID 1102 violet flare) */
  auditBeaconLevel: number;
  /** True once wevtutil audit-wipe triggers EID 1102 violet flare */
  auditWipeAlarmActive: boolean;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / Math.max(1e-6, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function getActiveLockbitActIndex(normalizedTime: number): number {
  const t = clamp01(normalizedTime);
  for (let i = 0; i < LOCKBIT_STORY_ACTS.length; i++) {
    const act = LOCKBIT_STORY_ACTS[i];
    if (t >= act.startNorm && (t < act.endNorm || i === LOCKBIT_STORY_ACTS.length - 1)) {
      return i;
    }
  }
  return 0;
}

export function evaluateLockbitChoreography(
  normalizedTime: number,
  cutawayMode: LockbitCutawayMode = 'AUTO'
): LockbitChoreographyFrame {
  const t = clamp01(normalizedTime);
  const actIndex = getActiveLockbitActIndex(t);
  const act = LOCKBIT_STORY_ACTS[actIndex];
  const actProgress = clamp01((t - act.startNorm) / Math.max(1e-6, act.endNorm - act.startNorm));

  // Act 2: PsExec remote dispatch capsule & SYSTEM breaker
  const capsuleProgress = smoothstep(0.18, 0.29, t);
  const breakerDown = smoothstep(0.27, 0.35, t);

  // Act 3: 4 silver backup reels drop sequentially into industrial shredder
  const reelShredProgress: [number, number, number, number] = [
    smoothstep(0.36, 0.44, t),
    smoothstep(0.4, 0.48, t),
    smoothstep(0.44, 0.52, t),
    smoothstep(0.48, 0.56, t),
  ];
  const shredderSpin =
    t >= 0.35 && t <= 0.62
      ? Math.min(1, smoothstep(0.35, 0.39, t) * (1 - smoothstep(0.57, 0.62, t) * 0.7))
      : t > 0.62
        ? 0.15
        : 0;
  const ribbonHeapLevel = smoothstep(0.39, 0.58, t);
  const recoveryLeverSnapped = smoothstep(0.51, 0.59, t);

  // Cutaway opens automatically during shredder (Act 3) and head-only ledger locking (Act 4)
  let cutawayOpen = 0;
  if (cutawayMode === 'OPEN') {
    cutawayOpen = 1;
  } else if (cutawayMode === 'SEALED') {
    cutawayOpen = 0;
  } else {
    const openIn = smoothstep(0.36, 0.42, t);
    const closeOut = 1 - smoothstep(0.86, 0.93, t) * 0.45;
    cutawayOpen = clamp01(openIn * closeOut);
  }

  // Act 4: 4 parallel IOCP gantry arms plunge in rapid staggered bursts (head-only stripe)
  const armWave = (start: number, peak: number, end: number) => {
    if (t < start || t > end) return 0;
    return t <= peak
      ? smoothstep(start, peak, t)
      : 1 - smoothstep(peak, end, t);
  };
  const gantryArmPlunge: [number, number, number, number] = [
    armWave(0.61, 0.66, 0.74),
    armWave(0.63, 0.68, 0.76),
    armWave(0.65, 0.7, 0.78),
    armWave(0.67, 0.72, 0.8),
  ];
  const ledgerHeaderLocked: [number, number, number, number] = [
    smoothstep(0.64, 0.69, t),
    smoothstep(0.66, 0.71, t),
    smoothstep(0.68, 0.73, t),
    smoothstep(0.7, 0.75, t),
  ];
  const padlockShut: [number, number, number, number] = [
    smoothstep(0.72, 0.77, t),
    smoothstep(0.74, 0.79, t),
    smoothstep(0.76, 0.81, t),
    smoothstep(0.78, 0.83, t),
  ];

  // Act 5: Extortion placard bolted onto entrance glass, wallpaper flips crimson, EID 1102 audit beacon flares
  const ransomPlacardBolted = smoothstep(0.84, 0.92, t);
  const wallpaperCrimson = smoothstep(0.86, 0.94, t);
  const auditBeaconLevel = clamp01(
    smoothstep(0.24, 0.34, t) * 0.45 +
      smoothstep(0.42, 0.55, t) * 0.25 +
      smoothstep(0.87, 0.95, t) * 0.3
  );
  const auditWipeAlarmActive = t >= 0.88;

  return {
    normalizedTime: t,
    actIndex,
    actProgress,
    capsuleProgress,
    breakerDown,
    reelShredProgress,
    shredderSpin,
    ribbonHeapLevel,
    recoveryLeverSnapped,
    cutawayOpen,
    gantryArmPlunge,
    ledgerHeaderLocked,
    bodyUntouchedRatio: 0.85,
    padlockShut,
    ransomPlacardBolted,
    wallpaperCrimson,
    auditBeaconLevel,
    auditWipeAlarmActive,
  };
}

// ---------------------------------------------------------------------------
// MOD-18 Standalone Per-Section Engines (Steps 1..4)
// ---------------------------------------------------------------------------

export interface LockbitStep1State {
  phase: 0 | 1 | 2;
  capsuleTravel: number;
  latchEngaged: number;
  breakerDown: number;
  auditTickerExtend: number;
  cutawayOpen: number;
  alarmAmber: boolean;
}

export function evaluateLockbitStep1State(
  timeSec: number,
  cutawayMode: LockbitCutawayMode = 'AUTO'
): LockbitStep1State {
  const t = clamp01((timeSec % 12) / 12);
  const phase: 0 | 1 | 2 = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const capsuleTravel = smoothstep(0.04, 0.34, t);
  const latchEngaged = smoothstep(0.3, 0.42, t);
  const breakerDown = smoothstep(0.38, 0.64, t);
  const auditTickerExtend = smoothstep(0.66, 0.94, t);
  const autoCutaway = smoothstep(0.08, 0.22, t);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  return {
    phase,
    capsuleTravel,
    latchEngaged,
    breakerDown,
    auditTickerExtend,
    cutawayOpen,
    alarmAmber: breakerDown > 0.55,
  };
}

export interface LockbitStep2State {
  phase: 0 | 1 | 2;
  reelProgress: [number, number, number, number];
  shredderSpin: number;
  ribbonHeapLevel: number;
  leverStrain: number;
  leverSnapped: boolean;
  leverFallProgress: number;
  cutawayOpen: number;
  vssStopped: boolean;
}

export function evaluateLockbitStep2State(
  timeSec: number,
  cutawayMode: LockbitCutawayMode = 'AUTO'
): LockbitStep2State {
  const t = clamp01((timeSec % 14) / 14);
  const phase: 0 | 1 | 2 = t < 4.8 / 14 ? 0 : t < 9.6 / 14 ? 1 : 2;
  const reelProgress: [number, number, number, number] = [
    smoothstep(0.04, 0.24, t),
    smoothstep(0.14, 0.36, t),
    smoothstep(0.34, 0.54, t),
    smoothstep(0.46, 0.66, t),
  ];
  const shredderSpin =
    t >= 0.05 && t <= 0.74
      ? smoothstep(0.05, 0.14, t) * (1 - smoothstep(0.66, 0.74, t) * 0.75)
      : 0.15;
  const ribbonHeapLevel = smoothstep(0.16, 0.68, t);
  const leverStrain = smoothstep(0.66, 0.77, t);
  const leverSnapped = t >= 0.76;
  const leverFallProgress = smoothstep(0.76, 0.9, t);
  const autoCutaway = smoothstep(0.12, 0.28, t);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  return {
    phase,
    reelProgress,
    shredderSpin,
    ribbonHeapLevel,
    leverStrain,
    leverSnapped,
    leverFallProgress,
    cutawayOpen,
    vssStopped: ribbonHeapLevel > 0.45,
  };
}

export interface LockbitStep3State {
  phase: 0 | 1 | 2;
  armPlunge: [number, number, number, number];
  headerScorched: [number, number, number, number];
  padlockShut: [number, number, number, number];
  lockedFileCount: number;
  bodyUntouchedRatio: number;
  cutawayOpen: number;
}

export function evaluateLockbitStep3State(
  timeSec: number,
  cutawayMode: LockbitCutawayMode = 'AUTO'
): LockbitStep3State {
  const t = clamp01((timeSec % 14) / 14);
  const phase: 0 | 1 | 2 = t < 4.8 / 14 ? 0 : t < 9.6 / 14 ? 1 : 2;
  const wave = (s: number, p: number, e: number) =>
    t < s || t > e ? 0 : t <= p ? smoothstep(s, p, t) : 1 - smoothstep(p, e, t);
  const armPlunge: [number, number, number, number] = [
    Math.max(wave(0.06, 0.18, 0.34), wave(0.36, 0.46, 0.6)),
    Math.max(wave(0.11, 0.23, 0.39), wave(0.41, 0.51, 0.65)),
    Math.max(wave(0.16, 0.28, 0.44), wave(0.46, 0.56, 0.7)),
    Math.max(wave(0.21, 0.33, 0.49), wave(0.51, 0.61, 0.74)),
  ];
  const headerScorched: [number, number, number, number] = [
    smoothstep(0.34, 0.48, t),
    smoothstep(0.39, 0.53, t),
    smoothstep(0.44, 0.58, t),
    smoothstep(0.49, 0.63, t),
  ];
  const padlockShut: [number, number, number, number] = [
    smoothstep(0.68, 0.78, t),
    smoothstep(0.72, 0.82, t),
    smoothstep(0.76, 0.86, t),
    smoothstep(0.8, 0.9, t),
  ];
  const lockedFileCount = Math.round(smoothstep(0.32, 0.9, t) * 4820);
  const autoCutaway = smoothstep(0.14, 0.3, t) * (1 - smoothstep(0.88, 0.96, t) * 0.35);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  return {
    phase,
    armPlunge,
    headerScorched,
    padlockShut,
    lockedFileCount,
    bodyUntouchedRatio: 0.85,
    cutawayOpen,
  };
}

export interface LockbitStep4State {
  phase: 0 | 1 | 2;
  pressArmSwing: number;
  placardBolted: number;
  wallpaperFlipped: boolean;
  wallpaperBlend: number;
  wipeStrikeProgress: number;
  auditVioletFlare: number;
  eid1102Active: boolean;
  cutawayOpen: number;
}

export function evaluateLockbitStep4State(
  timeSec: number,
  cutawayMode: LockbitCutawayMode = 'AUTO'
): LockbitStep4State {
  const t = clamp01((timeSec % 12) / 12);
  const phase: 0 | 1 | 2 = t < 1 / 3 ? 0 : t < 2 / 3 ? 1 : 2;
  const pressArmSwing = smoothstep(0.05, 0.28, t) * (1 - smoothstep(0.34, 0.44, t) * 0.4);
  const placardBolted = smoothstep(0.12, 0.34, t);
  const wallpaperBlend = smoothstep(0.36, 0.58, t);
  const wallpaperFlipped = wallpaperBlend >= 0.5;
  const wipeStrikeProgress =
    t >= 0.66 && t <= 0.84
      ? smoothstep(0.66, 0.74, t) * (1 - smoothstep(0.75, 0.84, t))
      : 0;
  const auditVioletFlare = smoothstep(0.72, 0.92, t);
  const eid1102Active = t >= 0.74;
  const autoCutaway = smoothstep(0.62, 0.76, t);
  const cutawayOpen =
    cutawayMode === 'OPEN' ? 1 : cutawayMode === 'SEALED' ? 0 : autoCutaway;
  return {
    phase,
    pressArmSwing,
    placardBolted,
    wallpaperFlipped,
    wallpaperBlend,
    wipeStrikeProgress,
    auditVioletFlare,
    eid1102Active,
    cutawayOpen,
  };
}

