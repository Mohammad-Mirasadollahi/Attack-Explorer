import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  createScanConeMaterial,
  createStasisDomeMaterial,
  type AnimeMaterialLibrary,
} from './anime-toon-materials';
import { buildArmoredBankTruck } from './hollowing-scene-builders';

export interface BespokeSection3DScene {
  root: THREE.Group;
  defaultCameraPos: THREE.Vector3;
  defaultCameraTarget: THREE.Vector3;
  primaryAnchor: THREE.Object3D;
  secondaryAnchor: THREE.Object3D;
  particleCenter: THREE.Vector3;
  update: (
    timeSec: number,
    phaseIndex: number,
    isDark: boolean,
    cutawayMode: StandardCutawayMode
  ) => {
    glitchIntensity: number;
    magicDustIntensity: number;
    stasisIntensity: number;
    brakeReleaseBoost: number;
  };
  dispose: () => void;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutQuad(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function createLabelBoardTexture(
  title: string,
  subtitle: string,
  bgHex: string,
  borderHex: string,
  titleHex: string,
  subHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 768, 192);

  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 748, 172);

  ctx.fillStyle = titleHex;
  ctx.font = '900 40px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 384, 74, 708);

  ctx.fillStyle = subHex;
  ctx.font = '700 24px "JetBrains Mono", monospace';
  ctx.fillText(subtitle, 384, 138, 708);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createAnimeFloorGrid(
  materials: AnimeMaterialLibrary,
  accentHex: number,
  radius = 16
): THREE.Group {
  const group = new THREE.Group();

  const floorGeo = new THREE.CylinderGeometry(radius, radius + 0.5, 0.35, 36);
  const floorMat = materials.createToonMaterial(0x1e293b);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.175;
  floor.receiveShadow = true;
  addAnimeInkEdges(floor, materials.inkLineMaterial, 28);
  group.add(floor);

  const rimGeo = new THREE.TorusGeometry(radius - 0.15, 0.08, 8, 48);
  const rimMat = new THREE.MeshBasicMaterial({
    color: accentHex,
    toneMapped: false,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.03;
  group.add(rim);

  const grid = new THREE.GridHelper(radius * 1.5, 16, accentHex, 0x334155);
  grid.position.y = 0.02;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.32;
  group.add(grid);

  return group;
}

function buildStylizedHuman(
  materials: AnimeMaterialLibrary,
  uniformHex: number,
  accentHex: number,
  hasBadge: boolean
): THREE.Group {
  const g = new THREE.Group();
  const coatMat = materials.createToonMaterial(uniformHex);
  const darkMat = materials.createToonMaterial(0x0f172a);
  const skinMat = materials.createToonMaterial(0xfde68a);
  const accentMat = materials.createToonMaterial(accentHex, {
    emissive: accentHex,
    emissiveIntensity: 0.75,
  });

  const legGeo = new THREE.CapsuleGeometry(0.16, 0.72, 6, 10);
  const leftLeg = new THREE.Mesh(legGeo, darkMat);
  leftLeg.position.set(-0.22, 0.52, 0.14);
  leftLeg.rotation.x = -0.25;
  addInvertedHullOutline(leftLeg, materials.inkOutlineMaterial, 1.07);
  g.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, darkMat);
  rightLeg.position.set(0.22, 0.52, -0.14);
  rightLeg.rotation.x = 0.25;
  addInvertedHullOutline(rightLeg, materials.inkOutlineMaterial, 1.07);
  g.add(rightLeg);

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 1.15, 0.48),
    coatMat
  );
  torso.position.set(0, 1.52, 0);
  torso.castShadow = true;
  addAnimeInkEdges(torso, materials.inkLineMaterial, 22);
  g.add(torso);

  if (hasBadge) {
    const badge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.08, 6),
      accentMat
    );
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0.22, 1.66, 0.26);
    g.add(badge);
  }

  const armGeo = new THREE.CapsuleGeometry(0.13, 0.68, 6, 10);
  const leftArm = new THREE.Mesh(armGeo, coatMat);
  leftArm.position.set(-0.62, 1.5, -0.08);
  leftArm.rotation.z = 0.18;
  leftArm.rotation.x = 0.3;
  addInvertedHullOutline(leftArm, materials.inkOutlineMaterial, 1.08);
  g.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, coatMat);
  rightArm.position.set(0.62, 1.5, 0.12);
  rightArm.rotation.z = -0.18;
  rightArm.rotation.x = -0.3;
  addInvertedHullOutline(rightArm, materials.inkOutlineMaterial, 1.08);
  g.add(rightArm);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 14), skinMat);
  head.position.set(0, 2.48, 0);
  addInvertedHullOutline(head, materials.inkOutlineMaterial, 1.07);
  g.add(head);

  const capCrown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.39, 0.36, 0.22, 16),
    coatMat
  );
  capCrown.position.set(0, 2.78, 0);
  addAnimeInkEdges(capCrown, materials.inkLineMaterial, 25);
  g.add(capCrown);

  const capBrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.06, 0.36),
    darkMat
  );
  capBrim.position.set(0, 2.68, 0.24);
  g.add(capBrim);

  const capEmblem = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.1, 0.06),
    accentMat
  );
  capEmblem.position.set(0, 2.79, 0.37);
  g.add(capEmblem);

  return g;
}

function buildMasterKeyToken(
  materials: AnimeMaterialLibrary,
  glowHex: number
): THREE.Group {
  const g = new THREE.Group();
  const goldMat = materials.createToonMaterial(glowHex, {
    emissive: glowHex,
    emissiveIntensity: 1.15,
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.09, 10, 24),
    goldMat
  );
  addInvertedHullOutline(ring, materials.inkOutlineMaterial, 1.09);
  g.add(ring);

  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.13, 0.13), goldMat);
  shaft.position.set(0.75, 0, 0);
  addAnimeInkEdges(shaft, materials.inkLineMaterial, 20);
  g.add(shaft);

  const tooth1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.28, 0.12),
    goldMat
  );
  tooth1.position.set(0.95, -0.18, 0);
  g.add(tooth1);

  const tooth2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.22, 0.12),
    goldMat
  );
  tooth2.position.set(1.13, -0.15, 0);
  g.add(tooth2);

  return g;
}

