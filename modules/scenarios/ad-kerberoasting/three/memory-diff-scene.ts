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
  KERB_STEP_DURATION_SEC,
  evaluateKerbMemoryDiffState,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — Kerberoasting Memory Forensics (`kerb-memory-rc4diff`)
 * Exclusive Room: Dual LSASS Kerberos Ticket Cache Comparison Vault
 * Exclusive Props:
 *   1. Left Vulnerable RC4-HMAC (0x17) Ticket Chamber (`x=-3.2`) with hinged glass cutaway hood, 3 spinning cracking tumblers & fracturing bronze seal
 *   2. Right Hardened AES-256 (0x12) + 120-Char gMSA Vault (`x=+3.2`) with rotating auto-key emerald drum & cutaway armor plate
 *   3. Sweeping Golden Tier-0 Audit Scanner Arch gliding cleanly between both memory addresses
 */
export function buildKerbMemoryDiffScene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x0f172a,
    floorTrimHex: 0x38bdf8,
    wallColor: 0x1e293b,
    pillarColor: 0x334155,
    gridColor: 0x334155,
    signTitle: 'MEMORY FORENSICS · RC4-HMAC (0x17) VS. AES-256 gMSA (0x12)',
    signSubtitle: '0x7FF9B4100000 CRACKABLE RC4 (LEFT) VS. 0x7FF9B4200000 AUTO-ROTATED gMSA (RIGHT)',
    signBgHex: '#0F172A',
    signBorderHex: '#38BDF8',
    signTitleHex: '#E0F2FE',
    signSubHex: '#7DD3FC',
    width: 15.6,
    depth: 10.6,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Vulnerable RC4-HMAC (0x17) Memory Bench (x = -3.2) ---
  const leftBench = new THREE.Group();
  leftBench.position.set(-3.2, 0, 0.2);
  root.add(leftBench);
  leftBench.add(createContactDisc(materials, 2.15, 0.018));

  const leftBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.75, 1.35, 1.85),
    materials.createToonMaterial(0x3b0a18)
  );
  leftBase.position.y = 0.675;
  addAnimeInkEdges(leftBase, materials.inkLineMaterial, 24);
  leftBench.add(leftBase);

  const leftTex = createPlaqueTexture(
    '0x7FF9B4100000 · RC4',
    'ETYPE 0x17 · 6s CRACK',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(leftTex);

  const leftSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 0.9),
    new THREE.MeshBasicMaterial({ map: leftTex })
  );
  leftSign.position.set(0, 0.68, 0.94);
  leftBench.add(leftSign);

  const rc4Wheels: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) {
    const wg = new THREE.Group();
    wg.position.set(-1.0 + i * 1.0, 2.05, 0);
    leftBench.add(wg);

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.24, 16),
      materials.createToonMaterial(0xe11d48, {
        emissive: 0xf43f5e,
        emissiveIntensity: 0.6,
      })
    );
    disc.rotation.x = Math.PI / 2;
    addAnimeInkEdges(disc, materials.inkLineMaterial, 24);
    wg.add(disc);

    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.14, 0.28),
      materials.createToonMaterial(0xfde047)
    );
    wg.add(bar);
    rc4Wheels.push(wg);
  }

  // Hinged Cutaway Hood on Left Bench
  const leftHoodPivot = new THREE.Group();
  leftHoodPivot.position.set(0, 2.8, -0.9);
  leftBench.add(leftHoodPivot);

  const leftHood = new THREE.Mesh(
    new THREE.BoxGeometry(3.65, 1.45, 1.8),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  leftHood.position.set(0, -0.7, 0.9);
  leftHoodPivot.add(leftHood);

  // --- PROP 2: Right Hardened AES-256 (0x12) + 120-Char gMSA Vault (x = +3.2) ---
  const rightVault = new THREE.Group();
  rightVault.position.set(3.2, 0, 0.2);
  root.add(rightVault);
  rightVault.add(createContactDisc(materials, 2.15, 0.018));

  const rightBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.75, 1.35, 1.85),
    materials.createToonMaterial(0x064e3b)
  );
  rightBase.position.y = 0.675;
  addAnimeInkEdges(rightBase, materials.inkLineMaterial, 24);
  rightVault.add(rightBase);

  const rightTex = createPlaqueTexture(
    '0x7FF9B4200000 · AES',
    '0x12 + 120-CHAR gMSA',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(rightTex);

  const rightSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 0.9),
    new THREE.MeshBasicMaterial({ map: rightTex })
  );
  rightSign.position.set(0, 0.68, 0.94);
  rightVault.add(rightSign);

  // Rotating 120-Char gMSA Auto-Key Core Cylinder
  const aesCoreMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.55,
  });
  const aesDrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.68, 1.45, 12),
    aesCoreMat
  );
  aesDrum.position.set(0, 2.15, 0);
  addAnimeInkEdges(aesDrum, materials.inkLineMaterial, 24);
  rightVault.add(aesDrum);

  const aesOrbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.09, 10, 28),
    materials.createToonMaterial(0x34d399, {
      emissive: 0x10b981,
      emissiveIntensity: 0.75,
    })
  );
  aesOrbitRing.position.set(0, 2.15, 0);
  rightVault.add(aesOrbitRing);

  // Hinged Cutaway Emerald Armor Plate on Right Vault
  const rightHoodPivot = new THREE.Group();
  rightHoodPivot.position.set(0, 2.95, -0.9);
  rightVault.add(rightHoodPivot);

  const rightHood = new THREE.Mesh(
    new THREE.BoxGeometry(3.65, 1.6, 1.8),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  rightHood.position.set(0, -0.78, 0.9);
  rightHoodPivot.add(rightHood);

  // --- PROP 3: Sweeping Golden Tier-0 Audit Scanner Beam ---
  const sweepGroup = new THREE.Group();
  sweepGroup.position.set(0, 2.2, 0.2);
  root.add(sweepGroup);

  const sweepBeam = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 4.3, 2.6),
    new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    })
  );
  sweepGroup.add(sweepBeam);

  const sweepEmitter = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.28, 2.75),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
    })
  );
  sweepEmitter.position.y = 2.2;
  addAnimeInkEdges(sweepEmitter, materials.inkLineMaterial, 24);
  sweepGroup.add(sweepEmitter);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.2, 3.65, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.2, 3.65, 0.25);
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
        (((timeSec % KERB_STEP_DURATION_SEC) + KERB_STEP_DURATION_SEC) %
          KERB_STEP_DURATION_SEC) /
        KERB_STEP_DURATION_SEC;
      const frame = evaluateKerbMemoryDiffState(tNorm, cutawayMode);

      // Cutaway hoods lift cleanly on both chambers
      leftHoodPivot.rotation.x = -frame.cutawayOpen * 1.15;
      rightHoodPivot.rotation.x = -frame.cutawayOpen * 1.15;

      // Left RC4 tumblers spin rapidly
      const rc4Rate = 2.5 + frame.rc4CrackIntensity * 6.5;
      rc4Wheels.forEach((w, idx) => {
        w.rotation.z = timeSec * rc4Rate * (idx % 2 === 0 ? 1 : -1.2);
      });

      // Right AES-256 gMSA core rotates serenely & pulses emerald
      aesDrum.rotation.y = timeSec * 1.15;
      aesOrbitRing.rotation.x = Math.sin(timeSec * 0.9) * 0.55;
      aesOrbitRing.rotation.y = timeSec * 1.4;
      aesCoreMat.emissiveIntensity = 0.55 + frame.aesVaultPulse * 0.85;

      // Golden Tier-0 Audit Scanner sweeps smoothly left -> right
      sweepGroup.position.x = -4.2 + frame.auditSweepProgress * 8.4;

      return {
        glitchIntensity: frame.rc4CrackIntensity * 0.38,
        magicDustIntensity: 0.3 + frame.auditSweepProgress * 0.35,
        stasisIntensity: frame.aesVaultPulse * 0.45,
        brakeReleaseBoost: 0.18,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
