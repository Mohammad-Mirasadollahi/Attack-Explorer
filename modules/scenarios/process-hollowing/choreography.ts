export type HollowingCameraPreset = 'DIRECTOR' | 'GARAGE' | 'INTERIOR' | 'GATE';
export type HollowingCutawayMode = 'AUTO' | 'OPEN' | 'SEALED';

export interface HollowingActDefinition {
  index: number;
  id: string;
  shortLabel: string;
  stageTag: string;
  title: string;
  storyExcerpt: string;
  technicalParallel: string;
  mitreCode: string;
  accentHex: string;
  particlePrimaryHex: string;
  particleSecondaryHex: string;
  startT: number;
  endT: number;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
}

export interface HollowingSceneState {
  normalizedTime: number;
  activeActIndex: number;
  actProgress: number;
  act: HollowingActDefinition;
  /** Truck world X along the garage -> boulevard -> bank gate axis */
  truckX: number;
  /** Truck subtle body suspension pitch/bounce */
  truckBounceY: number;
  /** Cumulative wheel rotation angle (radians) */
  wheelSpin: number;
  /** 0 = closed, 1 = rear blast doors swung fully open */
  rearDoorOpen: number;
  /** 0 = solid official bank armor, 1 = anime X-ray cutaway open */
  sideCutawayOpen: number;
  /** 0 = normal, 1 = cyan cryo time-freeze stasis active */
  stasisIntensity: number;
  /** 0 = intact, 0..1 = stasis shatter shockwave progress */
  stasisShatter: number;
  /** 0 = all legal bank gold crates inside truck, 1 = completely emptied out */
  legalCargoUnloaded: number;
  /** 0 = covert crew waiting in alley, 1 = fully boarded inside truck */
  covertCrewLoaded: number;
  /** 0 = covert interior glow off, 1 = crimson Beacon payload active inside */
  payloadGlow: number;
  /** 0 = gate boom horizontal closed, 1 = raised upright for trusted truck */
  gateBarrierLift: number;
  /** 0 = neutral stance, 1 = guard saluting trusted bank truck */
  guardSalute: number;
  /** 0 = idle sweep, 1 = locked green TRUSTED verification scan on license plate */
  cameraScanLock: number;
  /** 0..1 = front-door ski-mask intruder alarm deterrence pulse in Act 1 */
  frontDoorRejectPulse: number;
  /** 0..1 = anime speed-lines & tire brake release intensity in Act 5 */
  brakeReleaseBoost: number;
  /** 0..1 = anime magic dust sparkle density around the armored truck */
  magicDustIntensity: number;
  /** 0..1 = digital glitch distortion & voxel burst intensity (peaks during hollowing/injection) */
  glitchIntensity: number;
  /** Dynamic cel-shaded UnrealBloomPass strength multiplier */
  bloomStrength: number;
  /** Primary & secondary anime particle aura hex colors for current act */
  particlePrimaryHex: string;
  particleSecondaryHex: string;
  /** Smoothly interpolated director camera position & look target */
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
}

