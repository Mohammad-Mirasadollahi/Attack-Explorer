import * as THREE from 'three';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
} from '@/components/three/step-stage-primitives';
import {
  DNSTUN_STEP_DURATION_SEC,
  evaluateDnstunMemoryDiffState,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DNS Tunneling Memory Forensics (`dnstun-memory-entropydiff`)
 * Exclusive Room: Dual `Dnscache` & Staging-Buffer Memory Comparator Bay
 * Exclusive Props:
 *   1. Left Active 56-Char Hex Staging Buffer & `TTL=0` Dnscache Churn Bench (`0x1D840100000`, `x=-3.25`) with cutaway glass & bobbing crimson strips
 *   2. Right Hardened RPZ Sinkhole Entry Vault (`0x1D840220000`, `x=+3.25`) with static emerald `10.255.255.53` sinkhole crystal & rotating emerald net
 *   3. Sweeping Sky-Blue Memory Forensics & Zeek Reconstruction Beam
 */
export function buildDnstunMemoryDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0b1524,
    floorTrimHex: 0x38bdf8,
    wallColor: 0x15253d,
    pillarColor: 0x243b5c,
    gridColor: 0x2a4469,
    signTitle: 'MEMORY FORENSICS · STAGING BUFFER VS. RPZ SINKHOLE',
    signSubtitle: '0x1D840100000 56-CHAR HEX + TTL=0 CHURN (LEFT) VS. 0x1D840220000 RPZ LOCK (RIGHT)',
    signBgHex: '#0A192F',
    signBorderHex: '#38BDF8',
    signTitleHex: '#E0F2FE',
    signSubHex: '#7DD3FC',
    width: 15.6,
    depth: 10.6,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Active Hex Staging Buffer & TTL=0 Dnscache Churn (`x = -3.25`) ---
  const leftBench = new THREE.Group();
  leftBench.position.set(-3.25, 0, 0.2);
  root.add(leftBench);
  leftBench.add(createContactDisc(materials, 2.05, 0.018));

  const leftBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.65, 1.35, 1.75),
    materials.createToonMaterial(0x3b0a18)
  );
  leftBase.position.y = 0.675;
  addAnimeInkEdges(leftBase, materials.inkLineMaterial, 24);
  leftBench.add(leftBase);

  const leftTex = createPlaqueTexture(
    '0x1D840100000 · BUFFER',
    '56-CHAR HEX · TTL=0',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(leftTex);

  const leftSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 0.88),
    new THREE.MeshBasicMaterial({ map: leftTex })
  );
  leftSign.position.set(0, 0.68, 0.89);
  leftBench.add(leftSign);

  const churnSlips: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.14, 0.44),
      materials.createToonMaterial(0xe11d48, {
        emissive: 0xf43f5e,
        emissiveIntensity: 0.85,
      })
    );
    s.position.set(-1.05 + i * 1.05, 1.85, 0);
    addAnimeInkEdges(s, materials.inkLineMaterial, 24);
    leftBench.add(s);
    churnSlips.push(s);
  }

  // Left Cutaway Glass Hood
  const leftHoodPivot = new THREE.Group();
  leftHoodPivot.position.set(0, 2.8, -0.88);
  leftBench.add(leftHoodPivot);

  const leftHood = new THREE.Mesh(
    new THREE.BoxGeometry(3.55, 1.45, 1.75),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  leftHood.position.set(0, -0.72, 0.88);
  leftHoodPivot.add(leftHood);

  // --- PROP 2: Right Hardened RPZ Sinkhole Entry Vault (`x = +3.25`) ---
  const rightVault = new THREE.Group();
  rightVault.position.set(3.25, 0, 0.2);
  root.add(rightVault);
  rightVault.add(createContactDisc(materials, 2.05, 0.018));

  const rightBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.65, 1.35, 1.75),
    materials.createToonMaterial(0x064e3b)
  );
  rightBase.position.y = 0.675;
  addAnimeInkEdges(rightBase, materials.inkLineMaterial, 24);
  rightVault.add(rightBase);

  const rightTex = createPlaqueTexture(
    '0x1D840220000 · RPZ',
    'SINKHOLE 10.255.255.53',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(rightTex);

  const rightSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 0.88),
    new THREE.MeshBasicMaterial({ map: rightTex })
  );
  rightSign.position.set(0, 0.68, 0.89);
  rightVault.add(rightSign);

  const rpzCrystalMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.65,
  });
  const rpzCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.68, 0),
    rpzCrystalMat
  );
  rpzCrystal.position.set(0, 2.15, 0);
  addAnimeInkEdges(rpzCrystal, materials.inkLineMaterial, 24);
  rightVault.add(rpzCrystal);

  const rpzNetRing = new THREE.Mesh(
    new THREE.CylinderGeometry(1.18, 1.28, 1.55, 12, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
    })
  );
  rpzNetRing.position.set(0, 2.15, 0);
  rightVault.add(rpzNetRing);

  // Right Cutaway Glass Hood
  const rightHoodPivot = new THREE.Group();
  rightHoodPivot.position.set(0, 2.95, -0.88);
  rightVault.add(rightHoodPivot);

  const rightHood = new THREE.Mesh(
    new THREE.BoxGeometry(3.55, 1.6, 1.75),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  rightHood.position.set(0, -0.8, 0.88);
  rightHoodPivot.add(rightHood);

  // --- PROP 3: Sweeping Sky-Blue Memory Forensics & Zeek Reconstruction Beam ---
  const sweepGroup = new THREE.Group();
  sweepGroup.position.set(0, 2.2, 0.2);
  root.add(sweepGroup);

  const sweepCurtain = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 4.4, 2.7),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    })
  );
  sweepGroup.add(sweepCurtain);

  const sweepCap = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.26, 2.85),
    materials.createToonMaterial(0x38bdf8, {
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
    })
  );
  sweepCap.position.y = 2.25;
  addAnimeInkEdges(sweepCap, materials.inkLineMaterial, 24);
  sweepGroup.add(sweepCap);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.25, 3.65, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.25, 3.65, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.2, 15.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.55, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0, 2.2, 0.2),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DNSTUN_STEP_DURATION_SEC) + DNSTUN_STEP_DURATION_SEC) %
          DNSTUN_STEP_DURATION_SEC) /
        DNSTUN_STEP_DURATION_SEC;
      const frame = evaluateDnstunMemoryDiffState(tNorm, cutawayMode);

      leftHoodPivot.rotation.x = -frame.cutawayOpen * 1.18;
      rightHoodPivot.rotation.x = -frame.cutawayOpen * 1.18;

      churnSlips.forEach((s, i) => {
        s.position.y = 1.88 + Math.max(0, Math.sin(timeSec * 4.0 + i * 1.3)) * 0.34;
        s.rotation.y = Math.sin(timeSec * 2.4 + i) * 0.32;
      });

      rpzCrystal.rotation.y = timeSec * 1.3;
      rpzNetRing.rotation.y = -timeSec * 0.65;
      rpzCrystalMat.emissiveIntensity = 0.55 + frame.rpzSinkholeGlow * 0.85;

      sweepGroup.position.x = -4.2 + frame.forensicBeamSweep * 8.4;

      return {
        glitchIntensity: frame.stagingChurnPulse * 0.35,
        magicDustIntensity: 0.28 + frame.forensicBeamSweep * 0.38,
        stasisIntensity: frame.rpzSinkholeGlow * 0.45,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
