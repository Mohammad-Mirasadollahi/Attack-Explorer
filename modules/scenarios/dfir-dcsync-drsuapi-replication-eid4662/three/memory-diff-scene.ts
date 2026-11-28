import * as THREE from 'three';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { StandardCutawayMode } from '@/lib/section-3d-registry';
import type { BespokeSection3DScene } from '@/modules/scenarios/process-hollowing/three/step-scene-builders';
import { disposeStepScene, easeOutCubic } from '@/components/three/step-stage-primitives';
import {
  DCSYNC_STEP_DURATION_SEC,
  evaluateDcsyncMemoryDiffState,
} from '../choreography';
import {
  addCitySkylineBackdrop,
  buildCrownSealAssembly,
  buildStreetLamp,
  createBrassPlaqueTexture,
  createLedBoardTexture,
  createMintPbrPalette,
} from './pbr-mint-assets';

/**
 * Photorealistic PBR Standalone Scene — DCSync Memory Forensics (`dcsync-memory-acldiff`)
 * Story: Twin Sovereign Mint Architectural DACL Comparison Plaza.
 *   - Left Tower (`x = -3.6`, `0x00007FF9D1100000 · EXPOSED`): Limestone Mint Tower with
 *     hinged cutaway glass, pulsing crimson Service Ribbon (`1131F6AD -> svc_dir_sync`),
 *     and 3 glowing golden Crown-Hash Capsules visibly leaking out an unguarded side chute.
 *   - Right Tower (`x = +3.6`, `0x00007FF9D1280000 · HARDENED`): Identical limestone Mint
 *     Tower with sealed Emerald Peer-DC-Only blast louvers protecting a serenely rotating
 *     double-recast golden Master Crown Seal inside an armored emerald glass chamber.
 *   - Overhead (`y = 6.2`): Brushed-steel Audit Gantry Rail carrying a motorized brushed-brass
 *     Golden Tier-0 ACL Audit Scanner Bridge that sweeps smoothly from Left (`-3.6`) to Right
 *     (`+3.6`), projecting a crisp golden optical scan curtain across both tower descriptors.
 */
