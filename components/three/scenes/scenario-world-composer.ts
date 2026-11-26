import * as THREE from 'three';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  createScanConeMaterial,
  createStasisDomeMaterial,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildAnimeCharacter,
  buildContactShadow,
  buildForensicScannerBeam,
  buildKeyToken,
  buildOverheadSignboard,
  buildPacketArcTrack,
  buildPadlockProp,
  clamp01,
  createSignboardTexture,
  easeInOutQuad,
  easeOutCubic,
  resolveCutawayFactor,
  type BespokeSection3DScene,
  type StageFloorArchetype,
} from './anime-world-primitives';
import { buildDomainProp, type DomainPropKind } from './domain-props-library';
import { getScenarioCinemaProfile } from '@/lib/scenario-cinema-profiles';
import {
  buildHeroKineticMechanism,
  buildSpatialSetArchitecture,
} from './cinema-stage-architectures';

export type SectionChoreographyMode =
  | 'overview-full'
  | 'left-breach-focus'
  | 'center-mechanism-focus'
  | 'right-impact-focus'
  | 'forensic-sweep'
  | 'memory-split-xray';

export type AnimeStoryPlotKind =
  | 'infiltration-approach'
  | 'vault-heist-cutaway'
  | 'dispatch-intercept'
  | 'checkpoint-impersonation'
  | 'freeze-and-swap'
  | 'chain-reaction-lock'
  | 'elevation-tower'
  | 'supply-conveyor-tamper'
  | 'twin-xray-forensics'
  | 'broadcast-beacon'
  | 'mirror-proxy-bounce'
  | 'swarm-containment';

export interface SectionVisualVariant {
  sceneKind: string;
  mode: SectionChoreographyMode;
  boardTitle: string;
  boardSubtitle: string;
  accentHex?: number;
  secondaryHex?: number;
  leftPropOverride?: DomainPropKind;
  rightPropOverride?: DomainPropKind;
  storyPlotOverride?: AnimeStoryPlotKind;
  leftPlaqueOverride?: string;
  rightPlaqueOverride?: string;
}

export interface ScenarioWorldBlueprint {
  scenarioId: string;
  floor: StageFloorArchetype;
  wallHex: number;
  accentHex: number;
  secondaryHex: number;
  leftProp: DomainPropKind;
  rightProp: DomainPropKind;
  centerMechanism: 'arc' | 'scanner' | 'key-handoff' | 'padlock-wave';
  storyPlot?: AnimeStoryPlotKind;
  leftPlaque?: string;
  rightPlaque?: string;
  leftActor: {
    coatHex: number;
    accentHex: number;
    hatType: 'cap' | 'visor' | 'hood' | 'none';
  };
  rightActor: {
    coatHex: number;
    accentHex: number;
    hatType: 'cap' | 'visor' | 'hood' | 'none';
  };
  sections: SectionVisualVariant[];
}

function hexToCss(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0').toUpperCase()}`;
}

function resolveStoryPlot(
  blueprint: ScenarioWorldBlueprint,
  variant: SectionVisualVariant
): AnimeStoryPlotKind {
  if (variant.mode === 'memory-split-xray') return 'twin-xray-forensics';
  if (variant.storyPlotOverride) return variant.storyPlotOverride;
  if (blueprint.storyPlot) return blueprint.storyPlot;
  if (variant.mode === 'forensic-sweep') return 'twin-xray-forensics';
  if (blueprint.centerMechanism === 'padlock-wave') return 'chain-reaction-lock';
  if (blueprint.centerMechanism === 'key-handoff') return 'vault-heist-cutaway';
  if (blueprint.centerMechanism === 'scanner') return 'checkpoint-impersonation';
  if (blueprint.floor === 'conveyor-deck') return 'supply-conveyor-tamper';
  if (blueprint.floor === 'two-level-cutaway') return 'elevation-tower';
  return 'infiltration-approach';
}

/**
 * Cleans ASCII signboard/plaque text, trims strictly on word boundaries, and strips
 * dangling trailing articles or arrows so 3D signs never look awkwardly cut off.
 */
function sanitizeBoardText(raw: string, maxChars: number): string {
  const clean = raw
    .replace(/→/g, '->')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  let trimmed = clean;
  if (clean.length > maxChars) {
    const sliced = clean.slice(0, maxChars);
    const lastSpace = sliced.lastIndexOf(' ');
    trimmed =
      lastSpace > Math.floor(maxChars * 0.5)
        ? sliced.slice(0, lastSpace).trim()
        : sliced.trim();
  }
  return trimmed
    .replace(/(?:\s+(?:A|AN|THE|OF|TO|IN|ON|FOR|WITH|BY|AND|OR|&|->|-|:))+$/i, '')
    .trim();
}

