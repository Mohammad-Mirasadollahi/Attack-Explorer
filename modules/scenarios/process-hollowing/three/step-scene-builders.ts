import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  createScanConeMaterial,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildArmoredBankTruck,
  buildStasisFreezeRig,
} from './scene-builders';

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
  (grid.material as THREE.Material).opacity = 0.3;
  group.add(grid);

  return group;
}

function buildUniformedGuard(
  materials: AnimeMaterialLibrary,
  uniformHex: number,
  accentHex: number
): { group: THREE.Group; rightArmPivot: THREE.Group } {
  const g = new THREE.Group();
  const coatMat = materials.createToonMaterial(uniformHex);
  const darkMat = materials.createToonMaterial(0x0f172a);
  const skinMat = materials.createToonMaterial(0xfde68a);
  const accentMat = materials.createToonMaterial(accentHex, {
    emissive: accentHex,
    emissiveIntensity: 0.65,
  });

  const legGeo = new THREE.CapsuleGeometry(0.12, 0.52, 6, 10);
  const leftLeg = new THREE.Mesh(legGeo, darkMat);
  leftLeg.position.set(-0.16, 0.38, 0);
  addInvertedHullOutline(leftLeg, materials.inkOutlineMaterial, 1.07);
  g.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, darkMat);
  rightLeg.position.set(0.16, 0.38, 0);
  addInvertedHullOutline(rightLeg, materials.inkOutlineMaterial, 1.07);
  g.add(rightLeg);

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.86, 0.38),
    coatMat
  );
  torso.position.set(0, 1.12, 0);
  torso.castShadow = true;
  addAnimeInkEdges(torso, materials.inkLineMaterial, 22);
  g.add(torso);

  const badge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.06, 6),
    accentMat
  );
  badge.rotation.x = Math.PI / 2;
  badge.position.set(0.17, 1.24, 0.21);
  g.add(badge);

  const armGeo = new THREE.CapsuleGeometry(0.1, 0.48, 6, 10);
  const leftArm = new THREE.Mesh(armGeo, coatMat);
  leftArm.position.set(-0.46, 1.06, 0);
  leftArm.rotation.z = 0.14;
  addInvertedHullOutline(leftArm, materials.inkOutlineMaterial, 1.08);
  g.add(leftArm);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.46, 1.38, 0);
  const rightArm = new THREE.Mesh(armGeo, coatMat);
  rightArm.position.set(0, -0.3, 0);
  addInvertedHullOutline(rightArm, materials.inkOutlineMaterial, 1.08);
  rightArmPivot.add(rightArm);
  g.add(rightArmPivot);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 12), skinMat);
  head.position.set(0, 1.84, 0);
  addInvertedHullOutline(head, materials.inkOutlineMaterial, 1.07);
  g.add(head);

  const capCrown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.28, 0.16, 14),
    coatMat
  );
  capCrown.position.set(0, 2.08, 0);
  addAnimeInkEdges(capCrown, materials.inkLineMaterial, 25);
  g.add(capCrown);

  const capBrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.05, 0.28),
    darkMat
  );
  capBrim.position.set(0, 2.0, 0.18);
  g.add(capBrim);

  return { group: g, rightArmPivot };
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
// SCENE 1: STEP #1 — Armored Bank Truck Dispatch Garage, Freeze & Master Keys
// ============================================================================
function buildFrozenStageGuardScene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0x38bdf8, 15));

  // Garage asphalt bay lane
  const bayLane = new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.1, 5.2),
    materials.createToonMaterial(0xffffff, { map: materials.roadSurfaceTexture })
  );
  bayLane.position.set(-1.0, 0.05, 0);
  bayLane.receiveShadow = true;
  root.add(bayLane);

  // Rear-mounted Garage Bay Canopy (zero foreground pillars blocking the truck!)
  const garageArch = new THREE.Group();
  garageArch.position.set(0, 0.05, 0);
  const archMat = materials.createToonMaterial(0x1e293b);
  for (const px of [-4.2, 1.8]) {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 5.2, 0.58),
      archMat
    );
    pillar.position.set(px, 2.6, -2.85);
    addAnimeInkEdges(pillar, materials.inkLineMaterial, 20);
    garageArch.add(pillar);
  }
  const topBeam = new THREE.Mesh(
    new THREE.BoxGeometry(6.8, 0.68, 0.9),
    archMat
  );
  topBeam.position.set(-1.2, 5.2, -2.85);
  addAnimeInkEdges(topBeam, materials.inkLineMaterial, 20);
  garageArch.add(topBeam);

  const canopyRoof = new THREE.Mesh(
    new THREE.BoxGeometry(6.4, 0.24, 2.6),
    archMat
  );
  canopyRoof.position.set(-1.2, 5.0, -1.6);
  addAnimeInkEdges(canopyRoof, materials.inkLineMaterial, 20);
  garageArch.add(canopyRoof);

  const garageSignTex = createLabelBoardTexture(
    'BANK DISPATCH GARAGE',
    'CreateProcessW("svchost.exe", CREATE_SUSPENDED)',
    '#0F172A',
    '#38BDF8',
    '#F8FAFC',
    '#38BDF8'
  );
  extraTextures.push(garageSignTex);
  const garageSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 1.04),
    new THREE.MeshBasicMaterial({ map: garageSignTex })
  );
  garageSign.position.set(1.6, 5.55, -2.25);
  garageArch.add(garageSign);
  root.add(garageArch);

  // Real Composite Armored Bank Truck rolling into bay and freezing
  const truckRig = buildArmoredBankTruck(materials, isSoftwareGl);
  truckRig.root.scale.setScalar(0.84);
  truckRig.root.position.set(-5.6, 0.1, 0);
  truckRig.covertCrewRoot.visible = false;
  truckRig.legalCargoRoot.visible = true;
  root.add(truckRig.root);

  // Cryo freeze dome rig positioned over the parked bay spot
  const stasisRig = buildStasisFreezeRig(materials, -1.2);
  stasisRig.root.scale.setScalar(0.86);
  root.add(stasisRig.root);

  // Mastermind Dispatch Console Desk on the right
  const consoleGroup = new THREE.Group();
  consoleGroup.position.set(5.2, 0.08, 1.15);
  consoleGroup.rotation.y = -0.45;

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.35, 1.25),
    materials.createToonMaterial(0x1e1b4b)
  );
  desk.position.y = 0.675;
  addAnimeInkEdges(desk, materials.inkLineMaterial, 20);
  consoleGroup.add(desk);

  const freezeBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.36, 0.2, 16),
    materials.createToonMaterial(0x22d3ee, {
      emissive: 0x22d3ee,
      emissiveIntensity: 1.5,
    })
  );
  freezeBtn.position.set(-0.38, 1.44, 0.12);
  consoleGroup.add(freezeBtn);

  const consoleTex = createLabelBoardTexture(
    'INTRUDER DISPATCH DESK',
    'Invoice_Q4.exe (PID 3104) · FREEZE SWITCH',
    '#1E1B4B',
    '#F43F5E',
    '#FDA4AF',
    '#FACC15'
  );
  extraTextures.push(consoleTex);
  const consoleSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.25, 0.56),
    new THREE.MeshBasicMaterial({ map: consoleTex })
  );
  consoleSign.position.set(0, 0.72, 0.64);
  consoleGroup.add(consoleSign);
  root.add(consoleGroup);

  // Two Glowing Golden Master Keys (hProcess & hThread)
  const keysGroup = new THREE.Group();
  const keyProcess = buildMasterKeyToken(materials, 0xfacc15);
  keyProcess.position.set(0, 0.44, 0);
  keyProcess.scale.setScalar(0.84);
  keysGroup.add(keyProcess);

  const keyThread = buildMasterKeyToken(materials, 0x38bdf8);
  keyThread.position.set(0.32, -0.34, 0.24);
  keyThread.scale.setScalar(0.74);
  keysGroup.add(keyThread);
  keysGroup.position.set(2.0, 2.8, 0.5);
  root.add(keysGroup);

  const tetherCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.2, 2.35, 0.2),
    new THREE.Vector3(2.4, 3.85, 0.7),
    new THREE.Vector3(4.9, 1.9, 1.1)
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
  primaryAnchor.position.set(-1.2, 4.15, 0);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.8, 3.6, 0.6);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(1.8, 5.4, 12.6),
    defaultCameraTarget: new THREE.Vector3(0.3, 2.0, 0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-1.2, 0, 0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;
      stasisRig.domeUniforms.uTime.value = timeSec;

      // Phase 1 (0..4.8s): Official armored bank truck rolls into garage bay
      const rollProg = easeOutCubic(t / 4.6);
      const truckX = THREE.MathUtils.lerp(-6.2, -1.2, rollProg);
      truckRig.root.position.set(
        truckX,
        0.1 + (t < 4.6 ? Math.abs(Math.sin(t * 10)) * 0.03 : 0),
        0
      );
      for (const w of truckRig.wheels) {
        w.rotation.z = -rollProg * 7.5;
      }

      // Cutaway mode exposes gleaming legal gold crates still inside the frozen truck
      const openCutaway = cutawayMode === 'OPEN';
      truckRig.cutawaySidePanel.visible = !openCutaway;
      truckRig.cutawaySideMaterial.opacity = openCutaway ? 0.08 : 1.0;

      // Phase 2 (4.6..10s): Freeze switch slams down; cyan stasis dome locks truck motionless
      const freezeProg = easeOutCubic((t - 4.6) / 1.4);
      const domeMult =
        cutawayMode === 'OPEN' ? 0.35 : cutawayMode === 'SEALED' ? 1.15 : 0.92;
      stasisRig.domeUniforms.uOpacity.value = Math.min(1, freezeProg * domeMult);
      stasisRig.domeMesh.visible = freezeProg > 0.02;
      stasisRig.runeRingOuter.rotation.z = timeSec * 0.45;
      stasisRig.runeRingInner.rotation.z = -timeSec * 0.65;
      (stasisRig.runeRingOuter.material as THREE.MeshBasicMaterial).opacity =
        freezeProg * 0.85;
      (stasisRig.runeRingInner.material as THREE.MeshBasicMaterial).opacity =
        freezeProg * 0.72;
      for (const shard of stasisRig.frostShards) {
        shard.mesh.visible = freezeProg > 0.08;
        shard.mesh.position.set(
          shard.basePos.x,
          shard.basePos.y + Math.sin(timeSec * 2.2 + shard.phase) * 0.14,
          shard.basePos.z
        );
      }
      freezeBtn.position.y = t >= 4.6 && t <= 6.2 ? 1.32 : 1.44;

      // Phase 3 (9.5..15s): Two golden master keys glide from frozen truck to desk
      const keyProg = easeInOutQuad((t - 9.4) / 2.8);
      const keyArcX = THREE.MathUtils.lerp(-0.2, 4.4, keyProg);
      const keyArcY =
        2.6 + Math.sin(keyProg * Math.PI) * 1.15 + Math.sin(timeSec * 3.0) * 0.1;
      keysGroup.position.set(keyArcX, keyArcY, 0.75);
      keysGroup.visible = t > 8.8 || cutawayMode === 'OPEN';
      keyProcess.rotation.y = timeSec * 1.6;
      keyThread.rotation.y = -timeSec * 1.9;
      tetherMesh.visible = t > 8.8 || cutawayMode === 'OPEN';

      primaryAnchor.position.set(truckX, 4.15, 0);
      secondaryAnchor.position.set(
        Math.max(1.4, keyArcX),
        keyArcY + 0.9,
        0.75
      );

      return {
        glitchIntensity: t > 4.6 && t < 9.6 ? 0.35 : 0.12,
        magicDustIntensity: 0,
        stasisIntensity: freezeProg,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
      (stasisRig.domeMesh.material as THREE.Material).dispose();
    },
  };
}

