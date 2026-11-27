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
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncMemoryDiffState,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DCSync Memory Forensics (`dcsync-memory-acldiff`)
 * Exclusive Room: Dual `lsass.exe / ntdsai.dll DomainRootDACL` Comparator Hall
 * Exclusive Props:
 *   1. Left Exposed `DomainRootDACL` Tower (`0x7FF9D1100000`, `x=-3.1`) with glowing non-DC `1131f6ad -> svc_dir_sync` crimson ACE & cutaway glass
 *   2. Right Hardened `DomainRootDACL` Tower (`0x7FF9D1280000`, `x=+3.1`) with Enterprise-DC-Only `$` emerald seal & rotating double-recast crown
 *   3. Sweeping Golden Tier-0 ACL Audit Scanner Beam contrasting both cached descriptors
 */
export function buildDcsyncMemoryDiffScene(
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
    signTitle: 'MEMORY FORENSICS · EXPOSED DACL VS. PEER-ONLY SEAL',
    signSubtitle: '0x7FF9D1100000 NON-DC ACE (LEFT) VS. 0x7FF9D1280000 ENTERPRISE-DC ONLY (RIGHT)',
    signBgHex: '#0B1628',
    signBorderHex: '#38BDF8',
    signTitleHex: '#E0F2FE',
    signSubHex: '#7DD3FC',
    width: 15.6,
    depth: 10.6,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Exposed DomainRootDACL Tower (`x = -3.1`) ---
  const leftTower = new THREE.Group();
  leftTower.position.set(-3.1, 0, 0.2);
  root.add(leftTower);
  leftTower.add(createContactDisc(materials, 2.05, 0.018));

  const leftBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.55, 3.45, 1.65),
    materials.createToonMaterial(0x3b0a18)
  );
  leftBody.position.y = 1.725;
  addAnimeInkEdges(leftBody, materials.inkLineMaterial, 24);
  leftTower.add(leftBody);

  const leftTex = createPlaqueTexture(
    '0x7FF9D1100000 · EXPOSED',
    '1131f6ad -> svc_dir_sync',
    '#3B0A18',
    '#E11D48',
    '#FFE4E6'
  );
  textures.push(leftTex);

  const leftSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 0.88),
    new THREE.MeshBasicMaterial({ map: leftTex })
  );
  leftSign.position.set(0, 2.8, 0.84);
  leftTower.add(leftSign);

  const badAceMat = materials.createToonMaterial(0xe11d48, {
    emissive: 0xf43f5e,
    emissiveIntensity: 0.75,
  });
  const badAceBar = new THREE.Mesh(
    new THREE.BoxGeometry(2.65, 0.65, 0.26),
    badAceMat
  );
  badAceBar.position.set(0, 1.45, 0.85);
  addAnimeInkEdges(badAceBar, materials.inkLineMaterial, 24);
  leftTower.add(badAceBar);

  // Left Cutaway Glass Panel
  const leftCutPivot = new THREE.Group();
  leftCutPivot.position.set(0, 2.25, 1.02);
  leftTower.add(leftCutPivot);

  const leftCutGlass = new THREE.Mesh(
    new THREE.BoxGeometry(3.15, 1.55, 0.08),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  leftCutGlass.position.set(0, -0.78, 0.04);
  leftCutPivot.add(leftCutGlass);

  // --- PROP 2: Right Hardened Enterprise-DC-Only DACL Tower (`x = +3.1`) ---
  const rightTower = new THREE.Group();
  rightTower.position.set(3.1, 0, 0.2);
  root.add(rightTower);
  rightTower.add(createContactDisc(materials, 2.05, 0.018));

  const rightBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.55, 3.45, 1.65),
    materials.createToonMaterial(0x064e3b)
  );
  rightBody.position.y = 1.725;
  addAnimeInkEdges(rightBody, materials.inkLineMaterial, 24);
  rightTower.add(rightBody);

  const rightTex = createPlaqueTexture(
    '0x7FF9D1280000 · CLEAN',
    'ENTERPRISE DCs ONLY ($)',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(rightTex);

  const rightSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 0.88),
    new THREE.MeshBasicMaterial({ map: rightTex })
  );
  rightSign.position.set(0, 2.8, 0.84);
  rightTower.add(rightSign);

  const safeShieldMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.65,
  });
  const safeShield = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 1.45, 0.22),
    safeShieldMat
  );
  safeShield.position.set(0, 1.35, 0.85);
  addAnimeInkEdges(safeShield, materials.inkLineMaterial, 24);
  rightTower.add(safeShield);

  const crownHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.58, 0.1, 10, 24),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
    })
  );
  crownHalo.position.set(0, 1.35, 1.04);
  rightTower.add(crownHalo);

  // Right Cutaway Glass Panel
  const rightCutPivot = new THREE.Group();
  rightCutPivot.position.set(0, 2.25, 1.12);
  rightTower.add(rightCutPivot);

  const rightCutGlass = new THREE.Mesh(
    new THREE.BoxGeometry(3.15, 1.55, 0.08),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  rightCutGlass.position.set(0, -0.78, 0.04);
  rightCutPivot.add(rightCutGlass);

  // --- PROP 3: Sweeping Golden Tier-0 ACL Audit Scanner Beam ---
  const sweepGroup = new THREE.Group();
  sweepGroup.position.set(0, 2.2, 0.2);
  root.add(sweepGroup);

  const sweepCurtain = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 4.4, 2.7),
    new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    })
  );
  sweepGroup.add(sweepCurtain);

  const sweepCap = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.26, 2.85),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
    })
  );
  sweepCap.position.y = 2.25;
  addAnimeInkEdges(sweepCap, materials.inkLineMaterial, 24);
  sweepGroup.add(sweepCap);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.1, 3.85, 0.25);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.1, 3.85, 0.25);
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
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const frame = evaluateDcsyncMemoryDiffState(tNorm, cutawayMode);

      leftCutPivot.rotation.x = -frame.cutawayOpen * 1.25;
      rightCutPivot.rotation.x = -frame.cutawayOpen * 1.25;

      badAceMat.emissiveIntensity =
        0.55 + frame.exposedRibbonPulse * (0.75 + 0.3 * Math.sin(timeSec * 8));
      crownHalo.rotation.z = timeSec * 1.3;
      safeShieldMat.emissiveIntensity = 0.55 + frame.hardenedDaclGlow * 0.85;

      sweepGroup.position.x = -4.2 + frame.auditSweepProgress * 8.4;

      return {
        glitchIntensity: frame.exposedRibbonPulse * 0.35,
        magicDustIntensity: 0.28 + frame.auditSweepProgress * 0.38,
        stasisIntensity: frame.hardenedDaclGlow * 0.45,
        brakeReleaseBoost: 0.16,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