// ============================================================================
// SCENE 1: STEP #1 — Frozen Stage Guard & Master Control Keys (CREATE_SUSPENDED)
// ============================================================================
function buildFrozenStageGuardScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0x38bdf8, 13));

  const stageDeck = new THREE.Mesh(
    new THREE.BoxGeometry(11.5, 0.55, 7.2),
    materials.createToonMaterial(0x1e293b)
  );
  stageDeck.position.set(0, 0.275, -0.4);
  stageDeck.receiveShadow = true;
  addAnimeInkEdges(stageDeck, materials.inkLineMaterial, 20);
  root.add(stageDeck);

  const brassTrim = new THREE.Mesh(
    new THREE.BoxGeometry(11.6, 0.14, 0.18),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.45,
    })
  );
  brassTrim.position.set(0, 0.52, 3.22);
  root.add(brassTrim);

  const doorGroup = new THREE.Group();
  doorGroup.position.set(-3.4, 0.55, -1.6);
  const pillarGeo = new THREE.BoxGeometry(0.5, 4.4, 0.65);
  const pillarMat = materials.createToonMaterial(0x334155);
  const pL = new THREE.Mesh(pillarGeo, pillarMat);
  pL.position.set(-1.3, 2.2, 0);
  addAnimeInkEdges(pL, materials.inkLineMaterial, 20);
  doorGroup.add(pL);

  const pR = new THREE.Mesh(pillarGeo, pillarMat);
  pR.position.set(1.3, 2.2, 0);
  addAnimeInkEdges(pR, materials.inkLineMaterial, 20);
  doorGroup.add(pR);

  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.85, 0.72),
    materials.createToonMaterial(0x0f172a)
  );
  lintel.position.set(0, 4.7, 0);
  addAnimeInkEdges(lintel, materials.inkLineMaterial, 20);
  doorGroup.add(lintel);

  const doorSignTex = createLabelBoardTexture(
    'SVCHOST.EXE · STAGE DOOR',
    'CREATE_SUSPENDED = 0x00000004',
    '#0F172A',
    '#38BDF8',
    '#F8FAFC',
    '#38BDF8'
  );
  extraTextures.push(doorSignTex);
  const doorSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 0.72),
    new THREE.MeshBasicMaterial({ map: doorSignTex })
  );
  doorSign.position.set(0, 4.7, 0.38);
  doorGroup.add(doorSign);

  const curtainMat = materials.createToonMaterial(0x9f1239);
  for (const xSign of [-1, 1]) {
    const curtain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.44, 4.3, 10),
      curtainMat
    );
    curtain.position.set(xSign * 1.95, 2.15, 0.15);
    addInvertedHullOutline(curtain, materials.inkOutlineMaterial, 1.05);
    doorGroup.add(curtain);
  }
  root.add(doorGroup);

  const guardGroup = buildStylizedHuman(materials, 0x1d4ed8, 0xfacc15, true);
  guardGroup.position.set(-2.6, 0.55, -0.5);
  guardGroup.rotation.y = 0.52;
  root.add(guardGroup);

  const stasisRig = createStasisDomeMaterial();
  const freezeCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(2.15, 1),
    stasisRig.material
  );
  freezeCrystal.scale.set(0.88, 1.35, 0.88);
  freezeCrystal.position.set(-0.6, 2.2, 0.1);
  root.add(freezeCrystal);

  const freezeWireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.OctahedronGeometry(2.18, 1)),
    new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
    })
  );
  freezeWireframe.scale.set(0.88, 1.35, 0.88);
  freezeWireframe.position.copy(freezeCrystal.position);
  root.add(freezeWireframe);

  const freezeRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.75, 0.06, 8, 36),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
      toneMapped: false,
    })
  );
  freezeRing.rotation.x = Math.PI / 2;
  freezeRing.position.set(-0.6, 0.65, 0.1);
  root.add(freezeRing);

  const spotConeRig = createScanConeMaterial();
  const spotCone = new THREE.Mesh(
    new THREE.ConeGeometry(2.3, 5.2, 24, 1, true),
    spotConeRig.material
  );
  spotCone.position.set(-0.6, 3.2, 0.1);
  root.add(spotCone);

  const consoleGroup = new THREE.Group();
  consoleGroup.position.set(3.8, 0.55, 0.7);
  consoleGroup.rotation.y = -0.45;

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 1.3, 1.2),
    materials.createToonMaterial(0x1e1b4b)
  );
  desk.position.y = 0.65;
  addAnimeInkEdges(desk, materials.inkLineMaterial, 20);
  consoleGroup.add(desk);

  const freezeBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.34, 0.18, 16),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 1.5,
    })
  );
  freezeBtn.position.set(-0.35, 1.38, 0.15);
  consoleGroup.add(freezeBtn);

  const consoleTex = createLabelBoardTexture(
    'DIRECTOR · INVOICE_Q4.EXE',
    'PID 3104 · CALLS CreateProcessW',
    '#1E1B4B',
    '#F43F5E',
    '#FDA4AF',
    '#FACC15'
  );
  extraTextures.push(consoleTex);
  const consoleSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 0.56),
    new THREE.MeshBasicMaterial({ map: consoleTex })
  );
  consoleSign.position.set(0, 0.72, 0.62);
  consoleGroup.add(consoleSign);
  root.add(consoleGroup);

  const keysGroup = new THREE.Group();
  const keyProcess = buildMasterKeyToken(materials, 0xfacc15);
  keyProcess.position.set(0, 0.45, 0);
  keyProcess.scale.setScalar(0.85);
  keysGroup.add(keyProcess);

  const keyThread = buildMasterKeyToken(materials, 0x38bdf8);
  keyThread.position.set(0.3, -0.35, 0.25);
  keyThread.scale.setScalar(0.76);
  keysGroup.add(keyThread);

  keysGroup.position.set(1.6, 2.6, 0.6);
  root.add(keysGroup);

  const tetherCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.6, 2.2, 0.1),
    new THREE.Vector3(1.6, 3.6, 0.4),
    new THREE.Vector3(3.6, 1.9, 0.65)
  );
  const tetherMesh = new THREE.Mesh(
    new THREE.TubeGeometry(tetherCurve, 28, 0.055, 8, false),
    new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.85,
      toneMapped: false,
    })
  );
  root.add(tetherMesh);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.6, 4.15, 0.1);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.35, 3.35, 0.6);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(1.2, 5.2, 11.4),
    defaultCameraTarget: new THREE.Vector3(0.4, 2.1, 0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-0.4, 0, 0.1),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;
      stasisRig.uniforms.uTime.value = timeSec;
      spotConeRig.uniforms.uTime.value = timeSec;

      const walkProg = easeOutCubic(t / 4.6);
      const guardX = THREE.MathUtils.lerp(-3.1, -0.6, walkProg);
      const guardZ = THREE.MathUtils.lerp(-1.2, 0.1, walkProg);
      guardGroup.position.set(
        guardX,
        0.55 + (t < 4.6 ? Math.abs(Math.sin(t * 7)) * 0.08 : 0),
        guardZ
      );

      const freezeProg = easeOutCubic((t - 4.6) / 1.4);
      const crystalMult =
        cutawayMode === 'OPEN' ? 0.35 : cutawayMode === 'SEALED' ? 1.2 : 1.0;
      stasisRig.uniforms.uOpacity.value = Math.min(1, freezeProg * crystalMult);
      freezeCrystal.visible = freezeProg > 0.02;
      freezeCrystal.rotation.y = timeSec * 0.35;
      freezeWireframe.visible = freezeProg > 0.02 && cutawayMode !== 'SEALED';
      freezeWireframe.rotation.y = timeSec * 0.35;
      freezeCrystal.scale.set(
        0.88 * (0.7 + freezeProg * 0.3),
        1.35 * (0.7 + freezeProg * 0.3),
        0.88 * (0.7 + freezeProg * 0.3)
      );
      freezeWireframe.scale.copy(freezeCrystal.scale);
      freezeRing.scale.setScalar(0.5 + freezeProg * 0.65);
      freezeBtn.position.y = t >= 4.6 && t <= 5.8 ? 1.28 : 1.38;
      spotConeRig.uniforms.uTrustedLock.value = freezeProg * 0.3;

      const keyProg = easeInOutQuad((t - 9.4) / 2.8);
      const keyArcX = THREE.MathUtils.lerp(-0.4, 2.85, keyProg);
      const keyArcY =
        2.4 + Math.sin(keyProg * Math.PI) * 1.15 + Math.sin(timeSec * 3.2) * 0.1;
      keysGroup.position.set(keyArcX, keyArcY, 0.55);
      keysGroup.visible = t > 8.6 || cutawayMode === 'OPEN';
      keyProcess.rotation.y = timeSec * 1.6;
      keyThread.rotation.y = -timeSec * 1.9;
      tetherMesh.visible = t > 8.8 || cutawayMode === 'OPEN';

      primaryAnchor.position.set(guardX, 4.1, guardZ);
      secondaryAnchor.position.set(
        Math.max(1.2, keyArcX),
        keyArcY + 0.85,
        0.55
      );

      return {
        glitchIntensity: t > 4.6 && t < 9.4 ? 0.42 : 0.18,
        magicDustIntensity: 0.78,
        stasisIntensity: freezeProg,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
      stasisRig.material.dispose();
      spotConeRig.material.dispose();
    },
  };
}

