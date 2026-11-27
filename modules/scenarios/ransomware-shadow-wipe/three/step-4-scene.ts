import * as THREE from 'three';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import {
  addAnimeInkEdges,
  type AnimeMaterialLibrary,
} from '@/components/three/anime-toon-materials';
import {
  buildStepRoomShell,
  createContactDisc,
  createPlaqueTexture,
  disposeStepScene,
  easeOutCubic,
} from '@/components/three/step-stage-primitives';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { evaluateLockbitStep4State } from '../choreography';

/**
 * MOD-18 Standalone Diorama — LockBit Step #4 (`lockbit-step4-ransomnote`)
 * Room: Municipal Records Glass Entrance Lobby & Protected Ceiling SIEM Audit Vault.
 */
export function buildLockbitStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x2a2438,
    floorTrimHex: 0x7c3aed,
    wallColor: 0x1c192b,
    pillarColor: 0x0f172a,
    signTitle: 'STEP 4 · EXTORTION & AUDIT WITNESS',
    signSubtitle: 'RESTORE-MY-FILES.TXT (EID 11) + WINSEC EID 1102',
    signBgHex: '#1E1B4B',
    signBorderHex: '#7C3AED',
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  const darkIronMat = materials.createToonMaterial(0x1e293b);
  const steelMat = materials.createToonMaterial(0x475569);
  const brassMat = materials.createToonMaterial(0xd97706);
  const crimsonMat = materials.createToonMaterial(0xdc2626);
  const violetMat = materials.createToonMaterial(0x7c3aed);

  // Prop 1: Frosted Glass Double-Leaf Entrance Door + Mechanical Extortion Placard Press
  const doorGroup = new THREE.Group();
  doorGroup.position.set(0.2, 0, 0.25);
  doorGroup.add(createContactDisc(materials, 1.9));

  const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.26, 3.2, 0.34), darkIronMat);
  frameLeft.position.set(-1.55, 1.6, 0);
  const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.26, 3.2, 0.34), darkIronMat);
  frameRight.position.set(1.55, 1.6, 0);
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.38, 0.28, 0.42), darkIronMat);
  lintel.position.set(0, 3.22, 0);
  doorGroup.add(frameLeft, frameRight, lintel);

  const glassMat = new THREE.MeshToonMaterial({
    color: 0xcbd5e1,
    transparent: true,
    opacity: 0.42,
    gradientMap: materials.gradientMap,
  });
  for (const dx of [-0.72, 0.72]) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.36, 2.95, 0.08), glassMat);
    leaf.position.set(dx, 1.5, 0);
    addAnimeInkEdges(leaf, materials.inkLineMaterial, 28);
    doorGroup.add(leaf);
  }

  // Swinging brass placard press arm mounted on right jamb
  const pressArm = new THREE.Group();
  pressArm.position.set(2.35, 1.85, 0.55);
  const pressPost = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 2.2, 14), steelMat);
  pressPost.position.y = -0.75;
  const armBoom = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.16, 0.16), brassMat);
  armBoom.position.set(-0.78, 0, 0);
  addAnimeInkEdges(armBoom, materials.inkLineMaterial, 24);
  pressArm.add(pressPost, armBoom);
  doorGroup.add(pressArm);

  // Crimson bolted Restore-My-Files.txt extortion placard
  const placardGroup = new THREE.Group();
  const placardTex = createPlaqueTexture(
    'RESTORE-MY-FILES.TXT',
    'ALL FILES LOCKED',
    '#7F1D1D',
    '#EF4444',
    '#FEF2F2'
  );
  textures.push(placardTex);
  const placardBoard = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 1.25, 0.12),
    [
      crimsonMat,
      crimsonMat,
      crimsonMat,
      crimsonMat,
      new THREE.MeshBasicMaterial({ map: placardTex }),
      crimsonMat,
    ]
  );
  addAnimeInkEdges(placardBoard, materials.inkLineMaterial, 24);
  placardGroup.add(placardBoard);

  // 4 corner brass bolts
  for (const [bx, by] of [
    [-0.95, 0.5],
    [0.95, 0.5],
    [-0.95, -0.5],
    [0.95, -0.5],
  ]) {
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.18, 8), brassMat);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(bx, by, 0.04);
    placardGroup.add(bolt);
  }
  placardGroup.position.set(0, 1.85, 0.88);
  doorGroup.add(placardGroup);
  root.add(doorGroup);

  // Prop 2: Overhead Lobby Welcome Monitor flipping Blue -> Crimson Wallpaper (EID 13)
  const monitorNormalTex = createPlaqueTexture(
    'MUNICIPAL ARCHIVE LOBBY',
    'STATUS: ONLINE',
    '#0C4A6E',
    '#38BDF8',
    '#E0F2FE'
  );
  const monitorRansomTex = createPlaqueTexture(
    'DESKTOP WALLPAPER HIJACK',
    'EID 13 · LB3_WALL.BMP',
    '#7F1D1D',
    '#DC2626',
    '#FEE2E2'
  );
  textures.push(monitorNormalTex, monitorRansomTex);

  const monitorScreenMat = new THREE.MeshBasicMaterial({ map: monitorNormalTex });
  const monitorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 1.15, 0.22),
    [darkIronMat, darkIronMat, darkIronMat, darkIronMat, monitorScreenMat, darkIronMat]
  );
  monitorFrame.position.set(0.2, 3.92, 0.12);
  addAnimeInkEdges(monitorFrame, materials.inkLineMaterial, 24);
  root.add(monitorFrame);

  // Prop 3: Protected Ceiling Remote SIEM Audit Vault (x = -0.4, y = 4.35, z = -2.45)
  const auditVault = new THREE.Group();
  auditVault.position.set(-0.4, 4.15, -2.45);

  const vaultHousing = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.15, 0.95), darkIronMat);
  addAnimeInkEdges(vaultHousing, materials.inkLineMaterial, 24);
  auditVault.add(vaultHousing);

  // Cutaway glass shield covering violet witness core
  const shieldMat = new THREE.MeshToonMaterial({
    color: 0xc4b5fd,
    transparent: true,
    opacity: 0.55,
    gradientMap: materials.gradientMap,
  });
  const shieldPane = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.92, 0.1), shieldMat);
  shieldPane.position.set(0, 0, 0.5);
  auditVault.add(shieldPane);

  // Rotating violet witness prism core inside vault
  const prismCoreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false });
  const prismCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), prismCoreMat);
  prismCore.position.set(-0.92, 0, 0.1);
  auditVault.add(prismCore);

  const auditNormalTex = createPlaqueTexture(
    'REMOTE SIEM COLLECTOR',
    'APPEND-ONLY VAULT',
    '#0F172A',
    '#10B981',
    '#D1FAE5'
  );
  const auditAlertTex = createPlaqueTexture(
    'WEVTUTIL CL DETECTED',
    'WINSEC EID 1102',
    '#3B0764',
    '#A855F7',
    '#F5D0FE'
  );
  textures.push(auditNormalTex, auditAlertTex);

  const auditPlaqueMat = new THREE.MeshBasicMaterial({ map: auditNormalTex });
  const auditPlaque = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.72), auditPlaqueMat);
  auditPlaque.position.set(0.42, 0, 0.49);
  auditVault.add(auditPlaque);

  // Recoiling crimson wipe-arm attempting wevtutil cl Security
  const wipeArm = new THREE.Group();
  wipeArm.position.set(-2.35, -0.35, 0.55);
  const wipeStick = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.14, 0.14), crimsonMat);
  wipeStick.position.x = 0.45;
  const wipeHammer = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 0.24), violetMat);
  wipeHammer.position.x = 0.92;
  wipeArm.add(wipeStick, wipeHammer);
  auditVault.add(wipeArm);

  root.add(auditVault);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(0.2, 2.3, 0.45);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(-0.4, 4.6, -2.1);
  root.add(secondaryAnchor);

  let showingRansom = false;
  let showingEid1102 = false;

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.4, 3.9, 9.2),
    defaultCameraTarget: new THREE.Vector3(0.0, 2.4, -0.4),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 3.1, -0.8),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const s = evaluateLockbitStep4State(timeSec, cutawayMode);

      const bolt = easeOutCubic(s.placardBolted);
      placardGroup.scale.setScalar(Math.max(0.01, bolt));
      placardGroup.position.z = 0.92 - bolt * 0.78;
      pressArm.rotation.y = -s.pressArmSwing * 0.82;

      if (s.wallpaperFlipped !== showingRansom) {
        showingRansom = s.wallpaperFlipped;
        monitorScreenMat.map = s.wallpaperFlipped ? monitorRansomTex : monitorNormalTex;
        monitorScreenMat.needsUpdate = true;
      }

      if (s.eid1102Active !== showingEid1102) {
        showingEid1102 = s.eid1102Active;
        auditPlaqueMat.map = s.eid1102Active ? auditAlertTex : auditNormalTex;
        auditPlaqueMat.needsUpdate = true;
      }

      // Cutaway fades audit vault shield & door glass
      shieldMat.opacity = 0.56 - s.cutawayOpen * 0.42;
      glassMat.opacity = 0.42 - s.cutawayOpen * 0.24;

      // Recoiling wipe arm + flaring violet witness prism
      wipeArm.rotation.z = s.wipeStrikeProgress * 0.65;
      prismCore.rotation.y = timeSec * (1.8 + s.auditVioletFlare * 5.0);
      prismCore.scale.setScalar(1 + s.auditVioletFlare * 0.45);
      prismCoreMat.color.setHex(s.eid1102Active ? 0xa855f7 : 0x10b981);
      shell.accentStripMat.color.setHex(s.eid1102Active ? 0xa855f7 : 0xdc2626);

      return {
        glitchIntensity: s.eid1102Active ? 0.34 : 0.1,
        magicDustIntensity: s.auditVioletFlare * 0.55 + bolt * 0.25,
        stasisIntensity: 0,
        brakeReleaseBoost: 0,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