// ============================================================================
// SCENE 2: STEP #2 — Checking Cargo Manifest & Emptying All Legal Bank Gold
// ============================================================================
function buildHollowCargoUnmapScene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0x22d3ee, 14.5));

  const truckRig = buildArmoredBankTruck(materials, isSoftwareGl);
  truckRig.root.position.set(-1.2, 0.05, 0);
  truckRig.covertCrewRoot.visible = false;
  root.add(truckRig.root);

  // Rear-mounted cantilevered Cargo Manifest X-Ray Gantry (keeps truck side 100% clear)
  const gantryGroup = new THREE.Group();
  gantryGroup.position.set(-1.2, 0, 0);
  const archMat = materials.createToonMaterial(0x1e293b);
  for (const lx of [-2.4, 1.6]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.46, 5.2, 0.46), archMat);
    leg.position.set(lx, 2.6, -2.75);
    addAnimeInkEdges(leg, materials.inkLineMaterial, 20);
    gantryGroup.add(leg);
  }
  const crossBeam = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.52, 0.72),
    archMat
  );
  crossBeam.position.set(-0.4, 5.15, -2.75);
  addAnimeInkEdges(crossBeam, materials.inkLineMaterial, 20);
  gantryGroup.add(crossBeam);

  const scanBoom = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.34, 3.2),
    archMat
  );
  scanBoom.position.set(-0.4, 5.05, -1.2);
  addAnimeInkEdges(scanBoom, materials.inkLineMaterial, 20);
  gantryGroup.add(scanBoom);

  const pebSignTex = createLabelBoardTexture(
    'CARGO MANIFEST X-RAY',
    'PEB+0x10 · NtUnmapViewOfSection(0x00400000)',
    '#0B1120',
    '#22D3EE',
    '#67E8F9',
    '#FACC15'
  );
  extraTextures.push(pebSignTex);
  const pebSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 1.02),
    new THREE.MeshBasicMaterial({ map: pebSignTex })
  );
  pebSign.position.set(1.25, 5.6, -2.35);
  gantryGroup.add(pebSign);
  root.add(gantryGroup);

  const pebScanRig = createScanConeMaterial();
  const pebScanCone = new THREE.Mesh(
    new THREE.ConeGeometry(2.55, 4.6, 24, 1, true),
    pebScanRig.material
  );
  pebScanCone.position.set(-1.7, 2.75, 0);
  root.add(pebScanCone);

  const hollowWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.6, 1.75, 1.85)),
    new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.85,
    })
  );
  hollowWire.position.set(-2.15, 1.95, 0);
  root.add(hollowWire);

  // Rear unloading ramp behind truck
  const ramp = new THREE.Mesh(
    new THREE.BoxGeometry(5.8, 0.14, 2.1),
    materials.createToonMaterial(0x334155)
  );
  ramp.position.set(-6.1, 0.12, 0);
  addAnimeInkEdges(ramp, materials.inkLineMaterial, 20);
  root.add(ramp);

  const railStripe = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.04, 0.25),
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
      toneMapped: false,
    })
  );
  railStripe.position.set(-6.1, 0.21, 0);
  root.add(railStripe);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.4, 3.8, 0);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-5.4, 2.35, 0.2);
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

      const sweepX = -1.7 + Math.sin(timeSec * 2.1) * 1.25;
      pebScanCone.position.x = sweepX;
      pebScanRig.uniforms.uTrustedLock.value = t > 10.2 ? 0.85 : 0.15;

      // Rear blast doors swing open right before gold crates unload
      const doorOpen = easeOutCubic((t - 3.6) / 1.2);
      truckRig.rearDoorLeftPivot.rotation.y = -doorOpen * 2.25;
      truckRig.rearDoorRightPivot.rotation.y = doorOpen * 2.25;

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

      // Slide all real legal gold crates out the rear doors
      const extractProg = easeInOutQuad((t - 4.6) / 5.6);
      for (let i = 0; i < truckRig.legalCrates.length; i += 1) {
        const crateEntry = truckRig.legalCrates[i];
        const crateT = clamp01(extractProg * 1.4 - i * 0.12);
        crateEntry.group.position.lerpVectors(
          crateEntry.insidePos,
          crateEntry.unloadedPos,
          crateT
        );
        crateEntry.group.position.x -= crateT * 1.6;
        crateEntry.group.position.y += Math.sin(crateT * Math.PI) * 0.32;
        crateEntry.group.scale.setScalar(
          Math.max(0.01, 1 - Math.max(0, crateT - 0.65) * 2.8)
        );
        crateEntry.group.visible = crateT < 0.98;
      }

      hollowWire.visible = extractProg > 0.25 && openCutaway > 0.5;
      (hollowWire.material as THREE.LineBasicMaterial).opacity =
        0.25 + extractProg * 0.7;

      secondaryAnchor.position.set(-4.8 - extractProg * 1.4, 2.5, 0.25);

      return {
        glitchIntensity: t > 4.6 && t < 10.6 ? 0.45 : 0.15,
        magicDustIntensity: 0,
        stasisIntensity: 0.55,
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
// SCENE 3: STEP #3 — Real Armored Bank Truck Secret Bay & Covert Crew Boarding
// ============================================================================
function buildRwxVaultInjectScene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0xf43f5e, 14.5));

  // Garage floor road lane
  const lane = new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.1, 5.4),
    materials.createToonMaterial(0xffffff, { map: materials.roadSurfaceTexture })
  );
  lane.position.set(-0.8, 0.05, 0);
  lane.receiveShadow = true;
  root.add(lane);

  // Real Emptied Armored Bank Truck parked in the loading bay!
  const truckRig = buildArmoredBankTruck(materials, isSoftwareGl);
  truckRig.root.position.set(1.2, 0.1, 0);
  truckRig.legalCargoRoot.visible = false; // Legal bank gold already emptied in Step #2!
  truckRig.covertCrewRoot.visible = true;
  root.add(truckRig.root);

  // Rear Boarding Ramp aligned directly to truck's rear blast doors
  const ramp = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 0.14, 2.2),
    materials.createToonMaterial(0x1e293b)
  );
  ramp.position.set(-4.35, 0.58, 0);
  ramp.rotation.z = 0.21;
  addAnimeInkEdges(ramp, materials.inkLineMaterial, 20);
  root.add(ramp);

  const rampGlowEdge = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 0.05, 0.14),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false })
  );
  rampGlowEdge.position.set(-4.35, 0.67, 1.02);
  rampGlowEdge.rotation.z = 0.21;
  root.add(rampGlowEdge);

  // Glowing Secret Unlocked Compartment Frame INSIDE the emptied truck cargo bay
  const secretBayFrame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.85, 1.72, 1.92)),
    new THREE.LineBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.92,
    })
  );
  secretBayFrame.position.set(0.15, 2.02, 0);
  root.add(secretBayFrame);

  const secretBayFloorGlow = new THREE.Mesh(
    new THREE.BoxGeometry(3.75, 0.08, 1.84),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.45,
      toneMapped: false,
    })
  );
  secretBayFloorGlow.position.set(0.15, 1.18, 0);
  root.add(secretBayFloorGlow);

  // Rear-mounted cantilevered Garage Tamper Sensor Arch (keeps truck cutaway 100% unobstructed!)
  const sensorArch = new THREE.Group();
  sensorArch.position.set(0.8, 0, 0);
  const archMat = materials.createToonMaterial(0x1e293b);
  for (const px of [-2.2, 2.2]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.42, 4.95, 0.42), archMat);
    post.position.set(px, 2.475, -2.8);
    addAnimeInkEdges(post, materials.inkLineMaterial, 20);
    sensorArch.add(post);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.46, 0.65), archMat);
  beam.position.set(0, 4.92, -2.8);
  addAnimeInkEdges(beam, materials.inkLineMaterial, 20);
  sensorArch.add(beam);

  const cantileverArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.3, 3.0),
    archMat
  );
  cantileverArm.position.set(0, 4.85, -1.35);
  addAnimeInkEdges(cantileverArm, materials.inkLineMaterial, 20);
  sensorArch.add(cantileverArm);

  const baySignTex = createLabelBoardTexture(
    'SECRET CARGO BAY · COVERT CREW',
    'VirtualAllocEx (RWX 0x40) + WriteProcessMemory',
    '#18181B',
    '#F43F5E',
    '#FFE4E6',
    '#FDE68A'
  );
  extraTextures.push(baySignTex);
  const baySign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 1.0),
    new THREE.MeshBasicMaterial({ map: baySignTex })
  );
  baySign.position.set(0.35, 5.58, -2.4);
  sensorArch.add(baySign);

  const tamperBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 14, 10),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, toneMapped: false })
  );
  tamperBeacon.position.set(0, 4.42, 0);
  sensorArch.add(tamperBeacon);

  const tamperRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.06, 8, 36),
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
      toneMapped: false,
    })
  );
  tamperRing.rotation.x = Math.PI / 2;
  tamperRing.position.set(0, 4.42, 0);
  sensorArch.add(tamperRing);
  root.add(sensorArch);

  // Floating 3D Callout anchors (positioned cleanly away from overhead signboard)
  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(3.2, 3.25, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-4.0, 2.7, 0.8);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.8, 5.0, 11.8),
    defaultCameraTarget: new THREE.Vector3(-0.8, 1.9, 0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.4, 0, 0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;

      // Phase 1 (0..4.8s): Secret unlocked bay expands inside emptied truck
      const bayProg = easeOutCubic(t / 3.4);
      secretBayFrame.scale.set(
        Math.max(0.05, bayProg),
        Math.max(0.05, bayProg),
        Math.max(0.05, bayProg)
      );
      secretBayFloorGlow.scale.set(
        Math.max(0.05, bayProg),
        1,
        Math.max(0.05, bayProg)
      );

      // Rear blast doors open during Phases 1-2 and seal shut in Phase 3
      const doorOpen =
        t < 10.6
          ? easeOutCubic(t / 1.2)
          : 1 - easeInOutQuad((t - 10.6) / 1.8);
      truckRig.rearDoorLeftPivot.rotation.y = -doorOpen * 2.25;
      truckRig.rearDoorRightPivot.rotation.y = doorOpen * 2.25;

      // Side armor X-ray cutaway controlled by Cutaway button (AUTO shows interior during loading, then peeks)
      const openCutaway =
        cutawayMode === 'OPEN'
          ? 1
          : cutawayMode === 'SEALED'
          ? 0
          : t < 11.8
          ? 1
          : 0.45;
      truckRig.cutawaySidePanel.visible = openCutaway < 0.85;
      truckRig.cutawaySideMaterial.opacity = Math.max(0.08, 1 - openCutaway * 0.92);

      // Phase 2 (4.6..10.6s): Covert operatives + crimson mission crate march up ramp into truck!
      const boardProg = easeInOutQuad((t - 4.4) / 5.4);
      for (let i = 0; i < truckRig.covertOperatives.length; i += 1) {
        const op = truckRig.covertOperatives[i];
        const opT = clamp01(boardProg * 1.3 - i * 0.14);
        op.group.position.lerpVectors(op.alleyPos, op.insidePos, opT);
        // Smooth walking stride bounce & arm swing while boarding
        const walking = opT > 0.02 && opT < 0.96;
        if (walking) {
          op.group.position.y += Math.abs(Math.sin(timeSec * 9 + i)) * 0.12;
          op.leftArm.rotation.x = Math.sin(timeSec * 9 + i) * 0.55;
          op.rightArm.rotation.x = -Math.sin(timeSec * 9 + i) * 0.55;
        } else {
          op.leftArm.rotation.x = 0;
          op.rightArm.rotation.x = 0;
        }
      }

      // Crimson Beacon Mission Crate glides inside right alongside the crew
      const crateT = clamp01(boardProg * 1.2 - 0.18);
      truckRig.beaconCoreCrate.group.position.lerpVectors(
        truckRig.beaconCoreCrate.alleyPos,
        truckRig.beaconCoreCrate.insidePos,
        crateT
      );
      if (crateT > 0.02 && crateT < 0.96) {
        truckRig.beaconCoreCrate.group.position.y +=
          Math.sin(crateT * Math.PI) * 0.35;
      }

      // Crimson interior aura lights up as crew boards
      truckRig.interiorGlowLight.intensity = 0.6 + boardProg * 2.8;
      (truckRig.interiorBeaconGlowMesh.material as THREE.MeshBasicMaterial).opacity =
        0.06 + boardProg * 0.32;

      // Phase 3 (10.6..15s): Garage tamper sensor pulses amber (Sysmon EID 10)
      const alertWave = ((t - 10.4) % 2.1) / 2.1;
      const alertActive = t > 10.4;
      tamperRing.visible = alertActive;
      tamperRing.scale.setScalar(0.5 + Math.max(0, alertWave) * 1.8);
      (tamperRing.material as THREE.MeshBasicMaterial).opacity =
        Math.max(0, 1 - alertWave) * 0.9;
      tamperBeacon.scale.setScalar(
        alertActive ? 1 + Math.sin(timeSec * 8) * 0.22 : 0.85
      );

      // Track covert crew callout smoothly from ramp into truck
      const crewLabelX = THREE.MathUtils.lerp(-4.2, -1.4, boardProg);
      secondaryAnchor.position.set(crewLabelX, 2.75, 0.7);

      return {
        glitchIntensity: t > 4.4 && t < 10.8 ? 0.52 : 0.18,
        magicDustIntensity: 0,
        stasisIntensity: 0.15,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
    },
  };
}