// ============================================================================
// SCENE 2: STEP #2 — PEB+0x10 Scan & Hollowing Legal Cargo (NtUnmapViewOfSection)
// ============================================================================
function buildHollowCargoUnmapScene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0x22d3ee, 14));

  const truckRig = buildArmoredBankTruck(materials, isSoftwareGl);
  truckRig.root.position.set(-1.3, 0, 0);
  truckRig.cutawaySidePanel.visible = false;
  truckRig.rearDoorLeftPivot.rotation.y = -2.25;
  truckRig.rearDoorRightPivot.rotation.y = 2.25;
  truckRig.covertCrewRoot.visible = false;
  root.add(truckRig.root);

  const gantryGroup = new THREE.Group();
  gantryGroup.position.set(-1.3, 0, 0);
  const archMat = materials.createToonMaterial(0x1e293b);
  for (const zSign of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.45, 5.2, 0.45), archMat);
    leg.position.set(-0.5, 2.6, zSign * 2.75);
    addAnimeInkEdges(leg, materials.inkLineMaterial, 20);
    gantryGroup.add(leg);
  }
  const crossBeam = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.55, 6.1),
    archMat
  );
  crossBeam.position.set(-0.5, 5.15, 0);
  addAnimeInkEdges(crossBeam, materials.inkLineMaterial, 20);
  gantryGroup.add(crossBeam);

  const pebSignTex = createLabelBoardTexture(
    'PEB+0x10 · 0x00400000 SCANNER',
    'NtUnmapViewOfSection -> STATUS_SUCCESS',
    '#0B1120',
    '#22D3EE',
    '#67E8F9',
    '#FACC15'
  );
  extraTextures.push(pebSignTex);
  const pebSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 1.05),
    new THREE.MeshBasicMaterial({ map: pebSignTex })
  );
  pebSign.position.set(-0.5, 5.78, 0.35);
  gantryGroup.add(pebSign);
  root.add(gantryGroup);

  const pebScanRig = createScanConeMaterial();
  const pebScanCone = new THREE.Mesh(
    new THREE.ConeGeometry(2.55, 4.6, 24, 1, true),
    pebScanRig.material
  );
  pebScanCone.position.set(-1.8, 2.75, 0);
  root.add(pebScanCone);

  const hollowWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.6, 1.75, 1.85)),
    new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.9,
    })
  );
  hollowWire.position.set(-2.25, 1.95, 0);
  root.add(hollowWire);

  const unmappedBlocks: THREE.Mesh[] = [];
  const blockMat = materials.createToonMaterial(0x0ea5e9, {
    emissive: 0x38bdf8,
    emissiveIntensity: 0.85,
    transparent: true,
    opacity: 0.92,
  });
  for (let i = 0; i < 4; i += 1) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.56, 0.56), blockMat);
    b.position.set(-2.6 + i * 0.45, 1.65, i % 2 === 0 ? -0.45 : 0.45);
    addAnimeInkEdges(b, materials.inkLineMaterial, 20);
    root.add(b);
    unmappedBlocks.push(b);
  }

  const railMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.72,
    toneMapped: false,
  });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.08, 1.4), railMat);
  rail.position.set(-5.8, 0.35, 0);
  root.add(rail);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.6, 3.65, 0);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-5.2, 2.35, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.8, 5.4, 12.2),
    defaultCameraTarget: new THREE.Vector3(-2.1, 2.0, 0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-2.0, 0, 0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;
      pebScanRig.uniforms.uTime.value = timeSec;

      const sweepX = -1.8 + Math.sin(timeSec * 2.1) * 1.25;
      pebScanCone.position.x = sweepX;
      pebScanRig.uniforms.uTrustedLock.value = t > 10.2 ? 0.85 : 0.15;

      // Cutaway mode controls truck armored side panel visibility
      const openCutaway =
        cutawayMode === 'OPEN'
          ? 1
          : cutawayMode === 'SEALED'
          ? 0
          : t > 3.2
          ? 1
          : 0.25;
      truckRig.cutawaySidePanel.visible = openCutaway < 0.85;
      truckRig.cutawaySideMaterial.opacity = Math.max(0.08, 1 - openCutaway * 0.92);

      const extractProg = easeInOutQuad((t - 4.4) / 5.8);
      for (let i = 0; i < truckRig.legalCrates.length; i += 1) {
        const crateEntry = truckRig.legalCrates[i];
        const crateT = clamp01(extractProg * 1.4 - i * 0.12);
        crateEntry.group.position.lerpVectors(
          crateEntry.insidePos,
          crateEntry.unloadedPos,
          crateT
        );
        crateEntry.group.position.x -= crateT * 2.2;
        crateEntry.group.position.y += Math.sin(crateT * Math.PI) * 0.36;
        crateEntry.group.scale.setScalar(
          Math.max(0.01, 1 - Math.max(0, crateT - 0.65) * 2.8)
        );
        crateEntry.group.visible = crateT < 0.98;
      }

      for (let i = 0; i < unmappedBlocks.length; i += 1) {
        const blk = unmappedBlocks[i];
        const bT = clamp01(extractProg * 1.3 - i * 0.14);
        blk.position.set(
          -2.4 + i * 0.35 - bT * 4.8,
          2.05 + Math.sin(timeSec * 3 + i) * 0.18 + bT * 0.55,
          i % 2 === 0 ? -0.55 : 0.55
        );
        blk.rotation.y = timeSec * 1.2 + i;
        blk.scale.setScalar(Math.max(0.01, 1 - Math.max(0, bT - 0.68) * 3.0));
        blk.visible = bT < 0.98;
      }

      hollowWire.visible = extractProg > 0.2;
      (hollowWire.material as THREE.LineBasicMaterial).opacity =
        0.25 + extractProg * 0.75;

      secondaryAnchor.position.set(-4.6 - extractProg * 1.5, 2.55, 0.25);

      return {
        glitchIntensity: t > 4.4 && t < 10.6 ? 0.78 : 0.28,
        magicDustIntensity: 0.75,
        stasisIntensity: 0.62,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
      pebScanRig.material.dispose();
    },
  };
}