export const HOLLOWING_STORY_ACTS: readonly HollowingActDefinition[] = [
  {
    index: 0,
    id: 'hire-truck',
    shortLabel: '01 Hire',
    stageTag: 'STAGE 01 · DISGUISED ENTRY',
    title: 'Hire the Official Armored Bank Truck',
    storyExcerpt:
      'Instead of breaking down the front door in a ski mask, they hire an official armored bank truck...',
    technicalParallel:
      'CreateProcessW("svchost.exe") — Spawn a trusted, Microsoft-signed Windows container instead of an untrusted binary.',
    mitreCode: 'T1106',
    accentHex: '#38BDF8',
    particlePrimaryHex: '#38BDF8',
    particleSecondaryHex: '#FACC15',
    startT: 0.0,
    endT: 0.16,
    cameraPos: [-2.0, 9.6, 24.5],
    cameraTarget: [1.2, 3.0, -0.8],
  },
  {
    index: 1,
    id: 'freeze-garage',
    shortLabel: '02 Freeze',
    stageTag: 'STAGE 02 · TIME FREEZE',
    title: 'Freeze Inside the Garage',
    storyExcerpt:
      '...freeze it inside the garage before the driver even starts the route...',
    technicalParallel:
      'CREATE_SUSPENDED (0x00000004) — Park primary thread TID 4896 motionless before its first instruction executes.',
    mitreCode: 'T1055.012',
    accentHex: '#06B6D4',
    particlePrimaryHex: '#22D3EE',
    particleSecondaryHex: '#E0F2FE',
    startT: 0.16,
    endT: 0.32,
    cameraPos: [-10.8, 6.2, 14.4],
    cameraTarget: [-12.0, 2.7, 0.0],
  },
  {
    index: 2,
    id: 'empty-cargo',
    shortLabel: '03 Empty',
    stageTag: 'STAGE 03 · CARGO UNMAP',
    title: 'Empty Out All Legal Bank Cargo',
    storyExcerpt: '...empty out all the legal bank cargo inside...',
    technicalParallel:
      'NtUnmapViewOfSection(0x00400000) — Strip the legitimate svchost.exe PE image from RAM, leaving an empty trusted shell.',
    mitreCode: 'T1055.012',
    accentHex: '#F59E0B',
    particlePrimaryHex: '#FACC15',
    particleSecondaryHex: '#38BDF8',
    startT: 0.32,
    endT: 0.5,
    cameraPos: [-13.4, 5.4, 13.0],
    cameraTarget: [-13.8, 2.3, 0.0],
  },
  {
    index: 3,
    id: 'load-crew',
    shortLabel: '04 Load',
    stageTag: 'STAGE 04 · COVERT INJECTION',
    title: 'Load the Covert Intruder Crew',
    storyExcerpt:
      '...load their own covert crew into the back of that exact armored truck...',
    technicalParallel:
      'VirtualAllocEx + WriteProcessMemory — Inject the 264 KB Cobalt Strike Beacon PE image into the vacated 0x00400000 slot.',
    mitreCode: 'T1055.012',
    accentHex: '#E11D48',
    particlePrimaryHex: '#F43F5E',
    particleSecondaryHex: '#A855F7',
    startT: 0.5,
    endT: 0.68,
    cameraPos: [-12.4, 5.2, 12.2],
    cameraTarget: [-13.0, 2.3, 0.2],
  },
  {
    index: 4,
    id: 'release-brake',
    shortLabel: '05 Release',
    stageTag: 'STAGE 05 · BRAKE RELEASE',
    title: 'Release the Brake & Roll Out',
    storyExcerpt: '...and release the brake.',
    technicalParallel:
      'SetThreadContext (RCX → 0x004014A0) + ResumeThread — Redirect the entry point and wake the hollowed process.',
    mitreCode: 'T1055.012',
    accentHex: '#A78BFA',
    particlePrimaryHex: '#A78BFA',
    particleSecondaryHex: '#38BDF8',
    startT: 0.68,
    endT: 0.82,
    cameraPos: [-1.5, 6.4, 15.2],
    cameraTarget: [-3.2, 2.3, 0.0],
  },
  {
    index: 5,
    id: 'pass-gate',
    shortLabel: '06 Pass Gate',
    stageTag: 'STAGE 06 · TRUSTED PASSAGE',
    title: 'Cameras & Guard See Trusted Plate',
    storyExcerpt:
      'Every security camera and guard at the gate still sees the bank’s own trusted license plate and uniform.',
    technicalParallel:
      'Signed svchost.exe Identity — Host firewalls & perimeter guards trust the official exterior while Cobalt Strike rides inside.',
    mitreCode: 'T1071.001',
    accentHex: '#10B981',
    particlePrimaryHex: '#10B981',
    particleSecondaryHex: '#F43F5E',
    startT: 0.82,
    endT: 1.0,
    cameraPos: [14.6, 5.8, 14.2],
    cameraTarget: [8.8, 2.7, -0.4],
  },
] as const;

export const STATIC_CAMERA_PRESETS: Record<
  Exclude<HollowingCameraPreset, 'DIRECTOR'>,
  { pos: [number, number, number]; target: [number, number, number]; label: string }
> = {
  GARAGE: {
    pos: [-15.2, 6.4, 14.2],
    target: [-12.2, 2.6, 0.0],
    label: 'Garage',
  },
  INTERIOR: {
    pos: [-12.4, 4.4, 9.2],
    target: [-12.6, 2.2, 0.0],
    label: 'Cargo Bay',
  },
  GATE: {
    pos: [15.2, 5.8, 14.2],
    target: [8.8, 2.7, -0.4],
    label: 'Bank Gate',
  },
};