// ============================================================================
// SCENE 4: STEP #4 — Real Armored Bank Truck + Holographic Cab GPS & Launch
// ============================================================================
function buildCockpitGpsHijackScene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0xfb7185, 15.5));

  // Garage Exit Runway
  const runway = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.12, 5.2),
    materials.createToonMaterial(0xffffff, { map: materials.roadSurfaceTexture })
  );
  runway.position.set(0.5, 0.06, 0);
  runway.receiveShadow = true;
  root.add(runway);

  // Real Armored Bank Truck loaded with Covert Crew, parked inside Freeze Dome
  const truckRig = buildArmoredBankTruck(materials, isSoftwareGl);
  truckRig.root.scale.setScalar(0.84);
  truckRig.root.position.set(-3.4, 0.12, 0);
  truckRig.legalCargoRoot.visible = false;
  truckRig.covertCrewRoot.visible = true;
  for (const op of truckRig.covertOperatives) {
    op.group.position.copy(op.insidePos);
  }
  truckRig.beaconCoreCrate.group.position.copy(
    truckRig.beaconCoreCrate.insidePos
  );
  truckRig.interiorGlowLight.intensity = 2.6;
  root.add(truckRig.root);

  // Cryo Stasis Dome around starting garage spot that shatters on ResumeThread
  const stasisRig = buildStasisFreezeRig(materials, -3.4);
  stasisRig.root.scale.setScalar(0.86);
  root.add(stasisRig.root);

  // Floating Holographic Cab Dashboard (Steering Wheel + GPS Dial) framed cleanly right of top-left HUD
  const cabHoloGroup = new THREE.Group();
  cabHoloGroup.position.set(2.55, 3.85, -1.55);

  const holoBack = new THREE.Mesh(
    new THREE.BoxGeometry(4.1, 1.95, 0.18),
    materials.createToonMaterial(0x0f172a, {
      transparent: true,
      opacity: 0.88,
    })
  );
  addAnimeInkEdges(holoBack, materials.inkLineMaterial, 20);
  cabHoloGroup.add(holoBack);

  const wheelPivot = new THREE.Group();
  wheelPivot.position.set(-0.98, 0.0, 0.24);
  const wheelRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.1, 10, 28),
    materials.createToonMaterial(0x1e293b)
  );
  addInvertedHullOutline(wheelRim, materials.inkOutlineMaterial, 1.07);
  wheelPivot.add(wheelRim);

  const wheelHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.14, 14),
    materials.createToonMaterial(0xf43f5e, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.95,
    })
  );
  wheelHub.rotation.x = Math.PI / 2;
  wheelPivot.add(wheelHub);

  for (let i = 0; i < 3; i += 1) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.62, 0.08),
      materials.createToonMaterial(0x94a3b8)
    );
    const a = (i * Math.PI * 2) / 3;
    spoke.position.set(Math.sin(a) * 0.31, Math.cos(a) * 0.31, 0);
    spoke.rotation.z = -a;
    wheelPivot.add(spoke);
  }
  cabHoloGroup.add(wheelPivot);

  // Holographic Dashboard GPS Dial
  const gpsGroup = new THREE.Group();
  gpsGroup.position.set(0.92, 0.0, 0.22);

  const gpsRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.055, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false })
  );
  gpsGroup.add(gpsRing);

  const bankPin = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.14, 0),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false })
  );
  bankPin.position.set(-0.52, 0.45, 0);
  gpsGroup.add(bankPin);

  const secretPin = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.18, 0),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false })
  );
  secretPin.position.set(0.55, 0.44, 0);
  gpsGroup.add(secretPin);

  const gpsNeedle = new THREE.Group();
  const needleMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.11, 0.78, 4),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, toneMapped: false })
  );
  needleMesh.position.y = 0.32;
  gpsNeedle.add(needleMesh);
  gpsGroup.add(gpsNeedle);
  cabHoloGroup.add(gpsGroup);

  const gpsSignTex = createLabelBoardTexture(
    'TRUCK GPS HIJACKED · SECRET ROUTE',
    'SetThreadContext (RCX -> 0x004014A0) + ResumeThread',
    '#18181B',
    '#F43F5E',
    '#FFE4E6',
    '#38BDF8'
  );
  extraTextures.push(gpsSignTex);
  const gpsSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.1, 0.88),
    new THREE.MeshBasicMaterial({ map: gpsSignTex })
  );
  gpsSign.position.set(0, 1.48, 0.06);
  cabHoloGroup.add(gpsSign);
  root.add(cabHoloGroup);

  // Overhead Tamper Alert Wave Ring (Sysmon Event ID 25)
  const alertRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.08, 8, 36),
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.9,
      toneMapped: false,
    })
  );
  alertRing.rotation.x = Math.PI / 2;
  alertRing.position.set(2.4, 3.6, 0);
  root.add(alertRing);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(2.55, 6.05, -1.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-3.4, 3.3, 0.4);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 5.4, 13.4),
    defaultCameraTarget: new THREE.Vector3(0.4, 2.2, 0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 0, 0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;
      stasisRig.domeUniforms.uTime.value = timeSec;

      // Cutaway button lets viewer see covert crew inside launching truck
      const openCutaway =
        cutawayMode === 'OPEN'
          ? 1
          : cutawayMode === 'SEALED'
          ? 0
          : 0.45;
      truckRig.cutawaySidePanel.visible = openCutaway < 0.85;
      truckRig.cutawaySideMaterial.opacity = Math.max(0.12, 1 - openCutaway * 0.88);

      // Phase 1 (0..5.2s): Steering wheel cranks & GPS needle locks onto crimson secret route
      const hijackProg = easeInOutQuad((t - 0.6) / 3.8);
      wheelPivot.rotation.z = THREE.MathUtils.lerp(0.6, -1.05, hijackProg);
      gpsNeedle.rotation.z = THREE.MathUtils.lerp(0.82, -0.82, hijackProg);

      // Phase 2 (5.2..11.2s): Cryo freeze dome shatters into flying frost shards & truck roars forward!
      const shatterProg = easeOutCubic((t - 5.2) / 1.5);
      const driveProg = easeInOutQuad((t - 5.4) / 5.4);
      const stasisOpacity = Math.max(0, 1 - shatterProg * 1.25);

      stasisRig.domeUniforms.uOpacity.value = stasisOpacity * 0.92;
      stasisRig.domeMesh.visible = stasisOpacity > 0.02;
      stasisRig.runeRingOuter.rotation.z = timeSec * 0.5;
      (stasisRig.runeRingOuter.material as THREE.MeshBasicMaterial).opacity =
        stasisOpacity * 0.85;
      (stasisRig.runeRingInner.material as THREE.MeshBasicMaterial).opacity =
        stasisOpacity * 0.7;

      for (const shard of stasisRig.frostShards) {
        const burst = shatterProg * 3.8;
        shard.mesh.visible = shatterProg < 0.96;
        shard.mesh.position.set(
          shard.basePos.x + shard.burstDir.x * burst,
          shard.basePos.y + shard.burstDir.y * burst * 0.65,
          shard.basePos.z + shard.burstDir.z * burst
        );
        shard.mesh.rotation.x = timeSec * 2 + shard.phase;
        shard.mesh.rotation.y = timeSec * 3 + shard.phase;
      }

      const truckX = THREE.MathUtils.lerp(-3.4, 4.2, driveProg);
      const isMoving = driveProg > 0.01 && driveProg < 0.99;
      truckRig.root.position.set(
        truckX,
        0.12 + (isMoving ? Math.abs(Math.sin(timeSec * 18)) * 0.045 : 0),
        0
      );
      for (const w of truckRig.wheels) {
        w.rotation.z = -driveProg * 12.5;
      }
      truckRig.speedLinesGroup.visible = driveProg > 0.04 && driveProg < 0.95;

      // Cab GPS hologram stays smoothly visible right of HUD card
      cabHoloGroup.position.y = 3.85 + Math.sin(timeSec * 2.2) * 0.08;

      // Phase 3 (10.2..15s): Amber Sysmon EID 25 tamper wave pulses above launched truck
      const alertWave = ((t - 10.0) % 2.1) / 2.1;
      const alertActive = t > 10.0;
      alertRing.visible = alertActive;
      alertRing.position.set(truckX, 3.25, 0);
      alertRing.scale.setScalar(0.55 + Math.max(0, alertWave) * 1.9);
      (alertRing.material as THREE.MeshBasicMaterial).opacity =
        Math.max(0, 1 - alertWave) * 0.92;

      secondaryAnchor.position.set(truckX - 0.5, 3.25, 0.5);

      return {
        glitchIntensity: t > 5.0 && t < 10.6 ? 0.48 : 0.16,
        magicDustIntensity: 0,
        stasisIntensity: stasisOpacity,
        brakeReleaseBoost: isMoving ? 0.85 : 0,
      };
    },
    dispose: () => {
      for (const tex of extraTextures) tex.dispose();
      (stasisRig.domeMesh.material as THREE.Material).dispose();
    },
  };
}