// ============================================================================
// SCENE 3: STEP #3 — 264 KB RWX Memory Vault & Beacon PE Injection
// ============================================================================
function buildRwxVaultInjectScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0xf43f5e, 13.5));

  const shellWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(6.8, 3.3, 3.1)),
    new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    })
  );
  shellWire.position.set(1.2, 2.05, 0);
  root.add(shellWire);

  // Outer trusted armor casing toggled by Cutaway mode (SEALED vs OPEN)
  const outerArmorMat = materials.createToonMaterial(0x1e3a8a, {
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
  });
  const outerArmorShell = new THREE.Mesh(
    new THREE.BoxGeometry(6.72, 3.24, 3.02),
    outerArmorMat
  );
  outerArmorShell.position.set(1.2, 2.05, 0);
  root.add(outerArmorShell);

  const outerBadgeTex = createLabelBoardTexture(
    'SVCHOST.EXE · EXTERIOR SHELL',
    'TRUSTED SIGNATURE INTACT · 0x00400000',
    '#0F172A',
    '#38BDF8',
    '#E0F2FE',
    '#38BDF8'
  );
  extraTextures.push(outerBadgeTex);
  const outerBadge = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 0.85),
    new THREE.MeshBasicMaterial({ map: outerBadgeTex })
  );
  outerBadge.position.set(1.2, 4.25, 0);
  root.add(outerBadge);

  const vaultCage = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 2.55, 2.4),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  vaultCage.position.set(1.2, 1.85, 0);
  root.add(vaultCage);

  const vaultEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(4.65, 2.6, 2.45)),
    new THREE.LineBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.95,
    })
  );
  vaultEdges.position.set(1.2, 1.85, 0);
  root.add(vaultEdges);

  const moduleSpecs = [
    { label: 'MZ PE HEADER', sub: '4D 5A 90 00 · 0x00400000', color: 0xf59e0b, y: 0.85 },
    { label: '.text · BEACON', sub: 'RWX 0x40 · ENTRY 0x004014A0', color: 0xf43f5e, y: 1.52 },
    { label: '.rdata · STRINGS', sub: 'MALLEABLE C2 CONFIG', color: 0xa855f7, y: 2.18 },
    { label: '.data · PAYLOAD', sub: '270,336 BYTES COMMITTED', color: 0xe11d48, y: 2.82 },
  ];

  const peModules: THREE.Group[] = [];
  for (const spec of moduleSpecs) {
    const modGroup = new THREE.Group();
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.48, 1.85),
      materials.createToonMaterial(spec.color, {
        emissive: spec.color,
        emissiveIntensity: 0.55,
      })
    );
    addAnimeInkEdges(slab, materials.inkLineMaterial, 20);
    modGroup.add(slab);

    const tex = createLabelBoardTexture(
      spec.label,
      spec.sub,
      '#18181B',
      '#FDA4AF',
      '#FFFFFF',
      '#FDE68A'
    );
    extraTextures.push(tex);
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(3.45, 0.42),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    face.position.set(0, 0, 0.94);
    modGroup.add(face);

    modGroup.position.set(1.2, spec.y, 0);
    root.add(modGroup);
    peModules.push(modGroup);
  }

  const emitterGroup = new THREE.Group();
  emitterGroup.position.set(-4.8, 1.85, 0);
  const emitterBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 1.05, 1.8, 12),
    materials.createToonMaterial(0x1e1b4b)
  );
  emitterBody.rotation.z = -Math.PI / 2;
  addAnimeInkEdges(emitterBody, materials.inkLineMaterial, 22);
  emitterGroup.add(emitterBody);

  const nozzleRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.1, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false })
  );
  nozzleRing.rotation.y = Math.PI / 2;
  nozzleRing.position.set(0.95, 0, 0);
  emitterGroup.add(nozzleRing);
  root.add(emitterGroup);

  const packets: THREE.Mesh[] = [];
  const packetGeo = new THREE.BoxGeometry(0.34, 0.22, 0.22);
  const packetMat = new THREE.MeshBasicMaterial({
    color: 0xfb7185,
    toneMapped: false,
  });
  for (let i = 0; i < 8; i += 1) {
    const p = new THREE.Mesh(packetGeo, packetMat);
    root.add(p);
    packets.push(p);
  }

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(3.45, 3.25, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-3.3, 3.05, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 4.7, 11.4),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.0, 0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.8, 0, 0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;

      // Cutaway toggles outer svchost armor casing
      if (cutawayMode === 'OPEN') {
        outerArmorShell.visible = false;
      } else if (cutawayMode === 'SEALED') {
        outerArmorShell.visible = true;
        outerArmorMat.opacity = 0.72;
      } else {
        outerArmorShell.visible = true;
        outerArmorMat.opacity = 0.14;
      }

      const vaultScale = easeOutCubic(t / 3.4);
      vaultCage.scale.set(
        Math.max(0.05, vaultScale),
        Math.max(0.05, vaultScale),
        Math.max(0.05, vaultScale)
      );
      vaultEdges.scale.copy(vaultCage.scale);

      const streamActive = t > 3.4 && t < 12.2;
      for (let i = 0; i < packets.length; i += 1) {
        const p = packets[i];
        p.visible = streamActive;
        const cycle = (timeSec * 1.45 + i / packets.length) % 1;
        p.position.set(
          THREE.MathUtils.lerp(-3.7, 0.4, cycle),
          1.85 + Math.sin(cycle * Math.PI * 2 + i) * 0.48,
          Math.cos(cycle * Math.PI * 2 + i) * 0.35
        );
        p.rotation.x = timeSec * 4 + i;
        p.rotation.y = timeSec * 3;
      }

      for (let i = 0; i < peModules.length; i += 1) {
        const mod = peModules[i];
        const appear = easeOutCubic((t - (4.4 + i * 1.4)) / 1.15);
        mod.visible = appear > 0.02;
        mod.scale.set(appear, appear, appear);
        mod.position.x = THREE.MathUtils.lerp(-1.2, 1.2, appear);
      }

      nozzleRing.rotation.x = timeSec * 2.4;

      return {
        glitchIntensity: streamActive ? 0.92 : 0.38,
        magicDustIntensity: 0.85,
        stasisIntensity: 0.18,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
      packetGeo.dispose();
      packetMat.dispose();
    },
  };
}

