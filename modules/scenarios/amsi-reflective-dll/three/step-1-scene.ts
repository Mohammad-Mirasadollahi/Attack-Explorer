import * as THREE from 'three';
import {
  addAnimeInkEdges,
  addInvertedHullOutline,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
} from '@/components/three/step-stage-primitives';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateAmsiStep1State } from '../choreography';

/**
 * Standalone 3D Scene: AMSI Step 1 — Detective Drafting Desk, Base64 Decode Roller,
 * Rail-Mounted Brass Magnifier & Pre-Bypass Paper-Tape Telegraph (EID 4104).
 */
export function buildAmsiStep1Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x1e293b,
    floorTrimHex: 0x38bdf8,
    wallColor: 0x1e3a5f,
    pillarColor: 0x0f172a,
    signTitle: 'EXPORT ADDRESS DRAFTING BENCH',
    signSubtitle: 'LOADLIBRARY + GETPROCADDRESS -> 0x7FF9C2142840 | EID 4104',
    signBgHex: '#0F172A',
    signBorderHex: '#38BDF8',
    signTitleHex: '#F8FAFC',
    signSubHex: '#38BDF8',
    width: 14.4,
    depth: 9.8,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // 1) Heavy Drafting Workbench with Brass Coordinate Rails
  const benchGroup = new THREE.Group();
  benchGroup.position.set(-1.1, 0, 0.2);
  benchGroup.add(createContactDisc(materials, 3.3));

  const legMat = materials.createToonMaterial(0x334155);
  const topMat = materials.createToonMaterial(0x475569);
  const brassMat = materials.createToonMaterial(0xf59e0b, {
    emissive: 0xb45309,
    emissiveIntensity: 0.22,
  });

  for (const [lx, lz] of [
    [-2.5, -1.1],
    [2.5, -1.1],
    [-2.5, 1.1],
    [2.5, 1.1],
  ]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.35, 0.24), legMat);
    leg.position.set(lx, 0.675, lz);
    leg.castShadow = true;
    addAnimeInkEdges(leg, materials.inkLineMaterial, 24);
    benchGroup.add(leg);
  }

  const tabletop = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.22, 2.7), topMat);
  tabletop.position.set(0, 1.44, 0);
  tabletop.castShadow = true;
  tabletop.receiveShadow = true;
  addAnimeInkEdges(tabletop, materials.inkLineMaterial, 24);
  benchGroup.add(tabletop);

  // Translucent Cutaway Glass Dust Hood over Drafting Table
  const hoodMat = materials.createToonMaterial(0x7dd3fc, {
    transparent: true,
    opacity: 0.22,
  });
  const cutawayHood = new THREE.Group();
  const hoodTop = new THREE.Mesh(new THREE.BoxGeometry(5.3, 1.45, 2.4), hoodMat);
  hoodTop.position.set(0, 2.35, 0);
  addAnimeInkEdges(hoodTop, materials.inkLineMaterial, 24);
  cutawayHood.add(hoodTop);
  benchGroup.add(cutawayHood);

  // Base64 Encoded Parchment Scroll unrolling on Left side of bench
  const scrollGroup = new THREE.Group();
  scrollGroup.position.set(-1.75, 1.62, 0.3);
  const scrollSpindle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 1.35, 16),
    brassMat
  );
  scrollSpindle.rotation.x = Math.PI / 2;
  addAnimeInkEdges(scrollSpindle, materials.inkLineMaterial, 24);
  scrollGroup.add(scrollSpindle);

  const scrollTex = createPlaqueTexture(
    'ENCODED COMMAND',
    '-Enc JABhAD0A...',
    '#FEF3C7',
    '#D97706',
    '#0F172A'
  );
  textures.push(scrollTex);
  const scrollSheet = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.04, 1.2),
    new THREE.MeshBasicMaterial({ map: scrollTex })
  );
  scrollSheet.position.set(0.75, -0.02, 0);
  scrollGroup.add(scrollSheet);
  benchGroup.add(scrollGroup);

  // Export Address Plaque on Right side of bench (amsi.dll!AmsiScanBuffer)
  const plaqueTex = createPlaqueTexture(
    'AMSI.DLL EXPORT TABLE',
    '0x7FF9C2142840',
    '#0F172A',
    '#38BDF8',
    '#FACC15'
  );
  textures.push(plaqueTex);
  const plaqueBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.14, 1.35),
    materials.createToonMaterial(0x1e293b)
  );
  plaqueBase.position.set(1.15, 1.62, 0.05);
  addAnimeInkEdges(plaqueBase, materials.inkLineMaterial, 24);
  benchGroup.add(plaqueBase);

  const plaqueFace = new THREE.Mesh(
    new THREE.PlaneGeometry(2.14, 1.18),
    new THREE.MeshBasicMaterial({ map: plaqueTex })
  );
  plaqueFace.rotation.x = -Math.PI / 2;
  plaqueFace.position.set(1.15, 1.7, 0.05);
  benchGroup.add(plaqueFace);

  // Twin horizontal rails + sliding Brass Address Magnifier Gantry
  for (const rz of [-1.05, 1.05]) {
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 5.2, 12),
      brassMat
    );
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 2.55, rz);
    benchGroup.add(rail);
  }

  const magnifierCarriage = new THREE.Group();
  magnifierCarriage.position.set(-2.0, 2.55, 0.05);
  const carriageBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.24, 2.25),
    materials.createToonMaterial(0x0284c7)
  );
  addAnimeInkEdges(carriageBar, materials.inkLineMaterial, 24);
  magnifierCarriage.add(carriageBar);

  const lensRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.085, 12, 28),
    brassMat
  );
  lensRing.rotation.x = Math.PI / 2;
  lensRing.position.set(0, -0.35, 0);
  addInvertedHullOutline(lensRing, materials.inkOutlineMaterial, 1.06);
  magnifierCarriage.add(lensRing);

  const lensGlassMat = materials.createToonMaterial(0x38bdf8, {
    emissive: 0x0284c7,
    emissiveIntensity: 0.75,
    transparent: true,
    opacity: 0.45,
  });
  const lensGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.52, 0.06, 24),
    lensGlassMat
  );
  lensGlass.position.set(0, -0.35, 0);
  magnifierCarriage.add(lensGlass);

  const lockBeamMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const lockBeam = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 0.65, 24, 1, true),
    lockBeamMat
  );
  lockBeam.position.set(0, -0.68, 0);
  magnifierCarriage.add(lockBeam);
  benchGroup.add(magnifierCarriage);

  root.add(benchGroup);

  // 2) Pre-Bypass Paper-Tape Telegraph Printer (PowerShell EID 4104) on Right Stand
  const printerGroup = new THREE.Group();
  printerGroup.position.set(3.85, 0, -0.3);
  printerGroup.add(createContactDisc(materials, 1.65));

  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 2.1, 1.25),
    materials.createToonMaterial(0x1e293b)
  );
  stand.position.y = 1.05;
  stand.castShadow = true;
  addAnimeInkEdges(stand, materials.inkLineMaterial, 24);
  printerGroup.add(stand);

  const printerBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 1.15, 1.4),
    materials.createToonMaterial(0x0f766e)
  );
  printerBody.position.y = 2.68;
  printerBody.castShadow = true;
  addAnimeInkEdges(printerBody, materials.inkLineMaterial, 24);
  printerGroup.add(printerBody);

  const eidTex = createPlaqueTexture(
    'POWERSHELL EID 4104',
    'PLAINTEXT LOGGED',
    '#052E16',
    '#10B981',
    '#6EE7B7'
  );
  textures.push(eidTex);
  const eidScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.55, 0.62),
    new THREE.MeshBasicMaterial({ map: eidTex })
  );
  eidScreen.position.set(0, 2.78, 0.72);
  printerGroup.add(eidScreen);

  const lampMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.3,
  });
  const witnessLamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 14, 12),
    lampMat
  );
  witnessLamp.position.set(0, 3.42, 0);
  addInvertedHullOutline(witnessLamp, materials.inkOutlineMaterial, 1.08);
  printerGroup.add(witnessLamp);

  // Unrolling Paper-Tape Ribbon
  const tapeMat = materials.createToonMaterial(0xfef9c3, {
    emissive: 0xfde047,
    emissiveIntensity: 0.2,
  });
  const paperTape = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 1.8, 0.04),
    tapeMat
  );
  paperTape.position.set(0, 1.95, 0.78);
  addAnimeInkEdges(paperTape, materials.inkLineMaterial, 24);
  printerGroup.add(paperTape);

  root.add(printerGroup);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-0.2, 3.25, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.85, 3.75, -0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.8, 4.6, 8.8),
    defaultCameraTarget: new THREE.Vector3(0.4, 1.9, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.4, 2.1, 0.1),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode) => {
      const s = evaluateAmsiStep1State(timeSec / 12, cutawayMode);
      scrollSheet.scale.x = 0.2 + s.scrollUnroll * 0.85;
      scrollSheet.position.x = 0.16 + s.scrollUnroll * 0.62;
      scrollSpindle.rotation.y = s.scrollUnroll * Math.PI * 2.5;

      magnifierCarriage.position.x = s.magnifierX;
      lockBeamMat.opacity = 0.12 + s.addressLocked * 0.42;
      lensGlassMat.color.setHex(s.addressLocked > 0.5 ? 0xfacc15 : 0x38bdf8);
      lensGlassMat.emissive.setHex(s.addressLocked > 0.5 ? 0xd97706 : 0x0284c7);

      paperTape.scale.y = Math.max(0.08, s.paperTapeProgress);
      paperTape.position.y = 2.28 - s.paperTapeProgress * 0.82;
      lampMat.emissiveIntensity = 0.25 + s.paperTapeProgress * 1.4;

      cutawayHood.position.y = s.cutawayLift * 1.65;
      cutawayHood.visible = s.cutawayLift < 0.96;

      return {
        glitchIntensity: s.addressLocked * 0.18,
        magicDustIntensity: 0.22 + s.paperTapeProgress * 0.25,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