// ============================================================================
// SCENE 5: STEP #5 — Checkpoint Guard Gate, Courier Line & Secret Warehouse
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
  for (const op of truckRig.covertOperatives) {
    op.group.position.copy(op.insidePos);
  }
  truckRig.beaconCoreCrate.group.position.copy(
    truckRig.beaconCoreCrate.insidePos
  );
  root.add(truckRig.root);

  // Bank Checkpoint Gate + Uniformed Guard who waves the truck through
  const gateGroup = new THREE.Group();
  gateGroup.position.set(-0.6, 0.14, 0.6);
  const booth = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.7, 1.5),
    materials.createToonMaterial(0x1e293b)
  );
  booth.position.set(0, 1.35, -2.5);
  addAnimeInkEdges(booth, materials.inkLineMaterial, 20);
  gateGroup.add(booth);

  const gateGuard = buildUniformedGuard(materials, 0x1d4ed8, 0xfacc15);
  gateGuard.group.position.set(1.1, 0, -2.0);
  gateGuard.group.rotation.y = -0.35;
  gateGroup.add(gateGuard.group);

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
    'BANK CHECKPOINT · ALLOW PLATE',
    'Host Firewall Trusts Signed svchost.exe Path',
    '#052E16',
    '#10B981',
    '#6EE7B7',
    '#F8FAFC'
  );
  extraTextures.push(fwSignTex);
  const fwSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 0.82),
    new THREE.MeshBasicMaterial({ map: fwSignTex })
  );
  fwSign.position.set(0, 4.15, -2.2);
  gateGroup.add(fwSign);
  root.add(gateGroup);

  // Remote Secret Warehouse (C2 Server)
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
    'SECRET WAREHOUSE · C2 SERVER',
    '185.220.101.42:443 · GET /jquery-3.3.1.min.js',
    '#1F0914',
    '#F43F5E',
    '#FDA4AF',
    '#FDE68A'
  );
  extraTextures.push(c2SignTex);
  const c2Sign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.1, 0.88),
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

  // Control-Room Radar Dish
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
      // Guard raises right arm in salute as truck passes
      gateGuard.rightArmPivot.rotation.z = gateOpen * 2.25;

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
        glitchIntensity: c2Active ? 0.4 : 0.14,
        magicDustIntensity: 0,
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
// SCENE 6: MEMORY FORENSICS — Side-by-Side X-Ray of Two Real Armored Bank Trucks
// ============================================================================
function buildMemoryVadDiffScene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
): BespokeSection3DScene {
  const root = new THREE.Group();
  const extraTextures: THREE.Texture[] = [];

  root.add(createAnimeFloorGrid(materials, 0x38bdf8, 16.0));

  // LEFT PLATFORM: Official Factory Bank Truck (Clean Signed On-Disk SEC_IMAGE)
  const leftBay = new THREE.Mesh(
    new THREE.BoxGeometry(7.0, 0.22, 4.4),
    materials.createToonMaterial(0x0c4a6e)
  );
  leftBay.position.set(-4.6, 0.11, 0);
  addAnimeInkEdges(leftBay, materials.inkLineMaterial, 20);
  root.add(leftBay);

  const factoryTruck = buildArmoredBankTruck(materials, isSoftwareGl);
  factoryTruck.root.scale.setScalar(0.76);
  factoryTruck.root.position.set(-4.6, 0.22, 0);
  factoryTruck.legalCargoRoot.visible = true;
  factoryTruck.covertCrewRoot.visible = false;
  root.add(factoryTruck.root);

  const diskSignTex = createLabelBoardTexture(
    'FACTORY TRUCK · CLEAN GOLD',
    'Signed Disk svchost.exe (SEC_IMAGE · R-X / RW-)',
    '#082F49',
    '#38BDF8',
    '#E0F2FE',
    '#7DD3FC'
  );
  extraTextures.push(diskSignTex);
  const diskSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 0.92),
    new THREE.MeshBasicMaterial({ map: diskSignTex })
  );
  diskSign.position.set(-4.6, 4.45, -1.9);
  root.add(diskSign);

  // RIGHT PLATFORM: Hijacked Highway Bank Truck (Tampered Live RAM MEM_PRIVATE RWX)
  const rightBay = new THREE.Mesh(
    new THREE.BoxGeometry(7.0, 0.22, 4.4),
    materials.createToonMaterial(0x4c0519)
  );
  rightBay.position.set(4.6, 0.11, 0);
  addAnimeInkEdges(rightBay, materials.inkLineMaterial, 20);
  root.add(rightBay);

  const highwayTruck = buildArmoredBankTruck(materials, isSoftwareGl);
  highwayTruck.root.scale.setScalar(0.76);
  highwayTruck.root.position.set(4.6, 0.22, 0);
  highwayTruck.legalCargoRoot.visible = false;
  highwayTruck.covertCrewRoot.visible = true;
  for (const op of highwayTruck.covertOperatives) {
    op.group.position.copy(op.insidePos);
  }
  highwayTruck.beaconCoreCrate.group.position.copy(
    highwayTruck.beaconCoreCrate.insidePos
  );
  highwayTruck.interiorGlowLight.intensity = 2.8;
  root.add(highwayTruck.root);

  const ramSignTex = createLabelBoardTexture(
    'HIGHWAY TRUCK · COVERT CREW',
    'Live RAM 0x00400000 (MEM_PRIVATE · RWX 0x40)',
    '#2A0A14',
    '#F43F5E',
    '#FFE4E6',
    '#FDE68A'
  );
  extraTextures.push(ramSignTex);
  const ramSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 0.92),
    new THREE.MeshBasicMaterial({ map: ramSignTex })
  );
  ramSign.position.set(4.6, 4.45, -1.9);
  root.add(ramSign);

  // Sweeping Golden Forensic X-Ray Comparison Beam spanning BOTH trucks!
  const scannerGroup = new THREE.Group();
  const scanBeam = new THREE.Mesh(
    new THREE.BoxGeometry(16.2, 0.1, 3.6),
    new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.78,
      toneMapped: false,
    })
  );
  scannerGroup.add(scanBeam);
  scannerGroup.position.set(0, 1.8, 0);
  root.add(scannerGroup);

  // Top Central Mismatch Proof Signboard
  const diffTex = createLabelBoardTexture(
    'SAME PLATE · SWAPPED INTERIOR',
    'Sysmon EID 25 & PE-Sieve: Disk != Live RAM',
    '#18181B',
    '#FACC15',
    '#FDE047',
    '#FDA4AF'
  );
  extraTextures.push(diffTex);
  const diffSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 0.96),
    new THREE.MeshBasicMaterial({ map: diffTex })
  );
  diffSign.position.set(0, 5.55, -1.1);
  root.add(diffSign);

  // Clean Floating 3D Callout Anchors right over each truck roof (well below overhead 3D signboards!)
  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-4.6, 2.75, 1.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(4.6, 2.75, 1.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0, 6.2, 14.8),
    defaultCameraTarget: new THREE.Vector3(0, 1.9, 0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 0, 0),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const t = timeSec % 15;

      // Golden X-ray beam sweeps smoothly across both trucks vertically
      const scanY = 0.65 + ((Math.sin(timeSec * 1.55) + 1) * 0.5) * 2.4;
      scannerGroup.position.y = scanY;

      // Highway truck wheels subtly spin (rolling down the highway!)
      for (const w of highwayTruck.wheels) {
        w.rotation.z = -timeSec * 3.2;
      }

      // Cutaway mode: AUTO opens side armor during X-ray sweep so user compares gold vs covert crew!
      const openCutaway =
        cutawayMode === 'OPEN'
          ? 1
          : cutawayMode === 'SEALED'
          ? 0
          : t > 3.2
          ? 1
          : 0.25;
      factoryTruck.cutawaySidePanel.visible = openCutaway < 0.85;
      factoryTruck.cutawaySideMaterial.opacity = Math.max(
        0.08,
        1 - openCutaway * 0.92
      );
      highwayTruck.cutawaySidePanel.visible = openCutaway < 0.85;
      highwayTruck.cutawaySideMaterial.opacity = Math.max(
        0.08,
        1 - openCutaway * 0.92
      );

      // Subtle crimson interior pulse on the hijacked highway truck
      highwayTruck.interiorGlowLight.intensity =
        2.2 + Math.sin(timeSec * 5.0) * 0.8;
      (
        highwayTruck.interiorBeaconGlowMesh.material as THREE.MeshBasicMaterial
      ).opacity = 0.24 + Math.sin(timeSec * 5.0) * 0.1;

      return {
        glitchIntensity: t > 4.6 ? 0.45 : 0.15,
        magicDustIntensity: 0,
        stasisIntensity: 0.1,
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
      return buildFrozenStageGuardScene(materials, isSoftwareGl);
    case 'hollow-cargo-unmap':
      return buildHollowCargoUnmapScene(materials, isSoftwareGl);
    case 'rwx-vault-inject':
      return buildRwxVaultInjectScene(materials, isSoftwareGl);
    case 'cockpit-gps-hijack':
      return buildCockpitGpsHijackScene(materials, isSoftwareGl);
    case 'firewall-c2-bridge':
      return buildFirewallC2BridgeScene(materials, isSoftwareGl);
    case 'memory-vad-diff':
      return buildMemoryVadDiffScene(materials, isSoftwareGl);
  }
}