// ============================================================================
// SCENE 4: STEP #4 — Hijacked Steering Wheel, Holographic GPS (RCX) & Unfreeze
// ============================================================================
function buildCockpitGpsHijackScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0xfb7185, 13.5));

  const cockpitGroup = new THREE.Group();
  cockpitGroup.position.set(-2.2, 0.35, 0.4);

  const dashMat = materials.createToonMaterial(0x1e293b, {
    transparent: true,
    opacity: 0.98,
  });
  const dash = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.9, 2.2), dashMat);
  dash.position.y = 0.95;
  addAnimeInkEdges(dash, materials.inkLineMaterial, 20);
  cockpitGroup.add(dash);

  const wheelPivot = new THREE.Group();
  wheelPivot.position.set(-0.7, 2.15, 0.72);
  wheelPivot.rotation.x = -0.45;

  const wheelRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.13, 10, 28),
    materials.createToonMaterial(0x0f172a)
  );
  addInvertedHullOutline(wheelRim, materials.inkOutlineMaterial, 1.07);
  wheelPivot.add(wheelRim);

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.18, 16),
    materials.createToonMaterial(0xf43f5e, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.9,
    })
  );
  hub.rotation.x = Math.PI / 2;
  wheelPivot.add(hub);

  for (let i = 0; i < 3; i += 1) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.85, 0.1),
      materials.createToonMaterial(0x94a3b8)
    );
    const a = (i * Math.PI * 2) / 3;
    spoke.position.set(Math.sin(a) * 0.42, Math.cos(a) * 0.42, 0);
    spoke.rotation.z = -a;
    wheelPivot.add(spoke);
  }
  cockpitGroup.add(wheelPivot);

  const gpsGroup = new THREE.Group();
  gpsGroup.position.set(1.05, 2.5, 0.15);

  const gpsRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.06, 8, 36),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false })
  );
  gpsGroup.add(gpsRing);

  const legMarker = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.18, 0),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false })
  );
  legMarker.position.set(-0.72, 0.62, 0);
  gpsGroup.add(legMarker);

  const hijackMarker = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.24, 0),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false })
  );
  hijackMarker.position.set(0.75, 0.58, 0);
  gpsGroup.add(hijackMarker);

  const gpsNeedle = new THREE.Group();
  const needleMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 1.05, 4),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false })
  );
  needleMesh.position.y = 0.42;
  gpsNeedle.add(needleMesh);
  gpsGroup.add(gpsNeedle);
  cockpitGroup.add(gpsGroup);

  const rcxTex = createLabelBoardTexture(
    'RCX = 0x004014A0 · HIJACKED',
    'SetThreadContext -> ResumeThread (1 -> 0)',
    '#18181B',
    '#F43F5E',
    '#FDA4AF',
    '#38BDF8'
  );
  extraTextures.push(rcxTex);
  const rcxSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 0.85),
    new THREE.MeshBasicMaterial({ map: rcxTex })
  );
  rcxSign.position.set(0.1, 4.15, 0);
  cockpitGroup.add(rcxSign);
  root.add(cockpitGroup);

  const railGroup = new THREE.Group();
  railGroup.position.set(3.2, 1.45, -0.2);

  const cpuRail = new THREE.Mesh(
    new THREE.BoxGeometry(5.8, 0.28, 0.9),
    materials.createToonMaterial(0x0f172a)
  );
  addAnimeInkEdges(cpuRail, materials.inkLineMaterial, 20);
  railGroup.add(cpuRail);

  const railStripe = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.08, 0.22),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false })
  );
  railStripe.position.y = 0.16;
  railGroup.add(railStripe);

  const threadCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.58, 1),
    materials.createToonMaterial(0xfb7185, {
      emissive: 0xf43f5e,
      emissiveIntensity: 1.5,
    })
  );
  threadCore.position.set(-2.1, 0.78, 0);
  addInvertedHullOutline(threadCore, materials.inkOutlineMaterial, 1.07);
  railGroup.add(threadCore);

  const lockShards: THREE.Mesh[] = [];
  const shardMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    toneMapped: false,
  });
  for (let i = 0; i < 6; i += 1) {
    const sh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.62, 0.16), shardMat);
    railGroup.add(sh);
    lockShards.push(sh);
  }

  const alertRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.07, 8, 36),
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.9,
      toneMapped: false,
    })
  );
  alertRing.rotation.x = Math.PI / 2;
  alertRing.position.set(0.8, 1.8, 0);
  railGroup.add(alertRing);
  root.add(railGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.1, 4.1, 0.5);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.2, 3.45, -0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.6, 5.0, 11.4),
    defaultCameraTarget: new THREE.Vector3(0.4, 2.0, 0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.5, 0, 0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;

      dashMat.opacity = cutawayMode === 'OPEN' ? 0.35 : 0.98;

      const hijackProg = easeInOutQuad((t - 0.8) / 3.8);
      wheelPivot.rotation.z = THREE.MathUtils.lerp(0.55, -1.05, hijackProg);
      gpsNeedle.rotation.z = THREE.MathUtils.lerp(0.82, -0.82, hijackProg);

      const resumeProg = easeOutCubic((t - 5.2) / 4.2);
      for (let i = 0; i < lockShards.length; i += 1) {
        const a = (i * Math.PI * 2) / lockShards.length;
        const r = 0.88 + resumeProg * 2.1;
        lockShards[i].position.set(
          -2.1 + Math.cos(a) * r,
          0.78 + Math.sin(a) * r * 0.75,
          Math.sin(a * 2) * 0.45
        );
        lockShards[i].rotation.z = a + resumeProg * 2.6;
        lockShards[i].visible = resumeProg < 0.92;
      }
      shardMat.opacity = Math.max(0, 1 - resumeProg * 1.15);

      const coreX = THREE.MathUtils.lerp(-2.1, 2.35, resumeProg);
      threadCore.position.set(coreX, 0.78 + Math.sin(timeSec * 5) * 0.1, 0);
      threadCore.rotation.y = timeSec * (1.2 + resumeProg * 5.0);

      const alertWave = ((t - 9.5) % 2.2) / 2.2;
      alertRing.visible = t > 9.5;
      alertRing.scale.setScalar(0.5 + Math.max(0, alertWave) * 1.85);
      (alertRing.material as THREE.MeshBasicMaterial).opacity =
        Math.max(0, 1 - alertWave) * 0.92;

      secondaryAnchor.position.set(3.2 + coreX * 0.55, 3.4, -0.2);

      return {
        glitchIntensity: t > 5.0 && t < 10.2 ? 0.72 : 0.3,
        magicDustIntensity: 0.8,
        stasisIntensity: Math.max(0, 1 - resumeProg),
        brakeReleaseBoost: t > 5.2 && t < 10.4 ? 0.85 : 0,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
      shardMat.dispose();
    },
  };
}

