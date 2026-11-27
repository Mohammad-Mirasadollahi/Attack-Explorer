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
  easeOutCubic,
} from '@/components/three/step-stage-primitives';
import {
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncStep4State,
} from '../choreography';

/**
 * MOD-18 Standalone Scene — DCSync Step 4 (`dcsync-step4-krbtgt`)
 * Exclusive Room: Domain Quarantine & `>= 10h` Double-Reset Control Room
 * Exclusive Props:
 *   1. Left Hardened Sovereign Mint Tower (`x=-2.25`) with peeling/stripped crimson ribbon, cutaway armor hatch & descending Emerald Peer-Mint-Only Shield (`Enterprise DCs Only`)
 *   2. Center Double-Reset `>= 10h` Hourglass & Dual-Cast Golden `krbtgt` Crown Furnace (`x=0.25`)
 *   3. Right Verified Continuous Audit Tower (`Protected Users + Zero Non-DC ACEs`, `x=2.75`)
 */
export function buildDcsyncStep4Scene(
  materials: AnimeMaterialLibrary
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];

  const shell = buildStepRoomShell(materials, {
    floorColor: 0x071a16,
    floorTrimHex: 0x10b981,
    wallColor: 0x0f2d26,
    pillarColor: 0x17443a,
    gridColor: 0x1a4d41,
    signTitle: 'STEP 4 · PEER-ONLY BRIDGE & DOUBLE KRBTGT RESET',
    signSubtitle: 'STRIP NON-DC ACEs · 2x KRBTGT ROTATION (>= 10h) · PROTECTED USERS SHIELD',
    signBgHex: '#05221B',
    signBorderHex: '#10B981',
    signTitleHex: '#D1FAE5',
    signSubHex: '#6EE7B7',
    width: 15.4,
    depth: 10.4,
    wallZ: -3.5,
  });
  textures.push(...shell.textures);
  root.add(shell.group);

  // --- PROP 1: Left Hardened Sovereign Mint Tower (`x = -2.25`) ---
  const mintGroup = new THREE.Group();
  mintGroup.position.set(-2.25, 0, 0.25);
  root.add(mintGroup);
  mintGroup.add(createContactDisc(materials, 1.95, 0.018));

  const mintTower = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 3.45, 1.45),
    materials.createToonMaterial(0x1e293b)
  );
  mintTower.position.y = 1.725;
  addAnimeInkEdges(mintTower, materials.inkLineMaterial, 24);
  mintGroup.add(mintTower);

  // Peeling/Detaching Crimson Rogue Ribbon (falls away in Phase 1)
  const rogueRibbon = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 0.55, 0.16),
    materials.createToonMaterial(0xe11d48, {
      emissive: 0xf43f5e,
      emissiveIntensity: 0.75,
    })
  );
  rogueRibbon.position.set(0, 1.25, 0.82);
  addAnimeInkEdges(rogueRibbon, materials.inkLineMaterial, 24);
  mintGroup.add(rogueRibbon);

  // Cutaway Inspection Louver
  const hatchPivot = new THREE.Group();
  hatchPivot.position.set(0, 2.95, 0.75);
  mintGroup.add(hatchPivot);

  const hatchPlate = new THREE.Mesh(
    new THREE.BoxGeometry(2.55, 1.05, 0.1),
    materials.createToonMaterial(0x475569)
  );
  hatchPlate.position.set(0, -0.52, 0);
  addAnimeInkEdges(hatchPlate, materials.inkLineMaterial, 24);
  hatchPivot.add(hatchPlate);

  // Descending Emerald Peer-Mint-Only Shield
  const shieldTex = createPlaqueTexture(
    'ENTERPRISE DCs ONLY',
    'PEER-ONLY SEALED GATE',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(shieldTex);

  const emeraldShield = new THREE.Group();
  emeraldShield.position.set(0, 4.95, 0.94);
  mintGroup.add(emeraldShield);

  const shieldMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.75,
    transparent: true,
    opacity: 0.92,
  });
  const shieldSlab = new THREE.Mesh(
    new THREE.BoxGeometry(2.85, 2.55, 0.16),
    [
      shieldMat,
      shieldMat,
      shieldMat,
      shieldMat,
      new THREE.MeshBasicMaterial({ map: shieldTex }),
      shieldMat,
    ]
  );
  addAnimeInkEdges(shieldSlab, materials.inkLineMaterial, 24);
  emeraldShield.add(shieldSlab);

  // --- PROP 2: Center >= 10h Hourglass & Double krbtgt Recast Core (`x = 0.25`) ---
  const resetGroup = new THREE.Group();
  resetGroup.position.set(0.25, 0, 0.35);
  root.add(resetGroup);
  resetGroup.add(createContactDisc(materials, 1.15, 0.018));

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.78, 1.1, 16),
    materials.createToonMaterial(0x1e293b)
  );
  pedestal.position.y = 0.55;
  addAnimeInkEdges(pedestal, materials.inkLineMaterial, 24);
  resetGroup.add(pedestal);

  // Hourglass Assembly flipping 180 deg for >= 10h Double krbtgt Rotation
  const hourglass = new THREE.Group();
  hourglass.position.set(0, 2.15, 0);
  resetGroup.add(hourglass);

  const topCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 0.62, 12),
    materials.createToonMaterial(0xfacc15, {
      emissive: 0xf59e0b,
      emissiveIntensity: 0.7,
    })
  );
  topCone.rotation.x = Math.PI;
  topCone.position.y = 0.31;
  addAnimeInkEdges(topCone, materials.inkLineMaterial, 24);
  hourglass.add(topCone);

  const botCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 0.62, 12),
    materials.createToonMaterial(0x10b981, {
      emissive: 0x10b981,
      emissiveIntensity: 0.7,
    })
  );
  botCone.position.y = -0.31;
  addAnimeInkEdges(botCone, materials.inkLineMaterial, 24);
  hourglass.add(botCone);

  // --- PROP 3: Right Verified Continuous Audit Tower (`x = 2.75`) ---
  const auditGroup = new THREE.Group();
  auditGroup.position.set(2.75, 0, 0.2);
  root.add(auditGroup);
  auditGroup.add(createContactDisc(materials, 1.85, 0.018));

  const auditBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 3.3, 1.35),
    materials.createToonMaterial(0x064e3b)
  );
  auditBody.position.y = 1.65;
  addAnimeInkEdges(auditBody, materials.inkLineMaterial, 24);
  auditGroup.add(auditBody);

  const auditTex = createPlaqueTexture(
    'PROTECTED USERS',
    '2x KRBTGT · 0 ROGUE ACE',
    '#052E16',
    '#10B981',
    '#D1FAE5'
  );
  textures.push(auditTex);

  const auditScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 1.1),
    new THREE.MeshBasicMaterial({ map: auditTex })
  );
  auditScreen.position.set(0, 2.15, 0.69);
  auditGroup.add(auditScreen);

  const greenBeaconMat = materials.createToonMaterial(0x10b981, {
    emissive: 0x10b981,
    emissiveIntensity: 0.45,
  });
  const greenBeacon = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.36, 0),
    greenBeaconMat
  );
  greenBeacon.position.set(0, 3.72, 0);
  addAnimeInkEdges(greenBeacon, materials.inkLineMaterial, 24);
  auditGroup.add(greenBeacon);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-2.25, 3.85, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(2.75, 3.85, 0.25);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 4.6, 13.6),
    defaultCameraTarget: new THREE.Vector3(0.1, 2.5, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.1, 2.2, 0.25),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const frame = evaluateDcsyncStep4State(tNorm, cutawayMode);

      hatchPivot.rotation.x = -frame.cutawayOpen * 1.25;

      // Crimson rogue ribbon peels downward & vanishes in Phase 1
      const strip = easeOutCubic(frame.ribbonStripProgress);
      rogueRibbon.position.y = 1.25 - strip * 1.05;
      rogueRibbon.rotation.z = strip * 0.45;
      rogueRibbon.visible = strip < 0.92;

      // Hourglass flips 180° for double krbtgt reset (>= 10h apart)
      hourglass.rotation.z = easeOutCubic(frame.doubleResetRotation) * Math.PI;
      hourglass.rotation.y = timeSec * 1.1;

      // Emerald Peer-Only Shield drops across Mint Gatehouse
      const lock = easeOutCubic(frame.peerShieldLock);
      emeraldShield.visible = lock > 0.02;
      emeraldShield.position.y = 4.95 - lock * 3.15;
      shieldMat.emissiveIntensity = 0.6 + 0.4 * Math.sin(timeSec * 3.0);

      // Green verification beacon pulses steady
      greenBeacon.rotation.y = timeSec * 1.6;
      greenBeaconMat.emissiveIntensity = 0.45 + lock * 1.05;

      return {
        glitchIntensity: (1 - strip) * 0.25,
        magicDustIntensity: 0.25 + frame.doubleResetRotation * 0.35,
        stasisIntensity: lock * 0.55,
        brakeReleaseBoost: 0.12,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