/**
 * Diegetic front console plaque placed beside a hero prop (English-only, high-contrast anime framing).
 */
function buildStationPlaque(
  materials: AnimeMaterialLibrary,
  extraTextures: THREE.Texture[],
  label: string,
  borderHex: string,
  subLabel: string
): THREE.Group {
  const g = new THREE.Group();
  const safeLabel = sanitizeBoardText(label, 24).toUpperCase();
  const safeSub = sanitizeBoardText(subLabel, 26).toUpperCase();
  const tex = createSignboardTexture(safeLabel || 'STORY STATION', safeSub, {
    bgHex: '#0F172A',
    borderHex,
    titleHex: '#F8FAFC',
    subHex: borderHex,
  });
  extraTextures.push(tex);

  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.65, 0.14),
    materials.createToonMaterial(0x334155)
  );
  stand.position.y = 0.32;
  addAnimeInkEdges(stand, materials.inkLineMaterial, 25);
  g.add(stand);

  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(2.35, 0.66, 0.12),
    materials.createToonMaterial(0x0f172a)
  );
  plate.position.set(0, 0.72, 0.04);
  plate.rotation.x = -0.26;
  addAnimeInkEdges(plate, materials.inkLineMaterial, 22);
  g.add(plate);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(2.22, 0.56),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  face.position.set(0, 0.73, 0.11);
  face.rotation.x = -0.26;
  g.add(face);
  return g;
}

/**
 * Crisp directional Japanese anime speed-lines (zero glitter/sparkles, bursts only on climax beats).
 */
function buildAnimeSpeedLines(accentHex: number): THREE.LineSegments {
  const positions: number[] = [];
  for (let i = 0; i < 18; i += 1) {
    const angle = (i / 18) * Math.PI * 2;
    const rInner = 2.6 + (i % 3) * 0.45;
    const rOuter = 5.4 + (i % 2) * 0.9;
    const y = 2.1 + Math.sin(angle) * 1.45;
    const x1 = Math.cos(angle) * rInner;
    const x2 = Math.cos(angle) * rOuter;
    positions.push(x1, y, -1.6, x2, y + Math.sin(angle) * 0.55, -2.2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.LineBasicMaterial({
    color: accentHex,
    transparent: true,
    opacity: 0,
    toneMapped: false,
  });
  return new THREE.LineSegments(geo, mat);
}

/**
 * Glowing anime payload briefcase / data crate held by operatives or transferred across the scene.
 */
function buildStoryPayloadCrate(
  materials: AnimeMaterialLibrary,
  coreHex: number
): THREE.Group {
  const g = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.46, 0.44),
    materials.createToonMaterial(0x1e293b)
  );
  addAnimeInkEdges(shell, materials.inkLineMaterial, 22);
  g.add(shell);

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.22, 0.48),
    materials.createToonMaterial(coreHex, {
      emissive: coreHex,
      emissiveIntensity: 1.2,
    })
  );
  g.add(core);

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.035, 6, 12, Math.PI),
    materials.createToonMaterial(0xe2e8f0)
  );
  handle.position.y = 0.23;
  g.add(handle);
  return g;
}

/**
 * Composes a bespoke, Japanese-anime story-driven 3D diorama for any scenario & section,
 * with multi-act character movement, distinct spatial choreography plots, diegetic plaques,
 * cel-shaded props, horizon skyline, cutaway responsiveness, and deterministic cleanup.
 */