// ============================================================================
// SCENE 5: STEP #5 — Perimeter Firewall Gate -> TLS 1.3 Bridge -> External C2 Tower
// ============================================================================
function buildFirewallC2BridgeScene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0x10b981, 15.5));

  const road = new THREE.Mesh(
    new THREE.BoxGeometry(17.5, 0.14, 4.4),
    materials.createToonMaterial(0xffffff, { map: materials.roadSurfaceTexture })
  );
  road.position.set(-1.5, 0.07, 0.6);
  root.add(road);

  const truckRig = buildArmoredBankTruck(materials, isSoftwareGl);
  truckRig.root.scale.setScalar(0.76);
  truckRig.root.position.set(-5.8, 0.14, 0.6);
  truckRig.legalCargoRoot.visible = false;
  truckRig.covertCrewRoot.visible = true;
  root.add(truckRig.root);

  const gateGroup = new THREE.Group();
  gateGroup.position.set(-0.6, 0.14, 0.6);
  const booth = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.7, 1.5),
    materials.createToonMaterial(0x1e293b)
  );
  booth.position.set(0, 1.35, -2.5);
  addAnimeInkEdges(booth, materials.inkLineMaterial, 20);
  gateGroup.add(booth);

  const allowLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 12, 10),
    new THREE.MeshBasicMaterial({ color: 0x10b981, toneMapped: false })
  );
  allowLight.position.set(0, 2.95, -2.5);
  gateGroup.add(allowLight);

  const barrierPivot = new THREE.Group();
  barrierPivot.position.set(0, 1.05, -1.7);
  const barrierArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.14, 3.6),
    materials.createToonMaterial(0xffffff, {
      map: materials.hazardStripeTexture,
    })
  );
  barrierArm.position.set(0, 0, 1.8);
  barrierPivot.add(barrierArm);
  gateGroup.add(barrierPivot);

  const fwScanRig = createScanConeMaterial();
  const fwScanCone = new THREE.Mesh(
    new THREE.ConeGeometry(2.1, 3.8, 20, 1, true),
    fwScanRig.material
  );
  fwScanCone.position.set(0, 2.1, 0);
  gateGroup.add(fwScanCone);

  const fwSignTex = createLabelBoardTexture(
    'FIREWALL: ALLOW SVCHOST.EXE',
    'SIGNED MICROSOFT PATH PERMITTED',
    '#052E16',
    '#10B981',
    '#6EE7B7',
    '#F8FAFC'
  );
  extraTextures.push(fwSignTex);
  const fwSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 0.78),
    new THREE.MeshBasicMaterial({ map: fwSignTex })
  );
  fwSign.position.set(0, 4.15, -2.2);
  gateGroup.add(fwSign);
  root.add(gateGroup);

  const c2Group = new THREE.Group();
  c2Group.position.set(6.4, 0.14, -0.5);

  const c2Tower = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 5.2, 2.8),
    materials.createToonMaterial(0x18181b)
  );
  c2Tower.position.y = 2.6;
  addAnimeInkEdges(c2Tower, materials.inkLineMaterial, 20);
  c2Group.add(c2Tower);

  for (let i = 0; i < 4; i += 1) {
    const slit = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.14, 0.12),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false })
    );
    slit.position.set(0, 1.1 + i * 0.95, 1.42);
    c2Group.add(slit);
  }

  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.14, 1.7, 8),
    materials.createToonMaterial(0x64748b)
  );
  mast.position.set(0, 6.05, 0);
  c2Group.add(mast);

  const c2BeaconOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 12, 10),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false })
  );
  c2BeaconOrb.position.set(0, 6.95, 0);
  c2Group.add(c2BeaconOrb);

  const c2SignTex = createLabelBoardTexture(
    'C2 SERVER · 185.220.101.42:443',
    'TLS 1.3 · GET /jquery-3.3.1.min.js',
    '#1F0914',
    '#F43F5E',
    '#FDA4AF',
    '#FDE68A'
  );
  extraTextures.push(c2SignTex);
  const c2Sign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.9, 0.85),
    new THREE.MeshBasicMaterial({ map: c2SignTex })
  );
  c2Sign.position.set(0, 5.65, 1.45);
  c2Group.add(c2Sign);
  root.add(c2Group);

  const tlsCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-1.5, 2.3, 0.6),
    new THREE.Vector3(2.6, 5.9, 0.1),
    new THREE.Vector3(6.4, 6.8, -0.5)
  );
  const tlsArc = new THREE.Mesh(
    new THREE.TubeGeometry(tlsCurve, 32, 0.06, 8, false),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.72,
      toneMapped: false,
    })
  );
  root.add(tlsArc);

  const tlsPackets: THREE.Mesh[] = [];
  const tlsPktGeo = new THREE.OctahedronGeometry(0.22, 0);
  const tlsPktMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    toneMapped: false,
  });
  for (let i = 0; i < 6; i += 1) {
    const pkt = new THREE.Mesh(tlsPktGeo, tlsPktMat);
    root.add(pkt);
    tlsPackets.push(pkt);
  }

  const radarGroup = new THREE.Group();
  radarGroup.position.set(1.6, 0.14, -4.6);
  const radarBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.75, 1.6, 12),
    materials.createToonMaterial(0x334155)
  );
  radarBase.position.y = 0.8;
  radarGroup.add(radarBase);

  const radarDishPivot = new THREE.Group();
  radarDishPivot.position.y = 1.85;
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.42),
    materials.createToonMaterial(0xf59e0b, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide,
    })
  );
  dish.rotation.x = Math.PI * 0.45;
  radarDishPivot.add(dish);
  radarGroup.add(radarDishPivot);
  root.add(radarGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.5, 3.15, 0.6);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(6.4, 7.2, -0.5);
  root.add(secondaryAnchor);

  const _tmpPt = new THREE.Vector3();

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.8, 6.2, 14.2),
    defaultCameraTarget: new THREE.Vector3(0.9, 2.3, -0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.5, 0, 0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;
      fwScanRig.uniforms.uTime.value = timeSec;

      // Cutaway mode exposes covert crew inside moving truck
      const showInside = cutawayMode === 'OPEN';
      truckRig.cutawaySidePanel.visible = !showInside;
      truckRig.cutawaySideMaterial.opacity = showInside ? 0.08 : 1.0;

      const driveProg = easeInOutQuad(t / 6.6);
      const tx = THREE.MathUtils.lerp(-6.4, 1.2, driveProg);
      truckRig.root.position.x = tx;
      for (const w of truckRig.wheels) {
        w.rotation.z = -driveProg * 9.5;
      }

      const gateOpen = easeOutCubic((t - 1.2) / 1.5);
      barrierPivot.rotation.x = -gateOpen * 1.32;
      fwScanRig.uniforms.uTrustedLock.value = gateOpen;

      const c2Active = t > 4.2;
      tlsArc.visible = c2Active;
      for (let i = 0; i < tlsPackets.length; i += 1) {
        const pkt = tlsPackets[i];
        pkt.visible = c2Active;
        const u = (timeSec * 0.48 + i / tlsPackets.length) % 1;
        tlsCurve.getPoint(u, _tmpPt);
        pkt.position.copy(_tmpPt);
        pkt.rotation.y = timeSec * 4 + i;
      }

      radarDishPivot.rotation.y =
        t > 9.8 ? Math.sin(timeSec * 1.4) * 0.22 + 0.45 : timeSec * 1.6;
      c2BeaconOrb.scale.setScalar(1 + Math.sin(timeSec * 6) * 0.18);

      primaryAnchor.position.set(tx, 3.25, 0.6);

      return {
        glitchIntensity: c2Active ? 0.52 : 0.18,
        magicDustIntensity: 0.72,
        stasisIntensity: 0,
        brakeReleaseBoost: t > 1.5 && t < 6.4 ? 0.55 : 0,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
      fwScanRig.material.dispose();
      tlsPktGeo.dispose();
      tlsPktMat.dispose();
    },
  };
}

