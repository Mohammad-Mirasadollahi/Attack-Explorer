import * as THREE from 'three';
import type {
  Anime3DSceneKind,
  StandardCutawayMode,
} from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  THREECX_TIMELINE_DURATION_SEC,
  evaluateThreeCxChoreography,
} from '../choreography';
import {
  buildCleanroomAndOfficeFloor,
  buildCleanroomConveyorAndSabotageArm,
  buildDesktopPhoneConsole,
  buildPublicIconGalleryWall,
  buildTraderCredentialDeskAndVipVault,
  createCleanroomSignTexture,
} from './scene-builders';

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(x: number): number {
  const c = clamp01(x);
  return 1 - Math.pow(1 - c, 3);
}

/**
 * 1) OVERVIEW HERO FILM (`threecx-cleanroom-briefing`)
 * Full 5-Act Cleanroom Conveyor -> Gold Hologram Press -> Phone Cutaway -> Icon Gallery -> VIP Vault.
 */
function buildThreeCxBriefingScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildCleanroomAndOfficeFloor(materials, 0x10b981);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  // Left Cleanroom Station: Conveyor + Covert Sabotage Arm + Gold Hologram Press + Inspector
  const cleanroom = buildCleanroomConveyorAndSabotageArm(materials);
  cleanroom.group.position.set(-3.4, 0, 0.1);
  textures.push(...cleanroom.textures);
  root.add(cleanroom.group);

  // Right Trader Desk Station: Walnut Desk + Browser Keycard Tray + Selective VIP Vault
  const desk = buildTraderCredentialDeskAndVipVault(materials);
  desk.group.position.set(2.85, 0, 0.1);
  root.add(desk.group);

  // Far-Right Rear: Public Art-Gallery Icon Wall (z = -2.35)
  const gallery = buildPublicIconGalleryWall(materials);
  gallery.group.position.set(5.4, 0, -2.35);
  gallery.group.rotation.y = -0.32;
  textures.push(...gallery.textures);
  root.add(gallery.group);

  // Hero Phone Console gliding from Cleanroom Conveyor (-6.3) -> Press (-3.05) -> Trader Desk (2.25)
  const phone = buildDesktopPhoneConsole(materials);
  phone.group.position.set(-6.3, 1.18, 0.1);
  root.add(phone.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.05, 4.1, 0.1);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.85, 3.7, 0.1);
  root.add(secondaryAnchor);

  let showingEdrAlert = false;

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.3, 14.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.2, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.5, 2.2, 0.1),
    update: (timeSec, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const norm =
        (timeSec % THREECX_TIMELINE_DURATION_SEC) / THREECX_TIMELINE_DURATION_SEC;
      const f = evaluateThreeCxChoreography(norm, cutawayMode);

      // Act 1: Covert robotic sabotage arm drops rigged gear & prism inside phone BEFORE press
      cleanroom.sabotageArm.position.y = 4.1 - f.sabotageArmExtend * 0.98;
      phone.riggedGear.visible = f.riggedPartsSeated > 0.25;
      phone.amberCore.visible = f.riggedPartsSeated > 0.25;

      // Phone glides cleanly along conveyor -> under official gold press -> onto trader desk
      phone.group.position.x = -6.3 + f.phoneConveyorProgress * 8.55;

      // Act 2: Official Gold Hologram Press stamps genuine emerald-gold seal; inspector approves
      cleanroom.pressHead.position.y = 3.32 - f.hologramPressDown * 0.45;
      cleanroom.pressGlowMat.opacity = 0.2 + f.hologramPressDown * 0.65;
      phone.hologramSeal.visible = f.hologramAuthentic;
      cleanroom.inspectorWandBeam.visible =
        f.inspectorGreenPass > 0.05 && f.inspectorGreenPass < 0.98;
      cleanroom.inspectorLampMat.color.setHex(
        f.inspectorGreenPass > 0.3 ? 0x10b981 : 0x94a3b8
      );

      // Cutaway top white phone shell lifts smoothly to show internal tamper / decryption
      phone.cutawayLid.position.y = f.cutawayOpen * 0.95;
      phone.cutawayLid.rotation.z = -f.cutawayOpen * 0.18;

      // Act 3: Rigged audio gear spins, cracks prism base, unwinds amber spool into hovering radio
      phone.riggedGear.rotation.y = f.riggedGearSpin;
      phone.prismUpper.position.y = 0.84 + f.prismCoreCracked * 0.36;
      phone.amberCore.position.y = 0.72 + f.prismCoreCracked * 0.22;
      phone.cipherSpool.scale.setScalar(Math.max(0.01, f.cipherSpoolUnwound));
      phone.cipherSpool.rotation.y = timeSec * 2.8;
      phone.hoverRadio.scale.setScalar(Math.max(0.01, easeOutCubic(f.cipherSpoolUnwound)));
      phone.hoverRadio.position.y = 1.48 + Math.sin(timeSec * 3.2) * 0.08;
      phone.hoverRadio.rotation.y = timeSec * 1.4;

      // Act 4: Public Gallery icon tile #4 hit by cyan scan beam -> secret crimson strip peels off
      gallery.scanBeam.visible = f.galleryScanBeam > 0.08;
      gallery.targetTile.rotation.y = -f.hiddenStripPeeled * 0.28;
      gallery.hiddenStrip.position.y = -0.32 - f.hiddenStripPeeled * 0.34;
      gallery.hiddenStrip.position.z = 0.06 + f.hiddenStripPeeled * 0.26;
      gallery.hiddenStrip.rotation.x = f.hiddenStripPeeled * 0.48;

      // Act 5: Browser keycards siphon from desk tray into phone + selective VIP vault + EDR alert
      for (let k = 0; k < desk.keycards.length; k += 1) {
        const s = clamp01((f.keycardSiphon - k * 0.16) / 0.65);
        desk.keycards[k].position.set(
          1.25 - s * 1.85,
          1.42 + k * 0.07 + Math.sin(s * Math.PI) * 0.65,
          0.12
        );
        desk.keycards[k].rotation.z = s * 0.7;
      }
      desk.vipVault.rotation.y = timeSec * 1.1;
      desk.vipTether.visible = f.vipVaultTether > 0.15;

      const alertOn = f.edrBehavioralAlert > 0.35;
      if (alertOn !== showingEdrAlert) {
        showingEdrAlert = alertOn;
        backdrop.edrScreenMat.map = alertOn
          ? backdrop.edrAlertTex
          : backdrop.edrNormalTex;
        backdrop.edrScreenMat.needsUpdate = true;
      }
      backdrop.edrBeaconMat.color.setHex(alertOn ? 0xe11d48 : 0x10b981);

      return {
        glitchIntensity: f.edrBehavioralAlert * 0.3 + f.prismCoreCracked * 0.15,
        magicDustIntensity: f.cipherSpoolUnwound * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: f.hologramPressDown * 0.3,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

/**
 * 2) STEP #1 DIORAMA (`threecx-step1-buildsign`)
 * Cleanroom Sabotage Arm + Official Gold Hologram Press + Inspector Wave-Through.
 */
function buildThreeCxStep1Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildCleanroomAndOfficeFloor(materials, 0xf59e0b);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const cleanroom = buildCleanroomConveyorAndSabotageArm(materials);
  cleanroom.group.position.set(0, 0, 0.2);
  cleanroom.group.scale.setScalar(1.12);
  textures.push(...cleanroom.textures);
  root.add(cleanroom.group);

  const phone = buildDesktopPhoneConsole(materials);
  phone.group.position.set(-3.2, 1.32, 0.2);
  phone.group.scale.setScalar(1.12);
  root.add(phone.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.0, 4.1, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(0.4, 4.3, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.6, 3.9, 9.6),
    defaultCameraTarget: new THREE.Vector3(-0.4, 2.2, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(-0.4, 2.2, 0.2),
    update: (timeSec, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const cycle = (timeSec % 14) / 14;
      const armP =
        cycle < 0.32 ? Math.sin((cycle / 0.32) * Math.PI) : 0;
      cleanroom.sabotageArm.position.y = 4.1 - armP * 0.98;
      phone.riggedGear.visible = cycle > 0.14;
      phone.amberCore.visible = cycle > 0.14;

      const glide = easeOutCubic(clamp01((cycle - 0.32) / 0.24));
      const exitGlide = easeOutCubic(clamp01((cycle - 0.72) / 0.22));
      phone.group.position.x = -3.2 + glide * 3.6 + exitGlide * 2.5;

      const press =
        cycle >= 0.56 && cycle <= 0.72
          ? Math.sin(((cycle - 0.56) / 0.16) * Math.PI)
          : 0;
      cleanroom.pressHead.position.y = 3.32 - press * 0.45;
      cleanroom.pressGlowMat.opacity = 0.22 + press * 0.7;
      phone.hologramSeal.visible = cycle >= 0.64;

      cleanroom.inspectorWandBeam.visible = cycle >= 0.72 && cycle <= 0.94;
      cleanroom.inspectorLampMat.color.setHex(cycle >= 0.74 ? 0x10b981 : 0x94a3b8);

      const openLid =
        cutawayMode === 'OPEN'
          ? 1
          : cutawayMode === 'SEALED'
            ? 0
            : cycle < 0.32
              ? 1
              : 0;
      phone.cutawayLid.position.y = openLid * 0.92;

      return {
        glitchIntensity: armP * 0.22,
        magicDustIntensity: press * 0.45,
        stasisIntensity: 0,
        brakeReleaseBoost: press * 0.3,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

/**
 * 3) STEP #2 DIORAMA (`threecx-step2-feedface`)
 * Macro Phone Cutaway: Spinning Rigged Gear + Cracking 0xFEEDFACE Prism Core + Unwinding RC4 Spool.
 */
function buildThreeCxStep2Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildCleanroomAndOfficeFloor(materials, 0xd97706);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.9, 3.0),
    materials.createToonMaterial(0x334155)
  );
  plinth.position.set(0, 0.45, 0.2);
  addAnimeInkEdges(plinth, materials.inkLineMaterial, 24);
  root.add(plinth);

  const phone = buildDesktopPhoneConsole(materials);
  phone.group.position.set(0, 0.92, 0.2);
  phone.group.scale.setScalar(1.95);
  phone.hologramSeal.visible = true;
  root.add(phone.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-1.3, 3.2, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.3, 3.8, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.2, 4.1, 7.4),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.3, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.5, 0.2),
    update: (timeSec, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const cycle = (timeSec % 14) / 14;
      const lidOpen =
        cutawayMode === 'SEALED'
          ? 0
          : cutawayMode === 'OPEN'
            ? 1
            : easeOutCubic(clamp01(cycle / 0.22));
      phone.cutawayLid.position.y = lidOpen * 1.1;
      phone.cutawayLid.rotation.z = -lidOpen * 0.2;

      phone.riggedGear.rotation.y = timeSec * 3.8;
      const crack = easeOutCubic(clamp01((cycle - 0.2) / 0.25));
      phone.prismUpper.position.y = 0.84 + crack * 0.42;
      phone.amberCore.position.y = 0.72 + crack * 0.26;

      const unwind = easeOutCubic(clamp01((cycle - 0.42) / 0.34));
      phone.cipherSpool.scale.setScalar(Math.max(0.01, unwind));
      phone.cipherSpool.rotation.y = timeSec * 3.1;
      phone.hoverRadio.scale.setScalar(Math.max(0.01, unwind));
      phone.hoverRadio.position.y = 1.48 + Math.sin(timeSec * 3.2) * 0.08;
      phone.hoverRadio.rotation.y = timeSec * 1.6;

      return {
        glitchIntensity: crack * 0.24,
        magicDustIntensity: unwind * 0.5,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

/**
 * 4) STEP #3 DIORAMA (`threecx-step3-icondrop`)
 * Public Art-Gallery Icon Wall & Peeling Crimson Tail-Strip From Framed Tile #4.
 */
function buildThreeCxStep3Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildCleanroomAndOfficeFloor(materials, 0x0284c7);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const gallery = buildPublicIconGalleryWall(materials);
  gallery.group.position.set(1.2, 0.2, -0.6);
  gallery.group.scale.setScalar(1.3);
  textures.push(...gallery.textures);
  root.add(gallery.group);

  const phone = buildDesktopPhoneConsole(materials);
  phone.group.position.set(-2.9, 1.0, 0.8);
  phone.group.scale.setScalar(1.1);
  phone.hologramSeal.visible = true;
  phone.cutawayLid.position.y = 0.9;
  phone.hoverRadio.scale.setScalar(1);
  root.add(phone.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(1.2, 4.4, -0.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-2.9, 3.2, 0.8);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(-0.2, 3.6, 8.6),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.6, -0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.4, 2.5, 0.0),
    update: (timeSec) => {
      const cycle = (timeSec % 12) / 12;
      const beamOn = cycle > 0.14;
      const peel = easeOutCubic(clamp01((cycle - 0.34) / 0.38));

      gallery.scanBeam.visible = beamOn;
      gallery.targetTile.rotation.y = -peel * 0.32;
      gallery.hiddenStrip.position.y = -0.32 - peel * 0.42;
      gallery.hiddenStrip.position.z = 0.06 + peel * 0.32;
      gallery.hiddenStrip.rotation.x = peel * 0.55;
      phone.hoverRadio.rotation.y = timeSec * 1.8;

      return {
        glitchIntensity: peel * 0.22,
        magicDustIntensity: beamOn ? 0.35 : 0.1,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

/**
 * 5) STEP #4 DIORAMA (`threecx-step4-gopuram`)
 * Browser Keycard Siphon + Selective Crimson VIP Vault + Violet Behavioral Alert.
 */
function buildThreeCxStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildCleanroomAndOfficeFloor(materials, 0x7c3aed);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  const desk = buildTraderCredentialDeskAndVipVault(materials);
  desk.group.position.set(0.2, 0, 0.3);
  desk.group.scale.setScalar(1.25);
  root.add(desk.group);

  const phone = buildDesktopPhoneConsole(materials);
  phone.group.position.set(-0.95, 1.44, 0.35);
  phone.group.scale.setScalar(1.15);
  phone.hologramSeal.visible = true;
  phone.cutawayLid.position.y = 0.85;
  phone.hoverRadio.scale.setScalar(1);
  root.add(phone.group);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(1.6, 2.7, 0.4);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(1.6, 5.2, -0.4);
  root.add(secondaryAnchor);

  let edrAlert = false;

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 4.1, 9.6),
    defaultCameraTarget: new THREE.Vector3(0.3, 2.6, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.4, 2.8, 0.2),
    update: (timeSec) => {
      const cycle = (timeSec % 12) / 12;
      const siphon = clamp01((cycle - 0.1) / 0.45);
      for (let k = 0; k < desk.keycards.length; k += 1) {
        const s = clamp01((siphon - k * 0.18) / 0.6);
        desk.keycards[k].position.set(
          1.25 - s * 1.85,
          1.42 + k * 0.07 + Math.sin(s * Math.PI) * 0.65,
          0.12
        );
        desk.keycards[k].rotation.z = s * 0.7;
      }

      desk.vipVault.rotation.y = timeSec * 1.3;
      desk.vipTether.visible = cycle > 0.45;
      phone.hoverRadio.rotation.y = timeSec * 1.8;

      const wantAlert = cycle > 0.52;
      if (wantAlert !== edrAlert) {
        edrAlert = wantAlert;
        backdrop.edrScreenMat.map = wantAlert
          ? backdrop.edrAlertTex
          : backdrop.edrNormalTex;
        backdrop.edrScreenMat.needsUpdate = true;
      }
      backdrop.edrBeaconMat.color.setHex(wantAlert ? 0xe11d48 : 0x10b981);

      return {
        glitchIntensity: wantAlert ? 0.34 : 0.14,
        magicDustIntensity: siphon * 0.4,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

/**
 * 6) MEMORY FORENSICS DIORAMA (`threecx-memory-diff`)
 * Dual-Plinth Comparison: Clean Stock Graphics Prism vs Trojanized Prism With Glowing Amber Trailer
 * Beside Hovering Unbacked Decrypted Radio & Stage-2 Implant Core.
 */
function buildThreeCxMemoryDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const backdrop = buildCleanroomAndOfficeFloor(materials, 0xe11d48);
  textures.push(...backdrop.textures);
  root.add(backdrop.group);

  // Left Plinth: Clean Stock Crystal Prism (no hidden trailer)
  const leftPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.0, 2.2),
    materials.createToonMaterial(0x1e293b)
  );
  leftPlinth.position.set(-3.1, 0.5, 0.2);
  addAnimeInkEdges(leftPlinth, materials.inkLineMaterial, 24);
  root.add(leftPlinth);

  const cleanPrism = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.85, 0),
    materials.createToonMaterial(0x38bdf8)
  );
  cleanPrism.position.set(-3.1, 1.95, 0.2);
  addAnimeInkEdges(cleanPrism, materials.inkLineMaterial, 24);
  root.add(cleanPrism);

  const cleanTex = createCleanroomSignTexture(
    'CLEAN STOCK PRISM',
    'UNMODIFIED · CLEAN ENDING',
    '#064e3b',
    '#10b981',
    '#ecfdf5',
    '#a7f3d0'
  );
  textures.push(cleanTex);
  const cleanSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 0.55),
    new THREE.MeshBasicMaterial({ map: cleanTex })
  );
  cleanSign.position.set(-3.1, 0.55, 1.32);
  root.add(cleanSign);

  // Right Plinth: Oversized Trojanized Prism + Amber Trailer + Hovering Unbacked Radio
  const rightPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 1.0, 2.2),
    materials.createToonMaterial(0x1e293b)
  );
  rightPlinth.position.set(2.4, 0.5, 0.2);
  addAnimeInkEdges(rightPlinth, materials.inkLineMaterial, 24);
  root.add(rightPlinth);

  const trojanPrism = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.85, 0),
    new THREE.MeshToonMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.72 })
  );
  trojanPrism.position.set(1.3, 2.2, 0.2);
  addAnimeInkEdges(trojanPrism, materials.inkLineMaterial, 24);
  root.add(trojanPrism);

  const trailerBlock = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 0.72, 16),
    materials.createToonMaterial(0xf59e0b)
  );
  trailerBlock.position.set(1.3, 1.42, 0.2);
  addAnimeInkEdges(trailerBlock, materials.inkLineMaterial, 24);
  root.add(trailerBlock);

  const hoverImplant = new THREE.Group();
  hoverImplant.position.set(3.45, 2.3, 0.2);
  const impCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.55, 0),
    materials.createToonMaterial(0xe11d48)
  );
  addAnimeInkEdges(impCore, materials.inkLineMaterial, 24);
  hoverImplant.add(impCore);
  const impRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.76, 0.06, 10, 24),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
  );
  impRing.rotation.x = Math.PI / 2;
  hoverImplant.add(impRing);
  root.add(hoverImplant);

  const dirtyTex = createCleanroomSignTexture(
    'TAMPERED PRISM + FLOATING RADIO',
    'HIDDEN AMBER TRAILER -> LIVE UNBACKED CORE',
    '#450a0a',
    '#e11d48',
    '#fecdd3',
    '#fde68a'
  );
  textures.push(dirtyTex);
  const dirtySign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 0.55),
    new THREE.MeshBasicMaterial({ map: dirtyTex })
  );
  dirtySign.position.set(2.4, 0.55, 1.32);
  root.add(dirtySign);

  // Sweeping Forensic Diff Scanner Plane
  const diffBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 2.6, 2.2),
    new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    })
  );
  diffBar.position.set(0, 2.0, 0.2);
  root.add(diffBar);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.1, 3.2, 0.2);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.4, 3.5, 0.2);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.1, 4.2, 10.2),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.0, 0.2),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(1.5, 2.2, 0.2),
    update: (timeSec) => {
      cleanPrism.rotation.y = timeSec * 0.8;
      trojanPrism.rotation.y = -timeSec * 0.9;
      hoverImplant.rotation.y = timeSec * 1.6;
      hoverImplant.position.y = 2.3 + Math.sin(timeSec * 2.8) * 0.16;
      diffBar.position.x = -3.6 + (Math.sin(timeSec * 1.2) * 0.5 + 0.5) * 7.6;
      return {
        glitchIntensity: 0.24,
        magicDustIntensity: 0.42,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}

export function buildBespokeThreeCxSectionScene(
  sceneKind: Anime3DSceneKind,
  materials: AnimeMaterialLibrary,
  _isSoftwareGl: boolean
): BespokeSection3DScene {
  switch (sceneKind) {
    case 'threecx-cleanroom-briefing':
      return buildThreeCxBriefingScene(materials);
    case 'threecx-step1-buildsign':
      return buildThreeCxStep1Scene(materials);
    case 'threecx-step2-feedface':
      return buildThreeCxStep2Scene(materials);
    case 'threecx-step3-icondrop':
      return buildThreeCxStep3Scene(materials);
    case 'threecx-step4-gopuram':
      return buildThreeCxStep4Scene(materials);
    case 'threecx-memory-diff':
      return buildThreeCxMemoryDiffScene(materials);
    default:
      return buildThreeCxBriefingScene(materials);
  }
}