export function buildScenarioWorldFromBlueprint(
  blueprint: ScenarioWorldBlueprint,
  variant: SectionVisualVariant,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  root.userData.hasRealWorldSet = true;
  const extraTextures: THREE.Texture[] = [];

  const cinema = getScenarioCinemaProfile(blueprint.scenarioId);
  const accentHex = variant.accentHex ?? cinema.primaryHex ?? blueprint.accentHex;
  const secondaryHex =
    variant.secondaryHex ?? cinema.secondaryHex ?? blueprint.secondaryHex;
  const isMemory = variant.mode === 'memory-split-xray';
  const storyPlot = resolveStoryPlot(blueprint, variant);
  const durationSec = variant.mode === 'overview-full' ? 18 : 15;

  // 1. Bespoke per-scenario 3D real-world architectural set (28 distinct everyday environments!)
  const arch = buildSpatialSetArchitecture(
    cinema.spatialSet,
    materials,
    accentHex,
    secondaryHex,
    blueprint.wallHex,
    isMemory
  );
  root.add(arch.group);

  // Bespoke per-scenario animated 3D real-world hero vehicle/prop (28 matched centerpieces!)
  const heroKinetic = buildHeroKineticMechanism(
    cinema.heroKinetic,
    materials,
    accentHex,
    secondaryHex
  );
  heroKinetic.group.position.set(
    arch.heroCenterPos[0],
    arch.heroCenterPos[1],
    arch.heroCenterPos[2]
  );
  heroKinetic.group.scale.setScalar(0.94);
  root.add(heroKinetic.group);

  // 2. Scenario + Section specific overhead English signboard (real-world place + MITRE/stage line, clear of top-left HUD!)
  const overheadTitle = isMemory
    ? `${cinema.realWorldPlace} · MEMORY X-RAY`
    : cinema.settingLabel;
  root.add(
    buildOverheadSignboard(
      materials,
      extraTextures,
      sanitizeBoardText(overheadTitle, 38).toUpperCase(),
      sanitizeBoardText(variant.boardSubtitle, 48).toUpperCase(),
      {
        width: 6.0,
        height: 1.32,
        position: arch.boardPos,
        borderHex: hexToCss(accentHex),
        subHex: hexToCss(secondaryHex),
        withRearStruts: true,
      }
    )
  );

  // 3. Left & Right bespoke composite hero props framed cleanly by the active spatial set
  const leftKind: DomainPropKind = isMemory
    ? 'memory-xray-chamber'
    : variant.leftPropOverride ?? blueprint.leftProp;
  const rightKind: DomainPropKind = isMemory
    ? 'memory-xray-chamber'
    : variant.rightPropOverride ?? blueprint.rightProp;

  const leftBuilt = buildDomainProp(
    leftKind,
    materials,
    isMemory ? 0x38bdf8 : accentHex,
    isMemory ? 0x38bdf8 : secondaryHex
  );
  const rightBuilt = buildDomainProp(
    rightKind,
    materials,
    isMemory ? 0xf43f5e : secondaryHex,
    isMemory ? 0xf43f5e : accentHex
  );

  const leftX = isMemory
    ? -4.1
    : variant.mode === 'left-breach-focus'
      ? Math.max(arch.leftPropPos[0] + 0.55, -3.5)
      : arch.leftPropPos[0];
  const rightX = isMemory
    ? 4.1
    : variant.mode === 'right-impact-focus'
      ? Math.min(arch.rightPropPos[0] - 0.55, 3.5)
      : arch.rightPropPos[0];

  leftBuilt.group.position.set(leftX, arch.leftPropPos[1], arch.leftPropPos[2]);
  rightBuilt.group.position.set(
    rightX,
    arch.rightPropPos[1],
    arch.rightPropPos[2]
  );
  if (variant.mode === 'left-breach-focus') {
    leftBuilt.group.scale.setScalar(1.04);
  } else if (variant.mode === 'right-impact-focus') {
    rightBuilt.group.scale.setScalar(1.04);
  }
  root.add(leftBuilt.group);
  root.add(rightBuilt.group);

  // Grounded diegetic English plaques aligned to the real-world place & framed inside 16:9 viewport bounds
  const leftPlaqueLabel = isMemory
    ? 'CLEAN BASELINE'
    : cinema.castSummary.protagonist;
  const rightPlaqueLabel = isMemory
    ? 'TAMPERED MEMORY'
    : cinema.castSummary.targetAsset;

  const leftPlaque = buildStationPlaque(
    materials,
    extraTextures,
    leftPlaqueLabel,
    hexToCss(isMemory ? 0x38bdf8 : accentHex),
    isMemory ? 'TRUSTED IMAGE ON DISK' : 'ACT 01 · STORY ENTRY'
  );
  leftPlaque.position.set(
    Math.max(arch.leftPlaquePos[0], -3.65),
    arch.leftPlaquePos[1],
    arch.leftPlaquePos[2]
  );
  leftPlaque.rotation.y = 0.24;
  root.add(leftPlaque);

  const rightPlaque = buildStationPlaque(
    materials,
    extraTextures,
    rightPlaqueLabel,
    hexToCss(isMemory ? 0xf43f5e : secondaryHex),
    isMemory ? 'MODIFIED LIVE PAGES' : 'ACT 03 · TARGET EFFECT'
  );
  rightPlaque.position.set(
    Math.min(arch.rightPlaquePos[0], 3.65),
    arch.rightPlaquePos[1],
    arch.rightPlaquePos[2]
  );
  rightPlaque.rotation.y = -0.24;
  root.add(rightPlaque);

  // 4. Expressive Japanese Anime Story Characters (with tactical backpack & held story props!)
  const leftChar = buildAnimeCharacter(materials, {
    coatHex: blueprint.leftActor.coatHex,
    accentHex: blueprint.leftActor.accentHex,
    hatType: blueprint.leftActor.hatType,
    scale: 0.98,
  });
  const leftShadow = buildContactShadow(materials, 0.65, 0.65);
  leftChar.group.add(leftShadow);

  // Add sleek anime tactical backpack for covert actors (hood/visor)
  if (
    blueprint.leftActor.hatType === 'hood' ||
    blueprint.leftActor.hatType === 'visor'
  ) {
    const pack = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.48, 0.22),
      materials.createToonMaterial(0x7c3aed, {
        emissive: 0x7c3aed,
        emissiveIntensity: 0.35,
      })
    );
    pack.position.set(0, 1.08, -0.28);
    addAnimeInkEdges(pack, materials.inkLineMaterial, 24);
    leftChar.group.add(pack);
  }
  const leftCharBaseX = leftX + 1.65;
  leftChar.group.position.set(leftCharBaseX, 0, 1.15);
  leftChar.group.rotation.y = 0.65;
  root.add(leftChar.group);

  // Carried glowing payload crate attached to left actor's right hand for infiltration/delivery plots
  const carriedCrate = buildStoryPayloadCrate(materials, secondaryHex);
  carriedCrate.scale.setScalar(0.68);
  carriedCrate.position.set(0.05, -0.52, 0.26);
  carriedCrate.visible =
    storyPlot === 'infiltration-approach' ||
    storyPlot === 'checkpoint-impersonation' ||
    storyPlot === 'supply-conveyor-tamper' ||
    storyPlot === 'freeze-and-swap';
  leftChar.rightArmPivot.add(carriedCrate);

  const rightChar = buildAnimeCharacter(materials, {
    coatHex: blueprint.rightActor.coatHex,
    accentHex: blueprint.rightActor.accentHex,
    hatType: blueprint.rightActor.hatType,
    scale: 0.98,
  });
  rightChar.group.add(buildContactShadow(materials, 0.65, 0.65));
  const rightCharBaseX = rightX - 1.65;
  rightChar.group.position.set(rightCharBaseX, 0, 1.15);
  rightChar.group.rotation.y = -0.65;
  root.add(rightChar.group);

  // 5. Plot-Specific Dramatic Japanese Anime Props & Mechanisms!
  const packetArc = buildPacketArcTrack(
    new THREE.Vector3(leftX + 0.55, 2.35, -0.1),
    new THREE.Vector3(0, 4.15, 0.15),
    new THREE.Vector3(rightX - 0.55, 2.35, -0.1),
    secondaryHex,
    4
  );
  root.add(packetArc.group);

  // Luminous golden tether curve for vault-heist / key-handoff / mirror-proxy plots
  const tetherCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(leftX + 0.7, 2.0, 0.25),
    new THREE.Vector3(0, 3.55, 0.8),
    new THREE.Vector3(rightX - 0.7, 2.0, 0.25)
  );
  const tetherMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    transparent: true,
    opacity: 0,
    toneMapped: false,
  });
  const tetherTube = new THREE.Mesh(
    new THREE.TubeGeometry(tetherCurve, 28, 0.055, 8, false),
    tetherMat
  );
  root.add(tetherTube);

  // Sweeping Forensic / Checkpoint Scan Cone (identical shader style to Process Hollowing)
  const needsScanner =
    isMemory ||
    storyPlot === 'twin-xray-forensics' ||
    storyPlot === 'checkpoint-impersonation' ||
    variant.mode === 'forensic-sweep' ||
    blueprint.centerMechanism === 'scanner';
  const scanner = needsScanner
    ? buildForensicScannerBeam(materials, 9.6, isMemory ? 0xfacc15 : accentHex)
    : null;
  if (scanner) {
    // Keep gantry beam cleanly below overhead signboard & above hero props
    scanner.group.scale.set(0.96, 0.84, 1);
    root.add(scanner.group);
  }

  let checkpointConeUniforms: {
    uTime: { value: number };
    uTrustedLock: { value: number };
  } | null = null;
  let checkpointConeMesh: THREE.Mesh | null = null;
  if (
    storyPlot === 'checkpoint-impersonation' ||
    storyPlot === 'infiltration-approach'
  ) {
    const scanBuilt = createScanConeMaterial();
    checkpointConeUniforms = scanBuilt.uniforms;
    checkpointConeMesh = new THREE.Mesh(
      new THREE.ConeGeometry(1.75, 3.8, 24, 1, true),
      scanBuilt.material
    );
    checkpointConeMesh.position.set(0, 2.0, 0.95);
    root.add(checkpointConeMesh);
  }

  // Cryo/Stasis Holographic Freeze Dome for freeze-and-swap plots
  let stasisUniforms: {
    uTime: { value: number };
    uOpacity: { value: number };
  } | null = null;
  let stasisGroup: THREE.Group | null = null;
  let stasisOuterRing: THREE.Mesh | null = null;
  if (storyPlot === 'freeze-and-swap') {
    stasisGroup = new THREE.Group();
    stasisGroup.position.set(rightX, 0.05, -0.45);
    const domeBuilt = createStasisDomeMaterial();
    stasisUniforms = domeBuilt.uniforms;
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(2.45, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52),
      domeBuilt.material
    );
    stasisGroup.add(dome);
    stasisOuterRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.38, 0.06, 8, 36),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false })
    );
    stasisOuterRing.rotation.x = Math.PI / 2;
    stasisOuterRing.position.y = 0.14;
    stasisGroup.add(stasisOuterRing);
    root.add(stasisGroup);
  }

  // Glowing Golden Master Key for vault-heist / elevation / key-handoff
  const handoffKey =
    !isMemory &&
    (storyPlot === 'vault-heist-cutaway' ||
      storyPlot === 'elevation-tower' ||
      blueprint.centerMechanism === 'key-handoff' ||
      variant.mode === 'center-mechanism-focus')
      ? buildKeyToken(materials, 0xfacc15)
      : null;
  if (handoffKey) {
    handoffKey.position.set(0, 2.25, 0.85);
    handoffKey.scale.setScalar(0.95);
    root.add(handoffKey);
  }

  // Central Mirror / Prism Redirector for mirror-proxy-bounce & dispatch-intercept
  let centralPrismGroup: THREE.Group | null = null;
  let prismGlassMat: THREE.MeshToonMaterial | null = null;
  if (
    storyPlot === 'mirror-proxy-bounce' ||
    storyPlot === 'dispatch-intercept' ||
    storyPlot === 'swarm-containment'
  ) {
    centralPrismGroup = new THREE.Group();
    centralPrismGroup.position.set(0, 0.05, 0.35);
    const basePed = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.92, 0.42, 8),
      materials.createToonMaterial(0x1e293b)
    );
    basePed.position.y = 0.21;
    addAnimeInkEdges(basePed, materials.inkLineMaterial, 22);
    centralPrismGroup.add(basePed);

    prismGlassMat = materials.createToonMaterial(accentHex, {
      emissive: accentHex,
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.76,
    });
    const prism = new THREE.Mesh(
      storyPlot === 'mirror-proxy-bounce'
        ? new THREE.OctahedronGeometry(0.95, 0)
        : new THREE.BoxGeometry(0.95, 1.55, 0.22),
      prismGlassMat
    );
    prism.position.y = 1.65;
    addAnimeInkEdges(prism, materials.inkLineMaterial, 22);
    centralPrismGroup.add(prism);
    root.add(centralPrismGroup);
  }

  // Expanding Anime Shockwave / Broadcast Beacon Rings
  const pulseRings: THREE.Mesh[] = [];
  if (
    storyPlot === 'chain-reaction-lock' ||
    storyPlot === 'broadcast-beacon' ||
    storyPlot === 'elevation-tower' ||
    storyPlot === 'swarm-containment'
  ) {
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.95, 0.06, 8, 36),
        new THREE.MeshBasicMaterial({
          color: storyPlot === 'elevation-tower' ? 0xfacc15 : secondaryHex,
          transparent: true,
          opacity: 0.0,
          toneMapped: false,
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(
        storyPlot === 'broadcast-beacon' ? rightX : 0,
        storyPlot === 'broadcast-beacon' ? 2.8 : 0.14,
        storyPlot === 'broadcast-beacon' ? -0.45 : 0.85
      );
      root.add(ring);
      pulseRings.push(ring);
    }
  }

  // Slamming Padlocks for chain-reaction-lock & ransomware plots
  const slamPadlocks: THREE.Group[] = [];
  if (
    !isMemory &&
    (storyPlot === 'chain-reaction-lock' ||
      blueprint.centerMechanism === 'padlock-wave')
  ) {
    const offsets: Array<[number, number]> = [
      [-1.05, 0.9],
      [0, 1.1],
      [1.05, 0.9],
    ];
    for (const [ox, oz] of offsets) {
      const lock = buildPadlockProp(materials, secondaryHex);
      lock.position.set(rightX + ox * 0.85, 3.8, oz);
      lock.scale.setScalar(0.86);
      lock.visible = false;
      root.add(lock);
      slamPadlocks.push(lock);
    }
  }

  // Conveyor Belt Moving Packages for supply-conveyor-tamper
  const conveyorCrates: Array<{
    group: THREE.Group;
    offset: number;
    isTrojan: boolean;
  }> = [];
  if (storyPlot === 'supply-conveyor-tamper') {
    for (let i = 0; i < 4; i += 1) {
      const isTrojan = i === 2;
      const crate = buildStoryPayloadCrate(
        materials,
        isTrojan ? 0xf43f5e : 0x38bdf8
      );
      crate.scale.setScalar(0.88);
      crate.position.set(leftX + i * 2.2, 0.42, 0.95);
      root.add(crate);
      conveyorCrates.push({ group: crate, offset: i / 4, isTrojan });
    }
  }

  // Anime Speed Lines bursting during climax Act 3
  const speedLines = buildAnimeSpeedLines(secondaryHex);
  root.add(speedLines);

  // 6. Floating callout anchors positioned cleanly inward & below top-left HUD card / signboard
  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(leftX + 1.05, Math.min(3.05, leftBuilt.anchorHeight - 0.15), 0.35);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(
    rightX - 0.75,
    Math.min(3.15, rightBuilt.anchorHeight - 0.1),
    0.35
  );
  root.add(secondaryAnchor);

  // 7. Mode-tuned default Director camera framing (generous margin so full anime stage & plaques never clip)
  const camPos: [number, number, number] =
    variant.mode === 'left-breach-focus'
      ? [-1.2, 5.4, 14.8]
      : variant.mode === 'right-impact-focus'
        ? [1.4, 5.4, 14.8]
        : isMemory
          ? [0.1, 5.9, 16.0]
          : [0.2, 5.6, 15.8];
  const camTarget: [number, number, number] =
    variant.mode === 'left-breach-focus'
      ? [-0.9, 1.9, 0]
      : variant.mode === 'right-impact-focus'
        ? [0.9, 1.9, 0]
        : [0, 1.9, 0];

  return {
    root,
    defaultCameraPos: new THREE.Vector3(...camPos),
    defaultCameraTarget: new THREE.Vector3(...camTarget),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 1.8, 0),
    update: (
      timeSec: number,
      phaseIndex: number,
      _isDark: boolean,
      cutawayMode: StandardCutawayMode
    ) => {
      const progress = clamp01(timeSec / Math.max(1, durationSec));
      const act1 = clamp01(progress / 0.34);
      const act2 = clamp01((progress - 0.33) / 0.34);
      const act3 = clamp01((progress - 0.66) / 0.34);

      const autoCutaway =
        isMemory || storyPlot === 'twin-xray-forensics'
          ? 0.85 + Math.sin(timeSec * 1.4) * 0.12
          : storyPlot === 'vault-heist-cutaway' ||
              storyPlot === 'freeze-and-swap' ||
              variant.mode === 'center-mechanism-focus'
            ? easeInOutQuad(clamp01((progress - 0.22) * 2.1))
            : easeOutCubic(clamp01((progress - 0.38) * 1.9));
      const cut = resolveCutawayFactor(cutawayMode, autoCutaway);

      const leftAlert =
        !isMemory &&
        (variant.mode === 'left-breach-focus'
          ? progress > 0.14
          : phaseIndex >= 0 && progress > 0.18 && progress < 0.78);
      const rightAlert =
        isMemory ||
        phaseIndex >= 2 ||
        (variant.mode === 'right-impact-focus'
          ? progress > 0.24
          : progress > 0.52);

      leftBuilt.animate(timeSec, progress, cut, leftAlert);
      rightBuilt.animate(timeSec, progress, cut, rightAlert);
      arch.animate(timeSec, progress, rightAlert);
      heroKinetic.animate(timeSec, progress, cut, rightAlert);

      // Multi-Act Japanese Anime Character Movement & Expressive Storytelling!
      let leftMoveT = 0;
      if (
        storyPlot === 'infiltration-approach' ||
        storyPlot === 'checkpoint-impersonation' ||
        storyPlot === 'freeze-and-swap'
      ) {
        // Operative walks smoothly across the anime stage deck toward the target
        leftMoveT = easeInOutQuad(clamp01((progress - 0.12) / 0.52));
      } else if (
        storyPlot === 'dispatch-intercept' ||
        storyPlot === 'supply-conveyor-tamper' ||
        storyPlot === 'mirror-proxy-bounce'
      ) {
        // Operative steps out to center station in Act 2 then steps back slightly
        leftMoveT =
          easeInOutQuad(clamp01((progress - 0.16) / 0.32)) * 0.52;
      } else if (storyPlot === 'elevation-tower') {
        leftMoveT = easeInOutQuad(clamp01((progress - 0.1) / 0.36)) * 0.55;
      }

      const stridePhase = timeSec * 7.2;
      const isWalking = leftMoveT > 0.02 && leftMoveT < 0.98 && progress > 0.12 && progress < 0.68;
      const walkBob = isWalking ? Math.abs(Math.sin(stridePhase)) * 0.1 : 0;
      const elevationY =
        storyPlot === 'elevation-tower'
          ? easeOutCubic(act2) * 1.65
          : 0;

      leftChar.group.position.x = THREE.MathUtils.lerp(
        leftCharBaseX,
        rightCharBaseX - 1.05,
        leftMoveT
      );
      leftChar.group.position.y = walkBob + elevationY;
      leftChar.group.rotation.y = THREE.MathUtils.lerp(0.65, 1.15, leftMoveT);

      leftChar.rightArmPivot.rotation.x = isWalking
        ? -0.75 + Math.sin(stridePhase) * 0.42
        : -0.45 - Math.sin(timeSec * 3.0) * 0.35;
      leftChar.leftArmPivot.rotation.x = isWalking
        ? -Math.sin(stridePhase) * 0.45
        : Math.sin(timeSec * 2.1) * 0.22;
      leftChar.head.rotation.y = Math.sin(timeSec * 1.6) * 0.22;

      // Right actor reacts dynamically in Act 2/3 (alarm raise or inspection stance)
      rightChar.group.position.y = rightAlert
        ? Math.abs(Math.sin(timeSec * 5.2)) * 0.06
        : 0;
      rightChar.rightArmPivot.rotation.x = rightAlert
        ? -1.45 + Math.sin(timeSec * 5.5) * 0.32
        : -0.28 + Math.sin(timeSec * 2.0) * 0.18;
      rightChar.leftArmPivot.rotation.x = rightAlert
        ? -0.7 + Math.cos(timeSec * 4.8) * 0.25
        : Math.sin(timeSec * 1.8) * 0.15;
      rightChar.head.rotation.y = -0.2 - Math.sin(timeSec * 1.8) * 0.24;

      // Packet Arc & Luminous Tether Tube choreography
      const arcActive =
        !isMemory &&
        (progress > 0.18 || variant.mode === 'overview-full' || storyPlot === 'broadcast-beacon');
      packetArc.updatePackets(timeSec * (storyPlot === 'swarm-containment' ? 0.78 : 0.48), arcActive);

      tetherMat.opacity =
        storyPlot === 'vault-heist-cutaway' ||
        storyPlot === 'mirror-proxy-bounce' ||
        storyPlot === 'elevation-tower'
          ? 0.22 + easeOutCubic(act2) * 0.65
          : 0;

      // Checkpoint / Forensic Scan Cones
      if (scanner) {
        const sweepSpan = isMemory ? 4.4 : 4.2;
        scanner.carriage.position.x = Math.sin(timeSec * 1.25) * sweepSpan;
        scanner.beamMat.opacity = isMemory
          ? 0.28 + Math.sin(timeSec * 4) * 0.06
          : progress > 0.45
            ? 0.26
            : 0.1;
      }
      if (checkpointConeUniforms && checkpointConeMesh) {
        checkpointConeUniforms.uTime.value = timeSec;
        checkpointConeUniforms.uTrustedLock.value = easeInOutQuad(act2);
        checkpointConeMesh.position.x = leftChar.group.position.x;
        checkpointConeMesh.visible = progress > 0.18 && progress < 0.88;
      }

      // Cryo/Stasis Freeze Dome for freeze-and-swap plots
      let stasisIntensity = 0;
      let brakeReleaseBoost = 0;
      if (stasisUniforms && stasisGroup && stasisOuterRing) {
        const freezeIn = easeOutCubic(act1);
        const releaseOut = easeInOutQuad(act3);
        const active = clamp01(freezeIn * (1 - releaseOut));
        stasisUniforms.uTime.value = timeSec;
        stasisUniforms.uOpacity.value = active * 0.78;
        stasisGroup.visible = active > 0.02;
        stasisOuterRing.rotation.z = timeSec * 1.4;
        stasisIntensity = active;
        brakeReleaseBoost = releaseOut > 0.1 && releaseOut < 0.8 ? 0.85 : 0;
      }

      // Floating Golden Master Key / Privilege Token Handoff
      if (handoffKey) {
        const glide = easeInOutQuad(clamp01((progress - 0.16) / 0.56));
        handoffKey.position.x =
          leftX + 1.4 + glide * (rightX - leftX - 2.8);
        handoffKey.position.y =
          storyPlot === 'elevation-tower'
            ? 1.9 + easeOutCubic(act2) * 1.85
            : 2.15 + Math.sin(glide * Math.PI) * 0.95;
        handoffKey.rotation.y = timeSec * 2.6;
        handoffKey.rotation.z = Math.sin(timeSec * 2.2) * 0.18;
      }

      // Central Mirror / Switch Prism rotation & crimson flip in Act 2
      if (centralPrismGroup && prismGlassMat) {
        centralPrismGroup.rotation.y =
          storyPlot === 'mirror-proxy-bounce'
            ? Math.PI * 0.25 + Math.sin(timeSec * 1.3) * 0.28
            : timeSec * 0.85;
        const flipped = progress > 0.42;
        prismGlassMat.color.setHex(flipped ? secondaryHex : accentHex);
        prismGlassMat.emissive.setHex(flipped ? secondaryHex : accentHex);
      }

      // Expanding Shockwave / Broadcast / Elevation Rings
      for (let i = 0; i < pulseRings.length; i += 1) {
        const ring = pulseRings[i];
        const mat = ring.material as THREE.MeshBasicMaterial;
        const wavePhase = ((timeSec * 0.65 + i * 0.33) % 1);
        const active = progress > 0.34;
        if (storyPlot === 'elevation-tower') {
          ring.position.set(
            leftChar.group.position.x,
            0.25 + wavePhase * 2.8,
            leftChar.group.position.z
          );
          ring.scale.setScalar(0.8 + Math.sin(wavePhase * Math.PI) * 0.35);
          mat.opacity = active ? (1 - wavePhase) * 0.82 : 0;
        } else {
          ring.scale.setScalar(0.65 + wavePhase * 3.8);
          mat.opacity = active ? (1 - wavePhase) * 0.72 : 0;
        }
      }

      // Slamming Crimson Padlocks for chain-reaction-lock
      for (let i = 0; i < slamPadlocks.length; i += 1) {
        const lock = slamPadlocks[i];
        const trigger = 0.42 + i * 0.13;
        const dropT = easeOutCubic(clamp01((progress - trigger) / 0.18));
        lock.visible = progress >= trigger;
        lock.position.y = THREE.MathUtils.lerp(4.0, 1.35 + (i === 1 ? 0.35 : 0), dropT);
        lock.rotation.y = Math.sin(timeSec * 2.4 + i) * 0.22;
      }

      // Conveyor Belt Crates for supply-conveyor-tamper
      for (const item of conveyorCrates) {
        const u = (item.offset + timeSec * 0.11) % 1;
        item.group.position.x = THREE.MathUtils.lerp(leftX + 0.5, rightX - 0.5, u);
        item.group.position.y =
          item.isTrojan && progress < 0.38 ? 0.42 + (1 - clamp01(progress / 0.38)) * 1.6 : 0.42;
        item.group.visible = !item.isTrojan || progress > 0.26;
      }

      // Dramatic Anime Speed Lines burst cleanly during climax Act 3
      const speedMat = speedLines.material as THREE.LineBasicMaterial;
      speedMat.opacity =
        !isMemory && progress > 0.68 && progress < 0.95
          ? Math.sin(((progress - 0.68) / 0.27) * Math.PI) * 0.55
          : 0;

      return {
        glitchIntensity: rightAlert && act3 > 0.15 && act3 < 0.65 ? 0.35 : 0,
        magicDustIntensity: 0,
        stasisIntensity,
        brakeReleaseBoost,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
    },
  };
}

/**
 * Helper to look up and build any sceneKind from an array of ScenarioWorldBlueprints.
 */
export function buildSceneFromBlueprintCatalog(
  catalog: readonly ScenarioWorldBlueprint[],
  sceneKind: string,
  materials: AnimeMaterialLibrary
): BespokeSection3DScene | null {
  for (const bp of catalog) {
    for (const sec of bp.sections) {
      if (sec.sceneKind === sceneKind) {
        return buildScenarioWorldFromBlueprint(bp, sec, materials);
      }
    }
  }
  return null;
}