// ============================================================================
// SCENE 6: MEMORY FORENSICS — On-Disk Signed SEC_IMAGE vs In-RAM Tampered RWX
// ============================================================================
function buildMemoryVadDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0x38bdf8, 13.5));

  const diskGroup = new THREE.Group();
  diskGroup.position.set(-3.4, 0.25, 0);

  const diskLayers = [
    { label: 'SIGNED PE HEADER', sub: 'R-- · MICROSOFT CERT OK', color: 0x0284c7, y: 0.55 },
    { label: '.text (CLEAN)', sub: 'R-X (0x20) · SEC_IMAGE', color: 0x0ea5e9, y: 1.4 },
    { label: '.rdata (CLEAN)', sub: 'R-- (0x02) · FILE-BACKED', color: 0x38bdf8, y: 2.25 },
    { label: '.data (CLEAN)', sub: 'RW- (0x04) · NO EXEC', color: 0x10b981, y: 3.1 },
  ];
  const allSlabMats: THREE.MeshToonMaterial[] = [];
  for (const layer of diskLayers) {
    const slabMat = materials.createToonMaterial(layer.color, {
      emissive: layer.color,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.96,
    });
    allSlabMats.push(slabMat);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.62, 2.0), slabMat);
    slab.position.y = layer.y;
    addAnimeInkEdges(slab, materials.inkLineMaterial, 20);
    diskGroup.add(slab);

    const tex = createLabelBoardTexture(
      layer.label,
      layer.sub,
      '#082F49',
      '#38BDF8',
      '#F0F9FF',
      '#7DD3FC'
    );
    extraTextures.push(tex);
    const lbl = new THREE.Mesh(
      new THREE.PlaneGeometry(3.1, 0.5),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    lbl.position.set(0, layer.y, 1.02);
    diskGroup.add(lbl);
  }
  root.add(diskGroup);

  const ramGroup = new THREE.Group();
  ramGroup.position.set(3.4, 0.25, 0);

  const ramLayers = [
    { label: 'INJECTED MZ HEADER', sub: '0x00400000 · 4D 5A RW-', color: 0xf59e0b, y: 0.55 },
    { label: 'BEACON .text (RWX!)', sub: 'MEM_PRIVATE 0x40 · 264 KB', color: 0xf43f5e, y: 1.4 },
    { label: 'UNBACKED SHELLCODE', sub: 'ENTRY RCX = 0x004014A0', color: 0xe11d48, y: 2.25 },
    { label: 'ntdll.dll (CLEAN)', sub: '0x7FF8B4200000 · R-X', color: 0x0284c7, y: 3.1 },
  ];
  const anomalousSlabs: THREE.Mesh[] = [];
  for (let i = 0; i < ramLayers.length; i += 1) {
    const layer = ramLayers[i];
    const isMal = i < 3;
    const slabMat = materials.createToonMaterial(layer.color, {
      emissive: layer.color,
      emissiveIntensity: isMal ? 0.85 : 0.3,
      transparent: true,
      opacity: 0.96,
    });
    allSlabMats.push(slabMat);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.62, 2.0), slabMat);
    slab.position.y = layer.y;
    addAnimeInkEdges(slab, materials.inkLineMaterial, 20);
    ramGroup.add(slab);
    if (isMal) anomalousSlabs.push(slab);

    const tex = createLabelBoardTexture(
      layer.label,
      layer.sub,
      isMal ? '#2A0A14' : '#082F49',
      isMal ? '#F43F5E' : '#38BDF8',
      '#FFFFFF',
      isMal ? '#FDE68A' : '#7DD3FC'
    );
    extraTextures.push(tex);
    const lbl = new THREE.Mesh(
      new THREE.PlaneGeometry(3.1, 0.5),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    lbl.position.set(0, layer.y, 1.02);
    ramGroup.add(lbl);
  }
  root.add(ramGroup);

  const scannerGroup = new THREE.Group();
  const scanBeam = new THREE.Mesh(
    new THREE.BoxGeometry(10.6, 0.09, 2.75),
    new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.85,
      toneMapped: false,
    })
  );
  scannerGroup.add(scanBeam);
  scannerGroup.position.set(0, 1.6, 0);
  root.add(scannerGroup);

  const diffTex = createLabelBoardTexture(
    'SYSMON EID 25 · IMAGE MISMATCH',
    'DISK SEC_IMAGE != RAM MEM_PRIVATE RWX',
    '#18181B',
    '#FACC15',
    '#FDE047',
    '#FDA4AF'
  );
  extraTextures.push(diffTex);
  const diffSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 0.92),
    new THREE.MeshBasicMaterial({ map: diffTex })
  );
  diffSign.position.set(0, 4.55, 0);
  root.add(diffSign);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.4, 4.15, 0);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.4, 4.15, 0);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0, 4.8, 11.8),
    defaultCameraTarget: new THREE.Vector3(0, 2.1, 0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(2.4, 0, 0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;
      const scanY = 0.55 + ((Math.sin(timeSec * 1.45) + 1) * 0.5) * 3.1;
      scannerGroup.position.y = scanY;

      const slabOpacity = cutawayMode === 'OPEN' ? 0.52 : 0.98;
      for (const m of allSlabMats) {
        m.opacity = slabOpacity;
      }

      for (let i = 0; i < anomalousSlabs.length; i += 1) {
        const s = anomalousSlabs[i];
        const nearBeam = Math.abs(s.position.y + 0.25 - scanY) < 0.55;
        s.position.x = nearBeam ? Math.sin(timeSec * 36 + i) * 0.08 : 0;
      }

      return {
        glitchIntensity: t > 4.6 ? 0.72 : 0.28,
        magicDustIntensity: 0.74,
        stasisIntensity: 0.15,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
    },
  };
}

export function buildBespokeSectionScene(
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'frozen-stage-guard':
      return buildFrozenStageGuardScene(materials);
    case 'hollow-cargo-unmap':
      return buildHollowCargoUnmapScene(materials, isSoftwareGl);
    case 'rwx-vault-inject':
      return buildRwxVaultInjectScene(materials);
    case 'cockpit-gps-hijack':
      return buildCockpitGpsHijackScene(materials);
    case 'firewall-c2-bridge':
      return buildFirewallC2BridgeScene(materials, isSoftwareGl);
    case 'memory-vad-diff':
      return buildMemoryVadDiffScene(materials);
  }
}