export function buildDcsyncMemoryDiffScene(
  materials: AnimeMaterialLibrary,
  isSoftwareGl = false
): BespokeSection3DScene {
  const root = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const palette = createMintPbrPalette(textures);

  // Granite comparison plaza, center brass seam, streetlamps & skyline
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 70),
    new THREE.MeshStandardMaterial({ color: 0x4b535e, roughness: 0.92 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.02, -8);
  root.add(ground);

  const plaza = new THREE.Mesh(new THREE.BoxGeometry(22, 0.18, 9.6), palette.sidewalk);
  plaza.position.set(0, 0.09, 0.2);
  plaza.receiveShadow = true;
  root.add(plaza);

  // Center brass divider line separating Exposed (Left) vs. Hardened (Right)
  const centerSeam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 9.2), palette.brass);
  centerSeam.position.set(0, 0.19, 0.2);
  root.add(centerSeam);

  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xffe4b5,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.62,
    roughness: 0.25,
  });
  for (const [lx, lz, rot] of [
    [-8.4, -2.6, Math.PI / 2],
    [8.4, -2.6, Math.PI / 2],
    [-8.0, 3.6, -Math.PI / 2],
    [8.0, 3.6, -Math.PI / 2],
  ] as Array<[number, number, number]>) {
    const lamp = buildStreetLamp(palette.iron, lampBulbMat);
    lamp.position.set(lx, 0.18, lz);
    lamp.rotation.y = rot;
    root.add(lamp);
  }

  addCitySkylineBackdrop(root, palette, -4);

  // Helper to construct a symmetric Sovereign Mint Tower architectural shell
  function buildComparisonTowerShell(
    x: number,
    title: string,
    subtitle: string,
    hingeSign: 1 | -1
  ) {
    const group = new THREE.Group();
    group.position.set(x, 0.18, 0.0);
    root.add(group);

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.68, 3.3), palette.granitePlinth);
    plinth.position.y = 0.34;
    plinth.castShadow = !isSoftwareGl;
    plinth.receiveShadow = true;
    group.add(plinth);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(3.3, 4.35, 0.42), palette.limestone);
    backWall.position.set(0, 2.86, -1.16);
    backWall.castShadow = !isSoftwareGl;
    backWall.receiveShadow = true;
    group.add(backWall);

    for (const sx of [-1.52, 1.52]) {
      const sidePillar = new THREE.Mesh(new THREE.BoxGeometry(0.36, 4.45, 2.75), palette.limestone);
      sidePillar.position.set(sx, 2.9, 0);
      sidePillar.castShadow = !isSoftwareGl;
      group.add(sidePillar);

      const bronzeTrim = new THREE.Mesh(new THREE.BoxGeometry(0.18, 4.45, 0.18), palette.darkBronze);
      bronzeTrim.position.set(sx, 2.9, 1.38);
      group.add(bronzeTrim);
    }

    const midFloor = new THREE.Mesh(new THREE.BoxGeometry(2.74, 0.14, 2.45), palette.darkBronze);
    midFloor.position.set(0, 2.55, 0);
    group.add(midFloor);

    const cornice = new THREE.Mesh(new THREE.BoxGeometry(3.86, 0.28, 3.2), palette.darkBronze);
    cornice.position.y = 5.22;
    group.add(cornice);

    const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.88, 0.85, 4), palette.copperRoof);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 5.78;
    group.add(roof);

    // Hinged front cutaway glass door
    const glassPivot = new THREE.Group();
    glassPivot.position.set(hingeSign * 1.32, 2.88, 1.32);
    group.add(glassPivot);

    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(2.62, 4.18, 0.08), palette.galleryGlass);
    glassPane.position.set(-hingeSign * 1.31, 0, 0);
    glassPivot.add(glassPane);

    for (const fy of [-2.05, 0, 2.05]) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(2.66, 0.07, 0.1), palette.darkBronze);
      mullion.position.set(-hingeSign * 1.31, fy, 0);
      glassPivot.add(mullion);
    }

    // Plinth brass plaque
    const plaqueTex = createBrassPlaqueTexture(title, subtitle, textures);
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(2.85, 0.56),
      new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.4, metalness: 0.28 })
    );
    plaque.position.set(0, 0.36, 1.67);
    group.add(plaque);

    return { group, glassPivot };
  }

  // =========================================================================
  // LEFT TOWER: EXPOSED DACL (0x00007FF9D1100000 · 1131F6AD -> svc_dir_sync)
  // =========================================================================
  const leftTower = buildComparisonTowerShell(
    -3.65,
    'EXPOSED DACL · 0x7FF9D1100000',
    '1131F6AD -> CORP\\svc_dir_sync',
    -1
  );

  // Upper crimson LED diagnostic screen
  const exposedLedTex = createLedBoardTexture(
    'EXPOSED DOMAIN ROOT DACL',
    [
      { text: 'ACE: 1131f6aa + 1131f6ad', color: '#fda4af' },
      { text: 'WHO: svc_dir_sync (NON-$)', color: '#fde047' },
      { text: 'RISK: STREET VAN DCSYNC', color: '#fecdd3' },
    ],
    'ROSE',
    textures
  );
  const exposedLedMat = new THREE.MeshStandardMaterial({
    map: exposedLedTex,
    emissiveMap: exposedLedTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.24,
    roughness: 0.3,
    metalness: 0.14,
  });
  const exposedLed = new THREE.Mesh(new THREE.PlaneGeometry(2.38, 1.18), exposedLedMat);
  exposedLed.position.set(0, 3.85, -0.88);
  leftTower.group.add(exposedLed);

  // Pulsing crimson service ribbon hanging inside lower chamber
  const exposedRibbonMat = new THREE.MeshStandardMaterial({
    map: palette.ribbonTex,
    emissive: 0xe11d48,
    emissiveIntensity: 0.36,
    roughness: 0.45,
    metalness: 0.12,
  });
  const exposedRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.35, 0.05), exposedRibbonMat);
  exposedRibbon.position.set(-0.55, 1.62, 0.15);
  leftTower.group.add(exposedRibbon);

  // Unprotected golden crown core inside lower chamber + leaking hash capsules
  const vulnGoldMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    emissive: 0xb45309,
    emissiveIntensity: 0.3,
    roughness: 0.24,
    metalness: 0.88,
  });
  const vulnAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.24,
    roughness: 0.3,
    metalness: 0.65,
  });
  const exposedCrown = buildCrownSealAssembly(vulnGoldMat, palette.darkBronze, vulnAccentMat);
  exposedCrown.scale.setScalar(0.88);
  exposedCrown.position.set(0.42, 0.92, 0.05);
  leftTower.group.add(exposedCrown);

  // Leaking golden hash capsules streaming out of the open left tower side-chute
  const leakCapsules: THREE.Group[] = [];
  const leakMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xd97706,
    emissiveIntensity: 0.45,
    roughness: 0.22,
    metalness: 0.85,
  });
  for (let i = 0; i < 3; i++) {
    const cap = new THREE.Group();
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.32, 14), leakMat);
    core.rotation.z = Math.PI / 2;
    cap.add(core);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 16), palette.darkBronze);
    band.rotation.y = Math.PI / 2;
    cap.add(band);
    leftTower.group.add(cap);
    leakCapsules.push(cap);
  }

  // Crimson caution beacon on left cornice
  const leftAlarmMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    emissive: 0xe11d48,
    emissiveIntensity: 0.4,
    roughness: 0.22,
  });
  const leftAlarm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.3, 16), leftAlarmMat);
  leftAlarm.position.set(0, 6.32, 0);
  leftTower.group.add(leftAlarm);

  // =========================================================================
  // RIGHT TOWER: HARDENED DACL (0x00007FF9D1280000 · ENTERPRISE DCs ONLY)
  // =========================================================================
  const rightTower = buildComparisonTowerShell(
    3.65,
    'HARDENED DACL · 0x7FF9D1280000',
    'ENTERPRISE DCs ONLY · 2x KRBTGT',
    1
  );

  // Upper emerald LED diagnostic screen
  const cleanLedTex = createLedBoardTexture(
    'HARDENED DOMAIN ROOT DACL',
    [
      { text: 'ACE: ENTERPRISE DCs ONLY', color: '#6ee7b7' },
      { text: 'KRBTGT: DOUBLE RESET OK', color: '#fde68a' },
      { text: 'STATUS: NON-DC BLOCKED', color: '#7dd3fc' },
    ],
    'EMERALD',
    textures
  );
  const cleanLedMat = new THREE.MeshStandardMaterial({
    map: cleanLedTex,
    emissiveMap: cleanLedTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.22,
    roughness: 0.3,
    metalness: 0.14,
  });
  const cleanLed = new THREE.Mesh(new THREE.PlaneGeometry(2.38, 1.18), cleanLedMat);
  cleanLed.position.set(0, 3.85, -0.88);
  rightTower.group.add(cleanLed);

  // Protected double-recast Master Crown Seal inside an emerald shield cage
  const cleanGoldMat = new THREE.MeshStandardMaterial({
    color: 0xf4c430,
    emissive: 0xd97706,
    emissiveIntensity: 0.34,
    roughness: 0.2,
    metalness: 0.9,
  });
  const cleanAccentMat = new THREE.MeshStandardMaterial({
    color: 0x6ee7b7,
    emissive: 0x10b981,
    emissiveIntensity: 0.36,
    roughness: 0.22,
    metalness: 0.72,
  });
  const cleanCrown = buildCrownSealAssembly(cleanGoldMat, palette.darkBronze, cleanAccentMat);
  cleanCrown.scale.setScalar(0.95);
  cleanCrown.position.set(0, 0.96, 0.05);
  rightTower.group.add(cleanCrown);

  // Emerald Peer-DC-Only Blast Louvers / Shield Ring around clean crown
  const shieldRingMat = new THREE.MeshStandardMaterial({
    color: 0x059669,
    emissive: 0x10b981,
    emissiveIntensity: 0.32,
    roughness: 0.24,
    metalness: 0.65,
  });
  const shieldRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.045, 12, 32), shieldRingMat);
  shieldRing1.rotation.x = Math.PI / 2;
  shieldRing1.position.set(0, 1.38, 0.05);
  rightTower.group.add(shieldRing1);

  const shieldRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.045, 12, 32), shieldRingMat);
  shieldRing2.rotation.x = Math.PI / 2;
  shieldRing2.position.set(0, 1.88, 0.05);
  rightTower.group.add(shieldRing2);

  // Emerald verified beacon on right cornice
  const rightBeaconMat = new THREE.MeshStandardMaterial({
    color: 0x059669,
    emissive: 0x10b981,
    emissiveIntensity: 0.38,
    roughness: 0.22,
  });
  const rightBeacon = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.3, 16), rightBeaconMat);
  rightBeacon.position.set(0, 6.32, 0);
  rightTower.group.add(rightBeacon);

  // =========================================================================
  // OVERHEAD: BRUSHED-STEEL AUDIT GANTRY RAIL + SWEEPING GOLDEN ACL SCANNER
  // =========================================================================
  for (const gx of [-6.05, 6.05]) {
    const stanchionBase = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.45, 0.62), palette.granitePlinth);
    stanchionBase.position.set(gx, 0.4, 0.0);
    root.add(stanchionBase);

    const stanchion = new THREE.Mesh(new THREE.BoxGeometry(0.28, 6.45, 0.28), palette.steel);
    stanchion.position.set(gx, 3.62, 0.0);
    stanchion.castShadow = !isSoftwareGl;
    root.add(stanchion);
  }

  for (const rz of [-0.26, 0.26]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.18, 0.14), palette.darkBronze);
    rail.position.set(0, 6.72, rz);
    root.add(rail);
  }

  // Motorized Golden Tier-0 ACL Audit Scanner Carriage
  const scannerCarriage = new THREE.Group();
  scannerCarriage.position.set(-3.65, 6.62, 0.0);
  root.add(scannerCarriage);

  const carriageChassis = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.36, 0.88), palette.brass);
  scannerCarriage.add(carriageChassis);

  const carriagePlaqueTex = createBrassPlaqueTexture(
    'TIER-0 ACL AUDIT SCANNER',
    'COMPARE 1131f6aa / 1131f6ad',
    textures
  );
  const carriagePlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.36, 0.32),
    new THREE.MeshStandardMaterial({ map: carriagePlaqueTex, roughness: 0.38, metalness: 0.3 })
  );
  carriagePlaque.position.set(0, 0, 0.46);
  scannerCarriage.add(carriagePlaque);

  const scanCurtainMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const scanCurtain = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 6.0), scanCurtainMat);
  scanCurtain.position.set(0, -3.18, 1.55);
  scannerCarriage.add(scanCurtain);

  const scanBarMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });
  const scanBar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 6.0, 0.1), scanBarMat);
  scanBar.position.set(0, -3.18, 1.58);
  scannerCarriage.add(scanBar);

  const primaryAnchor = new THREE.Object3D();
  primaryAnchor.position.set(-3.65, 5.4, 0.3);
  root.add(primaryAnchor);

  const secondaryAnchor = new THREE.Object3D();
  secondaryAnchor.position.set(3.65, 5.4, 0.3);
  root.add(secondaryAnchor);

  return {
    root,
    defaultCameraPos: new THREE.Vector3(0.0, 5.1, 17.6),
    defaultCameraTarget: new THREE.Vector3(0.0, 3.2, 0.0),
    primaryAnchor,
    secondaryAnchor,
    particleCenter: new THREE.Vector3(0.0, 3.2, 0.3),
    update: (timeSec, _phaseIndex, _isDark, cutawayMode: StandardCutawayMode = 'AUTO') => {
      const tNorm =
        (((timeSec % DCSYNC_STEP_DURATION_SEC) + DCSYNC_STEP_DURATION_SEC) %
          DCSYNC_STEP_DURATION_SEC) /
        DCSYNC_STEP_DURATION_SEC;
      const f = evaluateDcsyncMemoryDiffState(tNorm, cutawayMode);

      // Hinged front cutaway glass swings open outward on both towers
      const cut = easeOutCubic(f.cutawayOpen);
      leftTower.glassPivot.rotation.y = -cut * 1.15;
      rightTower.glassPivot.rotation.y = cut * 1.15;

      // Left Exposed Tower: crimson ribbon pulses & golden hash capsules leak outward
      const pulse = 0.5 + 0.5 * Math.sin(timeSec * 5.2);
      exposedRibbonMat.emissiveIntensity = 0.28 + f.exposedRibbonPulse * (0.45 + 0.28 * pulse);
      exposedRibbon.rotation.z = Math.sin(timeSec * 2.2) * 0.04;
      exposedCrown.rotation.y = timeSec * 0.9;
      leftAlarmMat.emissiveIntensity = 0.3 + f.exposedRibbonPulse * (0.85 + 0.35 * pulse);

      leakCapsules.forEach((cap, idx) => {
        const u = (timeSec * 0.42 + idx / leakCapsules.length) % 1;
        cap.position.set(0.65 + u * 2.15, 1.35 + Math.sin(u * Math.PI) * 0.32, 0.35 + u * 1.1);
        cap.rotation.y = timeSec * 1.6 + idx;
        cap.visible = f.exposedRibbonPulse > 0.06;
      });

      // Overhead Golden Tier-0 ACL Audit Scanner glides smoothly from Left (-3.65) to Right (+3.65)
      const sweep = easeOutCubic(f.auditSweepProgress);
      scannerCarriage.position.x = -3.65 + sweep * 7.3;
      const scanActive = f.auditSweepProgress > 0.02 && f.auditSweepProgress < 0.99;
      scanCurtainMat.opacity = scanActive ? 0.16 + 0.05 * Math.sin(timeSec * 7) : 0.06;
      scanBarMat.emissiveIntensity = scanActive ? 0.9 : 0.28;

      // Right Hardened Tower: serene rotation & luminous emerald Peer-DC-Only shield rings
      cleanCrown.rotation.y = timeSec * 0.65;
      const hard = easeOutCubic(f.hardenedDaclGlow);
      shieldRingMat.emissiveIntensity = 0.25 + hard * 0.68;
      shieldRing1.rotation.z = timeSec * 0.5;
      shieldRing2.rotation.z = -timeSec * 0.5;
      cleanLedMat.emissiveIntensity = 0.2 + hard * 0.16;
      rightBeaconMat.emissiveIntensity = 0.35 + hard * (0.65 + 0.22 * Math.sin(timeSec * 4));

      return {
        glitchIntensity: f.exposedRibbonPulse * 0.25,
        magicDustIntensity: 0,
        stasisIntensity: f.hardenedDaclGlow * 0.3,
        brakeReleaseBoost: f.auditSweepProgress * 0.2,
      };
    },
    dispose: () => disposeStepScene(root, textures, materials),
  };
}