export const TRUCK_GARAGE_X = -12.0;
export const TRUCK_GATE_PASS_X = 10.6;

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpVec3(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function getActIndexForTime(normalizedTime: number): number {
  const t = clamp01(normalizedTime);
  for (let i = HOLLOWING_STORY_ACTS.length - 1; i >= 0; i -= 1) {
    if (t >= HOLLOWING_STORY_ACTS[i].startT) {
      return i;
    }
  }
  return 0;
}

export function getActMidpointTime(actIndex: number): number {
  const clamped = Math.max(
    0,
    Math.min(HOLLOWING_STORY_ACTS.length - 1, Math.floor(actIndex))
  );
  const act = HOLLOWING_STORY_ACTS[clamped];
  // Start slightly past the act entrance so the signature beat is immediately visible
  return act.startT + (act.endT - act.startT) * 0.46;
}

/**
 * Pure deterministic choreography evaluator for the Process Hollowing
 * Armored Bank Truck 3D Japanese Anime scene.
 */
export function evaluateHollowingSceneState(
  rawNormalizedTime: number,
  options?: {
    cutawayMode?: HollowingCutawayMode;
    cameraPreset?: HollowingCameraPreset;
  }
): HollowingSceneState {
  const t = clamp01(rawNormalizedTime);
  const cutawayMode = options?.cutawayMode ?? 'AUTO';
  const cameraPreset = options?.cameraPreset ?? 'DIRECTOR';

  const activeActIndex = getActIndexForTime(t);
  const act = HOLLOWING_STORY_ACTS[activeActIndex];
  const actSpan = Math.max(0.0001, act.endT - act.startT);
  const actProgress = clamp01((t - act.startT) / actSpan);

  // 1. Truck horizontal motion: stationary in garage through Acts 1-4, rolls out in Act 5, glides through gate in Act 6
  const driveProgress = smoothstep(0.71, 0.96, t);
  const truckX = lerp(TRUCK_GARAGE_X, TRUCK_GATE_PASS_X, driveProgress);
  const wheelSpin = driveProgress * Math.PI * 11.5;

  // Subtle engine bounce when moving (zero while frozen!)
  const isMoving = driveProgress > 0.005 && driveProgress < 0.995;
  const truckBounceY = isMoving ? Math.abs(Math.sin(driveProgress * Math.PI * 16)) * 0.045 : 0;

  // 2. Stasis field: ramps up in Act 2, holds during Acts 3 & 4, shatters at start of Act 5
  const stasisRise = smoothstep(0.165, 0.225, t);
  const stasisDrop = 1 - smoothstep(0.68, 0.725, t);
  const stasisIntensity = clamp01(stasisRise * stasisDrop);
  const stasisShatter =
    t >= 0.68 && t <= 0.78 ? smoothstep(0.68, 0.77, t) : 0;

  // 3. Rear blast doors: open during Acts 3 & 4, close firmly right before brake release
  const rearDoorOpen = clamp01(
    smoothstep(0.32, 0.365, t) * (1 - smoothstep(0.635, 0.68, t))
  );

  // 4. Side armor X-ray cutaway: auto-opens during Acts 3-4 (hollowing + loading) and offers a subtle peek at the end of Act 6
  let autoCutaway = clamp01(
    smoothstep(0.32, 0.365, t) * (1 - smoothstep(0.64, 0.685, t))
  );
  // Subtle dramatic X-ray reveal in the final half of Act 6 showing covert crew still hidden inside while passing guards
  const finalePeek = smoothstep(0.91, 0.96, t) * 0.62;
  autoCutaway = Math.max(autoCutaway, finalePeek);

  const sideCutawayOpen =
    cutawayMode === 'OPEN'
      ? 1
      : cutawayMode === 'SEALED'
      ? 0
      : autoCutaway;

  // 5. Legal bank cargo unloading (Act 3)
  const legalCargoUnloaded = smoothstep(0.33, 0.48, t);

  // 6. Covert intruder crew boarding (Act 4)
  const covertCrewLoaded = smoothstep(0.505, 0.645, t);

  // 7. Crimson payload interior aura once covert crew boards
  const payloadGlow = smoothstep(0.535, 0.655, t);

  // 8. Brake release boost & anime speed lines (Act 5)
  const brakeReleaseBoost = clamp01(
    smoothstep(0.69, 0.74, t) * (1 - smoothstep(0.79, 0.85, t))
  );

  // 9. Bank security checkpoint: boom gate lifts, guard salutes, green CCTV verifies trusted plate
  const gateBarrierLift = smoothstep(0.8, 0.88, t);
  const guardSalute = smoothstep(0.81, 0.89, t);
  const cameraScanLock = smoothstep(0.82, 0.91, t);

  // 10. Front-door ski-mask intruder rejection pulse (Act 1 contrast)
  const frontDoorRejectPulse =
    t < 0.18 ? 1 - smoothstep(0.12, 0.18, t) : 0;

  // 11. Anime Magic Dust & Digital Glitch Aura + Dynamic Bloom Modulation
  // Magic dust swirls continuously around the hero truck, surging during freeze, unmap, release & gate pass
  const magicDustIntensity = clamp01(
    0.58 +
      stasisIntensity * 0.28 +
      brakeReleaseBoost * 0.34 +
      cameraScanLock * 0.22
  );

  // Digital glitch bursts peak during memory hollowing (Act 3) & covert payload injection (Act 4)
  const hollowingGlitchWindow = clamp01(
    smoothstep(0.3, 0.38, t) * (1 - smoothstep(0.67, 0.76, t))
  );
  const covertPeak = smoothstep(0.49, 0.58, t) * (1 - smoothstep(0.67, 0.75, t));
  const glitchIntensity = clamp01(
    0.16 +
      hollowingGlitchWindow * 0.48 +
      covertPeak * 0.36 +
      stasisShatter * 0.4 * (1 - stasisShatter) +
      cameraScanLock * 0.14
  );

  // Dynamic cel-shaded bloom strength multiplier (keeps daylight crisp, pops during stasis/injection/gate)
  const bloomStrength =
    0.85 +
    stasisIntensity * 0.25 +
    payloadGlow * 0.22 +
    brakeReleaseBoost * 0.2 +
    cameraScanLock * 0.18;

  // 12. Smoothly interpolated director camera (or static user-selected camera preset)
  let cameraPos: [number, number, number];
  let cameraTarget: [number, number, number];

  if (cameraPreset !== 'DIRECTOR') {
    const preset = STATIC_CAMERA_PRESETS[cameraPreset];
    cameraPos = [...preset.pos];
    cameraTarget = [...preset.target];
  } else {
    // Smoothly blend toward the next act's camera during the final 28% of each act
    const nextAct =
      HOLLOWING_STORY_ACTS[
        Math.min(HOLLOWING_STORY_ACTS.length - 1, activeActIndex + 1)
      ];
    const blend = smoothstep(0.72, 1.0, actProgress);
    cameraPos = lerpVec3(act.cameraPos, nextAct.cameraPos, blend);
    cameraTarget = lerpVec3(act.cameraTarget, nextAct.cameraTarget, blend);

    // During Acts 5 & 6 track the moving truck horizontally for cinematic anime panning
    if (activeActIndex === 4) {
      cameraTarget = [
        lerp(cameraTarget[0], truckX + 1.2, 0.55),
        cameraTarget[1],
        cameraTarget[2],
      ];
      cameraPos = [
        lerp(cameraPos[0], truckX + 4.5, 0.45),
        cameraPos[1],
        cameraPos[2],
      ];
    }
  }

  return {
    normalizedTime: t,
    activeActIndex,
    actProgress,
    act,
    truckX,
    truckBounceY,
    wheelSpin,
    rearDoorOpen,
    sideCutawayOpen,
    stasisIntensity,
    stasisShatter,
    legalCargoUnloaded,
    covertCrewLoaded,
    payloadGlow,
    gateBarrierLift,
    guardSalute,
    cameraScanLock,
    frontDoorRejectPulse,
    brakeReleaseBoost,
    magicDustIntensity,
    glitchIntensity,
    bloomStrength,
    particlePrimaryHex: act.particlePrimaryHex,
    particleSecondaryHex: act.particleSecondaryHex,
    cameraPos,
    cameraTarget,
  };
}
